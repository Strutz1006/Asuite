import { Building2, Eye, Users, Target, CheckCircle, Sparkles } from 'lucide-react'
import { SetupData } from '../SetupWizard'

interface ReviewStepProps {
  data: SetupData
}

export default function ReviewStep({ data }: ReviewStepProps) {
  const getFrameworkName = (framework: string) => {
    switch (framework) {
      case 'okr': return 'OKRs'
      case 'smart': return 'SMART Goals'
      case 'hybrid': return 'Hybrid Approach'
      default: return framework
    }
  }

  const getCycleName = (cycle: string) => {
    return cycle.charAt(0).toUpperCase() + cycle.slice(1)
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Ready to Launch!</h2>
        <p className="text-slate-400">
          Review your configuration and start aligning your organization
        </p>
      </div>

      <div className="space-y-6">
        {/* Company Details */}
        <div className="glass-card p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-sky-500/20">
              <Building2 className="w-6 h-6 text-sky-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-100 mb-3">Company Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Company Name</span>
                  <span className="text-sm text-slate-200">{data.companyName || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Industry</span>
                  <span className="text-sm text-slate-200">{data.industry || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Size</span>
                  <span className="text-sm text-slate-200">{data.companySize || 'Not set'} employees</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Values */}
        <div className="glass-card p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Eye className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-100 mb-3">Vision & Values</h3>
              <div className="space-y-3">
                {data.vision && (
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Vision</p>
                    <p className="text-sm text-slate-200">{data.vision}</p>
                  </div>
                )}
                {data.mission && (
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Mission</p>
                    <p className="text-sm text-slate-200">{data.mission}</p>
                  </div>
                )}
                {data.values.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-400 mb-2">Core Values</p>
                    <div className="flex flex-wrap gap-2">
                      {data.values.map((value) => (
                        <span
                          key={value}
                          className="text-xs px-3 py-1 rounded-full bg-purple-500/30 text-purple-300"
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Team Structure */}
        <div className="glass-card p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-green-500/20">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-100 mb-3">Team Structure</h3>
              <p className="text-sm text-slate-400 mb-2">
                {data.departments.length} departments configured
              </p>
              <div className="flex flex-wrap gap-2">
                {data.departments.map((dept) => (
                  <span
                    key={dept}
                    className="text-xs px-3 py-1 rounded-full bg-green-500/30 text-green-300"
                  >
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Goal Framework */}
        <div className="glass-card p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-yellow-500/20">
              <Target className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-100 mb-3">Goal Framework</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Methodology</span>
                  <span className="text-sm text-slate-200">{getFrameworkName(data.goalFramework)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Planning Cycle</span>
                  <span className="text-sm text-slate-200">{getCycleName(data.planningCycle)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="glass-card p-6 bg-gradient-to-r from-sky-500/10 to-purple-500/10 border-sky-500/30">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-sky-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-sky-300 mb-2">What happens next?</h3>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>• Create your first company-wide strategic goal</li>
                <li>• Invite team members and assign them to departments</li>
                <li>• Set up automated progress tracking</li>
                <li>• Explore AI-powered goal recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}