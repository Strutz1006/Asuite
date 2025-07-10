import React, { useState } from 'react';
import { GlassCard, Icon } from '../../shared/components';
import { 
  SentimentDashboard, 
  VelocityTracker, 
  EarlyWarningAlerts, 
  PulseSurveys 
} from '../components';
import { mockChangeJourneys, mockPredictiveInsights } from '../../shared/data/mockData';

const PulsePage: React.FC = () => {
  const [selectedJourney, setSelectedJourney] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'sentiment' | 'velocity' | 'alerts' | 'surveys'>('overview');

  const journeyId = selectedJourney === 'all' ? undefined : selectedJourney;
  const relevantInsights = journeyId 
    ? mockPredictiveInsights.filter(i => i.journeyId === journeyId)
    : mockPredictiveInsights;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { id: 'sentiment', label: 'Sentiment', icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: 'velocity', label: 'Velocity', icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { id: 'alerts', label: 'Alerts', icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
    { id: 'surveys', label: 'Surveys', icon: "M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Change Pulse Analytics</h1>
          <p className="text-slate-400 mt-1">Real-time monitoring of organizational change health</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={selectedJourney}
            onChange={(e) => setSelectedJourney(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100"
          >
            <option value="all">All Journeys</option>
            {mockChangeJourneys.map(journey => (
              <option key={journey.id} value={journey.id}>
                {journey.name}
              </option>
            ))}
          </select>
          
          <button className="bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:from-sky-600 hover:to-blue-600 transition-all">
            <Icon path="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" className="w-4 h-4 inline mr-2" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-sky-500 text-white'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50'
            }`}
          >
            <Icon path={tab.icon} className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <SentimentDashboard journeyId={journeyId} />
            <EarlyWarningAlerts journeyId={journeyId} />
          </div>
          <div className="space-y-6">
            <VelocityTracker journeyId={journeyId} />
            
            {/* Predictive Insights */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">Predictive Insights</h3>
              <div className="space-y-4">
                {relevantInsights.map((insight) => (
                  <div key={insight.id} className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Icon 
                        path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
                        className="w-6 h-6 text-purple-400 mt-1" 
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-100 mb-2">{insight.prediction}</h4>
                        <div className="text-sm text-slate-400 mb-3">
                          Confidence: {(insight.confidence * 100).toFixed(0)}% • 
                          Type: {insight.type.replace('_', ' ')} • 
                          {new Date(insight.createdAt).toLocaleDateString()}
                        </div>
                        
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-slate-300 mb-2">Recommendations:</h5>
                          <ul className="space-y-1">
                            {insight.recommendations.slice(0, 2).map((rec, index) => (
                              <li key={index} className="text-sm text-slate-400 flex items-start gap-2">
                                <Icon path="M9 5l7 7-7 7" className="w-3 h-3 text-sky-400 mt-1 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="text-xs text-slate-500">
                          Based on: {insight.dataPoints.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {activeTab === 'sentiment' && <SentimentDashboard journeyId={journeyId} />}
      {activeTab === 'velocity' && <VelocityTracker journeyId={journeyId} />}
      {activeTab === 'alerts' && <EarlyWarningAlerts journeyId={journeyId} />}
      {activeTab === 'surveys' && <PulseSurveys journeyId={journeyId} />}
    </div>
  );
};

export default PulsePage;