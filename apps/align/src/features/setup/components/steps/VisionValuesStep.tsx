import { Eye, Target, Plus, X, Sparkles } from 'lucide-react'
import { SetupData } from '../SetupWizard'
import { useState } from 'react'

interface VisionValuesStepProps {
  data: SetupData
  updateData: (updates: Partial<SetupData>) => void
}

const sampleValues = [
  'Innovation',
  'Integrity',
  'Customer Focus',
  'Excellence',
  'Teamwork',
  'Transparency',
  'Accountability',
  'Sustainability',
]

export default function VisionValuesStep({ data, updateData }: VisionValuesStepProps) {
  const [newValue, setNewValue] = useState('')

  const addValue = () => {
    if (newValue.trim() && !data.values.includes(newValue.trim())) {
      updateData({ values: [...data.values, newValue.trim()] })
      setNewValue('')
    }
  }

  const removeValue = (value: string) => {
    updateData({ values: data.values.filter(v => v !== value) })
  }

  const addSampleValue = (value: string) => {
    if (!data.values.includes(value)) {
      updateData({ values: [...data.values, value] })
    }
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Define Your North Star</h2>
        <p className="text-slate-400">
          Your vision, mission, and values will guide all strategic goals in Align
        </p>
      </div>

      <div className="space-y-6">
        {/* Vision Statement */}
        <div>
          <label htmlFor="vision" className="block text-sm font-medium text-slate-300 mb-2">
            Vision Statement
          </label>
          <div className="relative">
            <Eye className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <textarea
              id="vision"
              value={data.vision}
              onChange={(e) => updateData({ vision: e.target.value })}
              placeholder="Where do you see your company in the future? (e.g., 'To be the world's most customer-centric company')"
              rows={3}
              className="glass-input w-full pl-12 pr-4 py-3 text-slate-100 placeholder-slate-500 resize-none"
            />
          </div>
        </div>

        {/* Mission Statement */}
        <div>
          <label htmlFor="mission" className="block text-sm font-medium text-slate-300 mb-2">
            Mission Statement
          </label>
          <div className="relative">
            <Target className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <textarea
              id="mission"
              value={data.mission}
              onChange={(e) => updateData({ mission: e.target.value })}
              placeholder="What is your company's purpose? (e.g., 'To empower every person and organization to achieve more')"
              rows={3}
              className="glass-input w-full pl-12 pr-4 py-3 text-slate-100 placeholder-slate-500 resize-none"
            />
          </div>
        </div>

        {/* Core Values */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Core Values
          </label>
          
          {/* Add Value Input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addValue()}
              placeholder="Add a core value"
              className="glass-input flex-1 px-4 py-3 text-slate-100 placeholder-slate-500"
            />
            <button
              onClick={addValue}
              className="glass-button text-sky-300 hover:text-sky-200 px-4 py-3"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Current Values */}
          {data.values.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {data.values.map((value) => (
                <div
                  key={value}
                  className="glass-card px-4 py-2 flex items-center gap-2 bg-sky-500/20 border-sky-500/50"
                >
                  <span className="text-sky-300">{value}</span>
                  <button
                    onClick={() => removeValue(value)}
                    className="text-sky-400 hover:text-sky-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Sample Values */}
          <div>
            <p className="text-xs text-slate-500 mb-2">Quick add:</p>
            <div className="flex flex-wrap gap-2">
              {sampleValues.map((value) => (
                <button
                  key={value}
                  onClick={() => addSampleValue(value)}
                  disabled={data.values.includes(value)}
                  className={`
                    glass-card px-3 py-1 text-sm transition-all duration-200
                    ${data.values.includes(value)
                      ? 'opacity-50 cursor-not-allowed text-slate-500'
                      : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-300'
                    }
                  `}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Assistant Hint */}
        <div className="glass-card p-6 bg-purple-500/10 border-purple-500/30">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-purple-300 mb-1">AI Assistant Available</h3>
              <p className="text-sm text-slate-300">
                Once setup is complete, our AI coach can help refine your vision and values, 
                and suggest strategic goals aligned with your mission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}