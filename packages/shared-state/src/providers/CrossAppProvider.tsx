import React, { useEffect, ReactNode } from 'react'
import { supabase } from '@aesyros/supabase'
import { useSharedState } from '../store'

interface CrossAppProviderProps {
  children: ReactNode
  appName: 'align' | 'drive' | 'pulse' | 'catalyst' | 'flow' | 'foresight'
}

export function CrossAppProvider({ children, appName }: CrossAppProviderProps) {
  const {
    setConnectionStatus,
    updateLastSync,
    addNotification,
    addActivity,
    setNavigationContext,
    updateGoalsCache,
    updateProjectsCache
  } = useSharedState()

  useEffect(() => {
    // Set current app context
    setNavigationContext(appName, { entryTime: new Date().toISOString() })

    // Initialize connection status
    setConnectionStatus('connecting')

    // Set up real-time subscriptions for cross-app notifications
    const notificationSubscription = supabase
      .channel('cross_app_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `target_app=eq.${appName}`
        },
        (payload) => {
          console.log('Cross-app notification received:', payload)
          
          if (payload.new) {
            addNotification({
              type: payload.new.type as any,
              source_app: payload.new.source_app as any,
              target_app: payload.new.target_app as any,
              entity_type: payload.new.entity_type as any,
              entity_id: payload.new.entity_id,
              title: payload.new.title,
              message: payload.new.message,
              data: payload.new.data,
              read: false
            })
          }
        }
      )
      .subscribe((status) => {
        console.log(`Cross-app notifications subscription (${appName}):`, status)
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 'disconnected')
        if (status === 'SUBSCRIBED') {
          updateLastSync()
        }
      })

    // Set up activity log subscription for cross-app events
    const activitySubscription = supabase
      .channel('cross_app_activity')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_logs'
        },
        (payload) => {
          if (payload.new && payload.new.product !== appName) {
            // Only add activities from other apps to avoid duplicates
            addActivity({
              product: payload.new.product,
              action: payload.new.action,
              entity_type: payload.new.entity_type,
              entity_id: payload.new.entity_id,
              user_id: payload.new.user_id,
              details: payload.new.details || {}
            })
          }
        }
      )
      .subscribe()

    // Subscribe to goal changes (for Drive app integration)
    let goalSubscription: any = null
    if (appName === 'drive') {
      goalSubscription = supabase
        .channel('goals_for_drive')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'align_objectives'
          },
          async () => {
            // Refresh goals cache when goals change
            const { data: goals } = await supabase
              .from('align_objectives')
              .select('id, title, progress_percentage, status')
              .eq('status', 'active')
              .order('title')
            
            if (goals) {
              updateGoalsCache(goals)
            }
          }
        )
        .subscribe()
    }

    // Subscribe to project changes (for Align app integration)
    let projectSubscription: any = null
    if (appName === 'align') {
      projectSubscription = supabase
        .channel('projects_for_align')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'drive_projects'
          },
          async () => {
            // Refresh projects cache when projects change
            const { data: projects } = await supabase
              .from('drive_projects')
              .select('id, name, status, progress_percentage')
              .order('name')
            
            if (projects) {
              updateProjectsCache(projects)
            }
          }
        )
        .subscribe()
    }

    // Initial data load
    const loadInitialData = async () => {
      try {
        // Load goals cache for Drive app
        if (appName === 'drive') {
          const { data: goals } = await supabase
            .from('align_objectives')
            .select('id, title, progress_percentage, status')
            .eq('status', 'active')
            .order('title')
          
          if (goals) {
            updateGoalsCache(goals)
          }
        }

        // Load projects cache for Align app
        if (appName === 'align') {
          const { data: projects } = await supabase
            .from('drive_projects')
            .select('id, name, status, progress_percentage')
            .order('name')
          
          if (projects) {
            updateProjectsCache(projects)
          }
        }

        updateLastSync()
      } catch (error) {
        console.error('Error loading initial cross-app data:', error)
      }
    }

    loadInitialData()

    // Cleanup subscriptions on unmount
    return () => {
      notificationSubscription.unsubscribe()
      activitySubscription.unsubscribe()
      if (goalSubscription) goalSubscription.unsubscribe()
      if (projectSubscription) projectSubscription.unsubscribe()
    }
  }, [appName])

  return <>{children}</>
}

// Hook to send cross-app notifications
export function useCrossAppNotifications() {
  const addNotification = useSharedState((state) => state.addNotification)

  const sendNotification = async (
    targetApp: string,
    type: string,
    entityType: string,
    entityId: string,
    title: string,
    message: string,
    data?: Record<string, any>
  ) => {
    try {
      await supabase
        .from('notifications')
        .insert({
          type,
          source_app: useSharedState.getState().currentApp,
          target_app: targetApp,
          entity_type: entityType,
          entity_id: entityId,
          title,
          message,
          data,
          read: false
        })
    } catch (error) {
      console.error('Error sending cross-app notification:', error)
    }
  }

  return { sendNotification }
}

// Hook to manage cross-app links
export function useCrossAppLinks() {
  const createLink = async (
    sourceApp: string,
    sourceEntityType: string,
    sourceEntityId: string,
    targetApp: string,
    targetEntityType: string,
    targetEntityId: string,
    relationshipType: 'alignment' | 'dependency' | 'milestone' | 'reference',
    metadata?: Record<string, any>
  ) => {
    try {
      const { data, error } = await supabase
        .from('cross_app_links')
        .insert({
          source_app: sourceApp,
          source_entity_type: sourceEntityType,
          source_entity_id: sourceEntityId,
          target_app: targetApp,
          target_entity_type: targetEntityType,
          target_entity_id: targetEntityId,
          relationship_type: relationshipType,
          metadata
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating cross-app link:', error)
      throw error
    }
  }

  const getLinks = async (
    app: string,
    entityType: string,
    entityId: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('cross_app_links')
        .select('*')
        .or(`and(source_app.eq.${app},source_entity_type.eq.${entityType},source_entity_id.eq.${entityId}),and(target_app.eq.${app},target_entity_type.eq.${entityType},target_entity_id.eq.${entityId})`)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching cross-app links:', error)
      return []
    }
  }

  const deleteLink = async (linkId: string) => {
    try {
      const { error } = await supabase
        .from('cross_app_links')
        .delete()
        .eq('id', linkId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting cross-app link:', error)
      throw error
    }
  }

  return { createLink, getLinks, deleteLink }
}