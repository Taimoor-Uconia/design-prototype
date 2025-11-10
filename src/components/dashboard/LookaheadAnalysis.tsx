import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface LookaheadAnalysisProps {
  lookaheadData: {
    trade: string;
    weeks: {
      week: string;
      constraintCount: number;
      taskCount: number;
    }[];
  }[];
}

const LookaheadAnalysis = ({ lookaheadData }: LookaheadAnalysisProps) => {
  const [viewType, setViewType] = useState("constraints");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>6-Week Lookahead Analysis</CardTitle>
            <CardDescription>Constraint removal and task readiness by trade</CardDescription>
          </div>
          <Select value={viewType} onValueChange={setViewType}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="constraints">Constraints</SelectItem>
              <SelectItem value="readiness">Readiness %</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Trade</th>
                {lookaheadData[0]?.weeks.map((w) => (
                  <th key={w.week} className="p-2 text-center">{w.week}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lookaheadData.map((trade) => (
                <tr key={trade.trade}>
                  <td className="p-2 font-medium">{trade.trade}</td>
                  {trade.weeks.map((week) => {
                    const value = viewType === "constraints" 
                      ? week.constraintCount
                      : Math.round((week.taskCount - week.constraintCount) / week.taskCount * 100);
                    
                    const intensity = viewType === "constraints"
                      ? (week.constraintCount / 10) * 100 // Assuming max 10 constraints
                      : value;
                    
                    const bgColor = viewType === "constraints"
                      ? `hsl(var(--destructive) / ${intensity}%)`
                      : `hsl(var(--success) / ${intensity}%)`;
                    
                    return (
                      <td 
                        key={week.week}
                        className="p-2 text-center"
                        style={{ backgroundColor: bgColor }}
                      >
                        {viewType === "constraints" ? value : `${value}%`}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LookaheadAnalysis;