import { Task } from "@/types/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState } from "react";

interface ConstraintAnalysisProps {
  tasks: Task[];
}

const ConstraintAnalysis = ({ tasks }: ConstraintAnalysisProps) => {
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  // Get unique locations
  const locations = Array.from(new Set(tasks.map(task => task.location)));

  // Filter tasks by selected location
  const filteredTasks = selectedLocation === "all" 
    ? tasks
    : tasks.filter(task => task.location === selectedLocation);

  // Calculate constraint distribution
  const constraintData = [
    {
      name: selectedLocation === "all" ? "Overall" : selectedLocation,
      "Constraint Free": filteredTasks.filter(task => 
        !task.issues.some(issue => issue.type === "constraint")
      ).length,
      "With Constraints": filteredTasks.filter(task => 
        task.issues.some(issue => issue.type === "constraint")
      ).length
    }
  ];

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Constraints Analysis</CardTitle>
            <CardDescription>Constraint distribution and constraint-free tasks</CardDescription>
          </div>
          <Select
            value={selectedLocation}
            onValueChange={setSelectedLocation}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(location => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={constraintData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} />
              <XAxis type="number" domain={[0, 'auto']} />
              <YAxis type="category" dataKey="name" />
              <Legend />
              <Bar 
                dataKey="Constraint Free" 
                fill="#22c55e" // Green color for constraint-free
                stackId="stack"
              />
              <Bar 
                dataKey="With Constraints" 
                fill="#ef4444" // Red color for constraints
                stackId="stack"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConstraintAnalysis;