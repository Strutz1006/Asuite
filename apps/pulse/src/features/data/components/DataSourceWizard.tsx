import React, { useState } from 'react'
import { X, ArrowLeft, ArrowRight, CheckCircle, Database, Code, Upload, Globe, Edit, AlertCircle, Loader } from 'lucide-react'

interface DataSourceWizardProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (source: any) => void
  editingSource?: any
}

const steps = [
  { id: 1, name: 'Source Type', icon: Database },
  { id: 2, name: 'Configuration', icon: Code },
  { id: 3, name: 'Testing', icon: CheckCircle },
  { id: 4, name: 'Schedule', icon: Globe },
]

const sourceTypes = [
  {
    type: 'api',
    name: 'REST API',
    icon: Code,
    description: 'Connect to REST APIs with authentication and custom headers',
    features: ['OAuth 2.0 Support', 'Custom Headers', 'Rate Limiting', 'JSON/XML Response'],
    complexity: 'Medium',
    setupTime: '5-15 minutes'
  },
  {
    type: 'database',
    name: 'Database',
    icon: Database,
    description: 'Direct connection to SQL databases like PostgreSQL, MySQL, SQL Server',
    features: ['SSL Connection', 'Query Builder', 'Multiple Tables', 'Scheduled Sync'],
    complexity: 'High',
    setupTime: '10-30 minutes'
  },
  {
    type: 'file',
    name: 'File Upload',
    icon: Upload,
    description: 'Upload CSV, Excel, or JSON files with automatic parsing',
    features: ['Auto Mapping', 'Data Validation', 'Schedule Import', 'Multiple Formats'],
    complexity: 'Low',
    setupTime: '2-5 minutes'
  },
  {
    type: 'webhook',
    name: 'Webhook',
    icon: Globe,
    description: 'Real-time data through webhook endpoints',
    features: ['Real-time Updates', 'Custom Validation', 'Retry Logic', 'Secure Endpoints'],
    complexity: 'Medium',
    setupTime: '5-10 minutes'
  }
]

const scheduleOptions = [
  { value: 'realtime', label: 'Real-time', description: 'Immediate updates (webhooks only)' },
  { value: '5min', label: 'Every 5 minutes', description: 'High frequency updates' },
  { value: '15min', label: 'Every 15 minutes', description: 'Frequent updates' },
  { value: 'hourly', label: 'Every hour', description: 'Regular updates' },
  { value: 'daily', label: 'Daily', description: 'Once per day at specified time' },
  { value: 'weekly', label: 'Weekly', description: 'Once per week on specified day' },
  { value: 'monthly', label: 'Monthly', description: 'Once per month on specified date' }
]

export function DataSourceWizard({ isOpen, onClose, onSubmit, editingSource }: DataSourceWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState(null)
  
  const [source, setSource] = useState({
    name: '',
    type: '',
    description: '',
    config: {},
    schedule: 'hourly',
    scheduleTime: '09:00',
    enabled: true
  })

  if (!isOpen) return null

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const testConnection = async () => {
    setIsLoading(true)
    setTestResults(null)
    
    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.3 // 70% success rate
      setTestResults({
        success,
        message: success 
          ? 'Connection successful! Found 1,234 records.'
          : 'Connection failed. Please check your credentials.',
        details: success 
          ? 'Successfully connected and retrieved sample data. Your data source is ready to use.'
          : 'Error: Authentication failed. Please verify your API key and endpoint URL.'
      })
      setIsLoading(false)
    }, 2000)
  }

  const handleSubmit = () => {
    onSubmit(source)
    onClose()
  }

  const renderSourceTypeSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Choose Data Source Type</h3>
        <p className="text-slate-600">Select how you want to connect your data</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sourceTypes.map(type => {
          const Icon = type.icon
          return (
            <div
              key={type.type}
              onClick={() => setSource(prev => ({ ...prev, type: type.type }))}
              className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                source.type === type.type
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  source.type === type.type ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    source.type === type.type ? 'text-purple-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900">{type.name}</h4>
                    {source.type === type.type && (
                      <CheckCircle className="h-5 w-5 text-purple-500" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{type.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Complexity:</span>
                      <span className={`font-medium ${
                        type.complexity === 'Low' ? 'text-green-600' :
                        type.complexity === 'Medium' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>{type.complexity}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Setup Time:</span>
                      <span className="font-medium text-slate-700">{type.setupTime}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-xs text-slate-500 mb-1">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {type.features.slice(0, 2).map(feature => (
                        <span key={feature} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderConfiguration = () => {
    const selectedType = sourceTypes.find(t => t.type === source.type)
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Configure {selectedType?.name}</h3>
          <p className="text-slate-600">Provide connection details for your data source</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Data Source Name *
            </label>
            <input
              type="text"
              value={source.name}
              onChange={(e) => setSource(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="My Data Source"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={source.description}
              onChange={(e) => setSource(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Describe what this data source provides..."
            />
          </div>

          {source.type === 'api' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  API Endpoint URL *
                </label>
                <input
                  type="url"
                  value={source.config.endpoint || ''}
                  onChange={(e) => setSource(prev => ({ 
                    ...prev, 
                    config: { ...prev.config, endpoint: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="https://api.example.com/v1/data"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Authentication Type
                  </label>
                  <select
                    value={source.config.authType || 'none'}
                    onChange={(e) => setSource(prev => ({ 
                      ...prev, 
                      config: { ...prev.config, authType: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="none">No Authentication</option>
                    <option value="api_key">API Key</option>
                    <option value="bearer">Bearer Token</option>
                    <option value="oauth2">OAuth 2.0</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    HTTP Method
                  </label>
                  <select
                    value={source.config.method || 'GET'}
                    onChange={(e) => setSource(prev => ({ 
                      ...prev, 
                      config: { ...prev.config, method: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                  </select>
                </div>
              </div>
              {source.config.authType !== 'none' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {source.config.authType === 'api_key' ? 'API Key' : 
                     source.config.authType === 'bearer' ? 'Bearer Token' : 'Client ID'}
                  </label>
                  <input
                    type="password"
                    value={source.config.apiKey || ''}
                    onChange={(e) => setSource(prev => ({ 
                      ...prev, 
                      config: { ...prev.config, apiKey: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter your credentials..."
                  />
                </div>
              )}
            </>
          )}

          {source.type === 'database' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Database Type
                  </label>
                  <select
                    value={source.config.dbType || ''}
                    onChange={(e) => setSource(prev => ({ 
                      ...prev, 
                      config: { ...prev.config, dbType: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select Database</option>
                    <option value="postgresql">PostgreSQL</option>
                    <option value="mysql">MySQL</option>
                    <option value="sqlserver">SQL Server</option>
                    <option value="mongodb">MongoDB</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Port
                  </label>
                  <input
                    type="number"
                    value={source.config.port || ''}
                    onChange={(e) => setSource(prev => ({ 
                      ...prev, 
                      config: { ...prev.config, port: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="5432"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Host *
                </label>
                <input
                  type="text"
                  value={source.config.host || ''}
                  onChange={(e) => setSource(prev => ({ 
                    ...prev, 
                    config: { ...prev.config, host: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="localhost or database.company.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Database Name
                  </label>
                  <input
                    type="text"
                    value={source.config.database || ''}
                    onChange={(e) => setSource(prev => ({ 
                      ...prev, 
                      config: { ...prev.config, database: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="analytics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={source.config.username || ''}
                    onChange={(e) => setSource(prev => ({ 
                      ...prev, 
                      config: { ...prev.config, username: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="user"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={source.config.password || ''}
                  onChange={(e) => setSource(prev => ({ 
                    ...prev, 
                    config: { ...prev.config, password: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter password..."
                />
              </div>
            </>
          )}

          {source.type === 'file' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  File Format
                </label>
                <select
                  value={source.config.format || 'csv'}
                  onChange={(e) => setSource(prev => ({ 
                    ...prev, 
                    config: { ...prev.config, format: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="csv">CSV</option>
                  <option value="excel">Excel (.xlsx)</option>
                  <option value="json">JSON</option>
                </select>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">Drop your file here or click to browse</p>
                <p className="text-sm text-slate-500">Supports CSV, Excel, and JSON files up to 10MB</p>
                <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Choose File
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  const renderTesting = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Test Connection</h3>
        <p className="text-slate-600">Verify that your data source is configured correctly</p>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-slate-900">Connection Details</h4>
          <button
            onClick={testConnection}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            <span>{isLoading ? 'Testing...' : 'Test Connection'}</span>
          </button>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Source Type:</span>
            <span className="font-medium">{sourceTypes.find(t => t.type === source.type)?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Name:</span>
            <span className="font-medium">{source.name || 'Unnamed Source'}</span>
          </div>
          {source.type === 'api' && (
            <div className="flex justify-between">
              <span className="text-slate-600">Endpoint:</span>
              <span className="font-medium truncate ml-2">{source.config.endpoint || 'Not set'}</span>
            </div>
          )}
        </div>
        
        {testResults && (
          <div className={`mt-4 p-4 rounded-lg ${
            testResults.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start space-x-3">
              {testResults.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div>
                <h5 className={`font-medium ${testResults.success ? 'text-green-900' : 'text-red-900'}`}>
                  {testResults.message}
                </h5>
                <p className={`text-sm mt-1 ${testResults.success ? 'text-green-700' : 'text-red-700'}`}>
                  {testResults.details}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Set Sync Schedule</h3>
        <p className="text-slate-600">Configure how often data should be collected</p>
      </div>
      
      <div className="space-y-4">
        {scheduleOptions.map(option => (
          <div
            key={option.value}
            onClick={() => setSource(prev => ({ ...prev, schedule: option.value }))}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              source.schedule === option.value
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900">{option.label}</h4>
                <p className="text-sm text-slate-600">{option.description}</p>
              </div>
              {source.schedule === option.value && (
                <CheckCircle className="h-5 w-5 text-purple-500" />
              )}
            </div>
          </div>
        ))}
        
        {['daily', 'weekly', 'monthly'].includes(source.schedule) && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {source.schedule === 'daily' ? 'Time of Day' :
               source.schedule === 'weekly' ? 'Day and Time' :
               'Date and Time'}
            </label>
            <input
              type="time"
              value={source.scheduleTime}
              onChange={(e) => setSource(prev => ({ ...prev, scheduleTime: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        )}
      </div>
    </div>
  )

  const renderStep = () => {
    switch (currentStep) {
      case 1: return renderSourceTypeSelection()
      case 2: return renderConfiguration()
      case 3: return renderTesting()
      case 4: return renderSchedule()
      default: return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return source.type !== ''
      case 2: return source.name.trim() !== ''
      case 3: return testResults?.success
      case 4: return source.schedule !== ''
      default: return false
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              {editingSource ? 'Edit Data Source' : 'Add New Data Source'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 ml-2 ${
                    currentStep > step.id ? 'bg-purple-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </button>
          
          {currentStep === steps.length ? (
            <button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Create Data Source
              <CheckCircle className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}