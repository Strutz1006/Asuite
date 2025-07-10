import React from 'react';
import { GlassCard, Icon } from '../../shared/components';
import { mockMarketInsights, mockRiskFactors } from '../../shared/data/mockData';

const InsightsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Market Insights</h1>
          <p className="text-slate-400 mt-1">External market intelligence and strategic risk assessment</p>
        </div>
        <button className="bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold py-2 px-5 rounded-lg shadow-lg hover:from-sky-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all">
          Refresh Data
        </button>
      </div>

      {/* Market Intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockMarketInsights.map((insight, index) => (
          <GlassCard key={index} className="p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold">{insight.title}</h3>
              <div className="flex items-center gap-2">
                <Icon 
                  path={insight.trend === 'up' ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 
                        insight.trend === 'down' ? 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6' : 
                        'M5 12h14'} 
                  className={`w-5 h-5 ${
                    insight.trend === 'up' ? 'text-green-400' : 
                    insight.trend === 'down' ? 'text-red-400' : 
                    'text-slate-400'
                  }`} 
                />
                <span className={`font-bold ${
                  insight.trend === 'up' ? 'text-green-400' : 
                  insight.trend === 'down' ? 'text-red-400' : 
                  'text-slate-400'
                }`}>
                  {insight.value}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-3">{insight.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Confidence: {insight.confidence}%</span>
              <button className="text-sm text-sky-400 hover:text-sky-300">View Details</button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Risk Assessment Matrix */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold mb-4">Strategic Risk Assessment</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="p-3 font-semibold">Risk Factor</th>
                <th className="p-3 font-semibold">Probability</th>
                <th className="p-3 font-semibold">Impact</th>
                <th className="p-3 font-semibold">Mitigation Strategy</th>
                <th className="p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockRiskFactors.map((risk, index) => (
                <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="p-3 font-medium">{risk.name}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            risk.probability >= 60 ? 'bg-red-500' : 
                            risk.probability >= 40 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${risk.probability}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-mono">{risk.probability}%</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      risk.impact === 'High' ? 'bg-red-500/20 text-red-300' : 
                      risk.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' : 
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {risk.impact}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-slate-400">{risk.mitigation}</td>
                  <td className="p-3">
                    <button className="text-sky-400 hover:text-sky-300 text-sm font-medium">
                      Monitor
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Industry Trends */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold mb-4">Industry Trend Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">+23%</div>
            <div className="text-sm text-slate-400">Market Growth</div>
            <div className="text-xs text-slate-500">vs last year</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">78%</div>
            <div className="text-sm text-slate-400">Digital Adoption</div>
            <div className="text-xs text-slate-500">industry average</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">5.2x</div>
            <div className="text-sm text-slate-400">ROI Potential</div>
            <div className="text-xs text-slate-500">on AI investment</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">42%</div>
            <div className="text-sm text-slate-400">ESG Focus</div>
            <div className="text-xs text-slate-500">consumer preference</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">15%</div>
            <div className="text-sm text-slate-400">Supply Chain Risk</div>
            <div className="text-xs text-slate-500">disruption probability</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-sky-400 mb-2">8.5</div>
            <div className="text-sm text-slate-400">Innovation Index</div>
            <div className="text-xs text-slate-500">out of 10</div>
          </div>
        </div>
      </GlassCard>

      {/* Scenario Timeline */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold mb-4">Strategic Timeline Projections</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg">
            <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
            <div className="flex-1">
              <div className="font-medium">Q1 2024: Market Analysis Complete</div>
              <div className="text-sm text-slate-400">Strategic foundation established</div>
            </div>
            <div className="text-sm text-slate-400">3 months</div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <div className="font-medium">Q2 2024: Technology Investment</div>
              <div className="text-sm text-slate-400">AI and automation rollout</div>
            </div>
            <div className="text-sm text-slate-400">6 months</div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <div className="font-medium">Q3-Q4 2024: Market Expansion</div>
              <div className="text-sm text-slate-400">New market entry and scaling</div>
            </div>
            <div className="text-sm text-slate-400">9-12 months</div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <div className="font-medium">2025: ESG Transformation</div>
              <div className="text-sm text-slate-400">Sustainability and governance focus</div>
            </div>
            <div className="text-sm text-slate-400">18+ months</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default InsightsPage;