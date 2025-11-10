import { useState, useEffect } from "react";
import { DashboardData, Task, TaskStatus } from "@/types/dashboard";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Calendar, TrendingUp, AlertCircle, CheckCircle2, BarChart3 } from "lucide-react";
import { format, startOfWeek, endOfWeek, subWeeks } from "date-fns";
import {
  wwpReliabilityData,
  taskMaturityData,
  lookaheadData,
  constraintTypes,
  currentWeekData,
  currentTasks,
  currentConstraints,
  currentVariances,
  currentProgressLogs
} from "@/lib/sampleData";
import { toast } from "sonner";
import MetricCard from "@/components/dashboard/MetricCard";
import PercentCompleteChart from "@/components/dashboard/PercentCompleteChart";
import VarianceChart from "@/components/dashboard/VarianceChart";
import ConstraintsChart from "@/components/dashboard/ConstraintsChart";
import ProgressChart from "@/components/dashboard/ProgressChart";
import EnhancedTaskDetails from "@/components/dashboard/EnhancedTaskDetails";
import TeamPerformanceDashboard from "@/components/dashboard/TeamPerformanceDashboard";
import AdvancedIssuesManagement from "@/components/dashboard/AdvancedIssuesManagement";
import LocationProgressVisualization from "@/components/dashboard/LocationProgressVisualization";
import RiskOpportunityAnalysis from "@/components/dashboard/RiskOpportunityAnalysis";
import ConstraintAnalysis from "@/components/dashboard/ConstraintAnalysis";

const Dashboard = () => {
  const [selectedWeek, setSelectedWeek] = useState("current");
  const [weeklyData, setWeeklyData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const getCurrentWeekDates = () => {
    const now = new Date();
    const start = startOfWeek(now, { weekStartsOn: 1 });
    const end = endOfWeek(now, { weekStartsOn: 1 });
    return { start, end };
  };

  const getWeekDates = (offset: number = 0) => {
    const now = new Date();
    const targetDate = subWeeks(now, offset);
    const start = startOfWeek(targetDate, { weekStartsOn: 1 });
    const end = endOfWeek(targetDate, { weekStartsOn: 1 });
    return { start, end };
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedWeek]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const weekOffset = selectedWeek === "current" ? 0 : parseInt(selectedWeek);
      const { start, end } = getWeekDates(weekOffset);

      // For current week, always use sample data
      if (selectedWeek === "current") {
        setWeeklyData({
          wwp: currentWeekData,
          tasks: currentTasks,
          constraints: currentConstraints,
          variances: currentVariances,
          progressLogs: currentProgressLogs
        });
        setLoading(false);
        return;
      }

      // For other weeks, try Supabase first
      const { data: wwpData, error: wwpError } = await supabase
        .from("weekly_work_plans")
        .select("*")
        .gte("week_start", format(start, "yyyy-MM-dd"))
        .lte("week_end", format(end, "yyyy-MM-dd"))
        .single();

      if (wwpError && wwpError.code !== "PGRST116") throw wwpError;

      // Fetch tasks
      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select("*")
        .eq("wwp_id", wwpData?.id || "");

      if (tasksError) throw tasksError;

      // Fetch constraints
      const { data: constraints, error: constraintsError } = await supabase
        .from("constraints")
        .select("*")
        .in("task_id", tasks?.map((t) => t.id) || []);

      if (constraintsError) throw constraintsError;

      // Fetch variances
      const { data: variances, error: variancesError } = await supabase
        .from("variances")
        .select("*")
        .eq("wwp_id", wwpData?.id || "");

      if (variancesError) throw variancesError;

      // Fetch progress logs
      const { data: progressLogs, error: progressError } = await supabase
        .from("progress_logs")
        .select("*")
        .eq("wwp_id", wwpData?.id || "");

      if (progressError) throw progressError;

      // Use sample data as fallback
      setWeeklyData({
        wwp: wwpData ? {
          id: wwpData.id,
          total_tasks: wwpData.total_tasks,
          completed_tasks: wwpData.completed_tasks,
          percent_complete: wwpData.percent_complete,
          week_start: wwpData.week_start,
          week_end: wwpData.week_end
        } : currentWeekData,
        tasks: tasks?.map(t => ({
          id: t.id,
          wwp_id: t.wwp_id,
          title: t.title,
          description: `Task ${t.id} at ${t.location}`,
          location: t.location,
          owner: t.owner,
          lead: t.owner,
          teamMembers: [], // Will be populated through a separate query if needed
          labels: [t.location],
          company: t.owner,
          planned_start: format(start, 'yyyy-MM-dd'),
          planned_end: format(end, 'yyyy-MM-dd'),
          actual_start: t.created_at,
          actual_end: undefined,
          status: t.status as TaskStatus,
          issues: [], // Will be populated through a separate query if needed
          constraint_free: t.constraint_free,
          planned_progress: t.planned_progress || 0,
          actual_progress: t.actual_progress || 0,
          priority: 'medium' as const,
          dependencies: []
        } as Task)) || currentTasks,
        constraints: constraints?.map(c => ({
          type: c.description,
          status: c.status as 'open' | 'resolved',
          dueDate: c.resolved_at || format(new Date(), 'yyyy-MM-dd'),
          owner: c.owner
        })) || currentConstraints,
        variances: variances?.map(v => ({
          type: v.reason,
          impact: parseInt(v.impact || '0'),
          date: v.logged_at
        })) || currentVariances,
        progressLogs: progressLogs || currentProgressLogs
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    toast.success("Dashboard exported successfully");
  };

  const { start, end } = selectedWeek === "current" 
    ? getCurrentWeekDates() 
    : getWeekDates(parseInt(selectedWeek));

  const constraintFreeCount = weeklyData?.tasks.filter((t: any) => t.constraint_free).length || 0;
  const totalTasks = weeklyData?.tasks.length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="w-full max-w-none px-4 md:px-6 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">LPS Dashboard</h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                {format(start, "MMM dd")} - {format(end, "MMM dd, yyyy")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select week" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Week</SelectItem>
                  <SelectItem value="1">Last Week</SelectItem>
                  <SelectItem value="2">2 Weeks Ago</SelectItem>
                  <SelectItem value="3">3 Weeks Ago</SelectItem>
                  <SelectItem value="4">4 Weeks Ago</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExport} className="w-full sm:w-auto bg-background border hover:bg-accent">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-none px-4 md:px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading dashboard...</div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <MetricCard
                title="Plan Complete"
                value={`${weeklyData?.wwp.percent_complete || 0}%`}
                subtitle={`${weeklyData?.wwp.completed_tasks || 0} of ${weeklyData?.wwp.total_tasks || 0} tasks`}
                icon={CheckCircle2}
                trend={weeklyData?.wwp.percent_complete >= 70 ? "up" : "down"}
                color="success"
              />
              <MetricCard
                title="Variances Logged"
                value={weeklyData?.variances.length || 0}
                subtitle="Reasons documented"
                icon={AlertCircle}
                color="warning"
              />
              <MetricCard
                title="Open Constraints"
                value={weeklyData?.constraints.filter((c: any) => c.status === "open").length || 0}
                subtitle={`${constraintFreeCount} constraint-free tasks`}
                icon={BarChart3}
                trend={constraintFreeCount > totalTasks / 2 ? "up" : "down"}
                color="destructive"
              />
              <MetricCard
                title="Progress Tracking"
                value={`${Math.round((weeklyData?.tasks.reduce((sum: number, t: any) => sum + t.actual_progress, 0) / totalTasks) || 0)}%`}
                subtitle="Average actual progress"
                icon={TrendingUp}
                color="primary"
              />
            </div>

            {/* Team Performance and Issues Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <TeamPerformanceDashboard 
                tasks={weeklyData?.tasks || []} 
                period={{ start, end }}
              />
              <AdvancedIssuesManagement 
                tasks={weeklyData?.tasks || []}
                period={{ start, end }}
              />
            </div>

            {/* Location Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 md:gap-6">
              <LocationProgressVisualization 
                tasks={weeklyData?.tasks || []}
                period={{ start, end }}
              />
            </div>

            {/* Constraints and Risk Analysis */}
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              <ConstraintAnalysis tasks={weeklyData?.tasks || []} />
              <RiskOpportunityAnalysis 
                tasks={weeklyData?.tasks || []}
                period={{ start, end }}
              />
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-6">
              <ProgressChart 
                tasks={weeklyData?.tasks || []} 
                progressLogs={weeklyData?.progressLogs || []} 
              />
              <VarianceChart 
                variances={weeklyData?.variances || []} 
              />
            </div>

            {/* Task Management Dashboard */}
            <div className="mt-8">
              <EnhancedTaskDetails 
                tasks={weeklyData?.tasks || []}
                period={{ start, end }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
