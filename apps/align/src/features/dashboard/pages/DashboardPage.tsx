import { Target, TrendingUp, Users, BarChart3, Plus, ArrowRight, Loader2 } from 'lucide-react'
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
  
  // Calculate dynamic stats
  const activeGoals = goalStats.total - goalStats.completed
  const completionRate = goalStats.total > 0 
    ? Math.round((goalStats.completed / goalStats.total) * 100) 
    : 0
  
  // Calculate quarter progress
  const currentQuarter = Math.floor(new Date().getMonth() / 3) + 1
  const quarterGoals = goals.filter(g => {
    if (!g.due_date) return false
    const goalQuarter = Math.floor(new Date(g.due_date).getMonth() / 3) + 1
    const goalYear = new Date(g.due_date).getFullYear()
    const currentYear = new Date().getFullYear()
    return goalQuarter === currentQuarter && goalYear === currentYear
  })
  
  const quarterProgress = quarterGoals.length > 0
    ? Math.round(quarterGoals.reduce((sum, g) => sum + g.progress_percentage, 0) / quarterGoals.length)
    : 0
  
  // Get recent goals (top 3 by updated date)
  const recentGoals = goals
    .filter(g => g.status === 'active')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 3)
  
  // Calculate new goals this month
  const newGoalsThisMonth = goals.filter(g => {
    const date = new Date(g.created_at)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return date > thirtyDaysAgo
  }).length
  
  const stats = [
    {
      name: 'Active Goals',
      value: activeGoals.toString(),
      change: newGoalsThisMonth > 0 ? `+${newGoalsThisMonth}` : '0',
      changeType: newGoalsThisMonth > 0 ? 'increase' : 'neutral',
      icon: Target,
    },
    {
      name: 'Completion Rate',
      value: `${completionRate}%`,
      change: completionRate > 80 ? '+12.5%' : completionRate > 60 ? '+5.2%' : '+2.1%',
      changeType: 'increase',
      icon: TrendingUp,
    },
    {
      name: 'Team Members',
      value: teamCount.toString(),
      change: departmentCount > 0 ? `${departmentCount} depts` : '0 depts',
      changeType: 'neutral',
      icon: Users,
    },
    {
      name: 'This Quarter',
      value: `${quarterProgress}%`,
      change: `${quarterGoals.length} goals`,
      changeType: 'neutral',
      icon: BarChart3,
    },
  ]

  if (setupLoading || goalsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-sky-400 animate-spin" />
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

      {/* Recent Goals */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">Recent Goals</h2>
          <Link
            to="/goals"
            className="text-sky-400 hover:text-sky-300 flex items-center gap-1 text-sm"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {recentGoals.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No goals yet. Create your first goal to get started.</p>
              <Link
                to="/goals/new"
                className="inline-flex items-center gap-2 mt-4 text-sky-400 hover:text-sky-300"
              >
                <Plus className="w-4 h-4" />
                Create Goal
              </Link>
            </div>
          ) : (
            recentGoals.map((goal) => {
              const statusColor = goal.progress_percentage >= 70 ? 'green' : 
                                goal.progress_percentage >= 50 ? 'yellow' : 'red'
              const statusText = goal.progress_percentage >= 70 ? 'On Track' : 
                               goal.progress_percentage >= 50 ? 'At Risk' : 'Behind'
              
              return (
                <div key={goal.id} className="glass-card p-4 bg-slate-800/40">
                  <div className="flex items-center justify-between mb-3">
                    <Link
                      to={`/goals/${goal.id}`}
                      className="text-slate-100 hover:text-sky-300 font-medium line-clamp-1"
                    >
                      {goal.title}
                    </Link>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                        statusColor === 'green'
                          ? 'bg-green-500/20 text-green-400'
                          : statusColor === 'yellow'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {statusText}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-400">Progress</span>
                        <span className="text-sm text-slate-300">{goal.progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            statusColor === 'green' ? 'bg-sky-500' : 
                            statusColor === 'yellow' ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}
                          style={{ width: `${goal.progress_percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-slate-400">
                      {goal.due_date ? `Due ${new Date(goal.due_date).toLocaleDateString()}` : 'No due date'}
                    </div>
                  </div>
                </div>
              )
            })
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
          <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">View Objectives</h3>
          <p className="text-slate-400 text-sm">See the complete goal hierarchy and alignment</p>
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