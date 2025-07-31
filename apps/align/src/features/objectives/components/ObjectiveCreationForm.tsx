import React, { useState } from 'react'
import { X, Save, ArrowLeft, Building2, Users, Calendar, TrendingUp } from 'lucide-react'

interface ObjectiveFormData {
  title: string
  description: string
  organizational_level: 'company' | 'department' | 'team' | 'individual'
  department_id: string
  due_date: string
  owner_id: string
  category: string
  priority: 'high' | 'medium' | 'low'
  parent_id: string
}

interface ObjectiveCreationFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (objective: ObjectiveFormData) => void
}

const categories = [
  'Strategic Growth',
  'Market Expansion', 
  'Operational Excellence',
  'Innovation',
  'Customer Success',
  'Digital Transformation',
  'Financial Performance',
  'Sustainability'
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

export function ObjectiveCreationForm({ isOpen, onClose, onSubmit }: ObjectiveCreationFormProps) {
  const [formData, setFormData] = useState<ObjectiveFormData>({
    title: '',
    description: '',
    organizational_level: 'company',
    department_id: '',
    due_date: '',
    owner_id: '',
    category: 'Strategic Growth',
    priority: 'medium',
    parent_id: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleInputChange = (field: keyof ObjectiveFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-semibold text-slate-100">Create Strategic Objective</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Objective Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Expand into five new markets by end of fiscal year"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              Broad outcome that translates your mission into actionable results
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="Describe the strategic outcome and its importance..."
            />
          </div>

          {/* Organizational Level */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Organizational Ownership
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {organizationalLevels.map((level) => (
                <button
                  key={level.level}
                  type="button"
                  onClick={() => handleInputChange('organizational_level', level.level)}
                  className={`p-3 border-2 rounded-lg text-left transition-all ${
                    formData.organizational_level === level.level
                      ? 'border-green-500 bg-green-500/10 text-green-300'
                      : 'border-slate-600 hover:border-slate-500 text-slate-300'
                  }`}
                >
                  <div className="text-lg mb-1">{level.icon}</div>
                  <div className="font-medium text-sm">{level.name}</div>
                  <div className="text-xs text-slate-500">{level.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Category & Priority */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value as 'high' | 'medium' | 'low')}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Target Completion Date
            </label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => handleInputChange('due_date', e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              Create Objective
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}