import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Calendar, User, TrendingUp, Target, BarChart, Loader2, Save } from 'lucide-react'
import { useGoals, Goal, KeyResult } from '../hooks/useGoals'
import { supabase } from '@aesyros/supabase'

export default function GoalDetailPage() {
  const { id } = useParams()
  const { getGoal, updateGoalProgressFromKeyResults } = useGoals()
  const [goal, setGoal] = useState<Goal | null>(null)
  const [keyResults, setKeyResults] = useState<KeyResult[]>([])
  const [progressHistory, setProgressHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingKeyResult, setEditingKeyResult] = useState<string | null>(null)
  const [updateValues, setUpdateValues] = useState<{[key: string]: {current_value: string, progress_percentage: number, weight: number}}>({})
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (id) {
      loadGoalData()
    }
  }, [id])

  const loadGoalData = async () => {
    if (!id) return
    
    try {
      setLoading(true)
      setError(null)

      // Load goal data
      const goalData = await getGoal(id)
      if (!goalData) {
        setError('Goal not found')
        return
      }
      setGoal(goalData)

      // Load key results if it's an OKR
      if (goalData.framework === 'okr') {
        const { data: keyResultsData, error: krError } = await supabase
          .from('align_key_results')
          .select('*')
          .eq('objective_id', id)
          .order('created_at')

        if (krError) {
          console.error('Error loading key results:', krError)
        } else {
          setKeyResults(keyResultsData || [])
        }
      }

      // Load progress history
      const { data: progressData, error: progressError } = await supabase
        .from('align_progress_updates')
        .select('*')
        .eq('objective_id', id)
        .order('created_at')

      if (progressError) {
        console.error('Error loading progress history:', progressError)
      } else {
        setProgressHistory(progressData || [])
      }

    } catch (err) {
      console.error('Error loading goal data:', err)
      setError('Failed to load goal data')
    } finally {
      setLoading(false)
    }
  }

  // Calculate status based on goal status and progress
  const getGoalStatus = (goal: Goal) => {
    if (goal.status === 'completed') return { text: 'Completed', color: 'green' }
    if (goal.status === 'paused') return { text: 'Paused', color: 'gray' }
    if (goal.status === 'cancelled') return { text: 'Cancelled', color: 'red' }
    
    // Active goals - determine status by progress and due date
    const now = new Date()
    const dueDate = goal.due_date ? new Date(goal.due_date) : null
    const daysUntilDue = dueDate ? Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null
    
    if (goal.progress_percentage >= 90) return { text: 'On Track', color: 'green' }
    if (goal.progress_percentage >= 70) return { text: 'On Track', color: 'green' }
    if (goal.progress_percentage < 50) return { text: 'Behind', color: 'red' }
    if (daysUntilDue && daysUntilDue < 7 && goal.progress_percentage < 70) return { text: 'Behind', color: 'red' }
    return { text: 'At Risk', color: 'yellow' }  // 50-69% progress
  }

  const startEditingKeyResult = (keyResult: KeyResult) => {
    setEditingKeyResult(keyResult.id)
    setUpdateValues({
      ...updateValues,
      [keyResult.id]: {
        current_value: keyResult.current_value || '0',
        progress_percentage: keyResult.progress_percentage,
        weight: keyResult.weight || 1.0
      }
    })
  }

  const cancelEditingKeyResult = () => {
    setEditingKeyResult(null)
    setUpdateValues({})
  }

  const updateKeyResult = async (keyResultId: string) => {
    if (!updateValues[keyResultId] || !id) return
    
    setUpdating(true)
    try {
      const { current_value, progress_percentage, weight } = updateValues[keyResultId]
      
      const { error } = await supabase
        .from('align_key_results')
        .update({
          current_value,
          progress_percentage: Math.max(0, Math.min(100, progress_percentage)),
          weight: Math.max(0.1, Math.min(10, weight)),
          status: progress_percentage >= 100 ? 'completed' : 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', keyResultId)

      if (error) throw error

      // Update local state
      setKeyResults(prev => prev.map(kr => 
        kr.id === keyResultId ? {
          ...kr,
          current_value,
          progress_percentage: Math.max(0, Math.min(100, progress_percentage)),
          weight: Math.max(0.1, Math.min(10, weight)),
          status: progress_percentage >= 100 ? 'completed' : 'active'
        } : kr
      ))

      // Update the goal's overall progress based on weighted key results
      const newGoalProgress = await updateGoalProgressFromKeyResults(id)
      
      // Update local goal state
      setGoal(prev => prev ? { ...prev, progress_percentage: newGoalProgress } : null)

      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          product: 'align',
          action: 'key_result_updated',
          entity_type: 'key_result',
          entity_id: keyResultId,
          details: {
            current_value,
            progress_percentage,
            weight,
            goal_id: id,
            new_goal_progress: newGoalProgress
          }
        })

      setEditingKeyResult(null)
      setUpdateValues({})
    } catch (err) {
      console.error('Error updating key result:', err)
    } finally {
      setUpdating(false)
    }
  }

  const calculateAutoProgress = (keyResultId: string, currentValue: string) => {
    const keyResult = keyResults.find(kr => kr.id === keyResultId)
    if (!keyResult || !keyResult.target_value) return 0
    
    const current = parseFloat(currentValue) || 0
    const target = parseFloat(keyResult.target_value) || 1
    return Math.max(0, Math.min(100, Math.round((current / target) * 100)))
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Loader2 className="h-8 w-8 text-sky-400 animate-spin" />
            <span className="text-slate-300">Loading goal details...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !goal) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center py-12 glass-card">
          <div className="text-red-400 mb-2">Error loading goal</div>
          <div className="text-slate-500 text-sm">{error || 'Goal not found'}</div>
          <Link
            to="/goals"
            className="text-sky-400 hover:text-sky-300 text-sm mt-4 inline-block"
          >
            ← Back to Goals
          </Link>
        </div>
      </div>
    )
  }

  const status = getGoalStatus(goal)
  
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/goals"
          className="glass-button p-2 text-slate-300 hover:text-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-100">{goal.title}</h1>
          <p className="text-slate-400 mt-1">{goal.description}</p>
        </div>
        <Link
          to={`/goals/${id}/edit`}
          className="glass-button text-sky-300 hover:text-sky-200 px-4 py-2 flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Link>
      </div>

      {/* Status and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-100">Overall Progress</h3>
            <Target className="w-5 h-5 text-sky-400" />
          </div>
          <div className="text-3xl font-bold text-slate-100 mb-2">{goal.progress_percentage}%</div>
          <div className="w-full bg-slate-700/50 rounded-full h-3 mb-4">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                status.color === 'green' ? 'bg-green-500' : 
                status.color === 'yellow' ? 'bg-yellow-500' :
                status.color === 'red' ? 'bg-red-500' : 'bg-gray-500'
              }`}
              style={{ width: `${goal.progress_percentage}%` }}
            />
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              status.color === 'green'
                ? 'bg-green-500/20 text-green-400'
                : status.color === 'yellow'
                ? 'bg-yellow-500/20 text-yellow-400'
                : status.color === 'red'
                ? 'bg-red-500/20 text-red-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}
          >
            {status.text}
          </span>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-100">Goal Details</h3>
            <BarChart className="w-5 h-5 text-green-400" />
          </div>
          <div className="space-y-3">
            {goal.owner_id && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">Owner:</span>
                <span className="text-sm text-slate-100">{goal.owner_id}</span>
              </div>
            )}
            {goal.due_date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">Due:</span>
                <span className="text-sm text-slate-100">
                  {new Date(goal.due_date).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">Priority:</span>
              <span className={`text-sm px-2 py-1 rounded-full ${
                goal.priority === 'high' 
                  ? 'bg-red-500/20 text-red-400' 
                  : goal.priority === 'medium'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-blue-500/20 text-blue-400'
              }`}>
                {goal.priority}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-100">Key Results</h3>
            <span className="text-2xl font-bold text-slate-100">{keyResults.length}</span>
          </div>
          <div className="text-sm text-slate-400 mb-2">
            {keyResults.filter(kr => kr.progress_percentage >= 100).length} completed
          </div>
          <div className="text-sm text-slate-400">
            {keyResults.filter(kr => kr.progress_percentage < 100).length} in progress
          </div>
        </div>
      </div>

      {/* Key Results */}
      {keyResults.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-6">Key Results</h2>
          <div className="space-y-4">
            {keyResults.map((keyResult) => {
              const krStatus = keyResult.status === 'completed' ? 'Completed' :
                               keyResult.progress_percentage >= 70 ? 'On Track' :
                               'At Risk'
              const krStatusColor = keyResult.status === 'completed' ? 'green' :
                                   keyResult.progress_percentage >= 70 ? 'green' :
                                   'yellow'
              
              const isEditing = editingKeyResult === keyResult.id
              const currentValues = updateValues[keyResult.id]
              
              return (
                <div key={keyResult.id} className="glass-card p-4 bg-slate-800/40">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-slate-100">{keyResult.title}</h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          krStatusColor === 'green'
                            ? 'bg-green-500/20 text-green-400'
                            : krStatusColor === 'yellow'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {krStatus}
                      </span>
                      {!isEditing && (
                        <button
                          onClick={() => startEditingKeyResult(keyResult)}
                          className="text-slate-400 hover:text-sky-400 p-1"
                          title="Update progress"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {keyResult.description && (
                    <p className="text-sm text-slate-400 mb-3">{keyResult.description}</p>
                  )}
                  
                  {isEditing ? (
                    // Edit mode
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm text-slate-400 mb-1">Current Value</label>
                          <input
                            type="text"
                            value={currentValues?.current_value || ''}
                            onChange={(e) => {
                              const newValue = e.target.value
                              const autoProgress = calculateAutoProgress(keyResult.id, newValue)
                              setUpdateValues({
                                ...updateValues,
                                [keyResult.id]: {
                                  current_value: newValue,
                                  progress_percentage: autoProgress,
                                  weight: currentValues?.weight || 1.0
                                }
                              })
                            }}
                            className="glass-input w-full px-3 py-2 text-slate-100"
                            placeholder={`Enter current value (${keyResult.unit})`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-slate-400 mb-1">Progress %</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={currentValues?.progress_percentage || 0}
                            onChange={(e) => setUpdateValues({
                              ...updateValues,
                              [keyResult.id]: {
                                ...currentValues,
                                progress_percentage: parseInt(e.target.value) || 0
                              }
                            })}
                            className="glass-input w-full px-3 py-2 text-slate-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-slate-400 mb-1">Weight</label>
                          <input
                            type="number"
                            min="0.1"
                            max="10"
                            step="0.1"
                            value={currentValues?.weight || 1.0}
                            onChange={(e) => setUpdateValues({
                              ...updateValues,
                              [keyResult.id]: {
                                ...currentValues,
                                weight: parseFloat(e.target.value) || 1.0
                              }
                            })}
                            className="glass-input w-full px-3 py-2 text-slate-100"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateKeyResult(keyResult.id)}
                          disabled={updating}
                          className="bg-sky-500 hover:bg-sky-600 disabled:bg-sky-500/50 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                        >
                          {updating ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              Save
                            </>
                          )}
                        </button>
                        <button
                          onClick={cancelEditingKeyResult}
                          className="glass-button text-slate-400 hover:text-slate-200 px-4 py-2 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <span className="text-sm text-slate-400">Current:</span>
                          <span className="text-sm text-slate-100 ml-2">
                            {keyResult.current_value || '0'} {keyResult.unit}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-slate-400">Target:</span>
                          <span className="text-sm text-slate-100 ml-2">
                            {keyResult.target_value} {keyResult.unit}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-slate-400">Progress:</span>
                          <span className="text-sm text-slate-100 ml-2">{keyResult.progress_percentage}%</span>
                        </div>
                        <div>
                          <span className="text-sm text-slate-400">Weight:</span>
                          <span className="text-sm text-slate-100 ml-2">{keyResult.weight || 1.0}</span>
                        </div>
                      </div>

                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            krStatusColor === 'green' ? 'bg-green-500' : 
                            krStatusColor === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${keyResult.progress_percentage}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Progress Timeline */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-6">Progress Timeline</h2>
        {progressHistory.length > 0 ? (
          <div className="space-y-4">
            {progressHistory.map((entry, index) => (
              <div key={entry.id || index} className="flex items-center gap-4">
                <div className="w-2 h-2 bg-sky-500 rounded-full flex-shrink-0" />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-slate-100">{entry.progress_percentage}% complete</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <div className="text-sm">No progress updates yet</div>
            <div className="text-xs mt-1">Progress updates will appear here as they are added</div>
          </div>
        )}
      </div>
    </div>
  )
}