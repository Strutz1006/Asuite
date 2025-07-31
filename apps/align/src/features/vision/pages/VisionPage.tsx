import { Mountain, Edit, Save, X, Plus, Trash2, Heart } from 'lucide-react'
import { useState } from 'react'

interface CoreValue {
  id: string
  title: string
  description: string
}

export default function VisionPage() {
  const [isEditingVision, setIsEditingVision] = useState(false)
  const [isEditingValues, setIsEditingValues] = useState(false)
  const [visionText, setVisionText] = useState('To create a world where every home is powered by clean energy')
  const [coreValues, setCoreValues] = useState<CoreValue[]>([
    {
      id: '1',
      title: 'Innovation',
      description: 'We continuously push boundaries to create breakthrough solutions'
    },
    {
      id: '2', 
      title: 'Sustainability',
      description: 'We prioritize long-term environmental and social impact in everything we do'
    },
    {
      id: '3',
      title: 'Integrity',
      description: 'We act with honesty, transparency, and ethical responsibility'
    }
  ])
  const [newValue, setNewValue] = useState({ title: '', description: '' })

  const handleSaveVision = () => {
    // TODO: Save vision to database
    setIsEditingVision(false)
  }

  const handleCancelVision = () => {
    // TODO: Reset to original value
    setIsEditingVision(false)
  }

  const handleSaveValues = () => {
    // TODO: Save values to database
    setIsEditingValues(false)
  }

  const handleCancelValues = () => {
    // TODO: Reset to original values
    setIsEditingValues(false)
  }

  const addValue = () => {
    if (newValue.title && newValue.description) {
      setCoreValues([...coreValues, {
        id: Date.now().toString(),
        title: newValue.title,
        description: newValue.description
      }])
      setNewValue({ title: '', description: '' })
    }
  }

  const removeValue = (id: string) => {
    setCoreValues(coreValues.filter(value => value.id !== id))
  }

  const updateValue = (id: string, field: 'title' | 'description', value: string) => {
    setCoreValues(coreValues.map(val => 
      val.id === id ? { ...val, [field]: value } : val
    ))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <Mountain className="w-8 h-8 text-purple-400" />
            Vision & Values
          </h1>
          <p className="text-slate-400 mt-1">
            Define your aspirational future and the core principles that guide your journey
          </p>
        </div>
      </div>

      {/* Vision Section */}
      <div className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Mountain className="w-6 h-6 text-purple-400" />
            Vision Statement
          </h2>
          {!isEditingVision && (
            <button
              onClick={() => setIsEditingVision(true)}
              className="glass-button text-purple-300 hover:text-purple-200 px-4 py-2 flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        {isEditingVision ? (
          <div className="space-y-6">
            <textarea
              value={visionText}
              onChange={(e) => setVisionText(e.target.value)}
              className="w-full h-32 px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-center text-lg"
              placeholder="Enter your organization's vision statement..."
            />
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleSaveVision}
                className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Vision
              </button>
              <button
                onClick={handleCancelVision}
                className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="max-w-4xl mx-auto">
              <blockquote className="text-2xl md:text-3xl font-light text-slate-100 leading-relaxed">
                "{visionText}"
              </blockquote>
            </div>
            <div className="text-slate-400 text-sm">
              Your aspirational future state and ultimate impact
            </div>
          </div>
        )}
      </div>

      {/* Core Values Section */}
      <div className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Heart className="w-6 h-6 text-purple-400" />
            Core Values
          </h2>
          {!isEditingValues && (
            <button
              onClick={() => setIsEditingValues(true)}
              className="glass-button text-purple-300 hover:text-purple-200 px-4 py-2 flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Values
            </button>
          )}
        </div>

        {isEditingValues ? (
          <div className="space-y-6">
            {/* Existing Values - Editable */}
            <div className="space-y-4">
              {coreValues.map((value) => (
                <div key={value.id} className="p-4 bg-slate-800/30 rounded-lg border border-slate-600">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={value.title}
                        onChange={(e) => updateValue(value.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium"
                        placeholder="Value name"
                      />
                      <textarea
                        value={value.description}
                        onChange={(e) => updateValue(value.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        placeholder="Describe what this value means in practice"
                      />
                    </div>
                    <button
                      onClick={() => removeValue(value.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Value */}
            <div className="p-4 bg-slate-700/30 rounded-lg border-2 border-dashed border-slate-600">
              <div className="space-y-3">
                <input
                  type="text"
                  value={newValue.title}
                  onChange={(e) => setNewValue({...newValue, title: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium"
                  placeholder="New value name"
                />
                <textarea
                  value={newValue.description}
                  onChange={(e) => setNewValue({...newValue, description: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Describe what this value means in practice"
                />
                <button
                  onClick={addValue}
                  disabled={!newValue.title || !newValue.description}
                  className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Value
                </button>
              </div>
            </div>

            {/* Save/Cancel Actions */}
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-700/50">
              <button
                onClick={handleSaveValues}
                className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Values
              </button>
              <button
                onClick={handleCancelValues}
                className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value) => (
              <div key={value.id} className="p-6 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <h3 className="text-lg font-semibold text-purple-300 mb-3">{value.title}</h3>
                <p className="text-slate-300 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        )}

        {!isEditingValues && (
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Core values define the fundamental beliefs and principles that guide your organization's behavior and decisions
            </p>
          </div>
        )}
      </div>

      {/* Guidelines */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Mountain className="w-5 h-5 text-purple-400" />
            Great Vision Traits
          </h3>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <span><strong>Aspirational:</strong> Inspiring future state</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <span><strong>Long-term:</strong> 5-10 year horizon</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <span><strong>Memorable:</strong> Easy to communicate</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <span><strong>Impactful:</strong> Describes ultimate impact</span>
            </li>
          </ul>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-400" />
            Effective Values
          </h3>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <span><strong>Authentic:</strong> Reflect real beliefs</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <span><strong>Actionable:</strong> Guide daily decisions</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <span><strong>Distinctive:</strong> Set you apart</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <span><strong>Lived:</strong> Embedded in culture</span>
            </li>
          </ul>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">How They Connect</h3>
          <div className="space-y-4 text-slate-300 text-sm">
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="font-medium text-purple-300 mb-2">Vision</div>
              <div>Describes <em>where</em> you're going</div>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="font-medium text-purple-300 mb-2">Values</div>
              <div>Define <em>how</em> you'll get there</div>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg border border-purple-500/30">
              <div className="font-medium text-purple-300 mb-2">Together</div>
              <div>Create a unified foundation for all strategic decisions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}