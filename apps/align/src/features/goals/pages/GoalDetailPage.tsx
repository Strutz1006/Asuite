import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GlassCard, Icon } from '../../shared/components';
import { mockCompanyObjective, mockDepartmentObjectives, mockIndividualGoals } from '../../shared/data/mockData';
import type { Goal } from '@aesyros/types';

const GoalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'progress' | 'activities'>('overview');

  const allGoals = [mockCompanyObjective, ...mockDepartmentObjectives, ...mockIndividualGoals];
  const goal = allGoals.find(g => g.id === id);

  if (!goal) {
    return (
      <div className="space-y-6">
        <GlassCard className="p-8 text-center">
          <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0l-5.898 6.5c-.77.833.192 2.5 1.732 2.5z" className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-100 mb-2">Goal Not Found</h1>
          <p className="text-slate-400 mb-6">The goal you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/goals"
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Icon path="M10 19l-7-7m0 0l7-7m-7 7h18" className="w-5 h-5" />
            Back to Goals
          </Link>
        </GlassCard>
      </div>
    );
  }

  const getGoalLevel = (goal: Goal) => {
    if (!goal.parentGoal) return 'Company';
    if (goal.parentGoal === '1') return 'Department';
    return 'Individual';
  };

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'on-track': return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 'at-risk': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'completed': return 'text-blue-400 bg-blue-500/20 border-blue-500/50';
      case 'paused': return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/50';
    }
  };

  const getProgressColor = (status: Goal['status']) => {
    switch (status) {
      case 'on-track': return 'bg-green-500';
      case 'at-risk': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'paused': return 'bg-gray-500';
      default: return 'bg-slate-500';
    }
  };

  const childGoals = allGoals.filter(g => g.parentGoal === goal.id);
  const parentGoal = goal.parentGoal ? allGoals.find(g => g.id === goal.parentGoal) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to="/goals"
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Icon path="M10 19l-7-7m0 0l7-7m-7 7h18" className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">{goal.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300">
                {getGoalLevel(goal)}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getStatusColor(goal.status)}`}>
                {goal.status.charAt(0).toUpperCase() + goal.status.slice(1).replace('-', ' ')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/goals/${goal.id}/edit`}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Edit Goal
          </Link>
          <button className="bg-gradient-to-r from-sky-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-sky-600 hover:to-blue-600 transition-all">
            Update Progress
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-sky-400 mb-2">{goal.progress}%</div>
            <div className="text-slate-400">Progress</div>
            <div className="w-full bg-slate-700 rounded-full h-3 mt-2">
              <div 
                className={`h-3 rounded-full ${getProgressColor(goal.status)}`}
                style={{ width: `${goal.progress}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-300 mb-2">{goal.owner}</div>
            <div className="text-slate-400">Owner</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-300 mb-2">
              {goal.dueDate ? goal.dueDate.toLocaleDateString() : 'No deadline'}
            </div>
            <div className="text-slate-400">Due Date</div>
          </div>
        </div>
      </GlassCard>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        {['overview', 'progress', 'activities'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTab === tab
                ? 'bg-sky-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Goal Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-400">Description</label>
                <p className="text-slate-200 mt-1">{goal.description || 'No description provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400">Owner</label>
                <p className="text-slate-200 mt-1">{goal.owner}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400">Status</label>
                <p className="text-slate-200 mt-1 capitalize">{goal.status.replace('-', ' ')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400">Due Date</label>
                <p className="text-slate-200 mt-1">
                  {goal.dueDate ? goal.dueDate.toLocaleDateString() : 'No deadline set'}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Goal Hierarchy</h3>
            <div className="space-y-4">
              {parentGoal && (
                <div>
                  <label className="text-sm font-medium text-slate-400">Parent Goal</label>
                  <Link 
                    to={`/goals/${parentGoal.id}`}
                    className="block mt-1 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <div className="font-medium text-slate-200">{parentGoal.title}</div>
                    <div className="text-sm text-slate-400">{parentGoal.progress}% complete</div>
                  </Link>
                </div>
              )}
              
              {childGoals.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-slate-400">Child Goals ({childGoals.length})</label>
                  <div className="mt-2 space-y-2">
                    {childGoals.map(child => (
                      <Link 
                        key={child.id}
                        to={`/goals/${child.id}`}
                        className="block p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        <div className="font-medium text-slate-200">{child.title}</div>
                        <div className="text-sm text-slate-400">{child.progress}% complete • {child.owner}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {!parentGoal && childGoals.length === 0 && (
                <div className="text-center py-6 text-slate-500">
                  <Icon path="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" className="w-8 h-8 mx-auto mb-2" />
                  <p>This goal has no parent or child goals</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      )}

      {selectedTab === 'progress' && (
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-slate-100 mb-4">Progress Tracking</h3>
          <div className="text-center py-12 text-slate-500">
            <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" className="w-12 h-12 mx-auto mb-4" />
            <p>Progress tracking charts and analytics will be displayed here</p>
          </div>
        </GlassCard>
      )}

      {selectedTab === 'activities' && (
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-slate-100 mb-4">Activity Feed</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg">
              <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                <Icon path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-slate-200">Goal updated by {goal.owner}</p>
                <p className="text-sm text-slate-400">Progress increased to {goal.progress}% • 2 days ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-slate-200">Milestone completed</p>
                <p className="text-sm text-slate-400">Key deliverable achieved • 1 week ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Icon path="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-slate-200">Comment added</p>
                <p className="text-sm text-slate-400">Strategy discussion initiated • 2 weeks ago</p>
              </div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default GoalDetailPage;