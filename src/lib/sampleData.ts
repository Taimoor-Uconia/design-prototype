import { subWeeks, format } from 'date-fns';

// Helper to generate week labels
const getWeekLabel = (weeksAgo: number) => {
  const date = subWeeks(new Date(), weeksAgo);
  return format(date, 'MMM dd');
};

// WWP Reliability Data (last 8 weeks)
export const wwpReliabilityData = Array.from({ length: 8 }, (_, i) => ({
  week: getWeekLabel(7 - i),
  reliability: Math.round(70 + Math.random() * 20), // Random between 70-90%
  target: 85
}));

// Task Maturity Data (6-week lookahead)
export const taskMaturityData = Array.from({ length: 6 }, (_, i) => {
  const total = Math.round(30 + Math.random() * 20); // 30-50 tasks
  const sound = Math.round(total * (0.7 + Math.random() * 0.2)); // 70-90% sound
  const ready = Math.round(sound * (0.8 + Math.random() * 0.15)); // 80-95% of sound tasks are ready
  return {
    week: getWeekLabel(5 - i),
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

// Generate sample constraint data
export const generateConstraints = (taskCount: number) => {
  return Array.from({ length: Math.round(taskCount * 0.3) }, () => ({
    type: constraintTypes[Math.floor(Math.random() * constraintTypes.length)],
    status: Math.random() > 0.6 ? 'open' : 'resolved',
    dueDate: format(subWeeks(new Date(), Math.floor(Math.random() * 4)), 'yyyy-MM-dd'),
    owner: ['Civil Team', 'MEP Team', 'Architecture Team', 'Project Manager'][Math.floor(Math.random() * 4)]
  }));
};

// Generate sample variance data
export const generateVariances = (taskCount: number) => {
  return Array.from({ length: Math.round(taskCount * 0.2) }, () => ({
    type: varianceTypes[Math.floor(Math.random() * varianceTypes.length)],
    impact: Math.round(Math.random() * 100),
    date: format(subWeeks(new Date(), Math.floor(Math.random() * 2)), 'yyyy-MM-dd')
  }));
};