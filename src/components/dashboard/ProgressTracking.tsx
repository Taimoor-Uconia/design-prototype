import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ComposedChart
} from "recharts";
import { format, parseISO, differenceInDays } from "date-fns";

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

interface ProgressTrackingProps {
  tasks: Task[];
  period: {
    start: Date;
    end: Date;
  };
}

const ProgressTracking = ({ tasks, period }: ProgressTrackingProps) => {
  const [viewBy, setViewBy] = useState<'status' | 'company' | 'location'>('status');

  // Calculate progress metrics
  const getProgressData = () => {
    const groupedTasks = tasks.reduce((acc, task) => {
      const key = task[viewBy];
      if (!acc[key]) {
        acc[key] = {
          planned: 0,
          actual: 0,
          onTime: 0,
          delayed: 0,
          total: 0
        };
      }

      acc[key].total++;
      
      // Calculate if task is on time
      if (task.actualEnd) {
        const isDelayed = new Date(task.actualEnd) > new Date(task.plannedEnd);
        acc[key][isDelayed ? 'delayed' : 'onTime']++;
      }

      // Calculate progress percentages
      const plannedDuration = differenceInDays(new Date(task.plannedEnd), new Date(task.plannedStart));
      const actualDuration = task.actualEnd 
        ? differenceInDays(new Date(task.actualEnd), new Date(task.actualStart || task.plannedStart))
        : 0;

      acc[key].planned += plannedDuration;
      acc[key].actual += actualDuration;

      return acc;
    }, {} as Record<string, {
      planned: number;
      actual: number;
      onTime: number;
      delayed: number;
      total: number;
    }>);

    return Object.entries(groupedTasks).map(([key, data]) => ({
      name: key,
      ...data,
      efficiency: Math.round((data.onTime / data.total) * 100) || 0
    }));
  };

  const progressData = getProgressData();

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Progress Tracking</CardTitle>
            <CardDescription>Task completion and efficiency analysis</CardDescription>
          </div>
          <Select value={viewBy} onValueChange={(value: 'status' | 'company' | 'location') => setViewBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="status">By Status</SelectItem>
              <SelectItem value="company">By Company</SelectItem>
              <SelectItem value="location">By Location</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="progress" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="progress">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="planned" fill="hsl(var(--primary))" name="Planned Duration" />
                  <Bar yAxisId="left" dataKey="actual" fill="hsl(var(--secondary))" name="Actual Duration" />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="efficiency"
                    stroke="hsl(var(--success))"
                    name="Efficiency %"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="efficiency">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="onTime" stackId="a" fill="hsl(var(--success))" name="On Time" />
                  <Bar dataKey="delayed" stackId="a" fill="hsl(var(--destructive))" name="Delayed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Average Delay</p>
                  <div className="text-2xl font-bold">
                    {Math.round(
                      tasks.reduce((acc, task) => {
                        if (task.actualEnd) {
                          const delay = differenceInDays(
                            new Date(task.actualEnd),
                            new Date(task.plannedEnd)
                          );
                          return acc + (delay > 0 ? delay : 0);
                        }
                        return acc;
                      }, 0) / tasks.filter(t => t.actualEnd).length || 0
                    )} days
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Completion Rate</p>
                  <div className="text-2xl font-bold">
                    {Math.round((tasks.filter(t => t.status === 'complete').length / tasks.length) * 100)}%
                  </div>
                </div>
              </div>

              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="planned"
                      stroke="hsl(var(--primary))"
                      name="Planned"
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="hsl(var(--secondary))"
                      name="Actual"
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

export default ProgressTracking;