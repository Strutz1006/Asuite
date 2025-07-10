import React, { useState, useEffect } from 'react';
import { GlassCard, Icon } from '../../shared/components';
import type { ProcessMetrics, CycleTimeMetrics, ResourceMetrics, QualityMetrics, CostMetrics, Bottleneck } from '../../shared/types/advanced';

const AnalyticsPage: React.FC = () => {
  const [processMetrics, setProcessMetrics] = useState<ProcessMetrics[]>([]);
  const [selectedProcess, setSelectedProcess] = useState<ProcessMetrics | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeMetric, setActiveMetric] = useState<'cycle' | 'resource' | 'quality' | 'cost'>('cycle');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = () => {
    // Mock analytics data
    const mockMetrics: ProcessMetrics[] = [
      {
        processId: 'proc-1',
        cycleTime: {
          average: 4.2,
          median: 3.8,
          standardDeviation: 1.2,
          percentiles: {
            '50': 3.8,
            '75': 4.9,
            '90': 6.1,
            '95': 7.2
          },
          bottlenecks: [
            {
              stepId: 'step-2',
              stepName: 'Manager Approval',
              avgWaitTime: 2.1,
              frequency: 85,
              impact: 'high',
              suggestions: [
                'Implement delegation rules',
                'Add backup approvers',
                'Automate routine approvals'
              ]
            },
            {
              stepId: 'step-4',
              stepName: 'Document Review',
              avgWaitTime: 1.3,
              frequency: 60,
              impact: 'medium',
              suggestions: [
                'Pre-validate documents',
                'Provide review templates',
                'Add automated checks'
              ]
            }
          ]
        },
        resourceUtilization: {
          totalUtilization: 73.5,
          byRole: {
            'Manager': 89.2,
            'Analyst': 65.8,
            'Admin': 71.3,
            'Reviewer': 78.6
          },
          overAllocated: ['Manager'],
          underUtilized: ['Analyst'],
          skillGaps: [
            {
              skill: 'Risk Assessment',
              currentLevel: 6.2,
              requiredLevel: 8.0,
              affectedSteps: ['step-3', 'step-5'],
              trainingRequired: true
            }
          ]
        },
        qualityMetrics: {
          defectRate: 3.2,
          reworkRate: 8.5,
          firstPassYield: 91.5,
          customerSatisfaction: 8.3,
          qualityTrends: [
            { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), metric: 'defectRate', value: 3.5, benchmark: 3.0 },
            { date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), metric: 'defectRate', value: 3.8, benchmark: 3.0 },
            { date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), metric: 'defectRate', value: 3.1, benchmark: 3.0 }
          ]
        },
        costMetrics: {
          totalCost: 1250,
          costPerExecution: 62.5,
          laborCost: 980,
          systemCost: 270,
          optimizationPotential: 18.5,
          benchmarkComparison: 12.3
        },
        performanceTrend: {
          period: 'weekly',
          data: [
            { date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), value: 4.5 },
            { date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), value: 4.3 },
            { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), value: 4.2 },
            { date: new Date(), value: 4.0 }
          ],
          forecast: [
            { date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), value: 3.9, confidence: 0.85 },
            { date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), value: 3.8, confidence: 0.78 }
          ],
          seasonality: false
        }
      },
      {
        processId: 'proc-2',
        cycleTime: {
          average: 2.8,
          median: 2.5,
          standardDeviation: 0.8,
          percentiles: {
            '50': 2.5,
            '75': 3.2,
            '90': 3.9,
            '95': 4.5
          },
          bottlenecks: [
            {
              stepId: 'step-1',
              stepName: 'Initial Assessment',
              avgWaitTime: 0.9,
              frequency: 45,
              impact: 'medium',
              suggestions: [
                'Standardize assessment criteria',
                'Provide assessment tools'
              ]
            }
          ]
        },
        resourceUtilization: {
          totalUtilization: 68.2,
          byRole: {
            'Specialist': 82.1,
            'Coordinator': 59.8,
            'Analyst': 63.7
          },
          overAllocated: [],
          underUtilized: ['Coordinator'],
          skillGaps: []
        },
        qualityMetrics: {
          defectRate: 1.8,
          reworkRate: 4.2,
          firstPassYield: 95.8,
          customerSatisfaction: 8.7,
          qualityTrends: [
            { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), metric: 'defectRate', value: 1.9, benchmark: 2.0 },
            { date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), metric: 'defectRate', value: 1.7, benchmark: 2.0 }
          ]
        },
        costMetrics: {
          totalCost: 850,
          costPerExecution: 28.3,
          laborCost: 650,
          systemCost: 200,
          optimizationPotential: 12.8,
          benchmarkComparison: 8.9
        },
        performanceTrend: {
          period: 'weekly',
          data: [
            { date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), value: 3.1 },
            { date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), value: 2.9 },
            { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), value: 2.8 },
            { date: new Date(), value: 2.7 }
          ],
          forecast: [
            { date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), value: 2.6, confidence: 0.92 }
          ],
          seasonality: false
        }
      }
    ];

    setProcessMetrics(mockMetrics);
    if (!selectedProcess && mockMetrics.length > 0) {
      setSelectedProcess(mockMetrics[0]);
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-400';
    if (utilization >= 80) return 'text-yellow-400';
    if (utilization >= 60) return 'text-green-400';
    return 'text-blue-400';
  };

  const getQualityColor = (value: number, benchmark: number) => {
    if (value <= benchmark * 0.8) return 'text-green-400';
    if (value <= benchmark) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getBottleneckImpactColor = (impact: Bottleneck['impact']) => {
    switch (impact) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-200">Process Analytics</h1>
          <p className="text-slate-400 mt-1">
            Comprehensive performance analysis with cycle time, resource utilization, and quality metrics
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center gap-2">
            <Icon path="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Avg Cycle Time</p>
              <p className="text-2xl font-bold text-slate-200">
                {processMetrics.length > 0 ? 
                  (processMetrics.reduce((acc, p) => acc + p.cycleTime.average, 0) / processMetrics.length).toFixed(1) + 'd'
                  : '0d'
                }
              </p>
            </div>
            <Icon path="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-sky-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Resource Utilization</p>
              <p className="text-2xl font-bold text-slate-200">
                {processMetrics.length > 0 ? 
                  Math.round(processMetrics.reduce((acc, p) => acc + p.resourceUtilization.totalUtilization, 0) / processMetrics.length) + '%'
                  : '0%'
                }
              </p>
            </div>
            <Icon path="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" className="w-8 h-8 text-green-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">First Pass Yield</p>
              <p className="text-2xl font-bold text-slate-200">
                {processMetrics.length > 0 ? 
                  (processMetrics.reduce((acc, p) => acc + p.qualityMetrics.firstPassYield, 0) / processMetrics.length).toFixed(1) + '%'
                  : '0%'
                }
              </p>
            </div>
            <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-blue-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Optimization Potential</p>
              <p className="text-2xl font-bold text-slate-200">
                {processMetrics.length > 0 ? 
                  (processMetrics.reduce((acc, p) => acc + p.costMetrics.optimizationPotential, 0) / processMetrics.length).toFixed(1) + '%'
                  : '0%'
                }
              </p>
            </div>
            <Icon path="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" className="w-8 h-8 text-yellow-400" />
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Process List */}
        <div>
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Processes</h3>
            
            <div className="space-y-3">
              {processMetrics.map((metrics) => (
                <div
                  key={metrics.processId}
                  onClick={() => setSelectedProcess(metrics)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedProcess?.processId === metrics.processId
                      ? 'bg-sky-600/20 border border-sky-600/50'
                      : 'bg-slate-800/50 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-slate-200">Process {metrics.processId}</h4>
                    <span className="text-sm text-slate-400">
                      {metrics.cycleTime.average.toFixed(1)}d
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Utilization:</span>
                      <span className={getUtilizationColor(metrics.resourceUtilization.totalUtilization)}>
                        {metrics.resourceUtilization.totalUtilization.toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Quality:</span>
                      <span className="text-green-400">
                        {metrics.qualityMetrics.firstPassYield.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Detailed Analytics */}
        <div className="lg:col-span-2">
          {selectedProcess ? (
            <div className="space-y-6">
              {/* Metric Tabs */}
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-200">
                    Process {selectedProcess.processId} Analytics
                  </h3>
                  
                  <div className="flex bg-slate-800 rounded-lg p-1">
                    {(['cycle', 'resource', 'quality', 'cost'] as const).map((metric) => (
                      <button
                        key={metric}
                        onClick={() => setActiveMetric(metric)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          activeMetric === metric
                            ? 'bg-sky-600 text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {metric.charAt(0).toUpperCase() + metric.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cycle Time Metrics */}
                {activeMetric === 'cycle' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-sky-400">
                          {selectedProcess.cycleTime.average.toFixed(1)}d
                        </div>
                        <div className="text-sm text-slate-400">Average</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {selectedProcess.cycleTime.median.toFixed(1)}d
                        </div>
                        <div className="text-sm text-slate-400">Median</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">
                          {selectedProcess.cycleTime.percentiles['90'].toFixed(1)}d
                        </div>
                        <div className="text-sm text-slate-400">90th Percentile</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-400">
                          {selectedProcess.cycleTime.standardDeviation.toFixed(1)}d
                        </div>
                        <div className="text-sm text-slate-400">Std Dev</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-3">Bottlenecks</h4>
                      <div className="space-y-2">
                        {selectedProcess.cycleTime.bottlenecks.map((bottleneck, index) => (
                          <div key={index} className="p-3 bg-slate-800/50 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-slate-200">{bottleneck.stepName}</h5>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getBottleneckImpactColor(bottleneck.impact)}`}>
                                {bottleneck.impact}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-400 mb-2">
                              <span>Avg Wait: {bottleneck.avgWaitTime.toFixed(1)}d</span>
                              <span>Frequency: {bottleneck.frequency}%</span>
                            </div>
                            <div className="text-xs text-slate-500">
                              <strong>Suggestions:</strong> {bottleneck.suggestions.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Resource Metrics */}
                {activeMetric === 'resource' && (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-slate-200 mb-1">
                        {selectedProcess.resourceUtilization.totalUtilization.toFixed(1)}%
                      </div>
                      <div className="text-sm text-slate-400">Overall Utilization</div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-3">By Role</h4>
                      <div className="space-y-2">
                        {Object.entries(selectedProcess.resourceUtilization.byRole).map(([role, utilization]) => (
                          <div key={role} className="flex justify-between items-center">
                            <span className="text-slate-400">{role}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-slate-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${getUtilizationColor(utilization).includes('red') ? 'bg-red-400' : 
                                    getUtilizationColor(utilization).includes('yellow') ? 'bg-yellow-400' : 
                                    getUtilizationColor(utilization).includes('green') ? 'bg-green-400' : 'bg-blue-400'}`}
                                  style={{ width: `${Math.min(utilization, 100)}%` }}
                                />
                              </div>
                              <span className={`text-sm font-medium ${getUtilizationColor(utilization)}`}>
                                {utilization.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {selectedProcess.resourceUtilization.skillGaps.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-300 mb-3">Skill Gaps</h4>
                        <div className="space-y-2">
                          {selectedProcess.resourceUtilization.skillGaps.map((gap, index) => (
                            <div key={index} className="p-3 bg-slate-800/50 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-slate-200">{gap.skill}</span>
                                <span className="text-sm text-red-400">
                                  Gap: {(gap.requiredLevel - gap.currentLevel).toFixed(1)}
                                </span>
                              </div>
                              <div className="text-sm text-slate-400">
                                Current: {gap.currentLevel}/10 • Required: {gap.requiredLevel}/10
                              </div>
                              {gap.trainingRequired && (
                                <div className="text-xs text-yellow-400 mt-1">Training recommended</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Quality Metrics */}
                {activeMetric === 'quality' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">
                          {selectedProcess.qualityMetrics.defectRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-slate-400">Defect Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">
                          {selectedProcess.qualityMetrics.reworkRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-slate-400">Rework Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {selectedProcess.qualityMetrics.firstPassYield.toFixed(1)}%
                        </div>
                        <div className="text-sm text-slate-400">First Pass Yield</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {selectedProcess.qualityMetrics.customerSatisfaction.toFixed(1)}
                        </div>
                        <div className="text-sm text-slate-400">CSAT Score</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cost Metrics */}
                {activeMetric === 'cost' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-sky-400">
                          ${selectedProcess.costMetrics.totalCost}
                        </div>
                        <div className="text-sm text-slate-400">Total Cost</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                          ${selectedProcess.costMetrics.costPerExecution.toFixed(0)}
                        </div>
                        <div className="text-sm text-slate-400">Cost per Execution</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">
                          {selectedProcess.costMetrics.optimizationPotential.toFixed(1)}%
                        </div>
                        <div className="text-sm text-slate-400">Optimization Potential</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-lg font-semibold text-slate-200 mb-2">Cost Breakdown</div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Labor</span>
                            <span className="text-slate-200">${selectedProcess.costMetrics.laborCost}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Systems</span>
                            <span className="text-slate-200">${selectedProcess.costMetrics.systemCost}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-lg font-semibold text-slate-200 mb-2">vs Benchmark</div>
                        <div className="text-2xl font-bold text-green-400">
                          {selectedProcess.costMetrics.benchmarkComparison > 0 ? '+' : ''}{selectedProcess.costMetrics.benchmarkComparison.toFixed(1)}%
                        </div>
                        <div className="text-sm text-slate-400">
                          {selectedProcess.costMetrics.benchmarkComparison > 0 ? 'Above' : 'Below'} industry average
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>
          ) : (
            <GlassCard className="p-6 text-center">
              <Icon path="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-200 mb-2">Select Process</h3>
              <p className="text-slate-400">Choose a process to view detailed performance analytics</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;