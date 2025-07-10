import React, { useState } from 'react';
import { GlassCard, Icon } from '../../shared/components';
import { mockCompanyObjective, mockDepartmentObjectives, mockIndividualGoals } from '../../shared/data/mockData';

const AnalyticsPage: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const allGoals = [mockCompanyObjective, ...mockDepartmentObjectives, ...mockIndividualGoals];
  
  const analytics = {
    totalGoals: allGoals.length,
    onTrackGoals: allGoals.filter(g => g.status === 'on-track').length,
    atRiskGoals: allGoals.filter(g => g.status === 'at-risk').length,
    completedGoals: allGoals.filter(g => g.status === 'completed').length,
    averageProgress: Math.round(allGoals.reduce((sum, g) => sum + g.progress, 0) / allGoals.length),
    alignmentScore: 87,
    goalClarity: 92,
    resourceAllocation: 78,
    stakeholderEngagement: 85
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Analytics & Insights</h1>
          <p className="text-slate-400 mt-1">Track performance and alignment across your organization</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d', '1y'].map(range => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range as any)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeRange === range
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Goals</p>
              <p className="text-3xl font-bold text-slate-100">{analytics.totalGoals}</p>
            </div>
            <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-sky-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">On Track</p>
              <p className="text-3xl font-bold text-green-400">{analytics.onTrackGoals}</p>
            </div>
            <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-8 h-8 text-green-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">At Risk</p>
              <p className="text-3xl font-bold text-yellow-400">{analytics.atRiskGoals}</p>
            </div>
            <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0l-5.898 6.5c-.77.833.192 2.5 1.732 2.5z" className="w-8 h-8 text-yellow-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Avg Progress</p>
              <p className="text-3xl font-bold text-sky-400">{analytics.averageProgress}%</p>
            </div>
            <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" className="w-8 h-8 text-sky-400" />
          </div>
        </GlassCard>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alignment Health Score */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-slate-100 mb-4">Alignment Health Score</h3>
          <div className="text-center">
            <div className="text-6xl font-bold text-sky-400 mb-2">{analytics.alignmentScore}%</div>
            <p className="text-slate-400 mb-6">Overall Strategic Alignment</p>
            
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Goal Clarity</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${analytics.goalClarity}%` }}></div>
                  </div>
                  <span className="text-green-400 font-mono w-8">{analytics.goalClarity}%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Resource Allocation</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${analytics.resourceAllocation}%` }}></div>
                  </div>
                  <span className="text-yellow-400 font-mono w-8">{analytics.resourceAllocation}%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Stakeholder Engagement</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${analytics.stakeholderEngagement}%` }}></div>
                  </div>
                  <span className="text-blue-400 font-mono w-8">{analytics.stakeholderEngagement}%</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Goal Completion Trends */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-slate-100 mb-4">Goal Completion Trends</h3>
          <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" className="w-12 h-12 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-500">Interactive goal progress charts and forecasting would be displayed here</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goal Distribution */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-slate-100 mb-4">Goal Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Company Level</span>
              <span className="text-sky-400 font-mono">1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Department Level</span>
              <span className="text-sky-400 font-mono">3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Individual Level</span>
              <span className="text-sky-400 font-mono">3</span>
            </div>
          </div>
        </GlassCard>

        {/* Status Breakdown */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-slate-100 mb-4">Status Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                On Track
              </span>
              <span className="text-green-400 font-mono">{analytics.onTrackGoals}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                At Risk
              </span>
              <span className="text-yellow-400 font-mono">{analytics.atRiskGoals}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Completed
              </span>
              <span className="text-blue-400 font-mono">{analytics.completedGoals}</span>
            </div>
          </div>
        </GlassCard>

        {/* Performance Insights */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-slate-100 mb-4">Performance Insights</h3>
          <div className="space-y-4">
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-semibold text-sm">Strong Performance</span>
              </div>
              <p className="text-xs text-slate-300">Operations team exceeding targets</p>
            </div>
            
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0l-5.898 6.5c-.77.833.192 2.5 1.732 2.5z" className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-semibold text-sm">Attention Needed</span>
              </div>
              <p className="text-xs text-slate-300">Facilities timeline requires adjustment</p>
            </div>
            
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z" className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-semibold text-sm">Opportunity</span>
              </div>
              <p className="text-xs text-slate-300">Cross-team collaboration potential</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default AnalyticsPage;