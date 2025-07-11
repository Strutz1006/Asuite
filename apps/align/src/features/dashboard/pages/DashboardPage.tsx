import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard, Icon } from '../../shared/components';
import { mockCompanyObjective, mockDepartmentObjectives, mockIndividualGoals, mockAIInsights } from '../../shared/data/mockData';

const DashboardPage: React.FC = () => {
  const onTrackCount = mockDepartmentObjectives.filter(obj => obj.status === 'on-track').length;
  const atRiskCount = mockDepartmentObjectives.filter(obj => obj.status === 'at-risk').length;

  return (
    <div className="min-h-screen space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-100">Strategic Alignment Hub</h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
            <span>On Track ({onTrackCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>At Risk ({atRiskCount})</span>
          </div>
        </div>
      </div>

      {/* Company Level Goal */}
      <GlassCard className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-sky-300 mb-2">Company-Level Objective</h3>
            <p className="text-2xl font-bold mb-3">{mockCompanyObjective.title}</p>
            <div className="flex gap-6 text-sm text-slate-400">
              <span>Owner: {mockCompanyObjective.owner}</span>
              <span>Due: {mockCompanyObjective.dueDate?.toLocaleDateString()}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-sky-400">{mockCompanyObjective.progress}%</div>
            <div className="text-sm text-green-400 capitalize">{mockCompanyObjective.status.replace('-', ' ')}</div>
          </div>
        </div>
        
        <div className="w-full bg-slate-700 rounded-full h-4 mb-2">
          <div 
            className="bg-gradient-to-r from-sky-500 to-blue-500 h-4 rounded-full" 
            style={{ width: `${mockCompanyObjective.progress}%` }}
          ></div>
        </div>

        {/* Connecting Lines */}
        <div className="relative text-center my-8">
          <div className="border-l-2 border-sky-400/30 h-8 w-1/2 mx-auto"></div>
        </div>

        {/* Department Level */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-sky-300">Department & Team Objectives</h3>
          <Link 
            to="/goals" 
            className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
          >
            View All Goals →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockDepartmentObjectives.map(obj => (
            <div key={obj.id} className="bg-slate-800/80 p-4 rounded-lg border border-slate-700 relative hover:border-sky-500/50 transition-colors">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 h-6 w-px bg-sky-400/30"></div>
              
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-sm">{obj.title}</p>
                  <p className="text-xs text-slate-500">Owner: {obj.owner}</p>
                </div>
                <div className={`px-2 py-1 text-xs font-bold rounded-full ${
                  obj.status === 'at-risk' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'
                }`}>
                  {obj.status === 'at-risk' ? 'At Risk' : 'On Track'}
                </div>
              </div>

              <div className="w-full bg-slate-600 rounded-full h-2.5 mb-3">
                <div 
                  className={`h-2.5 rounded-full ${obj.status === 'on-track' ? 'bg-sky-500' : 'bg-yellow-500'}`} 
                  style={{ width: `${obj.progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="font-mono">{obj.progress}%</span>
                <Link 
                  to={`/goals/${obj.id}`}
                  className="text-sky-400 hover:text-sky-300 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Individual Goals */}
        <div className="mt-8">
          <h4 className="text-md font-semibold text-sky-300 mb-4">Recent Individual Goals</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockIndividualGoals.slice(0, 3).map(goal => (
              <div key={goal.id} className="bg-slate-700/50 p-3 rounded-lg">
                <p className="text-sm font-medium">{goal.title}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-slate-400">{goal.owner}</span>
                  <span className="text-xs font-mono">{goal.progress}%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-sky-400 h-1.5 rounded-full" 
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* AI Coach Section */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z" className="w-6 h-6 text-sky-400" />
          AI Coach Insights
        </h3>
        <p className="text-slate-400 mb-4">Strategic recommendations to optimize goal alignment and execution</p>
        
        <div className="space-y-4">
          {mockAIInsights.map((insight) => (
            <div key={insight.id} className={`p-4 rounded-lg border-l-4 ${
              insight.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500' : 
              insight.type === 'success' ? 'bg-green-500/10 border-green-500' : 
              'bg-blue-500/10 border-blue-500'
            }`}>
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

    </div>
  );
};

export default DashboardPage;