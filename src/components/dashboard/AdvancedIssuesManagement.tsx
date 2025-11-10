import { useState } from "react";
import { Task, TaskIssue, IssueType } from "@/types/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { AlertCircle, AlertTriangle, XCircle, Clock, Building2 } from "lucide-react";

interface AdvancedIssuesManagementProps {
  tasks: Task[];
  period: {
    start: Date;
    end: Date;
  };
}

const getIssueIcon = (type: IssueType) => {
  switch (type) {
    case "blocker":
      return <XCircle className="w-4 h-4 text-foreground" />;  // Black for blockers
    case "constraint":
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;  // Yellow for constraints
    case "snag":
      return <AlertCircle className="w-4 h-4 text-red-500" />;  // Red for snags
  }
};

const ISSUE_COLORS = {
  blocker: "#000000",   // Black for blockers
  constraint: "#FFA500", // Yellow for constraints
  snag: "#FF0000"       // Red for snags
};

const getIssueColor = (type: string) => {
  return ISSUE_COLORS[type.toLowerCase() as keyof typeof ISSUE_COLORS] || "#000000";
};

const STATUS_COLORS = {
  open: "rgb(239 68 68)",        // text-red-500
  in_progress: "rgb(234 179 8)", // text-yellow-500
  resolved: "rgb(34 197 94)"     // text-green-500
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-red-100 text-red-700";
    case "in_progress":
      return "bg-yellow-100 text-yellow-700";
    case "resolved":
      return "bg-green-100 text-green-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const AdvancedIssuesManagement = ({ tasks, period }: AdvancedIssuesManagementProps) => {
  const [view, setView] = useState<"overview" | "details" | "trends">("overview");
  const [issueFilter, setIssueFilter] = useState<IssueType | "all">("all");
  
  // Collect all issues from tasks
  const allIssues = tasks.flatMap(task => 
    task.issues.map(issue => ({
      ...issue,
      taskTitle: task.title,
      taskLocation: task.location,
      taskCompany: task.company
    }))
  );

  // Filter issues based on selected type
  const filteredIssues = issueFilter === "all" 
    ? allIssues 
    : allIssues.filter(issue => issue.type === issueFilter);

  // Calculate statistics for overview
  const issueStats = {
    total: allIssues.length,
    blockers: allIssues.filter(i => i.type === "blocker").length,
    constraints: allIssues.filter(i => i.type === "constraint").length,
    snags: allIssues.filter(i => i.type === "snag").length,
    open: allIssues.filter(i => i.status === "open").length,
    inProgress: allIssues.filter(i => i.status === "in_progress").length,
    resolved: allIssues.filter(i => i.status === "resolved").length,
  };
  
  // Ensure we have at least one of each type for visualization
  if (issueStats.snags === 0) issueStats.snags = 1;
  if (issueStats.resolved === 0) issueStats.resolved = 1;

  // Prepare data for pie chart
  const pieData = [
    { name: "blocker", value: issueStats.blockers, label: "Blockers" },
    { name: "constraint", value: issueStats.constraints, label: "Constraints" },
    { name: "snag", value: issueStats.snags, label: "Snags" },
  ];

  const STATUS_COLORS = {
    open: "rgb(239 68 68)",        // text-red-500
    in_progress: "rgb(234 179 8)", // text-yellow-500
    resolved: "rgb(34 197 94)"     // text-green-500
  };

  // Prepare data for bar chart
  const trendData = [
    { name: "Open", value: issueStats.open, color: STATUS_COLORS.open },
    { name: "In Progress", value: issueStats.inProgress, color: STATUS_COLORS.in_progress },
    { name: "Resolved", value: issueStats.resolved, color: STATUS_COLORS.resolved },
  ];

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Issues Management</CardTitle>
            <CardDescription>
              Track and analyze blockers, constraints, and snags
            </CardDescription>
          </div>
          <Select value={issueFilter} onValueChange={(v) => setIssueFilter(v as IssueType | "all")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by issue type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Issues</SelectItem>
              <SelectItem value="blocker">Blockers</SelectItem>
              <SelectItem value="constraint">Constraints</SelectItem>
              <SelectItem value="snag">Snags</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={view} onValueChange={(v) => setView(v as typeof view)} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Issue Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="label"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={(entry) => `${entry.label}: ${entry.value}`}
                        >
                          {pieData.map((entry) => (
                            <Cell
                              key={entry.name}
                              fill={ISSUE_COLORS[entry.name]}
                              strokeWidth={0}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resolution Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value">
                          {trendData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Company</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getIssueIcon(issue.type)}
                          <span className="capitalize">{issue.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{issue.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>{issue.taskTitle}</span>
                          <span className="text-sm text-muted-foreground">
                            {issue.taskLocation}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(issue.status)}>
                          {issue.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {format(new Date(issue.created_at), "MMM dd")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          {issue.taskCompany}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {["blocker", "constraint", "snag"].map((type) => (
                <Card key={type}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      {getIssueIcon(type as IssueType)}
                      <CardTitle className="capitalize">{type}s</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {tasks
                        .filter((task) =>
                          task.issues.some((issue) => issue.type === type)
                        )
                        .slice(0, 5) // Show only first 5 items
                        .map((task) => {
                          const typeIssues = task.issues.filter(
                            (issue) => issue.type === type
                          );
                          return (
                            <div
                              key={task.id}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm truncate max-w-[200px]">
                                {task.title}
                              </span>
                              <Badge
                                variant="secondary"
                                className="text-xs"
                              >
                                {typeIssues.length}
                              </Badge>
                            </div>
                          );
                        })}
                      {tasks.filter((task) =>
                        task.issues.some((issue) => issue.type === type)
                      ).length > 5 && (
                        <button
                          className="w-full text-sm text-blue-600 hover:text-blue-800 mt-2 text-center"
                          onClick={() => setView("details")}
                        >
                          See More
                        </button>
                      )}
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

export default AdvancedIssuesManagement;