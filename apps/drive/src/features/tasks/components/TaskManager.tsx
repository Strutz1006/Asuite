import { useState } from 'react'
import { Plus, Search, Filter, Calendar, List, Grid3X3, BarChart3, Target, Users, Clock, AlertCircle, CheckCircle2, MoreVertical, ArrowRight } from 'lucide-react'
import KanbanView from './views/KanbanView'
import ListView from './views/ListView'
import CalendarView from './views/CalendarView'
import GanttView from './views/GanttView'

export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee: string
  dueDate: string
  project: string
  alignGoal?: string
  estimatedHours: number
  actualHours: number
  tags: string[]
  dependencies: string[]
  progress: number
}

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Design user authentication flow',
    description: 'Create wireframes and user flow for the new authentication system',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Sarah Chen',
    dueDate: '2024-08-15',
    project: 'Customer Portal Redesign',
    alignGoal: 'Improve Customer Satisfaction',
    estimatedHours: 16,
    actualHours: 12,
    tags: ['design', 'ux', 'auth'],
    dependencies: [],
    progress: 75,
  },
  {
    id: '2',
    title: 'Implement API rate limiting',
    description: 'Add rate limiting to prevent API abuse and ensure fair usage',
    status: 'todo',
    priority: 'medium',
    assignee: 'Marcus Rodriguez',
    dueDate: '2024-08-20',
    project: 'API Integration Platform',
    alignGoal: 'Increase Revenue by 25%',
    estimatedHours: 24,
    actualHours: 0,
    tags: ['backend', 'api', 'security'],
    dependencies: ['3'],
    progress: 0,
  },
  {
    id: '3',
    title: 'API documentation update',
    description: 'Update API documentation with new endpoints and examples',
    status: 'review',
    priority: 'medium',
    assignee: 'Emily Watson',
    dueDate: '2024-08-18',
    project: 'API Integration Platform',
    estimatedHours: 8,
    actualHours: 7,
    tags: ['documentation', 'api'],
    dependencies: [],
    progress: 90,
  },
  {
    id: '4',
    title: 'Mobile app onboarding screens',
    description: 'Design and implement user onboarding flow for mobile app',
    status: 'todo',
    priority: 'high',
    assignee: 'Alex Kim',
    dueDate: '2024-09-01',
    project: 'Mobile App Launch',
    alignGoal: 'Expand Market Presence',
    estimatedHours: 20,
    actualHours: 0,
    tags: ['mobile', 'design', 'onboarding'],
    dependencies: [],
    progress: 0,
  },
  {
    id: '5',
    title: 'Security vulnerability assessment',
    description: 'Conduct comprehensive security audit of all systems',
    status: 'done',
    priority: 'critical',
    assignee: 'David Park',
    dueDate: '2024-07-30',
    project: 'Security Audit & Compliance',
    estimatedHours: 40,
    actualHours: 38,
    tags: ['security', 'audit', 'compliance'],
    dependencies: [],
    progress: 100,
  },
]

type ViewMode = 'kanban' | 'list' | 'calendar' | 'gantt'

const viewOptions = [
  { value: 'kanban', label: 'Kanban', icon: Grid3X3 },
  { value: 'list', label: 'List', icon: List },
  { value: 'calendar', label: 'Calendar', icon: Calendar },
  { value: 'gantt', label: 'Gantt', icon: BarChart3 },
]

export default function TaskManager() {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all')

  const filteredTasks = sampleTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    const matchesAssignee = assigneeFilter === 'all' || task.assignee === assigneeFilter
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
  })

  const taskStats = {
    total: sampleTasks.length,
    todo: sampleTasks.filter(t => t.status === 'todo').length,
    inProgress: sampleTasks.filter(t => t.status === 'in-progress').length,
    review: sampleTasks.filter(t => t.status === 'review').length,
    done: sampleTasks.filter(t => t.status === 'done').length,
    overdue: sampleTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'done').length,
  }

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
        <button className="glass-button text-orange-300 hover:text-orange-200 px-4 py-2 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Task
        </button>
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
            <option value="Sarah Chen" className="bg-slate-900">Sarah Chen</option>
            <option value="Marcus Rodriguez" className="bg-slate-900">Marcus Rodriguez</option>
            <option value="Emily Watson" className="bg-slate-900">Emily Watson</option>
            <option value="Alex Kim" className="bg-slate-900">Alex Kim</option>
            <option value="David Park" className="bg-slate-900">David Park</option>
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
        {renderView()}
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6 bg-orange-500/10 border-orange-500/30">
        <h2 className="text-lg font-semibold text-orange-300 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="glass-card p-4 hover:bg-slate-800/40 transition-colors text-center">
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
              {sampleTasks.filter(t => t.alignGoal).length} of {sampleTasks.length} tasks are aligned with strategic goals from Aesyros Align.
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
    </div>
  )
}