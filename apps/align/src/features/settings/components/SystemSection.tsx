import { useState } from 'react'
import { Database, Bell, Palette, Zap, Shield, Download, Trash2, Save, Toggle } from 'lucide-react'

interface SystemSettings {
  notifications: {
    emailNotifications: boolean
    pushNotifications: boolean
    goalDeadlineReminders: boolean
    progressUpdateReminders: boolean
    weeklyDigest: boolean
    reminderFrequency: string
  }
  appearance: {
    theme: string
    compactMode: boolean
    animationsEnabled: boolean
  }
  integrations: {
    slackEnabled: boolean
    teamsEnabled: boolean
    emailEnabled: boolean
    webhooksEnabled: boolean
  }
  data: {
    autoBackup: boolean
    dataRetention: string
    exportFormat: string
  }
  security: {
    twoFactorRequired: boolean
    sessionTimeout: string
    ipWhitelisting: boolean
  }
}

const defaultSettings: SystemSettings = {
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    goalDeadlineReminders: true,
    progressUpdateReminders: true,
    weeklyDigest: true,
    reminderFrequency: 'weekly'
  },
  appearance: {
    theme: 'dark',
    compactMode: false,
    animationsEnabled: true
  },
  integrations: {
    slackEnabled: false,
    teamsEnabled: false,
    emailEnabled: true,
    webhooksEnabled: false
  },
  data: {
    autoBackup: true,
    dataRetention: '7years',
    exportFormat: 'json'
  },
  security: {
    twoFactorRequired: false,
    sessionTimeout: '24hours',
    ipWhitelisting: false
  }
}

export function SystemSection() {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings)
  const [hasChanges, setHasChanges] = useState(false)

  const updateSetting = (section: keyof SystemSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    // TODO: Save to backend
    setHasChanges(false)
  }

  const handleExportData = () => {
    // TODO: Implement data export
    alert('Data export functionality will be implemented')
  }

  const handleBackupNow = () => {
    // TODO: Implement backup
    alert('Backup initiated')
  }

  const ToggleSwitch = ({ checked, onChange, label, description }: {
    checked: boolean
    onChange: (checked: boolean) => void
    label: string
    description?: string
  }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="text-sm font-medium text-slate-100">{label}</div>
        {description && <div className="text-xs text-slate-400 mt-1">{description}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-slate-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Database className="w-6 h-6 text-slate-400" />
            System Settings
          </h2>
          <p className="text-slate-400 mt-1">Configure system preferences and integrations</p>
        </div>
        {hasChanges && (
          <button
            onClick={handleSave}
            className="glass-button bg-blue-500/20 text-blue-300 hover:text-blue-200 px-4 py-2 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-400" />
            Notifications
          </h3>
          
          <div className="space-y-2">
            <ToggleSwitch
              checked={settings.notifications.emailNotifications}
              onChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
              label="Email Notifications"
              description="Receive notifications via email"
            />
            
            <ToggleSwitch
              checked={settings.notifications.pushNotifications}
              onChange={(checked) => updateSetting('notifications', 'pushNotifications', checked)}
              label="Push Notifications"
              description="Browser and mobile push notifications"
            />
            
            <ToggleSwitch
              checked={settings.notifications.goalDeadlineReminders}
              onChange={(checked) => updateSetting('notifications', 'goalDeadlineReminders', checked)}
              label="Goal Deadline Reminders"
              description="Get reminded about upcoming goal deadlines"
            />
            
            <ToggleSwitch
              checked={settings.notifications.progressUpdateReminders}
              onChange={(checked) => updateSetting('notifications', 'progressUpdateReminders', checked)}
              label="Progress Update Reminders"
              description="Reminders to update goal progress"
            />
            
            <ToggleSwitch
              checked={settings.notifications.weeklyDigest}
              onChange={(checked) => updateSetting('notifications', 'weeklyDigest', checked)}
              label="Weekly Digest"
              description="Weekly summary of goals and progress"
            />
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Reminder Frequency
            </label>
            <select
              value={settings.notifications.reminderFrequency}
              onChange={(e) => updateSetting('notifications', 'reminderFrequency', e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        {/* Appearance */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-400" />
            Appearance
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['light', 'dark'].map(theme => (
                  <button
                    key={theme}
                    onClick={() => updateSetting('appearance', 'theme', theme)}
                    className={`p-3 rounded-lg border transition-colors ${
                      settings.appearance.theme === theme
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                        : 'border-slate-600 text-slate-400 hover:bg-slate-800/50'
                    }`}
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <ToggleSwitch
              checked={settings.appearance.compactMode}
              onChange={(checked) => updateSetting('appearance', 'compactMode', checked)}
              label="Compact Mode"
              description="Use compact interface layout"
            />
            
            <ToggleSwitch
              checked={settings.appearance.animationsEnabled}
              onChange={(checked) => updateSetting('appearance', 'animationsEnabled', checked)}
              label="Animations"
              description="Enable interface animations and transitions"
            />
          </div>
        </div>

        {/* Integrations */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-400" />
            Integrations
          </h3>
          
          <div className="space-y-2">
            <ToggleSwitch
              checked={settings.integrations.slackEnabled}
              onChange={(checked) => updateSetting('integrations', 'slackEnabled', checked)}
              label="Slack Integration"
              description="Send updates and notifications to Slack"
            />
            
            <ToggleSwitch
              checked={settings.integrations.teamsEnabled}
              onChange={(checked) => updateSetting('integrations', 'teamsEnabled', checked)}
              label="Microsoft Teams"
              description="Integration with Microsoft Teams"
            />
            
            <ToggleSwitch
              checked={settings.integrations.emailEnabled}
              onChange={(checked) => updateSetting('integrations', 'emailEnabled', checked)}
              label="Email Integration"
              description="Send progress reports via email"
            />
            
            <ToggleSwitch
              checked={settings.integrations.webhooksEnabled}
              onChange={(checked) => updateSetting('integrations', 'webhooksEnabled', checked)}
              label="Webhooks"
              description="Custom webhook integrations"
            />
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <button className="text-sm text-green-400 hover:text-green-300">
              Configure Integrations →
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-400" />
            Security
          </h3>
          
          <div className="space-y-2">
            <ToggleSwitch
              checked={settings.security.twoFactorRequired}
              onChange={(checked) => updateSetting('security', 'twoFactorRequired', checked)}
              label="Require Two-Factor Authentication"
              description="Mandate 2FA for all users"
            />
            
            <ToggleSwitch
              checked={settings.security.ipWhitelisting}
              onChange={(checked) => updateSetting('security', 'ipWhitelisting', checked)}
              label="IP Whitelisting"
              description="Restrict access to specific IP addresses"
            />
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Session Timeout
            </label>
            <select
              value={settings.security.sessionTimeout}
              onChange={(e) => updateSetting('security', 'sessionTimeout', e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="1hour">1 Hour</option>
              <option value="8hours">8 Hours</option>
              <option value="24hours">24 Hours</option>
              <option value="7days">7 Days</option>
              <option value="never">Never</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-400" />
          Data Management
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-800/30 rounded-lg">
            <div className="text-sm text-slate-400 mb-2">Auto Backup</div>
            <ToggleSwitch
              checked={settings.data.autoBackup}
              onChange={(checked) => updateSetting('data', 'autoBackup', checked)}
              label={settings.data.autoBackup ? 'Enabled' : 'Disabled'}
            />
          </div>

          <div className="p-4 bg-slate-800/30 rounded-lg">
            <div className="text-sm text-slate-400 mb-2">Data Retention</div>
            <select
              value={settings.data.dataRetention}
              onChange={(e) => updateSetting('data', 'dataRetention', e.target.value)}
              className="w-full px-2 py-1 bg-slate-800/50 border border-slate-600 rounded text-slate-100 text-sm"
            >
              <option value="1year">1 Year</option>
              <option value="3years">3 Years</option>
              <option value="5years">5 Years</option>
              <option value="7years">7 Years</option>
              <option value="forever">Forever</option>
            </select>
          </div>

          <div className="p-4 bg-slate-800/30 rounded-lg">
            <div className="text-sm text-slate-400 mb-2">Export Format</div>
            <select
              value={settings.data.exportFormat}
              onChange={(e) => updateSetting('data', 'exportFormat', e.target.value)}
              className="w-full px-2 py-1 bg-slate-800/50 border border-slate-600 rounded text-slate-100 text-sm"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="xlsx">Excel</option>
            </select>
          </div>

          <div className="p-4 bg-slate-800/30 rounded-lg flex flex-col gap-2">
            <button
              onClick={handleBackupNow}
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              Backup Now
            </button>
            <button
              onClick={handleExportData}
              className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Export Data
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <h4 className="text-red-400 font-medium mb-2 flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Danger Zone
          </h4>
          <p className="text-sm text-slate-400 mb-3">
            These actions are irreversible. Please proceed with caution.
          </p>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/50 rounded-lg hover:bg-red-600/30 transition-colors text-sm">
              Reset All Settings
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
              Delete All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}