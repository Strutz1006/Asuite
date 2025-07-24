import { Calculator, Clock, Hash, Percent, DollarSign, Timer } from 'lucide-react'
import { KPIData } from '../KPIBuilderWizard'

interface MeasurementStepProps {
  data: KPIData
  updateData: (updates: Partial<KPIData>) => void
}

const measurementTypes = [
  { value: 'number', label: 'Number', icon: Hash, description: 'Simple count or quantity' },
  { value: 'percentage', label: 'Percentage', icon: Percent, description: 'Ratio expressed as percentage' },
  { value: 'currency', label: 'Currency', icon: DollarSign, description: 'Monetary value' },
  { value: 'time', label: 'Time', icon: Timer, description: 'Duration or time-based metric' },
  { value: 'ratio', label: 'Ratio', icon: Calculator, description: 'Relationship between two values' },
]

const frequencies = [
  { value: 'daily', label: 'Daily', description: 'Updated every day' },
  { value: 'weekly', label: 'Weekly', description: 'Updated every week' },
  { value: 'monthly', label: 'Monthly', description: 'Updated every month' },
  { value: 'quarterly', label: 'Quarterly', description: 'Updated every quarter' },
  { value: 'yearly', label: 'Yearly', description: 'Updated annually' },
]

const commonFormulas = [
  { category: 'Financial', formulas: ['Revenue Growth Rate', 'Gross Margin', 'ROI', 'Cost per Acquisition'] },
  { category: 'Customer', formulas: ['Customer Satisfaction Score', 'Net Promoter Score', 'Customer Retention Rate'] },
  { category: 'Operational', formulas: ['Efficiency Ratio', 'Utilization Rate', 'Cycle Time', 'Error Rate'] },
]

export default function MeasurementStep({ data, updateData }: MeasurementStepProps) {
  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Define Measurement</h2>
        <p className="text-slate-400">
          Specify how this KPI will be measured and calculated
        </p>
      </div>

      <div className="space-y-6">
        {/* Measurement Type */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Measurement Type *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {measurementTypes.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => updateData({ measurementType: type.value as any })}
                  className={`
                    glass-card p-4 text-left transition-all duration-200
                    ${data.measurementType === type.value
                      ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                      : 'hover:bg-slate-800/40 text-slate-300'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{type.label}</span>
                  </div>
                  <p className="text-xs text-slate-400">{type.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Unit */}
        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-slate-300 mb-2">
            Unit of Measurement
          </label>
          <input
            type="text"
            id="unit"
            value={data.unit}
            onChange={(e) => updateData({ unit: e.target.value })}
            placeholder={
              data.measurementType === 'percentage' ? '% (percentage)' :
              data.measurementType === 'currency' ? '$ (dollars)' :
              data.measurementType === 'time' ? 'hours, days, minutes' :
              'units, count, score'
            }
            className="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-500"
          />
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Measurement Frequency *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {frequencies.map((freq) => (
              <button
                key={freq.value}
                type="button"
                onClick={() => updateData({ frequency: freq.value as any })}
                className={`
                  glass-card p-4 text-center transition-all duration-200
                  ${data.frequency === freq.value
                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                    : 'hover:bg-slate-800/40 text-slate-300'
                  }
                `}
              >
                <Clock className="w-5 h-5 mx-auto mb-2" />
                <div className="text-sm font-medium">{freq.label}</div>
                <div className="text-xs text-slate-400 mt-1">{freq.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Formula */}
        <div>
          <label htmlFor="formula" className="block text-sm font-medium text-slate-300 mb-2">
            Calculation Formula
          </label>
          <div className="relative">
            <Calculator className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <textarea
              id="formula"
              value={data.formula}
              onChange={(e) => updateData({ formula: e.target.value })}
              placeholder="e.g., (Total Sales - Total Costs) / Total Sales * 100"
              rows={3}
              className="glass-input w-full pl-12 pr-4 py-3 text-slate-100 placeholder-slate-500 resize-none"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Define how this KPI is calculated from source data
          </p>
        </div>

        {/* Calculation Method */}
        <div>
          <label htmlFor="calculationMethod" className="block text-sm font-medium text-slate-300 mb-2">
            Calculation Method
          </label>
          <select
            id="calculationMethod"
            value={data.calculationMethod}
            onChange={(e) => updateData({ calculationMethod: e.target.value })}
            className="glass-input w-full px-4 py-3 text-slate-100 appearance-none cursor-pointer"
          >
            <option value="" className="bg-slate-900">Select method</option>
            <option value="sum" className="bg-slate-900">Sum (Total)</option>
            <option value="average" className="bg-slate-900">Average (Mean)</option>
            <option value="median" className="bg-slate-900">Median</option>
            <option value="max" className="bg-slate-900">Maximum</option>
            <option value="min" className="bg-slate-900">Minimum</option>
            <option value="count" className="bg-slate-900">Count</option>
            <option value="custom" className="bg-slate-900">Custom Formula</option>
          </select>
        </div>

        {/* Common Formulas Helper */}
        <div className="glass-card p-6 bg-blue-500/10 border-blue-500/30">
          <h3 className="text-sm font-semibold text-blue-300 mb-4">
            Common Formula Examples
          </h3>
          <div className="space-y-4">
            {commonFormulas.map((category) => (
              <div key={category.category}>
                <h4 className="text-xs font-medium text-slate-300 mb-2">{category.category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {category.formulas.map((formula) => (
                    <button
                      key={formula}
                      type="button"
                      onClick={() => updateData({ formula: formula })}
                      className="text-left glass-card p-2 hover:bg-slate-800/40 transition-colors"
                    >
                      <span className="text-xs text-slate-300">{formula}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Validation Tips */}
        <div className="glass-card p-4 bg-green-500/10 border-green-500/30">
          <h3 className="text-sm font-semibold text-green-300 mb-2">
            Measurement Best Practices
          </h3>
          <ul className="text-xs text-slate-300 space-y-1">
            <li>• Ensure your KPI is quantifiable and objective</li>
            <li>• Use consistent units across all measurements</li>
            <li>• Define clear calculation rules to avoid ambiguity</li>
            <li>• Consider seasonality and external factors</li>
            <li>• Test your formula with sample data</li>
          </ul>
        </div>
      </div>
    </div>
  )
}