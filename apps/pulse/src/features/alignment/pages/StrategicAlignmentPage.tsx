import React, { useState } from 'react';
import { GlassCard, Icon } from '../../shared/components';

interface AlignmentMap {
  objective: {
    id: string;
    title: string;
    level: 'corporate' | 'department' | 'team' | 'individual';
    owner: string;
    progress: number;
  };
  linkedKPIs: Array<{
    id: string;
    name: string;
    category: string;
    currentValue: string;
    targetValue: string;
    status: 'on-track' | 'at-risk' | 'critical';
    contribution: number; // How much this KPI contributes to the objective
  }>;
  gaps: Array<{
    type: 'missing-kpi' | 'unlinked-kpi' | 'weak-alignment';
    description: string;
    severity: 'low' | 'medium' | 'high';
    recommendation: string;
  }>;
}

const mockAlignmentData: AlignmentMap[] = [
  {
    objective: {
      id: 'corp-1',
      title: 'Achieve Carbon Neutrality by 2026',
      level: 'corporate',
      owner: 'Executive Team',
      progress: 68
    },
    linkedKPIs: [
      {
        id: '3',
        name: 'ESG Compliance Score',
        category: 'Sustainability',
        currentValue: '88%',
        targetValue: '85%',
        status: 'on-track',
        contribution: 35
      },
      {
        id: '7',
        name: 'Carbon Footprint per Unit',
        category: 'Sustainability',
        currentValue: '2.1 tCO2e',
        targetValue: '1.8 tCO2e',
        status: 'at-risk',
        contribution: 45
      }
    ],
    gaps: [
      {
        type: 'missing-kpi',
        description: 'No KPI tracking renewable energy adoption',
        severity: 'high',
        recommendation: 'Create "Renewable Energy Usage %" KPI to track clean energy transition'
      },
      {
        type: 'weak-alignment',
        description: 'Limited operational efficiency KPIs supporting carbon reduction',
        severity: 'medium',
        recommendation: 'Link "Operational Efficiency" KPI with carbon impact weighting'
      }
    ]
  },
  {
    objective: {
      id: 'dept-1',
      title: 'Operations Carbon Reduction (25%)',
      level: 'department',
      owner: 'Sarah Chen',
      progress: 75
    },
    linkedKPIs: [
      {
        id: '2',
        name: 'Operational Efficiency',
        category: 'Operations',
        currentValue: '94%',
        targetValue: '92%',
        status: 'on-track',
        contribution: 60
      },
      {
        id: '8',
        name: 'Energy Usage per Unit',
        category: 'Operations',
        currentValue: '12.3 kWh',
        targetValue: '10.5 kWh',
        status: 'at-risk',
        contribution: 40
      }
    ],
    gaps: [
      {
        type: 'unlinked-kpi',
        description: 'Waste Reduction Rate KPI exists but not linked to this objective',
        severity: 'medium',
        recommendation: 'Link existing Waste Reduction Rate KPI to strengthen objective support'
      }
    ]
  },
  {
    objective: {
      id: 'dept-2',
      title: 'Customer Satisfaction Excellence',
      level: 'department',
      owner: 'Mike Torres',
      progress: 92
    },
    linkedKPIs: [
      {
        id: '1',
        name: 'Customer Satisfaction Score',
        category: 'Customer',
        currentValue: '9.2/10',
        targetValue: '9.0/10',
        status: 'on-track',
        contribution: 70
      },
      {
        id: '9',
        name: 'Net Promoter Score',
        category: 'Customer',
        currentValue: '68',
        targetValue: '70',
        status: 'at-risk',
        contribution: 30
      }
    ],
    gaps: []
  }
];

const StrategicAlignmentPage: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'map' | 'gaps' | 'impact' | 'recommendations'>('map');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'text-green-400 bg-green-500/20';
      case 'at-risk': return 'text-yellow-400 bg-yellow-500/20';
      case 'critical': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-slate-500 bg-slate-500/10';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'corporate': return "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4";
      case 'department': return "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z";
      case 'team': return "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z";
      case 'individual': return "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z";
      default: return "M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'corporate': return 'text-purple-400 bg-purple-500/20';
      case 'department': return 'text-blue-400 bg-blue-500/20';
      case 'team': return 'text-green-400 bg-green-500/20';
      case 'individual': return 'text-sky-400 bg-sky-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const totalKPIs = mockAlignmentData.reduce((sum, item) => sum + item.linkedKPIs.length, 0);
  const totalGaps = mockAlignmentData.reduce((sum, item) => sum + item.gaps.length, 0);
  const averageAlignment = Math.round(mockAlignmentData.reduce((sum, item) => {
    const kpiCount = item.linkedKPIs.length;
    const maxExpected = item.objective.level === 'corporate' ? 5 : 3;
    return sum + (kpiCount / maxExpected * 100);
  }, 0) / mockAlignmentData.length);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">Strategic Alignment</h2>
          <p className="text-slate-400 mt-2">Connect KPIs to strategic objectives and identify alignment gaps</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Levels</option>
            <option value="corporate">Corporate</option>
            <option value="department">Department</option>
            <option value="team">Team</option>
            <option value="individual">Individual</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Objectives Tracked</p>
              <p className="text-3xl font-bold text-sky-400">{mockAlignmentData.length}</p>
            </div>
            <Icon path="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-sky-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Linked KPIs</p>
              <p className="text-3xl font-bold text-green-400">{totalKPIs}</p>
            </div>
            <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-8 h-8 text-green-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Alignment Gaps</p>
              <p className="text-3xl font-bold text-yellow-400">{totalGaps}</p>
            </div>
            <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" className="w-8 h-8 text-yellow-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Alignment Score</p>
              <p className="text-3xl font-bold text-purple-400">{averageAlignment}%</p>
            </div>
            <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" className="w-8 h-8 text-purple-400" />
          </div>
        </GlassCard>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-slate-800 rounded-lg p-1">
        {[
          { key: 'map', label: 'Alignment Map', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
          { key: 'gaps', label: 'Gap Analysis', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z' },
          { key: 'impact', label: 'Impact Analysis', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
          { key: 'recommendations', label: 'AI Recommendations', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedView(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
              selectedView === tab.key ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon path={tab.icon} className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alignment Map View */}
      {selectedView === 'map' && (
        <div className="space-y-6">
          {mockAlignmentData.map((alignment, index) => (
            <GlassCard key={index} className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Icon 
                    path={getLevelIcon(alignment.objective.level)} 
                    className={`w-6 h-6 ${getLevelColor(alignment.objective.level).split(' ')[0]}`}
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">{alignment.objective.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getLevelColor(alignment.objective.level)}`}>
                        {alignment.objective.level.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">Owner: {alignment.objective.owner}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-sky-400">{alignment.objective.progress}%</div>
                  <div className="text-sm text-slate-400">Progress</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Linked KPIs */}
                <div>
                  <h4 className="text-md font-semibold text-sky-300 mb-4">
                    Supporting KPIs ({alignment.linkedKPIs.length})
                  </h4>
                  <div className="space-y-3">
                    {alignment.linkedKPIs.map((kpi, kpiIndex) => (
                      <div key={kpiIndex} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-medium text-white">{kpi.name}</h5>
                            <p className="text-xs text-slate-400">{kpi.category}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(kpi.status)}`}>
                            {kpi.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Current:</span>
                            <div className="font-mono text-sky-400">{kpi.currentValue}</div>
                          </div>
                          <div>
                            <span className="text-slate-400">Target:</span>
                            <div className="font-mono text-slate-300">{kpi.targetValue}</div>
                          </div>
                          <div>
                            <span className="text-slate-400">Impact:</span>
                            <div className="font-mono text-green-400">{kpi.contribution}%</div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                kpi.status === 'on-track' ? 'bg-green-500' :
                                kpi.status === 'at-risk' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${kpi.contribution}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gaps & Issues */}
                <div>
                  <h4 className="text-md font-semibold text-yellow-300 mb-4">
                    Alignment Gaps ({alignment.gaps.length})
                  </h4>
                  {alignment.gaps.length === 0 ? (
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                      <Icon path="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <p className="text-green-400 font-medium">Excellent Alignment</p>
                      <p className="text-sm text-slate-400">No alignment gaps detected</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {alignment.gaps.map((gap, gapIndex) => (
                        <div key={gapIndex} className={`p-4 rounded-lg border-l-4 ${getSeverityColor(gap.severity)}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon 
                                path={gap.type === 'missing-kpi' ? 'M12 9v2m0 4h.01' : gap.type === 'unlinked-kpi' ? 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' : 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'} 
                                className={`w-4 h-4 ${
                                  gap.severity === 'high' ? 'text-red-400' :
                                  gap.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                                }`}
                              />
                              <span className="text-xs font-medium text-slate-300 uppercase">
                                {gap.type.replace('-', ' ')}
                              </span>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                              gap.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                              gap.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {gap.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-300 mb-2">{gap.description}</p>
                          <p className="text-xs text-slate-400">{gap.recommendation}</p>
                          <div className="mt-3 flex gap-2">
                            <button className="text-xs font-semibold text-sky-400 hover:text-sky-300">
                              Resolve Gap
                            </button>
                            <button className="text-xs font-semibold text-slate-400 hover:text-slate-300">
                              Learn More
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Gap Analysis View */}
      {selectedView === 'gaps' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-sky-300">Gap Summary</h3>
            <div className="space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-red-400">Missing KPIs</h4>
                  <span className="text-2xl font-bold text-red-400">1</span>
                </div>
                <p className="text-sm text-slate-300">Critical metrics not being tracked</p>
              </div>
              
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-yellow-400">Unlinked KPIs</h4>
                  <span className="text-2xl font-bold text-yellow-400">1</span>
                </div>
                <p className="text-sm text-slate-300">Existing KPIs not connected to objectives</p>
              </div>
              
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-blue-400">Weak Alignments</h4>
                  <span className="text-2xl font-bold text-blue-400">1</span>
                </div>
                <p className="text-sm text-slate-300">Indirect or insufficient metric support</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-sky-300">Priority Actions</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-lg border-l-4 border-red-500">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white">Create Renewable Energy KPI</h4>
                  <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-full">HIGH</span>
                </div>
                <p className="text-sm text-slate-400 mb-3">Carbon neutrality objective lacks renewable energy tracking</p>
                <button className="text-sm font-semibold text-sky-400 hover:text-sky-300">
                  Create KPI
                </button>
              </div>
              
              <div className="p-4 bg-slate-800/50 rounded-lg border-l-4 border-yellow-500">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white">Link Waste Reduction KPI</h4>
                  <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded-full">MEDIUM</span>
                </div>
                <p className="text-sm text-slate-400 mb-3">Existing waste KPI should support operations carbon objective</p>
                <button className="text-sm font-semibold text-sky-400 hover:text-sky-300">
                  Create Link
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Impact Analysis View */}
      {selectedView === 'impact' && (
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-6 text-sky-300">KPI Impact on Objectives</h3>
          <div className="space-y-6">
            {mockAlignmentData.map((alignment, index) => (
              <div key={index} className="p-4 bg-slate-800/30 rounded-lg">
                <h4 className="font-semibold text-white mb-4">{alignment.objective.title}</h4>
                <div className="space-y-3">
                  {alignment.linkedKPIs.map((kpi, kpiIndex) => (
                    <div key={kpiIndex} className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          kpi.status === 'on-track' ? 'bg-green-500' :
                          kpi.status === 'at-risk' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="font-medium">{kpi.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm text-slate-400">Impact Weight</div>
                          <div className="font-bold text-sky-400">{kpi.contribution}%</div>
                        </div>
                        <div className="w-24 bg-slate-600 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-sky-500 to-blue-500 h-2 rounded-full"
                            style={{ width: `${kpi.contribution}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* AI Recommendations View */}
      {selectedView === 'recommendations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-sky-300 flex items-center gap-2">
              <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z" className="w-6 h-6" />
              Smart Recommendations
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h4 className="font-semibold text-blue-300 mb-2">Optimization Opportunity</h4>
                <p className="text-sm text-slate-300 mb-3">Based on industry benchmarks, your Customer Satisfaction KPI could benefit from additional leading indicators like "First Contact Resolution Rate" and "Response Time".</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Confidence: 89%</span>
                  <button className="text-sm font-semibold text-blue-400 hover:text-blue-300">
                    Implement
                  </button>
                </div>
              </div>
              
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <h4 className="font-semibold text-green-300 mb-2">Strong Performance</h4>
                <p className="text-sm text-slate-300 mb-3">Your ESG objectives have excellent KPI coverage. Consider creating a best practice template for other sustainability initiatives.</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Confidence: 94%</span>
                  <button className="text-sm font-semibold text-green-400 hover:text-green-300">
                    Create Template
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-sky-300">Predictive Insights</h3>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <h4 className="font-semibold text-yellow-300 mb-2">Risk Prediction</h4>
                <p className="text-sm text-slate-300 mb-3">Current trajectory suggests the "Energy Usage per Unit" KPI may miss its target by 15%. Consider intervention strategies.</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Risk Score: 76%</span>
                  <button className="text-sm font-semibold text-yellow-400 hover:text-yellow-300">
                    View Analysis
                  </button>
                </div>
              </div>
              
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <h4 className="font-semibold text-purple-300 mb-2">Cross-Objective Impact</h4>
                <p className="text-sm text-slate-300 mb-3">Improving operational efficiency could positively impact both carbon reduction and cost optimization objectives by an estimated 12%.</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Impact Score: 82%</span>
                  <button className="text-sm font-semibold text-purple-400 hover:text-purple-300">
                    Explore Synergies
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default StrategicAlignmentPage;