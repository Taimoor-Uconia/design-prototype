import { useState } from "react";
import { Task, TaskStatus } from "@/types/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Clock,
  Users,
  Tag,
  Building2,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

interface EnhancedTaskDetailsProps {
  tasks: Task[];
  period: {
    start: Date;
    end: Date;
  };
}

const getStatusColor = (status: TaskStatus) => {
  const colors = {
    draft: "bg-slate-200 text-slate-700",
    todo: "bg-blue-100 text-blue-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    complete: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };
  return colors[status];
};

const getPriorityColor = (priority: string) => {
  const colors = {
    low: "bg-blue-100 text-blue-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };
  return colors[priority as keyof typeof colors] || colors.medium;
};

const getProgressIndicator = (planned: number, actual: number) => {
  const variance = actual - planned;
  if (Math.abs(variance) < 5) return null;
  if (variance > 0) {
    return <ArrowUpRight className="w-4 h-4 text-green-500" />;
  }
  return <ArrowDownRight className="w-4 h-4 text-red-500" />;
};

const getIssueIcon = (type: string) => {
  switch (type) {
    case "blocker":
      return <XCircle className="w-4 h-4 text-foreground" />;
    case "constraint":
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case "snag":
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const EnhancedTaskDetails = ({ tasks, period }: EnhancedTaskDetailsProps) => {
  const [view, setView] = useState<"list" | "timeline" | "team">("list");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [showAll, setShowAll] = useState(false);

  const locations = Array.from(new Set(tasks.map((t) => t.location)));
  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== "all" && task.status !== statusFilter) return false;
    if (locationFilter !== "all" && task.location !== locationFilter) return false;
    return true;
  });
  
  const displayedTasks = showAll ? filteredTasks : filteredTasks.slice(0, 5);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Task Management Dashboard</CardTitle>
            <CardDescription>
              {format(period.start, "MMM dd")} - {format(period.end, "MMM dd, yyyy")}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as TaskStatus | "all")}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by location" />
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
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={view} onValueChange={(v) => setView(v as typeof view)} className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="team">Team Allocation</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Task</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Issues</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(task.planned_start), "MMM dd")} -{" "}
                            {format(new Date(task.planned_end), "MMM dd")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {task.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            {task.company}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="w-3 h-3" />
                            {task.teamMembers.length} members
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${task.actual_progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {task.actual_progress}%
                          </span>
                          {getProgressIndicator(task.planned_progress, task.actual_progress)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {task.issues.map((issue) => (
                            <span key={issue.id} title={issue.description}>
                              {getIssueIcon(issue.type)}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredTasks.length > 5 && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowAll(!showAll)}
                    className="w-[200px]"
                  >
                    {showAll ? "Show Less" : `See ${filteredTasks.length - 5} More Tasks`}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            {/* Timeline visualization will be added here */}
            <div className="h-[400px] flex items-center justify-center border rounded-lg">
              Timeline visualization coming soon...
            </div>
          </TabsContent>

          <TabsContent value="team">
            {/* Team allocation visualization will be added here */}
            <div className="h-[400px] flex items-center justify-center border rounded-lg">
              Team allocation visualization coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedTaskDetails;