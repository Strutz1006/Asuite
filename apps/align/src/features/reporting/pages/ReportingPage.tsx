import React, { useState } from 'react';
import { GlassCard, Icon } from '../../shared/components';

interface CascadeNode {
  id: string;
  title: string;
  level: 'corporate' | 'department' | 'team' | 'individual';
  progress: number;
  status: 'on-track' | 'at-risk' | 'completed' | 'delayed';
  owner: string;
  children: CascadeNode[];
}

const mockCascadeData: CascadeNode[] = [
  {
    id: 'corp-1',
    title: 'Achieve Carbon Neutrality by 2026',
    level: 'corporate',
    progress: 68,
    status: 'on-track',
    owner: 'Executive Team',
    children: [
      {
        id: 'dept-1',
        title: 'Operations Carbon Reduction (25%)',
        level: 'department',
        progress: 75,
        status: 'on-track',
        owner: 'Sarah Chen',
        children: [
          {
            id: 'team-1',
            title: 'Manufacturing Efficiency Program',
            level: 'team',
            progress: 82,
            status: 'on-track',
            owner: 'Manufacturing Team',
            children: [
              {
                id: 'ind-1',
                title: 'Q4 Energy Audit Completion',
                level: 'individual',
                progress: 90,
                status: 'on-track',
                owner: 'Alex Kim',
                children: []
              },
              {
                id: 'ind-2',
                title: 'Equipment Optimization',
                level: 'individual',
                progress: 74,
                status: 'on-track',
                owner: 'Jordan Martinez',
                children: []
              }
            ]
          },
          {
            id: 'team-2',
            title: 'Waste Reduction Initiative',
            level: 'team',
            progress: 65,
            status: 'at-risk',
            owner: 'Facilities Team',
            children: [
              {
                id: 'ind-3',
                title: 'Recycling Program Expansion',
                level: 'individual',
                progress: 45,
                status: 'at-risk',
                owner: 'Maria Garcia',
                children: []
              }
            ]
          }
        ]
      },
      {
        id: 'dept-2',
        title: 'R&D Sustainable Innovation',
        level: 'department',
        progress: 45,
        status: 'on-track',
        owner: 'Mike Torres',
        children: [
          {
            id: 'team-3',
            title: 'Green Product Development',
            level: 'team',
            progress: 52,
            status: 'on-track',
            owner: 'Product Team',
            children: [
              {
                id: 'ind-4',
                title: 'Sustainable Material Research',
                level: 'individual',
                progress: 60,
                status: 'on-track',
                owner: 'Jordan Lee',
                children: []
              }
            ]
          }
        ]
      },
      {
        id: 'dept-3',
        title: 'Supply Chain Sustainability',
        level: 'department',
        progress: 35,
        status: 'at-risk',
        owner: 'Lisa Park',
        children: [
          {
            id: 'team-4',
            title: 'Vendor Assessment Program',
            level: 'team',
            progress: 25,
            status: 'delayed',
            owner: 'Procurement Team',
            children: [
              {
                id: 'ind-5',
                title: 'Carbon Footprint Analysis',
                level: 'individual',
                progress: 20,
                status: 'delayed',
                owner: 'David Wilson',
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
];

const ReportingPage: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'cascade' | 'alignment' | 'performance' | 'risks'>('cascade');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'current' | 'quarterly' | 'annual'>('current');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-500';
      case 'at-risk': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'delayed': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'corporate': return 'border-purple-400 bg-purple-500/10';
      case 'department': return 'border-blue-400 bg-blue-500/10';
      case 'team': return 'border-green-400 bg-green-500/10';
      case 'individual': return 'border-sky-400 bg-sky-500/10';
      default: return 'border-slate-400 bg-slate-500/10';
    }
  };

  const renderCascadeNode = (node: CascadeNode, depth: number = 0, isLast: boolean = true) => {
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={node.id} className="relative">
        {/* Connection Lines */}
        {depth > 0 && (
          <>
            <div className="absolute -left-8 top-12 w-6 h-px bg-slate-600"></div>
            {!isLast && (
              <div className="absolute -left-8 top-12 w-px h-full bg-slate-600"></div>
            )}
          </>
        )}
        
        <div className={`${depth > 0 ? 'ml-8' : ''} mb-6`}>
          <div className={`p-4 rounded-lg border-2 ${getLevelColor(node.level)} relative`}>
            {/* Level indicator */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(node.status)}`}></div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  node.level === 'corporate' ? 'text-purple-400 bg-purple-500/20' :
                  node.level === 'department' ? 'text-blue-400 bg-blue-500/20' :
                  node.level === 'team' ? 'text-green-400 bg-green-500/20' :
                  'text-sky-400 bg-sky-500/20'
                }`}>
                  {node.level.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-sky-400">{node.progress}%</span>
                <div className="w-16 bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getStatusColor(node.status)}`}
                    style={{ width: `${node.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <h3 className="font-semibold text-white mb-2">{node.title}</h3>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Owner: {node.owner}</span>
              <span className={`font-medium ${
                node.status === 'on-track' ? 'text-green-400' :
                node.status === 'at-risk' ? 'text-yellow-400' :
                node.status === 'completed' ? 'text-blue-400' :
                'text-red-400'
              }`}>
                {node.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>
            
            {/* Progress contribution indicator */}
            {depth > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-600">
                <div className="text-xs text-slate-500">
                  Contributes {Math.round((node.progress / 100) * 25)}% to parent objective
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Render children */}
        {hasChildren && (
          <div className="relative">
            {node.children.map((child, index) => 
              renderCascadeNode(child, depth + 1, index === node.children.length - 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const alignmentMetrics = {
    overallAlignment: 87,
    visionAlignment: 92,
    strategicFocus: 85,
    resourceAlignment: 78,
    executionQuality: 89,
    riskMitigation: 76
  };

  const performanceData = {
    departmentPerformance: [
      { name: 'Operations', progress: 75, trend: '+5%', status: 'on-track' },
      { name: 'R&D', progress: 45, trend: '+12%', status: 'on-track' },
      { name: 'Supply Chain', progress: 35, trend: '-3%', status: 'at-risk' },
      { name: 'Marketing', progress: 80, trend: '+8%', status: 'on-track' }
    ],
    keyMetrics: {
      objectivesOnTrack: 12,
      objectivesAtRisk: 4,
      objectivesCompleted: 3,
      averageProgress: 64,
      alignmentScore: 87,
      engagementScore: 82
    }
  };

  const riskData = [
    {
      id: 'risk-1',
      title: 'Supply Chain Timeline Delays',
      impact: 'High',
      probability: 'Medium',
      affected: ['dept-3', 'team-4'],
      mitigation: 'Accelerate vendor assessment process',
      status: 'active'
    },
    {
      id: 'risk-2',
      title: 'Resource Allocation Gaps',
      impact: 'Medium',
      probability: 'Low',
      affected: ['team-2'],
      mitigation: 'Reallocate resources from ahead-of-schedule projects',
      status: 'monitoring'
    },
    {
      id: 'risk-3',
      title: 'Technology Integration Challenges',
      impact: 'Low',
      probability: 'High',
      affected: ['ind-4'],
      mitigation: 'Provide additional technical training',
      status: 'mitigated'
    }
  ];

  return (
    <div className="min-h-screen space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-100">Strategic Reporting & Analysis</h2>
        <div className="flex items-center gap-4">
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none"
          >
            <option value="current">Current Period</option>
            <option value="quarterly">Quarterly View</option>
            <option value="annual">Annual View</option>
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-slate-800 rounded-lg p-1">
        {[
          { key: 'cascade', label: 'Cascade View', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
          { key: 'alignment', label: 'Alignment Report', icon: 'M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          { key: 'performance', label: 'Performance', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
          { key: 'risks', label: 'Risk Analysis', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0l-5.898 6.5c-.77.833.192 2.5 1.732 2.5z' }
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

      {/* Cascade View */}
      {selectedView === 'cascade' && (
        <div className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-6 h-6 text-sky-400" />
              <h3 className="text-xl font-semibold text-sky-300">Strategic Objective Cascade</h3>
            </div>
            
            <div className="mb-6 p-4 bg-slate-800/50 rounded-lg">
              <h4 className="font-medium text-white mb-2">Cascade Legend</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span className="text-purple-400">Corporate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-blue-400">Department</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-green-400">Team</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-sky-500 rounded"></div>
                  <span className="text-sky-400">Individual</span>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              {mockCascadeData.map(node => renderCascadeNode(node))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Alignment Report */}
      {selectedView === 'alignment' && (
        <div className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Icon path="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-6 h-6 text-sky-400" />
              <h3 className="text-xl font-semibold text-sky-300">Strategic Alignment Assessment</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-medium text-white mb-4">Overall Alignment Score</h4>
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-sky-400">{alignmentMetrics.overallAlignment}%</div>
                  <p className="text-slate-400">Strategic Alignment Health</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-white mb-4">Alignment Dimensions</h4>
                <div className="space-y-4">
                  {Object.entries(alignmentMetrics).slice(1).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-sky-500 to-blue-500 h-2 rounded-full" 
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                        <span className="text-sky-400 font-mono w-8 text-sm">{value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-4">
              <h4 className="font-medium text-white mb-3">Vision-Strategy Alignment</h4>
              <div className="text-2xl font-bold text-green-400 mb-1">92%</div>
              <p className="text-xs text-slate-400">Objectives clearly support organizational vision</p>
            </GlassCard>
            
            <GlassCard className="p-4">
              <h4 className="font-medium text-white mb-3">Resource Optimization</h4>
              <div className="text-2xl font-bold text-yellow-400 mb-1">78%</div>
              <p className="text-xs text-slate-400">Resources allocated to highest impact objectives</p>
            </GlassCard>
            
            <GlassCard className="p-4">
              <h4 className="font-medium text-white mb-3">Execution Quality</h4>
              <div className="text-2xl font-bold text-sky-400 mb-1">89%</div>
              <p className="text-xs text-slate-400">Objectives have clear metrics and accountability</p>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Performance View */}
      {selectedView === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Object.entries(performanceData.keyMetrics).map(([key, value]) => (
              <GlassCard key={key} className="p-4">
                <div className="text-sm text-slate-400 mb-1">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </div>
                <div className="text-2xl font-bold text-sky-400">{value}{key.includes('Score') ? '%' : ''}</div>
              </GlassCard>
            ))}
          </div>
          
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Department Performance</h3>
            <div className="space-y-4">
              {performanceData.departmentPerformance.map(dept => (
                <div key={dept.name} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(dept.status)}`}></div>
                    <span className="font-medium text-white">{dept.name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-sm text-slate-400">Progress</div>
                      <div className="font-mono text-sky-400">{dept.progress}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-400">Trend</div>
                      <div className={`font-mono ${dept.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {dept.trend}
                      </div>
                    </div>
                    <div className="w-24 bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getStatusColor(dept.status)}`}
                        style={{ width: `${dept.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Risk Analysis */}
      {selectedView === 'risks' && (
        <div className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0l-5.898 6.5c-.77.833.192 2.5 1.732 2.5z" className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-semibold text-sky-300">Risk Analysis & Mitigation</h3>
            </div>
            
            <div className="space-y-4">
              {riskData.map(risk => (
                <div key={risk.id} className="p-4 bg-slate-800/50 rounded-lg border-l-4 border-yellow-500">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-white">{risk.title}</h4>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      risk.status === 'active' ? 'bg-red-500/20 text-red-400' :
                      risk.status === 'monitoring' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {risk.status.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <span className="text-xs text-slate-400">Impact:</span>
                      <div className={`text-sm font-medium ${
                        risk.impact === 'High' ? 'text-red-400' :
                        risk.impact === 'Medium' ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {risk.impact}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Probability:</span>
                      <div className={`text-sm font-medium ${
                        risk.probability === 'High' ? 'text-red-400' :
                        risk.probability === 'Medium' ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {risk.probability}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Affected Objectives:</span>
                      <div className="text-sm font-medium text-slate-300">{risk.affected.length}</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-slate-300">
                    <span className="text-slate-400">Mitigation:</span> {risk.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default ReportingPage;