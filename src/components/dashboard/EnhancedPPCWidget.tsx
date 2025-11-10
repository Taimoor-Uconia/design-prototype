import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { format } from 'date-fns';

interface Task {
  id: string;
  name: string;
  location: string;
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  owner: string;
  lead: string;
  teamMembers: string[];
  labels: string[];
  company: string;
  status: 'draft' | 'todo' | 'in_progress' | 'complete' | 'rejected';
  issues: {
    type: 'blocker' | 'constraint' | 'snag';
    description: string;
    status: string;
  }[];
}

interface EnhancedPPCWidgetProps {
  tasks: Task[];
  period: {
    start: Date;
    end: Date;
  };
}

const EnhancedPPCWidget = ({ tasks, period }: EnhancedPPCWidgetProps) => {
  // Calculate PPC and other metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'complete').length;
  const ppcValue = Math.round((completedTasks / totalTasks) * 100) || 0;

  // Calculate company-wise performance
  const companyPerformance = tasks.reduce((acc, task) => {
    if (!acc[task.company]) {
      acc[task.company] = { total: 0, completed: 0 };
    }
    acc[task.company].total++;
    if (task.status === 'complete') {
      acc[task.company].completed++;
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  // Calculate status distribution
  const statusDistribution = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusColors = {
    draft: 'bg-slate-200',
    todo: 'bg-blue-200',
    in_progress: 'bg-yellow-200',
    complete: 'bg-green-200',
    rejected: 'bg-red-200'
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Weekly Work Plan Performance</CardTitle>
            <CardDescription>
              {format(period.start, 'MMM dd')} - {format(period.end, 'MMM dd, yyyy')}
            </CardDescription>
          </div>
          <Badge variant={ppcValue >= 85 ? "default" : "destructive"}>
            PPC: {ppcValue}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <div style={{ width: 120, height: 120 }}>
                  <CircularProgressbar
                    value={ppcValue}
                    text={`${ppcValue}%`}
                    styles={buildStyles({
                      pathColor: ppcValue >= 85 ? '#22c55e' : '#ef4444',
                      textColor: '#1f2937',
                      trailColor: '#e5e7eb'
                    })}
                  />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {completedTasks} of {totalTasks} tasks completed
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Target</span>
                  <span className="text-sm text-muted-foreground">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Current</span>
                  <span className="text-sm text-muted-foreground">{ppcValue}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Variance</span>
                  <span className={`text-sm ${ppcValue >= 85 ? 'text-green-600' : 'text-red-600'}`}>
                    {ppcValue - 85}%
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="companies">
            <div className="space-y-2">
              {Object.entries(companyPerformance).map(([company, data]) => {
                const companyPPC = Math.round((data.completed / data.total) * 100);
                return (
                  <div key={company} className="flex items-center gap-2">
                    <div className="w-32 truncate" title={company}>
                      {company}
                    </div>
                    <div className="flex-1 h-2 bg-slate-200 rounded-full">
                      <div
                        className={`h-full rounded-full ${companyPPC >= 85 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${companyPPC}%` }}
                      />
                    </div>
                    <div className="w-16 text-right text-sm">
                      {companyPPC}%
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="status">
            <div className="space-y-2">
              {Object.entries(statusDistribution).map(([status, count]) => (
                <div key={status} className="flex items-center gap-2">
                  <div className="w-24 text-sm capitalize">
                    {status.replace('_', ' ')}
                  </div>
                  <div className="flex-1 h-6 bg-slate-100 rounded">
                    <div
                      className={`h-full ${statusColors[status as keyof typeof statusColors]} rounded`}
                      style={{ width: `${(count / totalTasks) * 100}%` }}
                    >
                      <span className="px-2 text-xs leading-6">
                        {count} tasks
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedPPCWidget;