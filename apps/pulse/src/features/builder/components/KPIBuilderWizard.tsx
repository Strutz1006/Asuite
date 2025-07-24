import { useState } from 'react'
import { ChevronRight, ChevronLeft, Check, TrendingUp, BarChart3, Target, Database, AlertCircle, Sparkles } from 'lucide-react'
import BasicDetailsStep from './steps/BasicDetailsStep'
import MeasurementStep from './steps/MeasurementStep'
import DataSourceStep from './steps/DataSourceStep'
import TargetsThresholdsStep from './steps/TargetsThresholdsStep'
import ReviewStep from './steps/ReviewStep'

export interface KPIData {
  // Basic Details
  name: string
  description: string
  category: string
  owner: string
  department: string
  strategicAlignment: string
  
  // Measurement
  measurementType: 'number' | 'percentage' | 'currency' | 'time' | 'ratio'
  unit: string
  formula: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  calculationMethod: string
  
  // Data Source
  dataSource: 'manual' | 'api' | 'database' | 'spreadsheet'
  sourceDetails: string
  automationEnabled: boolean
  
  // Targets & Thresholds
  targetValue: string
  minThreshold: string
  maxThreshold: string
  warningLevel: string
  criticalLevel: string
  trendDirection: 'higher-better' | 'lower-better' | 'range'
}

const steps = [
  { id: 1, name: 'Basic Details', icon: TrendingUp },
  { id: 2, name: 'Measurement', icon: BarChart3 },
  { id: 3, name: 'Data Source', icon: Database },
  { id: 4, name: 'Targets & Thresholds', icon: Target },
  { id: 5, name: 'Review & Create', icon: Check },
]

export default function KPIBuilderWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showAIAssist, setShowAIAssist] = useState(false)
  const [kpiData, setKPIData] = useState<KPIData>({
    name: '',
    description: '',
    category: 'operational',
    owner: '',
    department: '',
    strategicAlignment: '',
    measurementType: 'number',
    unit: '',
    formula: '',
    frequency: 'monthly',
    calculationMethod: '',
    dataSource: 'manual',
    sourceDetails: '',
    automationEnabled: false,
    targetValue: '',
    minThreshold: '',
    maxThreshold: '',
    warningLevel: '',
    criticalLevel: '',
    trendDirection: 'higher-better',
  })

  const updateData = (updates: Partial<KPIData>) => {
    setKPIData(prev => ({ ...prev, ...updates }))
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

  const createKPI = () => {
    // TODO: Save KPI to Supabase
    console.log('Creating KPI:', kpiData)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">KPI Builder</h1>
          <p className="text-slate-400 mt-1">
            Create SMART KPIs that align with your strategic goals
          </p>
        </div>
        <button
          onClick={() => setShowAIAssist(!showAIAssist)}
          className="glass-button text-purple-300 hover:text-purple-200 px-4 py-2 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          AI Coach
        </button>
      </div>

      {/* AI Assistant Panel */}
      {showAIAssist && (
        <div className="glass-card p-6 bg-purple-500/10 border-purple-500/30 animate-slide-up">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">KPI AI Coach</h3>
              <p className="text-sm text-slate-300 mb-4">
                I'll help you create effective KPIs that are specific, measurable, and aligned with your goals.
              </p>
              <div className="space-y-3">
                <button className="glass-button text-purple-300 hover:text-purple-200 px-3 py-2 text-sm w-full text-left">
                  Suggest KPIs based on my industry
                </button>
                <button className="glass-button text-purple-300 hover:text-purple-200 px-3 py-2 text-sm w-full text-left">
                  Validate SMART criteria
                </button>
                <button className="glass-button text-purple-300 hover:text-purple-200 px-3 py-2 text-sm w-full text-left">
                  Recommend measurement formulas
                </button>
                <button className="glass-button text-purple-300 hover:text-purple-200 px-3 py-2 text-sm w-full text-left">
                  Check for duplicate KPIs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isCompleted = currentStep > step.id
          const isCurrent = currentStep === step.id
          
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex items-center relative">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                    ${isCompleted ? 'bg-blue-500 text-white' : 
                      isCurrent ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-500' : 
                      'bg-slate-800 text-slate-500 border border-slate-700'}
                  `}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span
                  className={`
                    absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap
                    ${isCurrent ? 'text-blue-400 font-medium' : 'text-slate-500'}
                  `}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-4 transition-all duration-300
                    ${currentStep > step.id ? 'bg-blue-500' : 'bg-slate-700'}
                  `}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="glass-card p-8 mt-12">
        {currentStep === 1 && (
          <BasicDetailsStep data={kpiData} updateData={updateData} />
        )}
        {currentStep === 2 && (
          <MeasurementStep data={kpiData} updateData={updateData} />
        )}
        {currentStep === 3 && (
          <DataSourceStep data={kpiData} updateData={updateData} />
        )}
        {currentStep === 4 && (
          <TargetsThresholdsStep data={kpiData} updateData={updateData} />
        )}
        {currentStep === 5 && (
          <ReviewStep data={kpiData} />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`
            glass-button px-6 py-3 flex items-center gap-2
            ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : 'text-slate-300 hover:text-slate-100'}
          `}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {currentStep < steps.length ? (
          <button
            onClick={nextStep}
            className="glass-button text-blue-300 hover:text-blue-200 px-6 py-3 flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={createKPI}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-all duration-200"
          >
            <Check className="w-4 h-4" />
            Create KPI
          </button>
        )}
      </div>

      {/* SMART Criteria Helper */}
      {currentStep === 1 && (
        <div className="glass-card p-6 bg-blue-500/10 border-blue-500/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-300 mb-2">SMART KPI Criteria</h3>
              <div className="text-xs text-slate-300 space-y-1">
                <p><span className="font-medium text-blue-300">S</span>pecific - Clear and unambiguous</p>
                <p><span className="font-medium text-blue-300">M</span>easurable - Quantifiable with defined units</p>
                <p><span className="font-medium text-blue-300">A</span>chievable - Realistic and attainable</p>
                <p><span className="font-medium text-blue-300">R</span>elevant - Aligned with strategic goals</p>
                <p><span className="font-medium text-blue-300">T</span>ime-bound - Has a clear timeframe</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}