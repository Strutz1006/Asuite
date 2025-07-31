import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../client'
import type { UseAppAccessReturn, AppName, OrganizationAppAccess } from '../types/licensing'

export function useAppAccess(organizationId: string | null, appName: AppName): UseAppAccessReturn {
  const [appAccess, setAppAccess] = useState<OrganizationAppAccess | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAppAccess = useCallback(async () => {
    if (!organizationId) {
      setAppAccess(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('organization_app_access')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('app_name', appName)
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No access record found - app not enabled
          setAppAccess(null)
        } else {
          throw fetchError
        }
      } else {
        setAppAccess(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch app access')
      console.error('App access fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [organizationId, appName])

  useEffect(() => {
    fetchAppAccess()
  }, [fetchAppAccess])

  const hasAccess = appAccess?.is_enabled === true

  return {
    hasAccess,
    appAccess,
    loading,
    error
  }
}