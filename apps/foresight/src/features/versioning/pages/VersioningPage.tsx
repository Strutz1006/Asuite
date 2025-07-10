import { useState } from 'react';
import { GlassCard, Icon } from '../../shared/components';

interface Version {
  id: string;
  version: string;
  title: string;
  description: string;
  author: string;
  timestamp: Date;
  changes: number;
  size: string;
  status: 'published' | 'draft' | 'archived';
  tags: string[];
  parentVersion?: string;
  isBreaking: boolean;
}

interface AuditEntry {
  id: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'revert' | 'merge';
  entity: string;
  field?: string;
  oldValue?: any;
  newValue?: any;
  user: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
}

export default function VersioningPage() {
  const [activeTab, setActiveTab] = useState<'versions' | 'audit'>('versions');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedAudit, setExpandedAudit] = useState<Set<string>>(new Set());

  const versions: Version[] = [
    {
      id: 'v1.2.1',
      version: '1.2.1',
      title: 'Q4 Revenue Forecast Update',
      description: 'Updated revenue projections based on latest market data and adjusted growth assumptions for enterprise segment.',
      author: 'Sarah Chen',
      timestamp: new Date('2024-01-15T14:30:00'),
      changes: 23,
      size: '2.4 MB',
      status: 'published',
      tags: ['revenue', 'forecast', 'q4'],
      isBreaking: false
    },
    {
      id: 'v1.2.0',
      version: '1.2.0',
      title: 'Major Model Restructure',
      description: 'Restructured financial model with new customer acquisition cost calculations and lifetime value methodology.',
      author: 'Michael Rodriguez',
      timestamp: new Date('2024-01-10T09:15:00'),
      changes: 87,
      size: '3.1 MB',
      status: 'published',
      tags: ['structure', 'cac', 'ltv'],
      parentVersion: 'v1.1.5',
      isBreaking: true
    },
    {
      id: 'v1.1.5',
      version: '1.1.5',
      title: 'Holiday Season Adjustments',
      description: 'Minor adjustments to seasonal factors and holiday impact on sales projections.',
      author: 'Emily Davis',
      timestamp: new Date('2024-01-05T16:45:00'),
      changes: 12,
      size: '2.3 MB',
      status: 'archived',
      tags: ['seasonal', 'adjustments'],
      isBreaking: false
    },
    {
      id: 'v1.2.2-draft',
      version: '1.2.2-draft',
      title: 'New Product Line Integration',
      description: 'Work in progress: Integrating new product line forecasts and market expansion scenarios.',
      author: 'Alex Thompson',
      timestamp: new Date('2024-01-16T11:20:00'),
      changes: 34,
      size: '2.7 MB',
      status: 'draft',
      tags: ['product', 'expansion', 'wip'],
      isBreaking: false
    }
  ];

  const auditTrail: AuditEntry[] = [
    {
      id: 'audit-1',
      action: 'publish',
      entity: 'Scenario: Q4 Revenue Forecast',
      user: 'Sarah Chen',
      timestamp: new Date('2024-01-15T14:30:15'),
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      sessionId: 'sess_abc123'
    },
    {
      id: 'audit-2',
      action: 'update',
      entity: 'Business Lever: Revenue Growth Rate',
      field: 'baseline_value',
      oldValue: 15.2,
      newValue: 17.8,
      user: 'Sarah Chen',
      timestamp: new Date('2024-01-15T14:28:42'),
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      sessionId: 'sess_abc123'
    },
    {
      id: 'audit-3',
      action: 'create',
      entity: 'Risk Factor: Market Volatility',
      user: 'Michael Rodriguez',
      timestamp: new Date('2024-01-15T13:45:22'),
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      sessionId: 'sess_def456'
    },
    {
      id: 'audit-4',
      action: 'revert',
      entity: 'Outcome: Customer Acquisition',
      user: 'Emily Davis',
      timestamp: new Date('2024-01-15T12:15:08'),
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      sessionId: 'sess_ghi789'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-400 bg-green-400/20';
      case 'draft': return 'text-yellow-400 bg-yellow-400/20';
      case 'archived': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return <Icon path="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" className="w-4 h-4 text-green-400" />;
      case 'update': return <Icon path="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" className="w-4 h-4 text-blue-400" />;
      case 'delete': return <Icon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-red-400" />;
      case 'publish': return <Icon path="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" className="w-4 h-4 text-purple-400" />;
      case 'revert': return <Icon path="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" className="w-4 h-4 text-orange-400" />;
      case 'merge': return <Icon path="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" className="w-4 h-4 text-cyan-400" />;
      default: return <Icon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-gray-400" />;
    }
  };

  const filteredVersions = versions.filter(version => {
    const matchesSearch = version.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         version.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         version.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         version.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || version.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const toggleAuditExpansion = (auditId: string) => {
    const newExpanded = new Set(expandedAudit);
    if (newExpanded.has(auditId)) {
      newExpanded.delete(auditId);
    } else {
      newExpanded.add(auditId);
    }
    setExpandedAudit(newExpanded);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Version Control & Audit Trail</h1>
          <p className="text-slate-400 mt-2">Track changes, manage versions, and audit all modifications</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium transition-colors">
            Create Version
          </button>
          <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">
            Export History
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-700">
        <button
          onClick={() => setActiveTab('versions')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'versions'
              ? 'text-sky-400 border-b-2 border-sky-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Version History
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'audit'
              ? 'text-sky-400 border-b-2 border-sky-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Audit Trail
        </button>
      </div>

      {activeTab === 'versions' && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search versions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              <Icon path="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredVersions.map((version) => (
              <GlassCard key={version.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{version.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(version.status)}`}>
                        {version.status}
                      </span>
                      {version.isBreaking && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                          Breaking
                        </span>
                      )}
                    </div>
                    
                    <p className="text-slate-300 mb-4">{version.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <Icon path="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" className="w-4 h-4" />
                        <span>v{version.version}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" className="w-4 h-4" />
                        <span>{version.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4" />
                        <span>{version.timestamp.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon path="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" className="w-4 h-4" />
                        <span>{version.changes} changes</span>
                      </div>
                      <span>{version.size}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3">
                      {version.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                      <Icon path="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                      <Icon path="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                      <Icon path="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-400">Showing {auditTrail.length} recent activities</p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors">
                Filter
              </button>
              <button className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors">
                Export
              </button>
            </div>
          </div>

          <GlassCard className="divide-y divide-slate-700/50">
            {auditTrail.map((entry) => (
              <div key={entry.id} className="p-4">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleAuditExpansion(entry.id)}
                >
                  <div className="flex items-center gap-3">
                    {getActionIcon(entry.action)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium capitalize">{entry.action}</span>
                        <span className="text-slate-300">{entry.entity}</span>
                        {entry.field && (
                          <span className="text-slate-400">({entry.field})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                        <span>{entry.user}</span>
                        <span>{entry.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {expandedAudit.has(entry.id) ? (
                      <Icon path="M19.5 8.25l-7.5 7.5-7.5-7.5" className="w-5 h-5 text-slate-400" />
                    ) : (
                      <Icon path="M8.25 4.5l7.5 7.5-7.5 7.5" className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>
                
                {expandedAudit.has(entry.id) && (
                  <div className="mt-4 pl-7 space-y-2 text-sm">
                    {entry.field && entry.oldValue !== undefined && entry.newValue !== undefined && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-slate-400">Previous Value:</span>
                          <div className="bg-red-500/10 border border-red-500/20 rounded p-2 mt-1">
                            <code className="text-red-400">{JSON.stringify(entry.oldValue)}</code>
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-400">New Value:</span>
                          <div className="bg-green-500/10 border border-green-500/20 rounded p-2 mt-1">
                            <code className="text-green-400">{JSON.stringify(entry.newValue)}</code>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-3 gap-4 text-slate-400">
                      <div>
                        <span className="block">IP Address:</span>
                        <code className="text-slate-300">{entry.ipAddress}</code>
                      </div>
                      <div>
                        <span className="block">Session ID:</span>
                        <code className="text-slate-300">{entry.sessionId}</code>
                      </div>
                      <div>
                        <span className="block">User Agent:</span>
                        <code className="text-slate-300 text-xs">{entry.userAgent}</code>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </GlassCard>
        </div>
      )}
    </div>
  );
}