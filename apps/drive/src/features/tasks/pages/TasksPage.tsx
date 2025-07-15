import React, { useState } from 'react';
import { GlassCard, Icon } from '../../shared/components';

const TasksPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [filter, setFilter] = useState<'all' | 'mine' | 'assigned'>('all');

  const tasks = [
    {
      id: '1',
      title: 'Design user authentication flow',
      description: 'Create wireframes and mockups for the new authentication system',
      status: 'todo',
      priority: 'high',
      assignee: 'Sarah Chen',
      project: 'Mobile App Redesign',
      dueDate: '2024-07-20',
      goalAlignment: true,
      alignedGoal: 'Improve Security Standards',
      tags: ['design', 'auth', 'ui']
    },
    {
      id: '2',
      title: 'Implement JWT authentication',
      description: 'Set up JWT token-based authentication on the backend',
      status: 'in-progress',
      priority: 'high',
      assignee: 'Mike Torres',
      project: 'Mobile App Redesign',
      dueDate: '2024-07-22',
      goalAlignment: true,
      alignedGoal: 'Improve Security Standards',
      tags: ['backend', 'auth', 'security']
    },
    {
      id: '3',
      title: 'Write API documentation',
      description: 'Document all new API endpoints with examples',
      status: 'in-progress',
      priority: 'medium',
      assignee: 'Alex Kim',
      project: 'API Integration Project',
      dueDate: '2024-07-25',
      goalAlignment: false,
      alignedGoal: null,
      tags: ['documentation', 'api']
    },
    {
      id: '4',
      title: 'Code review for payment module',
      description: 'Review payment processing implementation',
      status: 'review',
      priority: 'high',
      assignee: 'Lisa Park',
      project: 'Customer Portal',
      dueDate: '2024-07-18',
      goalAlignment: true,
      alignedGoal: 'Enhance Payment Processing',
      tags: ['review', 'payments']
    },
    {
      id: '5',
      title: 'Update user dashboard UI',
      description: 'Implement new dashboard design from Figma',
      status: 'done',
      priority: 'medium',
      assignee: 'Jordan Lee',
      project: 'Customer Portal',
      dueDate: '2024-07-15',
      goalAlignment: true,
      alignedGoal: 'Improve User Experience',
      tags: ['frontend', 'ui', 'dashboard']
    },
    {
      id: '6',
      title: 'Database migration script',
      description: 'Create migration for new user table structure',
      status: 'todo',
      priority: 'medium',
      assignee: 'Sam Rivera',
      project: null,
      dueDate: '2024-07-30',
      goalAlignment: false,
      alignedGoal: null,
      tags: ['database', 'migration']
    }
  ];

  const columns = [
    { id: 'todo', title: 'To Do', color: 'slate' },
    { id: 'in-progress', title: 'In Progress', color: 'yellow' },
    { id: 'review', title: 'Review', color: 'sky' },
    { id: 'done', title: 'Done', color: 'green' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getColumnColor = (color: string) => {
    switch (color) {
      case 'yellow': return 'border-yellow-500/50 bg-yellow-500/5';
      case 'sky': return 'border-sky-500/50 bg-sky-500/5';
      case 'green': return 'border-green-500/50 bg-green-500/5';
      default: return 'border-slate-500/50 bg-slate-500/5';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    // For demo purposes, assuming current user is 'Sarah Chen'
    if (filter === 'mine') return task.assignee === 'Sarah Chen';
    if (filter === 'assigned') return task.assignee !== 'Sarah Chen';
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-100">Tasks</h2>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('board')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                viewMode === 'board' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Board
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
            New Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex bg-slate-800 rounded-lg p-1">
          {['all', 'mine', 'assigned'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType as any)}
              className={`px-4 py-2 rounded text-sm transition-colors capitalize ${
                filter === filterType ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>
        <div className="text-sm text-slate-400">
          {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Task Board/List */}
      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter(task => task.status === column.id);
            return (
              <GlassCard key={column.id} className={`p-4 ${getColumnColor(column.color)}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">{column.title}</h3>
                  <span className="text-sm text-slate-400 bg-slate-700 px-2 py-1 rounded">
                    {columnTasks.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <div key={task.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-white text-sm line-clamp-2">{task.title}</h4>
                          <div className="flex items-center gap-1">
                            {task.goalAlignment && (
                              <div className="p-1 bg-purple-500/20 rounded">
                                <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-3 h-3 text-purple-400" />
                              </div>
                            )}
                            <div className={`px-1.5 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority[0].toUpperCase()}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-xs text-slate-400 line-clamp-2">{task.description}</p>
                        
                        {task.goalAlignment && task.alignedGoal && (
                          <div className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded">
                            🎯 {task.alignedGoal}
                          </div>
                        )}
                        
                        {task.project && (
                          <div className="text-xs text-sky-400 bg-sky-500/10 px-2 py-1 rounded">
                            📁 {task.project}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-slate-400">
                            {task.assignee}
                          </div>
                          <div className="text-xs text-slate-400">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                        
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.tags.map((tag) => (
                              <span key={tag} className="text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <GlassCard key={task.id} className="p-6 hover:bg-slate-700/60 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                      {task.goalAlignment && (
                        <div className="p-1 bg-purple-500/20 rounded">
                          <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-4 h-4 text-purple-400" />
                        </div>
                      )}
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{task.description}</p>
                    <div className="flex items-center gap-3">
                      {task.goalAlignment && task.alignedGoal && (
                        <div className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded">
                          🎯 {task.alignedGoal}
                        </div>
                      )}
                      {task.project && (
                        <div className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                          📁 {task.project}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-sm text-slate-400">Assignee</div>
                    <div className="text-sm font-medium text-white">{task.assignee}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-400">Status</div>
                    <div className="text-sm font-medium text-white capitalize">{task.status.replace('-', ' ')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-400">Due Date</div>
                    <div className="text-sm text-white">{new Date(task.dueDate).toLocaleDateString()}</div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
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

export default TasksPage;