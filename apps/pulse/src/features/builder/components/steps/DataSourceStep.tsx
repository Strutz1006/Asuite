import { Database, FileText, Globe, Upload, Zap, Settings } from 'lucide-react'
import { KPIData } from '../KPIBuilderWizard'

interface DataSourceStepProps {
  data: KPIData
  updateData: (updates: Partial<KPIData>) => void
}

const dataSources = [
  {
    value: 'manual',
    label: 'Manual Entry',
    icon: FileText,
    description: 'Enter data manually through forms',
    pros: ['Simple setup', 'Full control', 'No technical requirements'],
    cons: ['Time consuming', 'Prone to errors', 'Not real-time'],
  },
  {
    value: 'api',
    label: 'API Integration',
    icon: Globe,
    description: 'Connect to external systems via API',
    pros: ['Real-time data', 'Automated updates', 'Highly accurate'],
    cons: ['Technical setup required', 'Dependent on external systems'],
  },
  {
    value: 'database',
    label: 'Database Connection',
    icon: Database,
    description: 'Direct connection to database',
    pros: ['Real-time access', 'Secure', 'High performance'],
    cons: ['Requires database access', 'Technical complexity'],
  },
  {
    value: 'spreadsheet',
    label: 'Spreadsheet Sync',
    icon: Upload,
    description: 'Sync with Excel or Google Sheets',
    pros: ['Familiar interface', 'Easy setup', 'Team collaboration'],
    cons: ['Manual updates needed', 'Version control issues'],
  },
]

const commonIntegrations = [
  { name: 'Salesforce', category: 'CRM', icon: '☁️' },
  { name: 'HubSpot', category: 'CRM', icon: '🧡' },
  { name: 'Google Analytics', category: 'Analytics', icon: '📊' },
  { name: 'Stripe', category: 'Payments', icon: '💳' },
  { name: 'Slack', category: 'Communication', icon: '💬' },
  { name: 'QuickBooks', category: 'Accounting', icon: '📈' },
]

export default function DataSourceStep({ data, updateData }: DataSourceStepProps) {
  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Configure Data Source</h2>
        <p className="text-slate-400">
          Choose how data will be collected for this KPI
        </p>
      </div>

      <div className="space-y-6">
        {/* Data Source Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-4">
            Data Source Type *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataSources.map((source) => {
              const Icon = source.icon
              const isSelected = data.dataSource === source.value
              
              return (
                <button
                  key={source.value}
                  type="button"
                  onClick={() => updateData({ dataSource: source.value as any })}
                  className={`
                    glass-card p-6 text-left transition-all duration-200
                    ${isSelected
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'hover:bg-slate-800/40'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span className={`font-semibold ${isSelected ? 'text-blue-300' : 'text-slate-100'}`}>
                      {source.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">{source.description}</p>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-green-400 mb-1">Advantages:</p>
                      <ul className="text-xs text-slate-500 space-y-0.5">
                        {source.pros.map((pro, index) => (
                          <li key={index}>• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-yellow-400 mb-1">Considerations:</p>
                      <ul className="text-xs text-slate-500 space-y-0.5">
                        {source.cons.map((con, index) => (
                          <li key={index}>• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Source Details */}
        <div>
          <label htmlFor="sourceDetails" className="block text-sm font-medium text-slate-300 mb-2">
            Source Details
          </label>
          <textarea
            id="sourceDetails"
            value={data.sourceDetails}
            onChange={(e) => updateData({ sourceDetails: e.target.value })}
            placeholder={
              data.dataSource === 'manual' ? 'Describe the manual data collection process...' :
              data.dataSource === 'api' ? 'API endpoint URL, authentication details...' :
              data.dataSource === 'database' ? 'Database connection string, table/view name...' :
              'Spreadsheet URL or file location...'
            }
            rows={4}
            className="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-500 resize-none"
          />
        </div>

        {/* Automation Settings */}
        <div className="glass-card p-6 bg-slate-800/40">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-slate-100">Automation Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">Enable Automatic Updates</p>
                <p className="text-xs text-slate-500">
                  Automatically refresh data based on the measurement frequency
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateData({ automationEnabled: !data.automationEnabled })}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${data.automationEnabled ? 'bg-blue-500' : 'bg-slate-600'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${data.automationEnabled ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            {data.automationEnabled && (
              <div className="glass-card p-4 bg-blue-500/10 border-blue-500/30">
                <p className="text-sm text-blue-300 mb-2">Automation Configuration</p>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Update Schedule</label>
                    <select className="glass-input w-full px-3 py-2 text-sm text-slate-100">
                      <option value="frequency" className="bg-slate-900">
                        Follow measurement frequency ({data.frequency})
                      </option>
                      <option value="hourly" className="bg-slate-900">Every hour</option>
                      <option value="daily" className="bg-slate-900">Daily at 9 AM</option>
                      <option value="custom" className="bg-slate-900">Custom schedule</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Popular Integrations */}
        <div className="glass-card p-6 bg-green-500/10 border-green-500/30">
          <h3 className="text-sm font-semibold text-green-300 mb-4">
            Popular Integrations
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {commonIntegrations.map((integration) => (
              <button
                key={integration.name}
                type="button"
                className="text-left glass-card p-3 hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{integration.icon}</span>
                  <span className="text-sm font-medium text-slate-200">{integration.name}</span>
                </div>
                <span className="text-xs text-slate-400">{integration.category}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Click to configure pre-built connectors for popular services
          </p>
        </div>

        {/* Data Quality Tips */}
        <div className="glass-card p-4 bg-purple-500/10 border-purple-500/30">
          <div className="flex items-start gap-3">
            <Settings className="w-5 h-5 text-purple-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-purple-300 mb-2">
                Data Quality Best Practices
              </h3>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>• Validate data at the source to ensure accuracy</li>
                <li>• Set up alerts for missing or anomalous data points</li>
                <li>• Document data collection procedures for consistency</li>
                <li>• Regular audits to verify data integrity</li>
                <li>• Backup and version control for critical data sources</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}