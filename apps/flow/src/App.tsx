import React, { useState } from 'react';

// Helper components
const Icon = ({ path, className = 'w-6 h-6' }: { path: string; className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
  </svg>
);

const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-slate-800/60 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-lg ${className}`}>
    {children}
  </div>
);

const FlowDashboard = () => {
  const [selectedView, setSelectedView] = useState('documents');

  const documents = [
    { 
      name: "Employee Onboarding SOP", 
      quality: 92, 
      compliance: "Pass", 
      issues: 1,
      category: "HR Process",
      lastUpdated: "2 days ago",
      owner: "Sarah Chen",
      version: "v2.1",
      wordCount: 2400
    },
    { 
      name: "Procurement Policy", 
      quality: 78, 
      compliance: "Review", 
      issues: 4,
      category: "Finance Policy",
      lastUpdated: "1 week ago",
      owner: "Alex Kim",
      version: "v1.8",
      wordCount: 3200
    },
    { 
      name: "Data Handling Protocol", 
      quality: 65, 
      compliance: "Fail", 
      issues: 7,
      category: "IT Security",
      lastUpdated: "3 weeks ago",
      owner: "Mike Torres",
      version: "v1.2",
      wordCount: 1800
    },
    { 
      name: "Customer Service Guidelines", 
      quality: 88, 
      compliance: "Pass", 
      issues: 2,
      category: "Operations",
      lastUpdated: "4 days ago",
      owner: "Jordan Lee",
      version: "v3.0",
      wordCount: 2800
    },
  ];

  const analysisInsights = [
    {
      title: "Critical Gap Identified",
      description: "Data Handling Protocol missing GDPR compliance clauses for international data transfers",
      severity: "high",
      category: "Compliance",
      affectedDocs: 3
    },
    {
      title: "Process Inefficiency",
      description: "Procurement approval workflow has 3 redundant steps, adding 5 days to average processing",
      severity: "medium", 
      category: "Efficiency",
      affectedDocs: 1
    },
    {
      title: "Documentation Outdated",
      description: "7 processes reference deprecated systems no longer in use",
      severity: "medium",
      category: "Accuracy",
      affectedDocs: 7
    }
  ];

  const complianceFrameworks = [
    { name: "ISO 9001", coverage: 85, missing: 3, status: "Good" },
    { name: "GDPR", coverage: 92, missing: 1, status: "Excellent" },
    { name: "SOC 2", coverage: 68, missing: 5, status: "Needs Work" },
    { name: "ISO 27001", coverage: 76, missing: 4, status: "Good" }
  ];

  const processMetrics = {
    totalProcesses: 47,
    compliantProcesses: 32,
    needsReview: 11,
    criticalIssues: 4,
    avgQualityScore: 82
  };

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <Icon path="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-8 h-8 text-sky-400" />
          <h1 className="text-2xl font-bold">Aesyros Flow</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="flex gap-2">
            <button 
              onClick={() => setSelectedView('documents')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedView === 'documents' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-sky-400'}`}
            >
              Documents
            </button>
            <button 
              onClick={() => setSelectedView('compliance')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedView === 'compliance' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-sky-400'}`}
            >
              Compliance
            </button>
            <button 
              onClick={() => setSelectedView('insights')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedView === 'insights' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-sky-400'}`}
            >
              Insights
            </button>
          </nav>
          <button className="bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold py-2 px-5 rounded-lg shadow-lg hover:from-sky-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all">
            + Analyze Document
          </button>
        </div>
      </header>

      <main className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-100">Process Validation Hub</h2>
            <p className="text-slate-400 mt-2">Ensure your workflows and policies are efficient, compliant, and clear.</p>
          </div>
          
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-sky-400">{processMetrics.totalProcesses}</div>
              <div className="text-xs text-slate-400">Total Processes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{processMetrics.compliantProcesses}</div>
              <div className="text-xs text-slate-400">Compliant</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{processMetrics.needsReview}</div>
              <div className="text-xs text-slate-400">Needs Review</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{processMetrics.criticalIssues}</div>
              <div className="text-xs text-slate-400">Critical Issues</div>
            </div>
          </div>
        </div>

        {selectedView === 'documents' && (
          <>
            {/* Document Upload */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">Analyze a New Process or Policy</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Icon path="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" className="w-10 h-10 mb-3 text-slate-500" />
                      <p className="mb-2 text-sm text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-slate-500">Word, PDF, or text files (Max 10MB)</p>
                    </div>
                    <input type="file" className="hidden" />
                  </label>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Quick Analysis Options</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm">Compliance Check (GDPR, ISO)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm">Process Efficiency Analysis</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm">Clarity & Readability Score</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Risk Assessment</span>
                    </label>
                  </div>
                  <button className="w-full bg-sky-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors">
                    Start Analysis
                  </button>
                </div>
              </div>
            </GlassCard>

            {/* Document Analysis Results */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">Document Library & Analysis</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="p-3 font-semibold">Document</th>
                      <th className="p-3 font-semibold">Quality Score</th>
                      <th className="p-3 font-semibold">Compliance</th>
                      <th className="p-3 font-semibold">Issues</th>
                      <th className="p-3 font-semibold">Details</th>
                      <th className="p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map(doc => (
                      <tr key={doc.name} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                        <td className="p-3">
                          <div>
                            <div className="font-semibold">{doc.name}</div>
                            <div className="text-sm text-slate-400">{doc.category} • {doc.version}</div>
                            <div className="text-xs text-slate-500">Owner: {doc.owner} • {doc.lastUpdated}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${doc.quality >= 90 ? 'bg-green-500' : doc.quality >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                style={{ width: `${doc.quality}%` }}
                              ></div>
                            </div>
                            <span className="font-mono text-sm">{doc.quality}%</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                            doc.compliance === 'Pass' ? 'bg-green-500/20 text-green-300' : 
                            doc.compliance === 'Review' ? 'bg-yellow-500/20 text-yellow-300' : 
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {doc.compliance}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`font-semibold ${doc.issues === 0 ? 'text-green-400' : doc.issues <= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {doc.issues} {doc.issues === 1 ? 'issue' : 'issues'}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-slate-400">
                          {doc.wordCount.toLocaleString()} words
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button className="text-sky-400 hover:text-sky-300 text-sm font-medium">View</button>
                            <button className="text-sky-400 hover:text-sky-300 text-sm font-medium">Edit</button>
                            {doc.issues > 0 && (
                              <button className="text-yellow-400 hover:text-yellow-300 text-sm font-medium">Fix</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </>
        )}

        {selectedView === 'compliance' && (
          <>
            {/* Compliance Framework Status */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">Compliance Framework Coverage</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {complianceFrameworks.map(framework => (
                  <div key={framework.name} className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold">{framework.name}</h4>
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        framework.status === 'Excellent' ? 'bg-green-500/20 text-green-300' :
                        framework.status === 'Good' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {framework.status}
                      </span>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Coverage</span>
                        <span className="font-mono">{framework.coverage}%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${framework.coverage >= 90 ? 'bg-green-500' : framework.coverage >= 75 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                          style={{ width: `${framework.coverage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-400">
                      {framework.missing} requirements missing
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Compliance Actions */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">Priority Compliance Actions</h3>
              <div className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-red-300">GDPR Data Transfer Clauses Missing</h4>
                    <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full">Critical</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">Data Handling Protocol lacks required clauses for international data transfers under GDPR Article 46.</p>
                  <button className="text-sm font-medium text-red-400 hover:text-red-300">Add Required Clauses</button>
                </div>
                
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-yellow-300">SOC 2 Access Controls Update</h4>
                    <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">Medium</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">Access control procedures need updates to meet SOC 2 Type II requirements.</p>
                  <button className="text-sm font-medium text-yellow-400 hover:text-yellow-300">Update Procedures</button>
                </div>
                
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-blue-300">ISO 27001 Risk Assessment</h4>
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">Low</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">Annual risk assessment documentation requires updates for ISO 27001 compliance.</p>
                  <button className="text-sm font-medium text-blue-400 hover:text-blue-300">Schedule Assessment</button>
                </div>
              </div>
            </GlassCard>
          </>
        )}

        {selectedView === 'insights' && (
          <>
            {/* AI Analysis Insights */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z" className="w-6 h-6 text-sky-400" />
                AI Process Intelligence
              </h3>
              <p className="text-slate-400 mb-6">Advanced analysis of your processes reveals optimization opportunities and compliance gaps.</p>
              
              <div className="space-y-4">
                {analysisInsights.map((insight, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${
                    insight.severity === 'high' ? 'bg-red-500/10 border-red-500' :
                    insight.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500' :
                    'bg-blue-500/10 border-blue-500'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                          insight.severity === 'high' ? 'bg-red-500/20 text-red-300' :
                          insight.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {insight.severity.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-400">{insight.affectedDocs} docs affected</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">{insight.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Category: {insight.category}</span>
                      <button className="text-sm font-medium text-sky-400 hover:text-sky-300">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Process Optimization Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold mb-4">Workflow Optimization</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Approval Bottlenecks</h4>
                    <p className="text-sm text-slate-400 mb-3">3 processes have single points of failure in approval chains</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Impact: 5-7 day delays</span>
                      <button className="text-sm text-sky-400 hover:text-sky-300">Redesign Workflow</button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Duplicate Steps</h4>
                    <p className="text-sm text-slate-400 mb-3">Multiple processes contain redundant verification steps</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Potential savings: 20% time</span>
                      <button className="text-sm text-sky-400 hover:text-sky-300">Streamline Process</button>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold mb-4">Documentation Health</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                    <div>
                      <div className="font-medium">Average Quality Score</div>
                      <div className="text-sm text-slate-400">Across all documents</div>
                    </div>
                    <div className="text-2xl font-bold text-sky-400">{processMetrics.avgQualityScore}%</div>
                  </div>
                  
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Update Cadence</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Updated this month</span>
                        <span className="text-green-400">12 docs</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Updated this quarter</span>
                        <span className="text-yellow-400">23 docs</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overdue for review</span>
                        <span className="text-red-400">8 docs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Process Simulation */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">Process Simulation Engine</h3>
              <p className="text-slate-400 mb-6">Test process changes before implementation to predict impact on efficiency and compliance.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-700/50 rounded-lg text-center">
                  <Icon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-sky-400 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Time Analysis</h4>
                  <p className="text-sm text-slate-400">Simulate processing times and identify bottlenecks</p>
                </div>
                
                <div className="p-4 bg-slate-700/50 rounded-lg text-center">
                  <Icon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" className="w-8 h-8 text-sky-400 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Resource Impact</h4>
                  <p className="text-sm text-slate-400">Model human resource and cost implications</p>
                </div>
                
                <div className="p-4 bg-slate-700/50 rounded-lg text-center">
                  <Icon path="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" className="w-8 h-8 text-sky-400 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Risk Assessment</h4>
                  <p className="text-sm text-slate-400">Evaluate compliance and operational risk changes</p>
                </div>
              </div>
            </GlassCard>
          </>
        )}

        {/* Quick Actions Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 bg-slate-800/60 rounded-lg border border-slate-700 hover:border-sky-500/50 transition-colors text-left">
            <Icon path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-6 h-6 text-sky-400 mb-2" />
            <div className="font-semibold">Template Library</div>
            <div className="text-sm text-slate-400">Browse process templates</div>
          </button>
          
          <button className="p-4 bg-slate-800/60 rounded-lg border border-slate-700 hover:border-sky-500/50 transition-colors text-left">
            <Icon path="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h2m4-10h2a2 2 0 012 2v8a2 2 0 01-2 2h-2m-4-8h4" className="w-6 h-6 text-sky-400 mb-2" />
            <div className="font-semibold">Audit Trail</div>
            <div className="text-sm text-slate-400">Track all changes</div>
          </button>
          
          <button className="p-4 bg-slate-800/60 rounded-lg border border-slate-700 hover:border-sky-500/50 transition-colors text-left">
            <Icon path="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" className="w-6 h-6 text-sky-400 mb-2" />
            <div className="font-semibold">Workflow Builder</div>
            <div className="text-sm text-slate-400">Create visual processes</div>
          </button>
          
          <button className="p-4 bg-slate-800/60 rounded-lg border border-slate-700 hover:border-sky-500/50 transition-colors text-left">
            <Icon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" className="w-6 h-6 text-sky-400 mb-2" />
            <div className="font-semibold">Auto-Reminder</div>
            <div className="text-sm text-slate-400">Set review schedules</div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default FlowDashboard;