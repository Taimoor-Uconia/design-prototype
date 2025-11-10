import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface PercentCompleteChartProps {
  data: any;
}

const PercentCompleteChart = ({ data }: PercentCompleteChartProps) => {
  const chartData = [
    { name: "Completed", value: data?.completed_tasks || 0, color: "hsl(var(--success))" },
    { name: "Remaining", value: (data?.total_tasks || 0) - (data?.completed_tasks || 0), color: "hsl(var(--muted))" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Work Plan Completion</CardTitle>
        <CardDescription>Progress overview for current WWP</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PercentCompleteChart;
