import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard, Icon } from '../../shared/components';
import { 
  mockProcesses, 
  mockDocuments, 
  mockValidationIssues, 
  mockProcessMetrics 
} from '../../shared/data/mockData';

const DashboardPage: React.FC = () => {
  const getComplianceColor = (compliance: string) => {
    switch (compliance) {
      case 'Pass': return 'text-green-400 bg-green-500/20';
      case 'Review': return 'text-yellow-400 bg-yellow-500/20';
      case 'Fail': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 90) return 'text-green-400';
    if (quality >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const recentIssues = mockValidationIssues
    .filter(issue => !issue.resolved)
    .sort((a, _b) => a.severity === 'high' ? -1 : 1)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">Process Command Center</h2>
          <p className="text-slate-400 mt-2">Validate, optimize, and maintain your organizational processes</p>
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-sky-400">{mockProcessMetrics.totalProcesses}</div>
            <div className="text-xs text-slate-400">Total Processes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">{mockProcessMetrics.complianceRate}%</div>
            <div className="text-xs text-slate-400">Compliance</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">{mockProcessMetrics.pendingReviews}</div>
            <div className="text-xs text-slate-400">Pending Reviews</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">{mockProcessMetrics.averageQuality}%</div>
            <div className="text-xs text-slate-400">Avg Quality</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Documents */}
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-slate-100">Recently Validated Documents</h3>
              <Link 
                to="/documents" 
                className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
              >
                View All Documents →
              </Link>
            </div>
            
            <div className="space-y-4">
              {mockDocuments.map(doc => (
                <div key={doc.id} className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-100 mb-1">{doc.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>Owner: {doc.owner}</span>
                        <span>Version: {doc.version}</span>
                        <span>{doc.wordCount} words</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getComplianceColor(doc.compliance)}`}>
                        {doc.compliance}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-slate-400">Quality:</span>
                        <span className={`font-mono text-sm ${getQualityColor(doc.quality)}`}>
                          {doc.quality}%
                        </span>
                      </div>
                      {doc.issues > 0 && (
                        <div className="flex items-center gap-1">
                          <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-yellow-400">{doc.issues} issues</span>
                        </div>
                      )}
                    </div>
                    <Link
                      to={`/documents/${doc.id}`}
                      className="text-sm bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded transition-colors"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Process Overview */}
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-slate-100">Active Processes</h3>
              <Link 
                to="/processes" 
                className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
              >
                Manage Processes →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockProcesses.slice(0, 4).map(process => (
                <div key={process.id} className="p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="font-semibold text-slate-100 mb-2">{process.name}</h4>
                  <div className="text-sm text-slate-400 mb-3">
                    {process.steps.length} steps • Owner: {process.owner}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">
                      Updated {process.lastUpdated.toLocaleDateString()}
                    </span>
                    <Link
                      to={`/processes/${process.id}`}
                      className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* AI Validation Assistant */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z" className="w-6 h-6 text-sky-400"/>
              AI Validation Assistant
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <h4 className="font-semibold text-red-300 mb-2">Critical Issue</h4>
                <p className="text-sm text-slate-300 mb-3">Data Handling Protocol has 7 compliance issues that need immediate attention.</p>
                <Link to="/validator" className="text-sm font-semibold text-red-400 hover:text-red-300">
                  Review Issues
                </Link>
              </div>
              
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <h4 className="font-semibold text-yellow-300 mb-2">Optimization Opportunity</h4>
                <p className="text-sm text-slate-300 mb-3">Procurement Policy can be streamlined by removing 2 redundant approval steps.</p>
                <button className="text-sm font-semibold text-yellow-400 hover:text-yellow-300">
                  Optimize
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Recent Issues */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Recent Validation Issues</h3>
            <div className="space-y-4">
              {recentIssues.map(issue => (
                <div key={issue.id} className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Icon 
                      path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" 
                      className={`w-4 h-4 mt-0.5 ${
                        issue.severity === 'high' ? 'text-red-400' :
                        issue.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{issue.title}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {mockDocuments.find(d => d.id === issue.documentId)?.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                to="/validator"
                className="w-full p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors text-left block"
              >
                <div className="flex items-center gap-3">
                  <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 text-sky-400" />
                  <div>
                    <div className="font-medium">Validate Document</div>
                    <div className="text-xs text-slate-400">AI-powered validation</div>
                  </div>
                </div>
              </Link>
              
              <Link 
                to="/processes/new"
                className="w-full p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors text-left block"
              >
                <div className="flex items-center gap-3">
                  <Icon path="M12 4v16m8-8H4" className="w-5 h-5 text-sky-400" />
                  <div>
                    <div className="font-medium">New Process</div>
                    <div className="text-xs text-slate-400">Create workflow</div>
                  </div>
                </div>
              </Link>
              
              <button className="w-full p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <Icon path="M15 17h5l-5 5v-5z" className="w-5 h-5 text-sky-400" />
                  <div>
                    <div className="font-medium">Export Report</div>
                    <div className="text-xs text-slate-400">Compliance summary</div>
                  </div>
                </div>
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Quick Stats */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Process Health Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">{mockProcessMetrics.documentsValidated}</div>
            <div className="text-sm text-slate-400">Documents Validated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-1">{mockProcessMetrics.issuesResolved}</div>
            <div className="text-sm text-slate-400">Issues Resolved</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-1">{mockProcesses.reduce((acc, p) => acc + p.steps.length, 0)}</div>
            <div className="text-sm text-slate-400">Total Process Steps</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-sky-400 mb-1">
              {Math.round(mockProcesses.reduce((acc, p) => acc + p.steps.reduce((sum, s) => sum + (s.estimatedTime || 0), 0), 0) / 60)}h
            </div>
            <div className="text-sm text-slate-400">Estimated Time</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default DashboardPage;