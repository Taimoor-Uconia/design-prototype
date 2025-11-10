import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface TaskMaturityChartProps {
  maturityData: {
    week: string;
    sound: number;
    ready: number;
    total: number;
  }[];
}

const TaskMaturityChart = ({ maturityData }: TaskMaturityChartProps) => {
  const calculatePercentages = (data: any[]) => {
    return data.map(week => ({
      week: week.week,
      soundness: Math.round((week.sound / week.total) * 100),
      readiness: Math.round((week.ready / week.total) * 100)
    }));
  };

  const chartData = calculatePercentages(maturityData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Maturity Index</CardTitle>
        <CardDescription>Task soundness and readiness by week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="week"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`${value}%`]}
              />
              <Legend />
              <Bar
                dataKey="soundness"
                fill="hsl(var(--success))"
                name="Task Soundness"
              />
              <Bar
                dataKey="readiness"
                fill="hsl(var(--info))"
                name="Task Readiness"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskMaturityChart;