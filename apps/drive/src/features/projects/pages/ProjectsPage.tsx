import { FolderOpen, Plus, Calendar, Users, TrendingUp, MoreHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'

const projects = [
  {
    id: '1',
    title: 'Customer Portal Redesign',
    description: 'Redesign the customer portal with modern UX/UI principles',
    progress: 68,
    dueDate: '2024-08-20',
    status: 'on-track',
    tasksCompleted: 12,
    totalTasks: 18,
    teamMembers: ['Sarah Chen', 'Mike Johnson', 'Lisa Wang'],
    priority: 'high',
  },
  {
    id: '2',
    title: 'Mobile App Launch',
    description: 'Launch the new mobile application for iOS and Android',
    progress: 35,
    dueDate: '2024-09-15',
    status: 'at-risk',
    tasksCompleted: 8,
    totalTasks: 23,
    teamMembers: ['David Kim', 'Emma Thompson', 'John Doe'],
    priority: 'high',
  },
  {
    id: '3',
    title: 'API Documentation Update',
    description: 'Update and improve API documentation for developers',
    progress: 95,
    dueDate: '2024-07-30',
    status: 'ahead',
    tasksCompleted: 19,
    totalTasks: 20,
    teamMembers: ['Alex Rodriguez', 'Jennifer Lee'],
    priority: 'medium',
  },
  {
    id: '4',
    title: 'Security Audit Implementation',
    description: 'Implement security improvements based on audit findings',
    progress: 20,
    dueDate: '2024-10-01',
    status: 'on-track',
    tasksCompleted: 4,
    totalTasks: 20,
    teamMembers: ['Robert Wilson', 'Maria Garcia', 'Kevin Park'],
    priority: 'high',
  },
]

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Projects</h1>
          <p className="text-slate-400 mt-1">
            Manage and track your strategic projects
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Projects</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">8</p>
            </div>
            <FolderOpen className="w-8 h-8 text-orange-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">On Track</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">6</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">At Risk</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">1</p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Ahead of Schedule</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">1</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="glass-card p-6">
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="glass-card p-6 bg-slate-800/40">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      to={`/projects/${project.id}`}
                      className="text-lg font-semibold text-slate-100 hover:text-orange-300"
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
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.priority === 'high'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {project.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{project.description}</p>
                </div>
                <button className="text-slate-400 hover:text-slate-300 p-2">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-400">Progress</span>
                    <span className="text-sm text-slate-300">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Tasks */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Tasks</p>
                    <p className="text-lg font-semibold text-slate-100">
                      {project.tasksCompleted}/{project.totalTasks}
                    </p>
                  </div>
                </div>

                {/* Due Date */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Due Date</p>
                    <p className="text-sm text-slate-300 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(project.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-400">Team:</span>
                    <div className="flex items-center gap-2">
                      {project.teamMembers.map((member, index) => (
                        <span key={index} className="text-sm text-slate-300">
                          {member}
                          {index < project.teamMembers.length - 1 && ','}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    to={`/projects/${project.id}`}
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