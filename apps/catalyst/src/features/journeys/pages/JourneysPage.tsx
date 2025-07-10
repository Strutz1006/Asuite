import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard, Icon } from '../../shared/components';
import { mockChangeJourneys, mockChangeTemplates } from '../../shared/data/mockData';

const JourneysPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Change Journeys</h1>
          <p className="text-slate-400 mt-1">Manage and track your organizational change initiatives</p>
        </div>
        <Link 
          to="/journeys/new"
          className="bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold py-2 px-5 rounded-lg shadow-lg hover:from-sky-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all"
        >
          + New Journey
        </Link>
      </div>

      {/* Active Journeys */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mockChangeJourneys.map(journey => (
          <GlassCard key={journey.id} className="p-6 hover:border-sky-500/50 transition-colors cursor-pointer">
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
            
            <h3 className="text-lg font-bold mb-2">{journey.name}</h3>
            <p className="text-sm text-slate-400 mb-4">{journey.description}</p>
            
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

            <div className="mt-4 flex gap-2">
              <Link
                to={`/journeys/${journey.id}`}
                className="flex-1 text-center bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-colors text-sm"
              >
                View Details
              </Link>
              <Link
                to={`/journeys/${journey.id}/edit`}
                className="flex-1 text-center bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-lg transition-colors text-sm"
              >
                Manage
              </Link>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Journey Templates */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold mb-4">Journey Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockChangeTemplates.map(template => (
            <div key={template.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-sky-500/50 transition-colors cursor-pointer">
              <Icon path={template.icon} className="w-8 h-8 text-sky-400 mb-2" />
              <h4 className="font-semibold mb-1">{template.name}</h4>
              <p className="text-sm text-slate-400 mb-3">{template.description}</p>
              <div className="text-xs text-slate-500 mb-3">
                Phases: {template.phases.join(' → ')}
              </div>
              <button className="w-full bg-sky-500/20 text-sky-300 font-medium py-2 px-4 rounded-lg hover:bg-sky-500/30 transition-colors">
                Use Template
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Journey Statistics */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Journey Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-sky-400">{mockChangeJourneys.length}</div>
            <div className="text-sm text-slate-400">Total Journeys</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {mockChangeJourneys.filter(j => j.status === 'Completed').length}
            </div>
            <div className="text-sm text-slate-400">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {mockChangeJourneys.reduce((acc, j) => acc + j.stakeholders, 0)}
            </div>
            <div className="text-sm text-slate-400">Total Stakeholders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {mockChangeJourneys.reduce((acc, j) => acc + j.champions, 0)}
            </div>
            <div className="text-sm text-slate-400">Champions</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default JourneysPage;