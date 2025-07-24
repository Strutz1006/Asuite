import { TrendingUp, Users, Building, Link } from 'lucide-react'
import { KPIData } from '../KPIBuilderWizard'

interface BasicDetailsStepProps {
  data: KPIData
  updateData: (updates: Partial<KPIData>) => void
}

const categories = [
  { value: 'financial', label: 'Financial', icon: '💰' },
  { value: 'operational', label: 'Operational', icon: '⚙️' },
  { value: 'customer', label: 'Customer', icon: '👥' },
  { value: 'employee', label: 'Employee', icon: '👨‍💼' },
  { value: 'esg', label: 'ESG/Impact', icon: '🌱' },
  { value: 'quality', label: 'Quality', icon: '✨' },
]

const departments = [
  'Executive',
  'Sales',
  'Marketing',
  'Operations',
  'Finance',
  'HR',
  'IT',
  'Customer Success',
  'Product',
  'Engineering',
]

export default function BasicDetailsStep({ data, updateData }: BasicDetailsStepProps) {
  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Define Your KPI</h2>
        <p className="text-slate-400">
          Start by providing basic information about your KPI
        </p>
      </div>

      <div className="space-y-6">
        {/* KPI Name */}
        <div>
          <label htmlFor="kpiName" className="block text-sm font-medium text-slate-300 mb-2">
            KPI Name *
          </label>
          <div className="relative">
            <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              id="kpiName"
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
              placeholder="e.g., Customer Satisfaction Score, Monthly Revenue Growth"
              className="glass-input w-full pl-12 pr-4 py-3 text-slate-100 placeholder-slate-500"
              required
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Use a clear, descriptive name that anyone can understand
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={data.description}
            onChange={(e) => updateData({ description: e.target.value })}
            placeholder="Explain what this KPI measures and why it's important..."
            rows={4}
            className="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-500 resize-none"
          />
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Category *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => updateData({ category: category.value })}
                className={`
                  glass-card p-4 text-center transition-all duration-200
                  ${data.category === category.value
                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                    : 'hover:bg-slate-800/40 text-slate-300'
                  }
                `}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <span className="text-sm">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Owner */}
          <div>
            <label htmlFor="owner" className="block text-sm font-medium text-slate-300 mb-2">
              KPI Owner *
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                id="owner"
                value={data.owner}
                onChange={(e) => updateData({ owner: e.target.value })}
                placeholder="Person responsible for this KPI"
                className="glass-input w-full pl-12 pr-4 py-3 text-slate-100 placeholder-slate-500"
                required
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-slate-300 mb-2">
              Department *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
              <select
                id="department"
                value={data.department}
                onChange={(e) => updateData({ department: e.target.value })}
                className="glass-input w-full pl-12 pr-4 py-3 text-slate-100 appearance-none cursor-pointer"
                required
              >
                <option value="" className="bg-slate-900">Select department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept} className="bg-slate-900">
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Strategic Alignment */}
        <div>
          <label htmlFor="alignment" className="block text-sm font-medium text-slate-300 mb-2">
            Strategic Goal Alignment
          </label>
          <div className="relative">
            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <select
              id="alignment"
              value={data.strategicAlignment}
              onChange={(e) => updateData({ strategicAlignment: e.target.value })}
              className="glass-input w-full pl-12 pr-4 py-3 text-slate-100 appearance-none cursor-pointer"
            >
              <option value="" className="bg-slate-900">Select aligned goal (optional)</option>
              <option value="1" className="bg-slate-900">Increase Revenue by 25%</option>
              <option value="2" className="bg-slate-900">Improve Customer Satisfaction</option>
              <option value="3" className="bg-slate-900">Reduce Operational Costs</option>
              <option value="4" className="bg-slate-900">Expand Market Presence</option>
            </select>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Link this KPI to a strategic goal from Aesyros Align
          </p>
        </div>

        {/* Templates Suggestion */}
        <div className="glass-card p-6 bg-green-500/10 border-green-500/30">
          <h3 className="text-sm font-semibold text-green-300 mb-3">
            Suggested KPI Templates
          </h3>
          <div className="space-y-2">
            <button className="w-full text-left glass-card p-3 hover:bg-slate-800/40 transition-colors">
              <p className="text-sm font-medium text-slate-200">Net Promoter Score (NPS)</p>
              <p className="text-xs text-slate-400">Customer satisfaction measurement</p>
            </button>
            <button className="w-full text-left glass-card p-3 hover:bg-slate-800/40 transition-colors">
              <p className="text-sm font-medium text-slate-200">Monthly Recurring Revenue (MRR)</p>
              <p className="text-xs text-slate-400">Financial growth indicator</p>
            </button>
            <button className="w-full text-left glass-card p-3 hover:bg-slate-800/40 transition-colors">
              <p className="text-sm font-medium text-slate-200">Employee Turnover Rate</p>
              <p className="text-xs text-slate-400">HR retention metric</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}