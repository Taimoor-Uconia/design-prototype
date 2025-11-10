import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface VarianceChartProps {
  variances: any[];
}

const VarianceChart = ({ variances }: VarianceChartProps) => {
  // Group variances by reason
  const reasonCounts = variances.reduce((acc: any, variance: any) => {
    acc[variance.reason] = (acc[variance.reason] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(reasonCounts).map(([reason, count]) => ({
    reason: reason.length > 20 ? reason.substring(0, 20) + "..." : reason,
    count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Variance Reasons</CardTitle>
        <CardDescription>Common reasons for task delays</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="reason" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="hsl(var(--warning))" name="Occurrences" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default VarianceChart;
