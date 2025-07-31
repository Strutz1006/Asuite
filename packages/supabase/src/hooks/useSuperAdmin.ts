import { useState, useEffect } from 'react'
import { supabase } from '../client'
import { useAuth } from './useAuth'

export interface SuperAdminCapabilities {
  canManageAllLicenses: boolean
  canViewAllOrganizations: boolean
  canCreateLicensePlans: boolean
  canSuspendLicenses: boolean
  canViewAuditLogs: boolean
}

export interface SuperAdminReturn {
  isSuperAdmin: boolean
  isLoading: boolean
  capabilities: SuperAdminCapabilities
  error: string | null
}

export function useSuperAdmin(): SuperAdminReturn {
  const { user } = useAuth()
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkSuperAdminStatus()
  }, [user])

  const checkSuperAdminStatus = async () => {
    if (!user) {
      setIsSuperAdmin(false)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Check if user has super admin role
      const { data, error: queryError } = await supabase
        .from('users')
        .select('system_role')
        .eq('id', user.id)
        .single()

      if (queryError) {
        throw queryError
      }

      const hasSuperAdminRole = data?.system_role === 'super_admin'
      setIsSuperAdmin(hasSuperAdminRole)

    } catch (err) {
      console.error('Error checking super admin status:', err)
      setError(err instanceof Error ? err.message : 'Failed to check admin status')
      setIsSuperAdmin(false)
    } finally {
      setIsLoading(false)
    }
  }

  const capabilities: SuperAdminCapabilities = {
    canManageAllLicenses: isSuperAdmin,
    canViewAllOrganizations: isSuperAdmin,
    canCreateLicensePlans: isSuperAdmin,
    canSuspendLicenses: isSuperAdmin,
    canViewAuditLogs: isSuperAdmin
  }

  return {
    isSuperAdmin,
    isLoading,
    capabilities,
    error
  }
}