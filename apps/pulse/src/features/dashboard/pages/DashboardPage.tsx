import { Activity, TrendingUp, Target, AlertTriangle, Plus, ArrowRight, BarChart3, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

const stats = [
  {
    name: 'Active KPIs',
    value: '24',
    change: '+6',
    changeType: 'increase',
    icon: TrendingUp,
  },
  {
    name: 'Performance Score',
    value: '89%',
    change: '+12%',
    changeType: 'increase',
    icon: Target,
  },
  {
    name: 'Data Sources',
    value: '8',
    change: '+2',
    changeType: 'increase',
    icon: BarChart3,
  },
  {
    name: 'Avg Response Time',
    value: '2.3s',
    change: '-0.5s',
    changeType: 'decrease',
    icon: Clock,
  },
]

const recentKPIs = [
  {
    id: '1',
    title: 'Customer Satisfaction Score',
    value: '4.8/5.0',
    target: '4.5',
    trend: 'up',
    category: 'Customer Experience',
    lastUpdated: '2024-07-17',
    status: 'healthy',
  },
  {
    id: '2',
    title: 'Monthly Recurring Revenue',
    value: '$124,500',
    target: '$120,000',
    trend: 'up',
    category: 'Financial',
    lastUpdated: '2024-07-17',
    status: 'healthy',
  },
  {
    id: '3',
    title: 'Lead Conversion Rate',
    value: '18.3%',
    target: '20%',
    trend: 'down',
    category: 'Sales',
    lastUpdated: '2024-07-16',
    status: 'warning',
  },
]

const alerts = [
  {
    id: '1',
    title: 'Website Traffic Below Threshold',
    metric: 'Organic Traffic',
    severity: 'medium',
    description: 'Traffic has dropped 15% below target for 3 consecutive days',
    time: '2 hours ago',
  },
  {
    id: '2',
    title: 'Support Response Time Exceeded',
    metric: 'Average Response Time',
    severity: 'high',
    description: 'Response time is 2.3x higher than target SLA',
    time: '4 hours ago',
  },
  {
    id: '3',
    title: 'Sales Pipeline Opportunity',
    metric: 'Pipeline Value',
    severity: 'low',
    description: 'Q3 pipeline is 20% ahead of target',
    time: '1 day ago',
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
            Monitor your key performance indicators and business metrics
          </p>
        </div>
        <Link
          to="/builder"
          className="glass-button text-blue-300 hover:text-blue-200 px-4 py-2 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create KPI
        </Link>
      </div>

      {/* Company Message/Slogan */}
      <div className="glass-card p-6 text-center">
        <h2 className="text-xl font-semibold text-slate-100 mb-2">
          Measure What Matters, Track What Drives Success
        </h2>
        <p className="text-slate-400">
          Design meaningful KPIs that align with your mission and drive strategic performance
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
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-slate-400 ml-1">from last month</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent KPIs */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">Key Performance Indicators</h2>
          <Link
            to="/kpis"
            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {recentKPIs.map((kpi) => (
            <div key={kpi.id} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Link
                    to={`/kpis/${kpi.id}`}
                    className="text-slate-100 hover:text-blue-300 font-medium"
                  >
                    {kpi.title}
                  </Link>
                  <span className="text-sm text-slate-400">({kpi.category})</span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    kpi.status === 'healthy'
                      ? 'bg-green-500/20 text-green-400'
                      : kpi.status === 'warning'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {kpi.status === 'healthy' ? 'On Target' : kpi.status === 'warning' ? 'Below Target' : 'Critical'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Current Value</p>
                  <p className="text-lg font-semibold text-slate-100">{kpi.value}</p>
                </div>
                <div>
                  <p className="text-slate-400">Target</p>
                  <p className="text-lg font-semibold text-slate-100">{kpi.target}</p>
                </div>
                <div>
                  <p className="text-slate-400">Trend</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className={`w-4 h-4 ${
                      kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`} />
                    <span className={kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}>
                      {kpi.trend === 'up' ? 'Improving' : 'Declining'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-slate-400">Last Updated</p>
                  <p className="text-slate-300">{new Date(kpi.lastUpdated).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Performance Alerts
          </h2>
          <Link
            to="/alerts"
            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-slate-100 font-medium">{alert.title}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.severity === 'high'
                          ? 'bg-red-500/20 text-red-400'
                          : alert.severity === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}
                    >
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-2">{alert.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>Metric: <span className="text-blue-400">{alert.metric}</span></span>
                    <span>{alert.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/builder" className="glass-card p-6 hover:bg-slate-800/40 transition-colors">
          <Plus className="w-8 h-8 text-blue-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Create KPI</h3>
          <p className="text-slate-400 text-sm">Design a new KPI with our guided builder</p>
        </Link>
        
        <Link to="/kpis" className="glass-card p-6 hover:bg-slate-800/40 transition-colors">
          <Activity className="w-8 h-8 text-green-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">View KPIs</h3>
          <p className="text-slate-400 text-sm">Monitor all your key performance indicators</p>
        </Link>
        
        <Link to="/analytics" className="glass-card p-6 hover:bg-slate-800/40 transition-colors">
          <BarChart3 className="w-8 h-8 text-purple-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Analytics</h3>
          <p className="text-slate-400 text-sm">Analyze performance trends and insights</p>
        </Link>
      </div>
    </div>
  )
}