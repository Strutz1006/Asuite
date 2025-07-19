import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, Plus, X, Target, TrendingUp, Calendar, Users, AlertCircle, Link, Sparkles } from 'lucide-react'

interface KeyResult {
  id: string
  title: string
  description: string
  target: string
  current: string
  unit: string
  type: 'number' | 'percentage' | 'currency' | 'boolean'
}

export default function GoalFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'company',
    department: '',
    dueDate: '',
    owner: '',
    category: 'strategic',
    priority: 'medium',
    parentGoal: '',
    framework: 'okr',
  })

  const [keyResults, setKeyResults] = useState<KeyResult[]>([
    { id: '1', title: '', description: '', target: '', current: '', unit: '', type: 'number' }
  ])

  const [showAIAssist, setShowAIAssist] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save to Supabase
    console.log('Saving goal:', { ...formData, keyResults })
    navigate('/goals')
  }

  const addKeyResult = () => {
    setKeyResults([
      ...keyResults,
      { id: Date.now().toString(), title: '', description: '', target: '', current: '', unit: '', type: 'number' }
    ])
  }

  const removeKeyResult = (id: string) => {
    setKeyResults(keyResults.filter(kr => kr.id !== id))
  }

  const updateKeyResult = (id: string, field: keyof KeyResult, value: string) => {
    setKeyResults(keyResults.map(kr => 
      kr.id === id ? { ...kr, [field]: value } : kr
    ))
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/goals')}
            className="glass-button p-2 text-slate-300 hover:text-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">
              {isEdit ? 'Edit Goal' : 'Create New Goal'}
            </h1>
            <p className="text-slate-400 mt-1">
              {isEdit ? 'Update your strategic goal' : 'Define a new strategic goal with measurable outcomes'}
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
                Goal Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="glass-input w-full px-4 py-3 text-slate-100"
              >
                <option value="company">Company Goal</option>
                <option value="department">Department Goal</option>
                <option value="individual">Individual Goal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="glass-input w-full px-4 py-3 text-slate-100"
                disabled={formData.type === 'company'}
              >
                <option value="">Select department</option>
                <option value="engineering">Engineering</option>
                <option value="sales">Sales</option>
                <option value="marketing">Marketing</option>
                <option value="operations">Operations</option>
                <option value="hr">HR</option>
                <option value="finance">Finance</option>
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
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="glass-input w-full pl-12 pr-4 py-3 text-slate-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Owner *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  placeholder="Goal owner or team"
                  className="glass-input w-full pl-12 pr-4 py-3 text-slate-100 placeholder-slate-500"
                  required
                />
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
              <div className="grid grid-cols-4 gap-2">
                {['low', 'medium', 'high', 'critical'].map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority })}
                    className={`
                      glass-card py-2 text-sm font-medium capitalize transition-all
                      ${formData.priority === priority
                        ? priority === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/50' :
                          priority === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' :
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Parent Goal (Optional)
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <select
                  value={formData.parentGoal}
                  onChange={(e) => setFormData({ ...formData, parentGoal: e.target.value })}
                  className="glass-input w-full pl-12 pr-4 py-3 text-slate-100"
                >
                  <option value="">No parent goal</option>
                  <option value="1">Increase Revenue by 25%</option>
                  <option value="2">Improve Customer Satisfaction</option>
                  <option value="3">Expand Market Presence</option>
                </select>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Link this goal to a higher-level objective for better alignment
              </p>
            </div>
          </div>
        </div>

        {/* Key Results */}
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

          {formData.framework === 'okr' && (
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
          )}

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
                      Measurement Type *
                    </label>
                    <select
                      value={keyResult.type}
                      onChange={(e) => updateKeyResult(keyResult.id, 'type', e.target.value)}
                      className="glass-input w-full px-4 py-3 text-slate-100"
                    >
                      <option value="number">Number</option>
                      <option value="percentage">Percentage</option>
                      <option value="currency">Currency</option>
                      <option value="boolean">Yes/No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={keyResult.unit}
                      onChange={(e) => updateKeyResult(keyResult.id, 'unit', e.target.value)}
                      placeholder={keyResult.type === 'percentage' ? '%' : keyResult.type === 'currency' ? '$' : 'units'}
                      className="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Current Value
                    </label>
                    <input
                      type="text"
                      value={keyResult.current}
                      onChange={(e) => updateKeyResult(keyResult.id, 'current', e.target.value)}
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
                      value={keyResult.target}
                      onChange={(e) => updateKeyResult(keyResult.id, 'target', e.target.value)}
                      placeholder="Goal value"
                      className="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-500"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200"
            >
              <Save className="w-4 h-4" />
              {isEdit ? 'Update Goal' : 'Create Goal'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/goals')}
              className="glass-button text-slate-300 hover:text-slate-100 px-6 py-3"
            >
              Cancel
            </button>
          </div>
          
          <button
            type="button"
            className="glass-button text-slate-400 hover:text-slate-300 px-4 py-3"
          >
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  )
}