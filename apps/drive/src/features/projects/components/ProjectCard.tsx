import { Link } from 'react-router-dom'
import { 
  Calendar, 
  Users, 
  Target, 
  DollarSign, 
  TrendingUp, 
  Clock,
  AlertTriangle,
  CheckCircle2,
  MoreVertical,
  Building2,
  Briefcase
} from 'lucide-react'

export interface Project {
  id: string
  name: string
  description?: string
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled'
  health: 'excellent' | 'good' | 'at-risk' | 'critical'
  priority: 'low' | 'medium' | 'high' | 'critical'
  owner: {
    id: string
    name: string
    avatar?: string
  }
  alignGoal?: {
    id: string
    title: string
  }
  department?: {
    id: string
    name: string
  }
  team?: {
    id: string
    name: string
  }
  startDate?: string
  dueDate?: string
  completionDate?: string
  budgetAllocated?: number
  budgetSpent?: number
  progressPercentage: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  tags: string[]
  taskCount?: number
  completedTaskCount?: number
  teamMemberCount?: number
}

interface ProjectCardProps {
  project: Project
  onEdit?: (project: Project) => void
  onDelete?: (project: Project) => void
  onStatusChange?: (project: Project, status: Project['status']) => void
  variant?: 'default' | 'compact'
}

const getStatusColor = (status: Project['status']) => {
  switch (status) {
    case 'planning': return 'bg-blue-500/20 text-blue-400'
    case 'active': return 'bg-green-500/20 text-green-400'
    case 'on-hold': return 'bg-yellow-500/20 text-yellow-400'
    case 'completed': return 'bg-emerald-500/20 text-emerald-400'
    case 'cancelled': return 'bg-red-500/20 text-red-400'
    default: return 'bg-slate-500/20 text-slate-400'
  }
}

const getHealthIcon = (health: Project['health']) => {
  switch (health) {
    case 'excellent': return <CheckCircle2 className="w-5 h-5 text-green-400" />
    case 'good': return <TrendingUp className="w-5 h-5 text-blue-400" />
    case 'at-risk': return <AlertTriangle className="w-5 h-5 text-yellow-400" />
    case 'critical': return <AlertTriangle className="w-5 h-5 text-red-400" />
  }
}

const getPriorityColor = (priority: Project['priority']) => {
  switch (priority) {
    case 'critical': return 'text-red-400'
    case 'high': return 'text-orange-400'
    case 'medium': return 'text-yellow-400'
    case 'low': return 'text-green-400'
  }
}

const getRiskColor = (risk: Project['riskLevel']) => {
  switch (risk) {
    case 'critical': return 'bg-red-500/20 text-red-400'
    case 'high': return 'bg-orange-500/20 text-orange-400'
    case 'medium': return 'bg-yellow-500/20 text-yellow-400'
    case 'low': return 'bg-green-500/20 text-green-400'
  }
}

export default function ProjectCard({ project, onEdit, onDelete, onStatusChange, variant = 'default' }: ProjectCardProps) {
  const isOverdue = project.dueDate && new Date(project.dueDate) < new Date() && project.status !== 'completed'
  
  if (variant === 'compact') {
    return (
      <div className="glass-card p-4 hover:bg-slate-800/40 transition-colors group">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Link 
                to={`/projects/${project.id}`}
                className="font-medium text-slate-100 hover:text-orange-300 transition-colors truncate"
              >
                {project.name}
              </Link>
              <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{project.owner.name}</span>
              </div>
              {project.dueDate && (
                <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : ''}`}>
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(project.dueDate).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <div className="w-16 bg-slate-700/50 rounded-full h-1.5">
                  <div 
                    className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${project.progressPercentage}%` }}
                  />
                </div>
                <span>{project.progressPercentage}%</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {getHealthIcon(project.health)}
            <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-300 p-1 transition-opacity">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-6 hover:bg-slate-800/40 transition-colors group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Link 
              to={`/projects/${project.id}`}
              className="text-lg font-semibold text-slate-100 hover:text-orange-300 transition-colors"
            >
              {project.name}
            </Link>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
              {project.status.replace('-', ' ')}
            </span>
            <span className={`text-sm font-medium ${getPriorityColor(project.priority)}`}>
              {project.priority} priority
            </span>
          </div>
          
          {project.description && (
            <p className="text-sm text-slate-400 line-clamp-2 mb-3">
              {project.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {getHealthIcon(project.health)}
          <div className="relative">
            <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-300 p-1 transition-opacity">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <div className="text-xs text-slate-400 mb-1">Progress</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-700/50 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${project.progressPercentage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-slate-200">{project.progressPercentage}%</span>
          </div>
        </div>

        {project.budgetAllocated && (
          <div>
            <div className="text-xs text-slate-400 mb-1">Budget Used</div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-slate-400" />
              <span className="text-sm font-medium text-slate-200">
                {Math.round((project.budgetSpent || 0) / project.budgetAllocated * 100)}%
              </span>
            </div>
          </div>
        )}

        {project.taskCount !== undefined && (
          <div>
            <div className="text-xs text-slate-400 mb-1">Tasks</div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-slate-400" />
              <span className="text-sm font-medium text-slate-200">
                {project.completedTaskCount || 0}/{project.taskCount}
              </span>
            </div>
          </div>
        )}

        <div>
          <div className="text-xs text-slate-400 mb-1">Risk</div>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRiskColor(project.riskLevel)}`}>
            {project.riskLevel}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400">Owner:</span>
            <span className="text-slate-200">{project.owner.name}</span>
          </div>

          {project.team && (
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400">Team:</span>
              <span className="text-slate-200">{project.team.name}</span>
            </div>
          )}

          {project.department && (
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400">Department:</span>
              <span className="text-slate-200">{project.department.name}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {project.startDate && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400">Started:</span>
              <span className="text-slate-200">
                {new Date(project.startDate).toLocaleDateString()}
              </span>
            </div>
          )}

          {project.dueDate && (
            <div className={`flex items-center gap-2 text-sm ${isOverdue ? 'text-red-400' : ''}`}>
              <Calendar className="w-4 h-4" />
              <span className={isOverdue ? '' : 'text-slate-400'}>Due:</span>
              <span className={isOverdue ? 'font-medium' : 'text-slate-200'}>
                {new Date(project.dueDate).toLocaleDateString()}
              </span>
            </div>
          )}

          {project.teamMemberCount !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400">Team Size:</span>
              <span className="text-slate-200">{project.teamMemberCount} members</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
        {project.alignGoal && (
          <div className="flex items-center gap-2 text-sm">
            <Target className="w-4 h-4 text-orange-400" />
            <span className="text-slate-400">Aligned to:</span>
            <Link 
              to={`/align/goals/${project.alignGoal.id}`}
              className="text-orange-400 hover:text-orange-300"
            >
              {project.alignGoal.title}
            </Link>
          </div>
        )}

        {project.tags.length > 0 && (
          <div className="flex items-center gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag}
                className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-400"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-xs text-slate-500">+{project.tags.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          {onStatusChange && (
            <select
              value={project.status}
              onChange={(e) => onStatusChange(project, e.target.value as Project['status'])}
              className="glass-input py-1 px-2 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          )}
          
          {onEdit && (
            <button
              onClick={() => onEdit(project)}
              className="glass-button p-2 text-slate-400 hover:text-slate-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}