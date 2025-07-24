import { Check, TrendingUp, Database, Target, AlertCircle, Sparkles } from 'lucide-react'
import { KPIData } from '../KPIBuilderWizard'

interface ReviewStepProps {
  data: KPIData
}

export default function ReviewStep({ data }: ReviewStepProps) {
  const getMeasurementTypeLabel = (type: string) => {
    const types = {
      number: 'Number',
      percentage: 'Percentage',
      currency: 'Currency',
      time: 'Time',
      ratio: 'Ratio',
    }
    return types[type as keyof typeof types] || type
  }

  const getDataSourceLabel = (source: string) => {
    const sources = {
      manual: 'Manual Entry',
      api: 'API Integration',
      database: 'Database Connection',
      spreadsheet: 'Spreadsheet Sync',
    }
    return sources[source as keyof typeof sources] || source
  }

  const getTrendDirectionLabel = (direction: string) => {
    const directions = {
      'higher-better': 'Higher is Better',
      'lower-better': 'Lower is Better',
      'range': 'Target Range',
    }
    return directions[direction as keyof typeof directions] || direction
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
          <Check className="w-8 h-8 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">KPI Ready to Create!</h2>
        <p className="text-slate-400">
          Review your KPI configuration and create your performance indicator
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Details Summary */}
        <div className="glass-card p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-100 mb-3">Basic Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-300 mb-1">KPI Name</p>
                  <p className="text-slate-200">{data.name || 'Not set'}</p>
                </div>
                
                {data.description && (
                  <div>
                    <p className="text-sm font-medium text-slate-300 mb-1">Description</p>
                    <p className="text-sm text-slate-200">{data.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Category</p>
                    <p className="text-sm text-slate-200 capitalize">{data.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Owner</p>
                    <p className="text-sm text-slate-200">{data.owner || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Department</p>
                    <p className="text-sm text-slate-200">{data.department || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Strategic Goal</p>
                    <p className="text-sm text-slate-200">
                      {data.strategicAlignment ? 'Aligned' : 'Not linked'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Measurement Summary */}
        <div className="glass-card p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-green-500/20">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-100 mb-3">Measurement</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Type</p>
                  <p className="text-sm text-slate-200">
                    {getMeasurementTypeLabel(data.measurementType)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Unit</p>
                  <p className="text-sm text-slate-200">{data.unit || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Frequency</p>
                  <p className="text-sm text-slate-200 capitalize">{data.frequency}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Method</p>
                  <p className="text-sm text-slate-200 capitalize">
                    {data.calculationMethod || 'Not specified'}
                  </p>
                </div>
              </div>
              
              {data.formula && (
                <div className="mt-4">
                  <p className="text-xs text-slate-400 mb-1">Formula</p>
                  <p className="text-sm text-slate-200 font-mono bg-slate-800/50 p-2 rounded">
                    {data.formula}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data Source Summary */}
        <div className="glass-card p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Database className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-100 mb-3">Data Source</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Source Type</p>
                    <p className="text-sm text-slate-200">
                      {getDataSourceLabel(data.dataSource)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Automation</p>
                    <span className={`text-sm px-2 py-1 rounded-full
                      ${data.automationEnabled 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-slate-500/20 text-slate-400'
                      }
                    `}>
                      {data.automationEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
                
                {data.sourceDetails && (
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Details</p>
                    <p className="text-sm text-slate-200">{data.sourceDetails}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Targets & Thresholds Summary */}
        <div className="glass-card p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-yellow-500/20">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-100 mb-3">Targets & Thresholds</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Direction</p>
                    <p className="text-sm text-slate-200">
                      {getTrendDirectionLabel(data.trendDirection)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Target</p>
                    <p className="text-sm text-slate-200">
                      {data.targetValue || 'Not set'} {data.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Warning</p>
                    <p className="text-sm text-slate-200">
                      {data.warningLevel || 'Not set'} {data.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Critical</p>
                    <p className="text-sm text-slate-200">
                      {data.criticalLevel || 'Not set'} {data.unit}
                    </p>
                  </div>
                </div>
                
                {data.trendDirection === 'range' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Min Threshold</p>
                      <p className="text-sm text-slate-200">
                        {data.minThreshold || 'Not set'} {data.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Max Threshold</p>
                      <p className="text-sm text-slate-200">
                        {data.maxThreshold || 'Not set'} {data.unit}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="glass-card p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-300 mb-2">What happens next?</h3>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>• Your KPI will be added to the dashboard</li>
                <li>• Start collecting data based on your source configuration</li>
                <li>• Set up notifications for threshold alerts</li>
                <li>• Begin tracking performance against targets</li>
                <li>• Access analytics and reporting features</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Validation Checklist */}
        <div className="glass-card p-6 bg-green-500/10 border-green-500/30">
          <h3 className="text-sm font-semibold text-green-300 mb-3">
            SMART Criteria Validation
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm text-slate-300">
                <span className="font-medium">Specific:</span> Clear KPI name and description
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm text-slate-300">
                <span className="font-medium">Measurable:</span> Defined units and calculation method
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm text-slate-300">
                <span className="font-medium">Achievable:</span> Realistic targets set
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm text-slate-300">
                <span className="font-medium">Relevant:</span> Aligned with business objectives
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm text-slate-300">
                <span className="font-medium">Time-bound:</span> Regular measurement frequency
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}