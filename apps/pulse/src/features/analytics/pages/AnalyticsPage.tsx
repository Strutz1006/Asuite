import { TrendingUp, BarChart3, PieChart, Activity, Target, AlertTriangle } from 'lucide-react'

const performanceMetrics = [
  {
    name: 'KPI Performance Score',
    value: '89%',
    change: '+12%',
    changeType: 'increase',
    icon: Target,
  },
  {
    name: 'Data Freshness',
    value: '96%',
    change: '+3%',
    changeType: 'increase',
    icon: Activity,
  },
  {
    name: 'Alert Response Time',
    value: '1.2h',
    change: '-0.3h',
    changeType: 'decrease',
    icon: AlertTriangle,
  },
  {
    name: 'Dashboard Views',
    value: '2,847',
    change: '+18%',
    changeType: 'increase',
    icon: BarChart3,
  },
]

const categoryPerformance = [
  { name: 'Customer Experience', score: 92, kpis: 6, onTarget: 5 },
  { name: 'Financial', score: 88, kpis: 4, onTarget: 3 },
  { name: 'Sales', score: 76, kpis: 5, onTarget: 3 },
  { name: 'Marketing', score: 84, kpis: 4, onTarget: 3 },
  { name: 'HR', score: 81, kpis: 3, onTarget: 2 },
  { name: 'Support', score: 79, kpis: 2, onTarget: 1 },
]

const kpiTrends = [
  { name: 'Customer Satisfaction', current: 4.8, previous: 4.6, trend: 'up' },
  { name: 'Revenue Growth', current: 15.2, previous: 12.8, trend: 'up' },
  { name: 'Lead Conversion', current: 18.3, previous: 19.1, trend: 'down' },
  { name: 'Response Time', current: 2.3, previous: 2.1, trend: 'up' },
  { name: 'Employee NPS', current: 67, previous: 65, trend: 'up' },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Analytics</h1>
          <p className="text-slate-400 mt-1">
            Analyze KPI performance and track business metrics trends
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="glass-button text-slate-300 px-4 py-2 bg-slate-800/60 border border-slate-700 rounded-lg">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last 6 months</option>
            <option>Last year</option>
          </select>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.name} className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{metric.name}</p>
                  <p className="text-2xl font-semibold text-slate-100 mt-1">{metric.value}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  metric.changeType === 'increase' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.change}
                </span>
                <span className="text-sm text-slate-400 ml-1">from last month</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Category Performance */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">Performance by Category</h2>
          <PieChart className="w-6 h-6 text-blue-400" />
        </div>
        <div className="space-y-4">
          {categoryPerformance.map((category, index) => (
            <div key={index} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-slate-100">{category.name}</h3>
                <span className={`text-lg font-semibold ${
                  category.score >= 90 ? 'text-green-400' : 
                  category.score >= 80 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {category.score}%
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${category.score}%` }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-400">Total KPIs</p>
                  <p className="text-lg font-semibold text-slate-100">{category.kpis}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-400">On Target</p>
                  <p className="text-lg font-semibold text-slate-100">{category.onTarget}/{category.kpis}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Trends */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">KPI Trends</h2>
          <TrendingUp className="w-6 h-6 text-blue-400" />
        </div>
        <div className="space-y-4">
          {kpiTrends.map((kpi, index) => (
            <div key={index} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-slate-100 mb-1">{kpi.name}</h3>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Current</p>
                      <p className="text-xl font-semibold text-slate-100">{kpi.current}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Previous</p>
                      <p className="text-lg font-semibold text-slate-300">{kpi.previous}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <TrendingUp className={`w-5 h-5 ${
                      kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {kpi.trend === 'up' ? '+' : '-'}{Math.abs(kpi.current - kpi.previous).toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {((kpi.current - kpi.previous) / kpi.previous * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">KPI Performance Over Time</h3>
          <div className="h-64 bg-slate-800/40 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400">Time series chart would appear here</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Category Distribution</h3>
          <div className="h-64 bg-slate-800/40 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400">Pie chart would appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}