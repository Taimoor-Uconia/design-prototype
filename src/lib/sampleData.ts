import { subWeeks, format, addWeeks, addDays, subDays } from 'date-fns';
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
interface TeamMember {
  id: string;
  name: string;
  role: string;
  company: string;
}

type TaskStatus = 'draft' | 'todo' | 'in_progress' | 'complete' | 'rejected';
type IssuePriority = 'low' | 'medium' | 'high';
type IssueType = 'blocker' | 'constraint' | 'snag';
type IssueStatus = 'open' | 'in_progress' | 'resolved';

interface TaskIssue {
  id: string;
  type: IssueType;
  description: string;
  status: IssueStatus;
  created_at: string;
  assigned_to: string;
}

// Sample team members data
const teamMembers = [
  { id: 'tm1', name: 'John Smith', role: 'Site Supervisor', company: 'ABC Construction' },
  { id: 'tm2', name: 'Maria Garcia', role: 'Lead Engineer', company: 'MEP Solutions' },
  { id: 'tm3', name: 'David Chen', role: 'Project Manager', company: 'ABC Construction' },
  { id: 'tm4', name: 'Sarah Johnson', role: 'Safety Officer', company: 'Safety First Ltd' },
  { id: 'tm5', name: 'James Wilson', role: 'Civil Engineer', company: 'Civil Works Inc' },
  { id: 'tm6', name: 'Ana Rodriguez', role: 'Architect', company: 'Design Masters' },
  { id: 'tm7', name: 'Mike Thompson', role: 'MEP Coordinator', company: 'MEP Solutions' },
  { id: 'tm8', name: 'Lisa Wong', role: 'Quality Inspector', company: 'Safety First Ltd' },
];

const companies = [
  'ABC Construction',
  'MEP Solutions',
  'Civil Works Inc',
  'Design Masters',
  'Safety First Ltd'
];

const locations = [
  'North Wing - Ground Floor',
  'North Wing - First Floor',
  'South Wing - Ground Floor',
  'South Wing - First Floor',
  'Central Area',
  'East Wing',
  'West Wing',
  'Exterior'
];

const taskTypes = [
  'Foundation Work',
  'Structural Steel',
  'Concrete Pouring',
  'MEP Installation',
  'Interior Finishing',
  'Roofing',
  'Electrical Work',
  'Plumbing',
  'HVAC Installation',
  'Painting',
  'Flooring',
  'Ceiling Work'
];

const getRandomTeamMembers = () => {
  const count = Math.floor(Math.random() * 3) + 1; // 1-3 team members per task
  const shuffled = [...teamMembers].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const generateTaskIssues = (taskId: string, status: string) => {
  const issues: TaskIssue[] = [];
  const numIssues = Math.floor(Math.random() * 4) + 2; // 2-5 issues per task

  for (let i = 0; i < numIssues; i++) {
    // Weighted distribution favoring snags
    const rand = Math.random();
    let issueType: IssueType;
    if (status === 'complete') {
      // Completed tasks are more likely to have snags
      issueType = rand < 0.6 ? 'snag' : rand < 0.8 ? 'constraint' : 'blocker';
    } else {
      // Other tasks have a more balanced distribution, still favoring snags
      if (rand < 0.4) issueType = 'snag';
      else if (rand < 0.7) issueType = 'constraint';
      else issueType = 'blocker';
    }

    // Adjust status probabilities to ensure more resolved issues
    let issueStatus: 'open' | 'in_progress' | 'resolved';
    if (status === 'complete') {
      // Most issues in completed tasks should be resolved
      issueStatus = rand < 0.9 ? 'resolved' : 'in_progress';
    } else if (status === 'in_progress') {
      // In-progress tasks have a mix, favoring resolved and in_progress
      const statusRand = Math.random();
      if (statusRand < 0.4) issueStatus = 'resolved';
      else if (statusRand < 0.8) issueStatus = 'in_progress';
      else issueStatus = 'open';
    } else {
      // Other tasks have a more balanced distribution
      const statusRand = Math.random();
      if (statusRand < 0.4) issueStatus = 'resolved';
      else if (statusRand < 0.7) issueStatus = 'in_progress';
      else issueStatus = 'open';
    }
    
    const createdDate = subDays(new Date('2025-11-10'), Math.floor(Math.random() * 14));
    const resolvedDate = issueStatus === 'resolved' 
      ? format(addDays(createdDate, Math.floor(Math.random() * 5) + 1), 'yyyy-MM-dd')
      : undefined;

    issues.push({
      id: `issue-${taskId}-${i + 1}`,
      type: issueType,
      description: getIssueDescription(issueType),
      status: issueStatus,
      created_at: format(createdDate, 'yyyy-MM-dd'),
      assigned_to: teamMembers[Math.floor(Math.random() * teamMembers.length)].id
    });
  }
  return issues;
};

const getIssueDescription = (type: string) => {
  const descriptions = {
    blocker: [
      'Material delivery delayed: Steel beams not arrived on site',
      'Prerequisites not completed: Foundation curing incomplete',
      'Resource unavailable: Crane operator on sick leave',
      'Safety concern: Unstable ground conditions identified',
      'Permit pending: Municipal approval for height variance',
      'Critical equipment failure: Main concrete pump',
      'Access blocked: Neighboring construction interference'
    ],
    constraint: [
      'Space access limited: Temporary storage blocking work area',
      'Equipment maintenance: Scheduled generator service',
      'Weather alert: High winds forecast for crane operation',
      'Trade coordination: HVAC and electrical overlap',
      'Design clarification: Column reinforcement details pending',
      'Resource allocation: Team split between zones',
      'Material staging: Limited laydown area available'
    ],
    snag: [
      'Quality issue: Concrete surface finish below standard',
      'Installation error: Door frame alignment incorrect',
      'Finishing defect: Paint bubbling on north wall',
      'Measurement variance: Floor levels exceed tolerance',
      'Material defect: Damaged ceiling tiles received',
      'Workmanship issue: Uneven tile spacing in bathroom',
      'Fixture alignment: Light positions off-center',
      'Joint sealing: Incomplete waterproofing at corners',
      'Surface preparation: Inadequate wall cleaning before paint',
      'Equipment fitting: AC unit clearance insufficient'
    ]
  };
  return descriptions[type as keyof typeof descriptions][
    Math.floor(Math.random() * descriptions[type as keyof typeof descriptions].length)
  ];
};

export const currentTasks: Task[] = Array.from({ length: currentWeekData.total_tasks }, (_, i) => {
  const planned = Math.round(60 + Math.random() * 40); // Plan to complete 60-100%
  const actualVariance = Math.round((Math.random() - 0.3) * 30); // Actual progress varies by -30 to +30 from plan
  const company = companies[Math.floor(Math.random() * companies.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
  // Adjust status distribution to ensure more completed tasks
  const status: TaskStatus = Math.random() > 0.6 ? 'complete' :
    Math.random() > 0.4 ? 'in_progress' :
    Math.random() > 0.2 ? 'todo' :
    'draft';

  const startDate = subDays(new Date('2025-11-10'), Math.floor(Math.random() * 14));
  const endDate = addDays(startDate, Math.floor(Math.random() * 14) + 7);
  
  const task: Task = {
    id: `task-${i + 1}`,
    wwp_id: currentWeekData.id,
    title: `${taskType} - ${location}`,
    description: `Implementation of ${taskType.toLowerCase()} in ${location}`,
    location,
    owner: company,
    lead: teamMembers[Math.floor(Math.random() * teamMembers.length)].name,
    teamMembers: getRandomTeamMembers(),
    labels: [taskType, location.split(' - ')[0], company],
    company,
    planned_start: format(startDate, 'yyyy-MM-dd'),
    planned_end: format(endDate, 'yyyy-MM-dd'),
    actual_start: status !== 'draft' ? format(addDays(startDate, Math.floor(Math.random() * 3)), 'yyyy-MM-dd') : undefined,
    actual_end: status === 'complete' ? format(addDays(endDate, Math.floor(Math.random() * 5) - 2), 'yyyy-MM-dd') : undefined,
    status,
    issues: generateTaskIssues(`task-${i + 1}`, status),
    constraint_free: Math.random() > 0.3,
    planned_progress: planned,
    actual_progress: Math.max(0, Math.min(100, planned + actualVariance)),
    priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
    dependencies: []
  };
  
  return task;
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