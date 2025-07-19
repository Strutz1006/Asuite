import { Users, Plus, X, Building, UserPlus } from 'lucide-react'
import { SetupData } from '../SetupWizard'
import { useState } from 'react'

interface TeamSetupStepProps {
  data: SetupData
  updateData: (updates: Partial<SetupData>) => void
}

const commonDepartments = [
  'Engineering',
  'Sales',
  'Marketing',
  'Operations',
  'HR',
  'Finance',
  'Product',
  'Customer Success',
  'IT',
  'Legal',
]

export default function TeamSetupStep({ data, updateData }: TeamSetupStepProps) {
  const [newDepartment, setNewDepartment] = useState('')

  const addDepartment = () => {
    if (newDepartment.trim() && !data.departments.includes(newDepartment.trim())) {
      updateData({ departments: [...data.departments, newDepartment.trim()] })
      setNewDepartment('')
    }
  }

  const removeDepartment = (dept: string) => {
    updateData({ departments: data.departments.filter(d => d !== dept) })
  }

  const toggleDepartment = (dept: string) => {
    if (data.departments.includes(dept)) {
      removeDepartment(dept)
    } else {
      updateData({ departments: [...data.departments, dept] })
    }
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Set Up Your Team Structure</h2>
        <p className="text-slate-400">
          Define your organizational structure to enable goal cascading and alignment
        </p>
      </div>

      <div className="space-y-6">
        {/* Department Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-4">
            Select or Add Departments
          </label>

          {/* Common Departments Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {commonDepartments.map((dept) => (
              <button
                key={dept}
                onClick={() => toggleDepartment(dept)}
                className={`
                  glass-card p-4 text-center transition-all duration-200
                  ${data.departments.includes(dept)
                    ? 'border-sky-500 bg-sky-500/20 text-sky-300'
                    : 'hover:bg-slate-800/40 text-slate-300'
                  }
                `}
              >
                <Building className="w-5 h-5 mx-auto mb-2" />
                <span className="text-sm">{dept}</span>
              </button>
            ))}
          </div>

          {/* Add Custom Department */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addDepartment()}
              placeholder="Add custom department"
              className="glass-input flex-1 px-4 py-3 text-slate-100 placeholder-slate-500"
            />
            <button
              onClick={addDepartment}
              className="glass-button text-sky-300 hover:text-sky-200 px-4 py-3"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Selected Departments */}
          {data.departments.length > 0 && (
            <div className="glass-card p-6 bg-slate-800/40">
              <h3 className="text-sm font-medium text-slate-300 mb-3">
                Selected Departments ({data.departments.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.departments.map((dept) => (
                  <div
                    key={dept}
                    className="glass-card px-4 py-2 flex items-center gap-2 bg-sky-500/20 border-sky-500/50"
                  >
                    <span className="text-sky-300">{dept}</span>
                    <button
                      onClick={() => removeDepartment(dept)}
                      className="text-sky-400 hover:text-sky-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Team Size Info */}
        <div className="glass-card p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-green-500/20">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">
                Invite Team Members Later
              </h3>
              <p className="text-sm text-slate-400 mb-3">
                After setup, you'll be able to invite team members and assign them to departments. 
                Each member can have their own goals that align with departmental objectives.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-400">
                <UserPlus className="w-4 h-4" />
                <span>Unlimited team members in all plans</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hierarchy Preview */}
        <div className="glass-card p-6 bg-slate-800/40">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Goal Hierarchy Preview</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-sky-400"></div>
              <span className="text-sm text-slate-300">Company Goals</span>
            </div>
            <div className="flex items-center gap-3 ml-6">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-sm text-slate-300">Department Goals</span>
            </div>
            <div className="flex items-center gap-3 ml-12">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <span className="text-sm text-slate-300">Individual Goals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}