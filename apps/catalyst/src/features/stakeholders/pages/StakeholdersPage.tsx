import { Users, Plus, Filter, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const stakeholders = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Department Head',
    department: 'Marketing',
    email: 'sarah.johnson@company.com',
    engagement: 'high',
    influence: 'high',
    support: 'champion',
    initiatives: 3,
    lastActivity: '2024-07-17',
    changeReadiness: 92,
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Team Lead',
    department: 'Engineering',
    email: 'michael.chen@company.com',
    engagement: 'high',
    influence: 'medium',
    support: 'supporter',
    initiatives: 2,
    lastActivity: '2024-07-16',
    changeReadiness: 88,
  },
  {
    id: '3',
    name: 'Lisa Rodriguez',
    role: 'Individual Contributor',
    department: 'Sales',
    email: 'lisa.rodriguez@company.com',
    engagement: 'medium',
    influence: 'low',
    support: 'neutral',
    initiatives: 1,
    lastActivity: '2024-07-15',
    changeReadiness: 65,
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Manager',
    department: 'Operations',
    email: 'david.kim@company.com',
    engagement: 'low',
    influence: 'medium',
    support: 'resistant',
    initiatives: 2,
    lastActivity: '2024-07-14',
    changeReadiness: 45,
  },
  {
    id: '5',
    name: 'Amanda Foster',
    role: 'Director',
    department: 'HR',
    email: 'amanda.foster@company.com',
    engagement: 'high',
    influence: 'high',
    support: 'champion',
    initiatives: 4,
    lastActivity: '2024-07-17',
    changeReadiness: 95,
  },
]

const getSupportColor = (support: string) => {
  switch (support) {
    case 'champion':
      return 'bg-green-500/20 text-green-400'
    case 'supporter':
      return 'bg-blue-500/20 text-blue-400'
    case 'neutral':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'resistant':
      return 'bg-red-500/20 text-red-400'
    default:
      return 'bg-slate-500/20 text-slate-400'
  }
}

const getEngagementColor = (engagement: string) => {
  switch (engagement) {
    case 'high':
      return 'bg-green-500/20 text-green-400'
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'low':
      return 'bg-red-500/20 text-red-400'
    default:
      return 'bg-slate-500/20 text-slate-400'
  }
}

export default function StakeholdersPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Stakeholders</h1>
          <p className="text-slate-400 mt-1">
            Manage and engage with key stakeholders across change initiatives
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="glass-button text-slate-300 hover:text-slate-100 px-4 py-2 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <Link
            to="/stakeholders/new"
            className="glass-button text-violet-300 hover:text-violet-200 px-4 py-2 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Stakeholder
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Stakeholders</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">142</p>
            </div>
            <Users className="w-8 h-8 text-violet-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Champions</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">28</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">High Engagement</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">89</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Resistance Risk</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">18</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Stakeholders List */}
      <div className="glass-card p-6">
        <div className="space-y-4">
          {stakeholders.map((stakeholder) => (
            <div key={stakeholder.id} className="glass-card p-6 bg-slate-800/40">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      to={`/stakeholders/${stakeholder.id}`}
                      className="text-lg font-semibold text-slate-100 hover:text-violet-300"
                    >
                      {stakeholder.name}
                    </Link>
                    <span className="text-sm text-slate-400">
                      {stakeholder.role} • {stakeholder.department}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{stakeholder.email}</p>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-1">Engagement</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEngagementColor(stakeholder.engagement)}`}>
                        {stakeholder.engagement}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-1">Influence</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEngagementColor(stakeholder.influence)}`}>
                        {stakeholder.influence}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-1">Support</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSupportColor(stakeholder.support)}`}>
                        {stakeholder.support}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400 mb-1">Change Readiness</p>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-700/50 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          stakeholder.changeReadiness >= 80 ? 'bg-green-500' : 
                          stakeholder.changeReadiness >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${stakeholder.changeReadiness}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-100">{stakeholder.changeReadiness}%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-700/50">
                <div>
                  <p className="text-sm text-slate-400">Active Initiatives</p>
                  <p className="text-lg font-semibold text-slate-100">{stakeholder.initiatives}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Last Activity</p>
                  <p className="text-sm text-slate-300">{new Date(stakeholder.lastActivity).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <Link
                    to={`/stakeholders/${stakeholder.id}`}
                    className="text-violet-400 hover:text-violet-300 text-sm"
                  >
                    View Profile →
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