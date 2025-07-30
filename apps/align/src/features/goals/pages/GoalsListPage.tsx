import { useState, useRef, useEffect } from 'react'
import { Plus, Filter, Search, Target, TrendingUp, Users, Calendar, MoreVertical, ChevronRight, ArrowUpRight, ArrowDownRight, TreePine, List, Grid, Loader2, Edit, Trash2, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GoalHierarchyView } from '../components/GoalHierarchyView'
import { GoalCreationWizard } from '../components/GoalCreationWizard'
import { useGoals, Goal } from '../hooks/useGoals'

// Filter options will be calculated from real data
const filterOptions = [
  { label: 'All Goals', key: 'all' },
  { label: 'Company', key: 'company' },
  { label: 'Department', key: 'department' },
  { label: 'Team', key: 'team' },
  { label: 'Individual', key: 'individual' },
]

const viewModes = [
  { label: 'List View', icon: List, key: 'list' },
  { label: 'Board View', icon: Grid, key: 'board' },
  { label: 'Tree View', icon: TreePine, key: 'tree' },
]

export default function GoalsListPage() {
  const [viewMode, setViewMode] = useState('list')
  const [showCreateWizard, setShowCreateWizard] = useState(false)
  const [selectedParentGoal, setSelectedParentGoal] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [showProgressModal, setShowProgressModal] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const { goals, loading, error, createGoal, deleteGoal, updateGoalProgress, getGoalStats } = useGoals()
  const stats = getGoalStats()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle delete goal
  const handleDeleteGoal = async (goalId: string, goalTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${goalTitle}"? This action cannot be undone.`)) {
      try {
        await deleteGoal(goalId)
        setOpenDropdown(null)
      } catch (err) {
        console.error('Failed to delete goal:', err)
        // You could show a toast notification here
      }
    }
  }
  
  // Filter goals based on active filter and search term
  const filteredGoals = goals.filter(goal => {
    const matchesFilter = activeFilter === 'all' || goal.level === activeFilter
    const matchesSearch = !searchTerm || 
      goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })
  
  // Calculate filter counts
  const filterCounts = filterOptions.map(filter => ({
    ...filter,
    count: filter.key === 'all' ? goals.length : goals.filter(g => g.level === filter.key).length,
    active: filter.key === activeFilter
  }))
  
  const handleCreateGoal = async (goalData: any) => {
    try {
      await createGoal({
        title: goalData.title,
        description: goalData.description,
        level: goalData.type === 'smart' ? 'company' : goalData.level || 'company',
        framework: goalData.type,
        category: goalData.category,
        priority: goalData.priority,
        target_value: goalData.targetValue?.toString(),
        unit: goalData.unit,
        start_date: goalData.startDate,
        due_date: goalData.targetDate,
        owner_id: goalData.owner,
        parent_id: selectedParentGoal || undefined
      })
      setShowCreateWizard(false)
    } catch (err) {
      console.error('Failed to create goal:', err)
      // You could show a toast notification here
    }
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Goals</h1>
          <p className="text-slate-400 mt-1">
            Manage and track all strategic goals across your organization
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedParentGoal(null)
            setShowCreateWizard(true)
          }}
          className="glass-button text-sky-300 hover:text-sky-200 px-4 py-2 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Goals</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">{stats.total}</p>
            </div>
            <Target className="w-8 h-8 text-sky-400 opacity-50" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">On Track</p>
              <p className="text-2xl font-semibold text-green-400 mt-1">{stats.onTrack}</p>
            </div>
            <ArrowUpRight className="w-8 h-8 text-green-400 opacity-50" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">At Risk</p>
              <p className="text-2xl font-semibold text-yellow-400 mt-1">{stats.atRisk}</p>
            </div>
            <ArrowDownRight className="w-8 h-8 text-yellow-400 opacity-50" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Avg Progress</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">{stats.avgProgress}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400 opacity-50" />
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search goals by title, owner, or department..."
              className="glass-input w-full pl-12 pr-4 py-3 text-slate-100 placeholder-slate-500"
            />
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-1 glass-card p-1">
          {viewModes.map((mode) => {
            const Icon = mode.icon
            return (
              <button
                key={mode.key}
                onClick={() => setViewMode(mode.key)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2
                  ${viewMode === mode.key
                    ? 'bg-sky-500/20 text-sky-300'
                    : 'text-slate-400 hover:text-slate-300'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {mode.label}
              </button>
            )
          })}
        </div>

        {/* Filter Button */}
        <button className="glass-button text-slate-300 hover:text-slate-100 px-4 py-2 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Advanced Filter
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filterCounts.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`
              glass-card px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap
              ${filter.active
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/40'
              }
            `}
          >
            {filter.label}
            <span className="ml-2 text-xs opacity-70">({filter.count})</span>
          </button>
        ))}
      </div>

      {/* Goal Views */}
      {viewMode === 'tree' ? (
        <GoalHierarchyView
          goals={filteredGoals}
          onCreateGoal={(parentId) => {
            setSelectedParentGoal(parentId || null)
            setShowCreateWizard(true)
          }}
          onEditGoal={(goalId) => {
            // Navigate to edit page or open edit modal
            console.log('Edit goal:', goalId)
          }}
          onUpdateProgress={(goalId, progress) => {
            // Update goal progress
            console.log('Update progress:', goalId, progress)
          }}
        />
      ) : viewMode === 'board' ? (
        <div className="text-center py-12 glass-card">
          <Grid className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">Board View Coming Soon</h3>
          <p className="text-slate-500">Kanban-style goal management will be available soon.</p>
        </div>
      ) : (
        /* List View - Filtered Goals List */
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-sky-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12 glass-card">
              <div className="text-red-400 mb-2">Error loading goals</div>
              <div className="text-slate-500 text-sm">{error}</div>
            </div>
          ) : filteredGoals.length === 0 ? (
            <div className="text-center py-12 glass-card">
              <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">
                {goals.length === 0 ? 'No goals yet' : 'No matching goals'}
              </h3>
              <p className="text-slate-500">
                {goals.length === 0 
                  ? 'Create your first goal to get started with strategic planning.'
                  : 'Try adjusting your search or filter criteria.'}
              </p>
            </div>
          ) : (
            filteredGoals.map((goal) => {
              // Calculate status based on goal status and progress
              let statusColor, statusText
              
              if (goal.status === 'completed') {
                statusColor = 'green'
                statusText = 'Completed'
              } else if (goal.status === 'paused') {
                statusColor = 'gray' 
                statusText = 'Paused'
              } else if (goal.status === 'cancelled') {
                statusColor = 'red'
                statusText = 'Cancelled'
              } else {
                // Active goals - determine status by progress and due date
                const now = new Date()
                const dueDate = goal.due_date ? new Date(goal.due_date) : null
                const daysUntilDue = dueDate ? Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null
                
                if (goal.progress_percentage >= 90) {
                  statusColor = 'green'
                  statusText = 'On Track'
                } else if (goal.progress_percentage >= 70) {
                  statusColor = 'green'
                  statusText = 'On Track'
                } else if (goal.progress_percentage < 50) {
                  statusColor = 'red'
                  statusText = 'Behind'
                } else if (daysUntilDue && daysUntilDue < 7 && goal.progress_percentage < 70) {
                  statusColor = 'red'
                  statusText = 'Behind'
                } else {
                  // 50-69% progress
                  statusColor = 'yellow'
                  statusText = 'At Risk'
                }
              }
              
              return (
                <div key={goal.id} className="glass-card p-6 hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`
                          px-3 py-1 rounded-full text-xs font-medium
                          ${goal.level === 'company' 
                            ? 'bg-sky-500/20 text-sky-400'
                            : 'bg-green-500/20 text-green-400'
                          }
                        `}>
                          {goal.level.charAt(0).toUpperCase() + goal.level.slice(1)} Goal
                        </span>
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${statusColor === 'green'
                            ? 'bg-green-500/20 text-green-400'
                            : statusColor === 'yellow'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : statusColor === 'red'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-gray-500/20 text-gray-400'
                          }
                        `}>
                          {statusText}
                        </span>
                        {goal.priority && (
                          <span className={`
                            px-2 py-1 rounded text-xs font-medium
                            ${goal.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                              goal.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-blue-500/20 text-blue-400'
                            }
                          `}>
                            {goal.priority} priority
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/goals/${goal.id}`}
                        className="text-xl font-semibold text-slate-100 hover:text-sky-300 transition-colors"
                      >
                        {goal.title}
                      </Link>
                      {goal.description && (
                        <p className="text-sm text-slate-400 mt-1 line-clamp-2">{goal.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                        {goal.owner_id && (
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Owner ID: {goal.owner_id}
                          </span>
                        )}
                        {goal.due_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Due {new Date(goal.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="relative" ref={openDropdown === goal.id ? dropdownRef : null}>
                      <button 
                        onClick={() => setOpenDropdown(openDropdown === goal.id ? null : goal.id)}
                        className="text-slate-400 hover:text-slate-300 p-1 rounded"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {openDropdown === goal.id && (
                        <div className="absolute right-0 mt-2 w-48 glass-card py-1 z-50 animate-slide-up">
                          <Link
                            to={`/goals/${goal.id}/edit`}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 transition-colors"
                            onClick={() => setOpenDropdown(null)}
                          >
                            <Edit className="w-4 h-4" />
                            Edit Goal
                          </Link>
                          <button
                            onClick={() => setShowProgressModal(goal.id)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 transition-colors text-left"
                          >
                            <BarChart3 className="w-4 h-4" />
                            Update Progress
                          </button>
                          <button
                            onClick={() => handleDeleteGoal(goal.id, goal.title)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Goal
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Progress</span>
                      <span className="text-sm font-medium text-slate-300">{goal.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300
                          ${statusColor === 'green' ? 'bg-green-500' : 
                            statusColor === 'yellow' ? 'bg-yellow-500' :
                            statusColor === 'red' ? 'bg-red-500' : 'bg-gray-500'}
                        `}
                        style={{ width: `${goal.progress_percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Goal Info and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-400">
                          {goal.framework.toUpperCase()}
                        </span>
                      </div>
                      {goal.target_value && goal.unit && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-400">
                            {goal.current_value || '0'} / {goal.target_value} {goal.unit}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/goals/${goal.id}/edit`}
                        className="text-slate-400 hover:text-slate-300 text-sm"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/goals/${goal.id}`}
                        className="text-sky-400 hover:text-sky-300 flex items-center gap-1 text-sm"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <button className="glass-button text-slate-400 px-3 py-1 text-sm" disabled>
          Previous
        </button>
        <div className="flex gap-1">
          <button className="glass-button bg-sky-500/20 text-sky-300 px-3 py-1 text-sm">1</button>
          <button className="glass-button text-slate-400 px-3 py-1 text-sm">2</button>
          <button className="glass-button text-slate-400 px-3 py-1 text-sm">3</button>
        </div>
        <button className="glass-button text-slate-300 px-3 py-1 text-sm">
          Next
        </button>
      </div>

      {/* Goal Creation Wizard */}
      <GoalCreationWizard
        isOpen={showCreateWizard}
        onClose={() => setShowCreateWizard(false)}
        onSubmit={handleCreateGoal}
        parentGoal={selectedParentGoal ? { id: selectedParentGoal } : null}
      />

      {/* Progress Update Modal */}
      <SimpleProgressUpdateModal
        isOpen={!!showProgressModal}
        onClose={() => {
          setShowProgressModal(null)
          setOpenDropdown(null)
        }}
        goalId={showProgressModal || undefined}
        onSuccess={() => setShowProgressModal(null)}
      />
    </div>
  )
}

