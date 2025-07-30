import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, Target, AlertTriangle, Calendar, CheckCircle, Loader2, Plus, BarChart3 } from 'lucide-react';
import { useGoals } from '../../goals/hooks/useGoals';
import { supabase } from '@aesyros/supabase';
import { ProgressOverview } from '../components/ProgressOverview';
import { ProgressHistory } from '../components/ProgressHistory';
import { MilestoneTracker } from '../components/MilestoneTracker';
import { RealtimeProgressFeed } from '../components/RealtimeProgressFeed';

export function ProgressTrackingPage() {
  const [selectedView, setSelectedView] = useState('overview');
  const [filterPeriod, setFilterPeriod] = useState('current-quarter');
  const [filterDepartment, setFilterDepartment] = useState('all');
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

  // Calculate velocity (progress change over time)
  const calculateVelocity = () => {
    // This would ideally be calculated from progress history
    // For now, using a simple approximation
    return Math.round(stats.avgProgress / 4); // Approximate weekly velocity
  };

  const velocity = calculateVelocity();

  if (loading || goalsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 text-sky-400 animate-spin" />
          <span className="text-slate-300">Loading progress data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">Progress Tracking</h1>
          <p className="text-slate-400 mt-2">
            Real-time monitoring and analysis of goal progress across your organization
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
            to="/analytics"
            className="glass-button text-purple-300 hover:text-purple-200 px-4 py-2 flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Overall Progress</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">{stats.avgProgress}%</p>
              <p className="text-xs text-slate-400 mt-1">
                {stats.total > 0 ? `Across ${stats.total} goals` : 'No goals yet'}
              </p>
            </div>
            <Target className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">On Track Goals</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">{stats.onTrack}</p>
              <p className="text-xs text-slate-400 mt-1">
                Out of {stats.total} total
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">At Risk Goals</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">{stats.atRisk}</p>
              <p className="text-xs text-slate-400 mt-1">Need attention</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Completed Goals</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">{stats.completed}</p>
              <p className="text-xs text-slate-400 mt-1">Successfully finished</p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="glass-card p-1">
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
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
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
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

      {/* Main Content Tabs */}
      <div className="space-y-6">
        <div className="flex gap-2 glass-card p-1">
          {[
            { key: 'overview', label: 'Progress Overview' },
            { key: 'realtime', label: 'Live Updates' },
            { key: 'history', label: 'Progress History' },
            { key: 'milestones', label: 'Milestones' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedView(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                selectedView === tab.key
                  ? 'bg-sky-500/20 text-sky-300'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {selectedView === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProgressOverview 
                filterPeriod={filterPeriod}
                filterDepartment={filterDepartment}
                goals={goals}
                departments={departments}
              />
            </div>
            <div className="lg:col-span-1">
              <RealtimeProgressFeed maxUpdates={5} showControls={false} />
            </div>
          </div>
        )}

        {selectedView === 'realtime' && (
          <RealtimeProgressFeed maxUpdates={20} showControls={true} />
        )}

        {selectedView === 'history' && (
          <ProgressHistory 
            filterPeriod={filterPeriod}
            filterDepartment={filterDepartment}
            goals={goals}
          />
        )}

        {selectedView === 'milestones' && (
          <MilestoneTracker 
            filterPeriod={filterPeriod}
            filterDepartment={filterDepartment}
            goals={goals}
          />
        )}
      </div>
    </div>
  );
}