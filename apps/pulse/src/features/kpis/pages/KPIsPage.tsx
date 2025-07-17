import { TrendingUp, Plus, Target, AlertTriangle, BarChart3, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

const kpis = [
  {
    id: '1',
    title: 'Customer Satisfaction Score',
    value: '4.8/5.0',
    target: '4.5',
    trend: 'up',
    category: 'Customer Experience',
    lastUpdated: '2024-07-17',
    status: 'healthy',
    description: 'Average customer satisfaction rating across all touchpoints',
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
    description: 'Total monthly recurring revenue from subscriptions',
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
    description: 'Percentage of leads that convert to paying customers',
  },
  {
    id: '4',
    title: 'Average Response Time',
    value: '2.3 hours',
    target: '2 hours',
    trend: 'up',
    category: 'Support',
    lastUpdated: '2024-07-17',
    status: 'warning',
    description: 'Average time to respond to customer support tickets',
  },
  {
    id: '5',
    title: 'Employee Net Promoter Score',
    value: '67',
    target: '70',
    trend: 'up',
    category: 'HR',
    lastUpdated: '2024-07-15',
    status: 'warning',
    description: 'Employee satisfaction and likelihood to recommend as workplace',
  },
  {
    id: '6',
    title: 'Website Conversion Rate',
    value: '3.2%',
    target: '3.5%',
    trend: 'down',
    category: 'Marketing',
    lastUpdated: '2024-07-17',
    status: 'warning',
    description: 'Percentage of website visitors who complete desired actions',
  },
]

export default function KPIsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Key Performance Indicators</h1>
          <p className="text-slate-400 mt-1">
            Monitor and track your most important business metrics
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total KPIs</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">24</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">On Target</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">16</p>
            </div>
            <Target className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Below Target</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">6</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Critical</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">2</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* KPIs List */}
      <div className="glass-card p-6">
        <div className="space-y-4">
          {kpis.map((kpi) => (
            <div key={kpi.id} className="glass-card p-6 bg-slate-800/40">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      to={`/kpis/${kpi.id}`}
                      className="text-lg font-semibold text-slate-100 hover:text-blue-300"
                    >
                      {kpi.title}
                    </Link>
                    <span className="text-sm text-slate-400">({kpi.category})</span>
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
                  <p className="text-slate-400 text-sm mb-4">{kpi.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Current Value</p>
                  <p className="text-2xl font-semibold text-slate-100">{kpi.value}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Target</p>
                  <p className="text-2xl font-semibold text-slate-100">{kpi.target}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Trend</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className={`w-5 h-5 ${
                      kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`} />
                    <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {kpi.trend === 'up' ? 'Improving' : 'Declining'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Last Updated</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-300">{new Date(kpi.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button className="text-blue-400 hover:text-blue-300 text-sm">
                      Update Value
                    </button>
                    <button className="text-slate-400 hover:text-slate-300 text-sm">
                      Edit KPI
                    </button>
                  </div>
                  <Link
                    to={`/kpis/${kpi.id}`}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}