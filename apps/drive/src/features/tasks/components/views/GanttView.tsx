import { useState } from 'react'
import { Calendar, Users, Target, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'
import { Task } from '../TaskManager'

interface GanttViewProps {
  tasks: Task[]
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-500'
    case 'high': return 'bg-orange-500'
    case 'medium': return 'bg-yellow-500'
    case 'low': return 'bg-green-500'
    default: return 'bg-slate-500'
  }
}

export default function GanttView({ tasks }: GanttViewProps) {
  const [timeScale, setTimeScale] = useState<'day' | 'week' | 'month'>('week')
  const [currentDate, setCurrentDate] = useState(new Date())

  // Calculate date range for the view
  const getDateRange = () => {
    const start = new Date(currentDate)
    const end = new Date(currentDate)
    
    if (timeScale === 'day') {
      start.setDate(start.getDate() - 7)
      end.setDate(end.getDate() + 7)
    } else if (timeScale === 'week') {
      start.setDate(start.getDate() - 28)
      end.setDate(end.getDate() + 28)
    } else {
      start.setMonth(start.getMonth() - 3)
      end.setMonth(end.getMonth() + 3)
    }
    
    return { start, end }
  }

  const { start: rangeStart, end: rangeEnd } = getDateRange()
  const totalDays = Math.ceil((rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24))

  // Generate time headers
  const generateTimeHeaders = () => {
    const headers = []
    const current = new Date(rangeStart)
    
    while (current <= rangeEnd) {
      if (timeScale === 'day') {
        headers.push({
          label: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          date: new Date(current)
        })
        current.setDate(current.getDate() + 1)
      } else if (timeScale === 'week') {
        const weekStart = new Date(current)
        const weekEnd = new Date(current)
        weekEnd.setDate(weekEnd.getDate() + 6)
        
        headers.push({
          label: `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          date: new Date(current)
        })
        current.setDate(current.getDate() + 7)
      } else {
        headers.push({
          label: current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          date: new Date(current)
        })
        current.setMonth(current.getMonth() + 1)
      }
    }
    
    return headers
  }

  const timeHeaders = generateTimeHeaders()

  // Calculate task bar position and width
  const getTaskBarStyle = (task: Task) => {
    const taskStart = new Date(task.dueDate)
    const taskDuration = task.estimatedHours / 8 // Convert hours to days (8 hours per day)
    const taskEnd = new Date(taskStart)
    taskEnd.setDate(taskEnd.getDate() + Math.max(1, Math.ceil(taskDuration)))

    const startOffset = Math.max(0, (taskStart.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24))
    const endOffset = Math.min(totalDays, (taskEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24))
    
    const leftPercent = (startOffset / totalDays) * 100
    const widthPercent = ((endOffset - startOffset) / totalDays) * 100

    return {
      left: `${leftPercent}%`,
      width: `${Math.max(2, widthPercent)}%`
    }
  }

  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (timeScale === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    } else if (timeScale === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 28 : -28))
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 3 : -3))
    }
    setCurrentDate(newDate)
  }

  // Sort tasks by due date and project
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.project !== b.project) {
      return a.project.localeCompare(b.project)
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })

  return (
    <div className="space-y-6">
      {/* Gantt Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-slate-100">Timeline View</h2>
          
          {/* Time Scale Selector */}
          <div className="flex gap-1 glass-card p-1">
            {(['day', 'week', 'month'] as const).map((scale) => (
              <button
                key={scale}
                onClick={() => setTimeScale(scale)}
                className={`px-3 py-1 text-sm font-medium rounded transition-all duration-200
                  ${timeScale === scale
                    ? 'bg-orange-500/20 text-orange-300'
                    : 'text-slate-400 hover:text-slate-300'
                  }`}
              >
                {scale.charAt(0).toUpperCase() + scale.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('prev')}
            className="glass-button p-2 text-slate-300 hover:text-slate-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setCurrentDate(new Date())}
            className="glass-button px-4 py-2 text-slate-300 hover:text-slate-100 text-sm"
          >
            Today
          </button>
          
          <button
            onClick={() => navigate('next')}
            className="glass-button p-2 text-slate-300 hover:text-slate-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="glass-card overflow-hidden">
        <div className="flex">
          {/* Task List Sidebar */}
          <div className="w-80 border-r border-slate-700/50 bg-slate-800/20">
            {/* Header */}
            <div className="p-4 border-b border-slate-700/50 bg-slate-800/40">
              <h3 className="font-medium text-slate-200">Tasks</h3>
            </div>
            
            {/* Task Rows */}
            <div className="max-h-96 overflow-y-auto">
              {sortedTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="p-4 border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors"
                  style={{ height: '72px' }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getPriorityColor(task.priority)}`} />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-100 text-sm truncate mb-1">
                        {task.title}
                      </h4>
                      
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Users className="w-3 h-3" />
                        <span className="truncate">{task.assignee}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>{task.project}</span>
                        {task.alignGoal && (
                          <>
                            <span>•</span>
                            <Target className="w-3 h-3 text-orange-400" />
                            <span className="text-orange-400 truncate">{task.alignGoal}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Area */}
          <div className="flex-1 overflow-x-auto">
            {/* Time Headers */}
            <div className="border-b border-slate-700/50 bg-slate-800/40">
              <div className="flex" style={{ minWidth: '800px' }}>
                {timeHeaders.map((header, index) => (
                  <div
                    key={index}
                    className="flex-1 p-3 text-center border-r border-slate-700/30 last:border-r-0"
                  >
                    <span className="text-xs font-medium text-slate-300">{header.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Bars */}
            <div className="relative max-h-96 overflow-y-auto" style={{ minWidth: '800px' }}>
              {sortedTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="relative border-b border-slate-700/30 hover:bg-slate-800/20 transition-colors"
                  style={{ height: '72px' }}
                >
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex">
                    {timeHeaders.map((_, headerIndex) => (
                      <div
                        key={headerIndex}
                        className="flex-1 border-r border-slate-700/20 last:border-r-0"
                      />
                    ))}
                  </div>

                  {/* Task Bar */}
                  <div
                    className={`absolute top-1/2 transform -translate-y-1/2 h-6 rounded ${getPriorityColor(task.priority)} flex items-center px-2 cursor-pointer hover:opacity-80 transition-opacity`}
                    style={getTaskBarStyle(task)}
                    title={`${task.title} - ${task.assignee}`}
                  >
                    <div className="text-white text-xs font-medium truncate flex-1">
                      {task.title}
                    </div>
                    <div className="text-white text-xs opacity-75 ml-1">
                      {task.progress}%
                    </div>
                  </div>

                  {/* Progress Overlay */}
                  {task.progress > 0 && (
                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 h-6 bg-green-400/30 rounded-l"
                      style={{
                        ...getTaskBarStyle(task),
                        width: `${parseFloat(getTaskBarStyle(task).width.replace('%', '')) * (task.progress / 100)}%`
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-4">
          <h3 className="font-semibold text-slate-100 mb-3">Priority Legend</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span className="text-sm text-slate-300">Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-orange-500"></div>
              <span className="text-sm text-slate-300">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500"></div>
              <span className="text-sm text-slate-300">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span className="text-sm text-slate-300">Low</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="font-semibold text-slate-100 mb-3">Timeline Info</h3>
          <div className="space-y-2 text-sm text-slate-400">
            <div>• Tasks are positioned by due date</div>
            <div>• Bar length represents estimated duration</div>
            <div>• Green overlay shows completion progress</div>
            <div>• Hover for task details</div>
          </div>
        </div>
      </div>
    </div>
  )
}