export const mockChangeJourneys = [
  { 
    id: '1',
    name: "Digital Workplace Transformation", 
    status: "In Progress" as const, 
    readiness: 78, 
    resistance: "Medium" as const,
    phase: "Execution",
    startDate: "Jan 2025",
    completion: 65,
    stakeholders: 24,
    champions: 8,
    risks: 3,
    description: "Comprehensive digital transformation including new collaboration tools, remote work policies, and automation implementation."
  },
  { 
    id: '2',
    name: "New Sales Process Adoption", 
    status: "Planning" as const, 
    readiness: 45, 
    resistance: "High" as const,
    phase: "Preparation",
    startDate: "Mar 2025",
    completion: 20,
    stakeholders: 18,
    champions: 3,
    risks: 7,
    description: "Implementation of new CRM system and sales methodology across all sales teams."
  },
  { 
    id: '3',
    name: "ESG Reporting Implementation", 
    status: "Completed" as const, 
    readiness: 95, 
    resistance: "Low" as const,
    phase: "Sustain",
    startDate: "Sep 2024",
    completion: 100,
    stakeholders: 12,
    champions: 6,
    risks: 0,
    description: "Establishment of ESG reporting framework and sustainability metrics tracking."
  },
];

export const mockStakeholders = [
  { id: '1', name: "Sarah Chen", role: "Operations Director", influence: "High" as const, engagement: "Champion" as const, department: "Operations" },
  { id: '2', name: "Mike Torres", role: "IT Manager", influence: "High" as const, engagement: "Neutral" as const, department: "Technology" },
  { id: '3', name: "Lisa Park", role: "HR Director", influence: "Medium" as const, engagement: "Supporter" as const, department: "Human Resources" },
  { id: '4', name: "Alex Kim", role: "Finance Lead", influence: "High" as const, engagement: "Skeptic" as const, department: "Finance" },
  { id: '5', name: "Jordan Lee", role: "Sales Manager", influence: "Medium" as const, engagement: "Resistor" as const, department: "Sales" },
];

export const mockChangeFatigue = {
  overall: 68,
  departments: [
    { name: "Technology", fatigue: 85, color: "text-red-400" },
    { name: "Operations", fatigue: 45, color: "text-green-400" },
    { name: "Sales", fatigue: 75, color: "text-yellow-400" },
    { name: "HR", fatigue: 50, color: "text-green-400" },
  ]
};

export const mockRecentActivities = [
  { type: "survey", message: "Change readiness survey sent to Technology team", time: "2h ago", icon: "M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h2m4-10h2a2 2 0 012 2v8a2 2 0 01-2 2h-2m-4-8h4" },
  { type: "training", message: "Digital tools training completed by 15 employees", time: "5h ago", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { type: "milestone", message: "Digital Workplace phase 2 milestone reached", time: "1d ago", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
];

export const mockChangeTemplates = [
  {
    id: '1',
    name: "Technology Rollout",
    description: "New system, platform, or tool implementation",
    icon: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2",
    phases: ["Assessment", "Planning", "Implementation", "Adoption", "Sustain"]
  },
  {
    id: '2',
    name: "Process Change",
    description: "Workflow updates and operational improvements",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    phases: ["Current State", "Future State", "Gap Analysis", "Transition", "Optimize"]
  },
  {
    id: '3',
    name: "Cultural Shift",
    description: "Values, behaviors, and mindset transformation",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    phases: ["Culture Audit", "Vision Setting", "Engagement", "Behavior Change", "Embed"]
  }
];

export const mockCatalystMetrics = {
  activeJourneys: 3,
  totalStakeholders: 42,
  averageReadiness: 73,
  completionRate: 85,
  riskLevel: "Medium" as const
};