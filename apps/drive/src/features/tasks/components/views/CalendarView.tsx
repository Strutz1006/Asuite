import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Clock, Users, Target } from 'lucide-react'
import { Task } from '../../hooks/useTasks'

interface CalendarViewProps {
  tasks: Task[]
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-500 border-red-600'
    case 'high': return 'bg-orange-500 border-orange-600'
    case 'medium': return 'bg-yellow-500 border-yellow-600'
    case 'low': return 'bg-green-500 border-green-600'
    default: return 'bg-slate-500 border-slate-600'
  }
}

export default function CalendarView({ tasks }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // Get first day of current month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  
  // Get first day to show (start of week containing first day of month)
  const startDate = new Date(firstDayOfMonth)
  startDate.setDate(startDate.getDate() - startDate.getDay())
  
  // Generate calendar days
  const calendarDays = []
  const currentCalendarDate = new Date(startDate)
  
  for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
    calendarDays.push(new Date(currentCalendarDate))
    currentCalendarDate.setDate(currentCalendarDate.getDate() + 1)
  }

  const getTasksForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return tasks.filter(task => task.dueDate === dateString)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100">
          {formatMonthYear(currentDate)}
        </h2>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth('prev')}
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
            onClick={() => navigateMonth('next')}
            className="glass-button p-2 text-slate-300 hover:text-slate-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="glass-card p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-3 text-center">
              <span className="text-sm font-medium text-slate-400">{day}</span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            const dayTasks = getTasksForDate(date)
            const isCurrentMonthDay = isCurrentMonth(date)
            const isTodayDate = isToday(date)
            
            return (
              <div
                key={index}
                className={`min-h-24 p-2 border border-slate-700/50 rounded-lg transition-colors hover:bg-slate-800/40
                  ${isCurrentMonthDay ? 'bg-slate-800/20' : 'bg-slate-900/20'}
                  ${isTodayDate ? 'ring-2 ring-orange-500/50 bg-orange-500/10' : ''}
                `}
              >
                {/* Date Number */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium
                    ${isCurrentMonthDay 
                      ? isTodayDate 
                        ? 'text-orange-400' 
                        : 'text-slate-200'
                      : 'text-slate-600'
                    }
                  `}>
                    {date.getDate()}
                  </span>
                  
                  {dayTasks.length > 0 && (
                    <span className="text-xs bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-full">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                {/* Tasks */}
                <div className="space-y-1">
                  {dayTasks.slice(0, 2).map((task) => (
                    <div
                      key={task.id}
                      className={`p-1.5 rounded text-xs text-white cursor-pointer transition-all hover:scale-105 ${getPriorityColor(task.priority)}`}
                      title={`${task.title} - ${task.assignee}`}
                    >
                      <div className="font-medium truncate">{task.title}</div>
                      <div className="flex items-center gap-1 mt-0.5 opacity-80">
                        <Users className="w-2.5 h-2.5" />
                        <span className="truncate">{task.assignee}</span>
                      </div>
                    </div>
                  ))}
                  
                  {dayTasks.length > 2 && (
                    <div className="text-xs text-slate-400 text-center py-1">
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Today's Tasks Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Legend */}
        <div className="glass-card p-4">
          <h3 className="font-semibold text-slate-100 mb-3">Priority Legend</h3>
          <div className="space-y-2">
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

        {/* Today's Tasks */}
        <div className="lg:col-span-2 glass-card p-4">
          <h3 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-400" />
            Today's Tasks
          </h3>
          
          {(() => {
            const today = new Date()
            const todayString = today.toISOString().split('T')[0]
            const todayTasks = tasks.filter(task => task.dueDate === todayString)
            
            if (todayTasks.length === 0) {
              return (
                <div className="text-center py-8">
                  <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No tasks due today</p>
                </div>
              )
            }
            
            return (
              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="glass-card p-3 bg-slate-800/40 hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${getPriorityColor(task.priority).split(' ')[0]}`} />
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-100 mb-1">{task.title}</h4>
                        <p className="text-sm text-slate-400 line-clamp-2 mb-2">
                          {task.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{task.assignee}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{task.estimatedHours}h estimated</span>
                          </div>
                          
                          {task.alignGoal && (
                            <div className="flex items-center gap-1">
                              <Target className="w-3 h-3 text-orange-400" />
                              <span className="text-orange-400">{task.alignGoal}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}