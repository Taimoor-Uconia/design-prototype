import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ConstraintsChartProps {
  constraints: any[];
  tasks: any[];
}

const ConstraintsChart = ({ constraints, tasks }: ConstraintsChartProps) => {
  const [stratifyBy, setStratifyBy] = useState("location");

  const getChartData = () => {
    if (stratifyBy === "location") {
      const locationData = constraints.reduce((acc: any, constraint: any) => {
        const location = constraint.location || "Unassigned";
        acc[location] = (acc[location] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(locationData).map(([location, count]) => ({
        category: location,
        constraints: count,
        constraintFree: tasks.filter((t: any) => t.location === location && t.constraint_free).length,
      }));
    } else {
      const ownerData = constraints.reduce((acc: any, constraint: any) => {
        const owner = constraint.owner || "Unassigned";
        acc[owner] = (acc[owner] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(ownerData).map(([owner, count]) => ({
        category: owner.length > 15 ? owner.substring(0, 15) + "..." : owner,
        constraints: count,
        constraintFree: tasks.filter((t: any) => t.owner === owner && t.constraint_free).length,
      }));
    }
  };

  const chartData = getChartData();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Constraints Analysis</CardTitle>
            <CardDescription>Constraint distribution and constraint-free tasks</CardDescription>
          </div>
          <Select value={stratifyBy} onValueChange={setStratifyBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="location">By Location</SelectItem>
              <SelectItem value="owner">By Owner</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="category" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
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
              <Bar dataKey="constraints" fill="hsl(var(--destructive))" name="With Constraints" />
              <Bar dataKey="constraintFree" fill="hsl(var(--success))" name="Constraint Free" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConstraintsChart;
