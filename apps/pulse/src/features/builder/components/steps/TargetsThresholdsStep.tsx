import { Target, TrendingUp, TrendingDown, AlertTriangle, Bell } from 'lucide-react'
import { KPIData } from '../KPIBuilderWizard'

interface TargetsThresholdsStepProps {
  data: KPIData
  updateData: (updates: Partial<KPIData>) => void
}

const trendDirections = [
  {
    value: 'higher-better',
    label: 'Higher is Better',
    icon: TrendingUp,
    description: 'Increasing values indicate better performance',
    examples: ['Revenue', 'Customer Satisfaction', 'Productivity'],
  },
  {
    value: 'lower-better',
    label: 'Lower is Better',
    icon: TrendingDown,
    description: 'Decreasing values indicate better performance',
    examples: ['Costs', 'Error Rate', 'Response Time'],
  },
  {
    value: 'range',
    label: 'Target Range',
    icon: Target,
    description: 'Optimal performance within a specific range',
    examples: ['Inventory Levels', 'Staff Utilization', 'Quality Score'],
  },
]

export default function TargetsThresholdsStep({ data, updateData }: TargetsThresholdsStepProps) {
  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Set Targets & Thresholds</h2>
        <p className="text-slate-400">
          Define target values and alert thresholds for monitoring performance
        </p>
      </div>

      <div className="space-y-6">
        {/* Trend Direction */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-4">
            Performance Direction *
          </label>
          <div className="space-y-3">
            {trendDirections.map((direction) => {
              const Icon = direction.icon
              const isSelected = data.trendDirection === direction.value
              
              return (
                <button
                  key={direction.value}
                  type="button"
                  onClick={() => updateData({ trendDirection: direction.value as any })}
                  className={`
                    w-full glass-card p-4 text-left transition-all duration-200
                    ${isSelected
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'hover:bg-slate-800/40'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <Icon className={`w-6 h-6 mt-1 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-1 ${isSelected ? 'text-blue-300' : 'text-slate-100'}`}>
                        {direction.label}
                      </h3>
                      <p className="text-sm text-slate-400 mb-2">{direction.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {direction.examples.map((example) => (
                          <span
                            key={example}
                            className={`text-xs px-2 py-1 rounded-full
                              ${isSelected
                                ? 'bg-blue-500/30 text-blue-300'
                                : 'bg-slate-700/50 text-slate-400'
                              }
                            `}
                          >
                            {example}
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

        {/* Target Value */}
        <div className="glass-card p-6 bg-slate-800/40">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-slate-100">Target Value</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="targetValue" className="block text-sm font-medium text-slate-300 mb-2">
                Target Value *
              </label>
              <input
                type="text"
                id="targetValue"
                value={data.targetValue}
                onChange={(e) => updateData({ targetValue: e.target.value })}
                placeholder={`Target ${data.unit || 'value'}`}
                className="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-500"
                required
              />
            </div>
            
            {data.trendDirection === 'range' && (
              <>
                <div>
                  <label htmlFor="minThreshold" className="block text-sm font-medium text-slate-300 mb-2">
                    Minimum Acceptable
                  </label>
                  <input
                    type="text"
                    id="minThreshold"
                    value={data.minThreshold}
                    onChange={(e) => updateData({ minThreshold: e.target.value })}
                    placeholder={`Min ${data.unit || 'value'}`}
                    className="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label htmlFor="maxThreshold" className="block text-sm font-medium text-slate-300 mb-2">
                    Maximum Acceptable
                  </label>
                  <input
                    type="text"
                    id="maxThreshold"
                    value={data.maxThreshold}
                    onChange={(e) => updateData({ maxThreshold: e.target.value })}
                    placeholder={`Max ${data.unit || 'value'}`}
                    className="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-500"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Alert Thresholds */}
        <div className="glass-card p-6 bg-slate-800/40">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-slate-100">Alert Thresholds</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="warningLevel" className="block text-sm font-medium text-slate-300 mb-2">
                Warning Level
              </label>
              <input
                type="text"
                id="warningLevel"
                value={data.warningLevel}
                onChange={(e) => updateData({ warningLevel: e.target.value })}
                placeholder={
                  data.trendDirection === 'higher-better' ? '80% of target' :
                  data.trendDirection === 'lower-better' ? '120% of target' :
                  'Outside acceptable range'
                }
                className="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                Yellow alert - attention needed
              </p>
            </div>
            
            <div>
              <label htmlFor="criticalLevel" className="block text-sm font-medium text-slate-300 mb-2">
                Critical Level
              </label>
              <input
                type="text"
                id="criticalLevel"
                value={data.criticalLevel}
                onChange={(e) => updateData({ criticalLevel: e.target.value })}
                placeholder={
                  data.trendDirection === 'higher-better' ? '60% of target' :
                  data.trendDirection === 'lower-better' ? '150% of target' :
                  'Far outside range'
                }
                className="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                Red alert - immediate action required
              </p>
            </div>
          </div>
        </div>

        {/* Performance Zones Visualization */}
        <div className="glass-card p-6 bg-blue-500/10 border-blue-500/30">
          <h3 className="text-sm font-semibold text-blue-300 mb-4">
            Performance Zones Preview
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/20 border border-green-500/50">
              <span className="text-sm font-medium text-green-300">Excellent</span>
              <span className="text-xs text-green-400">Above target</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/20 border border-blue-500/50">
              <span className="text-sm font-medium text-blue-300">Good</span>
              <span className="text-xs text-blue-400">At target</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/20 border border-yellow-500/50">
              <span className="text-sm font-medium text-yellow-300">Warning</span>
              <span className="text-xs text-yellow-400">Below expectations</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/20 border border-red-500/50">
              <span className="text-sm font-medium text-red-300">Critical</span>
              <span className="text-xs text-red-400">Action required</span>
            </div>
          </div>
        </div>

        {/* Threshold Guidelines */}
        <div className="glass-card p-4 bg-purple-500/10 border-purple-500/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-purple-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-purple-300 mb-2">
                Threshold Setting Guidelines
              </h3>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>• Set realistic targets based on historical data and industry benchmarks</li>
                <li>• Warning thresholds should trigger preventive action</li>
                <li>• Critical thresholds indicate immediate intervention needed</li>
                <li>• Review and adjust thresholds regularly based on performance trends</li>
                <li>• Consider seasonal variations and external factors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}