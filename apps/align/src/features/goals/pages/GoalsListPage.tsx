import { useState } from 'react'
import { Plus, Filter, Search, Target, TrendingUp, Users, Calendar, MoreVertical, ChevronRight, ArrowUpRight, ArrowDownRight, TreePine, List, Grid } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GoalHierarchyView } from '../components/GoalHierarchyView'
import { GoalCreationWizard } from '../components/GoalCreationWizard'

const goals = [
  {
    id: '1',
    title: 'Increase Customer Satisfaction Score to 90%',
    type: 'company',
    owner: 'Leadership Team',
    progress: 78,
    dueDate: '2024-12-31',
    status: 'on-track',
    keyResults: 3,
    childGoals: 5,
    trend: 'up',
    trendValue: '+2.3%',
  },
  {
    id: '2',
    title: 'Launch New Product Line',
    type: 'department',
    department: 'Product',
    owner: 'Product Team',
    progress: 45,
    dueDate: '2024-09-30',
    status: 'at-risk',
    keyResults: 4,
    childGoals: 8,
    trend: 'down',
    trendValue: '-1.5%',
  },
  {
    id: '3',
    title: 'Reduce Operational Costs by 15%',
    type: 'company',
    owner: 'Operations',
    progress: 92,
    dueDate: '2024-06-30',
    status: 'ahead',
    keyResults: 5,
    childGoals: 12,
    trend: 'up',
    trendValue: '+5.2%',
  },
  {
    id: '4',
    title: 'Improve Employee Engagement Score',
    type: 'department',
    department: 'HR',
    owner: 'HR Team',
    progress: 65,
    dueDate: '2024-10-15',
    status: 'on-track',
    keyResults: 3,
    childGoals: 4,
    trend: 'up',
    trendValue: '+1.8%',
  },
]

const filters = [
  { label: 'All Goals', count: 24, active: true },
  { label: 'Company', count: 8, active: false },
  { label: 'Department', count: 12, active: false },
  { label: 'Individual', count: 4, active: false },
]

const viewModes = [
  { label: 'List View', icon: List, key: 'list' },
  { label: 'Board View', icon: Grid, key: 'board' },
  { label: 'Tree View', icon: TreePine, key: 'tree' },
]

export default function GoalsListPage() {
  const [viewMode, setViewMode] = useState('list')
  const [showCreateWizard, setShowCreateWizard] = useState(false)
  const [selectedParentGoal, setSelectedParentGoal] = useState(null)
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
              <p className="text-2xl font-semibold text-slate-100 mt-1">24</p>
            </div>
            <Target className="w-8 h-8 text-sky-400 opacity-50" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">On Track</p>
              <p className="text-2xl font-semibold text-green-400 mt-1">18</p>
            </div>
            <ArrowUpRight className="w-8 h-8 text-green-400 opacity-50" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">At Risk</p>
              <p className="text-2xl font-semibold text-yellow-400 mt-1">4</p>
            </div>
            <ArrowDownRight className="w-8 h-8 text-yellow-400 opacity-50" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Avg Progress</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">72%</p>
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
        {filters.map((filter) => (
          <button
            key={filter.label}
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
          onCreateGoal={(parentId) => {
            setSelectedParentGoal(parentId ? { id: parentId } : null)
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
        /* List View - Original Goals List */
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="glass-card p-6 hover:bg-slate-800/40 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${goal.type === 'company' 
                        ? 'bg-sky-500/20 text-sky-400'
                        : 'bg-green-500/20 text-green-400'
                      }
                    `}>
                      {goal.type === 'company' ? 'Company Goal' : `${goal.department} Goal`}
                    </span>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${goal.status === 'on-track'
                        ? 'bg-green-500/20 text-green-400'
                        : goal.status === 'at-risk'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-blue-500/20 text-blue-400'
                      }
                    `}>
                      {goal.status === 'on-track' ? 'On Track' : goal.status === 'at-risk' ? 'At Risk' : 'Ahead'}
                    </span>
                    <div className={`flex items-center gap-1 text-xs font-medium
                      ${goal.trend === 'up' ? 'text-green-400' : 'text-red-400'}
                    `}>
                      {goal.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {goal.trendValue}
                    </div>
                  </div>
                  <Link
                    to={`/goals/${goal.id}`}
                    className="text-xl font-semibold text-slate-100 hover:text-sky-300 transition-colors"
                  >
                    {goal.title}
                  </Link>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {goal.owner}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Due {new Date(goal.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-300">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Overall Progress</span>
                  <span className="text-sm font-medium text-slate-300">{goal.progress}%</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300
                      ${goal.status === 'at-risk' ? 'bg-yellow-500' : 
                        goal.status === 'ahead' ? 'bg-blue-500' : 'bg-sky-500'}
                    `}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              {/* Metrics and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-400">
                      {goal.keyResults} Key Results
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-400">
                      {goal.childGoals} Child Goals
                    </span>
                  </div>
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
          ))}
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
        onSubmit={(goal) => {
          console.log('Creating goal:', goal)
          // TODO: Implement goal creation
          setShowCreateWizard(false)
        }}
        parentGoal={selectedParentGoal}
      />
    </div>
  )
}