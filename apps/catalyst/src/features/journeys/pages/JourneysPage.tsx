import { Route, Plus, Users, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

const journeys = [
  {
    id: '1',
    title: 'Digital Transformation Initiative',
    description: 'Company-wide adoption of new digital tools and processes',
    progress: 65,
    phase: 'Implementation',
    stakeholders: 45,
    status: 'on-track',
    startDate: '2024-06-01',
    endDate: '2024-12-31',
    milestones: 8,
    completedMilestones: 5,
    budget: 250000,
    spent: 162500,
  },
  {
    id: '2',
    title: 'Remote Work Policy Rollout',
    description: 'Implementation of new remote work policies and guidelines',
    progress: 88,
    phase: 'Adoption',
    stakeholders: 28,
    status: 'ahead',
    startDate: '2024-05-15',
    endDate: '2024-08-15',
    milestones: 6,
    completedMilestones: 5,
    budget: 50000,
    spent: 38000,
  },
  {
    id: '3',
    title: 'New CRM System Implementation',
    description: 'Deployment and adoption of new customer relationship management system',
    progress: 32,
    phase: 'Planning',
    stakeholders: 18,
    status: 'at-risk',
    startDate: '2024-07-01',
    endDate: '2024-11-30',
    milestones: 10,
    completedMilestones: 3,
    budget: 180000,
    spent: 54000,
  },
]

export default function JourneysPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Change Journeys</h1>
          <p className="text-slate-400 mt-1">
            Manage and track your organizational change initiatives
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Journeys</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">6</p>
            </div>
            <Route className="w-8 h-8 text-violet-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">On Track</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">4</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">At Risk</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">1</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Ahead</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">1</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Journeys List */}
      <div className="glass-card p-6">
        <div className="space-y-6">
          {journeys.map((journey) => (
            <div key={journey.id} className="glass-card p-6 bg-slate-800/40">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      to={`/journeys/${journey.id}`}
                      className="text-lg font-semibold text-slate-100 hover:text-violet-300"
                    >
                      {journey.title}
                    </Link>
                    <span className="text-sm text-slate-400">({journey.phase})</span>
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
                  <p className="text-slate-400 text-sm mb-4">{journey.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
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
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-400">Stakeholders</p>
                    <p className="text-lg font-semibold text-slate-100">{journey.stakeholders}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-400">Milestones</p>
                    <p className="text-lg font-semibold text-slate-100">{journey.completedMilestones}/{journey.milestones}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-400">Duration</p>
                    <p className="text-sm text-slate-300">
                      {new Date(journey.startDate).toLocaleDateString()} - {new Date(journey.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">Budget</p>
                  <p className="text-lg font-semibold text-slate-100">
                    ${journey.spent.toLocaleString()} / ${journey.budget.toLocaleString()}
                  </p>
                  <div className="w-full bg-slate-700/50 rounded-full h-1 mt-1">
                    <div
                      className="bg-green-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${(journey.spent / journey.budget) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <Link
                    to={`/journeys/${journey.id}`}
                    className="text-violet-400 hover:text-violet-300 text-sm"
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