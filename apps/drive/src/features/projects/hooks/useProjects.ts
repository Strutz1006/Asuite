import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@aesyros/supabase'
import type { Database } from '@aesyros/supabase'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

// Type definitions based on the actual database schema
type DriveProjectUpdate = Database['public']['Tables']['drive_projects']['Update']

export interface Project {
  id: string
  organization_id: string
  name: string
  description?: string | null
  status: 'planning' | 'active' | 'on-hold' | 'completed'
  health: 'excellent' | 'good' | 'at-risk' | 'critical'
  priority: 'low' | 'medium' | 'high' | 'critical'
  owner_id?: string | null
  align_goal_id?: string | null
  department_id?: string | null
  team_id?: string | null
  start_date?: string | null
  due_date?: string | null
  completion_date?: string | null
  budget_allocated?: number | null
  budget_spent?: number | null
  progress_percentage: number
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  tags?: string[]
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
  // Joined data
  owner?: {
    id: string
    full_name?: string
    avatar_url?: string
  }
  align_goal?: {
    id: string
    title: string
  }
  department?: {
    id: string
    name: string
  }
  team?: {
    id: string
    name: string
  }
  // Calculated fields
  task_stats?: {
    total_tasks: number
    completed_tasks: number
    in_progress_tasks: number
  }
  team_size?: number
}

export interface ProjectStats {
  total: number
  planning: number
  active: number
  onHold: number
  completed: number
  atRisk: number
  avgProgress: number
  totalBudget: number
  totalSpent: number
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [realtimeEnabled, setRealtimeEnabled] = useState(true)

  // Fetch all projects with related data and calculated metrics
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // First, fetch projects with basic joins
      const { data: projectsData, error: fetchError } = await supabase
        .from('drive_projects')
        .select(`
          *,
          owner:users(id, full_name, avatar_url),
          align_goal:align_objectives(id, title),
          department:departments(id, name),
          team:teams(id, name)
        `)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      // Enhance projects with calculated metrics
      const enhancedProjects: Project[] = await Promise.all(
        (projectsData || []).map(async (project) => {
          // Get task statistics for this project
          const { data: taskStats } = await supabase
            .from('drive_tasks')
            .select('status')
            .eq('project_id', project.id)

          const total_tasks = taskStats?.length || 0
          const completed_tasks = taskStats?.filter(t => t.status === 'done').length || 0
          const in_progress_tasks = taskStats?.filter(t => t.status === 'in-progress').length || 0

          // Get team size (count of unique assignees in project tasks)
          const { data: teamMembers } = await supabase
            .from('drive_tasks')
            .select('assignee_id')
            .eq('project_id', project.id)
            .not('assignee_id', 'is', null)

          const uniqueAssignees = new Set(teamMembers?.map(t => t.assignee_id).filter(Boolean))
          const team_size = uniqueAssignees.size

          return {
            ...project,
            status: project.status as Project['status'],
            health: project.health as Project['health'],
            priority: project.priority as Project['priority'],
            risk_level: project.risk_level as Project['risk_level'],
            progress_percentage: project.progress_percentage || 0,
            tags: Array.isArray(project.tags) ? project.tags : [],
            metadata: project.metadata || {},
            task_stats: {
              total_tasks,
              completed_tasks,
              in_progress_tasks
            },
            team_size
          }
        })
      )

      setProjects(enhancedProjects)
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }, [])

  // Create a new project
  const createProject = async (projectData: Partial<Project>) => {
    try {
      const { data, error: createError } = await supabase
        .from('drive_projects')
        .insert({
          name: projectData.name!,
          description: projectData.description,
          status: projectData.status || 'planning',
          health: projectData.health || 'good',
          priority: projectData.priority || 'medium',
          owner_id: projectData.owner_id,
          department_id: projectData.department_id,
          team_id: projectData.team_id,
          start_date: projectData.start_date,
          due_date: projectData.due_date,
          budget_allocated: projectData.budget_allocated,
          risk_level: projectData.risk_level || 'low',
          tags: projectData.tags || [],
          metadata: projectData.metadata || {},
          progress_percentage: 0
        })
        .select(`
          *,
          owner:users(id, full_name, avatar_url),
          align_goal:align_objectives(id, title),
          department:departments(id, name),
          team:teams(id, name)
        `)
        .single()

      if (createError) throw createError

      // Transform and add to local state
      const newProject: Project = {
        ...data,
        status: data.status as Project['status'],
        health: data.health as Project['health'],
        priority: data.priority as Project['priority'],
        risk_level: data.risk_level as Project['risk_level'],
        progress_percentage: data.progress_percentage || 0,
        tags: Array.isArray(data.tags) ? data.tags : [],
        metadata: data.metadata || {},
        task_stats: { total_tasks: 0, completed_tasks: 0, in_progress_tasks: 0 },
        team_size: 0
      }

      setProjects(prev => [newProject, ...prev])

      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          product: 'drive',
          action: 'project_created',
          entity_type: 'project',
          entity_id: data.id,
          details: {
            name: projectData.name,
            status: projectData.status,
            priority: projectData.priority
          }
        })

      return newProject
    } catch (err) {
      console.error('Error creating project:', err)
      throw err
    }
  }

  // Update an existing project
  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      const updateData: DriveProjectUpdate = {
        name: updates.name,
        description: updates.description,
        status: updates.status,
        health: updates.health,
        priority: updates.priority,
        owner_id: updates.owner_id,
        department_id: updates.department_id,
        team_id: updates.team_id,
        start_date: updates.start_date,
        due_date: updates.due_date,
        end_date: updates.completion_date,
        budget_allocated: updates.budget_allocated,
        budget_spent: updates.budget_spent,
        progress_percentage: updates.progress_percentage,
        risk_level: updates.risk_level,
        tags: updates.tags,
        metadata: updates.metadata,
        updated_at: new Date().toISOString()
      }

      // Auto-complete if progress reaches 100%
      if (updates.progress_percentage === 100 && updates.status !== 'completed') {
        updateData.status = 'completed'
        updateData.end_date = new Date().toISOString().split('T')[0]
      }

      const { data, error: updateError } = await supabase
        .from('drive_projects')
        .update(updateData)
        .eq('id', projectId)
        .select(`
          *,
          owner:users(id, full_name, avatar_url),
          align_goal:align_objectives(id, title),
          department:departments(id, name),
          team:teams(id, name)
        `)
        .single()

      if (updateError) throw updateError

      // Transform and update local state
      const updatedProject: Project = {
        ...data,
        status: data.status as Project['status'],
        health: data.health as Project['health'],
        priority: data.priority as Project['priority'],
        risk_level: data.risk_level as Project['risk_level'],
        progress_percentage: data.progress_percentage || 0,
        tags: Array.isArray(data.tags) ? data.tags : [],
        metadata: data.metadata || {}
      }

      setProjects(prev => prev.map(project => 
        project.id === projectId ? { ...project, ...updatedProject } : project
      ))

      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          product: 'drive',
          action: 'project_updated',
          entity_type: 'project',
          entity_id: projectId,
          details: {
            name: updates.name,
            status: updates.status,
            priority: updates.priority
          }
        })

      return updatedProject
    } catch (err) {
      console.error('Error updating project:', err)
      throw err
    }
  }

  // Delete a project
  const deleteProject = async (projectId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('drive_projects')
        .delete()
        .eq('id', projectId)

      if (deleteError) throw deleteError

      // Remove from local state
      setProjects(prev => prev.filter(project => project.id !== projectId))

      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          product: 'drive',
          action: 'project_deleted',
          entity_type: 'project',
          entity_id: projectId
        })

    } catch (err) {
      console.error('Error deleting project:', err)
      throw err
    }
  }

  // Get project statistics
  const getProjectStats = useCallback((): ProjectStats => {
    const total = projects.length
    const planning = projects.filter(p => p.status === 'planning').length
    const active = projects.filter(p => p.status === 'active').length
    const onHold = projects.filter(p => p.status === 'on-hold').length
    const completed = projects.filter(p => p.status === 'completed').length
    const atRisk = projects.filter(p => 
      p.health === 'at-risk' || p.health === 'critical'
    ).length
    const avgProgress = total > 0 
      ? Math.round(projects.reduce((sum, p) => sum + p.progress_percentage, 0) / total)
      : 0
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget_allocated || 0), 0)
    const totalSpent = projects.reduce((sum, p) => sum + (p.budget_spent || 0), 0)

    return { 
      total, planning, active, onHold, completed, atRisk, 
      avgProgress, totalBudget, totalSpent 
    }
  }, [projects])

  // Get projects by status
  const getProjectsByStatus = useCallback((status: Project['status']) => {
    return projects.filter(project => project.status === status)
  }, [projects])

  // Get projects by owner
  const getProjectsByOwner = useCallback((ownerId: string) => {
    return projects.filter(project => project.owner_id === ownerId)
  }, [projects])

  // Get overdue projects
  const getOverdueProjects = useCallback(() => {
    return projects.filter(project => 
      project.due_date && 
      new Date(project.due_date) < new Date() && 
      project.status !== 'completed'
    )
  }, [projects])

  // Handle real-time updates
  const handleRealtimeUpdate = useCallback((payload: RealtimePostgresChangesPayload<any>) => {
    console.log('Real-time project update received:', payload)

    switch (payload.eventType) {
      case 'INSERT':
      case 'UPDATE':
        // Refresh data to get calculated fields
        fetchProjects()
        break
      case 'DELETE':
        setProjects(prev => prev.filter(project => project.id !== payload.old.id))
        break
    }
  }, [fetchProjects])

  // Set up real-time subscriptions
  useEffect(() => {
    fetchProjects()

    // Subscribe to project changes
    const subscription = supabase
      .channel('drive_projects_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'drive_projects'
        },
        handleRealtimeUpdate
      )
      .subscribe((status) => {
        console.log('Projects real-time subscription status:', status)
        setRealtimeEnabled(status === 'SUBSCRIBED')
      })

    // Also subscribe to task changes since they affect project metrics
    const taskSubscription = supabase
      .channel('drive_tasks_for_projects')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'drive_tasks'
        },
        () => {
          // Refresh projects when tasks change to update metrics
          fetchProjects()
        }
      )
      .subscribe()

    // Cleanup subscriptions on unmount
    return () => {
      subscription.unsubscribe()
      taskSubscription.unsubscribe()
    }
  }, [handleRealtimeUpdate, fetchProjects])

  // Function to toggle real-time updates
  const toggleRealtime = useCallback(() => {
    setRealtimeEnabled(prev => !prev)
  }, [])

  // Function to manually refresh projects
  const refreshProjects = useCallback(() => {
    return fetchProjects()
  }, [fetchProjects])

  return {
    projects,
    loading,
    error,
    realtimeEnabled,
    // CRUD operations
    createProject,
    updateProject,
    deleteProject,
    // Queries
    getProjectStats,
    getProjectsByStatus,
    getProjectsByOwner,
    getOverdueProjects,
    // Utilities
    refreshProjects,
    toggleRealtime,
    fetchProjects
  }
}