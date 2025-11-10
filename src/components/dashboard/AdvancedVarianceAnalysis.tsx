import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

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

interface AdvancedVarianceAnalysisProps {
  tasks: Task[];
  period: {
    start: Date;
    end: Date;
  };
}

const AdvancedVarianceAnalysis = ({ tasks, period }: AdvancedVarianceAnalysisProps) => {
  const [groupBy, setGroupBy] = useState<'type' | 'location' | 'company'>('type');

  const getIssueAnalysis = () => {
    const analysis = tasks.reduce((acc, task) => {
      task.issues.forEach(issue => {
        const key = groupBy === 'type' ? issue.type :
                   groupBy === 'location' ? task.location :
                   task.company;
        
        if (!acc[key]) {
          acc[key] = {
            blockers: 0,
            constraints: 0,
            snags: 0,
            total: 0
          };
        }
        
        acc[key][issue.type + 's']++;
        acc[key].total++;
      });
      return acc;
    }, {} as Record<string, { blockers: number; constraints: number; snags: number; total: number }>);

    return Object.entries(analysis).map(([key, data]) => ({
      name: key,
      ...data
    }));
  };

  const colors = {
    blockers: '#ef4444',    // Red
    constraints: '#f59e0b',  // Amber
    snags: '#3b82f6'        // Blue
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Variance Analysis</CardTitle>
            <CardDescription>Analysis of issues and blockers</CardDescription>
          </div>
          <Select value={groupBy} onValueChange={(value: 'type' | 'location' | 'company') => setGroupBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Group by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="type">By Issue Type</SelectItem>
              <SelectItem value="location">By Location</SelectItem>
              <SelectItem value="company">By Company</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="chart">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getIssueAnalysis()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="blockers" stackId="a" name="Blockers">
                    {getIssueAnalysis().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors.blockers} />
                    ))}
                  </Bar>
                  <Bar dataKey="constraints" stackId="a" name="Constraints">
                    {getIssueAnalysis().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors.constraints} />
                    ))}
                  </Bar>
                  <Bar dataKey="snags" stackId="a" name="Snags">
                    {getIssueAnalysis().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors.snags} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="summary">
            <div className="space-y-4">
              {getIssueAnalysis().map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{item.name}</h4>
                    <span className="text-sm text-muted-foreground">
                      Total: {item.total}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(colors).map(([key, color]) => (
                      <div key={key} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-sm capitalize">{key}:</span>
                        <span className="text-sm text-muted-foreground">
                          {item[key as keyof typeof colors]}
                        </span>
                      </div>
                    ))}
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

export default AdvancedVarianceAnalysis;