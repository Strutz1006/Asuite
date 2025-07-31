import { useState, useEffect } from 'react'
import { X, Loader2, AlertCircle, Building, CreditCard } from 'lucide-react'
import { supabase, type LicensePlanWithFeatures } from '@aesyros/supabase'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface LicenseManagementModalProps {
  isOpen: boolean
  onClose: () => void
  organizationId?: string
  organizationName?: string
  currentLicense?: any
  onSuccess: () => void
}

export function LicenseManagementModal({ 
  isOpen, 
  onClose, 
  organizationId, 
  organizationName,
  currentLicense,
  onSuccess 
}: LicenseManagementModalProps) {
  const [availablePlans, setAvailablePlans] = useState<LicensePlanWithFeatures[]>([])
  const [selectedPlanId, setSelectedPlanId] = useState<string>('')
  const [maxUsers, setMaxUsers] = useState<number | null>(null)
  const [billingEmail, setBillingEmail] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [fetchingPlans, setFetchingPlans] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchLicensePlans()
      if (currentLicense) {
        setSelectedPlanId(currentLicense.license_plan_id || '')
        setMaxUsers(currentLicense.max_users)
        setBillingEmail(currentLicense.billing_contact_email || '')
      }
    }
  }, [isOpen, currentLicense])

  const fetchLicensePlans = async () => {
    try {
      setFetchingPlans(true)
      const { data, error } = await supabase
        .from('license_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_per_unit')

      if (error) throw error
      setAvailablePlans(data || [])
    } catch (err) {
      console.error('Error fetching license plans:', err)
      setError('Failed to load license plans')
    } finally {
      setFetchingPlans(false)
    }
  }

  const handleSave = async () => {
    if (!organizationId || !selectedPlanId) {
      setError('Please select a license plan')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const selectedPlan = availablePlans.find(p => p.id === selectedPlanId)
      if (!selectedPlan) {
        throw new Error('Selected plan not found')
      }

      // Calculate dates
      const now = new Date()
      const subscriptionStart = now.toISOString()
      const subscriptionEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days

      if (currentLicense) {
        // Update existing license
        const { error: updateError } = await supabase
          .from('organization_licenses')
          .update({
            license_plan_id: selectedPlanId,
            status: 'active',
            subscription_starts_at: subscriptionStart,
            subscription_ends_at: subscriptionEnd,
            max_users: maxUsers || selectedPlan.max_users,
            billing_contact_email: billingEmail || null,
            updated_at: new Date().toISOString()
          })
          .eq('organization_id', organizationId)

        if (updateError) throw updateError
      } else {
        // Create new license
        const { error: insertError } = await supabase
          .from('organization_licenses')
          .insert({
            organization_id: organizationId,
            license_plan_id: selectedPlanId,
            status: 'active',
            subscription_starts_at: subscriptionStart,
            subscription_ends_at: subscriptionEnd,
            current_user_count: 0,
            max_users: maxUsers || selectedPlan.max_users,
            billing_contact_email: billingEmail || null
          })

        if (insertError) throw insertError
      }

      // Update/create app access
      if (selectedPlan.included_apps && selectedPlan.included_apps.length > 0) {
        // First, disable all apps for this org
        await supabase
          .from('organization_app_access')
          .update({ is_enabled: false, disabled_at: new Date().toISOString() })
          .eq('organization_id', organizationId)

        // Then enable the apps included in the new plan
        for (const appName of selectedPlan.included_apps) {
          await supabase
            .from('organization_app_access')
            .upsert({
              organization_id: organizationId,
              app_name: appName,
              is_enabled: true,
              enabled_at: new Date().toISOString(),
              disabled_at: null
            })
        }
      }

      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error saving license:', err)
      setError(err instanceof Error ? err.message : 'Failed to save license')
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                {currentLicense ? 'Edit License' : 'Assign License'}
              </h3>
              {organizationName && (
                <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  {organizationName}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Error Display */}
          {error && (
            <Alert className="border-red-500/20 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          )}

          {/* License Plan Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              License Plan *
            </label>
            {fetchingPlans ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {availablePlans.map((plan) => (
                  <div 
                    key={plan.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedPlanId === plan.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-600 bg-slate-800/30 hover:border-slate-500'
                    }`}
                    onClick={() => setSelectedPlanId(plan.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-100">{plan.name}</h4>
                        <p className="text-slate-400 text-sm">{plan.description}</p>
                        <div className="text-xs text-slate-500 mt-1">
                          Apps: {plan.included_apps?.join(', ') || 'None'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-100">
                          {formatPrice(plan.price_per_unit, plan.currency)}
                        </div>
                        <div className="text-xs text-slate-400">
                          {plan.pricing_model === 'per_user' ? 'per user' : 'per organization'}
                          {plan.billing_cycle === 'monthly' ? '/month' : plan.billing_cycle === 'yearly' ? '/year' : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Limit Override */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              User Limit Override
            </label>
            <input
              type="number"
              min="1"
              value={maxUsers || ''}
              onChange={(e) => setMaxUsers(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Leave empty to use plan default"
            />
            <p className="text-xs text-slate-400 mt-1">
              Override the default user limit for this organization
            </p>
          </div>

          {/* Billing Contact */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Billing Contact Email
            </label>
            <input
              type="email"
              value={billingEmail}
              onChange={(e) => setBillingEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="billing@company.com"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-700/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-800/50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedPlanId || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              currentLicense ? 'Update License' : 'Assign License'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}