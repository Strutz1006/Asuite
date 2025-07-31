import { useState, useEffect } from 'react'
import { Globe, Save, Edit, Upload, Building, MapPin, Phone, Mail, Calendar, Users, Loader2 } from 'lucide-react'
import { useSetupStatus } from '@/hooks/useSetupStatus'
import { supabase } from '@aesyros/supabase'

interface OrganizationData {
  name: string
  industry: string
  size: string
  founded: string
  headquarters: string
  website: string
  phone: string
  email: string
  description: string
  logo: string
  timezone: string
  fiscalYearStart: string
  currency: string
}

const mockOrganization: OrganizationData = {
  name: 'Aesyros Technologies',
  industry: 'Clean Energy Technology',
  size: '51-200',
  founded: '2020',
  headquarters: 'San Francisco, CA, USA',
  website: 'https://aesyros.com',
  phone: '+1 (555) 123-4567',
  email: 'contact@aesyros.com',
  description: 'Leading provider of sustainable energy solutions for emerging markets, focusing on solar power installation and energy storage systems.',
  logo: '/api/placeholder/120/120',
  timezone: 'America/Los_Angeles',
  fiscalYearStart: 'January',
  currency: 'USD'
}

const industryOptions = [
  'Technology',
  'Clean Energy Technology',
  'Healthcare',
  'Financial Services',
  'Manufacturing',
  'Retail',
  'Education',
  'Consulting',
  'Media & Entertainment',
  'Real Estate',
  'Transportation',
  'Other'
]

const companySizeOptions = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+'
]

const currencyOptions = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'JPY', name: 'Japanese Yen' }
]

const monthOptions = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const timezoneOptions = [
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney'
]

export function OrganizationSection() {
  const { organization: orgData, loading: orgLoading, refetchSetup } = useSetupStatus()
  const [organization, setOrganization] = useState<OrganizationData>(mockOrganization)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<OrganizationData>(mockOrganization)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  
  // Load organization data when available
  useEffect(() => {
    if (orgData) {
      const mappedData: OrganizationData = {
        name: orgData.name || '',
        industry: orgData.industry || 'Technology',
        size: orgData.size_category || '51-200',
        founded: '2020', // Not in database, keeping mock
        headquarters: 'San Francisco, CA, USA', // Not in database, keeping mock
        website: orgData.website || '',
        phone: '+1 (555) 123-4567', // Not in database, keeping mock
        email: 'contact@aesyros.com', // Not in database, keeping mock
        description: orgData.mission_statement || '',
        logo: orgData.logo_url || '',
        timezone: orgData.timezone || 'America/Los_Angeles',
        fiscalYearStart: 'January', // Not in database, keeping mock
        currency: 'USD' // Not in database, keeping mock
      }
      setOrganization(mappedData)
      setFormData(mappedData)
    }
  }, [orgData])

  const handleSave = async () => {
    if (!orgData?.id) {
      setSaveError('Organization ID not found')
      return
    }
    
    try {
      setSaving(true)
      setSaveError(null)
      
      // Update organization in database
      const { error } = await supabase
        .from('organizations')
        .update({
          name: formData.name,
          industry: formData.industry,
          size_category: formData.size,
          website: formData.website,
          mission_statement: formData.description,
          logo_url: formData.logo,
          timezone: formData.timezone,
          updated_at: new Date().toISOString()
        })
        .eq('id', orgData.id)
      
      if (error) {
        throw error
      }
      
      // Update local state
      setOrganization(formData)
      setIsEditing(false)
      
      // Refresh organization data
      await refetchSetup()
      
    } catch (error) {
      console.error('Error saving organization:', error)
      setSaveError(error instanceof Error ? error.message : 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(organization)
    setIsEditing(false)
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !orgData?.id) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setSaveError('Please upload a valid image file (JPG, PNG, GIF, or WebP)')
      return
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      setSaveError('Image file must be smaller than 5MB')
      return
    }

    try {
      setUploadingLogo(true)
      setSaveError(null)

      // Create a unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `org-${orgData.id}-logo-${Date.now()}.${fileExt}`
      const filePath = `organization-logos/${fileName}`

      // Clean up old logo if it exists and is from our storage
      if (formData.logo && formData.logo.includes('supabase')) {
        try {
          const oldFileName = formData.logo.split('/').pop()
          if (oldFileName && oldFileName.startsWith('org-')) {
            await supabase.storage
              .from('uploads')
              .remove([`organization-logos/${oldFileName}`])
          }
        } catch (cleanupError) {
          console.warn('Could not clean up old logo:', cleanupError)
          // Don't fail the upload if cleanup fails
        }
      }

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath)

      if (urlData?.publicUrl) {
        // Update form data with the new logo URL
        setFormData({ ...formData, logo: urlData.publicUrl })
        
        // Clear any previous errors on successful upload
        setSaveError(null)
      } else {
        throw new Error('Failed to get public URL for uploaded image')
      }

    } catch (error) {
      console.error('Error uploading logo:', error)
      
      let message = 'Failed to upload logo. Please try again.'
      if (error instanceof Error) {
        message = error.message
      }
      setSaveError(message)
    } finally {
      setUploadingLogo(false)
    }
  }

  if (orgLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 text-orange-400 animate-spin" />
            <span className="text-slate-300">Loading organization data...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Globe className="w-6 h-6 text-orange-400" />
            Organization Settings
          </h2>
          <p className="text-slate-400 mt-1">Configure your company details and preferences</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="glass-button bg-orange-500/20 text-orange-300 hover:text-orange-200 px-4 py-2 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Organization
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logo & Basic Info */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 text-center">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto mb-4 rounded-lg overflow-hidden bg-slate-800/50 flex items-center justify-center">
                {(isEditing ? formData.logo : organization.logo) ? (
                  <img
                    src={isEditing ? formData.logo : organization.logo}
                    alt="Company Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building className="w-12 h-12 text-slate-400" />
                )}
              </div>
              {isEditing && (
                <div>
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo || saving}
                    className="hidden"
                  />
                  <label
                    htmlFor="logo-upload"
                    className={`cursor-pointer inline-flex items-center gap-2 text-sm transition-colors ${
                      uploadingLogo || saving 
                        ? 'text-slate-500 cursor-not-allowed' 
                        : 'text-orange-400 hover:text-orange-300'
                    }`}
                  >
                    {uploadingLogo ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload Logo
                      </>
                    )}
                  </label>
                  {(isEditing && !uploadingLogo) && (
                    <p className="text-xs text-slate-500 mt-1">
                      JPG, PNG, GIF or WebP. Max 5MB.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <div className="text-sm text-slate-400 mb-1">Founded</div>
                <div className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {organization.founded}
                </div>
              </div>
              
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <div className="text-sm text-slate-400 mb-1">Company Size</div>
                <div className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {organization.size} employees
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <div className="space-y-6">
              {/* Company Details */}
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Company Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    ) : (
                      <div className="text-slate-100 py-2">{organization.name}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Industry
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.industry}
                        onChange={(e) => setFormData({...formData, industry: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        {industryOptions.map(industry => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-slate-100 py-2">{organization.industry}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Company Size
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.size}
                        onChange={(e) => setFormData({...formData, size: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        {companySizeOptions.map(size => (
                          <option key={size} value={size}>{size} employees</option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-slate-100 py-2">{organization.size} employees</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Founded
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.founded}
                        onChange={(e) => setFormData({...formData, founded: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        min="1800"
                        max={new Date().getFullYear()}
                      />
                    ) : (
                      <div className="text-slate-100 py-2">{organization.founded}</div>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                    />
                  ) : (
                    <div className="text-slate-100 py-2">{organization.description}</div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Headquarters
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.headquarters}
                        onChange={(e) => setFormData({...formData, headquarters: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    ) : (
                      <div className="text-slate-100 py-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {organization.headquarters}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    ) : (
                      <div className="text-slate-100 py-2">
                        <a href={organization.website} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300">
                          {organization.website}
                        </a>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    ) : (
                      <div className="text-slate-100 py-2 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        {organization.phone}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    ) : (
                      <div className="text-slate-100 py-2 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        {organization.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Business Settings */}
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Business Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Timezone
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.timezone}
                        onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        {timezoneOptions.map(tz => (
                          <option key={tz} value={tz}>{tz}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-slate-100 py-2">{organization.timezone}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Currency
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData({...formData, currency: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        {currencyOptions.map(currency => (
                          <option key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-slate-100 py-2">{organization.currency}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Fiscal Year Start
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.fiscalYearStart}
                        onChange={(e) => setFormData({...formData, fiscalYearStart: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        {monthOptions.map(month => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-slate-100 py-2">{organization.fiscalYearStart}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {isEditing && saveError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{saveError}</p>
                </div>
              )}

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50">
                  <button
                    onClick={handleCancel}
                    disabled={saving || uploadingLogo}
                    className="px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || uploadingLogo}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-orange-600/50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}