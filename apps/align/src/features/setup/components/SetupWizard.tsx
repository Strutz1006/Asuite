import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Check, Building2, Target, Eye, Sparkles, Users, BarChart3 } from 'lucide-react'
import { supabase } from '@aesyros/supabase'
import CompanyDetailsStep from './steps/CompanyDetailsStep'
import VisionValuesStep from './steps/VisionValuesStep'
import TeamSetupStep from './steps/TeamSetupStep'
import GoalFrameworkStep from './steps/GoalFrameworkStep'
import ReviewStep from './steps/ReviewStep'

export interface SetupData {
  companyName: string
  industry: string
  companySize: string
  vision: string
  mission: string
  values: string[]
  departments: string[]
  goalFramework: 'okr' | 'smart' | 'hybrid'
  planningCycle: 'quarterly' | 'annually' | 'monthly'
}

const steps = [
  { id: 1, name: 'Company Details', icon: Building2 },
  { id: 2, name: 'Vision & Values', icon: Eye },
  { id: 3, name: 'Team Structure', icon: Users },
  { id: 4, name: 'Goal Framework', icon: Target },
  { id: 5, name: 'Review & Launch', icon: Sparkles },
]

export default function SetupWizard() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [setupData, setSetupData] = useState<SetupData>({
    companyName: '',
    industry: '',
    companySize: '',
    vision: '',
    mission: '',
    values: [],
    departments: [],
    goalFramework: 'okr',
    planningCycle: 'quarterly',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateData = (updates: Partial<SetupData>) => {
    setSetupData(prev => ({ ...prev, ...updates }))
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

  const completeSetup = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Step 1: Create organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: setupData.companyName,
          slug: setupData.companyName.toLowerCase().replace(/\s+/g, '-'),
          industry: setupData.industry,
          size_category: setupData.companySize,
          vision_statement: setupData.vision,
          mission_statement: setupData.mission,
          core_values: setupData.values,
          active_products: ['align'],
          vision_last_updated: new Date().toISOString(),
          mission_last_updated: new Date().toISOString()
        })
        .select()
        .single()

      if (orgError) throw orgError

      const organizationId = orgData.id

      // Step 2: Create departments
      if (setupData.departments.length > 0) {
        const departmentInserts = setupData.departments.map(dept => ({
          organization_id: organizationId,
          name: dept,
          description: `${dept} department`
        }))

        const { error: deptError } = await supabase
          .from('departments')
          .insert(departmentInserts)

        if (deptError) throw deptError
      }

      // Step 3: Save Align-specific setup
      const { error: setupError } = await supabase
        .from('align_company_setup')
        .insert({
          organization_id: organizationId,
          setup_completed: true,
          goal_framework: setupData.goalFramework,
          planning_cycle: setupData.planningCycle,
          review_frequency: 'monthly'
        })

      if (setupError) throw setupError

      // Step 4: Log the completion activity
      await supabase
        .from('activity_logs')
        .insert({
          organization_id: organizationId,
          product: 'align',
          action: 'setup_completed',
          entity_type: 'organization',
          entity_id: organizationId,
          details: {
            framework: setupData.goalFramework,
            departments_created: setupData.departments.length,
            planning_cycle: setupData.planningCycle
          }
        })

      console.log('Setup completed successfully:', setupData)
      
      // Navigate to dashboard
      navigate('/dashboard')
      
    } catch (err) {
      console.error('Setup failed:', err)
      setError(err instanceof Error ? err.message : 'Setup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="glass-card border-b border-slate-700/80">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-sky-400" />
              <span className="ml-3 text-2xl font-bold text-slate-100">
                Aesyros <span className="text-sky-400">Align</span> Setup
              </span>
            </div>
            <div className="text-sm text-slate-400">
              Step {currentStep} of {steps.length}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="px-8 py-4">
        <div className="flex items-center justify-between mb-8">
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
                      ${isCompleted ? 'bg-sky-500 text-white' : 
                        isCurrent ? 'bg-sky-500/20 text-sky-400 border-2 border-sky-500' : 
                        'bg-slate-800 text-slate-500 border border-slate-700'}
                    `}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span
                    className={`
                      absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap
                      ${isCurrent ? 'text-sky-400 font-medium' : 'text-slate-500'}
                    `}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`
                      flex-1 h-0.5 mx-4 transition-all duration-300
                      ${currentStep > step.id ? 'bg-sky-500' : 'bg-slate-700'}
                    `}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 animate-fade-in">
            {currentStep === 1 && (
              <CompanyDetailsStep data={setupData} updateData={updateData} />
            )}
            {currentStep === 2 && (
              <VisionValuesStep data={setupData} updateData={updateData} />
            )}
            {currentStep === 3 && (
              <TeamSetupStep data={setupData} updateData={updateData} />
            )}
            {currentStep === 4 && (
              <GoalFrameworkStep data={setupData} updateData={updateData} />
            )}
            {currentStep === 5 && (
              <ReviewStep data={setupData} />
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
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
                className="glass-button text-sky-300 hover:text-sky-200 px-6 py-3 flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={completeSetup}
                disabled={isLoading}
                className="bg-sky-500 hover:bg-sky-600 disabled:bg-sky-500/50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Launch Align
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}