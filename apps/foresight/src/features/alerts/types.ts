export interface AlertRule {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  conditions: AlertCondition[];
  actions: AlertAction[];
  cooldownMinutes: number;
  createdAt: Date;
  lastTriggered?: Date;
}

export interface AlertCondition {
  id: string;
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'not_contains' | 'in' | 'not_in';
  value: any;
  dataSource: 'scenario' | 'insight' | 'recommendation' | 'kpi';
}

export interface AlertAction {
  id: string;
  type: 'email' | 'notification' | 'webhook' | 'slack';
  config: Record<string, any>;
}

export interface Alert {
  id: string;
  ruleId: string;
  ruleName: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  data: any;
  createdAt: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

export interface AlertMetrics {
  totalAlerts: number;
  activeRules: number;
  alertsByRule: Record<string, number>;
  alertsBySeverity: Record<string, number>;
  recentAlerts: Alert[];
}

export interface ThresholdConfig {
  id: string;
  name: string;
  metric: string;
  thresholds: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  enabled: boolean;
}