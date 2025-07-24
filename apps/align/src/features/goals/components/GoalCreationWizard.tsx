import React, { useState } from 'react'
import { X, Target, Calendar, Users, TrendingUp, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'

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
  { id: 3, name: 'Measurement', icon: Calendar },
  { id: 4, name: 'Ownership', icon: Users },
  { id: 5, name: 'Key Results', icon: CheckCircle },
]

const goalTypes = [
  {
    type: 'smart' as const,
    name: 'SMART Goal',
    description: 'Specific, Measurable, Achievable, Relevant, Time-bound goals',
    example: 'Increase revenue by 25% by Q4 2024'
  },
  {
    type: 'okr' as const,
    name: 'OKR (Objective & Key Results)',
    description: 'High-level objectives with measurable key results',
    example: 'Improve customer satisfaction with 3 measurable outcomes'
  },
  {
    type: 'objective' as const,
    name: 'Strategic Objective',
    description: 'High-level strategic initiatives without specific metrics',
    example: 'Transform digital customer experience'
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
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Choose Goal Type</h3>
              <p className="text-slate-600">Select the type of goal you want to create</p>
            </div>
            
            <div className="space-y-4">
              {goalTypes.map((type) => (
                <div
                  key={type.type}
                  onClick={() => setGoal(prev => ({ ...prev, type: type.type }))}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    goal.type === type.type
                      ? 'border-sky-500 bg-sky-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">{type.name}</h4>
                      <p className="text-sm text-slate-600 mt-1">{type.description}</p>
                      <p className="text-xs text-slate-500 mt-2">Example: {type.example}</p>
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
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Goal Details</h3>
              <p className="text-slate-600">Provide the basic information about your goal</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Goal Title *
                </label>
                <input
                  type="text"
                  value={goal.title}
                  onChange={(e) => setGoal(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter a clear, specific goal title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={goal.description}
                  onChange={(e) => setGoal(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Describe the goal and its expected impact"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    value={goal.category}
                    onChange={(e) => setGoal(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={goal.priority}
                    onChange={(e) => setGoal(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
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
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Measurement & Timeline</h3>
              <p className="text-slate-600">Define how success will be measured</p>
            </div>
            
            <div className="space-y-4">
              {goal.type !== 'objective' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Target Value
                    </label>
                    <input
                      type="number"
                      value={goal.targetValue || ''}
                      onChange={(e) => setGoal(prev => ({ ...prev, targetValue: parseFloat(e.target.value) || null }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Unit of Measure
                    </label>
                    <input
                      type="text"
                      value={goal.unit}
                      onChange={(e) => setGoal(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="%, $, users, etc."
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={goal.startDate}
                    onChange={(e) => setGoal(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Target Date *
                  </label>
                  <input
                    type="date"
                    value={goal.targetDate}
                    onChange={(e) => setGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Goal Ownership</h3>
              <p className="text-slate-600">Assign responsibility for this goal</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
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
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{user.name}</p>
                          <p className="text-sm text-slate-600">{user.role}</p>
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

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {goal.type === 'okr' ? 'Key Results' : 'Success Metrics'}
              </h3>
              <p className="text-slate-600">
                {goal.type === 'okr' 
                  ? 'Define measurable outcomes that indicate success'
                  : 'Add specific metrics to track progress'
                }
              </p>
            </div>
            
            <div className="space-y-4">
              {/* Add Key Result Form */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Add New Key Result</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newKeyResult.title}
                    onChange={(e) => setNewKeyResult(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Key result title"
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={newKeyResult.targetValue}
                      onChange={(e) => setNewKeyResult(prev => ({ ...prev, targetValue: parseFloat(e.target.value) || 0 }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Target value"
                    />
                    <input
                      type="text"
                      value={newKeyResult.unit}
                      onChange={(e) => setNewKeyResult(prev => ({ ...prev, unit: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
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
                  <h4 className="font-medium text-slate-900">Current Key Results</h4>
                  {goal.keyResults.map(kr => (
                    <div key={kr.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{kr.title}</p>
                        <p className="text-sm text-slate-600">Target: {kr.targetValue} {kr.unit}</p>
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
        return goal.targetDate !== ''
      case 4:
        return goal.owner !== ''
      case 5:
        return true // Key results are optional
      default:
        return false
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Create New Goal</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
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
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 ml-2 ${
                    currentStep > step.id ? 'bg-sky-600' : 'bg-gray-300'
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
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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