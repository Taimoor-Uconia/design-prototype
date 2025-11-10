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

export type TaskStatus = 'draft' | 'todo' | 'in_progress' | 'complete' | 'rejected';
export type IssueType = 'blocker' | 'constraint' | 'snag';

export interface TaskIssue {
  id: string;
  type: IssueType;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
  resolved_at?: string;
  assigned_to?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  company: string;
}

export interface Task {
  id: string;
  wwp_id: string;
  title: string;
  description: string;
  location: string;
  owner: string;           // Company owning the task
  lead: string;            // Team member responsible
  teamMembers: TeamMember[];
  labels: string[];        // Tags for categorization
  company: string;
  planned_start: string;   // ISO date string
  planned_end: string;     // ISO date string
  actual_start?: string;   // ISO date string
  actual_end?: string;     // ISO date string
  status: TaskStatus;
  issues: TaskIssue[];
  constraint_free: boolean;
  planned_progress: number;
  actual_progress: number;
  priority: 'low' | 'medium' | 'high';
  dependencies: string[];  // IDs of tasks this task depends on
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