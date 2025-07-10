import React, { useState } from 'react';
import { GlassCard, Icon } from '../../shared/components';
import { mockKPIs, mockKPICategories, mockDashboardStats } from '../../shared/data/mockData';

const AnalyticsPage: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const performanceMetrics = {
    overallHealth: mockDashboardStats.avgPerformance,
    aboveTarget: 68,
    onTarget: 21,
    belowTarget: 11,
    trendingUp: mockKPIs.filter(kpi => kpi.trend === 'up').length,
    trendingDown: mockKPIs.filter(kpi => kpi.trend === 'down').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">The Observatory: Analytics & Trends</h1>
          <p className="text-slate-400 mt-1">Visualize performance, detect anomalies, and see how your KPIs connect to strategic goals</p>
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
              <p className="text-slate-400 text-sm">Total KPIs</p>
              <p className="text-3xl font-bold text-slate-100">{mockDashboardStats.totalKPIs}</p>
            </div>
            <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" className="w-8 h-8 text-sky-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Trending Up</p>
              <p className="text-3xl font-bold text-green-400">{performanceMetrics.trendingUp}</p>
            </div>
            <Icon path="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" className="w-8 h-8 text-green-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Trending Down</p>
              <p className="text-3xl font-bold text-red-400">{performanceMetrics.trendingDown}</p>
            </div>
            <Icon path="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" className="w-8 h-8 text-red-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Health Score</p>
              <p className="text-3xl font-bold text-sky-400">{performanceMetrics.overallHealth}%</p>
            </div>
            <Icon path="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" className="w-8 h-8 text-sky-400" />
          </div>
        </GlassCard>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Heatmap */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-slate-100 mb-4">Performance Heatmap</h3>
          <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" className="w-12 h-12 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-500">KPI Performance Heatmap Visualization</p>
            </div>
          </div>
        </GlassCard>

        {/* Correlation Analysis */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-slate-100 mb-4">Correlation Analysis</h3>
          <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Icon path="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" className="w-12 h-12 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-500">KPI Correlation Matrix & Insights</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Trend Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Multi-KPI Trend Analysis</h3>
            <div className="h-80 bg-slate-800/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Icon path="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-500">Multi-KPI Trend Chart with Forecasting</p>
              </div>
            </div>
          </GlassCard>
        </div>
        
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Performance Score</h3>
            <div className="text-center">
              <div className="text-5xl font-bold text-sky-400 mb-2">{performanceMetrics.overallHealth}%</div>
              <p className="text-slate-400 mb-6">Overall KPI Health</p>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Above Target</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${performanceMetrics.aboveTarget}%` }}></div>
                    </div>
                    <span className="text-green-400 font-mono text-xs w-8">{performanceMetrics.aboveTarget}%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">On Target</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${performanceMetrics.onTarget}%` }}></div>
                    </div>
                    <span className="text-blue-400 font-mono text-xs w-8">{performanceMetrics.onTarget}%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Below Target</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-700 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${performanceMetrics.belowTarget}%` }}></div>
                    </div>
                    <span className="text-red-400 font-mono text-xs w-8">{performanceMetrics.belowTarget}%</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Predictive Alerts</h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="text-sm font-medium text-yellow-300 flex items-center gap-2">
                  <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" className="w-4 h-4" />
                  Forecast Warning
                </div>
                <div className="text-xs text-slate-400 mt-1">Revenue growth may slow next quarter based on current trends</div>
              </div>
              
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="text-sm font-medium text-green-300 flex items-center gap-2">
                  <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-4 h-4" />
                  Positive Trend
                </div>
                <div className="text-xs text-slate-400 mt-1">ESG compliance score trending strongly upward</div>
              </div>
              
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="text-sm font-medium text-blue-300 flex items-center gap-2">
                  <Icon path="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4" />
                  Insight Available
                </div>
                <div className="text-xs text-slate-400 mt-1">Strong correlation found between CSAT and retention</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Category Performance Breakdown */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-slate-100 mb-4">Category Performance Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockKPICategories.map(category => (
            <div key={category.name} className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-slate-100">{category.name}</h4>
                <span className={`text-lg font-bold ${category.color}`}>
                  {Math.round((category.onTrack / category.count) * 100)}%
                </span>
              </div>
              
              <div className="mb-3">
                <div className="w-full bg-slate-600 rounded-full h-3">
                  <div 
                    className="bg-sky-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(category.onTrack / category.count) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">{category.onTrack} of {category.count} on track</span>
                <span className={`font-medium ${
                  (category.onTrack / category.count) >= 0.8 ? 'text-green-400' :
                  (category.onTrack / category.count) >= 0.6 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {(category.onTrack / category.count) >= 0.8 ? 'Excellent' :
                   (category.onTrack / category.count) >= 0.6 ? 'Good' : 'Needs Attention'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Integration Status */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-slate-100 mb-4">Aesyros Suite Integration</h3>
        <p className="text-slate-400 text-sm mb-6">Pulse works better with other Aesyros tools for complete strategic oversight.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Icon path="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945" className="w-6 h-6 text-sky-400" />
              <h4 className="font-semibold">Align Integration</h4>
            </div>
            <p className="text-sm text-slate-400 mb-3">Sync KPI progress to strategic goals and OKRs automatically.</p>
            <div className="text-xs text-green-400">✓ 12 KPIs linked to strategic objectives</div>
          </div>
          
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Icon path="M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-6 h-6 text-sky-400" />
              <h4 className="font-semibold">Foresight Integration</h4>
            </div>
            <p className="text-sm text-slate-400 mb-3">Simulate how KPI changes affect strategic scenarios.</p>
            <div className="text-xs text-yellow-400">⚠ 3 KPIs need scenario modeling</div>
          </div>
          
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Icon path="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-6 h-6 text-sky-400" />
              <h4 className="font-semibold">Flow Integration</h4>
            </div>
            <p className="text-sm text-slate-400 mb-3">Ensure KPIs are backed by strong, measurable processes.</p>
            <div className="text-xs text-blue-400">◯ Ready to connect processes</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default AnalyticsPage;