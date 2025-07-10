import React, { useState } from 'react';
import { GlassCard, Icon } from '../../shared/components';
import { mockEarlyWarningAlerts } from '../../shared/data/mockData';

interface EarlyWarningAlertsProps {
  journeyId?: string;
}

const EarlyWarningAlerts: React.FC<EarlyWarningAlertsProps> = ({ journeyId }) => {
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<string[]>([]);
  
  const alerts = journeyId 
    ? mockEarlyWarningAlerts.filter(a => a.journeyId === journeyId)
    : mockEarlyWarningAlerts;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return { icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z", color: "text-red-500" };
      case 'high':
        return { icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z", color: "text-red-400" };
      case 'medium':
        return { icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-yellow-400" };
      default:
        return { icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-blue-400" };
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical':
        return "bg-red-500/10 border-red-500/30";
      case 'high':
        return "bg-red-500/10 border-red-500/30";
      case 'medium':
        return "bg-yellow-500/10 border-yellow-500/30";
      default:
        return "bg-blue-500/10 border-blue-500/30";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sentiment_drop':
        return "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
      case 'velocity_decline':
        return "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6";
      case 'resistance_spike':
        return "M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01";
      case 'engagement_low':
        return "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z";
      default:
        return "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
    }
  };

  const handleAcknowledge = (alertId: string) => {
    setAcknowledgedAlerts(prev => [...prev, alertId]);
  };

  const unacknowledgedAlerts = alerts.filter(alert => 
    !alert.acknowledged && !acknowledgedAlerts.includes(alert.id)
  );

  const acknowledgedAlertsData = alerts.filter(alert => 
    alert.acknowledged || acknowledgedAlerts.includes(alert.id)
  );

  return (
    <GlassCard className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-slate-100">Early Warning System</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-400">
              {unacknowledgedAlerts.length} active alerts
            </span>
          </div>
        </div>
      </div>

      {unacknowledgedAlerts.length === 0 ? (
        <div className="text-center py-8">
          <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p className="text-slate-300">All systems operating normally</p>
          <p className="text-sm text-slate-400">No active alerts requiring attention</p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          <h4 className="text-lg font-semibold text-red-300">Active Alerts</h4>
          {unacknowledgedAlerts.map((alert) => {
            const severityIcon = getSeverityIcon(alert.severity);
            const severityBg = getSeverityBg(alert.severity);
            
            return (
              <div key={alert.id} className={`p-4 rounded-lg border ${severityBg}`}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Icon path={severityIcon.icon} className={`w-6 h-6 ${severityIcon.color}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h5 className="font-semibold text-slate-100">{alert.title}</h5>
                      <div className={`px-2 py-1 text-xs font-bold rounded-full ${severityIcon.color.replace('text-', 'bg-').replace('400', '500/20')} ${severityIcon.color}`}>
                        {alert.severity.toUpperCase()}
                      </div>
                      <Icon path={getTypeIcon(alert.type)} className="w-4 h-4 text-slate-400" />
                    </div>
                    
                    <p className="text-sm text-slate-300 mb-3">{alert.description}</p>
                    
                    <div className="mb-4">
                      <h6 className="text-sm font-medium text-slate-400 mb-2">Recommended Actions:</h6>
                      <ul className="space-y-1">
                        {alert.recommendedActions.map((action, index) => (
                          <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                            <Icon path="M9 5l7 7-7 7" className="w-3 h-3 text-sky-400 mt-1 flex-shrink-0" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-slate-400">
                        <span>Created: {new Date(alert.createdAt).toLocaleString()}</span>
                        {alert.metrics.length > 0 && (
                          <span className="ml-4">
                            Metrics: {alert.metrics.join(', ')}
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="bg-sky-500 hover:bg-sky-600 text-white text-sm px-3 py-1 rounded transition-colors"
                      >
                        Acknowledge
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {acknowledgedAlertsData.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-slate-400 mb-4">Acknowledged Alerts</h4>
          <div className="space-y-3">
            {acknowledgedAlertsData.map((alert) => {
              const severityIcon = getSeverityIcon(alert.severity);
              
              return (
                <div key={alert.id} className="p-3 bg-slate-700/30 rounded-lg opacity-60">
                  <div className="flex items-center gap-3">
                    <Icon path={severityIcon.icon} className={`w-5 h-5 ${severityIcon.color}`} />
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">{alert.title}</h5>
                      <p className="text-xs text-slate-400">
                        {new Date(alert.createdAt).toLocaleDateString()} • Acknowledged
                      </p>
                    </div>
                    <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-green-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default EarlyWarningAlerts;