import type { AlertRule, AlertCondition, Alert, AlertAction } from './types';

export class AlertEngine {
  private rules: Map<string, AlertRule> = new Map();
  private alerts: Alert[] = [];
  private isRunning = false;
  private checkInterval?: NodeJS.Timeout;

  constructor() {
    this.loadRules();
  }

  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.checkInterval = setInterval(() => {
      this.checkRules();
    }, 30000); // Check every 30 seconds
    
    console.log('Alert engine started');
  }

  stop(): void {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = undefined;
    }
    
    console.log('Alert engine stopped');
  }

  addRule(rule: AlertRule): void {
    this.rules.set(rule.id, rule);
    this.saveRules();
  }

  updateRule(ruleId: string, updates: Partial<AlertRule>): void {
    const rule = this.rules.get(ruleId);
    if (rule) {
      this.rules.set(ruleId, { ...rule, ...updates });
      this.saveRules();
    }
  }

  removeRule(ruleId: string): void {
    this.rules.delete(ruleId);
    this.saveRules();
  }

  getRule(ruleId: string): AlertRule | undefined {
    return this.rules.get(ruleId);
  }

  getAllRules(): AlertRule[] {
    return Array.from(this.rules.values());
  }

  getActiveRules(): AlertRule[] {
    return this.getAllRules().filter(rule => rule.enabled);
  }

  async checkRules(): Promise<void> {
    const activeRules = this.getActiveRules();
    
    for (const rule of activeRules) {
      if (this.shouldSkipRule(rule)) continue;
      
      try {
        const conditionsMet = await this.evaluateConditions(rule.conditions);
        
        if (conditionsMet) {
          await this.triggerAlert(rule);
        }
      } catch (error) {
        console.error(`Error checking rule ${rule.id}:`, error);
      }
    }
  }

  private shouldSkipRule(rule: AlertRule): boolean {
    if (!rule.lastTriggered) return false;
    
    const cooldownMs = rule.cooldownMinutes * 60 * 1000;
    const timeSinceTriggered = Date.now() - rule.lastTriggered.getTime();
    
    return timeSinceTriggered < cooldownMs;
  }

  private async evaluateConditions(conditions: AlertCondition[]): Promise<boolean> {
    if (conditions.length === 0) return false;
    
    // All conditions must be met (AND logic)
    for (const condition of conditions) {
      const conditionMet = await this.evaluateCondition(condition);
      if (!conditionMet) return false;
    }
    
    return true;
  }

  private async evaluateCondition(condition: AlertCondition): Promise<boolean> {
    const data = await this.getDataForCondition(condition);
    const actualValue = this.extractValue(data, condition.field);
    
    return this.compareValues(actualValue, condition.operator, condition.value);
  }

  private async getDataForCondition(condition: AlertCondition): Promise<any> {
    // Mock data fetching - in real app, this would fetch from appropriate data sources
    switch (condition.dataSource) {
      case 'scenario':
        return { confidence: 0.65, impact_revenue: 25000, status: 'active' };
      case 'insight':
        return { score: 8.5, type: 'risk', created_at: new Date() };
      case 'recommendation':
        return { priority: 'high', implemented: false };
      case 'kpi':
        return { value: 95.2, target: 90, variance: 5.2 };
      default:
        return {};
    }
  }

  private extractValue(data: any, field: string): any {
    return field.split('.').reduce((obj, key) => obj?.[key], data);
  }

  private compareValues(actual: any, operator: AlertCondition['operator'], expected: any): boolean {
    switch (operator) {
      case 'eq':
        return actual === expected;
      case 'neq':
        return actual !== expected;
      case 'gt':
        return Number(actual) > Number(expected);
      case 'lt':
        return Number(actual) < Number(expected);
      case 'gte':
        return Number(actual) >= Number(expected);
      case 'lte':
        return Number(actual) <= Number(expected);
      case 'contains':
        return String(actual).includes(String(expected));
      case 'not_contains':
        return !String(actual).includes(String(expected));
      case 'in':
        return Array.isArray(expected) && expected.includes(actual);
      case 'not_in':
        return Array.isArray(expected) && !expected.includes(actual);
      default:
        return false;
    }
  }

  private async triggerAlert(rule: AlertRule): Promise<void> {
    const alert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ruleId: rule.id,
      ruleName: rule.name,
      message: `Alert triggered: ${rule.name}`,
      severity: this.determineSeverity(rule),
      data: await this.getDataForCondition(rule.conditions[0]), // Use first condition's data
      createdAt: new Date(),
      acknowledged: false
    };

    this.alerts.unshift(alert);
    
    // Update rule's last triggered time
    rule.lastTriggered = new Date();
    this.rules.set(rule.id, rule);
    
    // Execute alert actions
    await this.executeActions(rule.actions, alert);
    
    // Limit stored alerts to prevent memory issues
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(0, 1000);
    }
    
    console.log(`Alert triggered: ${rule.name}`, alert);
  }

  private determineSeverity(rule: AlertRule): Alert['severity'] {
    // Basic severity determination - could be more sophisticated
    const conditionValues = rule.conditions.map(c => Number(c.value)).filter(v => !isNaN(v));
    if (conditionValues.length === 0) return 'medium';
    
    const maxValue = Math.max(...conditionValues);
    if (maxValue >= 90) return 'critical';
    if (maxValue >= 70) return 'high';
    if (maxValue >= 40) return 'medium';
    return 'low';
  }

  private async executeActions(actions: AlertAction[], alert: Alert): Promise<void> {
    for (const action of actions) {
      try {
        await this.executeAction(action, alert);
      } catch (error) {
        console.error(`Failed to execute action ${action.id}:`, error);
      }
    }
  }

  private async executeAction(action: AlertAction, alert: Alert): Promise<void> {
    switch (action.type) {
      case 'notification':
        this.showNotification(alert, action.config);
        break;
      case 'email':
        await this.sendEmail(alert, action.config);
        break;
      case 'webhook':
        await this.callWebhook(alert, action.config);
        break;
      case 'slack':
        await this.sendSlackMessage(alert, action.config);
        break;
    }
  }

  private showNotification(alert: Alert, config: any): void {
    // Mock notification - in real app, integrate with notification system
    console.log('📢 Notification:', alert.message);
  }

  private async sendEmail(alert: Alert, config: any): Promise<void> {
    // Mock email sending
    console.log(`📧 Email sent to ${config.recipients}: ${alert.message}`);
  }

  private async callWebhook(alert: Alert, config: any): Promise<void> {
    // Mock webhook call
    console.log(`🔗 Webhook called: ${config.url}`, alert);
  }

  private async sendSlackMessage(alert: Alert, config: any): Promise<void> {
    // Mock Slack message
    console.log(`💬 Slack message sent to ${config.channel}: ${alert.message}`);
  }

  getAlerts(limit?: number): Alert[] {
    return limit ? this.alerts.slice(0, limit) : this.alerts;
  }

  acknowledgeAlert(alertId: string, userId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedBy = userId;
      alert.acknowledgedAt = new Date();
    }
  }

  getMetrics(): any {
    const activeRules = this.getActiveRules();
    const recentAlerts = this.getAlerts(10);
    
    const alertsByRule: Record<string, number> = {};
    const alertsBySeverity: Record<string, number> = {};
    
    this.alerts.forEach(alert => {
      alertsByRule[alert.ruleName] = (alertsByRule[alert.ruleName] || 0) + 1;
      alertsBySeverity[alert.severity] = (alertsBySeverity[alert.severity] || 0) + 1;
    });

    return {
      totalAlerts: this.alerts.length,
      activeRules: activeRules.length,
      alertsByRule,
      alertsBySeverity,
      recentAlerts
    };
  }

  private loadRules(): void {
    // Mock loading - in real app, load from storage
    const mockRules: AlertRule[] = [
      {
        id: 'rule-1',
        name: 'Low Confidence Scenario',
        description: 'Alert when scenario confidence drops below 50%',
        enabled: true,
        conditions: [
          {
            id: 'cond-1',
            field: 'confidence',
            operator: 'lt',
            value: 0.5,
            dataSource: 'scenario'
          }
        ],
        actions: [
          {
            id: 'action-1',
            type: 'notification',
            config: { message: 'Scenario confidence is low' }
          }
        ],
        cooldownMinutes: 60,
        createdAt: new Date(),
      }
    ];

    mockRules.forEach(rule => this.rules.set(rule.id, rule));
  }

  private saveRules(): void {
    // Mock saving - in real app, save to storage
    console.log('Rules saved');
  }
}

export const alertEngine = new AlertEngine();