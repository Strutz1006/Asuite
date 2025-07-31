import { useState, useEffect } from 'react'
import { 
  Shield, 
  Building, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Edit,
  Pause,
  Play,
  Loader2,
  Calendar,
  CreditCard,
  Plus
} from 'lucide-react'
import { supabase, useSuperAdmin } from '@aesyros/supabase'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LicenseManagementModal } from './LicenseManagementModal'

interface OrganizationLicenseOverview {
  organization_id: string
  organization_name: string
  license_status: string | null
  current_user_count: number | null
  max_users: number | null
  subscription_ends_at: string | null
  plan_name: string | null
  pricing_model: string | null
  price_per_unit: number | null
  included_apps: string[] | null
  health_status: string
}

export function SuperAdminLicensePanel() {
  const { isSuperAdmin, isLoading: adminLoading } = useSuperAdmin()
  const [organizations, setOrganizations] = useState<OrganizationLicenseOverview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showLicenseModal, setShowLicenseModal] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState<OrganizationLicenseOverview | null>(null)

  useEffect(() => {
    if (isSuperAdmin) {
      fetchOrganizationLicenses()
    }
  }, [isSuperAdmin])

  const fetchOrganizationLicenses = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('super_admin_license_overview')
        .select('*')
        .order('organization_name')

      if (fetchError) throw fetchError

      setOrganizations(data || [])
    } catch (err) {
      console.error('Error fetching organization licenses:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch license data')
    } finally {
      setLoading(false)
    }
  }

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.organization_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.plan_name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || 
                         org.health_status === statusFilter ||
                         org.license_status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleEditLicense = (org: OrganizationLicenseOverview) => {
    setSelectedOrg(org)
    setShowLicenseModal(true)
  }

  const handleSuspendLicense = async (organizationId: string) => {
    if (!confirm('Are you sure you want to suspend this license? The organization will lose access to their apps.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('organization_licenses')
        .update({ 
          status: 'suspended',
          updated_at: new Date().toISOString()
        })
        .eq('organization_id', organizationId)

      if (error) throw error

      await fetchOrganizationLicenses()
    } catch (err) {
      console.error('Error suspending license:', err)
      setError('Failed to suspend license')
    }
  }

  const handleActivateLicense = async (organizationId: string) => {
    try {
      const { error } = await supabase
        .from('organization_licenses')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('organization_id', organizationId)

      if (error) throw error

      await fetchOrganizationLicenses()
    } catch (err) {
      console.error('Error activating license:', err)
      setError('Failed to activate license')
    }
  }

  const handleLicenseModalSuccess = () => {
    fetchOrganizationLicenses()
    setSelectedOrg(null)
  }

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': 
        return 'text-green-400'
      case 'approaching_limit':
        return 'text-amber-400'
      case 'at_limit':
        return 'text-orange-400'
      case 'expiring_soon':
        return 'text-amber-400'
      case 'expired':
        return 'text-red-400'
      default:
        return 'text-slate-400'
    }
  }

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'approaching_limit':
      case 'expiring_soon':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />
      case 'at_limit':
      case 'expired':
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return <Shield className="w-4 h-4 text-slate-400" />
    }
  }

  const formatPrice = (price: number | null, currency: string = 'GBP') => {
    if (price === null || price === 0) return 'Free'
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency
    }).format(price)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString()
  }

  const getDaysUntilExpiry = (dateString: string | null) => {
    if (!dateString) return null
    const expiryDate = new Date(dateString)
    const now = new Date()
    const diffTime = expiryDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (adminLoading) {
    return (
      <div className="glass-card p-8 text-center">
        <Loader2 className="w-6 h-6 text-blue-400 animate-spin mx-auto mb-3" />
        <p className="text-slate-400">Checking permissions...</p>
      </div>
    )
  }

  if (!isSuperAdmin) {
    return null // Don't show anything if not super admin
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            Super Admin: License Management
          </h3>
          <p className="text-slate-400 text-sm mt-1">Manage licenses across all organizations</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <span>{organizations.length} organizations</span>
          <span>•</span>
          <span>{organizations.filter(o => o.health_status === 'healthy').length} healthy</span>
          <span>•</span>
          <span>{organizations.filter(o => ['expired', 'expiring_soon', 'at_limit'].includes(o.health_status)).length} need attention</span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search organizations or plans..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="healthy">Healthy</option>
            <option value="approaching_limit">Approaching Limit</option>
            <option value="at_limit">At Limit</option>
            <option value="expiring_soon">Expiring Soon</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-6 h-6 text-purple-400 animate-spin mx-auto mb-3" />
            <span className="text-slate-300">Loading organization licenses...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Organization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">License Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Users</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Expires</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredOrganizations.map((org) => {
                  const daysUntilExpiry = getDaysUntilExpiry(org.subscription_ends_at)
                  
                  return (
                    <tr key={org.organization_id} className="hover:bg-slate-800/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Building className="w-4 h-4 text-slate-400" />
                          <div>
                            <div className="text-sm font-medium text-slate-100">
                              {org.organization_name}
                            </div>
                            <div className="text-xs text-slate-400">
                              {org.included_apps?.join(', ') || 'No apps'}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm text-slate-100">
                            {org.plan_name || 'No Plan'}
                          </div>
                          <div className="text-xs text-slate-400">
                            {org.pricing_model && org.price_per_unit ? (
                              <>
                                {formatPrice(org.price_per_unit)}
                                {org.pricing_model === 'per_user' ? '/user' : '/org'}
                              </>
                            ) : (
                              'No pricing'
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3 text-slate-400" />
                          <span className="text-sm text-slate-100">
                            {org.current_user_count || 0}
                            {org.max_users ? `/${org.max_users}` : ' (unlimited)'}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getHealthStatusIcon(org.health_status)}
                          <span className={`text-sm capitalize ${getHealthStatusColor(org.health_status)}`}>
                            {org.health_status.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-100">
                          {formatDate(org.subscription_ends_at)}
                        </div>
                        {daysUntilExpiry !== null && (
                          <div className={`text-xs ${daysUntilExpiry <= 7 ? 'text-amber-400' : 'text-slate-400'}`}>
                            {daysUntilExpiry > 0 
                              ? `${daysUntilExpiry} days left`
                              : 'Expired'
                            }
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {org.license_status ? (
                            <>
                              <button
                                onClick={() => handleEditLicense(org)}
                                className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                title="Edit License"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              
                              {org.license_status === 'active' ? (
                                <button
                                  onClick={() => handleSuspendLicense(org.organization_id)}
                                  className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                                  title="Suspend License"
                                >
                                  <Pause className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleActivateLicense(org.organization_id)}
                                  className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                                  title="Activate License"
                                >
                                  <Play className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          ) : (
                            <button
                              onClick={() => handleEditLicense(org)}
                              className="px-3 py-1 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 rounded-lg transition-colors text-sm flex items-center gap-1"
                              title="Assign License"
                            >
                              <Plus className="w-3 h-3" />
                              Add License
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filteredOrganizations.length === 0 && !loading && (
        <div className="glass-card p-8 text-center">
          <Building className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">No organizations found</h3>
          <p className="text-slate-400">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'No organizations with licenses found'
            }
          </p>
        </div>
      )}

      {/* License Management Modal */}
      <LicenseManagementModal
        isOpen={showLicenseModal}
        onClose={() => {
          setShowLicenseModal(false)
          setSelectedOrg(null)
        }}
        organizationId={selectedOrg?.organization_id}
        organizationName={selectedOrg?.organization_name}
        currentLicense={selectedOrg?.license_status ? selectedOrg : null}
        onSuccess={handleLicenseModalSuccess}
      />
    </div>
  )
}