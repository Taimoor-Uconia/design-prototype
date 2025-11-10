import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ProgressChartProps {
  tasks: any[];
  progressLogs: any[];
}

const ProgressChart = ({ tasks }: ProgressChartProps) => {
  // Calculate average planned vs actual by location
  const locationData = tasks.reduce((acc: any, task: any) => {
    const location = task.location || "Unassigned";
    if (!acc[location]) {
      acc[location] = { planned: [], actual: [] };
    }
    acc[location].planned.push(task.planned_progress);
    acc[location].actual.push(task.actual_progress);
    return acc;
  }, {});

  const chartData = Object.entries(locationData).map(([location, data]: [string, any]) => ({
    location: location.length > 15 ? location.substring(0, 15) + "..." : location,
    planned: Math.round(data.planned.reduce((sum: number, val: number) => sum + val, 0) / data.planned.length),
    actual: Math.round(data.actual.reduce((sum: number, val: number) => sum + val, 0) / data.actual.length),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planned vs Actual Progress</CardTitle>
        <CardDescription>Schedule performance by location</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="location" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" unit="%" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="planned" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Planned Progress"
                dot={{ fill: "hsl(var(--primary))" }}
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="hsl(var(--success))" 
                strokeWidth={2}
                name="Actual Progress"
                dot={{ fill: "hsl(var(--success))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
