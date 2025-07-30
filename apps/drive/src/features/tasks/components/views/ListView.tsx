import { Calendar, Users, Target, Clock, CheckCircle2, AlertCircle, MoreVertical, ChevronRight } from 'lucide-react'
import { Task } from '../../hooks/useTasks'

interface ListViewProps {
  tasks: Task[]
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'text-red-400 bg-red-500/20'
    case 'high': return 'text-orange-400 bg-orange-500/20'
    case 'medium': return 'text-yellow-400 bg-yellow-500/20'
    case 'low': return 'text-green-400 bg-green-500/20'
    default: return 'text-slate-400 bg-slate-500/20'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'todo': return 'bg-blue-500/20 text-blue-400'
    case 'in-progress': return 'bg-orange-500/20 text-orange-400'
    case 'review': return 'bg-yellow-500/20 text-yellow-400'
    case 'done': return 'bg-green-500/20 text-green-400'
    default: return 'bg-slate-500/20 text-slate-400'
  }
}

export default function ListView({ tasks }: ListViewProps) {
  const isOverdue = (dueDate: string | null, status: string) => {
    return dueDate && new Date(dueDate) < new Date() && status !== 'done'
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort by priority (critical first) then by due date
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder]
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder]
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority
    }
    
    return new Date(a.due_date || '9999-12-31').getTime() - new Date(b.due_date || '9999-12-31').getTime()
  })

  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="glass-card p-4 bg-slate-800/40">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-slate-400">
          <div className="col-span-4">Task</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Priority</div>
          <div className="col-span-2">Assignee</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-1">Progress</div>
        </div>
      </div>

      {/* Task Rows */}
      <div className="space-y-2">
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className="glass-card p-4 hover:bg-slate-800/40 transition-colors cursor-pointer group"
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Task Info */}
              <div className="col-span-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {task.status === 'done' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <div className="w-4 h-4 rounded border-2 border-slate-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-100 group-hover:text-orange-300 transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-1 mt-1">
                      {task.description}
                    </p>
                    
                    {/* Project and Goal */}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-slate-500">
                        📁 {task.project?.name || 'No Project'}
                      </span>
                      {task.align_goal && (
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3 text-orange-400" />
                          <span className="text-xs text-orange-400">{task.align_goal.title}</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {(task.tags || []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(task.tags || []).slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                        {(task.tags || []).length > 3 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400">
                            +{(task.tags || []).length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {task.status === 'in-progress' ? 'In Progress' : 
                   task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
              </div>

              {/* Priority */}
              <div className="col-span-1">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>

              {/* Assignee */}
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-300">{task.assignee}</span>
                </div>
              </div>

              {/* Due Date */}
              <div className="col-span-2">
                <div className={`flex items-center gap-2 ${
                  isOverdue(task.dueDate, task.status) ? 'text-red-400' : 'text-slate-400'
                }`}>
                  {isOverdue(task.dueDate, task.status) && (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="col-span-1">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="w-full bg-slate-700/50 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 ml-2">{task.progress}%</span>
                </div>
              </div>
            </div>

            {/* Time Tracking (expandable row) */}
            {task.actualHours > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>Time Tracking</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400">
                      Logged: {task.actualHours}h / {task.estimatedHours}h
                    </span>
                    <div className="w-24 bg-slate-700/50 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${Math.min((task.actualHours / task.estimatedHours) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2">
                <button className="text-slate-400 hover:text-slate-300 p-1">
                  <MoreVertical className="w-4 h-4" />
                </button>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="glass-card p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No tasks found</h3>
          <p className="text-slate-500">
            Try adjusting your filters or create a new task to get started.
          </p>
        </div>
      )}
    </div>
  )
}