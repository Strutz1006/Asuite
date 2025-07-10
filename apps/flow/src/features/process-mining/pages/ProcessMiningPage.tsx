import React, { useState, useEffect } from 'react';
import { GlassCard, Icon } from '../../shared/components';
import type { ProcessMiningResult, GapAnalysis, ShadowProcess } from '../../shared/types/advanced';

const ProcessMiningPage: React.FC = () => {
  const [miningResults, setMiningResults] = useState<ProcessMiningResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<ProcessMiningResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisSource, setAnalysisSource] = useState<'email' | 'logs' | 'tasks' | 'all'>('all');

  useEffect(() => {
    loadMiningResults();
  }, []);

  const loadMiningResults = () => {
    // Mock data - in real implementation, this would call the process mining service
    const mockResults: ProcessMiningResult[] = [
      {
        id: '1',
        processName: 'Employee Onboarding',
        discoveredVariants: [
          {
            id: 'v1',
            frequency: 85,
            avgDuration: 4.2,
            path: [
              { id: '1', title: 'Document Collection', description: 'Collect required documents', order: 1, required: true, estimatedTime: 30 },
              { id: '2', title: 'Background Check', description: 'Verify background information', order: 2, required: true, estimatedTime: 60 },
              { id: '3', title: 'IT Setup', description: 'Provision accounts and devices', order: 3, required: true, estimatedTime: 45 }
            ],
            performance: {
              avgDuration: 4.2,
              throughput: 12.5,
              bottlenecks: ['Background Check'],
              efficiency: 78
            }
          },
          {
            id: 'v2',
            frequency: 15,
            avgDuration: 6.8,
            path: [
              { id: '1', title: 'Document Collection', description: 'Collect required documents', order: 1, required: true, estimatedTime: 30 },
              { id: '4', title: 'Manager Approval', description: 'Get manager sign-off', order: 2, required: false, estimatedTime: 120 },
              { id: '2', title: 'Background Check', description: 'Verify background information', order: 3, required: true, estimatedTime: 60 },
              { id: '3', title: 'IT Setup', description: 'Provision accounts and devices', order: 4, required: true, estimatedTime: 45 }
            ],
            performance: {
              avgDuration: 6.8,
              throughput: 8.2,
              bottlenecks: ['Manager Approval', 'Background Check'],
              efficiency: 52
            }
          }
        ],
        gapAnalysis: {
          documentedSteps: ['Document Collection', 'IT Setup', 'Department Introduction', 'Training Program'],
          actualSteps: ['Document Collection', 'Background Check', 'Manager Approval', 'IT Setup'],
          missingSteps: ['Department Introduction', 'Training Program'],
          extraSteps: ['Background Check', 'Manager Approval'],
          deviationScore: 0.6,
          recommendations: [
            'Update official process to include Background Check step',
            'Clarify when Manager Approval is required',
            'Investigate why Department Introduction is being skipped',
            'Ensure Training Program is completed for all new hires'
          ]
        },
        shadowProcesses: [
          {
            id: 'sp1',
            name: 'Informal IT Setup Shortcut',
            frequency: 23,
            participants: ['IT Admin', 'New Hire'],
            riskLevel: 'medium',
            businessImpact: 'Bypasses security protocols, potential compliance issues'
          }
        ],
        fingerprint: {
          id: 'fp1',
          pattern: 'approval-heavy-linear',
          complexity: 6.2,
          stakeholderCount: 4,
          systemCount: 3,
          riskProfile: 'medium-compliance',
          similarProcesses: ['Contractor Onboarding', 'Vendor Registration']
        },
        confidence: 0.87,
        lastAnalyzed: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ];
    
    setMiningResults(mockResults);
  };

  const startProcessDiscovery = async () => {
    setIsAnalyzing(true);
    
    // Mock analysis process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsAnalyzing(false);
    loadMiningResults();
  };

  const getGapSeverity = (score: number) => {
    if (score >= 0.8) return { color: 'text-red-400 bg-red-500/20', label: 'High' };
    if (score >= 0.5) return { color: 'text-yellow-400 bg-yellow-500/20', label: 'Medium' };
    return { color: 'text-green-400 bg-green-500/20', label: 'Low' };
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-200">Process Mining & Discovery</h1>
          <p className="text-slate-400 mt-1">
            Auto-discover actual workflows and identify gaps with documented processes
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={analysisSource}
            onChange={(e) => setAnalysisSource(e.target.value as any)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Sources</option>
            <option value="email">Email Patterns</option>
            <option value="logs">System Logs</option>
            <option value="tasks">Task Sequences</option>
          </select>
          
          <button
            onClick={startProcessDiscovery}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-600/50 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                Discover Processes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Processes Analyzed</p>
              <p className="text-2xl font-bold text-slate-200">{miningResults.length}</p>
            </div>
            <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z" className="w-8 h-8 text-sky-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Variants Discovered</p>
              <p className="text-2xl font-bold text-slate-200">
                {miningResults.reduce((acc, r) => acc + r.discoveredVariants.length, 0)}
              </p>
            </div>
            <Icon path="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l-1-3m1 3l-1-3m-16.5 0l1 3m-1-3l1 3" className="w-8 h-8 text-green-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Shadow Processes</p>
              <p className="text-2xl font-bold text-slate-200">
                {miningResults.reduce((acc, r) => acc + r.shadowProcesses.length, 0)}
              </p>
            </div>
            <Icon path="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" className="w-8 h-8 text-yellow-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Avg Confidence</p>
              <p className="text-2xl font-bold text-slate-200">
                {Math.round((miningResults.reduce((acc, r) => acc + r.confidence, 0) / miningResults.length) * 100)}%
              </p>
            </div>
            <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-blue-400" />
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mining Results List */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Mining Results</h3>
            
            <div className="space-y-4">
              {miningResults.map((result) => {
                const gapSeverity = getGapSeverity(result.gapAnalysis.deviationScore);
                
                return (
                  <div
                    key={result.id}
                    onClick={() => setSelectedResult(result)}
                    className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-200 mb-1">{result.processName}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>{result.discoveredVariants.length} variants</span>
                          <span>{result.shadowProcesses.length} shadow processes</span>
                          <span>Confidence: {Math.round(result.confidence * 100)}%</span>
                        </div>
                      </div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${gapSeverity.color}`}>
                        {gapSeverity.label} Gap
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Icon path="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-400">
                            Last analyzed: {result.lastAnalyzed.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      <button className="text-sky-400 hover:text-sky-300 text-sm">
                        View Details →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Selected Result Details */}
        <div>
          {selectedResult ? (
            <div className="space-y-4">
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Gap Analysis</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Missing Steps</h4>
                    <div className="space-y-1">
                      {selectedResult.gapAnalysis.missingSteps.map((step, index) => (
                        <div key={index} className="text-sm text-red-300 flex items-center gap-2">
                          <Icon path="M6 18L18 6M6 6l12 12" className="w-3 h-3" />
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Extra Steps</h4>
                    <div className="space-y-1">
                      {selectedResult.gapAnalysis.extraSteps.map((step, index) => (
                        <div key={index} className="text-sm text-yellow-300 flex items-center gap-2">
                          <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-3 h-3" />
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Recommendations</h4>
                    <div className="space-y-2">
                      {selectedResult.gapAnalysis.recommendations.map((rec, index) => (
                        <div key={index} className="text-sm text-slate-400 bg-slate-700/50 p-2 rounded">
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Shadow Processes</h3>
                
                <div className="space-y-3">
                  {selectedResult.shadowProcesses.map((shadow) => (
                    <div key={shadow.id} className="p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-slate-200">{shadow.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(shadow.riskLevel)}`}>
                          {shadow.riskLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{shadow.businessImpact}</p>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Frequency: {shadow.frequency}%</span>
                        <span>{shadow.participants.length} participants</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          ) : (
            <GlassCard className="p-6 text-center">
              <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-200 mb-2">Select a Process</h3>
              <p className="text-slate-400">Click on a mining result to view detailed analysis</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

interface VariantPerformance {
  avgDuration: number;
  throughput: number;
  bottlenecks: string[];
  efficiency: number;
}

export default ProcessMiningPage;