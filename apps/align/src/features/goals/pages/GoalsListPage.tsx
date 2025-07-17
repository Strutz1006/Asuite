import { Plus, Search, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'

const goals = [
  {
    id: '1',
    title: 'Increase customer satisfaction score',
    description: 'Improve overall customer satisfaction from 7.2 to 8.5',
    progress: 78,
    status: 'on-track',
    dueDate: '2024-08-15',
    owner: 'Sarah Johnson',
    keyResults: 3,
  },
  {
    id: '2',
    title: 'Launch new product feature',
    description: 'Successfully launch the AI-powered analytics dashboard',
    progress: 45,
    status: 'at-risk',
    dueDate: '2024-08-30',
    owner: 'Mike Chen',
    keyResults: 5,
  },
  {
    id: '3',
    title: 'Reduce operational costs',
    description: 'Decrease monthly operational expenses by 15%',
    progress: 92,
    status: 'ahead',
    dueDate: '2024-07-31',
    owner: 'Emily Rodriguez',
    keyResults: 2,
  },
]

export default function GoalsListPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Goals</h1>
          <p className="text-slate-400 mt-1">
            Manage and track all your strategic goals
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

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search goals..."
            className="glass-input w-full pl-10 pr-4 py-2 text-slate-100 placeholder-slate-400"
          />
        </div>
        <button className="glass-button px-4 py-2 text-slate-300 hover:text-slate-100 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <Link
                  to={`/goals/${goal.id}`}
                  className="text-xl font-semibold text-slate-100 hover:text-sky-300"
                >
                  {goal.title}
                </Link>
                <p className="text-slate-400 mt-1 text-sm">{goal.description}</p>
              </div>
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

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
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

            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-slate-400">
              <div>
                <span>Owner: </span>
                <span className="text-slate-300">{goal.owner}</span>
              </div>
              <div>
                <span>{goal.keyResults} key results</span>
              </div>
            </div>
            
            <div className="mt-2 text-sm text-slate-400">
              Due {new Date(goal.dueDate).toLocaleDateString()}
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center gap-2">
              <Link
                to={`/goals/${goal.id}`}
                className="glass-button text-sky-300 hover:text-sky-200 px-3 py-1 text-sm"
              >
                View Details
              </Link>
              <Link
                to={`/goals/${goal.id}/edit`}
                className="glass-button text-slate-300 hover:text-slate-100 px-3 py-1 text-sm"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}