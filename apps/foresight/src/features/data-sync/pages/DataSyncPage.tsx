import React, { useState, useEffect } from 'react';
import { GlassCard, Icon } from '@aesyros/ui';
import { connectorManager } from '../../../plugins/connectors/ConnectorManager';
import { SpreadsheetConnector } from '../../../plugins/connectors/SpreadsheetConnector';
import type { ConnectorConfig } from '../../../plugins/types';

const DataSyncPage: React.FC = () => {
  const [connectors, setConnectors] = useState<ConnectorConfig[]>([]);
  const [activeSync, setActiveSync] = useState<string | null>(null);
  const [showAddConnector, setShowAddConnector] = useState(false);

  useEffect(() => {
    // Register built-in connectors
    connectorManager.registerConnector(new SpreadsheetConnector());
    
    // Load existing configurations
    loadConnectors();
  }, []);

  const loadConnectors = () => {
    // Mock data - in real app, load from storage
    const mockConnectors: ConnectorConfig[] = [
      {
        id: 'spreadsheet-1',
        name: 'Planning Spreadsheet',
        type: 'spreadsheet',
        config: {
          spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          range: 'Scenarios!A:F'
        },
        enabled: true
      }
    ];
    setConnectors(mockConnectors);
  };

  const handleSync = async (connectorId: string, direction: 'import' | 'export' | 'bidirectional') => {
    setActiveSync(connectorId);
    try {
      await connectorManager.syncConnector(connectorId, direction);
      // Show success notification
    } catch (error) {
      console.error('Sync failed:', error);
      // Show error notification
    } finally {
      setActiveSync(null);
    }
  };

  const toggleConnector = async (connectorId: string, enabled: boolean) => {
    const updatedConnectors = connectors.map(conn => 
      conn.id === connectorId ? { ...conn, enabled } : conn
    );
    setConnectors(updatedConnectors);
    
    // Update connector configuration
    const config = updatedConnectors.find(c => c.id === connectorId);
    if (config) {
      await connectorManager.configureConnector(config);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-200">Data Sync</h1>
          <p className="text-slate-400 mt-1">
            Sync data with external systems and spreadsheets
          </p>
        </div>
        <button
          onClick={() => setShowAddConnector(true)}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Icon path="M12 4.5v15m7.5-7.5h-15" />
          Add Connector
        </button>
      </div>

      <div className="grid gap-4">
        {connectors.map((connector) => (
          <GlassCard key={connector.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg flex items-center justify-center">
                  <Icon 
                    path={connector.type === 'spreadsheet' 
                      ? "M3 7V4a1 1 0 011-1h16a1 1 0 011 1v3M3 7h18M3 7v13a1 1 0 001 1h16a1 1 0 001-1V7M8 4v16M16 4v16"
                      : "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                    } 
                    className="w-5 h-5 text-white"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-200">{connector.name}</h3>
                  <p className="text-sm text-slate-400 capitalize">{connector.type} connector</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={connector.enabled}
                    onChange={(e) => toggleConnector(connector.id, e.target.checked)}
                    className="rounded border-slate-600 bg-slate-700 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-sm text-slate-300">Enabled</span>
                </label>
              </div>
            </div>

            {connector.enabled && (
              <div className="border-t border-slate-700/50 pt-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSync(connector.id, 'import')}
                    disabled={activeSync === connector.id}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Icon path="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" className="w-4 h-4" />
                    Import
                  </button>
                  
                  <button
                    onClick={() => handleSync(connector.id, 'export')}
                    disabled={activeSync === connector.id}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Icon path="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" className="w-4 h-4" />
                    Export
                  </button>
                  
                  <button
                    onClick={() => handleSync(connector.id, 'bidirectional')}
                    disabled={activeSync === connector.id}
                    className="px-3 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-600/50 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Icon path="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" className="w-4 h-4" />
                    Sync Both
                  </button>
                </div>
                
                {activeSync === connector.id && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                    <div className="animate-spin w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full"></div>
                    Syncing data...
                  </div>
                )}
              </div>
            )}
          </GlassCard>
        ))}
      </div>

      {showAddConnector && (
        <AddConnectorModal
          onClose={() => setShowAddConnector(false)}
          onAdd={(config) => {
            setConnectors([...connectors, config]);
            setShowAddConnector(false);
          }}
        />
      )}
    </div>
  );
};

const AddConnectorModal: React.FC<{
  onClose: () => void;
  onAdd: (config: ConnectorConfig) => void;
}> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'spreadsheet',
    spreadsheetId: '',
    range: 'A:Z',
    apiKey: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const config: ConnectorConfig = {
      id: `${formData.type}-${Date.now()}`,
      name: formData.name,
      type: formData.type as any,
      config: {
        spreadsheetId: formData.spreadsheetId,
        range: formData.range,
        apiKey: formData.apiKey
      },
      enabled: true
    };
    
    onAdd(config);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <GlassCard className="w-full max-w-md p-6 mx-4">
        <h2 className="text-xl font-bold text-slate-200 mb-4">Add Connector</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="spreadsheet">Google Sheets</option>
              <option value="database">Database</option>
              <option value="api">REST API</option>
            </select>
          </div>
          
          {formData.type === 'spreadsheet' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Spreadsheet ID
                </label>
                <input
                  type="text"
                  value={formData.spreadsheetId}
                  onChange={(e) => setFormData({ ...formData, spreadsheetId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Range
                </label>
                <input
                  type="text"
                  value={formData.range}
                  onChange={(e) => setFormData({ ...formData, range: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Sheet1!A:Z"
                />
              </div>
            </>
          )}
          
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
            >
              Add Connector
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default DataSyncPage;