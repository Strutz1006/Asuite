import { useEffect } from 'react'
import { supabase } from '@aesyros/supabase'
import { useSharedState } from '../store'

export function useOrganizationSync() {
  const { organization, user, setOrganization, setUser } = useSharedState()

  // Sync organization data
  const syncOrganization = async (organizationId: string) => {
    try {
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select(`
          id,
          name,
          industry,
          size,
          align_company_setup (
            id,
            goal_framework,
            planning_cycle,
            alignment_required,
            progress_frequency
          )
        `)
        .eq('id', organizationId)
        .single()

      if (orgError) throw orgError

      const organization = {
        id: orgData.id,
        name: orgData.name,
        industry: orgData.industry,
        size: orgData.size,
        settings: {
          goal_framework: orgData.align_company_setup?.goal_framework || 'okr',
          planning_cycle: orgData.align_company_setup?.planning_cycle || 'quarterly',
          alignment_required: orgData.align_company_setup?.alignment_required || false,
          progress_frequency: orgData.align_company_setup?.progress_frequency || 'monthly'
        }
      }

      setOrganization(organization)
      return organization
    } catch (error) {
      console.error('Error syncing organization data:', error)
      return null
    }
  }

  // Sync user data
  const syncUser = async (userId: string) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          id,
          full_name,
          email,
          role,
          department_id,
          team_id,
          preferences
        `)
        .eq('id', userId)
        .single()

      if (userError) throw userError

      const user = {
        id: userData.id,
        full_name: userData.full_name,
        email: userData.email,
        role: userData.role,
        department_id: userData.department_id,
        team_id: userData.team_id,
        preferences: userData.preferences || {
          theme: 'system',
          notifications_enabled: true,
          default_view: 'kanban',
          dashboard_layout: []
        }
      }

      setUser(user)
      return user
    } catch (error) {
      console.error('Error syncing user data:', error)
      return null
    }
  }

  // Update user preferences in database
  const updateUserPreferences = async (preferences: any) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          preferences: {
            ...user.preferences,
            ...preferences
          }
        })
        .eq('id', user.id)

      if (error) throw error

      // Update local state
      useSharedState.getState().updateUserPreferences(preferences)
    } catch (error) {
      console.error('Error updating user preferences:', error)
      throw error
    }
  }

  // Auto-sync when user or organization changes
  useEffect(() => {
    // Set up real-time subscription for organization changes
    if (organization) {
      const orgSubscription = supabase
        .channel('organization_sync')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'organizations',
            filter: `id=eq.${organization.id}`
          },
          () => {
            syncOrganization(organization.id)
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'align_company_setup',
            filter: `organization_id=eq.${organization.id}`
          },
          () => {
            syncOrganization(organization.id)
          }
        )
        .subscribe()

      return () => {
        orgSubscription.unsubscribe()
      }
    }
  }, [organization?.id])

  useEffect(() => {
    // Set up real-time subscription for user changes
    if (user) {
      const userSubscription = supabase
        .channel('user_sync')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'users',
            filter: `id=eq.${user.id}`
          },
          () => {
            syncUser(user.id)
          }
        )
        .subscribe()

      return () => {
        userSubscription.unsubscribe()
      }
    }
  }, [user?.id])

  return {
    organization,
    user,
    syncOrganization,
    syncUser,
    updateUserPreferences
  }
}