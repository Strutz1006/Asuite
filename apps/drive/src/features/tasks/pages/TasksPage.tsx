import { ListTodo, Plus, Calendar, User, Flag, CheckSquare, Clock, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'

const tasks = [
  {
    id: '1',
    title: 'Review final designs',
    description: 'Review and approve the final UI/UX designs for the customer portal',
    project: 'Customer Portal Redesign',
    assignee: 'Sarah Chen',
    dueDate: '2024-07-18',
    priority: 'high',
    status: 'in-progress',
    estimatedHours: 4,
    completedHours: 2,
  },
  {
    id: '2',
    title: 'Deploy staging environment',
    description: 'Set up and deploy the staging environment for testing',
    project: 'Mobile App Launch',
    assignee: 'Mike Johnson',
    dueDate: '2024-07-19',
    priority: 'medium',
    status: 'todo',
    estimatedHours: 6,
    completedHours: 0,
  },
  {
    id: '3',
    title: 'Client feedback review',
    description: 'Review and incorporate client feedback into documentation',
    project: 'API Documentation Update',
    assignee: 'Lisa Wang',
    dueDate: '2024-07-20',
    priority: 'high',
    status: 'review',
    estimatedHours: 3,
    completedHours: 3,
  },
  {
    id: '4',
    title: 'Security vulnerability assessment',
    description: 'Conduct security vulnerability assessment for authentication system',
    project: 'Security Audit Implementation',
    assignee: 'Robert Wilson',
    dueDate: '2024-07-22',
    priority: 'high',
    status: 'todo',
    estimatedHours: 8,
    completedHours: 0,
  },
  {
    id: '5',
    title: 'Performance optimization',
    description: 'Optimize application performance and reduce loading times',
    project: 'Customer Portal Redesign',
    assignee: 'David Kim',
    dueDate: '2024-07-25',
    priority: 'medium',
    status: 'in-progress',
    estimatedHours: 12,
    completedHours: 4,
  },
  {
    id: '6',
    title: 'Database migration script',
    description: 'Create and test database migration scripts for production',
    project: 'Mobile App Launch',
    assignee: 'Emma Thompson',
    dueDate: '2024-07-28',
    priority: 'high',
    status: 'completed',
    estimatedHours: 5,
    completedHours: 5,
  },
]

const statusColors = {
  todo: 'bg-slate-500/20 text-slate-300',
  'in-progress': 'bg-blue-500/20 text-blue-400',
  review: 'bg-yellow-500/20 text-yellow-400',
  completed: 'bg-green-500/20 text-green-400',
}

const priorityColors = {
  low: 'bg-green-500/20 text-green-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  high: 'bg-red-500/20 text-red-400',
}

export default function TasksPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Tasks</h1>
          <p className="text-slate-400 mt-1">
            Manage and track individual tasks across projects
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="glass-button text-slate-300 hover:text-slate-100 px-4 py-2 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <Link
            to="/tasks/new"
            className="glass-button text-orange-300 hover:text-orange-200 px-4 py-2 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Task
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Tasks</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">24</p>
            </div>
            <ListTodo className="w-8 h-8 text-orange-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">In Progress</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">8</p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Completed</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">12</p>
            </div>
            <CheckSquare className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Overdue</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">2</p>
            </div>
            <Flag className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="glass-card p-6">
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="glass-card p-6 bg-slate-800/40">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      to={`/tasks/${task.id}`}
                      className="text-lg font-semibold text-slate-100 hover:text-orange-300"
                    >
                      {task.title}
                    </Link>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{task.description}</p>
                  <div className="text-sm text-slate-500">
                    Project: <span className="text-orange-400">{task.project}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Assignee */}
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-400">Assignee</p>
                    <p className="text-sm text-slate-300">{task.assignee}</p>
                  </div>
                </div>

                {/* Due Date */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-400">Due Date</p>
                    <p className="text-sm text-slate-300">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Time Tracking */}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-400">Hours</p>
                    <p className="text-sm text-slate-300">
                      {task.completedHours}/{task.estimatedHours}h
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Progress</p>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(task.completedHours / task.estimatedHours) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {task.status !== 'completed' && (
                      <button className="text-green-400 hover:text-green-300 text-sm">
                        Mark Complete
                      </button>
                    )}
                    <button className="text-slate-400 hover:text-slate-300 text-sm">
                      Edit
                    </button>
                  </div>
                  <Link
                    to={`/tasks/${task.id}`}
                    className="text-orange-400 hover:text-orange-300 text-sm"
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