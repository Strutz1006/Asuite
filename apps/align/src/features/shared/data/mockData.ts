import type { Goal } from '@aesyros/types';

export const mockCompanyObjective: Goal = {
  id: '1',
  title: "Become Industry Leader in Sustainability by 2026",
  description: "Transform our organization into a recognized sustainability leader through comprehensive environmental, social, and governance initiatives.",
  progress: 68,
  status: 'on-track',
  owner: 'Executive Team',
  dueDate: new Date('2026-12-31'),
  parentGoal: undefined
};

export const mockDepartmentObjectives: Goal[] = [
  {
    id: '2',
    title: "Reduce Carbon Footprint by 25%",
    description: "Implement energy-efficient practices and renewable energy sources across all facilities.",
    progress: 72,
    status: 'on-track',
    owner: 'Sarah Chen',
    dueDate: new Date('2025-06-30'),
    parentGoal: '1'
  },
  {
    id: '3',
    title: "Launch Eco-Friendly Product Line",
    description: "Develop and launch a new product line using sustainable materials and processes.",
    progress: 45,
    status: 'on-track',
    owner: 'Mike Torres',
    dueDate: new Date('2025-09-30'),
    parentGoal: '1'
  },
  {
    id: '4',
    title: "Achieve 100% Renewable Energy",
    description: "Transition all facilities to renewable energy sources.",
    progress: 35,
    status: 'at-risk',
    owner: 'Lisa Park',
    dueDate: new Date('2025-12-31'),
    parentGoal: '1'
  }
];

export const mockIndividualGoals: Goal[] = [
  {
    id: '5',
    title: "Q4 Energy Audit Completion",
    description: "Complete comprehensive energy audit of all facilities.",
    progress: 90,
    status: 'on-track',
    owner: 'Alex Kim',
    dueDate: new Date('2024-12-31'),
    parentGoal: '2'
  },
  {
    id: '6',
    title: "Sustainable Material Research",
    description: "Research and identify sustainable materials for new product development.",
    progress: 60,
    status: 'on-track',
    owner: 'Jordan Lee',
    dueDate: new Date('2025-03-31'),
    parentGoal: '3'
  },
  {
    id: '7',
    title: "Green Marketing Campaign",
    description: "Design and launch marketing campaign highlighting sustainability efforts.",
    progress: 80,
    status: 'on-track',
    owner: 'Sam Rivera',
    dueDate: new Date('2025-02-28'),
    parentGoal: '3'
  }
];

export const mockAIInsights = [
  {
    id: '1',
    type: 'warning' as const,
    title: 'Goal Alignment Risk',
    message: 'The "Renewable Energy" goal is 7 months behind schedule. Consider breaking into smaller milestones.',
    action: 'Redefine Timeline',
    goalId: '4'
  },
  {
    id: '2',
    type: 'success' as const,
    title: 'Strong Progress',
    message: 'Carbon footprint reduction is ahead of schedule. Team could assist other departments.',
    action: 'Reallocate Resources',
    goalId: '2'
  },
  {
    id: '3',
    type: 'info' as const,
    title: 'Missing KPI',
    message: 'Product line launch lacks customer satisfaction metrics. Add feedback tracking.',
    action: 'Add KPI',
    goalId: '3'
  }
];

export const mockTeams = [
  { id: '1', name: 'Operations', color: 'sky' },
  { id: '2', name: 'R&D', color: 'blue' },
  { id: '3', name: 'Marketing', color: 'green' },
  { id: '4', name: 'Facilities', color: 'purple' },
  { id: '5', name: 'Executive', color: 'amber' }
];

export const mockUsers = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@company.com', role: 'admin' as const, team: 'Operations' },
  { id: '2', name: 'Mike Torres', email: 'mike@company.com', role: 'user' as const, team: 'R&D' },
  { id: '3', name: 'Lisa Park', email: 'lisa@company.com', role: 'user' as const, team: 'Facilities' },
  { id: '4', name: 'Alex Kim', email: 'alex@company.com', role: 'user' as const, team: 'Facilities' },
  { id: '5', name: 'Jordan Lee', email: 'jordan@company.com', role: 'user' as const, team: 'R&D' },
  { id: '6', name: 'Sam Rivera', email: 'sam@company.com', role: 'user' as const, team: 'Marketing' }
];