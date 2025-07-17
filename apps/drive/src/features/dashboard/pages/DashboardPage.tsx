import { CheckSquare, Clock, Users, TrendingUp, Plus, ArrowRight, AlertTriangle, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

const stats = [
  {
    name: 'Active Projects',
    value: '8',
    change: '+2',
    changeType: 'increase',
    icon: CheckSquare,
  },
  {
    name: 'Tasks Completed',
    value: '124',
    change: '+18%',
    changeType: 'increase',
    icon: TrendingUp,
  },
  {
    name: 'Team Members',
    value: '16',
    change: '+3',
    changeType: 'increase',
    icon: Users,
  },
  {
    name: 'On Schedule',
    value: '87%',
    change: '+5%',
    changeType: 'increase',
    icon: Clock,
  },
]

const recentProjects = [
  {
    id: '1',
    title: 'Customer Portal Redesign',
    progress: 68,
    dueDate: '2024-08-20',
    status: 'on-track',
    tasksCompleted: 12,
    totalTasks: 18,
  },
  {
    id: '2',
    title: 'Mobile App Launch',
    progress: 35,
    dueDate: '2024-09-15',
    status: 'at-risk',
    tasksCompleted: 8,
    totalTasks: 23,
  },
  {
    id: '3',
    title: 'API Documentation Update',
    progress: 95,
    dueDate: '2024-07-30',
    status: 'ahead',
    tasksCompleted: 19,
    totalTasks: 20,
  },
]

const urgentTasks = [
  {
    id: '1',
    title: 'Review final designs',
    project: 'Customer Portal Redesign',
    assignee: 'Sarah Chen',
    dueDate: '2024-07-18',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Deploy staging environment',
    project: 'Mobile App Launch',
    assignee: 'Mike Johnson',
    dueDate: '2024-07-19',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Client feedback review',
    project: 'API Documentation Update',
    assignee: 'Lisa Wang',
    dueDate: '2024-07-20',
    priority: 'high',
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
            Manage your projects and tasks with strategic alignment
          </p>
        </div>
        <Link
          to="/projects/new"
          className="glass-button text-orange-300 hover:text-orange-200 px-4 py-2 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Company Message/Slogan */}
      <div className="glass-card p-6 text-center">
        <h2 className="text-xl font-semibold text-slate-100 mb-2">
          From Strategy to Execution, Every Task Matters
        </h2>
        <p className="text-slate-400">
          Transform strategic objectives into actionable projects and deliverable results
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
                <div className="p-3 rounded-xl bg-orange-500/20">
                  <Icon className="w-6 h-6 text-orange-400" />
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

      {/* Recent Projects */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">Recent Projects</h2>
          <Link
            to="/projects"
            className="text-orange-400 hover:text-orange-300 flex items-center gap-1 text-sm"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {recentProjects.map((project) => (
            <div key={project.id} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-center justify-between mb-3">
                <Link
                  to={`/projects/${project.id}`}
                  className="text-slate-100 hover:text-orange-300 font-medium"
                >
                  {project.title}
                </Link>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'on-track'
                      ? 'bg-green-500/20 text-green-400'
                      : project.status === 'at-risk'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-orange-500/20 text-orange-400'
                  }`}
                >
                  {project.status === 'on-track' ? 'On Track' : project.status === 'at-risk' ? 'At Risk' : 'Ahead'}
                </span>
              </div>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-400">Progress</span>
                    <span className="text-sm text-slate-300">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-slate-400">
                  {project.tasksCompleted}/{project.totalTasks} tasks
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Due {new Date(project.dueDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Urgent Tasks */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Urgent Tasks
          </h2>
          <Link
            to="/tasks"
            className="text-orange-400 hover:text-orange-300 flex items-center gap-1 text-sm"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {urgentTasks.map((task) => (
            <div key={task.id} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-center justify-between mb-2">
                <Link
                  to={`/tasks/${task.id}`}
                  className="text-slate-100 hover:text-orange-300 font-medium"
                >
                  {task.title}
                </Link>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'high'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {task.priority === 'high' ? 'High' : 'Medium'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <div>{task.project}</div>
                <div className="flex items-center gap-4">
                  <span>Assigned to {task.assignee}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/projects/new" className="glass-card p-6 hover:bg-slate-800/40 transition-colors">
          <CheckSquare className="w-8 h-8 text-orange-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Create Project</h3>
          <p className="text-slate-400 text-sm">Start a new project and organize your tasks</p>
        </Link>
        
        <Link to="/tasks/new" className="glass-card p-6 hover:bg-slate-800/40 transition-colors">
          <Plus className="w-8 h-8 text-green-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Add Task</h3>
          <p className="text-slate-400 text-sm">Create a new task and assign it to team members</p>
        </Link>
        
        <Link to="/analytics" className="glass-card p-6 hover:bg-slate-800/40 transition-colors">
          <TrendingUp className="w-8 h-8 text-purple-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Analytics</h3>
          <p className="text-slate-400 text-sm">Track project performance and team productivity</p>
        </Link>
      </div>
    </div>
  )
}