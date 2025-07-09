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

const AlignDashboard = () => {
  const [selectedView, setSelectedView] = useState('map');

  const companyObjective = {
    title: "Become Industry Leader in Sustainability by 2026",
    progress: 68,
    status: "On Track",
    owner: "Executive Team",
    dueDate: "Dec 2026",
    confidence: 85
  };

  const departmentObjectives = [
    { 
      title: "Reduce Carbon Footprint by 25%", 
      progress: 72, 
      team: "Operations", 
      onTrack: true, 
      owner: "Sarah Chen",
      impact: "High",
      kpis: 3,
      blockers: 0
    },
    { 
      title: "Launch Eco-Friendly Product Line", 
      progress: 45, 
      team: "R&D / Marketing", 
      onTrack: true, 
      owner: "Mike Torres",
      impact: "Critical",
      kpis: 5,
      blockers: 1
    },
    { 
      title: "Achieve 100% Renewable Energy", 
      progress: 35, 
      team: "Facilities", 
      onTrack: false, 
      owner: "Lisa Park",
      impact: "Medium",
      kpis: 2,
      blockers: 2
    },
  ];

  const individualGoals = [
    { name: "Q4 Energy Audit Completion", progress: 90, assignee: "Alex Kim", team: "Facilities" },
    { name: "Sustainable Material Research", progress: 60, assignee: "Jordan Lee", team: "R&D" },
    { name: "Green Marketing Campaign", progress: 80, assignee: "Sam Rivera", team: "Marketing" },
  ];

  const aiInsights = [
    {
      type: "warning",
      title: "Goal Alignment Risk",
      message: "The 'Renewable Energy' goal is 7 months behind schedule. Consider breaking into smaller milestones.",
      action: "Redefine Timeline"
    },
    {
      type: "success", 
      title: "Strong Progress",
      message: "Carbon footprint reduction is ahead of schedule. Team could assist other departments.",
      action: "Reallocate Resources"
    },
    {
      type: "info",
      title: "Missing KPI",
      message: "Product line launch lacks customer satisfaction metrics. Add feedback tracking.",
      action: "Add KPI"
    }
  ];

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <Icon path="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.758 16l-.293.293a2 2 0 01-2.828 0L3.055 14.707a2 2 0 010-2.828l1.586-1.586a2 2 0 012.828 0L9 11.05m12.485-1.562l-1.586 1.586a2 2 0 01-2.828 0L15.32 9.293a2 2 0 010-2.828l1.586-1.586a2 2 0 012.828 0l1.586 1.586a2 2 0 010 2.828z" className="w-8 h-8 text-sky-400" />
          <h1 className="text-2xl font-bold">Aesyros Align</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="flex gap-2">
            <button 
              onClick={() => setSelectedView('map')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedView === 'map' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-sky-400'}`}
            >
              Goal Map
            </button>
            <button 
              onClick={() => setSelectedView('analytics')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedView === 'analytics' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-sky-400'}`}
            >
              Analytics
            </button>
          </nav>
          <button className="bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold py-2 px-5 rounded-lg shadow-lg hover:from-sky-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all">
            + New Objective
          </button>
        </div>
      </header>

      <main className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-slate-100">Strategic Alignment Hub</h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
              <span>On Track ({departmentObjectives.filter(obj => obj.onTrack).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>At Risk ({departmentObjectives.filter(obj => !obj.onTrack).length})</span>
            </div>
          </div>
        </div>

        {selectedView === 'map' && (
          <>
            {/* Company Level Goal */}
            <GlassCard className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-sky-300 mb-2">Company-Level Objective</h3>
                  <p className="text-2xl font-bold mb-3">{companyObjective.title}</p>
                  <div className="flex gap-6 text-sm text-slate-400">
                    <span>Owner: {companyObjective.owner}</span>
                    <span>Due: {companyObjective.dueDate}</span>
                    <span>Confidence: {companyObjective.confidence}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-sky-400">{companyObjective.progress}%</div>
                  <div className="text-sm text-green-400">{companyObjective.status}</div>
                </div>
              </div>
              
              <div className="w-full bg-slate-700 rounded-full h-4 mb-2">
                <div className="bg-gradient-to-r from-sky-500 to-blue-500 h-4 rounded-full" style={{ width: `${companyObjective.progress}%` }}></div>
              </div>

              {/* Connecting Lines */}
              <div className="relative text-center my-8">
                <div className="border-l-2 border-sky-400/30 h-8 w-1/2 mx-auto"></div>
              </div>

              {/* Department Level */}
              <h3 className="text-lg font-semibold text-sky-300 mb-4">Department & Team Objectives</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {departmentObjectives.map(obj => (
                  <div key={obj.title} className="bg-slate-800/80 p-4 rounded-lg border border-slate-700 relative hover:border-sky-500/50 transition-colors">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 h-6 w-px bg-sky-400/30"></div>
                    
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-sm">{obj.title}</p>
                        <p className="text-xs text-slate-400">{obj.team}</p>
                        <p className="text-xs text-slate-500">Owner: {obj.owner}</p>
                      </div>
                      <div className={`px-2 py-1 text-xs font-bold rounded-full ${obj.impact === 'Critical' ? 'bg-red-500/20 text-red-300' : obj.impact === 'High' ? 'bg-orange-500/20 text-orange-300' : 'bg-blue-500/20 text-blue-300'}`}>
                        {obj.impact}
                      </div>
                    </div>

                    <div className="w-full bg-slate-600 rounded-full h-2.5 mb-3">
                      <div className={`h-2.5 rounded-full ${obj.onTrack ? 'bg-sky-500' : 'bg-yellow-500'}`} style={{ width: `${obj.progress}%` }}></div>
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <span className="font-mono">{obj.progress}%</span>
                      <div className="flex gap-3 text-slate-400">
                        <span>{obj.kpis} KPIs</span>
                        {obj.blockers > 0 && <span className="text-yellow-400">{obj.blockers} blockers</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Individual Goals */}
              <div className="mt-8">
                <h4 className="text-md font-semibold text-sky-300 mb-4">Individual Contributor Goals</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {individualGoals.map(goal => (
                    <div key={goal.name} className="bg-slate-700/50 p-3 rounded-lg">
                      <p className="text-sm font-medium">{goal.name}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-slate-400">{goal.assignee} • {goal.team}</span>
                        <span className="text-xs font-mono">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-1.5 mt-2">
                        <div className="bg-sky-400 h-1.5 rounded-full" style={{ width: `${goal.progress}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </>
        )}

        {selectedView === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">Goal Completion Trends</h3>
              <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center">
                <p className="text-slate-500">Interactive goal progress charts and forecasting</p>
              </div>
            </GlassCard>
            
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">Alignment Health Score</h3>
              <div className="text-center">
                <div className="text-6xl font-bold text-sky-400 mb-2">87%</div>
                <p className="text-slate-400">Overall Strategic Alignment</p>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-2xl font-bold text-green-400">92%</div>
                    <div className="text-slate-400">Goal Clarity</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">78%</div>
                    <div className="text-slate-400">Resource Allocation</div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* AI Coach Section */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z" className="w-6 h-6 text-sky-400" />
            AI Coach Insights
          </h3>
          <p className="text-slate-400 mb-4">Strategic recommendations to optimize goal alignment and execution</p>
          
          <div className="space-y-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${insight.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500' : insight.type === 'success' ? 'bg-green-500/10 border-green-500' : 'bg-blue-500/10 border-blue-500'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold mb-1">{insight.title}</h4>
                    <p className="text-sm text-slate-300">{insight.message}</p>
                  </div>
                  <button className="text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors">
                    {insight.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 bg-slate-800/60 rounded-lg border border-slate-700 hover:border-sky-500/50 transition-colors text-left">
            <Icon path="M12 4v16m8-8H4" className="w-6 h-6 text-sky-400 mb-2" />
            <div className="font-semibold">Add New Goal</div>
            <div className="text-sm text-slate-400">Create strategic objective</div>
          </button>
          
          <button className="p-4 bg-slate-800/60 rounded-lg border border-slate-700 hover:border-sky-500/50 transition-colors text-left">
            <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" className="w-6 h-6 text-sky-400 mb-2" />
            <div className="font-semibold">View Analytics</div>
            <div className="text-sm text-slate-400">Deep dive into progress</div>
          </button>
          
          <button className="p-4 bg-slate-800/60 rounded-lg border border-slate-700 hover:border-sky-500/50 transition-colors text-left">
            <Icon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" className="w-6 h-6 text-sky-400 mb-2" />
            <div className="font-semibold">Assign Owner</div>
            <div className="text-sm text-slate-400">Delegate responsibility</div>
          </button>
          
          <button className="p-4 bg-slate-800/60 rounded-lg border border-slate-700 hover:border-sky-500/50 transition-colors text-left">
            <Icon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" className="w-6 h-6 text-sky-400 mb-2" />
            <div className="font-semibold">Set Deadline</div>
            <div className="text-sm text-slate-400">Add time constraints</div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default AlignDashboard;