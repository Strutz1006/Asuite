import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard, Icon } from '../../shared/components';
import { mockProcesses } from '../../shared/data/mockData';

const ProcessesListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'HR Process', 'Finance Policy', 'IT Security', 'Operations'];

  const filteredProcesses = mockProcesses.filter(process => {
    const matchesSearch = process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (process.description && process.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const getStepColor = (stepCount: number) => {
    if (stepCount <= 3) return 'text-green-400';
    if (stepCount <= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTotalTime = (steps: typeof mockProcesses[0]['steps']) => {
    return steps.reduce((total, step) => total + (step.estimatedTime || 0), 0);
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Process Management</h1>
          <p className="text-slate-400 mt-1">Design, validate, and optimize your organizational workflows</p>
        </div>
        <Link 
          to="/processes/new"
          className="bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold py-2 px-5 rounded-lg shadow-lg hover:from-sky-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all"
        >
          + New Process
        </Link>
      </div>

      {/* Search and Filters */}
      <GlassCard className="p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search processes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-300">Category:</span>
            <div className="flex gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Process Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProcesses.map(process => (
          <GlassCard key={process.id} className="p-6 hover:border-sky-500/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-100 mb-2">{process.name}</h3>
                <p className="text-slate-400 text-sm mb-3 line-clamp-2">{process.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span>Owner: {process.owner}</span>
                  <span>Version: {process.version}</span>
                  <span>Updated: {process.lastUpdated.toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Process Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-slate-700/30 rounded-lg">
              <div className="text-center">
                <div className={`text-lg font-bold ${getStepColor(process.steps.length)}`}>
                  {process.steps.length}
                </div>
                <div className="text-xs text-slate-400">Steps</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-sky-400">
                  {formatTime(getTotalTime(process.steps))}
                </div>
                <div className="text-xs text-slate-400">Est. Time</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">
                  {process.steps.filter(s => s.required).length}
                </div>
                <div className="text-xs text-slate-400">Required</div>
              </div>
            </div>

            {/* Process Steps Preview */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-slate-300 mb-2">Process Steps:</h4>
              <div className="space-y-1">
                {process.steps.slice(0, 3).map((step, index) => (
                  <div key={step.id} className="flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 bg-sky-500/20 text-sky-300 rounded-full flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    <span className="text-slate-300">{step.title}</span>
                    {step.required && (
                      <span className="text-xs text-red-400">*</span>
                    )}
                  </div>
                ))}
                {process.steps.length > 3 && (
                  <div className="text-xs text-slate-500 ml-7">
                    +{process.steps.length - 3} more steps
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link
                to={`/processes/${process.id}`}
                className="flex-1 text-center bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-colors text-sm"
              >
                View Details
              </Link>
              <Link
                to={`/processes/${process.id}/edit`}
                className="flex-1 text-center bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-lg transition-colors text-sm"
              >
                Edit Process
              </Link>
              <button className="px-4 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-colors">
                <Icon path="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredProcesses.length === 0 && (
        <GlassCard className="p-8 text-center">
          <Icon path="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No processes found</h3>
          <p className="text-slate-500 mb-4">Try adjusting your search terms or create a new process.</p>
          <Link 
            to="/processes/new"
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Icon path="M12 4v16m8-8H4" className="w-5 h-5" />
            Create New Process
          </Link>
        </GlassCard>
      )}

      {/* Process Statistics */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Process Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-sky-400">{filteredProcesses.length}</div>
            <div className="text-sm text-slate-400">Total Processes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {filteredProcesses.reduce((acc, p) => acc + p.steps.length, 0)}
            </div>
            <div className="text-sm text-slate-400">Total Steps</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {Math.round(filteredProcesses.reduce((acc, p) => acc + getTotalTime(p.steps), 0) / 60)}h
            </div>
            <div className="text-sm text-slate-400">Total Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {new Set(filteredProcesses.map(p => p.owner)).size}
            </div>
            <div className="text-sm text-slate-400">Process Owners</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default ProcessesListPage;