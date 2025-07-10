import React, { useState } from 'react';
import { GlassCard, Icon } from '../../shared/components';

interface DataSource {
  id: string;
  name: string;
  type: 'api' | 'database' | 'file' | 'saas' | 'webhook';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync: Date;
  recordCount: number;
  description: string;
  icon: string;
  connectionString?: string;
  mappedKPIs: string[];
  syncFrequency: 'real-time' | 'hourly' | 'daily' | 'weekly';
  dataQuality: number;
  automationLevel: 'manual' | 'semi-automated' | 'fully-automated';
}

const mockDataSources: DataSource[] = [
  {
    id: '1',
    name: 'Salesforce CRM',
    type: 'saas',
    status: 'connected',
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
    recordCount: 15420,
    description: 'Customer data, deals, and satisfaction metrics',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    mappedKPIs: ['Customer Satisfaction Score', 'Revenue Growth Rate'],
    syncFrequency: 'hourly',
    dataQuality: 94,
    automationLevel: 'fully-automated'
  },
  {
    id: '2',
    name: 'PostgreSQL Production DB',
    type: 'database',
    status: 'connected',
    lastSync: new Date(Date.now() - 15 * 60 * 1000),
    recordCount: 2847392,
    description: 'Operational metrics and performance data',
    icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
    mappedKPIs: ['Operational Efficiency', 'System Uptime'],
    syncFrequency: 'real-time',
    dataQuality: 98,
    automationLevel: 'fully-automated'
  },
  {
    id: '3',
    name: 'Employee Survey Platform',
    type: 'api',
    status: 'syncing',
    lastSync: new Date(Date.now() - 30 * 60 * 1000),
    recordCount: 1205,
    description: 'Employee engagement and satisfaction surveys',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    mappedKPIs: ['Team Morale Index'],
    syncFrequency: 'weekly',
    dataQuality: 87,
    automationLevel: 'semi-automated'
  },
  {
    id: '4',
    name: 'ESG Reporting API',
    type: 'api',
    status: 'error',
    lastSync: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    recordCount: 0,
    description: 'Environmental and sustainability metrics',
    icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M12 4.5V19m4.5-4.5L12 19l-4.5-4.5',
    mappedKPIs: ['ESG Compliance Score', 'Carbon Footprint per Unit'],
    syncFrequency: 'daily',
    dataQuality: 0,
    automationLevel: 'fully-automated'
  },
  {
    id: '5',
    name: 'Financial Spreadsheets',
    type: 'file',
    status: 'disconnected',
    lastSync: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    recordCount: 8420,
    description: 'Monthly financial reports and metrics',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    mappedKPIs: ['Revenue Growth Rate', 'Profit Margin'],
    syncFrequency: 'monthly',
    dataQuality: 76,
    automationLevel: 'manual'
  }
];

const connectorTemplates = [
  {
    name: 'Salesforce',
    type: 'saas',
    icon: 'M12 2l3.09 6.26L22 9l-5 4.74L18.18 22 12 18.77 5.82 22 7 13.74 2 9l6.91-.74L12 2z',
    description: 'Connect to Salesforce CRM for customer and sales data',
    supported: ['Customer data', 'Sales metrics', 'Satisfaction scores']
  },
  {
    name: 'PostgreSQL',
    type: 'database',
    icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
    description: 'Direct database connection for real-time data access',
    supported: ['Operational data', 'Transaction records', 'Performance metrics']
  },
  {
    name: 'Google Sheets',
    type: 'file',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    description: 'Import data from Google Sheets and Excel files',
    supported: ['Manual data entry', 'Financial reports', 'Survey results']
  },
  {
    name: 'REST API',
    type: 'api',
    icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4',
    description: 'Custom API integration for any REST endpoint',
    supported: ['Custom metrics', 'Third-party APIs', 'IoT devices']
  },
  {
    name: 'Webhook',
    type: 'webhook',
    icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
    description: 'Real-time data push from external systems',
    supported: ['Event-driven data', 'Notifications', 'Real-time updates']
  },
  {
    name: 'Power BI',
    type: 'saas',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    description: 'Import datasets from Microsoft Power BI',
    supported: ['Business intelligence', 'Analytics data', 'Report metrics']
  }
];

const DataConnectivityPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'sources' | 'connectors' | 'mapping' | 'quality'>('sources');
  const [showConnectorModal, setShowConnectorModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400 bg-green-500/20';
      case 'syncing': return 'text-blue-400 bg-blue-500/20';
      case 'error': return 'text-red-400 bg-red-500/20';
      case 'disconnected': return 'text-slate-400 bg-slate-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api': return 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4';
      case 'database': return 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4';
      case 'file': return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
      case 'saas': return 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z';
      case 'webhook': return 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1';
      default: return 'M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">Data Connectivity Hub</h2>
          <p className="text-slate-400 mt-2">Connect, sync, and manage your data sources for real-time KPI tracking</p>
        </div>
        <button 
          onClick={() => setShowConnectorModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
        >
          <Icon path="M12 4v16m8-8H4" className="w-4 h-4" />
          Add Data Source
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Connected Sources</p>
              <p className="text-3xl font-bold text-green-400">
                {mockDataSources.filter(s => s.status === 'connected').length}
              </p>
            </div>
            <Icon path="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" className="w-8 h-8 text-green-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Data Records</p>
              <p className="text-3xl font-bold text-sky-400">
                {mockDataSources.reduce((sum, s) => sum + s.recordCount, 0).toLocaleString()}
              </p>
            </div>
            <Icon path="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" className="w-8 h-8 text-sky-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Avg Data Quality</p>
              <p className="text-3xl font-bold text-purple-400">
                {Math.round(mockDataSources.reduce((sum, s) => sum + s.dataQuality, 0) / mockDataSources.length)}%
              </p>
            </div>
            <Icon path="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-purple-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Real-time Sources</p>
              <p className="text-3xl font-bold text-blue-400">
                {mockDataSources.filter(s => s.syncFrequency === 'real-time').length}
              </p>
            </div>
            <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-8 h-8 text-blue-400" />
          </div>
        </GlassCard>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-slate-800 rounded-lg p-1">
        {[
          { key: 'sources', label: 'Data Sources', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
          { key: 'connectors', label: 'Available Connectors', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4' },
          { key: 'mapping', label: 'Data Mapping', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
          { key: 'quality', label: 'Data Quality', icon: 'M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
              selectedTab === tab.key ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon path={tab.icon} className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Data Sources View */}
      {selectedTab === 'sources' && (
        <div className="space-y-6">
          {mockDataSources.map((source, index) => (
            <GlassCard key={index} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                    <Icon path={getTypeIcon(source.type)} className="w-6 h-6 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{source.name}</h3>
                    <p className="text-sm text-slate-400">{source.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(source.status)}`}>
                        {source.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-500">
                        {source.recordCount.toLocaleString()} records
                      </span>
                      <span className="text-xs text-slate-500">
                        Last sync: {source.lastSync.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-sky-400 transition-colors">
                    <Icon path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-green-400 transition-colors">
                    <Icon path="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                    <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Connection Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type:</span>
                      <span className="text-white capitalize">{source.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sync Frequency:</span>
                      <span className="text-white capitalize">{source.syncFrequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Automation:</span>
                      <span className="text-white capitalize">{source.automationLevel.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Data Quality:</span>
                      <span className={`font-medium ${
                        source.dataQuality >= 90 ? 'text-green-400' :
                        source.dataQuality >= 70 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {source.dataQuality}%
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Mapped KPIs ({source.mappedKPIs.length})</h4>
                  <div className="space-y-2">
                    {source.mappedKPIs.map((kpi, kpiIndex) => (
                      <div key={kpiIndex} className="p-2 bg-slate-800/50 rounded text-sm">
                        {kpi}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Data Quality Score</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Completeness</span>
                      <span className="text-green-400">95%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Accuracy</span>
                      <span className="text-green-400">92%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Timeliness</span>
                      <span className="text-yellow-400">85%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          source.dataQuality >= 90 ? 'bg-green-500' :
                          source.dataQuality >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${source.dataQuality}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {source.status === 'error' && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 font-medium text-sm">Connection Error</span>
                  </div>
                  <p className="text-sm text-slate-300">API authentication failed. Please check credentials and endpoint configuration.</p>
                  <button className="mt-2 text-sm font-semibold text-red-400 hover:text-red-300">
                    Troubleshoot Connection
                  </button>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}

      {/* Available Connectors View */}
      {selectedTab === 'connectors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connectorTemplates.map((connector, index) => (
            <GlassCard key={index} className="p-6 hover:border-sky-500/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                  <Icon path={connector.icon} className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{connector.name}</h3>
                  <span className="text-xs text-slate-400 capitalize">{connector.type}</span>
                </div>
              </div>
              
              <p className="text-sm text-slate-400 mb-4">{connector.description}</p>
              
              <div className="mb-4">
                <h4 className="text-xs font-medium text-slate-300 mb-2">Supported Data Types:</h4>
                <div className="flex flex-wrap gap-1">
                  {connector.supported.map((item, itemIndex) => (
                    <span key={itemIndex} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              
              <button className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors text-sm font-medium">
                Connect {connector.name}
              </button>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Data Mapping View */}
      {selectedTab === 'mapping' && (
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-6 text-sky-300">KPI Data Mapping</h3>
          <div className="space-y-6">
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <h4 className="font-semibold text-blue-300 mb-2">No-Code Data Mapping</h4>
              <p className="text-sm text-slate-300">Use our visual interface to map data fields to KPI calculations without writing code.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Source Fields</h4>
                <div className="space-y-2">
                  {['customer_satisfaction_rating', 'response_time', 'resolution_time', 'ticket_count'].map((field, index) => (
                    <div key={index} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 cursor-grab">
                      <div className="flex items-center gap-2">
                        <Icon path="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" className="w-4 h-4 text-slate-400" />
                        <span className="font-mono text-sm">{field}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">KPI Calculation</h4>
                <div className="p-4 bg-slate-800/30 rounded-lg border-2 border-dashed border-slate-600">
                  <div className="text-center text-slate-400">
                    <Icon path="M12 4v16m8-8H4" className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Drag fields here to build your calculation</p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-sm">
                    <span className="text-slate-400">Preview Formula:</span>
                    <div className="font-mono text-sky-400 mt-1">
                      AVG(customer_satisfaction_rating)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Data Quality View */}
      {selectedTab === 'quality' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-sky-300">Data Quality Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Overall Quality Score</span>
                <span className="text-2xl font-bold text-green-400">91%</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Completeness</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-slate-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                    <span className="text-green-400 font-mono text-sm">94%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Accuracy</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-slate-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                    </div>
                    <span className="text-green-400 font-mono text-sm">89%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Timeliness</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-slate-700 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                    <span className="text-yellow-400 font-mono text-sm">87%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Consistency</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-slate-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-green-400 font-mono text-sm">92%</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-sky-300">Quality Issues</h3>
            <div className="space-y-4">
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-medium text-sm">Delayed Data</span>
                </div>
                <p className="text-sm text-slate-300">ESG Reporting API has not synced for 2 days</p>
              </div>
              
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon path="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 font-medium text-sm">Missing Records</span>
                </div>
                <p className="text-sm text-slate-300">Financial spreadsheet missing data for Q3 2024</p>
              </div>
              
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon path="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium text-sm">Auto-Resolved</span>
                </div>
                <p className="text-sm text-slate-300">Data type inconsistency fixed automatically</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default DataConnectivityPage;