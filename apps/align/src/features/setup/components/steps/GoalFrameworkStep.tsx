import { Target, Calendar, Zap, BookOpen } from 'lucide-react'
import { SetupData } from '../SetupWizard'

interface GoalFrameworkStepProps {
  data: SetupData
  updateData: (updates: Partial<SetupData>) => void
}

const frameworks = [
  {
    id: 'okr',
    name: 'OKRs',
    description: 'Objectives and Key Results - Focus on ambitious goals with measurable outcomes',
    benefits: ['Promotes stretch goals', 'Clear measurement', 'Quarterly focus'],
    icon: Zap,
  },
  {
    id: 'smart',
    name: 'SMART Goals',
    description: 'Specific, Measurable, Achievable, Relevant, Time-bound goals',
    benefits: ['Clear criteria', 'Realistic targets', 'Easy to track'],
    icon: Target,
  },
  {
    id: 'hybrid',
    name: 'Hybrid Approach',
    description: 'Combine OKRs for strategic goals with SMART for operational targets',
    benefits: ['Best of both', 'Flexible', 'Comprehensive'],
    icon: BookOpen,
  },
]

const cycles = [
  {
    id: 'monthly',
    name: 'Monthly',
    description: 'Fast-paced environment with rapid iterations',
    icon: '🚀',
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    description: 'Balanced approach for most organizations',
    icon: '⚖️',
  },
  {
    id: 'annually',
    name: 'Annually',
    description: 'Long-term strategic planning focus',
    icon: '🎯',
  },
]

export default function GoalFrameworkStep({ data, updateData }: GoalFrameworkStepProps) {
  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Choose Your Goal Framework</h2>
        <p className="text-slate-400">
          Select how you want to structure and track strategic goals across your organization
        </p>
      </div>

      <div className="space-y-8">
        {/* Goal Framework Selection */}
        <div>
          <h3 className="text-lg font-medium text-slate-200 mb-4">Goal Methodology</h3>
          <div className="space-y-4">
            {frameworks.map((framework) => {
              const Icon = framework.icon
              const isSelected = data.goalFramework === framework.id
              
              return (
                <button
                  key={framework.id}
                  onClick={() => updateData({ goalFramework: framework.id as any })}
                  className={`
                    glass-card p-6 w-full text-left transition-all duration-200
                    ${isSelected
                      ? 'border-sky-500 bg-sky-500/20'
                      : 'hover:bg-slate-800/40'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                      isSelected ? 'bg-sky-500/30' : 'bg-slate-700/50'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        isSelected ? 'text-sky-400' : 'text-slate-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-lg font-semibold mb-1 ${
                        isSelected ? 'text-sky-300' : 'text-slate-100'
                      }`}>
                        {framework.name}
                      </h4>
                      <p className="text-sm text-slate-400 mb-3">
                        {framework.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {framework.benefits.map((benefit) => (
                          <span
                            key={benefit}
                            className={`text-xs px-2 py-1 rounded-full ${
                              isSelected
                                ? 'bg-sky-500/30 text-sky-300'
                                : 'bg-slate-700/50 text-slate-400'
                            }`}
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Planning Cycle Selection */}
        <div>
          <h3 className="text-lg font-medium text-slate-200 mb-4">Planning Cycle</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cycles.map((cycle) => {
              const isSelected = data.planningCycle === cycle.id
              
              return (
                <button
                  key={cycle.id}
                  onClick={() => updateData({ planningCycle: cycle.id as any })}
                  className={`
                    glass-card p-6 text-center transition-all duration-200
                    ${isSelected
                      ? 'border-sky-500 bg-sky-500/20'
                      : 'hover:bg-slate-800/40'
                    }
                  `}
                >
                  <div className="text-3xl mb-3">{cycle.icon}</div>
                  <h4 className={`text-lg font-semibold mb-1 ${
                    isSelected ? 'text-sky-300' : 'text-slate-100'
                  }`}>
                    {cycle.name}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {cycle.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Framework Info */}
        <div className="glass-card p-6 bg-purple-500/10 border-purple-500/30">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-purple-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-purple-300 mb-1">Flexible Configuration</h3>
              <p className="text-sm text-slate-300">
                You can change your goal framework and planning cycle anytime. 
                Align adapts to your organization's evolving needs and maturity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}