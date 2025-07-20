import { Link } from 'react-router-dom'
import { 
  Calendar, 
  Clock, 
  Users, 
  Target, 
  Tag,
  AlertCircle,
  CheckCircle2,
  Circle,
  MessageSquare,
  Paperclip,
  Timer,
  MoreVertical,
  GitBranch,
  Activity
} from 'lucide-react'

export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee?: {
    id: string
    name: string
    avatar?: string
  }
  project?: {
    id: string
    name: string
  }
  alignGoal?: {
    id: string
    title: string
  }
  dueDate?: string
  completionDate?: string
  estimatedHours?: number
  actualHours?: number
  progressPercentage: number
  tags: string[]
  dependencies?: string[]
  commentCount?: number
  attachmentCount?: number
  isOverdue?: boolean
  isBlocked?: boolean
  lastActivity?: string
}

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
  onStatusChange?: (task: Task, status: Task['status']) => void
  onAssigneeChange?: (task: Task, assigneeId: string) => void
  variant?: 'default' | 'compact' | 'kanban'
  showProject?: boolean
}

const getStatusIcon = (status: Task['status']) => {
  switch (status) {
    case 'todo': return <Circle className="w-4 h-4" />
    case 'in-progress': return <Activity className="w-4 h-4 text-blue-400" />
    case 'review': return <Clock className="w-4 h-4 text-yellow-400" />
    case 'done': return <CheckCircle2 className="w-4 h-4 text-green-400" />
    case 'cancelled': return <AlertCircle className="w-4 h-4 text-red-400" />
  }
}

const getStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'todo': return 'text-slate-400'
    case 'in-progress': return 'text-blue-400'
    case 'review': return 'text-yellow-400'
    case 'done': return 'text-green-400'
    case 'cancelled': return 'text-red-400'
  }
}

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30'
    case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30'
  }
}

const getPriorityDot = (priority: Task['priority']) => {
  switch (priority) {
    case 'critical': return 'bg-red-500'
    case 'high': return 'bg-orange-500'
    case 'medium': return 'bg-yellow-500'
    case 'low': return 'bg-green-500'
  }
}

export default function TaskCard({ 
  task, 
  onEdit, 
  onDelete, 
  onStatusChange, 
  onAssigneeChange,
  variant = 'default',
  showProject = true 
}: TaskCardProps) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'
  
  // Kanban variant for board view
  if (variant === 'kanban') {
    return (
      <div className="glass-card p-4 hover:bg-slate-800/40 transition-colors cursor-move group">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getPriorityDot(task.priority)}`} />
          <div className="flex-1 min-w-0">
            <Link 
              to={`/tasks/${task.id}`}
              className="font-medium text-slate-100 hover:text-orange-300 transition-colors block mb-1"
            >
              {task.title}
            </Link>
            {task.description && (
              <p className="text-sm text-slate-400 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Quick Info */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
          {task.assignee && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{task.assignee.name}</span>
            </div>
          )}
          {task.dueDate && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : ''}`}>
              <Calendar className="w-3 h-3" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {task.progressPercentage > 0 && (
          <div className="mb-3">
            <div className="w-full bg-slate-700/50 rounded-full h-1">
              <div 
                className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${task.progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {task.commentCount !== undefined && task.commentCount > 0 && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <MessageSquare className="w-3 h-3" />
                <span>{task.commentCount}</span>
              </div>
            )}
            {task.attachmentCount !== undefined && task.attachmentCount > 0 && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Paperclip className="w-3 h-3" />
                <span>{task.attachmentCount}</span>
              </div>
            )}
          </div>
          
          {task.estimatedHours && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Timer className="w-3 h-3" />
              <span>{task.estimatedHours}h</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Compact variant for list views
  if (variant === 'compact') {
    return (
      <div className="glass-card p-3 hover:bg-slate-800/40 transition-colors group">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {getStatusIcon(task.status)}
          </div>
          
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <Link 
              to={`/tasks/${task.id}`}
              className="font-medium text-slate-100 hover:text-orange-300 transition-colors truncate"
            >
              {task.title}
            </Link>
            
            <span className={`px-2 py-0.5 rounded text-xs border ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            
            {task.alignGoal && (
              <Target className="w-3 h-3 text-orange-400 flex-shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-400">
            {task.assignee && (
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{task.assignee.name}</span>
              </div>
            )}
            
            {task.dueDate && (
              <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : ''}`}>
                <Calendar className="w-3 h-3" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <span className="text-slate-300">{task.progressPercentage}%</span>
            </div>
          </div>

          <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-300 p-1 transition-opacity">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // Default full card variant
  return (
    <div className="glass-card p-6 hover:bg-slate-800/40 transition-colors group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-shrink-0 mt-1">
            {getStatusIcon(task.status)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Link 
                to={`/tasks/${task.id}`}
                className="text-lg font-semibold text-slate-100 hover:text-orange-300 transition-colors"
              >
                {task.title}
              </Link>
              
              <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                {task.priority} priority
              </span>
              
              {task.isBlocked && (
                <span className="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                  Blocked
                </span>
              )}
            </div>
            
            {task.description && (
              <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${getStatusColor(task.status)}`}>
            {task.status.replace('-', ' ')}
          </span>
          <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-300 p-1 transition-opacity">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress and Time */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <div className="text-xs text-slate-400 mb-1">Progress</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-700/50 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${task.progressPercentage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-slate-200">{task.progressPercentage}%</span>
          </div>
        </div>

        {task.estimatedHours && (
          <div>
            <div className="text-xs text-slate-400 mb-1">Time Estimate</div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="text-sm font-medium text-slate-200">{task.estimatedHours}h</span>
            </div>
          </div>
        )}

        {task.actualHours !== undefined && (
          <div>
            <div className="text-xs text-slate-400 mb-1">Time Spent</div>
            <div className="flex items-center gap-1">
              <Timer className="w-3 h-3 text-slate-400" />
              <span className="text-sm font-medium text-slate-200">{task.actualHours}h</span>
            </div>
          </div>
        )}

        {task.dependencies && task.dependencies.length > 0 && (
          <div>
            <div className="text-xs text-slate-400 mb-1">Dependencies</div>
            <div className="flex items-center gap-1">
              <GitBranch className="w-3 h-3 text-slate-400" />
              <span className="text-sm font-medium text-slate-200">{task.dependencies.length}</span>
            </div>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-sm">
          {task.assignee && (
            <div className="flex items-center gap-2">
              {task.assignee.avatar ? (
                <img 
                  src={task.assignee.avatar} 
                  alt={task.assignee.name}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Users className="w-3 h-3 text-orange-400" />
                </div>
              )}
              <span className="text-slate-300">{task.assignee.name}</span>
            </div>
          )}

          {task.dueDate && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-400 font-medium' : 'text-slate-400'}`}>
              <Calendar className="w-4 h-4" />
              <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-400">
          {task.commentCount !== undefined && (
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{task.commentCount}</span>
            </div>
          )}
          {task.attachmentCount !== undefined && (
            <div className="flex items-center gap-1">
              <Paperclip className="w-4 h-4" />
              <span>{task.attachmentCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
        <div className="flex items-center gap-4">
          {showProject && task.project && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400">Project:</span>
              <Link 
                to={`/projects/${task.project.id}`}
                className="text-orange-400 hover:text-orange-300"
              >
                {task.project.name}
              </Link>
            </div>
          )}

          {task.alignGoal && (
            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-orange-400" />
              <Link 
                to={`/align/goals/${task.alignGoal.id}`}
                className="text-orange-400 hover:text-orange-300"
              >
                {task.alignGoal.title}
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {task.tags.length > 0 && (
            <div className="flex items-center gap-1">
              {task.tags.slice(0, 2).map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-400"
                >
                  {tag}
                </span>
              ))}
              {task.tags.length > 2 && (
                <span className="text-xs text-slate-500">+{task.tags.length - 2}</span>
              )}
            </div>
          )}

          {onStatusChange && (
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task, e.target.value as Task['status'])}
              className="glass-input py-1 px-2 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
              <option value="cancelled">Cancelled</option>
            </select>
          )}
        </div>
      </div>
    </div>
  )
}