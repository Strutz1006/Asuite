import React from 'react';
import { GlassCard, Icon } from '../../shared/components';
import { mockSentimentData, mockChangePulseMetrics } from '../../shared/data/mockData';

interface SentimentDashboardProps {
  journeyId?: string;
}

const SentimentDashboard: React.FC<SentimentDashboardProps> = ({ journeyId }) => {
  const sentimentData = journeyId 
    ? mockSentimentData.filter(s => s.journeyId === journeyId)
    : mockSentimentData;
  
  const pulseMetrics = journeyId 
    ? mockChangePulseMetrics.find(m => m.journeyId === journeyId)
    : mockChangePulseMetrics[0];

  const getSentimentIcon = (score: number) => {
    if (score > 0.5) return { icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-green-400" };
    if (score > 0) return { icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-yellow-400" };
    if (score > -0.5) return { icon: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-orange-400" };
    return { icon: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-red-400" };
  };

  const getSentimentLabel = (score: number) => {
    if (score > 0.5) return "Positive";
    if (score > 0) return "Neutral+";
    if (score > -0.5) return "Neutral-";
    return "Negative";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return { icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", color: "text-green-400" };
      case 'declining': return { icon: "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6", color: "text-red-400" };
      default: return { icon: "M20 12H4", color: "text-slate-400" };
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-slate-100">Change Sentiment Analysis</h3>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Icon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4" />
          Last updated: {new Date(pulseMetrics?.lastUpdated || '').toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-sky-400 mb-2">
            {pulseMetrics ? (pulseMetrics.overallSentiment * 100).toFixed(0) : '45'}%
          </div>
          <div className="text-sm text-slate-400 mb-2">Overall Sentiment</div>
          <div className="flex items-center justify-center gap-2">
            <Icon 
              path={getTrendIcon(pulseMetrics?.sentimentTrend || 'stable').icon} 
              className={`w-4 h-4 ${getTrendIcon(pulseMetrics?.sentimentTrend || 'stable').color}`} 
            />
            <span className={`text-sm ${getTrendIcon(pulseMetrics?.sentimentTrend || 'stable').color}`}>
              {pulseMetrics?.sentimentTrend || 'stable'}
            </span>
          </div>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {pulseMetrics?.responseRate || 82}%
          </div>
          <div className="text-sm text-slate-400">Response Rate</div>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">
            {sentimentData.length}
          </div>
          <div className="text-sm text-slate-400">Recent Feedback</div>
        </div>
      </div>

      {pulseMetrics?.departmentBreakdown && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4">Department Breakdown</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pulseMetrics.departmentBreakdown.map((dept) => (
              <div key={dept.department} className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium">{dept.department}</h5>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    dept.riskLevel === 'high' ? 'bg-red-500/20 text-red-300' :
                    dept.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {dept.riskLevel} risk
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sentiment:</span>
                    <span className={dept.sentiment > 0 ? 'text-green-400' : 'text-red-400'}>
                      {(dept.sentiment * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Participation:</span>
                    <span className="text-blue-400">{dept.participationRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="text-lg font-semibold mb-4">Recent Sentiment Feedback</h4>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sentimentData.slice(0, 10).map((sentiment) => {
            const sentimentIcon = getSentimentIcon(sentiment.score);
            return (
              <div key={sentiment.id} className="p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon path={sentimentIcon.icon} className={`w-5 h-5 ${sentimentIcon.color} mt-1 flex-shrink-0`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm">{sentiment.department}</span>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className={`px-2 py-1 rounded-full ${sentimentIcon.color.replace('text-', 'bg-').replace('400', '500/20')} ${sentimentIcon.color}`}>
                          {getSentimentLabel(sentiment.score)}
                        </span>
                        <span>{new Date(sentiment.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    {sentiment.text && (
                      <p className="text-sm text-slate-300">{sentiment.text}</p>
                    )}
                    <div className="flex justify-between items-center mt-2 text-xs text-slate-400">
                      <span>Source: {sentiment.source}</span>
                      <span>Confidence: {(sentiment.confidence * 100).toFixed(0)}%</span>
                    </div>
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

export default SentimentDashboard;