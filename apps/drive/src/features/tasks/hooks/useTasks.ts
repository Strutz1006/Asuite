import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@aesyros/supabase'
import type { Database } from '@aesyros/supabase'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

// Type definitions based on the actual database schema
type DriveTaskUpdate = Database['public']['Tables']['drive_tasks']['Update']

export interface Task {
  id: string
  organization_id: string
  project_id?: string | null
  title: string
  description?: string | null
  status: 'todo' | 'in-progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee_id?: string | null
  align_goal_id?: string | null
  due_date?: string | null
  completion_date?: string | null
  estimated_hours?: number | null
  actual_hours?: number | null
  progress_percentage: number
  tags?: string[]
  dependencies?: string[]
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
  // Joined data
  assignee?: {
    id: string
    full_name?: string
    avatar_url?: string
  }
  project?: {
    id: string
    name: string
  }
  align_goal?: {
    id: string
    title: string
  }
}

export interface TaskStats {
  total: number
  todo: number
  inProgress: number
  review: number
  done: number
  overdue: number
  avgProgress: number
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [realtimeEnabled, setRealtimeEnabled] = useState(true)

  // Fetch all tasks with related data
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('drive_tasks')
        .select(`
          *,
          assignee:users(id, full_name, avatar_url),
          project:drive_projects(id, name),
          align_goal:align_objectives(id, title)
        `)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      // Transform data to match our Task interface
      const transformedTasks: Task[] = (data || []).map(task => ({
        ...task,
        status: task.status as Task['status'],
        priority: task.priority as Task['priority'],
        progress_percentage: task.progress_percentage || 0,
        tags: Array.isArray(task.tags) ? task.tags : [],
        dependencies: Array.isArray(task.dependencies) ? task.dependencies : [],
        metadata: task.metadata || {}
      }))

      setTasks(transformedTasks)
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }, [])

  // Create a new task
  const createTask = async (taskData: Partial<Task>) => {
    try {
      const { data, error: createError } = await supabase
        .from('drive_tasks')
        .insert({
          title: taskData.title!,
          description: taskData.description,
          status: taskData.status || 'todo',
          priority: taskData.priority || 'medium',
          assignee_id: taskData.assignee_id,
          project_id: taskData.project_id,
          due_date: taskData.due_date,
          estimated_hours: taskData.estimated_hours,
          tags: taskData.tags || [],
          dependencies: taskData.dependencies || [],
          metadata: taskData.metadata || {},
          progress_percentage: 0,
          actual_hours: 0
        })
        .select(`
          *,
          assignee:users(id, full_name, avatar_url),
          project:drive_projects(id, name),
          align_goal:align_objectives(id, title)
        `)
        .single()

      if (createError) throw createError

      // Transform and add to local state
      const newTask: Task = {
        ...data,
        status: data.status as Task['status'],
        priority: data.priority as Task['priority'],
        progress_percentage: data.progress_percentage || 0,
        tags: Array.isArray(data.tags) ? data.tags : [],
        dependencies: Array.isArray(data.dependencies) ? data.dependencies : [],
        metadata: data.metadata || {}
      }

      setTasks(prev => [newTask, ...prev])

      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          product: 'drive',
          action: 'task_created',
          entity_type: 'task',
          entity_id: data.id,
          details: {
            title: taskData.title,
            status: taskData.status,
            priority: taskData.priority
          }
        })

      return newTask
    } catch (err) {
      console.error('Error creating task:', err)
      throw err
    }
  }

  // Update an existing task
  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const updateData: DriveTaskUpdate = {
        title: updates.title,
        description: updates.description,
        status: updates.status,
        priority: updates.priority,
        assignee_id: updates.assignee_id,
        project_id: updates.project_id,
        due_date: updates.due_date,
        end_date: updates.completion_date,
        estimated_hours: updates.estimated_hours,
        actual_hours: updates.actual_hours,
        progress_percentage: updates.progress_percentage,
        tags: updates.tags,
        dependencies: updates.dependencies,
        metadata: updates.metadata,
        updated_at: new Date().toISOString()
      }

      // Auto-complete if progress reaches 100%
      if (updates.progress_percentage === 100 && updates.status !== 'done') {
        updateData.status = 'done'
        updateData.end_date = new Date().toISOString().split('T')[0]
      }

      const { data, error: updateError } = await supabase
        .from('drive_tasks')
        .update(updateData)
        .eq('id', taskId)
        .select(`
          *,
          assignee:users(id, full_name, avatar_url),
          project:drive_projects(id, name),
          align_goal:align_objectives(id, title)
        `)
        .single()

      if (updateError) throw updateError

      // Transform and update local state
      const updatedTask: Task = {
        ...data,
        status: data.status as Task['status'],
        priority: data.priority as Task['priority'],
        progress_percentage: data.progress_percentage || 0,
        tags: Array.isArray(data.tags) ? data.tags : [],
        dependencies: Array.isArray(data.dependencies) ? data.dependencies : [],
        metadata: data.metadata || {}
      }

      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ))

      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          product: 'drive',
          action: 'task_updated',
          entity_type: 'task',
          entity_id: taskId,
          details: {
            title: updates.title,
            status: updates.status,
            priority: updates.priority
          }
        })

      return updatedTask
    } catch (err) {
      console.error('Error updating task:', err)
      throw err
    }
  }

  // Update task progress
  const updateTaskProgress = async (taskId: string, progress: number) => {
    return updateTask(taskId, { progress_percentage: progress })
  }

  // Update task status
  const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    const updates: Partial<Task> = { status }
    if (status === 'done') {
      updates.progress_percentage = 100
      updates.end_date = new Date().toISOString().split('T')[0]
    }
    return updateTask(taskId, updates)
  }

  // Delete a task
  const deleteTask = async (taskId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('drive_tasks')
        .delete()
        .eq('id', taskId)

      if (deleteError) throw deleteError

      // Remove from local state
      setTasks(prev => prev.filter(task => task.id !== taskId))

      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          product: 'drive',
          action: 'task_deleted',
          entity_type: 'task',
          entity_id: taskId
        })

    } catch (err) {
      console.error('Error deleting task:', err)
      throw err
    }
  }

  // Get task statistics
  const getTaskStats = useCallback((): TaskStats => {
    const total = tasks.length
    const todo = tasks.filter(t => t.status === 'todo').length
    const inProgress = tasks.filter(t => t.status === 'in-progress').length
    const review = tasks.filter(t => t.status === 'review').length
    const done = tasks.filter(t => t.status === 'done').length
    const overdue = tasks.filter(t => 
      t.due_date && 
      new Date(t.due_date) < new Date() && 
      t.status !== 'done'
    ).length
    const avgProgress = total > 0 
      ? Math.round(tasks.reduce((sum, t) => sum + t.progress_percentage, 0) / total)
      : 0

    return { total, todo, inProgress, review, done, overdue, avgProgress }
  }, [tasks])

  // Get tasks by status
  const getTasksByStatus = useCallback((status: Task['status']) => {
    return tasks.filter(task => task.status === status)
  }, [tasks])

  // Get tasks by assignee
  const getTasksByAssignee = useCallback((assigneeId: string) => {
    return tasks.filter(task => task.assignee_id === assigneeId)
  }, [tasks])

  // Get tasks by project
  const getTasksByProject = useCallback((projectId: string) => {
    return tasks.filter(task => task.project_id === projectId)
  }, [tasks])

  // Get overdue tasks
  const getOverdueTasks = useCallback(() => {
    return tasks.filter(task => 
      task.due_date && 
      new Date(task.due_date) < new Date() && 
      task.status !== 'done'
    )
  }, [tasks])

  // Handle real-time updates
  const handleRealtimeUpdate = useCallback((payload: RealtimePostgresChangesPayload<any>) => {
    console.log('Real-time task update received:', payload)

    switch (payload.eventType) {
      case 'INSERT':
        // Fetch the full task with relations
        fetchTasks()
        break
      case 'UPDATE':
        setTasks(prev => prev.map(task => 
          task.id === payload.new.id 
            ? { ...task, ...payload.new, updated_at: payload.new.updated_at }
            : task
        ))
        break
      case 'DELETE':
        setTasks(prev => prev.filter(task => task.id !== payload.old.id))
        break
    }
  }, [fetchTasks])

  // Set up real-time subscriptions
  useEffect(() => {
    fetchTasks()

    // Subscribe to task changes
    const subscription = supabase
      .channel('drive_tasks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'drive_tasks'
        },
        handleRealtimeUpdate
      )
      .subscribe((status) => {
        console.log('Tasks real-time subscription status:', status)
        setRealtimeEnabled(status === 'SUBSCRIBED')
      })

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [handleRealtimeUpdate, fetchTasks])

  // Function to toggle real-time updates
  const toggleRealtime = useCallback(() => {
    setRealtimeEnabled(prev => !prev)
  }, [])

  // Function to manually refresh tasks
  const refreshTasks = useCallback(() => {
    return fetchTasks()
  }, [fetchTasks])

  return {
    tasks,
    loading,
    error,
    realtimeEnabled,
    // CRUD operations
    createTask,
    updateTask,
    updateTaskProgress,
    updateTaskStatus,
    deleteTask,
    // Queries
    getTaskStats,
    getTasksByStatus,
    getTasksByAssignee,
    getTasksByProject,
    getOverdueTasks,
    // Utilities
    refreshTasks,
    toggleRealtime,
    fetchTasks
  }
}