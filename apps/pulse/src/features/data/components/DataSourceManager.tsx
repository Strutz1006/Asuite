import React, { useState } from 'react'
import { Plus, Database, Globe, Upload, Code, Settings, CheckCircle, AlertCircle, Clock, Trash2, Edit, Play, Pause } from 'lucide-react'

interface DataSource {
  id: string
  name: string
  type: 'api' | 'database' | 'file' | 'manual' | 'webhook'
  status: 'connected' | 'error' | 'pending' | 'disconnected'
  lastSync: string
  frequency: string
  kpiCount: number
  description: string
  config: Record<string, any>
}

interface DataSourceManagerProps {
  onCreateSource: () => void
  onEditSource: (source: DataSource) => void
}

const mockDataSources: DataSource[] = [
  {
    id: '1',
    name: 'CRM API Integration',
    type: 'api',
    status: 'connected',
    lastSync: '2024-01-20T10:30:00Z',
    frequency: 'Every 15 minutes',
    kpiCount: 8,
    description: 'Salesforce CRM API for customer and sales metrics',
    config: { endpoint: 'https://api.salesforce.com', version: 'v58.0' }
  },
  {
    id: '2',
    name: 'Analytics Database',
    type: 'database',
    status: 'connected',
    lastSync: '2024-01-20T09:45:00Z',
    frequency: 'Hourly',
    kpiCount: 12,
    description: 'PostgreSQL database with web analytics and user behavior data',
    config: { host: 'analytics-db.company.com', database: 'analytics' }
  },
  {
    id: '3',
    name: 'Financial Reports Upload',
    type: 'file',
    status: 'pending',
    lastSync: '2024-01-19T16:20:00Z',
    frequency: 'Monthly',
    kpiCount: 5,
    description: 'Monthly financial reports from accounting team',
    config: { format: 'Excel', location: '/uploads/financial/' }
  },
  {
    id: '4',
    name: 'Google Analytics',
    type: 'api',
    status: 'error',
    lastSync: '2024-01-20T08:15:00Z',
    frequency: 'Daily',
    kpiCount: 15,
    description: 'Website traffic and user engagement metrics',
    config: { propertyId: 'GA4-XXXXXXXX', accountId: '12345' }
  },
  {
    id: '5',
    name: 'Customer Support Metrics',
    type: 'manual',
    status: 'disconnected',
    lastSync: '2024-01-18T14:30:00Z',
    frequency: 'Weekly',
    kpiCount: 6,
    description: 'Manual entry of customer satisfaction and support ticket metrics',
    config: {}
  }
]

const dataSourceTypes = [
  {
    type: 'api' as const,
    name: 'API Integration',
    icon: Code,
    description: 'Connect to REST APIs, GraphQL endpoints, or web services',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100'
  },
  {
    type: 'database' as const,
    name: 'Database Connection',
    icon: Database,
    description: 'Direct connection to SQL or NoSQL databases',
    color: 'text-green-500',
    bgColor: 'bg-green-100'
  },
  {
    type: 'file' as const,
    name: 'File Upload',
    icon: Upload,
    description: 'CSV, Excel, or JSON file uploads with scheduled imports',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100'
  },
  {
    type: 'webhook' as const,
    name: 'Webhook Endpoint',
    icon: Globe,
    description: 'Real-time data through webhook notifications',
    color: 'text-orange-500',
    bgColor: 'bg-orange-100'
  },
  {
    type: 'manual' as const,
    name: 'Manual Entry',
    icon: Edit,
    description: 'Form-based manual data entry with validation',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100'
  }
]

const statusConfig = {
  connected: { color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle, label: 'Connected' },
  error: { color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertCircle, label: 'Error' },
  pending: { color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Clock, label: 'Pending' },
  disconnected: { color: 'text-gray-600', bgColor: 'bg-gray-100', icon: Pause, label: 'Disconnected' }
}

export function DataSourceManager({ onCreateSource, onEditSource }: DataSourceManagerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredSources = mockDataSources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         source.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || source.type === filterType
    const matchesStatus = filterStatus === 'all' || source.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const handleSync = (sourceId: string) => {
    console.log('Triggering sync for source:', sourceId)
    // TODO: Implement manual sync
  }

  const handleToggleSource = (sourceId: string) => {
    console.log('Toggling source:', sourceId)
    // TODO: Implement enable/disable
  }

  const handleDeleteSource = (sourceId: string) => {
    console.log('Deleting source:', sourceId)
    // TODO: Implement delete with confirmation
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Data Sources</h2>
          <p className="text-slate-600 mt-1">Manage integrations and data collection endpoints</p>
        </div>
        <button
          onClick={onCreateSource}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Data Source</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Sources</p>
              <p className="text-2xl font-bold text-slate-900">{mockDataSources.length}</p>
            </div>
            <Database className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Connected</p>
              <p className="text-2xl font-bold text-green-600">
                {mockDataSources.filter(s => s.status === 'connected').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">With Errors</p>
              <p className="text-2xl font-bold text-red-600">
                {mockDataSources.filter(s => s.status === 'error').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total KPIs</p>
              <p className="text-2xl font-bold text-slate-900">
                {mockDataSources.reduce((sum, s) => sum + s.kpiCount, 0)}
              </p>
            </div>
            <Settings className="h-8 w-8 text-slate-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search data sources..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-slate-700">Type:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Types</option>
            {dataSourceTypes.map(type => (
              <option key={type.type} value={type.type}>{type.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-slate-700">Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="connected">Connected</option>
            <option value="error">Error</option>
            <option value="pending">Pending</option>
            <option value="disconnected">Disconnected</option>
          </select>
        </div>
      </div>

      {/* Data Sources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSources.map(source => {
          const typeConfig = dataSourceTypes.find(t => t.type === source.type)
          const status = statusConfig[source.status]
          const TypeIcon = typeConfig?.icon || Database
          const StatusIcon = status.icon

          return (
            <div key={source.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${typeConfig?.bgColor}`}>
                    <TypeIcon className={`h-5 w-5 ${typeConfig?.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{source.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{source.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                    <StatusIcon className="h-3 w-3" />
                    <span>{status.label}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Type:</span>
                  <span className="font-medium text-slate-900">{typeConfig?.name}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">KPIs Connected:</span>
                  <span className="font-medium text-slate-900">{source.kpiCount}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Sync Frequency:</span>
                  <span className="font-medium text-slate-900">{source.frequency}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Last Sync:</span>
                  <span className="font-medium text-slate-900">
                    {new Date(source.lastSync).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSync(source.id)}
                    disabled={source.status === 'error'}
                    className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  >
                    <Play className="h-3 w-3" />
                    <span>Sync Now</span>
                  </button>
                  
                  <button
                    onClick={() => onEditSource(source)}
                    className="px-3 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md flex items-center space-x-1"
                  >
                    <Settings className="h-3 w-3" />
                    <span>Configure</span>
                  </button>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleToggleSource(source.id)}
                    className={`px-3 py-1 text-xs font-medium rounded-md ${
                      source.status === 'disconnected'
                        ? 'text-green-700 bg-green-100 hover:bg-green-200'
                        : 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200'
                    }`}
                  >
                    {source.status === 'disconnected' ? 'Enable' : 'Disable'}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteSource(source.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded-md"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredSources.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No data sources found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || filterType !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your filters to see more data sources.'
              : 'Connect your first data source to start collecting KPI data automatically.'
            }
          </p>
          <button
            onClick={onCreateSource}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add Your First Data Source
          </button>
        </div>
      )}

      {/* Quick Setup Cards */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Setup Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dataSourceTypes.slice(0, 3).map(type => {
            const Icon = type.icon
            return (
              <button
                key={type.type}
                onClick={onCreateSource}
                className="text-left p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 rounded-lg ${type.bgColor}`}>
                    <Icon className={`h-5 w-5 ${type.color}`} />
                  </div>
                  <h4 className="font-medium text-slate-900">{type.name}</h4>
                </div>
                <p className="text-sm text-slate-600">{type.description}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}