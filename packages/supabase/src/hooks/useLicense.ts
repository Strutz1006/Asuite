import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../client'
import type { 
  UseLicenseReturn, 
  OrganizationLicenseWithPlan, 
  LicenseValidation, 
  LicenseUsageStats,
  AppName,
  LicenseStatus
} from '../types/licensing'

export function useLicense(organizationId: string | null): UseLicenseReturn {
  const [license, setLicense] = useState<OrganizationLicenseWithPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLicense = useCallback(async () => {
    if (!organizationId) {
      setLicense(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Fetch organization license with plan details
      const { data: licenseData, error: licenseError } = await supabase
        .from('organization_licenses')
        .select(`
          *,
          license_plan:license_plans(*)
        `)
        .eq('organization_id', organizationId)
        .single()

      if (licenseError) {
        if (licenseError.code === 'PGRST116') {
          // No license found - organization needs to set up licensing
          setLicense(null)
        } else {
          throw licenseError
        }
      } else {
        setLicense(licenseData as OrganizationLicenseWithPlan)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch license')
      console.error('License fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [organizationId])

  useEffect(() => {
    fetchLicense()
  }, [fetchLicense])

  // Create validation object
  const validation: LicenseValidation = {
    isValid: license?.status === 'active' || license?.status === 'trial',
    hasAppAccess: (appName: AppName) => {
      if (!license?.license_plan) return false
      return license.license_plan.included_apps.includes(appName)
    },
    canAddUsers: (() => {
      if (!license) return false
      if (license.status !== 'active' && license.status !== 'trial') return false
      
      // For organization-wide licenses, unlimited users
      if (license.license_plan.pricing_model === 'organization') return true
      
      // For per-user licenses, check current count vs max
      const maxUsers = license.max_users || license.license_plan.max_users
      if (!maxUsers) return true // Unlimited
      
      return (license.current_user_count || 0) < maxUsers
    })(),
    remainingUsers: (() => {
      if (!license) return 0
      if (license.license_plan.pricing_model === 'organization') return undefined
      
      const maxUsers = license.max_users || license.license_plan.max_users
      if (!maxUsers) return undefined // Unlimited
      
      return Math.max(0, maxUsers - (license.current_user_count || 0))
    })(),
    isTrialExpired: (() => {
      if (!license?.trial_ends_at) return false
      return new Date(license.trial_ends_at) < new Date()
    })(),
    isSubscriptionExpired: (() => {
      if (!license?.subscription_ends_at) return false
      return new Date(license.subscription_ends_at) < new Date()
    })(),
    errors: (() => {
      const errors: string[] = []
      
      if (!license) {
        errors.push('No license found for organization')
        return errors
      }
      
      if (license.status === 'expired') {
        errors.push('License has expired')
      }
      
      if (license.status === 'suspended') {
        errors.push('License is suspended')
      }
      
      if (license.trial_ends_at && new Date(license.trial_ends_at) < new Date()) {
        errors.push('Trial period has ended')
      }
      
      if (license.subscription_ends_at && new Date(license.subscription_ends_at) < new Date()) {
        errors.push('Subscription has expired')
      }
      
      const maxUsers = license.max_users || license.license_plan.max_users
      if (maxUsers && (license.current_user_count || 0) > maxUsers) {
        errors.push(`User limit exceeded (${license.current_user_count}/${maxUsers})`)
      }
      
      return errors
    })()
  }

  // Create usage stats
  const usage: LicenseUsageStats = {
    currentUsers: license?.current_user_count || 0,
    maxUsers: license?.max_users || license?.license_plan?.max_users || null,
    usagePercentage: (() => {
      if (!license) return 0
      const max = license.max_users || license.license_plan.max_users
      if (!max) return 0 // Unlimited
      return Math.round(((license.current_user_count || 0) / max) * 100)
    })(),
    appsEnabled: license?.license_plan?.included_apps as AppName[] || [],
    subscriptionStatus: (license?.status as LicenseStatus) || 'expired',
    daysUntilExpiry: (() => {
      if (!license?.subscription_ends_at) return undefined
      const expiryDate = new Date(license.subscription_ends_at)
      const now = new Date()
      const diffTime = expiryDate.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays > 0 ? diffDays : 0
    })(),
    isOverLimit: (() => {
      if (!license) return false
      const max = license.max_users || license.license_plan.max_users
      if (!max) return false // Unlimited
      return (license.current_user_count || 0) > max
    })()
  }

  return {
    license,
    validation,
    usage,
    loading,
    error,
    refetch: fetchLicense
  }
}