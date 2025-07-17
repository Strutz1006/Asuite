import { Zap, Users, TrendingUp, AlertCircle, Plus, ArrowRight, Clock, CheckCircle, Route } from 'lucide-react'
import { Link } from 'react-router-dom'

const stats = [
  {
    name: 'Active Journeys',
    value: '6',
    change: '+2',
    changeType: 'increase',
    icon: Route,
  },
  {
    name: 'Adoption Rate',
    value: '78%',
    change: '+15%',
    changeType: 'increase',
    icon: TrendingUp,
  },
  {
    name: 'Stakeholders',
    value: '142',
    change: '+8',
    changeType: 'increase',
    icon: Users,
  },
  {
    name: 'Change Velocity',
    value: '89%',
    change: '+6%',
    changeType: 'increase',
    icon: Zap,
  },
]

const activeJourneys = [
  {
    id: '1',
    title: 'Digital Transformation Initiative',
    progress: 65,
    phase: 'Implementation',
    stakeholders: 45,
    status: 'on-track',
    startDate: '2024-06-01',
    endDate: '2024-12-31',
  },
  {
    id: '2',
    title: 'Remote Work Policy Rollout',
    progress: 88,
    phase: 'Adoption',
    stakeholders: 28,
    status: 'ahead',
    startDate: '2024-05-15',
    endDate: '2024-08-15',
  },
  {
    id: '3',
    title: 'New CRM System Implementation',
    progress: 32,
    phase: 'Planning',
    stakeholders: 18,
    status: 'at-risk',
    startDate: '2024-07-01',
    endDate: '2024-11-30',
  },
]

const stakeholderInsights = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Department Head',
    engagement: 'high',
    influence: 'high',
    support: 'champion',
    initiatives: 3,
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Team Lead',
    engagement: 'medium',
    influence: 'medium',
    support: 'supporter',
    initiatives: 2,
  },
  {
    id: '3',
    name: 'Lisa Rodriguez',
    role: 'Individual Contributor',
    engagement: 'low',
    influence: 'low',
    support: 'resistant',
    initiatives: 1,
  },
]

const alerts = [
  {
    id: '1',
    title: 'Resistance Detected in Marketing Team',
    severity: 'high',
    journey: 'Digital Transformation Initiative',
    description: 'Survey indicates 40% resistance to new tools adoption',
    time: '2 hours ago',
  },
  {
    id: '2',
    title: 'Training Completion Rate Below Target',
    severity: 'medium',
    journey: 'Remote Work Policy Rollout',
    description: 'Only 65% of stakeholders completed required training',
    time: '4 hours ago',
  },
  {
    id: '3',
    title: 'Champion Availability Issue',
    severity: 'low',
    journey: 'New CRM System Implementation',
    description: 'Key champion unavailable for next milestone review',
    time: '6 hours ago',
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
            Manage change initiatives and track adoption across your organization
          </p>
        </div>
        <Link
          to="/journeys/new"
          className="glass-button text-violet-300 hover:text-violet-200 px-4 py-2 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Journey
        </Link>
      </div>

      {/* Company Message/Slogan */}
      <div className="glass-card p-6 text-center">
        <h2 className="text-xl font-semibold text-slate-100 mb-2">
          Transform Strategy Into Movement, Change Into Growth
        </h2>
        <p className="text-slate-400">
          Guide your organization through transformation with structured change journeys and engaged stakeholders
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
                <div className="p-3 rounded-xl bg-violet-500/20">
                  <Icon className="w-6 h-6 text-violet-400" />
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

      {/* Active Change Journeys */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">Active Change Journeys</h2>
          <Link
            to="/journeys"
            className="text-violet-400 hover:text-violet-300 flex items-center gap-1 text-sm"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {activeJourneys.map((journey) => (
            <div key={journey.id} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Link
                    to={`/journeys/${journey.id}`}
                    className="text-slate-100 hover:text-violet-300 font-medium"
                  >
                    {journey.title}
                  </Link>
                  <span className="text-sm text-slate-400">({journey.phase})</span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    journey.status === 'on-track'
                      ? 'bg-green-500/20 text-green-400'
                      : journey.status === 'at-risk'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-violet-500/20 text-violet-400'
                  }`}
                >
                  {journey.status === 'on-track' ? 'On Track' : journey.status === 'at-risk' ? 'At Risk' : 'Ahead'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-400">Progress</span>
                    <span className="text-sm text-slate-300">{journey.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className="bg-violet-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${journey.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-400">Stakeholders</p>
                    <p className="text-sm font-medium text-slate-100">{journey.stakeholders}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-400">Started</p>
                    <p className="text-sm font-medium text-slate-100">{new Date(journey.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-400">Target End</p>
                    <p className="text-sm font-medium text-slate-100">{new Date(journey.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stakeholder Insights */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">Key Stakeholder Insights</h2>
          <Link
            to="/stakeholders"
            className="text-violet-400 hover:text-violet-300 flex items-center gap-1 text-sm"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {stakeholderInsights.map((stakeholder) => (
            <div key={stakeholder.id} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-slate-100 font-medium">{stakeholder.name}</h3>
                    <p className="text-sm text-slate-400">{stakeholder.role}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-slate-400">Engagement</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        stakeholder.engagement === 'high'
                          ? 'bg-green-500/20 text-green-400'
                          : stakeholder.engagement === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {stakeholder.engagement}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400">Influence</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        stakeholder.influence === 'high'
                          ? 'bg-green-500/20 text-green-400'
                          : stakeholder.influence === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {stakeholder.influence}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400">Support</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        stakeholder.support === 'champion'
                          ? 'bg-green-500/20 text-green-400'
                          : stakeholder.support === 'supporter'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {stakeholder.support}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Initiatives</p>
                  <p className="text-lg font-semibold text-slate-100">{stakeholder.initiatives}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Change Alerts */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            Change Alerts
          </h2>
          <Link
            to="/alerts"
            className="text-violet-400 hover:text-violet-300 flex items-center gap-1 text-sm"
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
                    <span>Journey: <span className="text-violet-400">{alert.journey}</span></span>
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
        <Link to="/journeys/new" className="glass-card p-6 hover:bg-slate-800/40 transition-colors">
          <Route className="w-8 h-8 text-violet-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Create Journey</h3>
          <p className="text-slate-400 text-sm">Start a new change management journey</p>
        </Link>
        
        <Link to="/stakeholders" className="glass-card p-6 hover:bg-slate-800/40 transition-colors">
          <Users className="w-8 h-8 text-green-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Manage Stakeholders</h3>
          <p className="text-slate-400 text-sm">View and engage with key stakeholders</p>
        </Link>
        
        <Link to="/analytics" className="glass-card p-6 hover:bg-slate-800/40 transition-colors">
          <TrendingUp className="w-8 h-8 text-purple-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Analytics</h3>
          <p className="text-slate-400 text-sm">Analyze change adoption and engagement</p>
        </Link>
      </div>
    </div>
  )
}