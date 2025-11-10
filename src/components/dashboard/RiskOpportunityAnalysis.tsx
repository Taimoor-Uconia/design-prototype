import { useState } from "react";
import { Task } from "@/types/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format, differenceInDays, parseISO } from "date-fns";
import { AlertTriangle, ArrowUpCircle, ArrowDownCircle, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskOpportunityAnalysisProps {
  tasks: Task[];
  period: {
    start: Date;
    end: Date;
  };
}

interface RiskOpportunity {
  taskId: string;
  taskTitle: string;
  type: 'risk' | 'opportunity';
  daysChange: number;
  originalEnd: string;
  newEnd: string;
  impact: 'high' | 'medium' | 'low';
}

const calculateImpact = (daysChange: number): 'high' | 'medium' | 'low' => {
  const absDays = Math.abs(daysChange);
  if (absDays >= 7) return 'high';
  if (absDays >= 3) return 'medium';
  return 'low';
};

const getImpactColor = (impact: 'high' | 'medium' | 'low', type: 'risk' | 'opportunity') => {
  if (type === 'risk') {
    return {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-orange-100 text-orange-700',
      low: 'bg-yellow-100 text-yellow-700',
    }[impact];
  }
  return {
    high: 'bg-green-100 text-green-700',
    medium: 'bg-emerald-100 text-emerald-700',
    low: 'bg-teal-100 text-teal-700',
  }[impact];
};

const RiskOpportunityAnalysis = ({ tasks, period }: RiskOpportunityAnalysisProps) => {
  // Analyze tasks for risks and opportunities
  const risksAndOpportunities = tasks
    .filter(task => task.planned_end && task.actual_end)
    .map(task => {
      const daysChange = differenceInDays(
        parseISO(task.actual_end!),
        parseISO(task.planned_end)
      );
      
      if (daysChange === 0) return null;

      return {
        taskId: task.id,
        taskTitle: task.title,
        type: daysChange > 0 ? 'risk' : 'opportunity',
        daysChange: Math.abs(daysChange),
        originalEnd: task.planned_end,
        newEnd: task.actual_end!,
        impact: calculateImpact(daysChange)
      } as RiskOpportunity;
    })
    .filter((item): item is RiskOpportunity => item !== null)
    .sort((a, b) => b.daysChange - a.daysChange);

  const totalRisks = risksAndOpportunities.filter(item => item.type === 'risk').length;
  const totalOpportunities = risksAndOpportunities.filter(item => item.type === 'opportunity').length;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Risk & Opportunity Analysis</CardTitle>
            <CardDescription>Schedule variance impact analysis</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-red-50">
              {totalRisks} Risks
            </Badge>
            <Badge variant="outline" className="bg-green-50">
              {totalOpportunities} Opportunities
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Initial preview of 5 items */}
        <div className="grid gap-6 md:grid-cols-2 mb-4">
          {/* Risks Preview */}
          <Card className="h-[400px]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <CardTitle className="text-base">Top Risks</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {risksAndOpportunities
                  .filter(item => item.type === 'risk')
                  .slice(0, 5)
                  .map((item) => (
                    <div key={item.taskId} className="flex items-center justify-between border-b pb-2">
                      <div className="flex flex-col">
                        <span className="font-medium truncate max-w-[200px]">{item.taskTitle}</span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <CalendarDays className="w-3 h-3" />
                          <span>+{item.daysChange} days</span>
                        </div>
                      </div>
                      <Badge className={cn(getImpactColor(item.impact, 'risk'))}>
                        {item.impact}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Opportunities Preview */}
          <Card className="h-[400px]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ArrowUpCircle className="w-4 h-4 text-green-500" />
                <CardTitle className="text-base">Top Opportunities</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {risksAndOpportunities
                  .filter(item => item.type === 'opportunity')
                  .slice(0, 5)
                  .map((item) => (
                    <div key={item.taskId} className="flex items-center justify-between border-b pb-2">
                      <div className="flex flex-col">
                        <span className="font-medium truncate max-w-[200px]">{item.taskTitle}</span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <CalendarDays className="w-3 h-3" />
                          <span>-{item.daysChange} days</span>
                        </div>
                      </div>
                      <Badge className={cn(getImpactColor(item.impact, 'opportunity'))}>
                        {item.impact}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* See More Dialog */}
        {risksAndOpportunities.length > 5 && (
          <Dialog>
            <DialogTrigger asChild>
              <button className="w-full text-sm text-blue-600 hover:text-blue-800 mt-2">
                See All Items
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>All Risks & Opportunities</DialogTitle>
              </DialogHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Impact</TableHead>
                    <TableHead>Date Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {risksAndOpportunities.map((item) => (
                    <TableRow key={item.taskId}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.type === 'risk' ? (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          ) : (
                            <ArrowUpCircle className="w-4 h-4 text-green-500" />
                          )}
                          <span className="capitalize">{item.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate">{item.taskTitle}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(getImpactColor(item.impact, item.type))}>
                          {item.impact}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm">
                            <CalendarDays className="w-3 h-3 text-muted-foreground" />
                            <span className={cn(
                              "font-medium",
                              item.type === 'risk' ? "text-red-600" : "text-green-600"
                            )}>
                              {item.type === 'risk' ? '+' : '-'}{item.daysChange} days
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(parseISO(item.originalEnd), "MMM dd")} →{" "}
                            {format(parseISO(item.newEnd), "MMM dd")}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskOpportunityAnalysis;