import React from 'react'
import { Users, AlertTriangle, Shield, TrendingUp } from 'lucide-react'
import { useLicenseValidation } from '@aesyros/supabase'

interface LicenseUsageIndicatorProps {
  organizationId: string | null
  className?: string
  showDetails?: boolean
}

export function LicenseUsageIndicator({ 
  organizationId, 
  className = '', 
  showDetails = false 
}: LicenseUsageIndicatorProps) {
  const { usage, getLicenseStatus, loading } = useLicenseValidation(organizationId)

  if (loading || !organizationId) {
    return null
  }

  const getStatusColor = () => {
    const status = getLicenseStatus()
    if (status === 'Active') return 'text-green-400'
    if (status === 'Trial') return 'text-blue-400'
    return 'text-amber-400'
  }

  const getUsageColor = () => {
    if (usage.usagePercentage >= 100) return 'text-red-400'
    if (usage.usagePercentage >= 80) return 'text-amber-400'
    return 'text-green-400'
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Shield className={`w-4 h-4 ${getStatusColor()}`} />
      
      <div className="text-sm">
        <span className={`font-medium ${getStatusColor()}`}>
          {getLicenseStatus()}
        </span>
        
        {usage.maxUsers && (
          <>
            <span className="text-slate-400 mx-2">•</span>
            <span className={getUsageColor()}>
              {usage.currentUsers}/{usage.maxUsers}
            </span>
            {usage.usagePercentage >= 80 && (
              <AlertTriangle className="w-3 h-3 text-amber-400 inline ml-1" />
            )}
          </>
        )}
        
        {!usage.maxUsers && (
          <>
            <span className="text-slate-400 mx-2">•</span>
            <span className="text-slate-300">
              {usage.currentUsers} users
            </span>
          </>
        )}
      </div>

      {showDetails && (
        <div className="ml-2 text-xs text-slate-400">
          <div>Apps: {usage.appsEnabled.join(', ')}</div>
          {usage.daysUntilExpiry !== undefined && (
            <div className={usage.daysUntilExpiry <= 7 ? 'text-amber-400' : ''}>
              {usage.daysUntilExpiry > 0 
                ? `Expires in ${usage.daysUntilExpiry} days`
                : 'Expired'
              }
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Compact version for headers/navbars
export function LicenseStatusBadge({ 
  organizationId, 
  className = '' 
}: { 
  organizationId: string | null
  className?: string 
}) {
  const { usage, getLicenseStatus, loading } = useLicenseValidation(organizationId)

  if (loading || !organizationId) {
    return null
  }

  const getStatusColor = () => {
    const status = getLicenseStatus()
    if (status === 'Active') return 'bg-green-500/20 text-green-400 border-green-500/30'
    if (status === 'Trial') return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  }

  return (
    <div className={`px-2 py-1 rounded-md border text-xs font-medium ${getStatusColor()} ${className}`}>
      {getLicenseStatus()}
      {usage.maxUsers && (
        <span className="ml-1 opacity-75">
          {usage.currentUsers}/{usage.maxUsers}
        </span>
      )}
    </div>
  )
}