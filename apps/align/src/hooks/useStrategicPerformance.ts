import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'

interface PerformanceData {
  strategicLikelihood: number
  riskFactors: string[]
  confidenceInterval: [number, number]
  recommendations: string[]
  breakdown: {
    onTrack: number
    atRisk: number
    behind: number
    total: number
  }
  objectiveAlignment: {
    aligned: number
    total: number
    score: number
  }
}

interface Goal {
  id: string
  title: string
  progress_percentage: number
  due_date: string
  status: string
  priority: string
  parent_id?: string
  linkedObjective?: string
}

interface Objective {
  id: string
  title: string
  progress_percentage: number
}

export function useStrategicPerformance(goals: Goal[], objectives: Objective[]) {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Memoize goals and objectives to prevent infinite re-renders
  const memoizedGoals = useMemo(() => goals, [JSON.stringify(goals.map(g => ({ id: g.id, progress: g.progress_percentage, due_date: g.due_date })))])
  const memoizedObjectives = useMemo(() => objectives, [JSON.stringify(objectives.map(o => ({ id: o.id, progress: o.progress_percentage })))])

  useEffect(() => {
    if (memoizedGoals.length === 0) {
      // If no goals, provide basic empty state
      setPerformanceData({
        strategicLikelihood: 0,
        riskFactors: ['No goals available for analysis'],
        confidenceInterval: [0, 0],
        recommendations: ['Create strategic goals to enable performance tracking'],
        breakdown: { onTrack: 0, atRisk: 0, behind: 0, total: 0 },
        objectiveAlignment: { aligned: 0, total: 0, score: 0 }
      })
      return
    }

    calculatePerformance()
  }, [memoizedGoals, memoizedObjectives])

  const calculatePerformance = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log('Calling strategic performance Edge Function...')
      
      const { data, error: functionError } = await supabase.functions.invoke(
        'calculate-strategic-performance',
        {
          body: {
            goals: memoizedGoals.map(goal => ({
              id: goal.id,
              title: goal.title,
              progress_percentage: goal.progress_percentage || 0,
              due_date: goal.due_date || '',
              status: goal.status || 'active',
              priority: goal.priority || 'medium',
              parent_id: goal.parent_id,
              linkedObjective: goal.linkedObjective
            })),
            objectives: memoizedObjectives.map(obj => ({
              id: obj.id,
              title: obj.title,
              progress_percentage: obj.progress_percentage || 0
            })),
            timeframe: 'current_year'
          }
        }
      )

      if (functionError) {
        console.error('Edge Function error:', functionError)
        // Fallback to simple calculation if Edge Function fails
        setPerformanceData(calculateSimpleFallback(memoizedGoals, memoizedObjectives))
        return
      }

      console.log('Strategic performance data received:', data)
      setPerformanceData(data)

    } catch (err) {
      console.error('Error calling strategic performance function:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      // Fallback to simple calculation
      setPerformanceData(calculateSimpleFallback(memoizedGoals, memoizedObjectives))
    } finally {
      setLoading(false)
    }
  }

  // Fallback calculation if Edge Function is unavailable
  const calculateSimpleFallback = (goals: Goal[], objectives: Objective[]): PerformanceData => {
    const currentYear = new Date().getFullYear()
    const yearEndGoals = goals.filter(g => {
      if (!g.due_date) return false
      return new Date(g.due_date).getFullYear() === currentYear
    })
    
    const onTrackGoals = yearEndGoals.filter(g => g.progress_percentage >= 70).length
    const atRiskGoals = yearEndGoals.filter(g => g.progress_percentage >= 40 && g.progress_percentage < 70).length
    const behindGoals = yearEndGoals.filter(g => g.progress_percentage < 40).length
    
    const strategicLikelihood = yearEndGoals.length > 0
      ? Math.round(((onTrackGoals * 1.0 + atRiskGoals * 0.6 + behindGoals * 0.2) / yearEndGoals.length) * 100)
      : 0

    const alignedGoals = goals.filter(g => g.parent_id || g.linkedObjective).length
    const alignmentScore = goals.length > 0 ? Math.round((alignedGoals / goals.length) * 100) : 100

    return {
      strategicLikelihood,
      riskFactors: strategicLikelihood < 60 ? ['Basic calculation - enhanced analysis unavailable'] : [],
      confidenceInterval: [Math.max(0, strategicLikelihood - 10), Math.min(100, strategicLikelihood + 10)],
      recommendations: ['Enhanced recommendations require Python analysis service'],
      breakdown: {
        onTrack: onTrackGoals,
        atRisk: atRiskGoals,
        behind: behindGoals,
        total: yearEndGoals.length
      },
      objectiveAlignment: {
        aligned: alignedGoals,
        total: goals.length,
        score: alignmentScore
      }
    }
  }

  return {
    performanceData,
    loading,
    error,
    refresh: calculatePerformance
  }
}