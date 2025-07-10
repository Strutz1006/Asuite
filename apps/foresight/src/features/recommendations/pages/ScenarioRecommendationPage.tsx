import React, { useState } from 'react';
import { GlassCard, Icon } from '../../shared/components';

interface RecommendationEngine {
  id: string;
  name: string;
  type: 'high-impact' | 'risk-mitigation' | 'optimization' | 'exploration';
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  scenario: {
    title: string;
    description: string;
    estimatedImpact: {
      revenue: string;
      cost: string;
      timeline: string;
      probability: number;
    };
    levers: Array<{
      name: string;
      currentValue: number;
      suggestedValue: number;
      unit: string;
      rationale: string;
    }>;
  };
  basedOn: string[];
  riskFactors: Array<{
    factor: string;
    severity: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
  similarPastResults: Array<{
    scenarioName: string;
    outcome: string;
    date: string;
  }>;
}

const mockRecommendations: RecommendationEngine[] = [
  {
    id: 'rec-1',
    name: 'Accelerated Growth Strategy',
    type: 'high-impact',
    confidence: 87,
    priority: 'high',
    scenario: {
      title: 'Product Development + Marketing Acceleration',
      description: 'Increase R&D investment by 25% while boosting marketing spend by 40% to capture emerging market opportunities.',
      estimatedImpact: {
        revenue: '+28% over 18 months',
        cost: '+$4.2M initial investment',
        timeline: '18 months to break-even',
        probability: 74
      },
      levers: [
        {
          name: 'R&D Investment',
          currentValue: 12,
          suggestedValue: 15,
          unit: '% of revenue',
          rationale: 'Market analysis shows 3-month window for competitive advantage'
        },
        {
          name: 'Marketing Budget',
          currentValue: 8,
          suggestedValue: 11.2,
          unit: '% of revenue',
          rationale: 'Customer acquisition cost at historic low, maximize reach'
        },
        {
          name: 'Sales Team Size',
          currentValue: 45,
          suggestedValue: 58,
          unit: 'headcount',
          rationale: 'Support increased demand from marketing initiatives'
        }
      ]
    },
    basedOn: [
      'Historical performance during market expansions',
      'Competitor analysis showing similar successful strategies',
      'Current market conditions favoring growth investments'
    ],
    riskFactors: [
      {
        factor: 'Market saturation faster than expected',
        severity: 'medium',
        mitigation: 'Implement quarterly market assessment checkpoints'
      },
      {
        factor: 'Talent acquisition challenges',
        severity: 'low',
        mitigation: 'Partner with specialized recruiting firms'
      }
    ],
    similarPastResults: [
      { scenarioName: 'Q3 2022 Growth Push', outcome: '+22% revenue achieved', date: '2022-09' },
      { scenarioName: 'New Market Entry 2021', outcome: '+15% market share', date: '2021-06' }
    ]
  },
  {
    id: 'rec-2',
    name: 'Operational Efficiency Focus',
    type: 'optimization',
    confidence: 92,
    priority: 'high',
    scenario: {
      title: 'Process Automation + Cost Optimization',
      description: 'Invest in automation tools while streamlining operations to improve margins without sacrificing quality.',
      estimatedImpact: {
        revenue: '+5% through efficiency gains',
        cost: '-15% operational expenses',
        timeline: '12 months to full implementation',
        probability: 89
      },
      levers: [
        {
          name: 'Automation Investment',
          currentValue: 2.5,
          suggestedValue: 4.8,
          unit: '% of revenue',
          rationale: 'ROI analysis shows 18-month payback period'
        },
        {
          name: 'Process Efficiency',
          currentValue: 78,
          suggestedValue: 92,
          unit: '% efficiency score',
          rationale: 'Eliminate 3 identified bottlenecks in current workflow'
        },
        {
          name: 'Vendor Consolidation',
          currentValue: 47,
          suggestedValue: 32,
          unit: 'number of vendors',
          rationale: 'Consolidate for better negotiating power and reduced overhead'
        }
      ]
    },
    basedOn: [
      'Successful automation projects in similar industries',
      'Internal efficiency audit findings',
      'Benchmark analysis against top performers'
    ],
    riskFactors: [
      {
        factor: 'Employee resistance to automation',
        severity: 'medium',
        mitigation: 'Comprehensive change management and retraining programs'
      },
      {
        factor: 'Technology integration complexity',
        severity: 'low',
        mitigation: 'Phased rollout with pilot programs'
      }
    ],
    similarPastResults: [
      { scenarioName: 'Supply Chain Optimization 2023', outcome: '-12% costs achieved', date: '2023-03' },
      { scenarioName: 'HR Process Automation', outcome: '35% time savings', date: '2022-11' }
    ]
  },
  {
    id: 'rec-3',
    name: 'Risk Mitigation Strategy',
    type: 'risk-mitigation',
    confidence: 79,
    priority: 'medium',
    scenario: {
      title: 'Diversification + Contingency Planning',
      description: 'Reduce dependency on primary market by diversifying revenue streams and building stronger contingency reserves.',
      estimatedImpact: {
        revenue: '+8% from new channels',
        cost: '+$1.8M in contingency reserves',
        timeline: '24 months for full diversification',
        probability: 82
      },
      levers: [
        {
          name: 'Market Diversification',
          currentValue: 15,
          suggestedValue: 35,
          unit: '% revenue from secondary markets',
          rationale: 'Reduce single-market dependency from 85% to 65%'
        },
        {
          name: 'Cash Reserves',
          currentValue: 3.2,
          suggestedValue: 6.5,
          unit: 'months of operating expenses',
          rationale: 'Industry best practice for economic uncertainty periods'
        },
        {
          name: 'Supplier Diversity',
          currentValue: 23,
          suggestedValue: 40,
          unit: '% from alternative suppliers',
          rationale: 'Reduce supply chain risk through diversification'
        }
      ]
    },
    basedOn: [
      'Economic uncertainty indicators',
      'Supply chain vulnerability assessment',
      'Historical recession impact analysis'
    ],
    riskFactors: [
      {
        factor: 'Slower growth during transition period',
        severity: 'medium',
        mitigation: 'Maintain core market focus while building alternatives'
      },
      {
        factor: 'Increased complexity management',
        severity: 'low',
        mitigation: 'Invest in management systems and processes'
      }
    ],
    similarPastResults: [
      { scenarioName: 'COVID Response 2020', outcome: 'Maintained 95% revenue', date: '2020-04' },
      { scenarioName: 'Supply Chain Backup 2021', outcome: 'Zero disruption days', date: '2021-08' }
    ]
  }
];

const ScenarioRecommendationPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [_selectedRecommendation, setSelectedRecommendation] = useState<RecommendationEngine | null>(null);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'high-impact': return 'text-green-400 bg-green-500/20';
      case 'risk-mitigation': return 'text-yellow-400 bg-yellow-500/20';
      case 'optimization': return 'text-blue-400 bg-blue-500/20';
      case 'exploration': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-green-500 bg-green-500/10';
      default: return 'border-slate-500 bg-slate-500/10';
    }
  };

  const filteredRecommendations = selectedType === 'all' 
    ? mockRecommendations 
    : mockRecommendations.filter(rec => rec.type === selectedType);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">Scenario Recommendation Engine</h2>
          <p className="text-slate-400 mt-2">AI-powered suggestions based on past simulations and market analysis</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="high-impact">High Impact</option>
            <option value="optimization">Optimization</option>
            <option value="risk-mitigation">Risk Mitigation</option>
            <option value="exploration">Exploration</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors">
            <Icon path="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" className="w-4 h-4" />
            Refresh Recommendations
          </button>
        </div>
      </div>

      {/* ML Engine Status */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-sky-300 flex items-center gap-2">
          <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z" className="w-6 h-6" />
          ML Recommendation Engine Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">1,247</div>
            <div className="text-sm text-slate-400">Scenarios Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-sky-400">94%</div>
            <div className="text-sm text-slate-400">Prediction Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">3</div>
            <div className="text-sm text-slate-400">New Recommendations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">47min</div>
            <div className="text-sm text-slate-400">Last Model Update</div>
          </div>
        </div>
      </GlassCard>

      {/* Recommendations List */}
      <div className="space-y-6">
        {filteredRecommendations.map((recommendation, index) => (
          <GlassCard key={index} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <Icon 
                  path={
                    recommendation.type === 'high-impact' ? 'M13 10V3L4 14h7v7l9-11h-7z' :
                    recommendation.type === 'risk-mitigation' ? 'M9 12l2 2 4-4m5.5-1.5a8.001 8.001 0 10-14.143 5.143' :
                    recommendation.type === 'optimization' ? 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4' :
                    'M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                  } 
                  className="w-8 h-8 text-sky-400" 
                />
                <div>
                  <h3 className="text-xl font-semibold text-white">{recommendation.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getTypeColor(recommendation.type)}`}>
                      {recommendation.type.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPriorityColor(recommendation.priority)}`}>
                      {recommendation.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-sky-400">{recommendation.confidence}%</div>
                <div className="text-sm text-slate-400">Confidence</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sky-300 mb-2">{recommendation.scenario.title}</h4>
                  <p className="text-slate-400 text-sm">{recommendation.scenario.description}</p>
                </div>

                <div>
                  <h5 className="font-medium text-white mb-2">Projected Impact</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Revenue:</span>
                      <span className="text-green-400 font-mono">{recommendation.scenario.estimatedImpact.revenue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cost:</span>
                      <span className="text-red-400 font-mono">{recommendation.scenario.estimatedImpact.cost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Timeline:</span>
                      <span className="text-slate-300 font-mono">{recommendation.scenario.estimatedImpact.timeline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Success Probability:</span>
                      <span className="text-sky-400 font-mono">{recommendation.scenario.estimatedImpact.probability}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-white mb-2">Key Levers ({recommendation.scenario.levers.length})</h5>
                  <div className="space-y-2">
                    {recommendation.scenario.levers.slice(0, 2).map((lever, leverIndex) => (
                      <div key={leverIndex} className="p-2 bg-slate-800/50 rounded text-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{lever.name}</span>
                          <span className="text-sky-400">
                            {lever.currentValue}{lever.unit} → {lever.suggestedValue}{lever.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                    {recommendation.scenario.levers.length > 2 && (
                      <div className="text-xs text-slate-500 text-center">
                        +{recommendation.scenario.levers.length - 2} more levers
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-white mb-2">Risk Factors</h5>
                  <div className="space-y-2">
                    {recommendation.riskFactors.map((risk, riskIndex) => (
                      <div key={riskIndex} className={`p-3 rounded-lg border-l-4 ${getRiskColor(risk.severity)}`}>
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium text-white">{risk.factor}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            risk.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                            risk.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {risk.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{risk.mitigation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-white mb-2">Similar Past Results</h5>
                  <div className="space-y-2">
                    {recommendation.similarPastResults.map((result, resultIndex) => (
                      <div key={resultIndex} className="p-2 bg-slate-800/50 rounded text-sm">
                        <div className="font-medium text-slate-200">{result.scenarioName}</div>
                        <div className="text-xs text-green-400">{result.outcome}</div>
                        <div className="text-xs text-slate-500">{result.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-600">
              <button 
                onClick={() => setSelectedRecommendation(recommendation)}
                className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
              >
                <Icon path="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" className="w-4 h-4" />
                View Details
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-4 h-4" />
                Implement Scenario
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                <Icon path="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" className="w-4 h-4" />
                Save for Later
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* ML Insights */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-sky-300">ML Model Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h4 className="font-semibold text-blue-300 mb-2">Top Success Pattern</h4>
            <p className="text-sm text-slate-300">Scenarios combining efficiency improvements with moderate growth investments show 89% success rate</p>
          </div>
          
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <h4 className="font-semibold text-yellow-300 mb-2">Risk Alert</h4>
            <p className="text-sm text-slate-300">High-leverage scenarios in current market conditions have shown 23% higher failure rate</p>
          </div>
          
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <h4 className="font-semibold text-green-300 mb-2">Emerging Opportunity</h4>
            <p className="text-sm text-slate-300">New market analysis suggests 40% improvement in success rates for international expansion scenarios</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default ScenarioRecommendationPage;