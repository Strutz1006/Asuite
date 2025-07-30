import { useState, useEffect } from 'react'
import { Target, TrendingUp, Users, Building, Search, Loader2, Calendar, User, ChevronDown, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useGoals, Goal } from '../../goals/hooks/useGoals'

const levelConfig = {
  company: {
    icon: Building,
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/50',
  },
  department: {
    icon: Users,
    color: 'text-sky-400',
    bg: 'bg-sky-500/20',
    border: 'border-sky-500/50',
  },
  team: {
    icon: Target,
    color: 'text-green-400',
    bg: 'bg-green-500/20',
    border: 'border-green-500/50',
  },
  individual: {
    icon: User,
    color: 'text-orange-400',
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/50',
  },
}

interface ObjectiveWithChildren extends Goal {
  children?: ObjectiveWithChildren[]
}

function ObjectiveCard({ objective, children = [], depth = 0 }: { 
  objective: Goal; 
  children?: ObjectiveWithChildren[];
  depth?: number 
}) {
  const [isExpanded, setIsExpanded] = useState(depth < 2)
  const config = levelConfig[objective.level as keyof typeof levelConfig]
  const Icon = config.icon

  // Calculate status based on progress
  const getStatusColor = (progress: number) => {
    if (progress >= 90) return 'text-green-400'
    if (progress >= 70) return 'text-green-400'
    if (progress >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getStatusText = (goal: Goal) => {
    if (goal.status === 'completed') return 'Completed'
    if (goal.status === 'paused') return 'Paused'
    if (goal.status === 'cancelled') return 'Cancelled'
    
    if (goal.progress_percentage >= 90) return 'On Track'
    if (goal.progress_percentage >= 70) return 'On Track'
    if (goal.progress_percentage >= 50) return 'At Risk'
    return 'Behind'
  }

  const statusColor = getStatusColor(objective.progress_percentage)
  const statusText = getStatusText(objective)

  return (
    <div className={depth > 0 ? `ml-8 border-l border-slate-700/50 pl-6` : ''}>
      <div className={`glass-card p-6 border-l-4 ${config.border} hover:bg-slate-800/40 transition-colors`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className={`p-3 rounded-lg ${config.bg}`}>
              <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <Link
                  to={`/goals/${objective.id}`}
                  className="font-semibold text-slate-100 hover:text-sky-300 transition-colors"
                >
                  {objective.title}
                </Link>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                  {objective.level}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor.replace('text-', 'text-')} ${statusColor.replace('text-', 'bg-').replace('-400', '-500/20')}`}>
                  {statusText}
                </span>
              </div>
              
              {objective.description && (
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{objective.description}</p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Progress</span>
                    <span className="text-sm font-medium text-slate-300">{objective.progress_percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        objective.progress_percentage >= 70 ? 'bg-green-500' :
                        objective.progress_percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${objective.progress_percentage}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  {objective.due_date && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span>Due {new Date(objective.due_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {objective.owner_id && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <User className="w-4 h-4" />
                      <span>Owner: {objective.owner_id}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500 uppercase tracking-wider">
                    {objective.framework}
                  </span>
                  {objective.priority && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      objective.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      objective.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {objective.priority} priority
                    </span>
                  )}
                </div>
                
                {children.length > 0 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    {children.length} sub-objective{children.length !== 1 ? 's' : ''}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && children.length > 0 && (
        <div className="mt-4 space-y-4">
          {children.map((child) => (
            <ObjectiveCard 
              key={child.id} 
              objective={child} 
              children={child.children || []}
              depth={depth + 1} 
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ObjectivesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const { goals, loading, error, getGoalStats } = useGoals()
  const stats = getGoalStats()

  // Build hierarchy structure
  const buildHierarchy = (goals: Goal[]): ObjectiveWithChildren[] => {
    const goalMap = new Map<string, ObjectiveWithChildren>()
    
    // First pass: create nodes
    goals.forEach(goal => {
      goalMap.set(goal.id, { ...goal, children: [] })
    })
    
    // Second pass: build parent-child relationships
    const rootGoals: ObjectiveWithChildren[] = []
    
    goals.forEach(goal => {
      const goalNode = goalMap.get(goal.id)!
      
      if (goal.parent_id && goalMap.has(goal.parent_id)) {
        const parent = goalMap.get(goal.parent_id)!
        parent.children!.push(goalNode)
      } else {
        rootGoals.push(goalNode)
      }
    })
    
    return rootGoals
  }

  // Filter goals based on search
  const filteredGoals = goals.filter(goal => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return goal.title.toLowerCase().includes(searchLower) ||
           goal.description?.toLowerCase().includes(searchLower)
  })

  const hierarchicalGoals = buildHierarchy(filteredGoals)

  // Calculate hierarchy stats
  const levelCounts = goals.reduce((acc, goal) => {
    acc[goal.level] = (acc[goal.level] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 text-sky-400 animate-spin" />
          <span className="text-slate-300">Loading objectives...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 glass-card">
        <div className="text-red-400 mb-2">Error loading objectives</div>
        <div className="text-slate-500 text-sm">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Objectives</h1>
          <p className="text-slate-400 mt-1">
            View the complete goal hierarchy and organizational alignment
          </p>
        </div>
        <Link
          to="/goals/new"
          className="glass-button text-sky-300 hover:text-sky-200 px-4 py-2 flex items-center gap-2"
        >
          <Target className="w-4 h-4" />
          New Goal
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Objectives</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">{stats.total}</p>
            </div>
            <Target className="w-8 h-8 text-sky-400" />
          </div>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Completed</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">{stats.completed}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">On Track</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">{stats.onTrack}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Average Progress</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">{stats.avgProgress}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-sky-400" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search objectives..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="glass-input w-full pl-10 pr-4 py-2 text-slate-100 placeholder-slate-400"
        />
      </div>

      {/* Legend */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Hierarchy Levels</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(levelConfig).map(([level, config]) => {
            const Icon = config.icon
            const count = levelCounts[level] || 0
            return (
              <div key={level} className="flex items-center gap-2">
                <div className={`p-1 rounded ${config.bg}`}>
                  <Icon className={`w-3 h-3 ${config.color}`} />
                </div>
                <span className="text-sm text-slate-300 capitalize">
                  {level} ({count})
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Objectives Tree */}
      {hierarchicalGoals.length === 0 ? (
        <div className="text-center py-12 glass-card">
          <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">
            {goals.length === 0 ? 'No objectives yet' : 'No matching objectives'}
          </h3>
          <p className="text-slate-500">
            {goals.length === 0 
              ? 'Create your first goal to start building your organizational hierarchy.'
              : 'Try adjusting your search criteria.'}
          </p>
          {goals.length === 0 && (
            <Link
              to="/goals/new"
              className="inline-flex items-center gap-2 mt-4 text-sky-400 hover:text-sky-300"
            >
              <Target className="w-4 h-4" />
              Create First Goal
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {hierarchicalGoals.map((objective) => (
            <ObjectiveCard 
              key={objective.id} 
              objective={objective} 
              children={objective.children || []}
            />
          ))}
        </div>
      )}
    </div>
  )
}