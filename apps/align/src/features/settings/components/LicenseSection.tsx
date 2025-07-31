import { useState, useEffect } from 'react'
import { Shield, CreditCard, Users, Calendar, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useSetupStatus } from '@/hooks/useSetupStatus'
import { useLicenseValidation, useSuperAdmin, supabase, type LicensePlan, type LicensePlanWithFeatures } from '@aesyros/supabase'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { SuperAdminLicensePanel } from './SuperAdminLicensePanel'
import { DevAdminPanel } from '@/components/DevAdminPanel'

export function LicenseSection() {
  const { organization } = useSetupStatus()
  const { isSuperAdmin } = useSuperAdmin()
  const { 
    license, 
    validation, 
    usage, 
    getLicenseStatus, 
    getUpgradeRecommendations,
    loading: licenseLoading 
  } = useLicenseValidation(organization?.id || null)
  
  const [availablePlans, setAvailablePlans] = useState<LicensePlanWithFeatures[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAvailablePlans()
  }, [])

  const fetchAvailablePlans = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: plansData, error: plansError } = await supabase
        .from('license_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_per_unit')

      if (plansError) throw plansError

      setAvailablePlans(plansData as LicensePlanWithFeatures[] || [])
    } catch (err) {
      console.error('Error fetching license plans:', err)
      setError(err instanceof Error ? err.message : 'Failed to load license plans')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number | null, currency: string | null = 'GBP') => {
    if (price === null || price === 0) return 'Free'
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency || 'GBP'
    }).format(price)
  }

  const formatBillingCycle = (cycle: string | null) => {
    if (!cycle) return ''
    return cycle === 'monthly' ? '/month' : cycle === 'yearly' ? '/year' : ''
  }

  const getLicenseStatusIcon = () => {
    const status = getLicenseStatus()
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'Trial':
        return <Calendar className="w-5 h-5 text-blue-400" />
      case 'Expired':
      case 'Trial Expired':
      case 'Subscription Expired':
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-400" />
    }
  }

  if (licenseLoading || loading) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          <span className="text-slate-300">Loading license information...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-400" />
          License Management
          {isSuperAdmin && (
            <span className="ml-2 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full">
              Super Admin
            </span>
          )}
        </h2>
        <p className="text-slate-400 mt-1">
          {isSuperAdmin 
            ? 'View and manage licensing across all organizations' 
            : 'View and manage your organization\'s licensing'
          }
        </p>
      </div>

      {/* Dev Admin Panel - Remove this in production */}
      {process.env.NODE_ENV === 'development' && (
        <DevAdminPanel />
      )}

      {/* Super Admin Panel */}
      {isSuperAdmin && (
        <>
          <SuperAdminLicensePanel />
          <div className="border-t border-slate-700/50 pt-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              Current Organization License
            </h3>
          </div>
        </>
      )}

      {/* Error Display */}
      {error && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Current License Status */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Current License</h3>
          <div className="flex items-center gap-2">
            {getLicenseStatusIcon()}
            <span className={`font-medium ${getLicenseStatus() === 'Active' ? 'text-green-400' : 'text-amber-400'}`}>
              {getLicenseStatus()}
            </span>
          </div>
        </div>

        {license ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="text-slate-400 text-sm">Plan</div>
                <div className="text-slate-100 font-medium">{license.license_plan.name}</div>
              </div>
              
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="text-slate-400 text-sm">Pricing</div>
                <div className="text-slate-100 font-medium">
                  {license.license_plan.pricing_model === 'organization' ? 'Per Organization' : 'Per User'}
                </div>
              </div>
              
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="text-slate-400 text-sm">Users</div>
                <div className="text-slate-100 font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {usage.maxUsers ? `${usage.currentUsers}/${usage.maxUsers}` : `${usage.currentUsers} (Unlimited)`}
                </div>
              </div>
              
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="text-slate-400 text-sm">Apps</div>
                <div className="text-slate-100 font-medium">
                  {usage.appsEnabled.length} apps
                </div>
              </div>
            </div>

            {/* License Details */}
            <div className="border-t border-slate-700/50 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Included Apps:</span>
                  <div className="text-slate-300 mt-1">
                    {usage.appsEnabled.map(app => app.charAt(0).toUpperCase() + app.slice(1)).join(', ')}
                  </div>
                </div>
                
                {license.subscription_ends_at && (
                  <div>
                    <span className="text-slate-400">Subscription Ends:</span>
                    <div className="text-slate-300 mt-1">
                      {new Date(license.subscription_ends_at).toLocaleDateString()}
                      {usage.daysUntilExpiry !== undefined && (
                        <span className={`ml-2 ${usage.daysUntilExpiry <= 7 ? 'text-amber-400' : 'text-slate-400'}`}>
                          ({usage.daysUntilExpiry > 0 ? `${usage.daysUntilExpiry} days left` : 'Expired'})
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Validation Errors */}
            {validation.errors.length > 0 && (
              <div className="border-t border-slate-700/50 pt-4">
                <Alert className="border-red-500/20 bg-red-500/10">
                  <XCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">
                    <div className="font-medium mb-1">License Issues:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {validation.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Upgrade Recommendations */}
            {getUpgradeRecommendations().length > 0 && (
              <div className="border-t border-slate-700/50 pt-4">
                <Alert className="border-amber-500/20 bg-amber-500/10">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <AlertDescription className="text-amber-300">
                    <div className="font-medium mb-1">Recommendations:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {getUpgradeRecommendations().map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-300 mb-2">No License Found</h3>
            <p className="text-slate-400 mb-4">
              Your organization doesn't have an active license. Contact your administrator to set up licensing.
            </p>
          </div>
        )}
      </div>

      {/* Available Plans */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Available Plans</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availablePlans.map((plan) => (
            <div 
              key={plan.id} 
              className={`p-4 rounded-lg border-2 transition-colors ${
                license?.license_plan_id === plan.id 
                  ? 'border-blue-500/50 bg-blue-500/10' 
                  : 'border-slate-600 bg-slate-800/30 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-slate-100">{plan.name}</h4>
                {license?.license_plan_id === plan.id && (
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                )}
              </div>
              
              <p className="text-slate-400 text-sm mb-3">{plan.description}</p>
              
              <div className="text-2xl font-bold text-slate-100 mb-1">
                {formatPrice(plan.price_per_unit, plan.currency)}
                <span className="text-sm font-normal text-slate-400">
                  {formatBillingCycle(plan.billing_cycle)}
                  {plan.pricing_model === 'per_user' && '/user'}
                </span>
              </div>
              
              <div className="text-xs text-slate-400 mb-3">
                {plan.pricing_model === 'organization' ? 'Organization-wide' : 'Per user'}
                {plan.max_users && ` • Up to ${plan.max_users} users`}
              </div>
              
              <div className="space-y-1 mb-4">
                <div className="text-sm text-slate-300">Includes:</div>
                <div className="text-xs text-slate-400">
                  {plan.included_apps.map(app => app.charAt(0).toUpperCase() + app.slice(1)).join(', ')}
                </div>
              </div>
              
              {license?.license_plan_id !== plan.id && (
                <button className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  Select Plan
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}