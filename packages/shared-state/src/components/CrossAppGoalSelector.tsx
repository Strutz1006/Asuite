import React, { useState, useEffect } from 'react'
import { Target, Search, Check, AlertCircle } from 'lucide-react'
import { useGoalsCache, useSharedState } from '../store'

interface Goal {
  id: string
  title: string
  progress: number
  status: string
}

interface CrossAppGoalSelectorProps {
  selectedGoalId?: string
  onSelect: (goal: Goal | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function CrossAppGoalSelector({
  selectedGoalId,
  onSelect,
  placeholder = "Select a goal to align with...",
  disabled = false,
  className = ''
}: CrossAppGoalSelectorProps) {
  const goals = useGoalsCache()
  const { connectionStatus } = useSharedState()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([])

  const selectedGoal = goals.find(goal => goal.id === selectedGoalId)

  // Filter goals based on search term
  useEffect(() => {
    if (searchTerm.trim()) {
      setFilteredGoals(
        goals.filter(goal =>
          goal.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    } else {
      setFilteredGoals(goals)
    }
  }, [goals, searchTerm])

  const handleGoalSelect = (goal: Goal) => {
    onSelect(goal)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleClearSelection = () => {
    onSelect(null)
    setIsOpen(false)
  }

  if (connectionStatus !== 'connected' && goals.length === 0) {
    return (
      <div className={`flex items-center gap-2 p-3 bg-slate-800/40 border border-slate-600 rounded-lg text-slate-400 ${className}`}>
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">Goals unavailable (offline)</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Selected Goal Display / Trigger Button */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between p-3 text-left
          bg-slate-800/50 border border-slate-600 rounded-lg
          transition-colors duration-200
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-slate-800/70 focus:outline-none focus:ring-2 focus:ring-orange-500/50'
          }
          ${isOpen ? 'ring-2 ring-orange-500/50' : ''}
        `}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Target className="w-4 h-4 text-orange-400 flex-shrink-0" />
          {selectedGoal ? (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">
                {selectedGoal.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-16 bg-slate-700 rounded-full h-1">
                  <div
                    className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${selectedGoal.progress}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400">{selectedGoal.progress}%</span>
              </div>
            </div>
          ) : (
            <span className="text-sm text-slate-400 truncate">
              {placeholder}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {connectionStatus !== 'connected' && (
            <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Offline mode" />
          )}
          <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg shadow-xl z-50 max-h-64 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search goals..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
          </div>

          {/* Goals List */}
          <div className="max-h-48 overflow-y-auto">
            {/* Clear Selection Option */}
            {selectedGoal && (
              <button
                onClick={handleClearSelection}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-800/60 transition-colors border-b border-slate-700/50"
              >
                <div className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm text-slate-400">Clear selection</span>
              </button>
            )}

            {filteredGoals.length === 0 ? (
              <div className="p-4 text-center">
                <Target className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-400">
                  {searchTerm ? 'No goals match your search' : 'No goals available'}
                </p>
              </div>
            ) : (
              filteredGoals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalSelect(goal)}
                  className={`
                    w-full flex items-center gap-3 p-3 text-left hover:bg-slate-800/60 transition-colors
                    ${selectedGoal?.id === goal.id ? 'bg-orange-500/10' : ''}
                  `}
                >
                  <div className="flex-shrink-0">
                    {selectedGoal?.id === goal.id ? (
                      <Check className="w-4 h-4 text-orange-400" />
                    ) : (
                      <Target className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      selectedGoal?.id === goal.id ? 'text-orange-300' : 'text-slate-200'
                    }`}>
                      {goal.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-20 bg-slate-700 rounded-full h-1">
                        <div
                          className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">{goal.progress}%</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        goal.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {goal.status}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}