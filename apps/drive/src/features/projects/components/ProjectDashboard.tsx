import { useState } from 'react'
import { Plus, Calendar, Users, Target, AlertCircle, TrendingUp, TrendingDown, Clock, CheckCircle2, MoreVertical, Filter, Search, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Project {
  id: string
  name: string
  description: string
  status: 'planning' | 'active' | 'on-hold' | 'completed'
  progress: number
  dueDate: string
  teamSize: number
  tasksCompleted: number
  totalTasks: number
  budget?: number
  spent?: number
  health: 'excellent' | 'good' | 'at-risk' | 'critical'
  alignGoal?: string
}

const projects: Project[] = [
  {
    id: '1',
    name: 'Customer Portal Redesign',
    description: 'Modernize customer-facing portal with improved UX',
    status: 'active',
    progress: 78,
    dueDate: '2024-09-15',
    teamSize: 8,
    tasksCompleted: 23,
    totalTasks: 31,
    budget: 85000,
    spent: 62000,
    health: 'good',
    alignGoal: 'Improve Customer Satisfaction',
  },
  {
    id: '2',
    name: 'API Integration Platform',
    description: 'Build unified API gateway for third-party integrations',
    status: 'active',
    progress: 45,
    dueDate: '2024-10-30',
    teamSize: 6,
    tasksCompleted: 18,
    totalTasks: 40,
    budget: 120000,
    spent: 48000,
    health: 'at-risk',
    alignGoal: 'Increase Revenue by 25%',
  },
  {
    id: '3',
    name: 'Mobile App Launch',
    description: 'Native mobile app for iOS and Android platforms',
    status: 'planning',
    progress: 12,
    dueDate: '2024-12-01',
    teamSize: 10,
    tasksCompleted: 3,
    totalTasks: 45,
    budget: 150000,
    spent: 15000,
    health: 'excellent',
    alignGoal: 'Expand Market Presence',
  },
  {
    id: '4',
    name: 'Security Audit & Compliance',
    description: 'Comprehensive security review and SOC2 compliance',
    status: 'completed',
    progress: 100,
    dueDate: '2024-07-31',
    teamSize: 4,
    tasksCompleted: 22,
    totalTasks: 22,
    budget: 45000,
    spent: 43500,
    health: 'excellent',
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500/20 text-green-400'
    case 'planning': return 'bg-blue-500/20 text-blue-400'
    case 'on-hold': return 'bg-yellow-500/20 text-yellow-400'
    case 'completed': return 'bg-purple-500/20 text-purple-400'
    default: return 'bg-slate-500/20 text-slate-400'
  }
}

const getHealthColor = (health: string) => {
  switch (health) {
    case 'excellent': return 'text-green-400'
    case 'good': return 'text-blue-400'
    case 'at-risk': return 'text-yellow-400'
    case 'critical': return 'text-red-400'
    default: return 'text-slate-400'
  }
}

const getHealthIcon = (health: string) => {
  switch (health) {
    case 'excellent': return TrendingUp
    case 'good': return TrendingUp
    case 'at-risk': return AlertCircle
    case 'critical': return TrendingDown
    default: return AlertCircle
  }
}

export default function ProjectDashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredProjects = projects.filter(project => 
    statusFilter === 'all' || project.status === statusFilter
  )

  const totalProjects = projects.length
  const activeProjects = projects.filter(p => p.status === 'active').length
  const completedProjects = projects.filter(p => p.status === 'completed').length
  const atRiskProjects = projects.filter(p => p.health === 'at-risk' || p.health === 'critical').length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Projects</h1>
          <p className="text-slate-400 mt-1">
            Manage and track all your strategic initiatives
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Projects</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">{totalProjects}</p>
            </div>
            <Target className="w-8 h-8 text-orange-400 opacity-50" />
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Active</p>
              <p className="text-2xl font-semibold text-green-400 mt-1">{activeProjects}</p>
            </div>
            <Clock className="w-8 h-8 text-green-400 opacity-50" />
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Completed</p>
              <p className="text-2xl font-semibold text-purple-400 mt-1">{completedProjects}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-purple-400 opacity-50" />
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">At Risk</p>
              <p className="text-2xl font-semibold text-yellow-400 mt-1">{atRiskProjects}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-400 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search projects by name or description..."
              className="glass-input w-full pl-12 pr-4 py-3 text-slate-100 placeholder-slate-500"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'All', count: totalProjects },
            { value: 'planning', label: 'Planning', count: projects.filter(p => p.status === 'planning').length },
            { value: 'active', label: 'Active', count: activeProjects },
            { value: 'completed', label: 'Completed', count: completedProjects },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`
                glass-card px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap
                ${statusFilter === filter.value
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/40'
                }
              `}
            >
              {filter.label}
              <span className="ml-2 text-xs opacity-70">({filter.count})</span>
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex gap-1 glass-card p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
              ${viewMode === 'grid'
                ? 'bg-orange-500/20 text-orange-300'
                : 'text-slate-400 hover:text-slate-300'
              }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
              ${viewMode === 'list'
                ? 'bg-orange-500/20 text-orange-300'
                : 'text-slate-400 hover:text-slate-300'
              }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Project Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const HealthIcon = getHealthIcon(project.health)
            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="glass-card p-6 hover:bg-slate-800/40 transition-colors group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-100 group-hover:text-orange-300 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <button className="text-slate-400 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                {/* Status and Health */}
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                  <div className="flex items-center gap-1">
                    <HealthIcon className={`w-4 h-4 ${getHealthColor(project.health)}`} />
                    <span className={`text-xs font-medium ${getHealthColor(project.health)}`}>
                      {project.health.charAt(0).toUpperCase() + project.health.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Progress</span>
                    <span className="text-sm font-medium text-slate-300">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Team
                    </span>
                    <span className="text-slate-300">{project.teamSize} members</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Tasks
                    </span>
                    <span className="text-slate-300">
                      {project.tasksCompleted}/{project.totalTasks}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Due Date
                    </span>
                    <span className="text-slate-300">
                      {new Date(project.dueDate).toLocaleDateString()}
                    </span>
                  </div>

                  {project.alignGoal && (
                    <div className="pt-2 border-t border-slate-700/50">
                      <div className="flex items-center gap-2">
                        <Target className="w-3 h-3 text-orange-400" />
                        <span className="text-xs text-orange-400">
                          Aligned: {project.alignGoal}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => {
            const HealthIcon = getHealthIcon(project.health)
            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="glass-card p-6 hover:bg-slate-800/40 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    {/* Name & Description */}
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-slate-100 group-hover:text-orange-300 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-slate-400 line-clamp-1">
                        {project.description}
                      </p>
                      {project.alignGoal && (
                        <div className="flex items-center gap-1 mt-1">
                          <Target className="w-3 h-3 text-orange-400" />
                          <span className="text-xs text-orange-400">{project.alignGoal}</span>
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-slate-300">{project.progress}%</span>
                        <HealthIcon className={`w-4 h-4 ${getHealthColor(project.health)}`} />
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                        <div
                          className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Team & Tasks */}
                    <div className="text-sm text-slate-400">
                      <div className="flex items-center gap-1 mb-1">
                        <Users className="w-3 h-3" />
                        <span>{project.teamSize} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{project.tasksCompleted}/{project.totalTasks} tasks</span>
                      </div>
                    </div>

                    {/* Due Date */}
                    <div className="text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(project.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="glass-card p-6 bg-orange-500/10 border-orange-500/30">
        <h2 className="text-lg font-semibold text-orange-300 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/projects/new"
            className="glass-card p-4 hover:bg-slate-800/40 transition-colors text-center"
          >
            <Plus className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <h3 className="font-medium text-slate-200 mb-1">Start New Project</h3>
            <p className="text-xs text-slate-400">Create from template or start fresh</p>
          </Link>
          
          <Link
            to="/projects/templates"
            className="glass-card p-4 hover:bg-slate-800/40 transition-colors text-center"
          >
            <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <h3 className="font-medium text-slate-200 mb-1">Import from Align</h3>
            <p className="text-xs text-slate-400">Convert strategic goals to projects</p>
          </Link>
          
          <Link
            to="/analytics"
            className="glass-card p-4 hover:bg-slate-800/40 transition-colors text-center"
          >
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <h3 className="font-medium text-slate-200 mb-1">View Analytics</h3>
            <p className="text-xs text-slate-400">Project performance insights</p>
          </Link>
        </div>
      </div>
    </div>
  )
}