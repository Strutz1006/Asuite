import { Calendar, Users, Target, AlertCircle, Clock, MoreVertical } from 'lucide-react'
import { Task } from '../TaskManager'

interface KanbanViewProps {
  tasks: Task[]
}

const columns = [
  { id: 'todo', title: 'To Do', color: 'border-blue-500/50', bgColor: 'bg-blue-500/10' },
  { id: 'in-progress', title: 'In Progress', color: 'border-orange-500/50', bgColor: 'bg-orange-500/10' },
  { id: 'review', title: 'Review', color: 'border-yellow-500/50', bgColor: 'bg-yellow-500/10' },
  { id: 'done', title: 'Done', color: 'border-green-500/50', bgColor: 'bg-green-500/10' },
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'border-l-red-500 bg-red-500/10'
    case 'high': return 'border-l-orange-500 bg-orange-500/10'
    case 'medium': return 'border-l-yellow-500 bg-yellow-500/10'
    case 'low': return 'border-l-green-500 bg-green-500/10'
    default: return 'border-l-slate-500 bg-slate-500/10'
  }
}

const getPriorityDot = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-500'
    case 'high': return 'bg-orange-500'
    case 'medium': return 'bg-yellow-500'
    case 'low': return 'bg-green-500'
    default: return 'bg-slate-500'
  }
}

export default function KanbanView({ tasks }: KanbanViewProps) {
  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status)
  }

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'done'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id)
        
        return (
          <div key={column.id} className={`glass-card p-4 ${column.bgColor} ${column.color}`}>
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-100">{column.title}</h3>
              <span className="text-sm text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                {columnTasks.length}
              </span>
            </div>

            {/* Tasks */}
            <div className="space-y-3">
              {columnTasks.map((task) => (
                <div
                  key={task.id}
                  className={`glass-card p-4 bg-slate-800/60 hover:bg-slate-800/80 transition-colors cursor-pointer border-l-4 ${getPriorityColor(task.priority)}`}
                >
                  {/* Task Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${getPriorityDot(task.priority)}`} />
                        <h4 className="font-medium text-slate-100 text-sm line-clamp-2">
                          {task.title}
                        </h4>
                      </div>
                      {task.description && (
                        <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <button className="text-slate-400 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Task Meta */}
                  <div className="space-y-2">
                    {/* Project & Goal */}
                    <div className="space-y-1">
                      <div className="text-xs text-slate-500">
                        📁 {task.project}
                      </div>
                      {task.alignGoal && (
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3 text-orange-400" />
                          <span className="text-xs text-orange-400">{task.alignGoal}</span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {task.progress > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-400">Progress</span>
                          <span className="text-xs text-slate-300">{task.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-1">
                          <div
                            className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {task.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                        {task.tags.length > 3 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400">
                            +{task.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Assignee and Due Date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-400">{task.assignee}</span>
                      </div>
                      
                      <div className={`flex items-center gap-1 ${
                        isOverdue(task.dueDate, task.status) ? 'text-red-400' : 'text-slate-400'
                      }`}>
                        {isOverdue(task.dueDate, task.status) && (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        <Calendar className="w-3 h-3" />
                        <span className="text-xs">
                          {new Date(task.dueDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Time Tracking */}
                    {task.actualHours > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>Time</span>
                        </div>
                        <span className="text-slate-400">
                          {task.actualHours}h / {task.estimatedHours}h
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Task Button */}
              <button className="w-full glass-card p-3 border-2 border-dashed border-slate-600 hover:border-slate-500 text-slate-500 hover:text-slate-400 transition-colors">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">+</span>
                  <span className="text-sm">Add Task</span>
                </div>
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}