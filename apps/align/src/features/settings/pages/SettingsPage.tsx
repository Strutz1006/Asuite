import { useState } from 'react'
import { Settings, Users, Building, Shield, Globe, Database, CreditCard } from 'lucide-react'
import { TeamsSection } from '../components/TeamsSection'
import { DepartmentsSection } from '../components/DepartmentsSection'
import { UsersSection } from '../components/UsersSection'
import { OrganizationSection } from '../components/OrganizationSection'
import { SystemSection } from '../components/SystemSection'
import { LicenseSection } from '../components/LicenseSection'

type SettingsTab = 'teams' | 'departments' | 'users' | 'organization' | 'system' | 'license'

const tabs = [
  {
    id: 'teams' as const,
    name: 'Teams',
    icon: Users,
    description: 'Manage teams and team assignments'
  },
  {
    id: 'departments' as const,
    name: 'Departments',
    icon: Building,
    description: 'Configure organizational departments'
  },
  {
    id: 'users' as const,
    name: 'Users',
    icon: Shield,
    description: 'Manage users, roles, and permissions'
  },
  {
    id: 'organization' as const,
    name: 'Organization',
    icon: Globe,
    description: 'Company details and branding'
  },
  {
    id: 'system' as const,
    name: 'System',
    icon: Database,
    description: 'Notifications, integrations, and preferences'
  },
  {
    id: 'license' as const,
    name: process.env.NODE_ENV === 'development' ? 'License (Dev Setup)' : 'License',
    icon: CreditCard,
    description: 'View and manage licensing and subscriptions'
  }
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    process.env.NODE_ENV === 'development' ? 'license' : 'departments'
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'teams':
        return <TeamsSection />
      case 'departments':
        return <DepartmentsSection />
      case 'users':
        return <UsersSection />
      case 'organization':
        return <OrganizationSection />
      case 'system':
        return <SystemSection />
      case 'license':
        return <LicenseSection />
      default:
        return <TeamsSection />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-400" />
            Settings
          </h1>
          <p className="text-slate-400 mt-1">
            Manage your organization's configuration and preferences
          </p>
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-300 text-sm">
              💡 <strong>Recommended workflow:</strong> 1) Create Departments → 2) Add Users to departments → 3) Create Teams (can be cross-functional)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="glass-card p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                      activeTab === tab.id
                        ? 'bg-blue-500/20 text-blue-300 border-l-4 border-blue-500'
                        : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{tab.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{tab.description}</div>
                    </div>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}