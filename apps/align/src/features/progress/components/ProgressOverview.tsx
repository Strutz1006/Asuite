import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Clock, Users, Target, ArrowUpRight, Calendar, CheckCircle } from 'lucide-react';
import { Goal } from '../../goals/hooks/useGoals';

interface ProgressOverviewProps {
  filterPeriod: string;
  filterDepartment: string;
  goals: Goal[];
  departments: any[];
}

export function ProgressOverview({ filterPeriod, filterDepartment, goals, departments }: ProgressOverviewProps) {
  // Filter goals based on department and period
  const filteredGoals = goals.filter(goal => {
    if (filterDepartment !== 'all' && goal.department_id !== filterDepartment) {
      return false;
    }
    
    // Apply period filter based on due_date or created_at
    if (filterPeriod !== 'current-quarter') {
      const now = new Date();
      const goalDate = new Date(goal.due_date || goal.created_at);
      
      switch (filterPeriod) {
        case 'last-30-days':
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return goalDate >= thirtyDaysAgo;
        case 'last-90-days':
          const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          return goalDate >= ninetyDaysAgo;
        case 'current-year':
          return goalDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    }
    
    return true;
  });

  // Calculate department-based progress
  const departmentProgress = departments.map(dept => {
    const deptGoals = filteredGoals.filter(goal => goal.department_id === dept.id);
    const avgProgress = deptGoals.length > 0 
      ? Math.round(deptGoals.reduce((sum, goal) => sum + goal.progress_percentage, 0) / deptGoals.length)
      : 0;
    
    const onTrackCount = deptGoals.filter(goal => goal.progress_percentage >= 70).length;
    const status = avgProgress >= 90 ? 'ahead' : 
                   avgProgress >= 70 ? 'on-track' : 
                   avgProgress >= 50 ? 'at-risk' : 'behind';
    
    return {
      id: dept.id,
      name: dept.name,
      progress: avgProgress,
      goals: deptGoals.length,
      onTrack: onTrackCount,
      status,
      trend: avgProgress >= 70 ? 'up' : 'down' // Simplified trend calculation
    };
  }).filter(dept => dept.goals > 0); // Only show departments with goals

  // Top performing goals (highest progress)
  const topPerformingGoals = filteredGoals
    .filter(goal => goal.progress_percentage >= 70)
    .sort((a, b) => b.progress_percentage - a.progress_percentage)
    .slice(0, 3);

  // Goals needing attention (low progress or overdue)
  const needsAttentionGoals = filteredGoals
    .filter(goal => {
      const isLowProgress = goal.progress_percentage < 50;
      const isDueSoon = goal.due_date && new Date(goal.due_date).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;
      const isOverdue = goal.due_date && new Date(goal.due_date) < new Date();
      
      return isLowProgress || isDueSoon || isOverdue;
    })
    .sort((a, b) => a.progress_percentage - b.progress_percentage)
    .slice(0, 5);

  // Helper function to get department name
  const getDepartmentName = (departmentId?: string) => {
    if (!departmentId) return 'No Department';
    const dept = departments.find(d => d.id === departmentId);
    return dept?.name || 'Unknown Department';
  };

  // Helper function to check if goal is overdue
  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  // Helper function to get days until due or overdue
  const getDaysUntilDue = (dueDate?: string) => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'bg-emerald-500/20 text-emerald-300';
      case 'on-track': return 'bg-green-500/20 text-green-300';
      case 'at-risk': return 'bg-yellow-500/20 text-yellow-300';
      case 'behind': return 'bg-red-500/20 text-red-300';
      default: return 'bg-slate-500/20 text-slate-300';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-400" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-400" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Department Progress Overview */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-100">Department Progress Overview</h3>
            <p className="text-slate-400 text-sm mt-1">
              Progress tracking across departments for {filterPeriod.replace('-', ' ')}
            </p>
          </div>
        </div>
        
        {departmentProgress.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No departments with goals for this period</p>
          </div>
        ) : (
          <div className="space-y-6">
            {departmentProgress.map((dept) => (
              <div key={dept.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium text-slate-200">{dept.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dept.status)}`}>
                      {dept.status.replace('-', ' ')}
                    </span>
                    {getTrendIcon(dept.trend)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {dept.goals} goals
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {dept.onTrack} on track
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        dept.progress >= 90 ? 'bg-emerald-500' :
                        dept.progress >= 70 ? 'bg-green-500' :
                        dept.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${dept.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-200 min-w-[3rem]">
                    {dept.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Goals */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <h3 className="text-xl font-semibold text-slate-100">Top Performing Goals</h3>
          </div>
          
          {topPerformingGoals.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No high-performing goals yet</p>
              <p className="text-slate-500 text-sm">Goals with 70%+ progress will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topPerformingGoals.map((goal) => (
                <div key={goal.id} className="space-y-3 p-4 glass-card bg-slate-800/40 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <Link
                        to={`/goals/${goal.id}`}
                        className="font-medium text-slate-200 hover:text-sky-300 transition-colors"
                      >
                        {goal.title}
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Users className="h-3 w-3" />
                        <span>Owner: {goal.owner_id || 'Unassigned'}</span>
                        <span>•</span>
                        <span className="px-2 py-1 rounded text-xs bg-slate-700/50">
                          {getDepartmentName(goal.department_id)}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/goals/${goal.id}`}
                      className="text-slate-400 hover:text-slate-300 p-1"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${goal.progress_percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-200">
                      {goal.progress_percentage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {goal.due_date ? `Due: ${new Date(goal.due_date).toLocaleDateString()}` : 'No due date'}
                    </span>
                    <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">
                      {goal.framework.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Goals Needing Attention */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-5 w-5 text-yellow-400" />
            <h3 className="text-xl font-semibold text-slate-100">Needs Attention</h3>
          </div>
          
          {needsAttentionGoals.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <p className="text-slate-400">All goals are on track!</p>
              <p className="text-slate-500 text-sm">Goals needing attention will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {needsAttentionGoals.map((goal) => {
                const daysUntilDue = getDaysUntilDue(goal.due_date);
                const overdue = isOverdue(goal.due_date);
                
                return (
                  <div key={goal.id} className="space-y-3 p-4 glass-card bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <Link
                          to={`/goals/${goal.id}`}
                          className="font-medium text-slate-200 hover:text-sky-300 transition-colors"
                        >
                          {goal.title}
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Users className="h-3 w-3" />
                          <span>Owner: {goal.owner_id || 'Unassigned'}</span>
                          <span>•</span>
                          <span className="px-2 py-1 rounded text-xs bg-slate-700/50">
                            {getDepartmentName(goal.department_id)}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/goals/${goal.id}`}
                        className="text-slate-400 hover:text-slate-300 p-1"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            goal.progress_percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${goal.progress_percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-200">
                        {goal.progress_percentage}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar className="h-3 w-3" />
                        {goal.due_date ? `Due: ${new Date(goal.due_date).toLocaleDateString()}` : 'No due date'}
                      </span>
                      {overdue && (
                        <span className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400">
                          {Math.abs(daysUntilDue || 0)} days overdue
                        </span>
                      )}
                      {!overdue && daysUntilDue !== null && daysUntilDue <= 7 && (
                        <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">
                          Due in {daysUntilDue} days
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}