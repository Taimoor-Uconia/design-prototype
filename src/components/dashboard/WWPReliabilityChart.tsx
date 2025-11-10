import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface WWPReliabilityChartProps {
  weeklyData: {
    week: string;
    reliability: number;
    target: number;
  }[];
}

const WWPReliabilityChart = ({ weeklyData }: WWPReliabilityChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Work Plan Reliability</CardTitle>
        <CardDescription>Weekly PPC trend with target threshold</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
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
              <ReferenceLine
                y={85}
                stroke="hsl(var(--warning))"
                strokeDasharray="3 3"
                label={{ value: "Target (85%)", position: "right", fill: "hsl(var(--warning))" }}
              />
              <Line
                type="monotone"
                dataKey="reliability"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
                name="WWP Reliability"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WWPReliabilityChart;