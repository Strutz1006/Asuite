import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Target, TrendingUp, Calendar, User, Plus, Edit, MoreHorizontal } from 'lucide-react'

interface Goal {
  id: string
  title: string
  description: string
  type: 'smart' | 'okr' | 'objective'
  status: 'draft' | 'active' | 'on_hold' | 'completed' | 'cancelled'
  priority: 'high' | 'medium' | 'low'
  progress: number
  targetValue: number | null
  currentValue: number | null
  unit: string
  targetDate: string
  owner: string
  ownerName: string
  children: Goal[]
  parentId: string | null
}

interface GoalHierarchyViewProps {
  goals: Goal[]
  onCreateGoal: (parentId?: string) => void
  onEditGoal: (goalId: string) => void
  onUpdateProgress: (goalId: string, progress: number) => void
}

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Increase Annual Revenue',
    description: 'Achieve 25% growth in annual recurring revenue through new customer acquisition and expansion.',
    type: 'okr',
    status: 'active',
    priority: 'high',
    progress: 76,
    targetValue: 1250000,
    currentValue: 950000,
    unit: 'USD',
    targetDate: '2024-12-31',
    owner: '1',
    ownerName: 'John Doe',
    parentId: null,
    children: [
      {
        id: '1-1',
        title: 'Acquire 50 New Enterprise Customers',
        description: 'Focus on enterprise deals with ACV > $10k',
        type: 'smart',
        status: 'active',
        priority: 'high',
        progress: 82,
        targetValue: 50,
        currentValue: 41,
        unit: 'customers',
        targetDate: '2024-12-31',
        owner: '2',
        ownerName: 'Jane Smith',
        parentId: '1',
        children: []
      },
      {
        id: '1-2',
        title: 'Increase Customer Retention to 95%',
        description: 'Reduce churn through improved onboarding and support',
        type: 'smart',
        status: 'active',
        priority: 'medium',
        progress: 70,
        targetValue: 95,
        currentValue: 87,
        unit: '%',
        targetDate: '2024-12-31',
        owner: '3',
        ownerName: 'Mike Johnson',
        parentId: '1',
        children: []
      }
    ]
  },
  {
    id: '2',
    title: 'Launch AI-Powered Analytics Platform',
    description: 'Successfully launch and market our next-generation analytics platform',
    type: 'objective',
    status: 'active',
    priority: 'high',
    progress: 45,
    targetValue: null,
    currentValue: null,
    unit: '',
    targetDate: '2024-06-30',
    owner: '4',
    ownerName: 'Sarah Wilson',
    parentId: null,
    children: [
      {
        id: '2-1',
        title: 'Complete Beta Testing with 20 Customers',
        description: 'Gather feedback and iterate on core features',
        type: 'smart',
        status: 'active',
        priority: 'high',
        progress: 65,
        targetValue: 20,
        currentValue: 13,
        unit: 'customers',
        targetDate: '2024-04-30',
        owner: '4',
        ownerName: 'Sarah Wilson',
        parentId: '2',
        children: []
      },
      {
        id: '2-2',
        title: 'Achieve 90% Performance Benchmarks',
        description: 'Meet all performance and reliability targets',
        type: 'smart',
        status: 'active',
        priority: 'high',
        progress: 25,
        targetValue: 90,
        currentValue: 67,
        unit: '%',
        targetDate: '2024-05-31',
        owner: '3',
        ownerName: 'Mike Johnson',
        parentId: '2',
        children: []
      }
    ]
  }
]

const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  active: 'bg-green-100 text-green-700',
  on_hold: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700'
}

const priorityColors = {
  high: 'border-l-red-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-green-500'
}

const typeIcons = {
  smart: Target,
  okr: TrendingUp,
  objective: Calendar
}

function GoalCard({ goal, level = 0, onCreateChild, onEdit, onUpdateProgress }: {
  goal: Goal
  level?: number
  onCreateChild: (parentId: string) => void
  onEdit: (goalId: string) => void
  onUpdateProgress: (goalId: string, progress: number) => void
}) {
  const [isExpanded, setIsExpanded] = useState(level < 2)
  const [showActions, setShowActions] = useState(false)
  
  const TypeIcon = typeIcons[goal.type]
  const hasChildren = goal.children.length > 0
  
  const progressColor = goal.progress >= 80 ? 'bg-green-500' : 
                       goal.progress >= 60 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className={`ml-${level * 6}`}>
      <div className={`bg-white rounded-lg border-l-4 ${priorityColors[goal.priority]} shadow-sm hover:shadow-md transition-shadow`}>
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              {/* Expand/Collapse Button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`mt-1 p-1 rounded hover:bg-gray-100 ${!hasChildren ? 'invisible' : ''}`}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {/* Goal Content */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <TypeIcon className="h-5 w-5 text-sky-600" />
                  <h3 className="font-semibold text-slate-900">{goal.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[goal.status]}`}>
                    {goal.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mb-3">{goal.description}</p>

                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{goal.ownerName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(goal.targetDate).toLocaleDateString()}</span>
                  </div>
                  {goal.targetValue && (
                    <div className="flex items-center space-x-1">
                      <Target className="h-4 w-4" />
                      <span>{goal.currentValue}/{goal.targetValue} {goal.unit}</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">Progress</span>
                    <span className="text-sm font-medium text-slate-700">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${progressColor} transition-all duration-300`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </button>

              {showActions && (
                <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                  <button
                    onClick={() => {
                      onEdit(goal.id)
                      setShowActions(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Goal</span>
                  </button>
                  <button
                    onClick={() => {
                      onCreateChild(goal.id)
                      setShowActions(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Sub-Goal</span>
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <div className="px-4 py-2">
                    <label className="text-xs text-gray-500 mb-1 block">Update Progress</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={goal.progress}
                      onChange={(e) => onUpdateProgress(goal.id, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Children Goals */}
      {hasChildren && isExpanded && (
        <div className="mt-4 space-y-4">
          {goal.children.map(child => (
            <GoalCard
              key={child.id}
              goal={child}
              level={level + 1}
              onCreateChild={onCreateChild}
              onEdit={onEdit}
              onUpdateProgress={onUpdateProgress}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function GoalHierarchyView({ goals = mockGoals, onCreateGoal, onEditGoal, onUpdateProgress }: GoalHierarchyViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || goal.status === filterStatus
    const matchesPriority = filterPriority === 'all' || goal.priority === filterPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Goal Hierarchy</h2>
          <p className="text-slate-600 mt-1">Manage your organizational goals and track progress</p>
        </div>
        <button
          onClick={() => onCreateGoal()}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Goal</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search goals..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-slate-700">Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-slate-700">Priority:</label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Goals Tree */}
      <div className="space-y-4">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No goals found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your filters to see more goals.'
                : 'Get started by creating your first organizational goal.'
              }
            </p>
            <button
              onClick={() => onCreateGoal()}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          filteredGoals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onCreateChild={onCreateGoal}
              onEdit={onEditGoal}
              onUpdateProgress={onUpdateProgress}
            />
          ))
        )}
      </div>
    </div>
  )
}