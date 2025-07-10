export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  avatar?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
}

export type AppName = 'align' | 'catalyst' | 'flow' | 'foresight' | 'pulse';

export interface AppConfig {
  name: AppName;
  title: string;
  description: string;
  port: number;
  path: string;
}


export interface KPI {
  id: string;
  name: string;
  value: number | string;
  target: number | string;
  unit?: string;
  trend: 'up' | 'down' | 'neutral';
  category: string;
  owner: string;
  lastUpdated: Date;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'completed' | 'paused';
  owner: string;
  dueDate?: Date;
  parentGoal?: string;
}

export interface Process {
  id: string;
  name: string;
  description?: string;
  steps: ProcessStep[];
  owner: string;
  version: string;
  lastUpdated: Date;
}

export interface ProcessStep {
  id: string;
  title: string;
  description?: string;
  order: number;
  required: boolean;
  estimatedTime?: number;
}

export interface ChangeJourney {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'in-progress' | 'completed' | 'paused';
  progress: number;
  readiness: number;
  resistance: 'low' | 'medium' | 'high';
  stakeholders: string[];
  startDate: Date;
  endDate?: Date;
}

export interface Scenario {
  id: string;
  name: string;
  description?: string;
  confidence: number;
  impact: {
    revenue: string;
    cost: string;
    risk: 'low' | 'medium' | 'high';
    timeline: string;
  };
  outcomes: Record<string, any>;
}

export type AppTheme = 'light' | 'dark' | 'system';

export interface AppConfig {
  theme: AppTheme;
  organization: Organization;
  user: User;
}
