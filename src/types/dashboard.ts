import { LucideIcon } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  color?: 'primary' | 'success' | 'warning' | 'destructive';
}

export interface Issue {
  type: 'blocker' | 'constraint' | 'snag';
  description: string;
  status: string;
}

export interface Task {
  id: string;
  wwp_id: string;
  title: string;
  location: string;
  owner: string;
  constraint_free: boolean;
  planned_progress: number;
  actual_progress: number;
}

export interface Constraint {
  type: string;
  status: 'open' | 'resolved';
  dueDate: string;
  owner: string;
}

export interface Variance {
  type: string;
  impact: number;
  date: string;
}

export interface WWPData {
  id: string;
  total_tasks: number;
  completed_tasks: number;
  percent_complete: number;
  week_start: string;
  week_end: string;
}

export interface DashboardData {
  wwp: WWPData;
  tasks: Task[];
  constraints: Constraint[];
  variances: Variance[];
  progressLogs: any[]; // TODO: Define proper type if needed
}

// Widget-specific interfaces
export interface PPCData {
  value: number;
  target: number;
  companyBreakdown: Record<string, number>;
  statusDistribution: Record<string, number>;
}

export interface VarianceData {
  issuesByType: Record<string, number>;
  issuesByLocation: Record<string, number>;
  issuesByCompany: Record<string, number>;
  totalIssues: number;
}

export interface ConstraintData {
  total: number;
  resolved: number;
  critical: number;
  byLocation: Record<string, number>;
  byStatus: Record<string, number>;
}

export interface ProgressData {
  planned: number;
  actual: number;
  efficiency: number;
  delayedTasks: number;
  completionRate: number;
  timelineData: Array<{
    date: string;
    planned: number;
    actual: number;
  }>;
}