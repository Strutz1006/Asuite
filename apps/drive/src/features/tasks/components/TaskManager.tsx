import { useState } from 'react'
import { Plus, Search, Calendar, List, Grid3X3, BarChart3, Target, Users, Clock, AlertCircle, Wifi, WifiOff, Loader2 } from 'lucide-react'
import KanbanView from './views/KanbanView'
import ListView from './views/ListView'
import CalendarView from './views/CalendarView'
import GanttView from './views/GanttView'
import { TaskCreationModal } from './TaskCreationModal'
import { useTasks } from '../hooks/useTasks'



type ViewMode = 'kanban' | 'list' | 'calendar' | 'gantt'

const viewOptions = [
  { value: 'kanban', label: 'Kanban', icon: Grid3X3 },
  { value: 'list', label: 'List', icon: List },
  { value: 'calendar', label: 'Calendar', icon: Calendar },
  { value: 'gantt', label: 'Gantt', icon: BarChart3 },
]

export default function TaskManager() {
  const {
    tasks,
    loading,
    error,
    realtimeEnabled,
    createTask,
    getTaskStats
  } = useTasks()

  const [viewMode, setViewMode] = useState<ViewMode>('kanban')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    const matchesAssignee = assigneeFilter === 'all' || 
                           (task.assignee?.full_name || '').includes(assigneeFilter)
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
  })

  const taskStats = getTaskStats()

  const renderView = () => {
    const commonProps = { tasks: filteredTasks }
    
    switch (viewMode) {
      case 'kanban':
        return <KanbanView {...commonProps} />
      case 'list':
        return <ListView {...commonProps} />
      case 'calendar':
        return <CalendarView {...commonProps} />
      case 'gantt':
        return <GanttView {...commonProps} />
      default:
        return <KanbanView {...commonProps} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Tasks</h1>
          <p className="text-slate-400 mt-1">
            Manage tasks aligned with your strategic goals
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Real-time connection status */}
          <div className="flex items-center gap-2 text-xs">
            {realtimeEnabled ? (
              <>
                <Wifi className="w-3 h-3 text-green-400" />
                <span className="text-green-400">Live</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-orange-400" />
                <span className="text-orange-400">Offline</span>
              </>
            )}
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="glass-button text-orange-300 hover:text-orange-200 px-4 py-2 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="glass-card p-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-slate-100">{taskStats.total}</p>
            <p className="text-xs text-slate-400">Total</p>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-blue-400">{taskStats.todo}</p>
            <p className="text-xs text-slate-400">To Do</p>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-orange-400">{taskStats.inProgress}</p>
            <p className="text-xs text-slate-400">In Progress</p>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-yellow-400">{taskStats.review}</p>
            <p className="text-xs text-slate-400">Review</p>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-green-400">{taskStats.done}</p>
            <p className="text-xs text-slate-400">Done</p>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-red-400">{taskStats.overdue}</p>
            <p className="text-xs text-slate-400">Overdue</p>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks by title or description..."
              className="glass-input w-full pl-12 pr-4 py-3 text-slate-100 placeholder-slate-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-input px-3 py-2 text-sm text-slate-100 min-w-32"
          >
            <option value="all" className="bg-slate-900">All Status</option>
            <option value="todo" className="bg-slate-900">To Do</option>
            <option value="in-progress" className="bg-slate-900">In Progress</option>
            <option value="review" className="bg-slate-900">Review</option>
            <option value="done" className="bg-slate-900">Done</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="glass-input px-3 py-2 text-sm text-slate-100 min-w-32"
          >
            <option value="all" className="bg-slate-900">All Priority</option>
            <option value="critical" className="bg-slate-900">Critical</option>
            <option value="high" className="bg-slate-900">High</option>
            <option value="medium" className="bg-slate-900">Medium</option>
            <option value="low" className="bg-slate-900">Low</option>
          </select>

          {/* Assignee Filter */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="glass-input px-3 py-2 text-sm text-slate-100 min-w-32"
          >
            <option value="all" className="bg-slate-900">All Assignees</option>
            {Array.from(new Set(tasks.map(t => t.assignee?.full_name).filter(Boolean))).map(name => (
              <option key={name} value={name} className="bg-slate-900">{name}</option>
            ))}
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex gap-1 glass-card p-1">
          {viewOptions.map((option) => {
            const Icon = option.icon
            return (
              <button
                key={option.value}
                onClick={() => setViewMode(option.value as ViewMode)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2
                  ${viewMode === option.value
                    ? 'bg-orange-500/20 text-orange-300'
                    : 'text-slate-400 hover:text-slate-300'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main View */}
      <div className="min-h-96">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading tasks...</span>
            </div>
          </div>
        ) : error ? (
          <div className="glass-card p-8 text-center bg-red-500/10 border-red-500/30">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-300 mb-2">Error Loading Tasks</h3>
            <p className="text-red-200 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="glass-button text-red-300 hover:text-red-200 px-4 py-2"
            >
              Retry
            </button>
          </div>
        ) : (
          renderView()
        )}
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6 bg-orange-500/10 border-orange-500/30">
        <h2 className="text-lg font-semibold text-orange-300 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="glass-card p-4 hover:bg-slate-800/40 transition-colors text-center"
          >
            <Plus className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <h3 className="font-medium text-slate-200 mb-1">Create Task</h3>
            <p className="text-xs text-slate-400">Add new task from scratch</p>
          </button>
          
          <button className="glass-card p-4 hover:bg-slate-800/40 transition-colors text-center">
            <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <h3 className="font-medium text-slate-200 mb-1">From Goals</h3>
            <p className="text-xs text-slate-400">Convert Align goals to tasks</p>
          </button>
          
          <button className="glass-card p-4 hover:bg-slate-800/40 transition-colors text-center">
            <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <h3 className="font-medium text-slate-200 mb-1">Bulk Assign</h3>
            <p className="text-xs text-slate-400">Assign multiple tasks to team</p>
          </button>
          
          <button className="glass-card p-4 hover:bg-slate-800/40 transition-colors text-center">
            <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <h3 className="font-medium text-slate-200 mb-1">Time Tracking</h3>
            <p className="text-xs text-slate-400">Log time against tasks</p>
          </button>
        </div>
      </div>

      {/* Align Integration */}
      <div className="glass-card p-6 bg-blue-500/10 border-blue-500/30">
        <div className="flex items-start gap-3">
          <Target className="w-6 h-6 text-blue-400 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Strategic Alignment</h3>
            <p className="text-sm text-slate-300 mb-4">
              {tasks.filter(t => t.align_goal_id).length} of {tasks.length} tasks are aligned with strategic goals from Aesyros Align.
            </p>
            <div className="flex items-center gap-4">
              <button className="glass-button text-blue-300 hover:text-blue-200 px-4 py-2 text-sm">
                View Goal Alignment
              </button>
              <button className="glass-button text-slate-300 hover:text-slate-100 px-4 py-2 text-sm">
                Sync with Align
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task Creation Modal */}
      <TaskCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={createTask}
      />
    </div>
  )
}