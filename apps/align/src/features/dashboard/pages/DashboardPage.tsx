import { Target, TrendingUp, Users, BarChart3, Plus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const stats = [
  {
    name: 'Active Goals',
    value: '12',
    change: '+4.75%',
    changeType: 'increase',
    icon: Target,
  },
  {
    name: 'Completion Rate',
    value: '85%',
    change: '+12.5%',
    changeType: 'increase',
    icon: TrendingUp,
  },
  {
    name: 'Team Members',
    value: '24',
    change: '+2',
    changeType: 'increase',
    icon: Users,
  },
  {
    name: 'This Quarter',
    value: '94%',
    change: '+5.2%',
    changeType: 'increase',
    icon: BarChart3,
  },
]

const recentGoals = [
  {
    id: '1',
    title: 'Increase customer satisfaction score',
    progress: 78,
    dueDate: '2024-08-15',
    status: 'on-track',
  },
  {
    id: '2',
    title: 'Launch new product feature',
    progress: 45,
    dueDate: '2024-08-30',
    status: 'at-risk',
  },
  {
    id: '3',
    title: 'Reduce operational costs',
    progress: 92,
    dueDate: '2024-07-31',
    status: 'ahead',
  },
]

export default function DashboardPage() {
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

      {/* Company Message/Slogan */}
      <div className="glass-card p-6 text-center">
        <h2 className="text-xl font-semibold text-slate-100 mb-2">
          Align Your Vision, Execute Your Strategy
        </h2>
        <p className="text-slate-400">
          Transform your organizational goals into measurable results with strategic alignment
        </p>
      </div>

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
                <span className="text-sm text-green-400 font-medium">{stat.change}</span>
                <span className="text-sm text-slate-400 ml-1">from last month</span>
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
          {recentGoals.map((goal) => (
            <div key={goal.id} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-center justify-between mb-3">
                <Link
                  to={`/goals/${goal.id}`}
                  className="text-slate-100 hover:text-sky-300 font-medium"
                >
                  {goal.title}
                </Link>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    goal.status === 'on-track'
                      ? 'bg-green-500/20 text-green-400'
                      : goal.status === 'at-risk'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-sky-500/20 text-sky-400'
                  }`}
                >
                  {goal.status === 'on-track' ? 'On Track' : goal.status === 'at-risk' ? 'At Risk' : 'Ahead'}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-400">Progress</span>
                    <span className="text-sm text-slate-300">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-slate-400">
                  Due {new Date(goal.dueDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
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