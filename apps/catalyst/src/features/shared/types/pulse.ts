export interface SentimentData {
  id: string;
  journeyId: string;
  timestamp: string;
  score: number; // -1 to 1 scale
  confidence: number; // 0 to 1 scale
  source: 'survey' | 'feedback' | 'interaction' | 'meeting' | 'chat';
  department: string;
  stakeholderId?: string;
  text?: string;
}

export interface ChangeVelocityMetric {
  id: string;
  journeyId: string;
  metric: 'adoption_rate' | 'completion_rate' | 'engagement_rate' | 'resistance_rate';
  value: number;
  timestamp: string;
  target: number;
  trend: 'up' | 'down' | 'stable';
  department?: string;
}

export interface PulseSurvey {
  id: string;
  journeyId: string;
  title: string;
  questions: PulseSurveyQuestion[];
  responseRate: number;
  avgScore: number;
  status: 'active' | 'completed' | 'draft';
  createdAt: string;
  completedAt?: string;
  targetAudience: string[];
}

export interface PulseSurveyQuestion {
  id: string;
  question: string;
  type: 'rating' | 'scale' | 'boolean' | 'text';
  required: boolean;
  options?: string[];
}

export interface PulseSurveyResponse {
  id: string;
  surveyId: string;
  respondentId: string;
  answers: PulseSurveyAnswer[];
  submittedAt: string;
  sentiment: number;
}

export interface PulseSurveyAnswer {
  questionId: string;
  value: string | number | boolean;
}

export interface EarlyWarningAlert {
  id: string;
  journeyId: string;
  type: 'sentiment_drop' | 'velocity_decline' | 'resistance_spike' | 'engagement_low';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  metrics: string[];
  recommendedActions: string[];
  createdAt: string;
  acknowledged: boolean;
  resolvedAt?: string;
}

export interface ChangePulseMetrics {
  journeyId: string;
  overallSentiment: number;
  sentimentTrend: 'improving' | 'declining' | 'stable';
  velocityScore: number;
  velocityTrend: 'accelerating' | 'decelerating' | 'stable';
  riskScore: number;
  lastUpdated: string;
  departmentBreakdown: DepartmentPulse[];
  activeAlerts: number;
  responseRate: number;
}

export interface DepartmentPulse {
  department: string;
  sentiment: number;
  velocity: number;
  participationRate: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastActivity: string;
}

export interface PredictiveInsight {
  id: string;
  journeyId: string;
  type: 'success_probability' | 'timeline_prediction' | 'risk_forecast' | 'resource_need';
  prediction: string;
  confidence: number;
  dataPoints: string[];
  recommendations: string[];
  createdAt: string;
}