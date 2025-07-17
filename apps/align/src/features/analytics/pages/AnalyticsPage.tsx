import { BarChart3, TrendingUp, TrendingDown, Target, Calendar, Users } from 'lucide-react'

const metrics = [
  {
    name: 'Goal Completion Rate',
    value: '74%',
    change: '+8.1%',
    changeType: 'increase',
    trend: 'up',
  },
  {
    name: 'Average Progress',
    value: '68%',
    change: '+5.4%',
    changeType: 'increase',
    trend: 'up',
  },
  {
    name: 'Overdue Goals',
    value: '3',
    change: '-2',
    changeType: 'decrease',
    trend: 'down',
  },
  {
    name: 'Active Goals',
    value: '12',
    change: '+4',
    changeType: 'increase',
    trend: 'up',
  },
]

const goalsByCategory = [
  { category: 'Strategic', total: 5, completed: 3, progress: 60 },
  { category: 'Operational', total: 4, completed: 3, progress: 75 },
  { category: 'Financial', total: 2, completed: 1, progress: 50 },
  { category: 'Customer', total: 3, completed: 2, progress: 67 },
]

const recentActivity = [
  {
    id: '1',
    type: 'goal_completed',
    title: 'Customer satisfaction improvement completed',
    time: '2 hours ago',
    user: 'Sarah Johnson',
  },
  {
    id: '2',
    type: 'goal_updated',
    title: 'Product launch timeline updated',
    time: '4 hours ago',
    user: 'Mike Chen',
  },
  {
    id: '3',
    type: 'goal_created',
    title: 'New operational efficiency goal created',
    time: '1 day ago',
    user: 'Emily Rodriguez',
  },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Analytics</h1>
          <p className="text-slate-400 mt-1">
            Analyze performance and track progress trends
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="glass-input px-3 py-1 text-sm text-slate-100">
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="180">Last 6 months</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">{metric.name}</p>
                <p className="text-2xl font-semibold text-slate-100 mt-1">{metric.value}</p>
              </div>
              <div className="p-3 rounded-xl bg-sky-500/20">
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-6 h-6 text-sky-400" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-sky-400" />
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                metric.changeType === 'increase' ? 'text-green-400' : 'text-red-400'
              }`}>
                {metric.change}
              </span>
              <span className="text-sm text-slate-400 ml-1">from last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Goals by Category */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-6">Goals by Category</h2>
        <div className="space-y-4">
          {goalsByCategory.map((category) => (
            <div key={category.category} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-slate-100">{category.category}</h3>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span>{category.completed}/{category.total} completed</span>
                  <span>{category.progress}% avg progress</span>
                </div>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div
                  className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${category.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Chart Placeholder */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-6">Progress Trends</h2>
        <div className="h-64 bg-slate-800/40 rounded-lg flex items-center justify-center">
          <div className="text-center text-slate-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-2" />
            <p>Chart visualization would go here</p>
            <p className="text-sm">Integration with charting library needed</p>
          </div>
        </div>
      </div>

      {/* Recent Activity and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="glass-card p-4 bg-slate-800/40">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-sky-500/20">
                    <Target className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-100">{activity.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <Users className="w-3 h-3" />
                      <span>{activity.user}</span>
                      <span>•</span>
                      <Calendar className="w-3 h-3" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-6">Performance Summary</h2>
          <div className="space-y-4">
            <div className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Goals On Track</p>
                  <p className="text-2xl font-semibold text-green-400">85%</p>
                </div>
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
            </div>
            
            <div className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">At Risk Goals</p>
                  <p className="text-2xl font-semibold text-yellow-400">12%</p>
                </div>
                <TrendingDown className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            
            <div className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Overdue Goals</p>
                  <p className="text-2xl font-semibold text-red-400">3%</p>
                </div>
                <TrendingDown className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}