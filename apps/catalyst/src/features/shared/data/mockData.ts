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

export const mockSentimentData = [
  { id: '1', journeyId: '1', timestamp: '2025-07-10T10:00:00Z', score: 0.7, confidence: 0.85, source: 'survey' as const, department: 'Technology', stakeholderId: '2', text: 'The new tools are really helpful' },
  { id: '2', journeyId: '1', timestamp: '2025-07-10T09:30:00Z', score: -0.3, confidence: 0.75, source: 'feedback' as const, department: 'Operations', stakeholderId: '1', text: 'Some concerns about the timeline' },
  { id: '3', journeyId: '1', timestamp: '2025-07-10T09:00:00Z', score: 0.9, confidence: 0.92, source: 'meeting' as const, department: 'Sales', stakeholderId: '5', text: 'Excited about the efficiency gains' },
  { id: '4', journeyId: '2', timestamp: '2025-07-10T08:45:00Z', score: -0.6, confidence: 0.88, source: 'chat' as const, department: 'Sales', stakeholderId: '5', text: 'The new CRM seems complicated' },
  { id: '5', journeyId: '1', timestamp: '2025-07-10T08:15:00Z', score: 0.4, confidence: 0.70, source: 'interaction' as const, department: 'HR', stakeholderId: '3', text: 'Progress is steady' }
];

export const mockVelocityMetrics = [
  { id: '1', journeyId: '1', metric: 'adoption_rate' as const, value: 78, timestamp: '2025-07-10T10:00:00Z', target: 80, trend: 'up' as const, department: 'Technology' },
  { id: '2', journeyId: '1', metric: 'completion_rate' as const, value: 65, timestamp: '2025-07-10T10:00:00Z', target: 70, trend: 'up' as const, department: 'Operations' },
  { id: '3', journeyId: '1', metric: 'engagement_rate' as const, value: 82, timestamp: '2025-07-10T10:00:00Z', target: 75, trend: 'stable' as const, department: 'HR' },
  { id: '4', journeyId: '2', metric: 'resistance_rate' as const, value: 45, timestamp: '2025-07-10T10:00:00Z', target: 30, trend: 'down' as const, department: 'Sales' },
  { id: '5', journeyId: '1', metric: 'adoption_rate' as const, value: 72, timestamp: '2025-07-09T10:00:00Z', target: 80, trend: 'up' as const, department: 'Technology' }
];

export const mockPulseSurveys = [
  {
    id: '1',
    journeyId: '1',
    title: 'Digital Workplace Readiness Check',
    questions: [
      { id: '1', question: 'How confident do you feel about using the new digital tools?', type: 'scale' as const, required: true },
      { id: '2', question: 'Do you feel adequately trained for this change?', type: 'boolean' as const, required: true },
      { id: '3', question: 'What is your biggest concern about this transformation?', type: 'text' as const, required: false }
    ],
    responseRate: 78,
    avgScore: 3.4,
    status: 'active' as const,
    createdAt: '2025-07-08T09:00:00Z',
    targetAudience: ['Technology', 'Operations', 'HR']
  },
  {
    id: '2', 
    journeyId: '2',
    title: 'Sales Process Feedback',
    questions: [
      { id: '4', question: 'Rate the new CRM system ease of use', type: 'rating' as const, required: true, options: ['1', '2', '3', '4', '5'] },
      { id: '5', question: 'How likely are you to recommend this change to a colleague?', type: 'scale' as const, required: true }
    ],
    responseRate: 45,
    avgScore: 2.8,
    status: 'active' as const,
    createdAt: '2025-07-09T14:00:00Z',
    targetAudience: ['Sales']
  }
];

export const mockEarlyWarningAlerts = [
  {
    id: '1',
    journeyId: '2',
    type: 'sentiment_drop' as const,
    severity: 'high' as const,
    title: 'Sentiment declining in Sales department',
    description: 'Sales team sentiment has dropped 25% over the past week, with concerns about CRM complexity.',
    metrics: ['sentiment_score', 'engagement_rate'],
    recommendedActions: [
      'Schedule additional CRM training sessions',
      'Organize Q&A sessions with sales leadership', 
      'Create simplified user guides'
    ],
    createdAt: '2025-07-10T08:00:00Z',
    acknowledged: false
  },
  {
    id: '2',
    journeyId: '1',
    type: 'velocity_decline' as const,
    severity: 'medium' as const,
    title: 'Adoption velocity slowing in Technology',
    description: 'Technology team adoption rate has plateaued at 78%, below target of 80%.',
    metrics: ['adoption_rate', 'completion_rate'],
    recommendedActions: [
      'Identify specific adoption barriers',
      'Pair high adopters with struggling team members',
      'Review training effectiveness'
    ],
    createdAt: '2025-07-10T06:30:00Z',
    acknowledged: true
  }
];

export const mockChangePulseMetrics = [
  {
    journeyId: '1',
    overallSentiment: 0.45,
    sentimentTrend: 'stable' as const,
    velocityScore: 75,
    velocityTrend: 'accelerating' as const,
    riskScore: 35,
    lastUpdated: '2025-07-10T10:00:00Z',
    departmentBreakdown: [
      { department: 'Technology', sentiment: 0.6, velocity: 78, participationRate: 85, riskLevel: 'low' as const, lastActivity: '2025-07-10T10:00:00Z' },
      { department: 'Operations', sentiment: 0.3, velocity: 65, participationRate: 90, riskLevel: 'medium' as const, lastActivity: '2025-07-10T09:30:00Z' },
      { department: 'HR', sentiment: 0.5, velocity: 82, participationRate: 78, riskLevel: 'low' as const, lastActivity: '2025-07-10T09:45:00Z' }
    ],
    activeAlerts: 1,
    responseRate: 82
  },
  {
    journeyId: '2',
    overallSentiment: -0.2,
    sentimentTrend: 'declining' as const,
    velocityScore: 45,
    velocityTrend: 'decelerating' as const,
    riskScore: 70,
    lastUpdated: '2025-07-10T10:00:00Z',
    departmentBreakdown: [
      { department: 'Sales', sentiment: -0.2, velocity: 45, participationRate: 60, riskLevel: 'high' as const, lastActivity: '2025-07-10T08:45:00Z' }
    ],
    activeAlerts: 2,
    responseRate: 45
  }
];

export const mockPredictiveInsights = [
  {
    id: '1',
    journeyId: '1',
    type: 'success_probability' as const,
    prediction: '87% likelihood of meeting project goals by target date',
    confidence: 0.82,
    dataPoints: ['adoption_trends', 'sentiment_trajectory', 'velocity_metrics'],
    recommendations: [
      'Maintain current pace in Technology team',
      'Address sentiment concerns in Operations',
      'Consider extending timeline by 2 weeks for buffer'
    ],
    createdAt: '2025-07-10T09:00:00Z'
  },
  {
    id: '2',
    journeyId: '2',
    type: 'risk_forecast' as const,
    prediction: 'High risk of project delays without intervention',
    confidence: 0.75,
    dataPoints: ['resistance_rates', 'sentiment_decline', 'engagement_metrics'],
    recommendations: [
      'Implement intensive change support program',
      'Increase leadership visibility and communication',
      'Consider phased rollout approach'
    ],
    createdAt: '2025-07-10T08:30:00Z'
  }
];