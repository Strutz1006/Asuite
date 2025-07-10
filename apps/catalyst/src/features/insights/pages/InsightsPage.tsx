import React from 'react';
import { GlassCard, Icon } from '../../shared/components';
import { mockChangeFatigue, mockRecentActivities } from '../../shared/data/mockData';

const InsightsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Change Insights</h1>
          <p className="text-slate-400 mt-1">Monitor change fatigue, track adoption, and analyze organizational readiness</p>
        </div>
        <button className="bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold py-2 px-5 rounded-lg shadow-lg hover:from-sky-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all">
          Generate Report
        </button>
      </div>

      {/* Change Fatigue & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Change Fatigue Monitor */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-4">Change Fatigue Monitor</h3>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-sky-400 mb-2">{mockChangeFatigue.overall}%</div>
            <p className="text-slate-400">Overall Organization Fatigue</p>
          </div>
          
          <div className="space-y-4">
            {mockChangeFatigue.departments.map(dept => (
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

        {/* Recent Activity Feed */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activity Feed</h3>
          <div className="space-y-4">
            {mockRecentActivities.map((activity, index) => (
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
            <Icon path="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h2m4-10h2a2 2 0 012 2v8a2 2 0 01-2 2h-2m-4-8h4" className="w-8 h-8 text-sky-400 mb-3" />
            <h4 className="font-semibold mb-2">Quick Pulse Check</h4>
            <p className="text-sm text-slate-400 mb-3">5-minute survey for rapid feedback</p>
            <button className="w-full bg-sky-500/20 text-sky-300 font-medium py-2 px-4 rounded-lg hover:bg-sky-500/30 transition-colors">
              Launch Survey
            </button>
          </div>
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <Icon path="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-8 h-8 text-sky-400 mb-3" />
            <h4 className="font-semibold mb-2">Detailed Assessment</h4>
            <p className="text-sm text-slate-400 mb-3">Comprehensive change readiness evaluation</p>
            <button className="w-full bg-sky-500/20 text-sky-300 font-medium py-2 px-4 rounded-lg hover:bg-sky-500/30 transition-colors">
              Create Assessment
            </button>
          </div>
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <Icon path="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" className="w-8 h-8 text-sky-400 mb-3" />
            <h4 className="font-semibold mb-2">Custom Survey</h4>
            <p className="text-sm text-slate-400 mb-3">Build tailored questionnaires</p>
            <button className="w-full bg-sky-500/20 text-sky-300 font-medium py-2 px-4 rounded-lg hover:bg-sky-500/30 transition-colors">
              Build Custom
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Adoption Analytics */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold mb-4">Adoption Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">78%</div>
            <div className="text-sm text-slate-400">Training Completion</div>
            <div className="text-xs text-slate-500">+12% from last month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">65%</div>
            <div className="text-sm text-slate-400">Tool Adoption</div>
            <div className="text-xs text-slate-500">+8% from last month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">42%</div>
            <div className="text-sm text-slate-400">Process Compliance</div>
            <div className="text-xs text-slate-500">+5% from last month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-sky-400 mb-2">8.2</div>
            <div className="text-sm text-slate-400">Satisfaction Score</div>
            <div className="text-xs text-slate-500">out of 10</div>
          </div>
        </div>
      </GlassCard>

      {/* Resistance Heatmap */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold mb-4">Resistance Heatmap</h3>
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center">
            <div className="h-16 bg-green-500/20 border border-green-500/30 rounded flex items-center justify-center">
              <span className="text-sm font-medium">HR</span>
            </div>
            <div className="text-xs text-green-400 mt-1">Low</div>
          </div>
          <div className="text-center">
            <div className="h-16 bg-yellow-500/20 border border-yellow-500/30 rounded flex items-center justify-center">
              <span className="text-sm font-medium">Finance</span>
            </div>
            <div className="text-xs text-yellow-400 mt-1">Medium</div>
          </div>
          <div className="text-center">
            <div className="h-16 bg-red-500/20 border border-red-500/30 rounded flex items-center justify-center">
              <span className="text-sm font-medium">Sales</span>
            </div>
            <div className="text-xs text-red-400 mt-1">High</div>
          </div>
          <div className="text-center">
            <div className="h-16 bg-red-500/30 border border-red-500/40 rounded flex items-center justify-center">
              <span className="text-sm font-medium">IT</span>
            </div>
            <div className="text-xs text-red-400 mt-1">Very High</div>
          </div>
        </div>
        <p className="text-sm text-slate-400">
          Resistance levels by department. Focus intervention efforts on red and yellow areas.
        </p>
      </GlassCard>

      {/* Change Velocity */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold mb-4">Change Velocity Tracking</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
            <div>
              <div className="font-medium">Digital Workplace Transformation</div>
              <div className="text-sm text-slate-400">Phase 2 of 4 • 65% complete</div>
            </div>
            <div className="flex items-center gap-2">
              <Icon path="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">On Track</span>
            </div>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
            <div>
              <div className="font-medium">Sales Process Adoption</div>
              <div className="text-sm text-slate-400">Phase 1 of 3 • 20% complete</div>
            </div>
            <div className="flex items-center gap-2">
              <Icon path="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400">At Risk</span>
            </div>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
            <div>
              <div className="font-medium">ESG Reporting</div>
              <div className="text-sm text-slate-400">Completed • 100%</div>
            </div>
            <div className="flex items-center gap-2">
              <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Complete</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default InsightsPage;