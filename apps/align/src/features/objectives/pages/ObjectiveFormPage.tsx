import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2 } from 'lucide-react'
import { ObjectiveCreationForm } from '../components/ObjectiveCreationForm'
import { useGoals } from '../../goals/hooks/useGoals'

export default function ObjectiveFormPage() {
  const navigate = useNavigate()
  const { createGoal } = useGoals()
  const [showForm, setShowForm] = useState(true)

  const handleSubmit = async (objectiveData: any) => {
    try {
      // Create objective with strategic_level set to 'objective'
      await createGoal({
        ...objectiveData,
        strategic_level: 'objective',
        level: objectiveData.organizational_level, // Map to legacy field
        framework: 'objective',
        target_value: '',
        unit: '',
        current_value: '0',
        progress_percentage: 0,
        status: 'active'
      })
      
      navigate('/objectives')
    } catch (error) {
      console.error('Error creating objective:', error)
    }
  }

  const handleClose = () => {
    navigate('/objectives')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/objectives')}
          className="glass-button p-2 text-slate-300 hover:text-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-green-400" />
            Create Strategic Objective
          </h1>
          <p className="text-slate-400 mt-1">
            Define broad outcomes that translate your mission into actionable results
          </p>
        </div>
      </div>

      {/* Guidelines */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Strategic Objective Guidelines</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-400 mb-2">What makes a good objective?</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Strategic:</strong> Supports your mission and vision</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Broad:</strong> Captures a significant outcome</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Time-bound:</strong> Has a clear deadline</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Inspiring:</strong> Motivates action</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-green-400 mb-2">Examples</h4>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <div className="text-slate-200 font-medium">Market Expansion</div>
                <div className="text-slate-400">"Expand into 5 new geographical markets by Q4"</div>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <div className="text-slate-200 font-medium">Customer Success</div>
                <div className="text-slate-400">"Achieve 90% customer satisfaction rating"</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Creation Form */}
      <ObjectiveCreationForm
        isOpen={showForm}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  )
}