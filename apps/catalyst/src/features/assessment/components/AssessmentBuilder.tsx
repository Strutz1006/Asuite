import React, { useState } from 'react'
import { X, Plus, ArrowLeft, ArrowRight, CheckCircle, Users, Target, BarChart3, MessageSquare, TrendingUp, Trash2, Edit, Eye } from 'lucide-react'

interface AssessmentQuestion {
  id: string
  category: string
  question: string
  type: 'scale' | 'yes_no' | 'multiple_choice'
  options?: string[]
  weight: number
  required: boolean
}

interface AssessmentBuilderProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (assessment: any) => void
  editingAssessment?: any
}

const steps = [
  { id: 1, name: 'Basic Details', icon: Target },
  { id: 2, name: 'Questions', icon: MessageSquare },
  { id: 3, name: 'Distribution', icon: Users },
  { id: 4, name: 'Review', icon: CheckCircle },
]

const questionCategories = [
  { id: 'culture', name: 'Organizational Culture', icon: Users, color: 'text-blue-600' },
  { id: 'leadership', name: 'Leadership Support', icon: Target, color: 'text-green-600' },
  { id: 'resources', name: 'Resource Availability', icon: BarChart3, color: 'text-purple-600' },
  { id: 'technical', name: 'Technical Capability', icon: TrendingUp, color: 'text-orange-600' },
  { id: 'communication', name: 'Communication', icon: MessageSquare, color: 'text-pink-600' }
]

const questionTemplates = {
  culture: [
    { question: 'How open is your team to adopting new ways of working?', type: 'scale' },
    { question: 'Does your organization encourage innovation and experimentation?', type: 'yes_no' },
    { question: 'How would you rate the current level of collaboration between departments?', type: 'scale' },
    { question: 'Is there a culture of continuous learning in your organization?', type: 'yes_no' }
  ],
  leadership: [
    { question: 'How committed is senior leadership to this change initiative?', type: 'scale' },
    { question: 'Has leadership clearly communicated the vision for this change?', type: 'yes_no' },
    { question: 'Do leaders actively participate in change initiatives?', type: 'yes_no' },
    { question: 'How would you rate leadership\'s change management experience?', type: 'scale' }
  ],
  resources: [
    { question: 'Are adequate financial resources allocated for this change?', type: 'yes_no' },
    { question: 'How would you rate the availability of skilled personnel?', type: 'scale' },
    { question: 'Is sufficient time allocated for proper change implementation?', type: 'yes_no' },
    { question: 'What is the current workload of your team?', type: 'multiple_choice', options: ['Very Light', 'Light', 'Moderate', 'Heavy', 'Very Heavy'] }
  ],
  technical: [
    { question: 'How would you rate your team\'s technical skills for this change?', type: 'scale' },
    { question: 'Is the current technology infrastructure adequate?', type: 'yes_no' },
    { question: 'Are training programs available for new skills required?', type: 'yes_no' },
    { question: 'How complex do you perceive this technical change to be?', type: 'multiple_choice', options: ['Very Simple', 'Simple', 'Moderate', 'Complex', 'Very Complex'] }
  ],
  communication: [
    { question: 'How effective are current communication channels?', type: 'scale' },
    { question: 'Do employees receive timely updates about changes?', type: 'yes_no' },
    { question: 'Is there a feedback mechanism for change-related concerns?', type: 'yes_no' },
    { question: 'How would you rate the clarity of change communications?', type: 'scale' }
  ]
}

export function AssessmentBuilder({ isOpen, onClose, onSubmit, editingAssessment }: AssessmentBuilderProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [assessment, setAssessment] = useState({
    name: '',
    description: '',
    purpose: '',
    targetGroups: [],
    anonymousResponses: true,
    dueDate: '',
    reminderSchedule: 'weekly',
    questions: [] as AssessmentQuestion[]
  })

  const [newQuestion, setNewQuestion] = useState({
    category: 'culture',
    question: '',
    type: 'scale' as const,
    options: [''],
    weight: 1,
    required: true
  })

  const [showQuestionForm, setShowQuestionForm] = useState(false)

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

  const addQuestionFromTemplate = (category: string, template: any) => {
    const question: AssessmentQuestion = {
      id: Date.now().toString(),
      category,
      question: template.question,
      type: template.type,
      options: template.options || [],
      weight: 1,
      required: true
    }
    setAssessment(prev => ({
      ...prev,
      questions: [...prev.questions, question]
    }))
  }

  const addCustomQuestion = () => {
    if (newQuestion.question.trim()) {
      const question: AssessmentQuestion = {
        id: Date.now().toString(),
        category: newQuestion.category,
        question: newQuestion.question,
        type: newQuestion.type,
        options: newQuestion.type === 'multiple_choice' ? newQuestion.options.filter(o => o.trim()) : [],
        weight: newQuestion.weight,
        required: newQuestion.required
      }
      setAssessment(prev => ({
        ...prev,
        questions: [...prev.questions, question]
      }))
      setNewQuestion({
        category: 'culture',
        question: '',
        type: 'scale',
        options: [''],
        weight: 1,
        required: true
      })
      setShowQuestionForm(false)
    }
  }

  const removeQuestion = (questionId: string) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }))
  }

  const renderBasicDetails = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Assessment Details</h3>
        <p className="text-slate-600">Define the basic information for your readiness assessment</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Assessment Name *
          </label>
          <input
            type="text"
            value={assessment.name}
            onChange={(e) => setAssessment(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Digital Transformation Readiness Assessment"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            value={assessment.description}
            onChange={(e) => setAssessment(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Describe the purpose and scope of this assessment..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Change Initiative Purpose
          </label>
          <textarea
            value={assessment.purpose}
            onChange={(e) => setAssessment(prev => ({ ...prev, purpose: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Briefly describe the change initiative this assessment supports..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={assessment.dueDate}
              onChange={(e) => setAssessment(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Reminder Schedule
            </label>
            <select
              value={assessment.reminderSchedule}
              onChange={(e) => setAssessment(prev => ({ ...prev, reminderSchedule: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="none">No Reminders</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="anonymous"
            checked={assessment.anonymousResponses}
            onChange={(e) => setAssessment(prev => ({ ...prev, anonymousResponses: e.target.checked }))}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="anonymous" className="ml-2 text-sm text-slate-700">
            Allow anonymous responses
          </label>
        </div>
      </div>
    </div>
  )

  const renderQuestions = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Assessment Questions</h3>
        <p className="text-slate-600">Add questions to evaluate change readiness</p>
      </div>

      {/* Question Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {questionCategories.map(category => {
          const Icon = category.icon
          const questionsInCategory = assessment.questions.filter(q => q.category === category.id).length
          
          return (
            <div key={category.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="text-center">
                <Icon className={`h-8 w-8 ${category.color} mx-auto mb-2`} />
                <h4 className="font-medium text-slate-900 mb-1">{category.name}</h4>
                <p className="text-xs text-slate-600 mb-3">{questionsInCategory} questions</p>
                
                <div className="space-y-2">
                  {questionTemplates[category.id as keyof typeof questionTemplates]?.slice(0, 2).map((template, idx) => (
                    <button
                      key={idx}
                      onClick={() => addQuestionFromTemplate(category.id, template)}
                      className="w-full text-xs px-2 py-1 text-purple-700 bg-purple-100 hover:bg-purple-200 rounded transition-colors"
                    >
                      Add: {template.question.substring(0, 30)}...
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Custom Question Form */}
      {showQuestionForm && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h4 className="font-medium text-slate-900 mb-4">Add Custom Question</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                  value={newQuestion.category}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {questionCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                <select
                  value={newQuestion.type}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="scale">1-5 Scale</option>
                  <option value="yes_no">Yes/No</option>
                  <option value="multiple_choice">Multiple Choice</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Question</label>
              <textarea
                value={newQuestion.question}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter your question..."
              />
            </div>
            
            {newQuestion.type === 'multiple_choice' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Options</label>
                {newQuestion.options.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newQuestion.options]
                        newOptions[idx] = e.target.value
                        setNewQuestion(prev => ({ ...prev, options: newOptions }))
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder={`Option ${idx + 1}`}
                    />
                    {idx > 0 && (
                      <button
                        onClick={() => {
                          const newOptions = newQuestion.options.filter((_, i) => i !== idx)
                          setNewQuestion(prev => ({ ...prev, options: newOptions }))
                        }}
                        className="p-2 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setNewQuestion(prev => ({ ...prev, options: [...prev.options, ''] }))}
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  + Add Option
                </button>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="required"
                  checked={newQuestion.required}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, required: e.target.checked }))}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="required" className="ml-2 text-sm text-slate-700">Required</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowQuestionForm(false)}
                  className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={addCustomQuestion}
                  className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Add Question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Question Button */}
      {!showQuestionForm && (
        <button
          onClick={() => setShowQuestionForm(true)}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-slate-600 hover:border-purple-300 hover:text-purple-600 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Custom Question</span>
        </button>
      )}

      {/* Questions List */}
      {assessment.questions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-slate-900">Added Questions ({assessment.questions.length})</h4>
          {assessment.questions.map((question, idx) => {
            const category = questionCategories.find(c => c.id === question.category)
            return (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-purple-600">{category?.name}</span>
                      <span className="text-xs text-slate-500">#{idx + 1}</span>
                      {question.required && <span className="text-xs text-red-600">Required</span>}
                    </div>
                    <p className="text-slate-900 mb-2">{question.question}</p>
                    <p className="text-xs text-slate-500">
                      Type: {question.type === 'scale' ? '1-5 Scale' : question.type === 'yes_no' ? 'Yes/No' : 'Multiple Choice'}
                      {question.options && question.options.length > 0 && ` (${question.options.length} options)`}
                    </p>
                  </div>
                  <button
                    onClick={() => removeQuestion(question.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  const renderDistribution = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Distribution Settings</h3>
        <p className="text-slate-600">Define who will receive this assessment</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Target Groups
          </label>
          <div className="space-y-2">
            {['All Employees', 'Management Team', 'Department Heads', 'Sales Team', 'Engineering Team', 'Customer Support'].map(group => (
              <label key={group} className="flex items-center">
                <input
                  type="checkbox"
                  checked={assessment.targetGroups.includes(group)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAssessment(prev => ({ ...prev, targetGroups: [...prev.targetGroups, group] }))
                    } else {
                      setAssessment(prev => ({ ...prev, targetGroups: prev.targetGroups.filter(g => g !== group) }))
                    }
                  }}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mr-2"
                />
                <span className="text-sm text-slate-700">{group}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderReview = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Review Assessment</h3>
        <p className="text-slate-600">Review your assessment before publishing</p>
      </div>
      
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-slate-900 mb-3">Assessment Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600">Name:</span>
              <span className="ml-2 font-medium">{assessment.name || 'Unnamed Assessment'}</span>
            </div>
            <div>
              <span className="text-slate-600">Questions:</span>
              <span className="ml-2 font-medium">{assessment.questions.length}</span>
            </div>
            <div>
              <span className="text-slate-600">Target Groups:</span>
              <span className="ml-2 font-medium">{assessment.targetGroups.length || 'None selected'}</span>
            </div>
            <div>
              <span className="text-slate-600">Due Date:</span>
              <span className="ml-2 font-medium">{assessment.dueDate || 'Not set'}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-slate-900 mb-3">Questions by Category</h4>
          {questionCategories.map(category => {
            const count = assessment.questions.filter(q => q.category === category.id).length
            if (count === 0) return null
            
            return (
              <div key={category.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                <span className="text-sm text-slate-700">{category.name}</span>
                <span className="text-sm font-medium text-slate-900">{count} questions</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderStep = () => {
    switch (currentStep) {
      case 1: return renderBasicDetails()
      case 2: return renderQuestions()
      case 3: return renderDistribution()
      case 4: return renderReview()
      default: return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return assessment.name.trim() !== ''
      case 2: return assessment.questions.length > 0
      case 3: return assessment.targetGroups.length > 0
      case 4: return true
      default: return false
    }
  }

  const handleSubmit = () => {
    onSubmit(assessment)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              {editingAssessment ? 'Edit Assessment' : 'Create New Assessment'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-purple-600 border-purple-600 text-white'
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
                    currentStep > step.id ? 'bg-purple-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[65vh]">
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
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Create Assessment
              <CheckCircle className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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