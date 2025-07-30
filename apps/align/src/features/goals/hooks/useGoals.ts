import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@aesyros/supabase'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export interface Goal {
  id: string
  organization_id: string
  title: string
  description?: string
  level: 'company' | 'department' | 'team' | 'individual'
  parent_id?: string
  owner_id?: string
  category?: string
  framework: 'smart' | 'okr' | 'objective'
  target_value?: string
  current_value?: string
  unit?: string
  progress_percentage: number
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  priority: 'high' | 'medium' | 'low'
  start_date?: string
  due_date?: string
  completion_date?: string
  tags?: string[]
  created_at: string
  updated_at: string
  department_id?: string
  team_id?: string
}

export interface KeyResult {
  id: string
  objective_id: string
  title: string
  description?: string
  target_value?: string
  current_value?: string
  unit?: string
  progress_percentage: number
  weight: number
  status: 'active' | 'completed' | 'paused'
  due_date?: string
  completion_date?: string
  created_at: string
  updated_at: string
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [realtimeEnabled, setRealtimeEnabled] = useState(true)

  // Fetch all goals
  const fetchGoals = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('align_objectives')
        .select(`
          *,
          owner:users(id, full_name),
          department:departments(id, name),
          team:teams(id, name)
        `)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setGoals(data || [])
    } catch (err) {
      console.error('Error fetching goals:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch goals')
    } finally {
      setLoading(false)
    }
  }

  // Create a new goal
  const createGoal = async (goalData: Partial<Goal>) => {
    try {
      const { data, error: createError } = await supabase
        .from('align_objectives')
        .insert({
          title: goalData.title,
          description: goalData.description,
          level: goalData.level || 'company',
          parent_id: goalData.parent_id,
          owner_id: goalData.owner_id,
          category: goalData.category,
          framework: goalData.framework || 'smart',
          target_value: goalData.target_value,
          current_value: goalData.current_value || '0',
          unit: goalData.unit,
          progress_percentage: 0,
          status: 'active',
          priority: goalData.priority || 'medium',
          start_date: goalData.start_date,
          due_date: goalData.due_date,
          tags: goalData.tags || [],
          department_id: goalData.department_id,
          team_id: goalData.team_id
        })
        .select()
        .single()

      if (createError) throw createError

      // Add to local state
      setGoals(prev => [data, ...prev])

      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          product: 'align',
          action: 'goal_created',
          entity_type: 'objective',
          entity_id: data.id,
          details: {
            title: goalData.title,
            framework: goalData.framework,
            level: goalData.level
          }
        })

      return data
    } catch (err) {
      console.error('Error creating goal:', err)
      throw err
    }
  }

  // Update goal progress
  const updateGoalProgress = async (goalId: string, progress: number, value?: string) => {
    try {
      const updateData: any = {
        progress_percentage: Math.max(0, Math.min(100, progress)),
        updated_at: new Date().toISOString()
      }

      if (value !== undefined) {
        updateData.current_value = value
      }

      // Auto-complete if progress reaches 100%
      if (progress >= 100) {
        updateData.status = 'completed'
        updateData.completion_date = new Date().toISOString()
      }

      const { data, error: updateError } = await supabase
        .from('align_objectives')
        .update(updateData)
        .eq('id', goalId)
        .select()
        .single()

      if (updateError) throw updateError

      // Update local state
      setGoals(prev => prev.map(goal => 
        goal.id === goalId ? { ...goal, ...data } : goal
      ))

      // Log progress update
      await supabase
        .from('align_progress_updates')
        .insert({
          objective_id: goalId,
          value: value || data.current_value,
          progress_percentage: progress,
          comment: `Progress updated to ${progress}%`,
          created_at: new Date().toISOString()
        })

      return data
    } catch (err) {
      console.error('Error updating goal progress:', err)
      throw err
    }
  }

  // Get a single goal by ID
  const getGoal = async (goalId: string): Promise<Goal | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('align_objectives')
        .select(`
          *,
          owner:users(id, full_name),
          department:departments(id, name),
          team:teams(id, name)
        `)
        .eq('id', goalId)
        .single()

      if (fetchError) throw fetchError

      return data
    } catch (err) {
      console.error('Error fetching goal:', err)
      return null
    }
  }

  // Update an existing goal
  const updateGoal = async (goalId: string, goalData: Partial<Goal>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('align_objectives')
        .update({
          title: goalData.title,
          description: goalData.description,
          level: goalData.level,
          parent_id: goalData.parent_id,
          owner_id: goalData.owner_id,
          category: goalData.category,
          framework: goalData.framework,
          target_value: goalData.target_value,
          current_value: goalData.current_value,
          unit: goalData.unit,
          priority: goalData.priority,
          start_date: goalData.start_date,
          due_date: goalData.due_date,
          department_id: goalData.department_id,
          team_id: goalData.team_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', goalId)
        .select()
        .single()

      if (updateError) throw updateError

      // Update local state
      setGoals(prev => prev.map(goal => 
        goal.id === goalId ? { ...goal, ...data } : goal
      ))

      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          product: 'align',
          action: 'goal_updated',
          entity_type: 'objective',
          entity_id: goalId,
          details: {
            title: goalData.title,
            framework: goalData.framework,
            level: goalData.level
          }
        })

      return data
    } catch (err) {
      console.error('Error updating goal:', err)
      throw err
    }
  }

  // Delete a goal
  const deleteGoal = async (goalId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('align_objectives')
        .delete()
        .eq('id', goalId)

      if (deleteError) throw deleteError

      // Remove from local state
      setGoals(prev => prev.filter(goal => goal.id !== goalId))

      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          product: 'align',
          action: 'goal_deleted',
          entity_type: 'objective',
          entity_id: goalId
        })

    } catch (err) {
      console.error('Error deleting goal:', err)
      throw err
    }
  }

  // Calculate weighted progress for a goal based on its key results
  const calculateGoalProgress = async (goalId: string) => {
    try {
      const { data: keyResults, error } = await supabase
        .from('align_key_results')
        .select('progress_percentage, weight')
        .eq('objective_id', goalId)
        .eq('status', 'active')

      if (error) throw error

      if (!keyResults || keyResults.length === 0) {
        return 0 // No key results, so 0% progress
      }

      // Calculate weighted average
      const totalWeight = keyResults.reduce((sum, kr) => sum + (kr.weight || 1.0), 0)
      const weightedSum = keyResults.reduce((sum, kr) => sum + (kr.progress_percentage * (kr.weight || 1.0)), 0)
      
      return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0
    } catch (error) {
      console.error('Error calculating goal progress:', error)
      return 0
    }
  }

  // Update goal progress based on key results
  const updateGoalProgressFromKeyResults = async (goalId: string) => {
    try {
      const newProgress = await calculateGoalProgress(goalId)
      
      const { error } = await supabase
        .from('align_objectives')
        .update({
          progress_percentage: newProgress,
          updated_at: new Date().toISOString()
        })
        .eq('id', goalId)

      if (error) throw error

      // Update local state
      setGoals(prev => prev.map(goal => 
        goal.id === goalId ? { ...goal, progress_percentage: newProgress } : goal
      ))

      return newProgress
    } catch (error) {
      console.error('Error updating goal progress:', error)
      throw error
    }
  }

  // Get goal statistics
  const getGoalStats = () => {
    const total = goals.length
    const completed = goals.filter(g => g.status === 'completed').length
    const onTrack = goals.filter(g => g.status === 'active' && g.progress_percentage >= 70).length
    const atRisk = goals.filter(g => g.status === 'active' && g.progress_percentage < 70).length
    const avgProgress = total > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress_percentage, 0) / total) : 0

    return {
      total,
      completed,
      onTrack,
      atRisk,
      avgProgress
    }
  }

  // Handle real-time updates
  const handleRealtimeUpdate = useCallback((payload: RealtimePostgresChangesPayload<any>) => {
    console.log('Real-time update received:', payload)

    switch (payload.eventType) {
      case 'INSERT':
        setGoals(prev => [payload.new as Goal, ...prev])
        break
      case 'UPDATE':
        setGoals(prev => prev.map(goal => 
          goal.id === payload.new.id ? { ...goal, ...payload.new } : goal
        ))
        break
      case 'DELETE':
        setGoals(prev => prev.filter(goal => goal.id !== payload.old.id))
        break
    }
  }, [])

  // Initialize data fetch and real-time subscription
  useEffect(() => {
    fetchGoals()

    // Set up real-time subscription for goals
    const subscription = supabase
      .channel('align_objectives_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'align_objectives'
        },
        handleRealtimeUpdate
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status)
        setRealtimeEnabled(status === 'SUBSCRIBED')
      })

    // Set up real-time subscription for key results to update goal progress
    const keyResultsSubscription = supabase
      .channel('align_key_results_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'align_key_results'
        },
        async (payload) => {
          console.log('Key result update received:', payload)
          
          // Recalculate goal progress when key results change
          if (payload.new?.objective_id) {
            const newProgress = await calculateGoalProgress(payload.new.objective_id)
            
            // Update the goal in local state
            setGoals(prev => prev.map(goal => 
              goal.id === payload.new.objective_id 
                ? { ...goal, progress_percentage: newProgress } 
                : goal
            ))
          }
        }
      )
      .subscribe()

    // Cleanup subscriptions on unmount
    return () => {
      subscription.unsubscribe()
      keyResultsSubscription.unsubscribe()
    }
  }, [handleRealtimeUpdate])

  // Function to toggle real-time updates
  const toggleRealtime = useCallback(() => {
    setRealtimeEnabled(prev => !prev)
  }, [])

  // Function to manually refresh goals
  const refreshGoals = useCallback(() => {
    return fetchGoals()
  }, [])

  return {
    goals,
    loading,
    error,
    realtimeEnabled,
    fetchGoals,
    refreshGoals,
    toggleRealtime,
    getGoal,
    createGoal,
    updateGoal,
    updateGoalProgress,
    deleteGoal,
    getGoalStats,
    calculateGoalProgress,
    updateGoalProgressFromKeyResults
  }
}