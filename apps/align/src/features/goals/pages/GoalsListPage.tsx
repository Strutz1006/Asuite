import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard, Icon } from '../../shared/components';
import { mockCompanyObjective, mockDepartmentObjectives, mockIndividualGoals } from '../../shared/data/mockData';
import type { Goal } from '@aesyros/types';

const GoalsListPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'on-track' | 'at-risk' | 'completed'>('all');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'company' | 'department' | 'individual'>('all');

  const allGoals = [mockCompanyObjective, ...mockDepartmentObjectives, ...mockIndividualGoals];

  const filteredGoals = allGoals.filter(goal => {
    const statusMatch = selectedFilter === 'all' || goal.status === selectedFilter;
    const levelMatch = selectedLevel === 'all' || (
      (selectedLevel === 'company' && !goal.parentGoal) ||
      (selectedLevel === 'department' && goal.parentGoal === '1') ||
      (selectedLevel === 'individual' && goal.parentGoal && goal.parentGoal !== '1')
    );
    return statusMatch && levelMatch;
  });

  const getGoalLevel = (goal: Goal) => {
    if (!goal.parentGoal) return 'Company';
    if (goal.parentGoal === '1') return 'Department';
    return 'Individual';
  };

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'on-track': return 'text-green-400 bg-green-500/20';
      case 'at-risk': return 'text-yellow-400 bg-yellow-500/20';
      case 'completed': return 'text-blue-400 bg-blue-500/20';
      case 'paused': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
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

  return (
    <div className="min-h-screen space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Goals & Objectives</h1>
          <p className="text-slate-400 mt-1">Track progress across all organizational levels</p>
        </div>
        <Link 
          to="/goals/new"
          className="bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold py-2 px-5 rounded-lg shadow-lg hover:from-sky-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all"
        >
          + New Goal
        </Link>
      </div>

      {/* Filters */}
      <GlassCard className="p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-300">Status:</span>
            <div className="flex gap-2">
              {['all', 'on-track', 'at-risk', 'completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedFilter(status as any)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === status
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-300">Level:</span>
            <div className="flex gap-2">
              {['all', 'company', 'department', 'individual'].map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level as any)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedLevel === level
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.map(goal => (
          <GlassCard key={goal.id} className="p-6 hover:border-sky-500/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-slate-100">{goal.title}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300">
                    {getGoalLevel(goal)}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(goal.status)}`}>
                    {goal.status.charAt(0).toUpperCase() + goal.status.slice(1).replace('-', ' ')}
                  </span>
                </div>
                
                {goal.description && (
                  <p className="text-slate-400 mb-3 max-w-3xl">{goal.description}</p>
                )}
                
                <div className="flex items-center gap-6 text-sm text-slate-400">
                  <span>Owner: {goal.owner}</span>
                  {goal.dueDate && (
                    <span>Due: {goal.dueDate.toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-sky-400">{goal.progress}%</div>
                  <div className="w-32 bg-slate-700 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(goal.status)}`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Link
                    to={`/goals/${goal.id}`}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Icon path="M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-5 h-5 text-slate-400" />
                  </Link>
                  <Link
                    to={`/goals/${goal.id}/edit`}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    title="Edit Goal"
                  >
                    <Icon path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" className="w-5 h-5 text-slate-400" />
                  </Link>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredGoals.length === 0 && (
        <GlassCard className="p-8 text-center">
          <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z" className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No goals found</h3>
          <p className="text-slate-500 mb-4">Try adjusting your filters or create a new goal to get started.</p>
          <Link 
            to="/goals/new"
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Icon path="M12 4v16m8-8H4" className="w-5 h-5" />
            Create New Goal
          </Link>
        </GlassCard>
      )}
    </div>
  );
};

export default GoalsListPage;