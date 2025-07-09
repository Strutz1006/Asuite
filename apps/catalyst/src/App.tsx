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

const CatalystDashboard = () => {
  const [selectedView, setSelectedView] = useState('journeys');

  const changeJourneys = [
    { 
      name: "Digital Workplace Transformation", 
      status: "In Progress", 
      readiness: 78, 
      resistance: "Medium",
      phase: "Execution",
      startDate: "Jan 2025",
      completion: 65,
      stakeholders: 24,
      champions: 8,
      risks: 3
    },
    { 
      name: "New Sales Process Adoption", 
      status: "Planning", 
      readiness: 45, 
      resistance: "High",
      phase: "Preparation",
      startDate: "Mar 2025",
      completion: 20,
      stakeholders: 18,
      champions: 3,
      risks: 7
    },
    { 
      name: "ESG Reporting Implementation", 
      status: "Completed", 
      readiness: 95, 
      resistance: "Low",
      phase: "Sustain",
      startDate: "Sep 2024",
      completion: 100,
      stakeholders: 12,
      champions: 6,
      risks: 0
    },
  ];

  const stakeholderMap = [
    { name: "Sarah Chen", role: "Operations Director", influence: "High", engagement: "Champion", department: "Operations" },
    { name: "Mike Torres", role: "IT Manager", influence: "High", engagement: "Neutral", department: "Technology" },
    { name: "Lisa Park", role: "HR Director", influence: "Medium", engagement: "Supporter", department: "Human Resources" },
    { name: "Alex Kim", role: "Finance Lead", influence: "High", engagement: "Skeptic", department: "Finance" },
    { name: "Jordan Lee", role: "Sales Manager", influence: "Medium", engagement: "Resistor", department: "Sales" },
  ];

  const changeFatigue = {
    overall: 68,
    departments: [
      { name: "Technology", fatigue: 85, color: "text-red-400" },
      { name: "Operations", fatigue: 45, color: "text-green-400" },
      { name: "Sales", fatigue: 75, color: "text-yellow-400" },
      { name: "HR", fatigue: 50, color: "text-green-400" },
    ]
  };

  const recentActivities = [
    { type: "survey", message: "Change readiness survey sent to Technology team", time: "2h ago", icon: "M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h2m4-10h2a2 2 0 012 2v8a2 2 0 01-2 2h-2m-4-8h4" },
    { type: "training", message: "Digital tools training completed by 15 employees", time: "5h ago", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    { type: "milestone", message: "Digital Workplace phase 2 milestone reached", time: "1d ago", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  ];

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-8 h-8 text-sky-400" />
          <h1 className="text-2xl font-bold">Aesyros Catalyst</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="flex gap-2">
            <button 
              onClick={() => setSelectedView('journeys')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedView === 'journeys' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-sky-400'}`}
            >
              Change Journeys
            </button>
            <button 
              onClick={() => setSelectedView('stakeholders')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedView === 'stakeholders' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-sky-400'}`}
            >
              Stakeholders
            </button>
            <button 
              onClick={() => setSelectedView('insights')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedView === 'insights' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-sky-400'}`}
            >
              Insights
            </button>
          </nav>
          <button className="bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold py-2 px-5 rounded-lg shadow-lg hover:from-sky-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all">
            + New Change Journey
          </button>
        </div>
      </header>

      <main className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-100">Change Activation Hub</h2>
            <p className="text-slate-400 mt-2">Turn strategy into movement that sticks. Manage resistance, engage stakeholders, and track adoption.</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-sky-400">3 Active</div>
            <div className="text-sm text-slate-400">Change Journeys</div>
          </div>
        </div>

        {selectedView === 'journeys' && (
          <>
            {/* Change Journeys Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {changeJourneys.map(journey => (
                <GlassCard key={journey.name} className="p-6 hover:border-sky-500/50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${
                      journey.status === 'In Progress' ? 'bg-sky-500/20 text-sky-300' : 
                      journey.status === 'Completed' ? 'bg-green-500/20 text-green-300' : 
                      'bg-slate-500/20 text-slate-300'
                    }`}>
                      {journey.status}
                    </div>
                    <div className="text-right text-sm text-slate-400">
                      <div>Phase: {journey.phase}</div>
                      <div>{journey.completion}% Complete</div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-4">{journey.name}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium">Change Readiness</label>
                        <span className="text-sm font-mono">{journey.readiness}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2.5">
                        <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${journey.readiness}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium">Overall Progress</label>
                        <span className="text-sm font-mono">{journey.completion}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${journey.completion}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Resistance:</span>
                        <span className={`ml-2 font-medium ${
                          journey.resistance === 'High' ? 'text-red-400' : 
                          journey.resistance === 'Medium' ? 'text-yellow-400' : 
                          'text-green-400'
                        }`}>
                          {journey.resistance}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Risks:</span>
                        <span className="ml-2 font-medium">{journey.risks}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Stakeholders:</span>
                        <span className="ml-2 font-medium">{journey.stakeholders}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Champions:</span>
                        <span className="ml-2 font-medium text-green-400">{journey.champions}</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Change Templates */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Start Templates</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-sky-500/50 transition-colors cursor-pointer">
                  <Icon path="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" className="w-8 h-8 text-sky-400 mb-2" />
                  <h4 className="font-semibold mb-1">Technology Rollout</h4>
                  <p className="text-sm text-slate-400">New system, platform, or tool implementation</p>
                </div>
                <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-sky-500/50 transition-colors cursor-pointer">
                  <Icon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" className="w-8 h-8 text-sky-400 mb-2" />
                  <h4 className="font-semibold mb-1">Process Change</h4>
                  <p className="text-sm text-slate-400">Workflow updates and operational improvements</p>
                </div>
                <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-sky-500/50 transition-colors cursor-pointer">
                  <Icon path="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" className="w-8 h-8 text-sky-400 mb-2" />
                  <h4 className="font-semibold mb-1">Cultural Shift</h4>
                  <p className="text-sm text-slate-400">Values, behaviors, and mindset transformation</p>
                </div>
              </div>
            </GlassCard>
          </>
        )}

        {selectedView === 'stakeholders' && (
          <>
            {/* Stakeholder Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold mb-4">Stakeholder Map</h3>
                <div className="space-y-3">
                  {stakeholderMap.map(stakeholder => (
                    <div key={stakeholder.name} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div>
                        <div className="font-medium">{stakeholder.name}</div>
                        <div className="text-sm text-slate-400">{stakeholder.role} • {stakeholder.department}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`px-2 py-1 text-xs font-bold rounded-full ${
                          stakeholder.influence === 'High' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {stakeholder.influence} Influence
                        </div>
                        <div className={`px-2 py-1 text-xs font-bold rounded-full ${
                          stakeholder.engagement === 'Champion' ? 'bg-green-500/20 text-green-300' :
                          stakeholder.engagement === 'Supporter' ? 'bg-blue-500/20 text-blue-300' :
                          stakeholder.engagement === 'Neutral' ? 'bg-slate-500/20 text-slate-300' :
                          stakeholder.engagement === 'Skeptic' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {stakeholder.engagement}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold mb-4">Engagement Actions</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <h4 className="font-semibold text-green-300 mb-2">Champions (Leverage)</h4>
                    <p className="text-sm text-slate-300">Have champions lead training sessions and peer mentoring</p>
                    <button className="text-sm text-green-400 hover:text-green-300 mt-2">Create Action Plan</button>
                  </div>
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <h4 className="font-semibold text-yellow-300 mb-2">Skeptics (Address Concerns)</h4>
                    <p className="text-sm text-slate-300">Schedule 1:1 sessions to understand and address specific concerns</p>
                    <button className="text-sm text-yellow-400 hover:text-yellow-300 mt-2">Schedule Meetings</button>
                  </div>
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <h4 className="font-semibold text-red-300 mb-2">Resistors (Intensive Support)</h4>
                    <p className="text-sm text-slate-300">Provide additional training and support resources</p>
                    <button className="text-sm text-red-400 hover:text-red-300 mt-2">Design Support Plan</button>
                  </div>
                </div>
              </GlassCard>
            </div>
          </>
        )}

        {selectedView === 'insights' && (
          <>
            {/* Change Fatigue Monitoring */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold mb-4">Change Fatigue Monitor</h3>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-sky-400 mb-2">{changeFatigue.overall}%</div>
                  <p className="text-slate-400">Overall Organization Fatigue</p>
                </div>
                
                <div className="space-y-4">
                  {changeFatigue.departments.map(dept => (
                    <div key={dept.name} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{dept.name}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-slate-700 rounded-full h-2">
                          <div className="bg-sky-500 h-2 rounded-full" style={{ width: `${dept.fatigue}%` }}></div>
                        </div>
                        <span className={`text-sm font-mono ${dept.color}`}>{dept.fatigue}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold mb-4">Recent Activity Feed</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Icon path={activity.icon} className="w-5 h-5 text-sky-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Survey Builder */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">Change Readiness Surveys</h3>
              <p className="text-slate-400 mb-6">Gauge your organization's emotional and operational preparedness for upcoming changes.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Quick Pulse Check</h4>
                  <p className="text-sm text-slate-400 mb-3">5-minute survey for rapid feedback</p>
                  <button className="w-full bg-sky-500/20 text-sky-300 font-medium py-2 px-4 rounded-lg hover:bg-sky-500/30 transition-colors">
                    Launch Survey
                  </button>
                </div>
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Detailed Assessment</h4>
                  <p className="text-sm text-slate-400 mb-3">Comprehensive change readiness evaluation</p>
                  <button className="w-full bg-sky-500/20 text-sky-300 font-medium py-2 px-4 rounded-lg hover:bg-sky-500/30 transition-colors">
                    Create Assessment
                  </button>
                </div>
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Custom Survey</h4>
                  <p className="text-sm text-slate-400 mb-3">Build tailored questionnaires</p>
                  <button className="w-full bg-sky-500/20 text-sky-300 font-medium py-2 px-4 rounded-lg hover:bg-sky-500/30 transition-colors">
                    Build Custom
                  </button>
                </div>
              </div>
            </GlassCard>
          </>
        )}
      </main>
    </div>
  );
};

export default CatalystDashboard;