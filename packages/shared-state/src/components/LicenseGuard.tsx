import React from 'react'
import { Shield, Lock, AlertTriangle, CreditCard } from 'lucide-react'
import { useLicenseValidation, AppName } from '@aesyros/supabase'

interface LicenseGuardProps {
  organizationId: string | null
  appName: AppName
  feature?: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function LicenseGuard({ 
  organizationId, 
  appName, 
  feature, 
  children, 
  fallback 
}: LicenseGuardProps) {
  const { 
    validation, 
    usage, 
    getLicenseStatus, 
    validateAppAccess, 
    loading 
  } = useLicenseValidation(organizationId)

  if (loading) {
    return (
      <div className="glass-card p-6 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-slate-400">Checking license...</p>
      </div>
    )
  }

  // Check app access first
  if (!validateAppAccess(appName)) {
    return fallback || (
      <div className="glass-card p-8 text-center">
        <Lock className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-100 mb-2">Access Restricted</h3>
        <p className="text-slate-400 mb-4">
          Your current license doesn't include access to {appName.charAt(0).toUpperCase() + appName.slice(1)}.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
          <span>Current License: {getLicenseStatus()}</span>
          <span>•</span>
          <span>Apps: {usage.appsEnabled.join(', ')}</span>
        </div>
      </div>
    )
  }

  // Check license validity
  if (!validation.isValid) {
    const isExpired = validation.isTrialExpired || validation.isSubscriptionExpired
    
    return fallback || (
      <div className="glass-card p-8 text-center">
        {isExpired ? <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" /> : <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />}
        <h3 className="text-xl font-semibold text-slate-100 mb-2">
          {isExpired ? 'License Expired' : 'License Invalid'}
        </h3>
        <p className="text-slate-400 mb-4">
          {validation.errors.join('. ')}
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-500 mb-4">
          <span>Status: {getLicenseStatus()}</span>
          {usage.daysUntilExpiry !== undefined && (
            <>
              <span>•</span>
              <span>
                {usage.daysUntilExpiry > 0 
                  ? `Expires in ${usage.daysUntilExpiry} days`
                  : 'Expired'
                }
              </span>
            </>
          )}
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto">
          <CreditCard className="w-4 h-4" />
          Upgrade License
        </button>
      </div>
    )
  }

  // All checks passed, render children
  return <>{children}</>
}

// Higher-order component version
export function withLicenseGuard<P extends object>(
  Component: React.ComponentType<P>,
  appName: AppName,
  feature?: string
) {
  return function LicenseGuardedComponent(props: P & { organizationId: string | null }) {
    const { organizationId, ...componentProps } = props
    
    return (
      <LicenseGuard 
        organizationId={organizationId} 
        appName={appName} 
        feature={feature}
      >
        <Component {...(componentProps as P)} />
      </LicenseGuard>
    )
  }
}