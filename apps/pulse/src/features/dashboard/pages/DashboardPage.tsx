import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard, Icon } from '../../shared/components';
import { 
  mockKPIs, 
  mockKPICategories, 
  mockAnomalyFeed, 
  mockDashboardStats,
  mockHistoricalData 
} from '../../shared/data/mockData';

const DashboardPage: React.FC = () => {
  const [selectedKPI, setSelectedKPI] = useState(0);

  const getKPIStatus = (kpi: typeof mockKPIs[0]) => {
    const current = typeof kpi.value === 'string' ? parseFloat(kpi.value) : kpi.value;
    const target = typeof kpi.target === 'string' ? parseFloat(kpi.target) : kpi.target;
    return current >= target;
  };

  const getVariance = (kpi: typeof mockKPIs[0]) => {
    const current = typeof kpi.value === 'string' ? parseFloat(kpi.value) : kpi.value;
    const target = typeof kpi.target === 'string' ? parseFloat(kpi.target) : kpi.target;
    const variance = ((current - target) / target) * 100;
    return variance > 0 ? `+${variance.toFixed(1)}%` : `${variance.toFixed(1)}%`;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">Performance Command Center</h2>
          <p className="text-slate-400 mt-2">Monitor what matters. Track performance with precision and purpose.</p>
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-sky-400">{mockDashboardStats.totalKPIs}</div>
            <div className="text-xs text-slate-400">Total KPIs</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">{mockDashboardStats.onTrack}</div>
            <div className="text-xs text-slate-400">On Track</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">{mockDashboardStats.atRisk}</div>
            <div className="text-xs text-slate-400">At Risk</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">{mockDashboardStats.critical}</div>
            <div className="text-xs text-slate-400">Critical</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: KPI Overview */}
        <div className="lg:col-span-2 space-y-8">
          {/* KPI Health Overview */}
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">KPI Health Overview</h3>
              <Link 
                to="/kpis" 
                className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
              >
                View All KPIs →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {mockKPIs.map((kpi, index) => {
                const isOnTrack = getKPIStatus(kpi);
                return (
                  <div 
                    key={kpi.id} 
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      isOnTrack ? 'bg-green-500/10 hover:bg-green-500/20' : 'bg-red-500/10 hover:bg-red-500/20'
                    } ${selectedKPI === index ? 'ring-2 ring-sky-500' : ''}`}
                    onClick={() => setSelectedKPI(index)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm text-slate-400 font-medium">{kpi.category}</p>
                      <Icon 
                        path={kpi.trend === 'up' ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'} 
                        className={`w-4 h-4 ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}
                      />
                    </div>
                    <p className="text-sm font-semibold mb-1 line-clamp-2">{kpi.name}</p>
                    <p className="text-xl font-bold mb-2">{kpi.value}{kpi.unit}</p>
                    <div className={`flex items-center text-xs ${isOnTrack ? 'text-green-400' : 'text-red-400'}`}>
                      <span className="font-medium">{isOnTrack ? 'On Track' : 'At Risk'}</span>
                      <span className="ml-2 text-slate-500">({getVariance(kpi)})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* KPI Deep Dive */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4">KPI Deep Dive: {mockKPIs[selectedKPI].name}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400">Current Value</label>
                    <div className="text-2xl font-bold text-sky-400">
                      {mockKPIs[selectedKPI].value}{mockKPIs[selectedKPI].unit}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Target</label>
                    <div className="text-2xl font-bold text-slate-300">
                      {mockKPIs[selectedKPI].target}{mockKPIs[selectedKPI].unit}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Owner:</span>
                    <span className="ml-2 font-medium">{mockKPIs[selectedKPI].owner}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Category:</span>
                    <span className="ml-2 font-medium">{mockKPIs[selectedKPI].category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Last Updated:</span>
                    <span className="ml-2 font-medium">
                      {mockKPIs[selectedKPI].lastUpdated.toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Trend:</span>
                    <span className={`ml-2 font-medium ${
                      mockKPIs[selectedKPI].trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {mockKPIs[selectedKPI].trend === 'up' ? '↗ Improving' : '↘ Declining'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-slate-400 mb-2 block">5-Period Trend</label>
                <div className="h-32 bg-slate-800/50 rounded-lg flex items-end justify-between p-4">
                  {mockHistoricalData[mockKPIs[selectedKPI].id as keyof typeof mockHistoricalData]?.map((point, index) => {
                    const maxValue = Math.max(...(mockHistoricalData[mockKPIs[selectedKPI].id as keyof typeof mockHistoricalData] || []));
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="w-8 bg-sky-500 rounded-t"
                          style={{ height: `${(point / maxValue) * 80}px` }}
                        ></div>
                        <div className="text-xs text-slate-500 mt-1">{point}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <Link
                to={`/kpis/${mockKPIs[selectedKPI].id}`}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                View Details
              </Link>
              <Link
                to={`/kpis/${mockKPIs[selectedKPI].id}/edit`}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Edit KPI
              </Link>
            </div>
          </GlassCard>

          {/* AI Coach */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z" className="w-6 h-6 text-sky-400"/>
              AI Coach
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <h4 className="font-semibold text-red-300 mb-2">Critical Alert</h4>
                <p className="text-sm text-slate-300 mb-3">"Team Morale Index is trending down and below target. Consider launching an engagement survey to identify root causes."</p>
                <button className="text-sm font-semibold text-red-400 hover:text-red-300">Take Action</button>
              </div>
              
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <h4 className="font-semibold text-green-300 mb-2">Opportunity</h4>
                <p className="text-sm text-slate-300 mb-3">"Customer satisfaction is exceeding targets. Consider leveraging this for case studies and referrals."</p>
                <button className="text-sm font-semibold text-green-400 hover:text-green-300">Explore</button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Performance & Feed */}
        <div className="space-y-8">
          {/* Category Performance */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4">Performance by Category</h3>
            <div className="grid grid-cols-1 gap-4">
              {mockKPICategories.map(category => (
                <div key={category.name} className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{category.name}</h4>
                    <span className={`text-sm font-mono ${category.color}`}>
                      {category.onTrack}/{category.count}
                    </span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-sky-500 h-2 rounded-full"
                      style={{ width: `${(category.onTrack / category.count) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {Math.round((category.onTrack / category.count) * 100)}% on track
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
          
          {/* Anomaly Feed */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4">Live Anomaly Feed</h3>
            <div className="space-y-4">
              {mockAnomalyFeed.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <Icon 
                    path={item.icon} 
                    className={`w-5 h-5 mt-1 flex-shrink-0 ${
                      item.severity === 'high' ? 'text-red-400' : 
                      item.severity === 'positive' ? 'text-green-400' : 'text-blue-400'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm">{item.text}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-slate-500">{item.time}</p>
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        item.severity === 'high' ? 'bg-red-500/20 text-red-300' :
                        item.severity === 'positive' ? 'bg-green-500/20 text-green-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;