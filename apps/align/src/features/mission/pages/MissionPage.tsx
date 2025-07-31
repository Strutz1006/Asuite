import { Compass, Edit, Save, X } from 'lucide-react'
import { useState } from 'react'

export default function MissionPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [missionText, setMissionText] = useState('To deliver affordable solar energy solutions to underserved communities globally')

  const handleSave = () => {
    // TODO: Save to database
    setIsEditing(false)
  }

  const handleCancel = () => {
    // TODO: Reset to original value
    setIsEditing(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <Compass className="w-8 h-8 text-blue-400" />
            Mission Statement
          </h1>
          <p className="text-slate-400 mt-1">
            Define what your organization does, who it serves, and how it operates
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="glass-button text-blue-300 hover:text-blue-200 px-4 py-2 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Mission
          </button>
        )}
      </div>

      {/* Mission Content */}
      <div className="glass-card p-8 text-center">
        {isEditing ? (
          <div className="space-y-6">
            <textarea
              value={missionText}
              onChange={(e) => setMissionText(e.target.value)}
              className="w-full h-32 px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-center text-lg"
              placeholder="Enter your organization's mission statement..."
            />
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Mission
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <blockquote className="text-2xl md:text-3xl font-light text-slate-100 leading-relaxed">
                "{missionText}"
              </blockquote>
            </div>
            <div className="text-slate-400 text-sm">
              Mission statements define your organization's purpose and approach
            </div>
          </div>
        )}
      </div>

      {/* Mission Framework */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-blue-400">What</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-100 mb-2">What We Do</h3>
          <p className="text-slate-400 text-sm">
            The products, services, or solutions your organization provides
          </p>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-blue-400">Who</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Who We Serve</h3>
          <p className="text-slate-400 text-sm">
            Your target customers, beneficiaries, or stakeholders
          </p>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-blue-400">How</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-100 mb-2">How We Do It</h3>
          <p className="text-slate-400 text-sm">
            Your unique approach, values, or differentiating factors
          </p>
        </div>
      </div>

      {/* Mission Examples */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Examples of Strong Mission Statements</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800/30 rounded-lg">
            <div className="font-medium text-slate-200 mb-2">Spotify</div>
            <div className="text-sm text-slate-400 mb-2">"To unlock the potential of human creativity by giving a million creative artists the opportunity to live off their art and billions of fans the opportunity to enjoy and be inspired by it."</div>
            <div className="text-xs text-blue-400">✓ Clear what, who, and how</div>
          </div>
          <div className="p-4 bg-slate-800/30 rounded-lg">
            <div className="font-medium text-slate-200 mb-2">Warby Parker</div>
            <div className="text-sm text-slate-400 mb-2">"To offer designer eyewear at a revolutionary price, while leading the way for socially conscious businesses."</div>
            <div className="text-xs text-blue-400">✓ Product + values-driven approach</div>
          </div>
          <div className="p-4 bg-slate-800/30 rounded-lg">
            <div className="font-medium text-slate-200 mb-2">Patagonia</div>
            <div className="text-sm text-slate-400 mb-2">"Build the best product, cause no unnecessary harm, use business to inspire and implement solutions to the environmental crisis."</div>
            <div className="text-xs text-blue-400">✓ Product quality + environmental purpose</div>
          </div>
          <div className="p-4 bg-slate-800/30 rounded-lg">
            <div className="font-medium text-slate-200 mb-2">Airbnb</div>
            <div className="text-sm text-slate-400 mb-2">"To create a world where anyone can belong anywhere, providing healthy travel that is local, authentic, diverse, inclusive and sustainable."</div>
            <div className="text-xs text-blue-400">✓ Community-focused with values</div>
          </div>
        </div>
      </div>
    </div>
  )
}