import React, { useState, useEffect } from 'react';
import { GlassCard, Icon } from '@aesyros/ui';
import { alertEngine } from '../AlertEngine';
import type { AlertRule, Alert, AlertCondition, AlertAction } from '../types';

const AlertsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'rules'>('alerts');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [showCreateRule, setShowCreateRule] = useState(false);
  const [metrics, setMetrics] = useState<any>({});

  useEffect(() => {
    alertEngine.start();
    loadData();
    
    const interval = setInterval(loadData, 10000); // Refresh every 10 seconds
    
    return () => {
      clearInterval(interval);
      alertEngine.stop();
    };
  }, []);

  const loadData = () => {
    setAlerts(alertEngine.getAlerts());
    setRules(alertEngine.getAllRules());
    setMetrics(alertEngine.getMetrics());
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    alertEngine.acknowledgeAlert(alertId, 'current-user');
    loadData();
  };

  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    alertEngine.updateRule(ruleId, { enabled });
    loadData();
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-200">Alerts & Monitoring</h1>
          <p className="text-slate-400 mt-1">
            Monitor scenarios and get notified of important changes
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'alerts'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Alerts
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'rules'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Rules
            </button>
          </div>
          
          {activeTab === 'rules' && (
            <button
              onClick={() => setShowCreateRule(true)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Icon path="M12 4.5v15m7.5-7.5h-15" />
              Create Rule
            </button>
          )}
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Alerts</p>
              <p className="text-2xl font-bold text-slate-200">{metrics.totalAlerts || 0}</p>
            </div>
            <Icon path="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" className="w-8 h-8 text-sky-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Active Rules</p>
              <p className="text-2xl font-bold text-slate-200">{metrics.activeRules || 0}</p>
            </div>
            <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-green-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Critical Alerts</p>
              <p className="text-2xl font-bold text-slate-200">{metrics.alertsBySeverity?.critical || 0}</p>
            </div>
            <Icon path="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" className="w-8 h-8 text-red-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Acknowledged</p>
              <p className="text-2xl font-bold text-slate-200">
                {alerts.filter(a => a.acknowledged).length}
              </p>
            </div>
            <Icon path="M4.5 12.75l6 6 9-13.5" className="w-8 h-8 text-blue-400" />
          </div>
        </GlassCard>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'alerts' ? (
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <Icon path="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-200 mb-2">No Alerts</h3>
              <p className="text-slate-400">No alerts have been triggered yet.</p>
            </GlassCard>
          ) : (
            alerts.map((alert) => (
              <GlassCard key={alert.id} className={`p-4 ${alert.acknowledged ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <h3 className="font-semibold text-slate-200">{alert.ruleName}</h3>
                      <span className="text-sm text-slate-400">
                        {alert.createdAt.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-300 mb-2">{alert.message}</p>
                    {alert.acknowledged && (
                      <p className="text-sm text-slate-500">
                        Acknowledged by {alert.acknowledgedBy} at {alert.acknowledgedAt?.toLocaleString()}
                      </p>
                    )}
                  </div>
                  
                  {!alert.acknowledged && (
                    <button
                      onClick={() => handleAcknowledgeAlert(alert.id)}
                      className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </GlassCard>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {rules.map((rule) => (
            <GlassCard key={rule.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-200">{rule.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rule.enabled ? 'text-green-400 bg-green-500/20' : 'text-slate-400 bg-slate-500/20'
                    }`}>
                      {rule.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  {rule.description && (
                    <p className="text-slate-300 mb-2">{rule.description}</p>
                  )}
                  <div className="text-sm text-slate-400">
                    <p>Conditions: {rule.conditions.length}</p>
                    <p>Actions: {rule.actions.length}</p>
                    <p>Cooldown: {rule.cooldownMinutes} minutes</p>
                    {rule.lastTriggered && (
                      <p>Last triggered: {rule.lastTriggered.toLocaleString()}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={(e) => handleToggleRule(rule.id, e.target.checked)}
                      className="rounded border-slate-600 bg-slate-700 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-sm text-slate-300">Enabled</span>
                  </label>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {showCreateRule && (
        <CreateRuleModal
          onClose={() => setShowCreateRule(false)}
          onCreate={(rule) => {
            alertEngine.addRule(rule);
            loadData();
            setShowCreateRule(false);
          }}
        />
      )}
    </div>
  );
};

const CreateRuleModal: React.FC<{
  onClose: () => void;
  onCreate: (rule: AlertRule) => void;
}> = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    enabled: true,
    cooldownMinutes: 60,
    conditions: [{
      field: 'confidence',
      operator: 'lt' as const,
      value: 0.5,
      dataSource: 'scenario' as const
    }],
    actions: [{
      type: 'notification' as const,
      config: { message: 'Alert triggered' }
    }]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const rule: AlertRule = {
      id: `rule-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      enabled: formData.enabled,
      cooldownMinutes: formData.cooldownMinutes,
      conditions: formData.conditions.map((c, i) => ({ ...c, id: `cond-${i}` })),
      actions: formData.actions.map((a, i) => ({ ...a, id: `action-${i}` })),
      createdAt: new Date()
    };
    
    onCreate(rule);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <GlassCard className="w-full max-w-2xl p-6 mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-200 mb-4">Create Alert Rule</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Rule Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              rows={2}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Cooldown (minutes)
            </label>
            <input
              type="number"
              value={formData.cooldownMinutes}
              onChange={(e) => setFormData({ ...formData, cooldownMinutes: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              min="1"
              required
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="rounded border-slate-600 bg-slate-700 text-sky-600 focus:ring-sky-500"
            />
            <label className="text-sm text-slate-300">Enable rule immediately</label>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
            >
              Create Rule
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default AlertsPage;