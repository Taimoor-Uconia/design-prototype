import { subWeeks, format, addWeeks } from 'date-fns';
import { 
  Task,
  Constraint,
  Variance,
  WWPData 
} from '@/types/dashboard';

// Helper to generate week labels
const getWeekLabel = (weeksAgo: number) => {
  const date = subWeeks(new Date('2025-11-10'), weeksAgo);
  return format(date, 'MMM dd');
};

// Helper to generate dates
const getWeekDate = (weeksAgo: number) => {
  return format(subWeeks(new Date('2025-11-10'), weeksAgo), 'yyyy-MM-dd');
};

// Current week's data (November 10, 2025)
export const currentWeekData: WWPData = {
  id: 'wwp-2025-w46',
  total_tasks: 45,
  completed_tasks: 38,
  percent_complete: 84,
  week_start: '2025-11-10',
  week_end: '2025-11-16'
};

// WWP Reliability Data (last 8 weeks)
export const wwpReliabilityData = Array.from({ length: 8 }, (_, i) => ({
  week: getWeekLabel(7 - i),
  reliability: Math.round(75 + Math.random() * 15), // Random between 75-90%
  target: 85
}));

// Task Maturity Data (6-week lookahead)
export const taskMaturityData = Array.from({ length: 6 }, (_, i) => {
  const total = Math.round(40 + Math.random() * 20); // 40-60 tasks
  const sound = Math.round(total * (0.75 + Math.random() * 0.2)); // 75-95% sound
  const ready = Math.round(sound * (0.85 + Math.random() * 0.1)); // 85-95% of sound tasks are ready
  return {
    week: getWeekLabel(i),
    sound,
    ready,
    total
  };
});

// Lookahead Analysis Data
const trades = [
  'Civil',
  'Structural',
  'MEP',
  'Architecture',
  'Finishing',
  'Equipment'
];

export const lookaheadData = trades.map(trade => ({
  trade,
  weeks: Array.from({ length: 6 }, (_, i) => ({
    week: getWeekLabel(5 - i),
    constraintCount: Math.round(Math.random() * 10), // 0-10 constraints
    taskCount: Math.round(15 + Math.random() * 15) // 15-30 tasks
  }))
}));

// Variance Types with realistic construction-related reasons
export const varianceTypes = [
  'Material Delay',
  'Labor Shortage',
  'Weather Impact',
  'Equipment Failure',
  'Prerequisite Work',
  'Design Change',
  'Site Access',
  'Safety Stand-down',
  'Permit Delay',
  'Coordination Issue'
];

// Constraint Types
export const constraintTypes = [
  'Design Information',
  'Materials',
  'Labor Resources',
  'Equipment',
  'Predecessor Tasks',
  'Space',
  'Permits',
  'Weather',
  'Safety',
  'Quality Requirements'
];

// Current week's tasks
export const currentTasks: Task[] = Array.from({ length: currentWeekData.total_tasks }, (_, i) => {
  const planned = Math.round(60 + Math.random() * 40); // Plan to complete 60-100%
  const actualVariance = Math.round((Math.random() - 0.3) * 30); // Actual progress varies by -30 to +30 from plan
  return {
    id: `task-${i + 1}`,
    wwp_id: currentWeekData.id,
    title: `Task ${i + 1}`,
    location: ['North Wing', 'South Wing', 'East Wing', 'West Wing', 'Central'][Math.floor(Math.random() * 5)],
    owner: ['Civil Team', 'MEP Team', 'Architecture Team', 'Project Manager'][Math.floor(Math.random() * 4)],
    constraint_free: Math.random() > 0.3,
    planned_progress: planned,
    actual_progress: Math.max(0, Math.min(100, planned + actualVariance)) // Ensure between 0-100%
  };
});

// Current week's constraints
export const currentConstraints: Constraint[] = Array.from({ length: 12 }, (_, i) => ({
  type: constraintTypes[Math.floor(Math.random() * constraintTypes.length)],
  status: Math.random() > 0.6 ? 'open' : 'resolved',
  dueDate: format(addWeeks(new Date('2025-11-10'), Math.floor(Math.random() * 2)), 'yyyy-MM-dd'),
  owner: ['Civil Team', 'MEP Team', 'Architecture Team', 'Project Manager'][Math.floor(Math.random() * 4)]
}));

// Current week's variances
export const currentVariances: Variance[] = Array.from({ length: 8 }, (_, i) => ({
  type: varianceTypes[Math.floor(Math.random() * varianceTypes.length)],
  impact: Math.round(Math.random() * 100),
  date: format(new Date('2025-11-10'), 'yyyy-MM-dd')
}));

// Progress logs for the current week
export const currentProgressLogs = currentTasks.map(task => ({
  id: `log-${task.id}`,
  task_id: task.id,
  date: '2025-11-10',
  progress: task.actual_progress,
  notes: `Progress update for ${task.title}`
}));