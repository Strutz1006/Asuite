import React, { useState } from 'react';

// Helper components
const Icon = ({ path, className = 'w-6 h-6' }: { path: string; className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
  </svg>
);

const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-slate-800/60 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-lg ${className}`}>
    {children}
  </div>
);

const PulseDashboard = () => {
  const [selectedView, setSelectedView] = useState('dashboard');
  const [selectedKPI, setSelectedKPI] = useState(0);

  const kpis = [
    { 
      name: 'Customer Satisfaction (CSAT)', 
      value: '9.2/10', 
      trend: 'up', 
      onTrack: true, 
      category: 'Customer',
      target: '9.0',
      variance: '+2.2%',
      frequency: 'Monthly',
      owner: 'Sarah Chen',
      lastUpdated: '2h ago',
      dataPoints: [8.8, 9.0, 8.9, 9.1, 9.2],
      benchmark: '8.5 (Industry Avg)'
    },
    { 
      name: 'Operational Efficiency', 
      value: '94%', 
      trend: 'up', 
      onTrack: true, 
      category: 'Operations',
      target: '92%',
      variance: '+2.2%',
      frequency: 'Weekly',
      owner: 'Mike Torres',
      lastUpdated: '5h ago',
      dataPoints: [89, 91, 92, 93, 94],
      benchmark: '87% (Industry Avg)'
    },
    { 
      name: 'ESG Compliance Score', 
      value: '88%', 
      trend: 'up', 
      onTrack: true, 
      category: 'Sustainability',
      target: '85%',
      variance: '+3.5%',
      frequency: 'Quarterly',
      owner: 'Lisa Park',
      lastUpdated: '1d ago',
      dataPoints: [82, 84, 85, 87, 88],
      benchmark: '75% (Industry Avg)'
    },
    { 
      name: 'Team Morale Index', 
      value: '3.8/5', 
      trend: 'down', 
      onTrack: false, 
      category: 'People',
      target: '4.2',
      variance: '-9.5%',
      frequency: 'Monthly',
      owner: 'Jordan Lee',
      lastUpdated: '3d ago',
      dataPoints: [4.2, 4.1, 4.0, 3.9, 3.8],
      benchmark: '4.0 (Industry Avg)'
    },
    { 
      name: 'Revenue Growth Rate', 
      value: '18.5%', 
      trend: 'up', 
      onTrack: true, 
      category: 'Financial',
      target: '15%',
      variance: '+23.3%',
      frequency: 'Monthly',
      owner: 'Alex Kim',
      lastUpdated: '1h ago',
      dataPoints: [12, 14, 16, 17, 18.5],
      benchmark: '12% (Industry Avg)'
    },
    { 
      name: 'Innovation Pipeline', 
      value: '12 projects', 
      trend: 'up', 
      onTrack: true, 
      category: 'Strategy',
      target: '10 projects',
      variance: '+20%',
      frequency: 'Quarterly',
      owner: 'Taylor Kim',
      lastUpdated: '2d ago',
      dataPoints: [8, 9, 10, 11, 12],
      benchmark: '8 (Industry Avg)'
    },
  ];

  const anomalyFeed = [
    { 
      icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z', 
      text: 'Anomaly Detected: Team Morale Index dropped below threshold (3.8 < 4.0)', 
      time: '2h ago',
      severity: 'high',
      category: 'People'
    },
    { 
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', 
      text: 'CSAT score reached all-time high of 9.2/10, exceeding target by 2.2%', 
      time: '5h ago',
      severity: 'positive',
      category: 'Customer'
    },
    { 
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', 
      text: 'New KPI "Carbon Footprint per Unit" added to Sustainability dashboard', 
      time: '8h ago',
      severity: 'info',
      category: 'System'
    },
  ];

  const kpiCategories = [
    { name: 'Financial', count: 8, onTrack: 7, color: 'text-green-400' },
    { name: 'Customer', count: 5, onTrack: 5, color: 'text-blue-400' },
    { name: 'Operations', count: 12, onTrack: 10, color: 'text-sky-400' },
    { name: 'People', count: 6, onTrack: 4, color: 'text-yellow-400' },
    { name: 'Sustainability', count: 4, onTrack: 4, color: 'text-green-400' },
    { name: 'Strategy', count: 3, onTrack: 3, color: 'text-purple-400' },
  ];

  const kpiTemplates = [
    { name: 'Customer Success', metrics: ['NPS', 'CSAT', 'Churn Rate', 'LTV'], industry: 'SaaS' },
    { name: 'Operational Excellence', metrics: ['Efficiency', 'Quality Score', 'Uptime', 'Cost per Unit'], industry: 'Manufacturing' },
    { name: 'Financial Performance', metrics: ['Revenue Growth', 'Profit Margin', 'Cash Flow', 'ROI'], industry: 'General' },
    { name: 'ESG & Sustainability', metrics: ['Carbon Footprint', 'Energy Efficiency', 'Diversity Index', 'Compliance'], industry: 'All' },
  ];

  const dashboardStats = {
    totalKPIs: 38,
    onTrack: 33,
    atRisk: 4,
    critical: 1,
    avgPerformance: 94
  };

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z" className="w-8 h-8 text-sky-400" />
          <h1 className="text-2xl font-bold">Aesyros Pulse</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="flex gap-2">
            <button 
              onClick={() => setSelectedView('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedView === 'dashboard' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-sky-400'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setSelectedView('builder')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedView === 'builder' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-sky-400'}`}
            >
              KPI Builder
            </button>
            <button 
              onClick={() => setSelectedView('analytics')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedView === 'analytics' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-sky-400'}`}
            >
              Analytics
            </button>
          </nav>
          <button className="bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold py-2 px-5 rounded-lg shadow-lg hover:from-sky-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all">
            + New KPI
          </button>
        </div>
      </header>

      <main className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-100">Performance Command Center</h2>
            <p className="text-slate-400 mt-2">Monitor what matters. Track performance with precision and purpose.</p>
          </div>
          
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-sky-400">{dashboardStats.totalKPIs}</div>
              <div className="text-xs text-slate-400">Total KPIs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{dashboardStats.onTrack}</div>
              <div className="text-xs text-slate-400">On Track</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{dashboardStats.atRisk}</div>
              <div className="text-xs text-slate-400">At Risk</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{dashboardStats.critical}</div>
              <div className="text-xs text-slate-400">Critical</div>
            </div>
          </div>
        </div>

        {selectedView === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: KPI Overview */}
            <div className="lg:col-span-2 space-y-8">
              {/* KPI Health Overview */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold mb-4">KPI Health Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {kpis.map((kpi, index) => (
                    <div 
                      key={kpi.name} 
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        kpi.onTrack ? 'bg-green-500/10 hover:bg-green-500/20' : 'bg-red-500/10 hover:bg-red-500/20'
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
                      <p className="text-xl font-bold mb-2">{kpi.value}</p>
                      <div className={`flex items-center text-xs ${kpi.onTrack ? 'text-green-400' : 'text-red-400'}`}>
                        <span className="font-medium">{kpi.onTrack ? 'On Track' : 'At Risk'}</span>
                        <span className="ml-2 text-slate-500">({kpi.variance})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* KPI Deep Dive */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold mb-4">KPI Deep Dive: {kpis[selectedKPI].name}</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-slate-400">Current Value</label>
                        <div className="text-2xl font-bold text-sky-400">{kpis[selectedKPI].value}</div>
                      </div>
                      <div>
                        <label className="text-sm text-slate-400">Target</label>
                        <div className="text-2xl font-bold text-slate-300">{kpis[selectedKPI].target}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Owner:</span>
                        <span className="ml-2 font-medium">{kpis[selectedKPI].owner}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Frequency:</span>
                        <span className="ml-2 font-medium">{kpis[selectedKPI].frequency}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Last Updated:</span>
                        <span className="ml-2 font-medium">{kpis[selectedKPI].lastUpdated}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Benchmark:</span>
                        <span className="ml-2 font-medium">{kpis[selectedKPI].benchmark}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">5-Period Trend</label>
                    <div className="h-32 bg-slate-800/50 rounded-lg flex items-end justify-between p-4">
                      {kpis[selectedKPI].dataPoints.map((point, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div 
                            className="w-8 bg-sky-500 rounded-t"
                            style={{ height: `${(point / Math.max(...kpis[selectedKPI].dataPoints)) * 80}px` }}
                          ></div>
                          <div className="text-xs text-slate-500 mt-1">{point}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Category Performance */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold mb-4">Performance by Category</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kpiCategories.map(category => (
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
            </div>

            {/* Right Column: AI Insights & Feed */}
            <div className="space-y-8">
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
              
              {/* Anomaly Feed */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold mb-4">Live Anomaly Feed</h3>
                <div className="space-y-4">
                  {anomalyFeed.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
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

              {/* Quick Actions */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <Icon path="M12 4v16m8-8H4" className="w-5 h-5 text-sky-400" />
                      <div>
                        <div className="font-medium">Add New KPI</div>
                        <div className="text-xs text-slate-400">Create custom metric</div>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <Icon path="M15 17h5l-5 5v-5z" className="w-5 h-5 text-sky-400" />
                      <div>
                        <div className="font-medium">Export Report</div>
                        <div className="text-xs text-slate-400">Generate dashboard PDF</div>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <Icon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 text-sky-400" />
                      <div>
                        <div className="font-medium">Set Alert</div>
                        <div className="text-xs text-slate-400">Configure notifications</div>
                      </div>
                    </div>
                  </button>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {selectedView === 'builder' && (
          <>
            {/* KPI Builder Workshop */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">The Workshop: KPI Builder</h3>
              <p className="text-slate-400 mb-6">Create meaningful KPIs tied to your mission. Our AI Coach helps you move beyond vanity metrics.</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">What do you want to measure?</label>
                    <input 
                      type="text" 
                      placeholder="e.g., 'Improve customer onboarding experience'" 
                      className="w-full bg-slate-700/80 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">KPI Category</label>
                    <select className="w-full bg-slate-700/80 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400">
                      <option>Select category...</option>
                      <option>Financial</option>
                      <option>Customer</option>
                      <option>Operations</option>
                      <option>People</option>
                      <option>Sustainability</option>
                      <option>Strategy</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Target Value</label>
                      <input 
                        type="text" 
                        placeholder="e.g., 95%" 
                        className="w-full bg-slate-700/80 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Frequency</label>
                      <select className="w-full bg-slate-700/80 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                        <option>Quarterly</option>
                      </select>
                    </div>
                  </div>
                  
                  <button className="w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-400/50 transition-colors">
                    Build KPI with AI
                  </button>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">AI Recommendations</h4>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h5 className="font-medium text-sky-300 mb-2">Suggested Metrics</h5>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span>Time to First Value</span>
                        <button className="text-sky-400 hover:text-sky-300">Add</button>
                      </li>
                      <li className="flex justify-between">
                        <span>Onboarding Completion Rate</span>
                        <button className="text-sky-400 hover:text-sky-300">Add</button>
                      </li>
                      <li className="flex justify-between">
                        <span>User Activation Score</span>
                        <button className="text-sky-400 hover:text-sky-300">Add</button>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h5 className="font-medium text-blue-300 mb-2">Best Practice Alert</h5>
                    <p className="text-sm text-slate-300">Consider adding a qualitative metric alongside quantitative ones for balanced insights.</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* KPI Templates */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">Pre-built KPI Templates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiTemplates.map(template => (
                  <div key={template.name} className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors cursor-pointer">
                    <h4 className="font-semibold mb-2">{template.name}</h4>
                    <p className="text-xs text-slate-400 mb-3">Industry: {template.industry}</p>
                    <div className="space-y-1">
                      {template.metrics.map(metric => (
                        <div key={metric} className="text-sm text-slate-300">• {metric}</div>
                      ))}
                    </div>
                    <button className="w-full mt-3 text-sm bg-sky-500/20 text-sky-300 py-2 rounded hover:bg-sky-500/30 transition-colors">
                      Use Template
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>
          </>
        )}

        {selectedView === 'analytics' && (
          <>
            {/* Analytics Observatory */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">The Observatory: Analytics & Trends</h3>
              <p className="text-slate-400 mb-6">Visualize performance, detect anomalies, and see how your KPIs connect to strategic goals.</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">Performance Heatmap</h4>
                  <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center">
                    <p className="text-slate-500">KPI Performance Heatmap Visualization</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Correlation Analysis</h4>
                  <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center">
                    <p className="text-slate-500">KPI Correlation Matrix & Insights</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Trend Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <GlassCard className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Trend Analysis</h3>
                  <div className="h-80 bg-slate-800/50 rounded-lg flex items-center justify-center">
                    <p className="text-slate-500">Multi-KPI Trend Chart with Forecasting</p>
                  </div>
                </GlassCard>
              </div>
              
              <div className="space-y-6">
                <GlassCard className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Performance Score</h3>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-sky-400 mb-2">{dashboardStats.avgPerformance}%</div>
                    <p className="text-slate-400">Overall KPI Health</p>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Above Target</span>
                        <span className="text-green-400">68%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>On Target</span>
                        <span className="text-blue-400">21%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Below Target</span>
                        <span className="text-red-400">11%</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
                
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Predictive Alerts</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="text-sm font-medium text-yellow-300">Forecast Warning</div>
                      <div className="text-xs text-slate-400 mt-1">Revenue growth may slow next quarter</div>
                    </div>
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="text-sm font-medium text-green-300">Positive Trend</div>
                      <div className="text-xs text-slate-400 mt-1">ESG score trending upward</div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* Integration Status */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">Aesyros Suite Integration</h3>
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
          </>
        )}
      </main>
    </div>
  );
};

export default PulseDashboard;
