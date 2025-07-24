import { useState } from 'react'
import { 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  Target, 
  CheckCircle2, 
  Clock,
  Lightbulb,
  Zap,
  Heart,
  Trophy,
  Plus,
  Settings,
  BookOpen
} from 'lucide-react'
import ChangeModelSelector, { ChangeModel } from './ChangeModelSelector'

export interface ChangeJourney {
  id: string
  name: string
  type: 'technology' | 'process' | 'organizational' | 'cultural' | 'digital'
  description: string
  changeModel?: ChangeModel
  phases: Phase[]
  timeline: number // weeks
  stakeholders: string[]
  objectives: string[]
  successCriteria: string[]
  riskLevel: 'low' | 'medium' | 'high'
  status: 'draft' | 'planning' | 'active' | 'completed'
}

export interface Phase {
  id: string
  name: string
  description: string
  duration: number // weeks
  objectives: string[]
  activities: Activity[]
  milestones: string[]
  icon: string
}

export interface Activity {
  id: string
  name: string
  description: string
  duration: number // days
  assignee: string
  dependencies: string[]
  status: 'pending' | 'in-progress' | 'completed'
}

const changeTypes = [
  { type: 'technology', label: 'Technology Rollout', icon: Zap, color: 'bg-blue-500', description: 'System implementations, software deployments' },
  { type: 'process', label: 'Process Transformation', icon: Settings, color: 'bg-green-500', description: 'Workflow changes, operational improvements' },
  { type: 'organizational', label: 'Organizational Restructuring', icon: Users, color: 'bg-purple-500', description: 'Team restructures, role changes' },
  { type: 'cultural', label: 'Cultural Shift', icon: Heart, color: 'bg-pink-500', description: 'Values alignment, behavior changes' },
  { type: 'digital', label: 'Digital Transformation', icon: Lightbulb, color: 'bg-orange-500', description: 'Comprehensive digital adoption' },
]

const predefinedPhases = {
  awareness: { name: 'Awareness', icon: '👁️', description: 'Build awareness and understanding' },
  understanding: { name: 'Understanding', icon: '🧠', description: 'Deepen knowledge and buy-in' },
  adoption: { name: 'Adoption', icon: '🚀', description: 'Begin implementation and usage' },
  commitment: { name: 'Commitment', icon: '💪', description: 'Full implementation and integration' },
  institutionalization: { name: 'Institutionalization', icon: '🏛️', description: 'Embed in culture and processes' },
}

export default function JourneyBuilder() {
  const [currentStep, setCurrentStep] = useState(1)
  const [journeyData, setJourneyData] = useState<Partial<ChangeJourney>>({
    phases: [],
    stakeholders: [],
    objectives: [],
    successCriteria: []
  })

  const steps = [
    { id: 1, name: 'Journey Setup', icon: MapPin },
    { id: 2, name: 'Change Model', icon: BookOpen },
    { id: 3, name: 'Change Type', icon: Zap },
    { id: 4, name: 'Phase Design', icon: Calendar },
    { id: 5, name: 'Stakeholders', icon: Users },
    { id: 6, name: 'Success Criteria', icon: Target },
    { id: 7, name: 'Review & Launch', icon: Trophy },
  ]

  const updateJourneyData = (updates: Partial<ChangeJourney>) => {
    setJourneyData(prev => ({ ...prev, ...updates }))
  }

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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <MapPin className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-100 mb-2">Journey Setup</h2>
              <p className="text-slate-400">Define the basic information for your change journey</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Journey Name
                </label>
                <input
                  type="text"
                  className="glass-input w-full"
                  placeholder="e.g., CRM System Implementation"
                  value={journeyData.name || ''}
                  onChange={(e) => updateJourneyData({ name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  className="glass-input w-full h-24 resize-none"
                  placeholder="Describe the change initiative and its purpose..."
                  value={journeyData.description || ''}
                  onChange={(e) => updateJourneyData({ description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Timeline (weeks)
                  </label>
                  <input
                    type="number"
                    className="glass-input w-full"
                    placeholder="12"
                    value={journeyData.timeline || ''}
                    onChange={(e) => updateJourneyData({ timeline: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Risk Level
                  </label>
                  <select
                    className="glass-input w-full"
                    value={journeyData.riskLevel || ''}
                    onChange={(e) => updateJourneyData({ riskLevel: e.target.value as any })}
                  >
                    <option value="">Select risk level</option>
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Risk</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <ChangeModelSelector 
              selectedModel={journeyData.changeModel}
              onSelectModel={(model) => updateJourneyData({ changeModel: model })}
            />
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Zap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-100 mb-2">Change Type</h2>
              <p className="text-slate-400">Select the type of change you're implementing</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {changeTypes.map((type) => (
                <div
                  key={type.type}
                  className={`glass-card p-6 cursor-pointer transition-all hover:scale-105 ${
                    journeyData.type === type.type 
                      ? 'ring-2 ring-purple-500 bg-purple-500/20' 
                      : 'hover:bg-slate-800/40'
                  }`}
                  onClick={() => updateJourneyData({ type: type.type as any })}
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 ${type.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <type.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-100 mb-2">{type.label}</h3>
                    <p className="text-sm text-slate-400">{type.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Calendar className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-100 mb-2">Phase Design</h2>
              <p className="text-slate-400">
                {journeyData.changeModel 
                  ? `Review and customize the ${journeyData.changeModel.phases.length} phases from ${journeyData.changeModel.name}`
                  : 'Design the phases of your change journey'}
              </p>
            </div>

            {journeyData.changeModel ? (
              <>
                <div className="glass-card p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold text-slate-100">{journeyData.changeModel.name} Phases</h3>
                  </div>
                  <div className="space-y-4">
                    {journeyData.changeModel.phases.map((phase, index) => (
                      <div key={phase.id} className="glass-card p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-200 mb-2">{phase.name}</h4>
                            <p className="text-sm text-slate-400 mb-3">{phase.description}</p>
                            
                            <div className="space-y-3">
                              <div>
                                <h5 className="text-xs font-medium text-slate-300 mb-1">Key Activities:</h5>
                                <ul className="text-xs text-slate-400 space-y-1">
                                  {phase.keyActivities.slice(0, 3).map((activity, idx) => (
                                    <li key={idx} className="flex items-start">
                                      <span className="text-purple-400 mr-2">•</span>
                                      {activity}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="text-xs font-medium text-slate-300 mb-1">Expected Outcomes:</h5>
                                <ul className="text-xs text-slate-400 space-y-1">
                                  {phase.outcomes.map((outcome, idx) => (
                                    <li key={idx} className="flex items-start">
                                      <CheckCircle2 className="w-3 h-3 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                                      {outcome}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-semibold text-slate-100 mb-4">Phase Timeline</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Allocate time for each phase based on your {journeyData.timeline || 12} week timeline
                  </p>
                  <div className="space-y-3">
                    {journeyData.changeModel.phases.map((phase) => (
                      <div key={phase.id} className="flex items-center gap-4">
                        <span className="text-sm text-slate-300 w-1/3">{phase.name}</span>
                        <input
                          type="number"
                          className="glass-input flex-1"
                          placeholder="Weeks"
                          min="1"
                          max={journeyData.timeline || 12}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="glass-card p-6 mb-6">
                  <h3 className="font-semibold text-slate-100 mb-4">Recommended Phases</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {Object.entries(predefinedPhases).map(([key, phase]) => (
                      <div
                        key={key}
                        className="glass-card p-4 text-center cursor-pointer hover:bg-slate-800/40 transition-colors"
                      >
                        <div className="text-2xl mb-2">{phase.icon}</div>
                        <h4 className="font-medium text-slate-200 text-sm mb-1">{phase.name}</h4>
                        <p className="text-xs text-slate-400">{phase.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-100">Custom Phases</h3>
                    <button className="glass-button px-4 py-2 text-purple-400 hover:text-purple-300">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Phase
                    </button>
                  </div>
                  
                  <div className="text-center py-8 text-slate-500">
                    <Clock className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p>No custom phases added yet</p>
                    <p className="text-sm">Use recommended phases or create your own</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-100 mb-2">Stakeholders</h2>
              <p className="text-slate-400">Identify key stakeholders for this change</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="font-semibold text-slate-100 mb-4">Add Stakeholders</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    className="glass-input w-full"
                    placeholder="Stakeholder name or role"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <select className="glass-input">
                      <option>Influence Level</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                    <select className="glass-input">
                      <option>Interest Level</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                  <button className="glass-button w-full px-4 py-2 text-purple-400">
                    Add Stakeholder
                  </button>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-semibold text-slate-100 mb-4">Stakeholder Map</h3>
                <div className="aspect-square border border-slate-700 rounded-lg p-4 relative">
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-4">
                    <div className="border border-slate-600 rounded p-2">
                      <div className="text-xs text-slate-400 mb-1">High Interest</div>
                      <div className="text-xs text-slate-400">High Influence</div>
                      <div className="text-xs text-purple-400 mt-2">Manage Closely</div>
                    </div>
                    <div className="border border-slate-600 rounded p-2">
                      <div className="text-xs text-slate-400 mb-1">High Interest</div>
                      <div className="text-xs text-slate-400">Low Influence</div>
                      <div className="text-xs text-purple-400 mt-2">Keep Informed</div>
                    </div>
                    <div className="border border-slate-600 rounded p-2">
                      <div className="text-xs text-slate-400 mb-1">Low Interest</div>
                      <div className="text-xs text-slate-400">High Influence</div>
                      <div className="text-xs text-purple-400 mt-2">Keep Satisfied</div>
                    </div>
                    <div className="border border-slate-600 rounded p-2">
                      <div className="text-xs text-slate-400 mb-1">Low Interest</div>
                      <div className="text-xs text-slate-400">Low Influence</div>
                      <div className="text-xs text-purple-400 mt-2">Monitor</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Target className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-100 mb-2">Success Criteria</h2>
              <p className="text-slate-400">Define how you'll measure success</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="font-semibold text-slate-100 mb-4">Objectives</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    className="glass-input w-full"
                    placeholder="Add objective..."
                  />
                  <button className="glass-button px-4 py-2 text-purple-400">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Objective
                  </button>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-semibold text-slate-100 mb-4">Success Metrics</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    className="glass-input w-full"
                    placeholder="Add success metric..."
                  />
                  <button className="glass-button px-4 py-2 text-purple-400">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Metric
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-semibold text-slate-100 mb-4">Key Performance Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border border-slate-700 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400 mb-1">85%</div>
                  <div className="text-sm text-slate-400">Adoption Rate Target</div>
                </div>
                <div className="text-center p-4 border border-slate-700 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400 mb-1">12</div>
                  <div className="text-sm text-slate-400">Weeks Timeline</div>
                </div>
                <div className="text-center p-4 border border-slate-700 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400 mb-1">90%</div>
                  <div className="text-sm text-slate-400">Satisfaction Score</div>
                </div>
              </div>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Trophy className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-100 mb-2">Review & Launch</h2>
              <p className="text-slate-400">Review your change journey and launch</p>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-semibold text-slate-100 mb-4">Journey Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-slate-400">Name:</span>
                    <span className="text-slate-200 ml-2">{journeyData.name || 'Untitled Journey'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Change Model:</span>
                    <span className="text-slate-200 ml-2">{journeyData.changeModel?.name || 'Not selected'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Type:</span>
                    <span className="text-slate-200 ml-2">{journeyData.type || 'Not selected'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Timeline:</span>
                    <span className="text-slate-200 ml-2">{journeyData.timeline || 0} weeks</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Risk Level:</span>
                    <span className="text-slate-200 ml-2">{journeyData.riskLevel || 'Not set'}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-slate-400">Phases:</span>
                    <span className="text-slate-200 ml-2">{journeyData.phases?.length || 0} configured</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Stakeholders:</span>
                    <span className="text-slate-200 ml-2">{journeyData.stakeholders?.length || 0} identified</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Status:</span>
                    <span className="text-slate-200 ml-2">Ready to launch</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="glass-button flex-1 px-6 py-3 text-slate-400 hover:text-slate-300">
                Save as Draft
              </button>
              <button className="glass-button flex-1 px-6 py-3 text-purple-400 hover:text-purple-300 bg-purple-500/20">
                Launch Journey
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-slate-100">Change Journey Builder</h1>
            <div className="text-sm text-slate-400">
              Step {currentStep} of {steps.length}
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all
                  ${currentStep >= step.id 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-slate-700 text-slate-400'
                  }`}>
                  {currentStep > step.id ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-slate-200' : 'text-slate-500'
                  }`}>
                    {step.name}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-purple-500' : 'bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="glass-card p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="glass-button px-6 py-3 text-slate-400 hover:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          <button
            onClick={nextStep}
            disabled={currentStep === steps.length}
            className="glass-button px-6 py-3 text-purple-400 hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}