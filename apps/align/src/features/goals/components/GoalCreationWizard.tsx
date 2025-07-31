import React, { useState } from 'react'
import { X, Target, Calendar, Users, TrendingUp, CheckCircle, ArrowRight, ArrowLeft, Building2 } from 'lucide-react'
import { useGoals } from '../hooks/useGoals'

interface Goal {
  title: string
  description: string
  type: 'smart' | 'okr' | 'objective'
  category: string
  priority: 'high' | 'medium' | 'low'
  targetValue: number | null
  unit: string
  startDate: string
  targetDate: string
  owner: string
  parentGoal: string | null
  linkedObjective: string | null
  keyResults: KeyResult[]
}

interface KeyResult {
  id: string
  title: string
  description: string
  targetValue: number
  currentValue: number
  unit: string
}

interface GoalCreationWizardProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (goal: Goal) => void
  parentGoal?: any
}

const steps = [
  { id: 1, name: 'Goal Type', icon: Target },
  { id: 2, name: 'Basic Details', icon: TrendingUp },
  { id: 3, name: 'Objective Link', icon: Building2 },
  { id: 4, name: 'Measurement', icon: Calendar },
  { id: 5, name: 'Ownership', icon: Users },
  { id: 6, name: 'Key Results', icon: CheckCircle },
]

const goalTypes = [
  {
    type: 'goal' as const,
    name: 'SMART Goal',
    description: 'Specific, Measurable, Achievable, Relevant, Time-bound targets',
    example: 'Install 1,000 solar panels in rural Kenya by Q3',
    color: 'bg-orange-500/20 border-orange-500/50 text-orange-400'
  }
]

const organizationalLevels = [
  {
    level: 'company' as const,
    name: 'Company-wide',
    description: 'Applies to the entire organization',
    icon: '🏢'
  },
  {
    level: 'department' as const,
    name: 'Department',
    description: 'Owned by a specific department',
    icon: '🏬'
  },
  {
    level: 'team' as const,
    name: 'Team',
    description: 'Owned by a specific team',
    icon: '👥'
  },
  {
    level: 'individual' as const,
    name: 'Individual',
    description: 'Personal responsibility',
    icon: '👤'
  }
]

const categories = [
  'Financial Growth',
  'Customer Success',
  'Operational Excellence',
  'Innovation',
  'Team Development',
  'Market Expansion',
  'Product Development',
  'Digital Transformation'
]

const mockUsers = [
  { id: '1', name: 'John Doe', role: 'CEO' },
  { id: '2', name: 'Jane Smith', role: 'VP Sales' },
  { id: '3', name: 'Mike Johnson', role: 'VP Engineering' },
  { id: '4', name: 'Sarah Wilson', role: 'Head of Marketing' }
]

export function GoalCreationWizard({ isOpen, onClose, onSubmit, parentGoal }: GoalCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const { goals } = useGoals()
  
  // Get available objectives (strategic_level = 'objective')
  const availableObjectives = goals.filter(g => g.strategic_level === 'objective' && g.status === 'active')
  
  const [goal, setGoal] = useState<Goal>({
    title: '',
    description: '',
    type: 'smart',
    category: '',
    priority: 'medium',
    targetValue: null,
    unit: '',
    startDate: new Date().toISOString().split('T')[0],
    targetDate: '',
    owner: '',
    parentGoal: parentGoal?.id || null,
    linkedObjective: null,
    keyResults: []
  })

  const [newKeyResult, setNewKeyResult] = useState({
    title: '',
    description: '',
    targetValue: 0,
    unit: ''
  })

  if (!isOpen) return null

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    onSubmit(goal)
    onClose()
  }

  const addKeyResult = () => {
    if (newKeyResult.title && newKeyResult.targetValue > 0) {
      const keyResult: KeyResult = {
        id: Date.now().toString(),
        title: newKeyResult.title,
        description: newKeyResult.description,
        targetValue: newKeyResult.targetValue,
        currentValue: 0,
        unit: newKeyResult.unit
      }
      setGoal(prev => ({
        ...prev,
        keyResults: [...prev.keyResults, keyResult]
      }))
      setNewKeyResult({ title: '', description: '', targetValue: 0, unit: '' })
    }
  }

  const removeKeyResult = (id: string) => {
    setGoal(prev => ({
      ...prev,
      keyResults: prev.keyResults.filter(kr => kr.id !== id)
    }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Choose Goal Type</h3>
              <p className="text-slate-400">Select the type of goal you want to create</p>
            </div>
            
            <div className="space-y-4">
              {goalTypes.map((type) => (
                <div
                  key={type.type}
                  onClick={() => setGoal(prev => ({ ...prev, type: type.type }))}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    goal.type === type.type
                      ? 'border-sky-500 bg-sky-500/20 text-sky-300'
                      : 'border-slate-600 hover:border-slate-500 text-slate-300'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-100">{type.name}</h4>
                      <p className="text-sm text-slate-300 mt-1">{type.description}</p>
                      <p className="text-xs text-slate-400 mt-2">Example: {type.example}</p>
                    </div>
                    {goal.type === type.type && (
                      <CheckCircle className="h-5 w-5 text-sky-500 mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Goal Details</h3>
              <p className="text-slate-400">Provide the basic information about your goal</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Goal Title *
                </label>
                <input
                  type="text"
                  value={goal.title}
                  onChange={(e) => setGoal(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter a clear, specific goal title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={goal.description}
                  onChange={(e) => setGoal(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Describe the goal and its expected impact"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    value={goal.category}
                    onChange={(e) => setGoal(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={goal.priority}
                    onChange={(e) => setGoal(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Link to Strategic Objective</h3>
              <p className="text-slate-400">Connect this goal to a strategic objective for alignment</p>
            </div>
            
            <div className="space-y-4">
              {availableObjectives.length > 0 ? (
                <>
                  <div className="space-y-3">
                    <div 
                      onClick={() => setGoal(prev => ({ ...prev, linkedObjective: null }))}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        goal.linkedObjective === null
                          ? 'border-green-500 bg-green-500/20 text-green-300'
                          : 'border-slate-600 hover:border-slate-500 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                          <Target className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-100">No Objective Link</h4>
                          <p className="text-sm text-slate-400">This goal stands independently</p>
                        </div>
                      </div>
                    </div>
                    
                    {availableObjectives.map((objective) => (
                      <div
                        key={objective.id}
                        onClick={() => setGoal(prev => ({ ...prev, linkedObjective: objective.id }))}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          goal.linkedObjective === objective.id
                            ? 'border-green-500 bg-green-500/20 text-green-300'
                            : 'border-slate-600 hover:border-slate-500 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-green-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-100">{objective.title}</h4>
                            <p className="text-sm text-slate-400 mt-1">{objective.description || 'Strategic objective'}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded">
                                {objective.organizational_level || objective.level}
                              </span>
                              <span className="text-xs text-slate-500">
                                {objective.progress_percentage}% complete
                              </span>
                            </div>
                          </div>
                          {goal.linkedObjective === objective.id && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-slate-300 mb-2">No Objectives Available</h4>
                  <p className="text-slate-500 mb-4">
                    Create strategic objectives first to link your goals for better alignment.
                  </p>
                  <button 
                    onClick={() => {
                      // This would navigate to objectives creation
                      window.open('/objectives/new', '_blank')
                    }}
                    className="text-green-400 hover:text-green-300 text-sm"
                  >
                    Create an Objective →
                  </button>
                </div>
              )}
            </div>
            
            {availableObjectives.length > 0 && (
              <div className="bg-slate-800/30 rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-300 mb-2">💡 Why link to objectives?</h4>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Shows how this goal supports broader strategy</li>
                  <li>• Enables alignment matrix visualization</li>
                  <li>• Helps track objective progress through goals</li>
                </ul>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Measurement & Timeline</h3>
              <p className="text-slate-400">Define how success will be measured</p>
            </div>
            
            <div className="space-y-4">
              {goal.type !== 'objective' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Target Value
                    </label>
                    <input
                      type="number"
                      value={goal.targetValue || ''}
                      onChange={(e) => setGoal(prev => ({ ...prev, targetValue: parseFloat(e.target.value) || null }))}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Unit of Measure
                    </label>
                    <input
                      type="text"
                      value={goal.unit}
                      onChange={(e) => setGoal(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="%, $, users, etc."
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={goal.startDate}
                    onChange={(e) => setGoal(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Target Date *
                  </label>
                  <input
                    type="date"
                    value={goal.targetDate}
                    onChange={(e) => setGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Goal Ownership</h3>
              <p className="text-slate-400">Assign responsibility for this goal</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Goal Owner *
                </label>
                <div className="space-y-2">
                  {mockUsers.map(user => (
                    <div
                      key={user.id}
                      onClick={() => setGoal(prev => ({ ...prev, owner: user.id }))}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        goal.owner === user.id
                          ? 'border-sky-500 bg-sky-50'
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-100">{user.name}</p>
                          <p className="text-sm text-slate-400">{user.role}</p>
                        </div>
                        {goal.owner === user.id && (
                          <CheckCircle className="h-5 w-5 text-sky-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-100 mb-2">
                {goal.type === 'okr' ? 'Key Results' : 'Success Metrics'}
              </h3>
              <p className="text-slate-400">
                {goal.type === 'okr' 
                  ? 'Define measurable outcomes that indicate success'
                  : 'Add specific metrics to track progress'
                }
              </p>
            </div>
            
            <div className="space-y-4">
              {/* Add Key Result Form */}
              <div className="border border-slate-600 rounded-lg p-4">
                <h4 className="font-medium text-slate-100 mb-3">Add New Key Result</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newKeyResult.title}
                    onChange={(e) => setNewKeyResult(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Key result title"
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={newKeyResult.targetValue}
                      onChange={(e) => setNewKeyResult(prev => ({ ...prev, targetValue: parseFloat(e.target.value) || 0 }))}
                      className="px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Target value"
                    />
                    <input
                      type="text"
                      value={newKeyResult.unit}
                      onChange={(e) => setNewKeyResult(prev => ({ ...prev, unit: e.target.value }))}
                      className="px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Unit"
                    />
                  </div>
                  
                  <button
                    onClick={addKeyResult}
                    className="w-full px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                  >
                    Add Key Result
                  </button>
                </div>
              </div>

              {/* Current Key Results */}
              {goal.keyResults.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-100">Current Key Results</h4>
                  {goal.keyResults.map(kr => (
                    <div key={kr.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-100">{kr.title}</p>
                        <p className="text-sm text-slate-400">Target: {kr.targetValue} {kr.unit}</p>
                      </div>
                      <button
                        onClick={() => removeKeyResult(kr.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return goal.type !== ''
      case 2:
        return goal.title.trim() !== '' && goal.category !== ''
      case 3:
        return true // Objective linking is optional
      case 4:
        return goal.targetDate !== ''
      case 5:
        return goal.owner !== ''
      case 6:
        return true // Key results are optional
      default:
        return false
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100">Create New Goal</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-sky-600 border-sky-600 text-white'
                    : 'border-slate-600 text-slate-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 ml-2 ${
                    currentStep > step.id ? 'bg-sky-600' : 'bg-slate-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700/50 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-800/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </button>
          
          {currentStep === steps.length ? (
            <button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Create Goal
              <CheckCircle className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}