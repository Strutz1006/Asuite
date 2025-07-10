import type { KPI } from '@aesyros/types';

export const mockKPIs: KPI[] = [
  {
    id: '1',
    name: 'Customer Satisfaction (CSAT)',
    value: 9.2,
    target: 9.0,
    unit: '/10',
    trend: 'up',
    category: 'Customer',
    owner: 'Sarah Chen',
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: '2',
    name: 'Operational Efficiency',
    value: 94,
    target: 92,
    unit: '%',
    trend: 'up',
    category: 'Operations',
    owner: 'Mike Torres',
    lastUpdated: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
  },
  {
    id: '3',
    name: 'ESG Compliance Score',
    value: 88,
    target: 85,
    unit: '%',
    trend: 'up',
    category: 'Sustainability',
    owner: 'Lisa Park',
    lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: '4',
    name: 'Team Morale Index',
    value: 3.8,
    target: 4.2,
    unit: '/5',
    trend: 'down',
    category: 'People',
    owner: 'Jordan Lee',
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    id: '5',
    name: 'Revenue Growth Rate',
    value: 18.5,
    target: 15,
    unit: '%',
    trend: 'up',
    category: 'Financial',
    owner: 'Alex Kim',
    lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
  },
  {
    id: '6',
    name: 'Innovation Pipeline',
    value: 12,
    target: 10,
    unit: 'projects',
    trend: 'up',
    category: 'Strategy',
    owner: 'Taylor Kim',
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  }
];

export const mockKPICategories = [
  { name: 'Financial', count: 8, onTrack: 7, color: 'text-green-400' },
  { name: 'Customer', count: 5, onTrack: 5, color: 'text-blue-400' },
  { name: 'Operations', count: 12, onTrack: 10, color: 'text-sky-400' },
  { name: 'People', count: 6, onTrack: 4, color: 'text-yellow-400' },
  { name: 'Sustainability', count: 4, onTrack: 4, color: 'text-green-400' },
  { name: 'Strategy', count: 3, onTrack: 3, color: 'text-purple-400' }
];

export const mockKPITemplates = [
  { 
    id: '1',
    name: 'Customer Success', 
    metrics: ['NPS', 'CSAT', 'Churn Rate', 'LTV'], 
    industry: 'SaaS',
    description: 'Essential metrics for customer-focused organizations'
  },
  { 
    id: '2',
    name: 'Operational Excellence', 
    metrics: ['Efficiency', 'Quality Score', 'Uptime', 'Cost per Unit'], 
    industry: 'Manufacturing',
    description: 'Core operational performance indicators'
  },
  { 
    id: '3',
    name: 'Financial Performance', 
    metrics: ['Revenue Growth', 'Profit Margin', 'Cash Flow', 'ROI'], 
    industry: 'General',
    description: 'Fundamental financial health metrics'
  },
  { 
    id: '4',
    name: 'ESG & Sustainability', 
    metrics: ['Carbon Footprint', 'Energy Efficiency', 'Diversity Index', 'Compliance'], 
    industry: 'All',
    description: 'Environmental, social, and governance metrics'
  }
];

export const mockAnomalyFeed = [
  {
    id: '1',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z',
    text: 'Anomaly Detected: Team Morale Index dropped below threshold (3.8 < 4.0)',
    time: '2h ago',
    severity: 'high' as const,
    category: 'People',
    kpiId: '4'
  },
  {
    id: '2',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    text: 'CSAT score reached all-time high of 9.2/10, exceeding target by 2.2%',
    time: '5h ago',
    severity: 'positive' as const,
    category: 'Customer',
    kpiId: '1'
  },
  {
    id: '3',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    text: 'New KPI "Carbon Footprint per Unit" added to Sustainability dashboard',
    time: '8h ago',
    severity: 'info' as const,
    category: 'System',
    kpiId: null
  }
];

export const mockDashboardStats = {
  totalKPIs: 38,
  onTrack: 33,
  atRisk: 4,
  critical: 1,
  avgPerformance: 94
};

export const mockUsers = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@company.com', role: 'admin' as const, department: 'Customer Success' },
  { id: '2', name: 'Mike Torres', email: 'mike@company.com', role: 'user' as const, department: 'Operations' },
  { id: '3', name: 'Lisa Park', email: 'lisa@company.com', role: 'user' as const, department: 'Sustainability' },
  { id: '4', name: 'Jordan Lee', email: 'jordan@company.com', role: 'user' as const, department: 'HR' },
  { id: '5', name: 'Alex Kim', email: 'alex@company.com', role: 'user' as const, department: 'Finance' },
  { id: '6', name: 'Taylor Kim', email: 'taylor@company.com', role: 'user' as const, department: 'Strategy' }
];

export const mockHistoricalData = {
  '1': [8.8, 9.0, 8.9, 9.1, 9.2], // CSAT
  '2': [89, 91, 92, 93, 94], // Operational Efficiency
  '3': [82, 84, 85, 87, 88], // ESG Compliance
  '4': [4.2, 4.1, 4.0, 3.9, 3.8], // Team Morale
  '5': [12, 14, 16, 17, 18.5], // Revenue Growth
  '6': [8, 9, 10, 11, 12] // Innovation Pipeline
};