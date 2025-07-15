import React, { useState } from 'react';
import { GlassCard, Icon } from '../../shared/components';

const ProjectsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'on-hold'>('all');

  const projects = [
    {
      id: '1',
      name: 'Mobile App Redesign',
      description: 'Complete overhaul of the mobile application UI/UX',
      status: 'active',
      progress: 75,
      priority: 'high',
      dueDate: '2024-08-15',
      teamMembers: 8,
      tasksTotal: 24,
      tasksCompleted: 18,
      goalAlignment: true,
      alignedGoal: 'Improve Customer Satisfaction'
    },
    {
      id: '2',
      name: 'API Integration Project',
      description: 'Integrate third-party APIs for enhanced functionality',
      status: 'active',
      progress: 42,
      priority: 'medium',
      dueDate: '2024-08-30',
      teamMembers: 5,
      tasksTotal: 15,
      tasksCompleted: 6,
      goalAlignment: true,
      alignedGoal: 'Enhance Platform Capabilities'
    },
    {
      id: '3',
      name: 'Customer Portal',
      description: 'Self-service customer portal development',
      status: 'active',
      progress: 90,
      priority: 'high',
      dueDate: '2024-07-25',
      teamMembers: 6,
      tasksTotal: 20,
      tasksCompleted: 18,
      goalAlignment: true,
      alignedGoal: 'Reduce Support Costs'
    },
    {
      id: '4',
      name: 'Internal Tools Upgrade',
      description: 'Modernize internal development tools',
      status: 'on-hold',
      progress: 25,
      priority: 'low',
      dueDate: '2024-09-15',
      teamMembers: 3,
      tasksTotal: 12,
      tasksCompleted: 3,
      goalAlignment: false,
      alignedGoal: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'completed': return 'text-sky-400 bg-sky-500/20';
      case 'on-hold': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-100">Projects</h2>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                viewMode === 'grid' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                viewMode === 'list' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              List
            </button>
          </div>
          <button className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
            <Icon path="M12 4v16m8-8H4" className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex bg-slate-800 rounded-lg p-1">
          {['all', 'active', 'completed', 'on-hold'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded text-sm transition-colors capitalize ${
                filter === status ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {status.replace('-', ' ')}
            </button>
          ))}
        </div>
        <div className="text-sm text-slate-400">
          {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Projects Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <GlassCard key={project.id} className="p-6 hover:bg-slate-700/60 transition-colors cursor-pointer">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-white truncate">{project.name}</h3>
                  <div className="flex items-center gap-2">
                    {project.goalAlignment && (
                      <div className="p-1 bg-purple-500/20 rounded">
                        <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-4 h-4 text-purple-400" />
                      </div>
                    )}
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(project.priority)}`}>
                      {project.priority.toUpperCase()}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-400 line-clamp-2">{project.description}</p>

                {project.goalAlignment && project.alignedGoal && (
                  <div className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded">
                    🎯 {project.alignedGoal}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-sky-400">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Icon path="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-7.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" className="w-4 h-4" />
                    {project.teamMembers}
                  </div>
                  <div className="text-sm text-slate-400">
                    {project.tasksCompleted}/{project.tasksTotal} tasks
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status.toUpperCase()}
                  </div>
                  <div className="text-xs text-slate-400">
                    Due: {new Date(project.dueDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <GlassCard key={project.id} className="p-6 hover:bg-slate-700/60 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                      {project.goalAlignment && (
                        <div className="p-1 bg-purple-500/20 rounded">
                          <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-4 h-4 text-purple-400" />
                        </div>
                      )}
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(project.priority)}`}>
                        {project.priority.toUpperCase()}
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{project.description}</p>
                    {project.goalAlignment && project.alignedGoal && (
                      <div className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded inline-block">
                        🎯 {project.alignedGoal}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-sm text-slate-400">Progress</div>
                    <div className="text-lg font-semibold text-sky-400">{project.progress}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-400">Tasks</div>
                    <div className="text-lg font-semibold text-white">{project.tasksCompleted}/{project.tasksTotal}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-400">Team</div>
                    <div className="text-lg font-semibold text-white">{project.teamMembers}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-400">Status</div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-400">Due Date</div>
                    <div className="text-sm text-white">{new Date(project.dueDate).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;