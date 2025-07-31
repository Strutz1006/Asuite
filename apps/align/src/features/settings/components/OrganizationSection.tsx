import { useState } from 'react'
import { Globe, Save, Edit, Upload, Building, MapPin, Phone, Mail, Calendar, Users } from 'lucide-react'

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
  const [organization, setOrganization] = useState<OrganizationData>(mockOrganization)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<OrganizationData>(mockOrganization)

  const handleSave = () => {
    setOrganization(formData)
    setIsEditing(false)
    // TODO: Save to backend
  }

  const handleCancel = () => {
    setFormData(organization)
    setIsEditing(false)
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // TODO: Upload file and get URL
      const mockUrl = URL.createObjectURL(file)
      setFormData({ ...formData, logo: mockUrl })
    }
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
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer inline-flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </label>
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

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-800/50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
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