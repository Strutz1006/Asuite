import { Building2, Globe, Users } from 'lucide-react'
import { SetupData } from '../SetupWizard'

interface CompanyDetailsStepProps {
  data: SetupData
  updateData: (updates: Partial<SetupData>) => void
}

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Education',
  'Government',
  'Non-profit',
  'Other',
]

const companySizes = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1,000 employees' },
  { value: '1000+', label: '1,000+ employees' },
]

export default function CompanyDetailsStep({ data, updateData }: CompanyDetailsStepProps) {
  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Let's get to know your company</h2>
        <p className="text-slate-400">
          Tell us about your organization to personalize your Align experience
        </p>
      </div>

      <div className="space-y-6">
        {/* Company Name */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-slate-300 mb-2">
            Company Name
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              id="companyName"
              value={data.companyName}
              onChange={(e) => updateData({ companyName: e.target.value })}
              placeholder="Enter your company name"
              className="glass-input w-full pl-12 pr-4 py-3 text-slate-100 placeholder-slate-500"
            />
          </div>
        </div>

        {/* Industry */}
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-slate-300 mb-2">
            Industry
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <select
              id="industry"
              value={data.industry}
              onChange={(e) => updateData({ industry: e.target.value })}
              className="glass-input w-full pl-12 pr-4 py-3 text-slate-100 appearance-none cursor-pointer"
            >
              <option value="" className="bg-slate-900">Select your industry</option>
              {industries.map((industry) => (
                <option key={industry} value={industry} className="bg-slate-900">
                  {industry}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Company Size */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Company Size
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {companySizes.map((size) => (
              <button
                key={size.value}
                onClick={() => updateData({ companySize: size.value })}
                className={`
                  glass-card p-4 text-center transition-all duration-200
                  ${data.companySize === size.value
                    ? 'border-sky-500 bg-sky-500/20 text-sky-300'
                    : 'hover:bg-slate-800/40 text-slate-300'
                  }
                `}
              >
                <Users className="w-5 h-5 mx-auto mb-2" />
                <span className="text-sm">{size.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="glass-card p-6 bg-sky-500/10 border-sky-500/30">
          <h3 className="text-sm font-semibold text-sky-300 mb-2">Quick Tip</h3>
          <p className="text-sm text-slate-300">
            Your company details help us provide industry-specific templates and best practices 
            tailored to organizations of your size.
          </p>
        </div>
      </div>
    </div>
  )
}