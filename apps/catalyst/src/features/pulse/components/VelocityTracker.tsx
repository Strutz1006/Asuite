import React from 'react';
import { GlassCard, Icon } from '../../shared/components';
import { mockVelocityMetrics, mockChangePulseMetrics } from '../../shared/data/mockData';

interface VelocityTrackerProps {
  journeyId?: string;
}

const VelocityTracker: React.FC<VelocityTrackerProps> = ({ journeyId }) => {
  const velocityData = journeyId 
    ? mockVelocityMetrics.filter(v => v.journeyId === journeyId)
    : mockVelocityMetrics;
  
  const pulseMetrics = journeyId 
    ? mockChangePulseMetrics.find(m => m.journeyId === journeyId)
    : mockChangePulseMetrics[0];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': 
      case 'accelerating': 
        return { icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", color: "text-green-400" };
      case 'down': 
      case 'decelerating': 
        return { icon: "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6", color: "text-red-400" };
      default: 
        return { icon: "M20 12H4", color: "text-slate-400" };
    }
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'adoption_rate':
        return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
      case 'completion_rate':
        return "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z";
      case 'engagement_rate':
        return "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z";
      case 'resistance_rate':
        return "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z";
      default:
        return "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z";
    }
  };

  const getMetricLabel = (metric: string) => {
    return metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getPerformanceColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 95) return 'text-green-400';
    if (percentage >= 80) return 'text-blue-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressBarColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 95) return 'bg-green-500';
    if (percentage >= 80) return 'bg-blue-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const currentMetrics = velocityData.filter(v => 
    new Date(v.timestamp).toDateString() === new Date().toDateString()
  );

  return (
    <GlassCard className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-slate-100">Change Velocity Tracking</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Velocity Score:</span>
            <span className="text-2xl font-bold text-sky-400">
              {pulseMetrics?.velocityScore || 75}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Icon 
              path={getTrendIcon(pulseMetrics?.velocityTrend || 'stable').icon} 
              className={`w-4 h-4 ${getTrendIcon(pulseMetrics?.velocityTrend || 'stable').color}`} 
            />
            <span className={`text-sm ${getTrendIcon(pulseMetrics?.velocityTrend || 'stable').color}`}>
              {pulseMetrics?.velocityTrend || 'stable'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {currentMetrics.map((metric) => {
          const trendIcon = getTrendIcon(metric.trend);
          const performanceColor = getPerformanceColor(metric.value, metric.target);
          const progressBarColor = getProgressBarColor(metric.value, metric.target);
          
          return (
            <div key={metric.id} className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Icon 
                  path={getMetricIcon(metric.metric)} 
                  className="w-6 h-6 text-sky-400" 
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{getMetricLabel(metric.metric)}</h4>
                  {metric.department && (
                    <p className="text-sm text-slate-400">{metric.department}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Icon path={trendIcon.icon} className={`w-4 h-4 ${trendIcon.color}`} />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className={`text-2xl font-bold ${performanceColor}`}>
                    {metric.value}%
                  </span>
                  <span className="text-sm text-slate-400">
                    Target: {metric.target}%
                  </span>
                </div>
                
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${progressBarColor}`} 
                    style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Progress: {((metric.value / metric.target) * 100).toFixed(0)}%</span>
                  <span>{new Date(metric.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-4">Historical Trends</h4>
        <div className="space-y-4">
          {velocityData.slice(0, 5).map((metric) => {
            const trendIcon = getTrendIcon(metric.trend);
            return (
              <div key={metric.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon 
                    path={getMetricIcon(metric.metric)} 
                    className="w-5 h-5 text-sky-400" 
                  />
                  <div>
                    <span className="font-medium">{getMetricLabel(metric.metric)}</span>
                    {metric.department && (
                      <span className="text-sm text-slate-400 ml-2">• {metric.department}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-mono text-sm">{metric.value}%</div>
                    <div className="text-xs text-slate-400">
                      {new Date(metric.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Icon path={trendIcon.icon} className={`w-4 h-4 ${trendIcon.color}`} />
                    <span className={`text-xs ${trendIcon.color}`}>
                      {metric.trend}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
};

export default VelocityTracker;