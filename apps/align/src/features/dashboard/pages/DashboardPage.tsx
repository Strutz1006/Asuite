import { Target, TrendingUp, Users, BarChart3, Plus, ArrowRight, Loader2, Building2, CheckCircle, Activity, AlertTriangle, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSetupStatus } from '@/hooks/useSetupStatus'
import { useGoals } from '@/features/goals/hooks/useGoals'
import { useEffect, useState } from 'react'
import { supabase } from '@aesyros/supabase'

export default function DashboardPage() {
  const { isSetupComplete, loading: setupLoading, organization } = useSetupStatus()
  const { goals, loading: goalsLoading, getGoalStats } = useGoals()
  const [teamCount, setTeamCount] = useState(0)
  const [departmentCount, setDepartmentCount] = useState(0)
  const [statsLoading, setStatsLoading] = useState(true)
  
  const goalStats = getGoalStats()
  
  // Fetch additional stats
  useEffect(() => {
    if (organization?.id) {
      fetchAdditionalStats()
    }
  }, [organization])
  
  const fetchAdditionalStats = async () => {
    try {
      setStatsLoading(true)
      
      // Get team member count
      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organization?.id)
      
      setTeamCount(userCount || 0)
      
      // Get department count
      const { count: deptCount } = await supabase
        .from('departments')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organization?.id)
      
      setDepartmentCount(deptCount || 0)
      
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }
  
  // Separate objectives and goals
  const objectives = goals.filter(g => g.strategic_level === 'objective' || g.framework === 'objective')
  const actualGoals = goals.filter(g => g.strategic_level === 'goal' || (g.framework !== 'objective' && !g.strategic_level))
  
  // Calculate strategic metrics
  const activeObjectives = objectives.filter(o => o.status === 'active').length
  const activeGoals = actualGoals.filter(g => g.status === 'active').length
  const completionRate = goalStats.total > 0 
    ? Math.round((goalStats.completed / goalStats.total) * 100) 
    : 0
  
  // Calculate company performance - strategic targets likelihood
  const currentYear = new Date().getFullYear()
  const yearEndGoals = goals.filter(g => {
    if (!g.due_date) return false
    return new Date(g.due_date).getFullYear() === currentYear
  })
  
  const onTrackGoals = yearEndGoals.filter(g => g.progress_percentage >= 70).length
  const atRiskGoals = yearEndGoals.filter(g => g.progress_percentage >= 40 && g.progress_percentage < 70).length
  const behindGoals = yearEndGoals.filter(g => g.progress_percentage < 40).length
  
  const strategicLikelihood = yearEndGoals.length > 0
    ? Math.round(((onTrackGoals * 1.0 + atRiskGoals * 0.6 + behindGoals * 0.2) / yearEndGoals.length) * 100)
    : 0
    
  // Calculate alignment score (how many goals are linked to objectives)
  const goalsWithObjectives = actualGoals.filter(g => g.parent_id && objectives.some(o => o.id === g.parent_id)).length
  const alignmentScore = actualGoals.length > 0 
    ? Math.round((goalsWithObjectives / actualGoals.length) * 100)
    : 100 // 100% if no goals yet
    
  // Get recent activities for company performance
  const recentGoals = goals
    .filter(g => g.status === 'active')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5)
  
  const stats = [
    {
      name: 'Strategic Objectives',
      value: activeObjectives.toString(),
      change: objectives.length > activeObjectives ? `${objectives.length - activeObjectives} inactive` : 'All active',
      changeType: objectives.length > activeObjectives ? 'neutral' : 'increase',
      icon: Building2,
    },
    {
      name: 'Active Goals',
      value: activeGoals.toString(),
      change: actualGoals.length > activeGoals ? `${actualGoals.length - activeGoals} inactive` : 'All active',
      changeType: actualGoals.length > activeGoals ? 'neutral' : 'increase',
      icon: Target,
    },
    {
      name: 'Completion Rate',
      value: `${completionRate}%`,
      change: completionRate > 80 ? 'Excellent' : completionRate > 60 ? 'Good progress' : 'Needs focus',
      changeType: completionRate > 80 ? 'increase' : completionRate > 60 ? 'neutral' : 'decrease',
      icon: TrendingUp,
    },
    {
      name: 'Alignment Score',
      value: `${alignmentScore}%`,
      change: `${goalsWithObjectives}/${actualGoals.length} linked`,
      changeType: alignmentScore > 80 ? 'increase' : alignmentScore > 60 ? 'neutral' : 'decrease',
      icon: Activity,
    },
  ]

  if (setupLoading || goalsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-sky-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Track your strategic goals and organizational alignment
          </p>
        </div>
        <Link
          to="/goals/new"
          className="glass-button text-sky-300 hover:text-sky-200 px-4 py-2 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </Link>
      </div>

      {/* Company Setup Notice or Welcome Message */}
      {!isSetupComplete ? (
        <div className="glass-card p-6 text-center border border-yellow-500/20">
          <h2 className="text-xl font-semibold text-slate-100 mb-2">
            Company Setup Required
          </h2>
          <p className="text-slate-400 mb-4">
            Complete your company setup to start using Align effectively
          </p>
          <Link
            to="/setup"
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Complete Setup
          </Link>
        </div>
      ) : (
        <div className="glass-card p-6 text-center">
          <h2 className="text-xl font-semibold text-slate-100 mb-2">
            Welcome to {organization?.name || 'Your Organization'}
          </h2>
          <p className="text-slate-400">
            {organization?.mission_statement || 'Transform your organizational goals into measurable results with strategic alignment'}
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{stat.name}</p>
                  <p className="text-2xl font-semibold text-slate-100 mt-1">{stat.value}</p>
                </div>
                <div className="p-3 rounded-xl bg-sky-500/20">
                  <Icon className="w-6 h-6 text-sky-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-400' : 
                  stat.changeType === 'decrease' ? 'text-red-400' : 
                  'text-slate-400'
                }`}>{stat.change}</span>
                <span className="text-sm text-slate-400 ml-1">
                  {stat.changeType === 'neutral' ? '' : 'from last month'}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Company Performance */}
      <div className="glass-card p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-yellow-400" />
            <h2 className="text-3xl font-bold text-slate-100">Company Performance</h2>
          </div>
          <div className="text-6xl font-bold text-slate-100 mb-2">{strategicLikelihood}%</div>
          <div className="text-xl text-slate-300 mb-6">Strategic Target Likelihood</div>
          
          <div className="max-w-2xl mx-auto">
            <div className="w-full bg-slate-700/50 rounded-full h-4 mb-4">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ${
                  strategicLikelihood >= 80 ? 'bg-green-500' :
                  strategicLikelihood >= 60 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${strategicLikelihood}%` }}
              />
            </div>
            <p className="text-slate-400">
              Likelihood of achieving {yearEndGoals.length} strategic targets for {currentYear}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-6 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center justify-center gap-2 mb-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-lg font-semibold text-green-400">On Track</span>
            </div>
            <div className="text-4xl font-bold text-slate-100 mb-2">{onTrackGoals}</div>
            <div className="text-sm text-slate-400">{yearEndGoals.length > 0 ? Math.round((onTrackGoals / yearEndGoals.length) * 100) : 0}% of strategic targets</div>
          </div>
          
          <div className="text-center p-6 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <div className="flex items-center justify-center gap-2 mb-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <span className="text-lg font-semibold text-yellow-400">At Risk</span>
            </div>
            <div className="text-4xl font-bold text-slate-100 mb-2">{atRiskGoals}</div>
            <div className="text-sm text-slate-400">{yearEndGoals.length > 0 ? Math.round((atRiskGoals / yearEndGoals.length) * 100) : 0}% of strategic targets</div>
          </div>
          
          <div className="text-center p-6 bg-red-500/10 rounded-lg border border-red-500/20">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Activity className="w-6 h-6 text-red-400" />
              <span className="text-lg font-semibold text-red-400">Behind</span>
            </div>
            <div className="text-4xl font-bold text-slate-100 mb-2">{behindGoals}</div>
            <div className="text-sm text-slate-400">{yearEndGoals.length > 0 ? Math.round((behindGoals / yearEndGoals.length) * 100) : 0}% of strategic targets</div>
          </div>
        </div>
      </div>

      {/* Alignment Score Visualization */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <Activity className="w-6 h-6 text-purple-400" />
            Strategic Alignment
          </h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-100">{alignmentScore}%</div>
            <div className="text-sm text-slate-400">Alignment Score</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-slate-800/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Goals Linked to Objectives</span>
              <span className="text-sm font-medium text-slate-300">{goalsWithObjectives} / {actualGoals.length}</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  alignmentScore >= 80 ? 'bg-purple-500' :
                  alignmentScore >= 60 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${alignmentScore}%` }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-slate-800/20 rounded-lg">
              <div className="text-purple-300 font-medium mb-1">Aligned Goals</div>
              <div className="text-slate-300">{goalsWithObjectives} goals connected to strategic objectives</div>
            </div>
            <div className="p-3 bg-slate-800/20 rounded-lg">
              <div className="text-slate-400 font-medium mb-1">Unaligned Goals</div>
              <div className="text-slate-300">{actualGoals.length - goalsWithObjectives} goals operating independently</div>
            </div>
          </div>
          
          {alignmentScore < 80 && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-yellow-300 mb-1">Alignment Opportunity</div>
                  <div className="text-xs text-slate-300">
                    {alignmentScore < 60 
                      ? 'Consider linking more goals to strategic objectives for better organizational alignment'
                      : 'Good progress! A few more goal-objective connections would strengthen strategic alignment'
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/goals/new" className="glass-card p-6 hover:bg-slate-800/40 transition-colors">
          <Target className="w-8 h-8 text-sky-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Create Goal</h3>
          <p className="text-slate-400 text-sm">Set up a new strategic goal with key results</p>
        </Link>
        
        <Link to="/objectives" className="glass-card p-6 hover:bg-slate-800/40 transition-colors">
          <Building2 className="w-8 h-8 text-green-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">View Objectives</h3>
          <p className="text-slate-400 text-sm">See the complete strategic hierarchy and alignment</p>
        </Link>
        
        <Link to="/analytics" className="glass-card p-6 hover:bg-slate-800/40 transition-colors">
          <BarChart3 className="w-8 h-8 text-purple-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Analytics</h3>
          <p className="text-slate-400 text-sm">Analyze performance and track progress trends</p>
        </Link>
      </div>
    </div>
  )
}