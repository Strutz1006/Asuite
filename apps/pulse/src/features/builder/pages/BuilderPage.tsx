import { Plus, Target, TrendingUp, BarChart3, Settings, CheckCircle } from 'lucide-react'

const kpiTemplates = [
  {
    id: '1',
    name: 'Customer Satisfaction',
    category: 'Customer Experience',
    description: 'Track customer satisfaction through surveys and feedback',
    icon: Target,
    color: 'text-blue-400',
  },
  {
    id: '2',
    name: 'Revenue Growth',
    category: 'Financial',
    description: 'Monitor monthly and quarterly revenue growth rates',
    icon: TrendingUp,
    color: 'text-green-400',
  },
  {
    id: '3',
    name: 'Lead Conversion',
    category: 'Sales',
    description: 'Track the percentage of leads that convert to customers',
    icon: BarChart3,
    color: 'text-orange-400',
  },
  {
    id: '4',
    name: 'Employee Engagement',
    category: 'HR',
    description: 'Measure employee satisfaction and engagement levels',
    icon: CheckCircle,
    color: 'text-purple-400',
  },
  {
    id: '5',
    name: 'Website Performance',
    category: 'Marketing',
    description: 'Monitor website traffic, conversion rates, and user behavior',
    icon: BarChart3,
    color: 'text-pink-400',
  },
  {
    id: '6',
    name: 'Support Response Time',
    category: 'Support',
    description: 'Track average response time for customer support tickets',
    icon: Settings,
    color: 'text-yellow-400',
  },
]

const buildSteps = [
  {
    step: 1,
    title: 'Choose Template',
    description: 'Select a KPI template or start from scratch',
    status: 'current',
  },
  {
    step: 2,
    title: 'Define Metrics',
    description: 'Set up measurement criteria and targets',
    status: 'upcoming',
  },
  {
    step: 3,
    title: 'Configure Data',
    description: 'Connect data sources and set update frequency',
    status: 'upcoming',
  },
  {
    step: 4,
    title: 'Set Alerts',
    description: 'Configure notifications and thresholds',
    status: 'upcoming',
  },
  {
    step: 5,
    title: 'Review & Launch',
    description: 'Preview and activate your KPI',
    status: 'upcoming',
  },
]

export default function BuilderPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">KPI Builder</h1>
          <p className="text-slate-400 mt-1">
            Create and configure key performance indicators with our guided builder
          </p>
        </div>
        <button className="glass-button text-blue-300 hover:text-blue-200 px-4 py-2 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Start from Scratch
        </button>
      </div>

      {/* Build Steps */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-6">Build Process</h2>
        <div className="flex items-center justify-between">
          {buildSteps.map((step, index) => (
            <div key={step.step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.status === 'current' 
                    ? 'bg-blue-500 text-white' 
                    : step.status === 'completed'
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  {step.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.step
                  )}
                </div>
                <div className="text-center mt-2">
                  <p className="text-sm font-medium text-slate-100">{step.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{step.description}</p>
                </div>
              </div>
              {index < buildSteps.length - 1 && (
                <div className="w-16 h-0.5 bg-slate-700 mx-4 mt-[-60px]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* KPI Templates */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-6">Choose a Template</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpiTemplates.map((template) => {
            const Icon = template.icon
            return (
              <div key={template.id} className="glass-card p-6 bg-slate-800/40 hover:bg-slate-800/60 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className={`w-8 h-8 ${template.color}`} />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">{template.name}</h3>
                    <p className="text-sm text-slate-400">{template.category}</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-4">{template.description}</p>
                <button className="w-full glass-button text-blue-300 hover:text-blue-200 py-2 text-sm">
                  Use Template
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Custom Builder */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-6">Custom KPI Builder</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                KPI Name
              </label>
              <input
                type="text"
                className="glass-input w-full px-4 py-2 text-slate-100 placeholder-slate-400"
                placeholder="Enter KPI name..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Category
              </label>
              <select className="glass-input w-full px-4 py-2 text-slate-100 bg-slate-800/60">
                <option>Select category...</option>
                <option>Customer Experience</option>
                <option>Financial</option>
                <option>Sales</option>
                <option>Marketing</option>
                <option>HR</option>
                <option>Support</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Description
            </label>
            <textarea
              className="glass-input w-full px-4 py-2 text-slate-100 placeholder-slate-400 h-24"
              placeholder="Describe what this KPI measures..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Unit of Measurement
              </label>
              <select className="glass-input w-full px-4 py-2 text-slate-100 bg-slate-800/60">
                <option>Select unit...</option>
                <option>Percentage (%)</option>
                <option>Currency ($)</option>
                <option>Number</option>
                <option>Time</option>
                <option>Rating</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Target Value
              </label>
              <input
                type="number"
                className="glass-input w-full px-4 py-2 text-slate-100 placeholder-slate-400"
                placeholder="Enter target..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Update Frequency
              </label>
              <select className="glass-input w-full px-4 py-2 text-slate-100 bg-slate-800/60">
                <option>Select frequency...</option>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Quarterly</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-700/50">
            <button className="glass-button text-slate-400 hover:text-slate-300 px-6 py-2">
              Save as Draft
            </button>
            <button className="glass-button text-blue-300 hover:text-blue-200 px-6 py-2">
              Continue to Data Sources
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}