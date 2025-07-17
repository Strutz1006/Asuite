import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, Plus, X } from 'lucide-react'

interface KeyResult {
  id: string
  title: string
  target: string
  current: string
  unit: string
}

export default function GoalFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    owner: '',
    category: 'strategic',
    priority: 'medium',
  })

  const [keyResults, setKeyResults] = useState<KeyResult[]>([
    { id: '1', title: '', target: '', current: '', unit: '' }
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save to your backend
    console.log('Saving goal:', { ...formData, keyResults })
    navigate('/goals')
  }

  const addKeyResult = () => {
    setKeyResults([
      ...keyResults,
      { id: Date.now().toString(), title: '', target: '', current: '', unit: '' }
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
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
            {isEdit ? 'Update your strategic goal' : 'Define a new strategic goal with key results'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Goal Details */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-6">Goal Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Goal Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter goal title"
                className="glass-input w-full px-4 py-2 text-slate-100 placeholder-slate-400"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the goal and its objectives"
                rows={4}
                className="glass-input w-full px-4 py-2 text-slate-100 placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="glass-input w-full px-4 py-2 text-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Owner
              </label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                placeholder="Goal owner"
                className="glass-input w-full px-4 py-2 text-slate-100 placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="glass-input w-full px-4 py-2 text-slate-100"
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
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="glass-input w-full px-4 py-2 text-slate-100"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Results */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-100">Key Results</h2>
            <button
              type="button"
              onClick={addKeyResult}
              className="glass-button text-sky-300 hover:text-sky-200 px-4 py-2 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Key Result
            </button>
          </div>

          <div className="space-y-4">
            {keyResults.map((keyResult, index) => (
              <div key={keyResult.id} className="glass-card p-4 bg-slate-800/40">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={keyResult.title}
                      onChange={(e) => updateKeyResult(keyResult.id, 'title', e.target.value)}
                      placeholder="Key result title"
                      className="glass-input w-full px-3 py-2 text-slate-100 placeholder-slate-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Target Value *
                    </label>
                    <input
                      type="text"
                      value={keyResult.target}
                      onChange={(e) => updateKeyResult(keyResult.id, 'target', e.target.value)}
                      placeholder="Target"
                      className="glass-input w-full px-3 py-2 text-slate-100 placeholder-slate-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Current Value
                    </label>
                    <input
                      type="text"
                      value={keyResult.current}
                      onChange={(e) => updateKeyResult(keyResult.id, 'current', e.target.value)}
                      placeholder="Current"
                      className="glass-input w-full px-3 py-2 text-slate-100 placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="glass-button bg-sky-500/20 text-sky-300 hover:text-sky-200 px-6 py-2 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isEdit ? 'Update Goal' : 'Create Goal'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/goals')}
            className="glass-button text-slate-300 hover:text-slate-100 px-6 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}