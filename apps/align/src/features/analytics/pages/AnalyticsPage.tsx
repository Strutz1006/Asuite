import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar, 
  Users, 
  Download,
  RefreshCw,
  Filter,
  PieChart,
  Activity,
  AlertTriangle,
  Loader2,
  Plus,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useGoals } from '../../goals/hooks/useGoals';
import { supabase } from '@aesyros/supabase';

export default function AnalyticsPage() {
  const [selectedView, setSelectedView] = useState('overview');
  const [timePeriod, setTimePeriod] = useState('current-quarter');
  const [department, setDepartment] = useState('all');
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { goals, loading: goalsLoading, getGoalStats } = useGoals();
  const stats = getGoalStats();

  // Fetch departments for filtering
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await supabase
          .from('departments')
          .select('id, name')
          .order('name');
        
        if (data) {
          setDepartments(data);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Filter goals based on time period and department
  const filteredGoals = goals.filter(goal => {
    if (department !== 'all' && goal.department_id !== department) {
      return false;
    }
    
    // Apply time period filter
    if (timePeriod !== 'current-quarter') {
      const now = new Date();
      const goalDate = new Date(goal.due_date || goal.created_at);
      
      switch (timePeriod) {
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

  // Calculate analytics data
  const analyticsData = {
    totalGoals: filteredGoals.length,
    completedGoals: filteredGoals.filter(g => g.status === 'completed').length,
    onTrackGoals: filteredGoals.filter(g => g.progress_percentage >= 70 && g.status === 'active').length,
    atRiskGoals: filteredGoals.filter(g => g.progress_percentage < 50 && g.status === 'active').length,
    avgProgress: filteredGoals.length > 0 
      ? Math.round(filteredGoals.reduce((sum, g) => sum + g.progress_percentage, 0) / filteredGoals.length)
      : 0
  };

  const completionRate = analyticsData.totalGoals > 0 
    ? Math.round((analyticsData.completedGoals / analyticsData.totalGoals) * 100)
    : 0;

  // Calculate new goals this period (approximation)
  const newGoalsThisPeriod = filteredGoals.filter(g => {
    const created = new Date(g.created_at);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return created >= thirtyDaysAgo;
  }).length;

  // Department analytics
  const departmentAnalytics = departments.map(dept => {
    const deptGoals = filteredGoals.filter(g => g.department_id === dept.id);
    const completed = deptGoals.filter(g => g.status === 'completed').length;
    const avgProgress = deptGoals.length > 0 
      ? Math.round(deptGoals.reduce((sum, g) => sum + g.progress_percentage, 0) / deptGoals.length)
      : 0;
    
    return {
      id: dept.id,
      name: dept.name,
      goals: deptGoals.length,
      completed,
      avgProgress,
      completionRate: deptGoals.length > 0 ? Math.round((completed / deptGoals.length) * 100) : 0
    };
  }).filter(dept => dept.goals > 0);

  if (loading || goalsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 text-sky-400 animate-spin" />
          <span className="text-slate-300">Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">Analytics Dashboard</h1>
          <p className="text-slate-400 mt-2">
            Comprehensive insights and performance analysis for your organization's goals
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/goals/new"
            className="glass-button text-sky-300 hover:text-sky-200 px-4 py-2 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Goal
          </Link>
          <Link
            to="/progress"
            className="glass-button text-purple-300 hover:text-purple-200 px-4 py-2 flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Progress Tracking
          </Link>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Goals</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">{analyticsData.totalGoals}</p>
              <p className="text-xs text-slate-400 mt-1">
                {newGoalsThisPeriod > 0 ? `+${newGoalsThisPeriod} this period` : 'No new goals'}
              </p>
            </div>
            <Target className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Completion Rate</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">{completionRate}%</p>
              <p className="text-xs text-green-400 mt-1">
                {analyticsData.completedGoals} completed
              </p>
            </div>
            <PieChart className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Avg Progress</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">{analyticsData.avgProgress}%</p>
              <p className="text-xs text-slate-400 mt-1">Across all goals</p>
            </div>
            <Activity className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">At Risk</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">{analyticsData.atRiskGoals}</p>
              <p className="text-xs text-red-400 mt-1">Need attention</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">On Track</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">{analyticsData.onTrackGoals}</p>
              <p className="text-xs text-green-400 mt-1">Performing well</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="glass-card p-1">
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="bg-transparent text-slate-200 px-3 py-2 text-sm focus:outline-none"
          >
            <option value="current-quarter">Current Quarter</option>
            <option value="last-quarter">Last Quarter</option>
            <option value="current-year">Current Year</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="last-90-days">Last 90 Days</option>
          </select>
        </div>
        
        <div className="glass-card p-1">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="bg-transparent text-slate-200 px-3 py-2 text-sm focus:outline-none"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Analytics Content */}
      <div className="space-y-8">
        {/* Goals by Status */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-slate-100 mb-6">Goals by Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-4 bg-green-500/10 border border-green-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium text-slate-200">Completed</span>
                </div>
                <span className="text-xs text-green-400">
                  {analyticsData.totalGoals > 0 ? Math.round((analyticsData.completedGoals / analyticsData.totalGoals) * 100) : 0}%
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-100 mb-1">{analyticsData.completedGoals}</div>
            </div>

            <div className="glass-card p-4 bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-200">On Track</span>
                </div>
                <span className="text-xs text-blue-400">
                  {analyticsData.totalGoals > 0 ? Math.round((analyticsData.onTrackGoals / analyticsData.totalGoals) * 100) : 0}%
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-100 mb-1">{analyticsData.onTrackGoals}</div>
            </div>

            <div className="glass-card p-4 bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium text-slate-200">At Risk</span>
                </div>
                <span className="text-xs text-yellow-400">
                  {analyticsData.totalGoals > 0 ? Math.round((analyticsData.atRiskGoals / analyticsData.totalGoals) * 100) : 0}%
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-100 mb-1">{analyticsData.atRiskGoals}</div>
            </div>

            <div className="glass-card p-4 bg-slate-500/10 border border-slate-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-200">Active</span>
                </div>
                <span className="text-xs text-slate-400">
                  {analyticsData.totalGoals - analyticsData.completedGoals}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-100 mb-1">
                {analyticsData.totalGoals - analyticsData.completedGoals}
              </div>
            </div>
          </div>
        </div>

        {/* Department Performance */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-slate-100 mb-6">Department Performance</h3>
          {departmentAnalytics.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No department data available for this period</p>
            </div>
          ) : (
            <div className="space-y-6">
              {departmentAnalytics.map((dept) => (
                <div key={dept.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-slate-200">{dept.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dept.avgProgress >= 70 ? 'bg-green-500/20 text-green-400' :
                        dept.avgProgress >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {dept.avgProgress >= 70 ? 'On Track' : dept.avgProgress >= 50 ? 'At Risk' : 'Behind'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>{dept.completed}/{dept.goals} completed</span>
                      <span>{dept.completionRate}% completion rate</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          dept.avgProgress >= 70 ? 'bg-green-500' :
                          dept.avgProgress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${dept.avgProgress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-200 min-w-[3rem]">
                      {dept.avgProgress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Performing Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <h3 className="text-xl font-semibold text-slate-100">Top Performing Goals</h3>
            </div>
            
            {filteredGoals.filter(g => g.progress_percentage >= 70).length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">No high-performing goals yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredGoals
                  .filter(g => g.progress_percentage >= 70)
                  .sort((a, b) => b.progress_percentage - a.progress_percentage)
                  .slice(0, 5)
                  .map((goal) => (
                    <Link
                      key={goal.id}
                      to={`/goals/${goal.id}`}
                      className="flex items-center justify-between p-3 glass-card bg-slate-800/40 rounded-lg hover:bg-slate-700/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="font-medium text-slate-200">{goal.title}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-slate-200">{goal.progress_percentage}%</div>
                        <div className="text-xs text-green-400">{goal.framework.toUpperCase()}</div>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <h3 className="text-xl font-semibold text-slate-100">Needs Attention</h3>
            </div>
            
            {filteredGoals.filter(g => g.progress_percentage < 50).length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <p className="text-slate-400">All goals are performing well!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredGoals
                  .filter(g => g.progress_percentage < 50)
                  .sort((a, b) => a.progress_percentage - b.progress_percentage)
                  .slice(0, 5)
                  .map((goal) => (
                    <Link
                      key={goal.id}
                      to={`/goals/${goal.id}`}
                      className="flex items-center justify-between p-3 glass-card bg-red-500/5 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full" />
                        <span className="font-medium text-slate-200">{goal.title}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-slate-200">{goal.progress_percentage}%</div>
                        <div className="text-xs text-red-400">Behind schedule</div>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}