import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { Task, TeamMember } from "@/types/dashboard";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TeamPerformanceProps {
  tasks: Task[];
  period: {
    start: Date;
    end: Date;
  };
}

interface TeamMetrics {
  company: string;
  totalTasks: number;
  completedTasks: number;
  constraintFree: number;
  onSchedule: number;
  efficiency: number;
  qualityScore: number;
}

interface MemberMetrics {
  name: string;
  role: string;
  company: string;
  tasksAssigned: number;
  tasksCompleted: number;
  onSchedule: number;
  issuesResolved: number;
}

const TeamPerformanceDashboard = ({ tasks, period }: TeamPerformanceProps) => {
  // Calculate company-level metrics
  const companyMetrics: TeamMetrics[] = Object.values(
    tasks.reduce((acc: Record<string, TeamMetrics>, task) => {
      if (!acc[task.company]) {
        acc[task.company] = {
          company: task.company,
          totalTasks: 0,
          completedTasks: 0,
          constraintFree: 0,
          onSchedule: 0,
          efficiency: 0,
          qualityScore: 0,
        };
      }

      const metrics = acc[task.company];
      metrics.totalTasks++;
      if (task.status === "complete") metrics.completedTasks++;
      if (task.constraint_free) metrics.constraintFree++;
      if (task.actual_progress >= task.planned_progress) metrics.onSchedule++;
      
      // Update efficiency and quality scores
      metrics.efficiency = (metrics.completedTasks / metrics.totalTasks) * 100;
      metrics.qualityScore = (metrics.constraintFree / metrics.totalTasks) * 100;

      return acc;
    }, {})
  );

  // Calculate member-level metrics
  const memberMetrics: MemberMetrics[] = Object.values(
    tasks.flatMap(task => task.teamMembers).reduce((acc: Record<string, MemberMetrics>, member) => {
      if (!acc[member.id]) {
        acc[member.id] = {
          name: member.name,
          role: member.role,
          company: member.company,
          tasksAssigned: 0,
          tasksCompleted: 0,
          onSchedule: 0,
          issuesResolved: 0,
        };
      }

      const metrics = acc[member.id];
      metrics.tasksAssigned++;
      // Add other metrics calculations here

      return acc;
    }, {})
  );

  // Prepare data for radar chart
  const radarData = companyMetrics.map(metrics => ({
    company: metrics.company,
    Efficiency: Math.round(metrics.efficiency),
    Quality: Math.round(metrics.qualityScore),
    'On Schedule': Math.round((metrics.onSchedule / metrics.totalTasks) * 100),
    'Constraint Free': Math.round((metrics.constraintFree / metrics.totalTasks) * 100),
  }));

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Team Performance Analytics</CardTitle>
            <CardDescription>
              Performance metrics and workload distribution
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Company Overview</TabsTrigger>
            <TabsTrigger value="members">Team Members</TabsTrigger>
            <TabsTrigger value="analysis">Performance Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Company Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="company" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar
                          name="Efficiency"
                          dataKey="Efficiency"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.2}
                        />
                        <Radar
                          name="Quality"
                          dataKey="Quality"
                          stroke="hsl(var(--success))"
                          fill="hsl(var(--success))"
                          fillOpacity={0.2}
                        />
                        <Radar
                          name="On Schedule"
                          dataKey="On Schedule"
                          stroke="hsl(var(--warning))"
                          fill="hsl(var(--warning))"
                          fillOpacity={0.2}
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Task Completion Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={companyMetrics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="company" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          name="Total Tasks"
                          dataKey="totalTasks"
                          fill="hsl(var(--primary))"
                        />
                        <Bar
                          name="Completed Tasks"
                          dataKey="completedTasks"
                          fill="hsl(var(--success))"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="members">
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left">Team Member</th>
                    <th className="p-4 text-left">Role</th>
                    <th className="p-4 text-left">Company</th>
                    <th className="p-4 text-center">Tasks Assigned</th>
                    <th className="p-4 text-center">Completion Rate</th>
                    <th className="p-4 text-center">Schedule Adherence</th>
                  </tr>
                </thead>
                <tbody>
                  {memberMetrics.map((member, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-4">{member.name}</td>
                      <td className="p-4 text-muted-foreground">{member.role}</td>
                      <td className="p-4">{member.company}</td>
                      <td className="p-4 text-center">{member.tasksAssigned}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${(member.tasksCompleted / member.tasksAssigned) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm">
                            {Math.round((member.tasksCompleted / member.tasksAssigned) * 100)}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            member.onSchedule >= 80
                              ? "bg-green-100 text-green-700"
                              : member.onSchedule >= 50
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          )}
                        >
                          {member.onSchedule}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {companyMetrics.map((metrics) => (
                <Card key={metrics.company}>
                  <CardHeader>
                    <CardTitle>{metrics.company}</CardTitle>
                    <CardDescription>
                      {metrics.totalTasks} total tasks assigned
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Efficiency</span>
                          <span>{Math.round(metrics.efficiency)}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${metrics.efficiency}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Quality Score</span>
                          <span>{Math.round(metrics.qualityScore)}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-success"
                            style={{ width: `${metrics.qualityScore}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>On Schedule</span>
                          <span>
                            {Math.round((metrics.onSchedule / metrics.totalTasks) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-warning"
                            style={{
                              width: `${(metrics.onSchedule / metrics.totalTasks) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TeamPerformanceDashboard;