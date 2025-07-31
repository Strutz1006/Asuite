import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, Plus, X, Target, TrendingUp, Calendar, Users, AlertCircle, Link, Sparkles, Loader2 } from 'lucide-react'
import { useGoals } from '../hooks/useGoals'
import { useSetupStatus } from '@/hooks/useSetupStatus'
import { supabase } from '@aesyros/supabase'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface KeyResult {
  id: string
  title: string
  description: string
  target_value: string
  current_value: string
  unit: string
  weight: number
}

interface Department {
  id: string
  name: string
}

export default function GoalFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  const { createGoal, updateGoal, getGoal, goals } = useGoals()
  const { organization } = useSetupStatus()
  
  // Detect if we're creating an objective vs a goal based on URL
  const isObjective = window.location.pathname.includes('/objectives')
  const itemType = isObjective ? 'objective' : 'goal'
  const ItemType = isObjective ? 'Objective' : 'Goal'
  
  const [loading, setLoading] = useState(false)
  const [loadingGoal, setLoadingGoal] = useState(isEdit)
  const [departments, setDepartments] = useState<Department[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'company' as 'company' | 'department' | 'team' | 'individual',
    strategic_level: isObjective ? 'objective' : 'goal' as 'vision' | 'mission' | 'objective' | 'goal',
    organizational_level: 'company' as 'company' | 'department' | 'team' | 'individual',
    department_id: '',
    due_date: '',
    owner_id: '',
    category: 'strategic',
    priority: 'medium' as 'high' | 'medium' | 'low',
    parent_id: '',
    framework: isObjective ? 'objective' : 'okr' as 'smart' | 'okr' | 'objective',
    target_value: '',
    unit: '',
  })

  const [keyResults, setKeyResults] = useState<KeyResult[]>([
    { id: '1', title: '', description: '', target_value: '', current_value: '0', unit: '', weight: 1.0 }
  ])

  const [showAIAssist, setShowAIAssist] = useState(false)

  // Fetch departments and users
  useEffect(() => {
    if (organization?.id) {
      fetchOptions()
    }
  }, [organization])

  // Load goal data when editing
  useEffect(() => {
    if (isEdit && id) {
      loadGoalData()
    }
  }, [id, isEdit])

  const loadGoalData = async () => {
    if (!id) return
    
    try {
      setLoadingGoal(true)
      const goal = await getGoal(id)
      
      if (goal) {
        setFormData({
          title: goal.title || '',
          description: goal.description || '',
          level: goal.level || 'company',
          department_id: goal.department_id || '',
          due_date: goal.due_date || '',
          owner_id: goal.owner_id || '',
          category: goal.category || 'strategic',
          priority: goal.priority || 'medium',
          parent_id: goal.parent_id || '',
          framework: goal.framework || 'okr',
          target_value: goal.target_value || '',
          unit: goal.unit || '',
        })

        // Load key results if it's an OKR
        if (goal.framework === 'okr') {
          const { data: keyResultsData } = await supabase
            .from('align_key_results')
            .select('*')
            .eq('objective_id', goal.id)
            .order('created_at')

          if (keyResultsData && keyResultsData.length > 0) {
            setKeyResults(keyResultsData.map(kr => ({
              id: kr.id,
              title: kr.title || '',
              description: kr.description || '',
              target_value: kr.target_value || '',
              current_value: kr.current_value || '0',
              unit: kr.unit || '',
              weight: kr.weight || 1.0
            })))
          }
        }
      }
    } catch (error) {
      console.error('Error loading goal data:', error)
      setErrorMessage('Failed to load goal data. Please refresh the page and try again.')
    } finally {
      setLoadingGoal(false)
    }
  }

  const fetchOptions = async () => {
    try {
      // Fetch departments
      const { data: deptData } = await supabase
        .from('departments')
        .select('id, name')
        .eq('organization_id', organization?.id)
        .order('name')
      
      if (deptData) {
        setDepartments(deptData)
      }

      // Fetch users
      const { data: userData } = await supabase
        .from('users')
        .select('id, full_name, email')
        .eq('organization_id', organization?.id)
        .order('full_name')
      
      if (userData) {
        setUsers(userData)
      }
    } catch (error) {
      console.error('Error fetching options:', error)
      setErrorMessage('Failed to load form options. Some fields may not display correctly.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null) // Clear any previous errors
    
    // Basic form validation
    if (!formData.title.trim()) {
      setErrorMessage('Goal title is required')
      setLoading(false)
      return
    }
    
    if (!formData.due_date) {
      setErrorMessage('Due date is required')
      setLoading(false)
      return
    }
    
    // Validate key results for OKR framework
    if (formData.framework === 'okr') {
      const validKeyResults = keyResults.filter(kr => kr.title.trim())
      if (validKeyResults.length === 0) {
        setErrorMessage('At least one key result is required for OKR goals')
        setLoading(false)
        return
      }
      
      for (const kr of validKeyResults) {
        if (!kr.target_value.trim()) {
          setErrorMessage(`Target value is required for key result: "${kr.title}"`)
          setLoading(false)
          return
        }
      }
    }
    
    try {
      const goalData = {
        title: formData.title,
        description: formData.description,
        level: formData.level,
        department_id: formData.department_id || undefined,
        due_date: formData.due_date,
        owner_id: formData.owner_id || undefined,
        category: formData.category,
        priority: formData.priority,
        parent_id: formData.parent_id || undefined,
        framework: formData.framework,
        target_value: formData.target_value || null,
        unit: formData.unit || null,
        organization_id: organization?.id,
      }

      let goalId: string

      if (isEdit && id) {
        // Update existing goal
        await updateGoal(id, goalData)
        goalId = id
      } else {
        // Create new goal
        const newGoal = await createGoal(goalData)
        goalId = newGoal?.id
      }
      
      // Handle key results for OKR framework
      if (formData.framework === 'okr' && goalId) {
        if (isEdit) {
          // Delete existing key results first
          await supabase
            .from('align_key_results')
            .delete()
            .eq('objective_id', goalId)
        }

        // Insert new/updated key results
        const validKeyResults = keyResults.filter(kr => kr.title.trim())
        
        for (const kr of validKeyResults) {
          await supabase
            .from('align_key_results')
            .insert({
              objective_id: goalId,
              title: kr.title,
              description: kr.description,
              target_value: kr.target_value,
              current_value: kr.current_value || '0',
              unit: kr.unit,
              weight: kr.weight,
              progress_percentage: 0,
              status: 'active'
            })
        }
      }
      
      navigate(isObjective ? '/objectives' : '/goals')
    } catch (error) {
      console.error('Error saving goal:', error)
      
      // Extract meaningful error message
      let message = 'Failed to save goal. Please try again.'
      
      if (error instanceof Error) {
        message = error.message
      } else if (typeof error === 'object' && error !== null) {
        // Handle Supabase errors
        const supabaseError = error as any
        if (supabaseError.message) {
          message = supabaseError.message
        } else if (supabaseError.error?.message) {
          message = supabaseError.error.message
        }
      }
      
      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  const addKeyResult = () => {
    setKeyResults([
      ...keyResults,
      { 
        id: Date.now().toString(), 
        title: '', 
        description: '', 
        target_value: '', 
        current_value: '0', 
        unit: '',
        weight: 1.0
      }
    ])
  }

  const removeKeyResult = (id: string) => {
    setKeyResults(keyResults.filter(kr => kr.id !== id))
  }

  const updateKeyResult = (id: string, field: keyof KeyResult, value: string | number) => {
    setKeyResults(keyResults.map(kr => 
      kr.id === id ? { ...kr, [field]: value } : kr
    ))
  }

  // Get parent goals for dropdown
  const parentGoals = goals.filter(g => g.level === 'company' || g.level === 'department')

  if (loadingGoal) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 text-sky-400 animate-spin" />
            <span className="text-slate-300">Loading goal data...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(isObjective ? '/objectives' : '/goals')}
            className="glass-button p-2 text-slate-300 hover:text-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">
              {isEdit ? `Edit ${ItemType}` : `Create New ${ItemType}`}
            </h1>
            <p className="text-slate-400 mt-1">
              {isEdit 
                ? `Update your strategic ${itemType}` 
                : isObjective 
                  ? 'Define a broad outcome that translates your mission into action'
                  : 'Define a specific SMART target with measurable outcomes'
              }
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowAIAssist(!showAIAssist)}
          className="glass-button text-purple-300 hover:text-purple-200 px-4 py-2 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          AI Assist
        </button>
      </div>

      {/* AI Assistant Panel */}
      {showAIAssist && (
        <div className="glass-card p-6 bg-purple-500/10 border-purple-500/30 animate-slide-up">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">AI Goal Assistant</h3>
              <p className="text-sm text-slate-300 mb-4">
                I can help you create SMART goals, suggest key results, and ensure alignment with your company vision.
              </p>
              <div className="space-y-3">
                <button className="glass-button text-purple-300 hover:text-purple-200 px-3 py-2 text-sm w-full text-left">
                  Generate goal suggestions based on company vision
                </button>
                <button className="glass-button text-purple-300 hover:text-purple-200 px-3 py-2 text-sm w-full text-left">
                  Suggest key results for this goal
                </button>
                <button className="glass-button text-purple-300 hover:text-purple-200 px-3 py-2 text-sm w-full text-left">
                  Check goal alignment and dependencies
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Goal Details */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-sky-400" />
            <h2 className="text-xl font-semibold text-slate-100">Goal Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Goal Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Increase customer satisfaction score to 90%"
                className="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-500"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Make it specific, measurable, and outcome-focused
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the goal, its purpose, and expected impact..."
                rows={4}
                className="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Goal Level *
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                className="glass-input w-full px-4 py-3 text-slate-100"
              >
                <option value="company">Company Goal</option>
                <option value="department">Department Goal</option>
                <option value="team">Team Goal</option>
                <option value="individual">Individual Goal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Department
              </label>
              <select
                value={formData.department_id}
                onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                className="glass-input w-full px-4 py-3 text-slate-100"
                disabled={formData.level === 'company'}
              >
                <option value="">Select department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Framework *
              </label>
              <select
                value={formData.framework}
                onChange={(e) => setFormData({ ...formData, framework: e.target.value as any })}
                className="glass-input w-full px-4 py-3 text-slate-100"
              >
                <option value="okr">OKR (Objectives & Key Results)</option>
                <option value="smart">SMART Goal</option>
                <option value="objective">Simple Objective</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Due Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="glass-input w-full pl-12 pr-4 py-3 text-slate-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Owner
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <select
                  value={formData.owner_id}
                  onChange={(e) => setFormData({ ...formData, owner_id: e.target.value })}
                  className="glass-input w-full pl-12 pr-4 py-3 text-slate-100"
                >
                  <option value="">Unassigned</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.full_name || user.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="glass-input w-full px-4 py-3 text-slate-100"
              >
                <option value="strategic">Strategic</option>
                <option value="operational">Operational</option>
                <option value="financial">Financial</option>
                <option value="customer">Customer</option>
                <option value="learning">Learning & Growth</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'medium', 'high'] as const).map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority })}
                    className={`
                      glass-card py-2 text-sm font-medium capitalize transition-all
                      ${formData.priority === priority
                        ? priority === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/50' :
                          priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                          'bg-green-500/20 text-green-400 border-green-500/50'
                        : 'text-slate-400 hover:bg-slate-800/40'
                      }
                    `}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            {formData.framework === 'smart' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Target Value
                  </label>
                  <input
                    type="text"
                    value={formData.target_value}
                    onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                    placeholder="e.g., 90"
                    className="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g., %, $, users"
                    className="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-500"
                  />
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Parent Goal (Optional)
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <select
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  className="glass-input w-full pl-12 pr-4 py-3 text-slate-100"
                >
                  <option value="">No parent goal</option>
                  {parentGoals.map(goal => (
                    <option key={goal.id} value={goal.id}>{goal.title}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Link this goal to a higher-level objective for better alignment
              </p>
            </div>
          </div>
        </div>

        {/* Key Results (for OKR framework) */}
        {formData.framework === 'okr' && (
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-semibold text-slate-100">Key Results</h2>
              </div>
              <button
                type="button"
                onClick={addKeyResult}
                className="glass-button text-sky-300 hover:text-sky-200 px-4 py-2 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Key Result
              </button>
            </div>

            <div className="glass-card p-4 bg-sky-500/10 border-sky-500/30 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-sky-400 mt-0.5" />
                <div className="text-sm text-slate-300">
                  <p className="font-medium text-sky-300 mb-1">OKR Best Practices</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Keep key results to 3-5 per objective</li>
                    <li>Make them quantifiable and time-bound</li>
                    <li>Aim for 70% achievement (stretch goals)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {keyResults.map((keyResult, index) => (
                <div key={keyResult.id} className="glass-card p-6 bg-slate-800/40">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-slate-100">
                      Key Result {index + 1}
                    </h3>
                    {keyResults.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeKeyResult(keyResult.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={keyResult.title}
                        onChange={(e) => updateKeyResult(keyResult.id, 'title', e.target.value)}
                        placeholder="e.g., Achieve NPS score of 75"
                        className="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-500"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={keyResult.description}
                        onChange={(e) => updateKeyResult(keyResult.id, 'description', e.target.value)}
                        placeholder="How will this be measured and tracked?"
                        rows={2}
                        className="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-500 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Current Value
                      </label>
                      <input
                        type="text"
                        value={keyResult.current_value}
                        onChange={(e) => updateKeyResult(keyResult.id, 'current_value', e.target.value)}
                        placeholder="Starting value"
                        className="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Target Value *
                      </label>
                      <input
                        type="text"
                        value={keyResult.target_value}
                        onChange={(e) => updateKeyResult(keyResult.id, 'target_value', e.target.value)}
                        placeholder="Goal value"
                        className="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Unit
                      </label>
                      <input
                        type="text"
                        value={keyResult.unit}
                        onChange={(e) => updateKeyResult(keyResult.id, 'unit', e.target.value)}
                        placeholder="%, $, users, etc."
                        className="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Weight
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        max="10"
                        step="0.1"
                        value={keyResult.weight}
                        onChange={(e) => updateKeyResult(keyResult.id, 'weight', parseFloat(e.target.value) || 1.0)}
                        placeholder="1.0"
                        className="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-500"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Higher weight = more impact on overall progress
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <Alert className="border-red-500/20 bg-red-500/10 relative">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
              <AlertDescription className="text-red-400 flex-1">
                {errorMessage}
              </AlertDescription>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-red-400 hover:text-red-300 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-sky-500 hover:bg-sky-600 disabled:bg-sky-500/50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEdit ? `Update ${ItemType}` : `Create ${ItemType}`}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(isObjective ? '/objectives' : '/goals')}
              className="glass-button text-slate-300 hover:text-slate-100 px-6 py-3"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}