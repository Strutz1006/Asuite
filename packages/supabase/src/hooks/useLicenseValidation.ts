import { useLicense } from './useLicense'
import type { UserCreationValidation, AppName } from '../types/licensing'

export function useLicenseValidation(organizationId: string | null) {
  const { license, validation, usage, loading, error } = useLicense(organizationId)

  const validateUserCreation = (): UserCreationValidation => {
    if (!license) {
      return {
        canCreate: false,
        reason: 'No license found for organization',
        suggestedAction: 'Contact administrator to set up licensing',
        upgradeRequired: true
      }
    }

    if (!validation.isValid) {
      const reason = validation.errors.join(', ')
      return {
        canCreate: false,
        reason,
        suggestedAction: 'Renew or upgrade license to continue adding users',
        upgradeRequired: true
      }
    }

    if (!validation.canAddUsers) {
      const maxUsers = license.max_users || license.license_plan.max_users
      return {
        canCreate: false,
        reason: `User limit reached (${usage.currentUsers}/${maxUsers})`,
        suggestedAction: 'Upgrade to a higher tier or remove inactive users',
        upgradeRequired: true
      }
    }

    // Check if close to limit (80% threshold)
    if (validation.remainingUsers !== undefined && validation.remainingUsers <= Math.ceil((license.max_users || license.license_plan.max_users || 0) * 0.2)) {
      return {
        canCreate: true,
        reason: `Approaching user limit (${usage.currentUsers}/${license.max_users || license.license_plan.max_users})`,
        suggestedAction: 'Consider upgrading before reaching the limit'
      }
    }

    return {
      canCreate: true
    }
  }

  const validateAppAccess = (appName: AppName): boolean => {
    return validation.hasAppAccess(appName)
  }

  const getUpgradeRecommendations = () => {
    if (!license) return []
    
    const recommendations: string[] = []
    
    // User limit recommendations
    if (usage.usagePercentage > 80) {
      recommendations.push('Consider upgrading to increase user limit')
    }
    
    // Trial expiry recommendations
    if (license.status === 'trial' && validation.isTrialExpired) {
      recommendations.push('Trial has expired - upgrade to continue service')
    }
    
    // Subscription expiry recommendations
    if (usage.daysUntilExpiry && usage.daysUntilExpiry <= 7) {
      recommendations.push('Subscription expires soon - renew to avoid service interruption')
    }
    
    return recommendations
  }

  const getLicenseStatus = () => {
    if (!license) return 'No License'
    
    if (validation.isTrialExpired) return 'Trial Expired'
    if (validation.isSubscriptionExpired) return 'Subscription Expired'
    if (license.status === 'suspended') return 'Suspended'
    if (license.status === 'trial') return 'Trial'
    if (license.status === 'active') return 'Active'
    
    return 'Unknown'
  }

  return {
    license,
    validation,
    usage,
    loading,
    error,
    validateUserCreation,
    validateAppAccess,
    getUpgradeRecommendations,
    getLicenseStatus
  }
}