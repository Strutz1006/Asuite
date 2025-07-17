import { TrendingUp, BarChart3, PieChart, Users, Route, Zap, Target, AlertTriangle } from 'lucide-react'

const changeMetrics = [
  {
    name: 'Overall Adoption Rate',
    value: '78%',
    change: '+15%',
    changeType: 'increase',
    icon: Target,
  },
  {
    name: 'Stakeholder Engagement',
    value: '85%',
    change: '+8%',
    changeType: 'increase',
    icon: Users,
  },
  {
    name: 'Change Velocity',
    value: '89%',
    change: '+12%',
    changeType: 'increase',
    icon: Zap,
  },
  {
    name: 'Resistance Rate',
    value: '12%',
    change: '-5%',
    changeType: 'decrease',
    icon: AlertTriangle,
  },
]

const journeyPerformance = [
  {
    name: 'Digital Transformation Initiative',
    progress: 65,
    stakeholders: 45,
    engagement: 82,
    onTrack: true,
    budget: 250000,
    spent: 162500,
  },
  {
    name: 'Remote Work Policy Rollout',
    progress: 88,
    stakeholders: 28,
    engagement: 94,
    onTrack: true,
    budget: 50000,
    spent: 38000,
  },
  {
    name: 'New CRM System Implementation',
    progress: 32,
    stakeholders: 18,
    engagement: 68,
    onTrack: false,
    budget: 180000,
    spent: 54000,
  },
]

const engagementTrends = [
  { month: 'Jan', engagement: 65, adoption: 45 },
  { month: 'Feb', engagement: 68, adoption: 52 },
  { month: 'Mar', engagement: 72, adoption: 58 },
  { month: 'Apr', engagement: 75, adoption: 65 },
  { month: 'May', engagement: 78, adoption: 71 },
  { month: 'Jun', engagement: 82, adoption: 75 },
  { month: 'Jul', engagement: 85, adoption: 78 },
]

const departmentReadiness = [
  { department: 'Engineering', readiness: 92, stakeholders: 24 },
  { department: 'Marketing', readiness: 88, stakeholders: 18 },
  { department: 'Sales', readiness: 84, stakeholders: 16 },
  { department: 'HR', readiness: 89, stakeholders: 12 },
  { department: 'Operations', readiness: 76, stakeholders: 20 },
  { department: 'Finance', readiness: 82, stakeholders: 14 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Analytics</h1>
          <p className="text-slate-400 mt-1">
            Track change adoption, engagement, and transformation success
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

      {/* Change Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {changeMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.name} className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{metric.name}</p>
                  <p className="text-2xl font-semibold text-slate-100 mt-1">{metric.value}</p>
                </div>
                <div className="p-3 rounded-xl bg-violet-500/20">
                  <Icon className="w-6 h-6 text-violet-400" />
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

      {/* Journey Performance */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">Journey Performance</h2>
          <Route className="w-6 h-6 text-violet-400" />
        </div>
        <div className="space-y-4">
          {journeyPerformance.map((journey, index) => (
            <div key={index} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-medium text-slate-100">{journey.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    journey.onTrack 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {journey.onTrack ? 'On Track' : 'At Risk'}
                  </span>
                </div>
                <div className="text-sm text-slate-400">
                  {journey.stakeholders} stakeholders
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-400">Progress</span>
                    <span className="text-sm text-slate-300">{journey.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className="bg-violet-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${journey.progress}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-400">Engagement</span>
                    <span className="text-sm text-slate-300">{journey.engagement}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${journey.engagement}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-400">Budget</span>
                    <span className="text-sm text-slate-300">{Math.round((journey.spent / journey.budget) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(journey.spent / journey.budget) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Budget Spent</p>
                  <p className="text-sm font-medium text-slate-100">
                    ${journey.spent.toLocaleString()} / ${journey.budget.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Readiness */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">Department Change Readiness</h2>
          <Users className="w-6 h-6 text-violet-400" />
        </div>
        <div className="space-y-4">
          {departmentReadiness.map((dept, index) => (
            <div key={index} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-medium text-slate-100">{dept.department}</h3>
                    <span className="text-sm text-slate-400">{dept.stakeholders} stakeholders</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-400">Readiness Score</span>
                        <span className="text-sm font-medium text-slate-300">{dept.readiness}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            dept.readiness >= 85 ? 'bg-green-500' : 
                            dept.readiness >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${dept.readiness}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-bold ${
                    dept.readiness >= 85 ? 'text-green-400' : 
                    dept.readiness >= 70 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {dept.readiness}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Engagement & Adoption Trends</h3>
          <div className="h-64 bg-slate-800/40 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400">Line chart showing engagement trends would appear here</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Stakeholder Distribution</h3>
          <div className="h-64 bg-slate-800/40 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400">Pie chart showing stakeholder distribution would appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}