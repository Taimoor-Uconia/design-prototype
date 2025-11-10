import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Line, LineChart, ComposedChart
} from "recharts";

interface Issue {
  type: 'blocker' | 'constraint' | 'snag';
  description: string;
  status: string;
}

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
  issues: Issue[];
}

interface ConstraintsManagementProps {
  tasks: Task[];
  period: {
    start: Date;
    end: Date;
  };
}

const ConstraintsManagement = ({ tasks, period }: ConstraintsManagementProps) => {
  // Calculate constraint metrics
  const totalConstraints = tasks.reduce((sum, task) => 
    sum + task.issues.filter(i => i.type === 'constraint').length, 0);
  
  const constraintsByStatus = tasks.reduce((acc, task) => {
    task.issues
      .filter(i => i.type === 'constraint')
      .forEach(issue => {
        acc[issue.status] = (acc[issue.status] || 0) + 1;
      });
    return acc;
  }, {} as Record<string, number>);

  const constraintsByLocation = tasks.reduce((acc, task) => {
    task.issues
      .filter(i => i.type === 'constraint')
      .forEach(() => {
        acc[task.location] = (acc[task.location] || 0) + 1;
      });
    return acc;
  }, {} as Record<string, number>);

  const trendData = Object.entries(constraintsByStatus).map(([status, count]) => ({
    status,
    count,
    rate: Math.round((count / totalConstraints) * 100)
  }));

  const locationData = Object.entries(constraintsByLocation).map(([location, count]) => ({
    location,
    constraints: count,
    impactedTasks: tasks.filter(t => 
      t.location === location && 
      t.issues.some(i => i.type === 'constraint')
    ).length
  }));

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Constraints Management</CardTitle>
            <CardDescription>Tracking and analysis of project constraints</CardDescription>
          </div>
          <Badge variant="outline">
            {totalConstraints} Active Constraints
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="trend">Trend</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis yAxisId="left" orientation="left" stroke="#666" />
                  <YAxis yAxisId="right" orientation="right" stroke="#666" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="count" fill="hsl(var(--primary))" name="Count" />
                  <Bar yAxisId="right" dataKey="rate" fill="hsl(var(--secondary))" name="Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="locations">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={locationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="constraints" fill="hsl(var(--primary))" name="Constraints" />
                  <Line yAxisId="right" type="monotone" dataKey="impactedTasks" stroke="hsl(var(--destructive))" name="Impacted Tasks" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="trend">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Resolution Rate</p>
                  <div className="text-2xl font-bold">
                    {Math.round((constraintsByStatus['resolved'] || 0) / totalConstraints * 100)}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {constraintsByStatus['resolved'] || 0} of {totalConstraints} resolved
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Critical Constraints</p>
                  <div className="text-2xl font-bold text-destructive">
                    {tasks.filter(t => 
                      t.issues.some(i => i.type === 'constraint' && i.status === 'critical')
                    ).length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Requiring immediate attention
                  </p>
                </div>
              </div>
              
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ConstraintsManagement;