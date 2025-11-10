import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { Task, TaskIssue } from "@/types/dashboard";
import { format } from "date-fns";
import { AlertCircle, AlertTriangle, XCircle, MapPin } from "lucide-react";

interface LocationProgressProps {
  tasks: Task[];
  period: {
    start: Date;
    end: Date;
  };
}

interface LocationMetrics {
  location: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  blockers: number;
  constraints: number;
  snags: number;
  plannedProgress: number;
  actualProgress: number;
}

const LocationProgressVisualization = ({ tasks, period }: LocationProgressProps) => {
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  // Calculate location-based metrics
  const locationMetrics = Object.values(
    tasks.reduce((acc: Record<string, LocationMetrics>, task) => {
      if (!acc[task.location]) {
        acc[task.location] = {
          location: task.location,
          totalTasks: 0,
          completedTasks: 0,
          inProgressTasks: 0,
          blockers: 0,
          constraints: 0,
          snags: 0,
          plannedProgress: 0,
          actualProgress: 0,
        };
      }

      const metrics = acc[task.location];
      metrics.totalTasks++;
      if (task.status === "complete") metrics.completedTasks++;
      if (task.status === "in_progress") metrics.inProgressTasks++;
      metrics.plannedProgress += task.planned_progress;
      metrics.actualProgress += task.actual_progress;

      task.issues.forEach((issue) => {
        switch (issue.type) {
          case "blocker":
            metrics.blockers++;
            break;
          case "constraint":
            metrics.constraints++;
            break;
          case "snag":
            metrics.snags++;
            break;
        }
      });

      return acc;
    }, {})
  ).map(metrics => ({
    ...metrics,
    plannedProgress: Math.round(metrics.plannedProgress / metrics.totalTasks),
    actualProgress: Math.round(metrics.actualProgress / metrics.totalTasks),
  }));

  const locations = locationMetrics.map(m => m.location);
  const filteredTasks = selectedLocation === "all" 
    ? tasks 
    : tasks.filter(t => t.location === selectedLocation);

  // Prepare data for the progress timeline
  const timelineData = filteredTasks.reduce((acc: Record<string, any>, task) => {
    const startDate = format(new Date(task.planned_start), "MMM dd");
    if (!acc[startDate]) {
      acc[startDate] = {
        date: startDate,
        planned: 0,
        actual: 0,
        tasks: 0,
      };
    }
    acc[startDate].planned += task.planned_progress;
    acc[startDate].actual += task.actual_progress;
    acc[startDate].tasks++;
    return acc;
  }, {});

  const progressData = Object.values(timelineData).map(data => ({
    ...data,
    planned: Math.round(data.planned / data.tasks),
    actual: Math.round(data.actual / data.tasks),
  }));

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Location-based Progress</CardTitle>
            <CardDescription>
              Track progress and issues across different locations
            </CardDescription>
          </div>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress Timeline</TabsTrigger>
            <TabsTrigger value="issues">Issues Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4">
              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {locationMetrics.map((metrics) => (
                  <Card key={metrics.location}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-medium">
                          {metrics.location}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tasks</span>
                          <span>{metrics.totalTasks}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Complete</span>
                          <span>{Math.round((metrics.completedTasks / metrics.totalTasks) * 100)}%</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span>{metrics.actualProgress}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${metrics.actualProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Progress Comparison Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Progress by Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={locationMetrics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="location" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          name="Planned Progress"
                          dataKey="plannedProgress"
                          fill="hsl(var(--primary))"
                        />
                        <Bar
                          name="Actual Progress"
                          dataKey="actualProgress"
                          fill="hsl(var(--success))"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Progress Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        name="Planned Progress"
                        dataKey="planned"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        name="Actual Progress"
                        dataKey="actual"
                        stroke="hsl(var(--success))"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues">
            <div className="grid gap-4 md:grid-cols-3">
              {locationMetrics.map((metrics) => (
                <Card key={metrics.location}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        {metrics.location}
                      </CardTitle>
                      <Badge variant="outline">
                        {metrics.blockers + metrics.constraints + metrics.snags} issues
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-destructive" />
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Blockers</span>
                            <span>{metrics.blockers}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-destructive"
                              style={{
                                width: `${(metrics.blockers / metrics.totalTasks) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-warning" />
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Constraints</span>
                            <span>{metrics.constraints}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-warning"
                              style={{
                                width: `${(metrics.constraints / metrics.totalTasks) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Snags</span>
                            <span>{metrics.snags}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-500"
                              style={{
                                width: `${(metrics.snags / metrics.totalTasks) * 100}%`,
                              }}
                            />
                          </div>
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

export default LocationProgressVisualization;