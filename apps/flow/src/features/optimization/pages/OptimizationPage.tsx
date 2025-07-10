import React, { useState, useEffect } from 'react';
import { GlassCard, Icon } from '../../shared/components';
import type { OptimizationOpportunity, AutomationOpportunity, PotentialSavings } from '../../shared/types/advanced';

const OptimizationPage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<OptimizationOpportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OptimizationOpportunity | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'automation' | 'simplification' | 'parallelization' | 'resource_optimization'>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadOptimizationOpportunities();
  }, []);

  const loadOptimizationOpportunities = () => {
    // Mock optimization opportunities
    const mockOpportunities: OptimizationOpportunity[] = [
      {
        id: 'opt-1',
        processId: 'proc-1',
        type: 'automation',
        description: 'Automate document validation and compliance checking using AI-powered rules engine',
        potentialSavings: {
          timeReduction: 65,
          costReduction: 24000,
          qualityImprovement: 15,
          riskReduction: 40,
          roiEstimate: 280,
          paybackPeriod: 4.2
        },
        implementationComplexity: 'medium',
        prerequisites: [
          'Standardize document formats',
          'Define validation rules',
          'Train AI model on historical data'
        ],
        riskLevel: 'low',
        priority: 95
      },
      {
        id: 'opt-2',
        processId: 'proc-1',
        type: 'simplification',
        description: 'Eliminate redundant approval steps in manager review process',
        potentialSavings: {
          timeReduction: 45,
          costReduction: 8500,
          qualityImprovement: 5,
          riskReduction: 10,
          roiEstimate: 450,
          paybackPeriod: 1.8
        },
        implementationComplexity: 'low',
        prerequisites: [
          'Get stakeholder approval',
          'Update process documentation',
          'Train affected staff'
        ],
        riskLevel: 'low',
        priority: 88
      },
      {
        id: 'opt-3',
        processId: 'proc-2',
        type: 'parallelization',
        description: 'Run background checks and IT setup concurrently instead of sequentially',
        potentialSavings: {
          timeReduction: 35,
          costReduction: 12000,
          qualityImprovement: 8,
          riskReduction: 20,
          roiEstimate: 320,
          paybackPeriod: 2.1
        },
        implementationComplexity: 'medium',
        prerequisites: [
          'Coordinate between HR and IT departments',
          'Update workflow orchestration',
          'Define handoff procedures'
        ],
        riskLevel: 'medium',
        priority: 82
      },
      {
        id: 'opt-4',
        processId: 'proc-3',
        type: 'resource_optimization',
        description: 'Redistribute workload to balance resource utilization across teams',
        potentialSavings: {
          timeReduction: 25,
          costReduction: 15000,
          qualityImprovement: 12,
          riskReduction: 15,
          roiEstimate: 185,
          paybackPeriod: 3.5
        },
        implementationComplexity: 'high',
        prerequisites: [
          'Analyze current workload distribution',
          'Cross-train team members',
          'Implement dynamic task assignment'
        ],
        riskLevel: 'medium',
        priority: 75
      },
      {
        id: 'opt-5',
        processId: 'proc-2',
        type: 'automation',
        description: 'Implement RPA for routine data entry and system updates',
        potentialSavings: {
          timeReduction: 80,
          costReduction: 32000,
          qualityImprovement: 25,
          riskReduction: 35,
          roiEstimate: 420,
          paybackPeriod: 2.8
        },
        implementationComplexity: 'high',
        prerequisites: [
          'Select RPA platform',
          'Map detailed process flows',
          'Develop and test automation scripts',
          'Train process operators'
        ],
        riskLevel: 'medium',
        priority: 91
      }
    ];

    setOpportunities(mockOpportunities.sort((a, b) => b.priority - a.priority));
  };

  const runOptimizationAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Mock analysis process
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    setIsAnalyzing(false);
    // Reload opportunities with potentially new findings
    loadOptimizationOpportunities();
  };

  const getTypeColor = (type: OptimizationOpportunity['type']) => {
    switch (type) {
      case 'automation': return 'text-blue-400 bg-blue-500/20';
      case 'simplification': return 'text-green-400 bg-green-500/20';
      case 'parallelization': return 'text-purple-400 bg-purple-500/20';
      case 'resource_optimization': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getComplexityColor = (complexity: OptimizationOpportunity['implementationComplexity']) => {
    switch (complexity) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getRiskColor = (risk: OptimizationOpportunity['riskLevel']) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 90) return 'text-red-400';
    if (priority >= 75) return 'text-yellow-400';
    return 'text-green-400';
  };

  const filteredOpportunities = opportunities.filter(opp => 
    activeFilter === 'all' || opp.type === activeFilter
  );

  const totalSavings = filteredOpportunities.reduce((acc, opp) => ({
    timeReduction: acc.timeReduction + opp.potentialSavings.timeReduction,
    costReduction: acc.costReduction + opp.potentialSavings.costReduction,
    qualityImprovement: acc.qualityImprovement + opp.potentialSavings.qualityImprovement,
    riskReduction: acc.riskReduction + opp.potentialSavings.riskReduction
  }), { timeReduction: 0, costReduction: 0, qualityImprovement: 0, riskReduction: 0 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-200">Process Optimization</h1>
          <p className="text-slate-400 mt-1">
            AI-powered analysis to identify automation opportunities and process improvements
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Types</option>
            <option value="automation">Automation</option>
            <option value="simplification">Simplification</option>
            <option value="parallelization">Parallelization</option>
            <option value="resource_optimization">Resource Optimization</option>
          </select>
          
          <button
            onClick={runOptimizationAnalysis}
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
                <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z" />
                Run Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Opportunities</p>
              <p className="text-2xl font-bold text-slate-200">{filteredOpportunities.length}</p>
            </div>
            <Icon path="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" className="w-8 h-8 text-sky-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Time Savings</p>
              <p className="text-2xl font-bold text-slate-200">{totalSavings.timeReduction}%</p>
            </div>
            <Icon path="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-green-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Cost Savings</p>
              <p className="text-2xl font-bold text-slate-200">${(totalSavings.costReduction / 1000).toFixed(0)}K</p>
            </div>
            <Icon path="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-yellow-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Quality Improvement</p>
              <p className="text-2xl font-bold text-slate-200">{totalSavings.qualityImprovement}%</p>
            </div>
            <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-blue-400" />
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Opportunities List */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Optimization Opportunities</h3>
            
            <div className="space-y-4">
              {filteredOpportunities.map((opportunity) => (
                <div
                  key={opportunity.id}
                  onClick={() => setSelectedOpportunity(opportunity)}
                  className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(opportunity.type)}`}>
                          {opportunity.type.replace('_', ' ')}
                        </span>
                        <span className={`text-sm font-medium ${getPriorityColor(opportunity.priority)}`}>
                          Priority: {opportunity.priority}
                        </span>
                      </div>
                      <p className="text-slate-200 mb-2">{opportunity.description}</p>
                      <div className="text-sm text-slate-400">
                        Process: {opportunity.processId} • Complexity: <span className={getComplexityColor(opportunity.implementationComplexity)}>{opportunity.implementationComplexity}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Time Reduction:</span>
                      <div className="font-medium text-green-400">{opportunity.potentialSavings.timeReduction}%</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Cost Savings:</span>
                      <div className="font-medium text-yellow-400">${opportunity.potentialSavings.costReduction.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">ROI:</span>
                      <div className="font-medium text-blue-400">{opportunity.potentialSavings.roiEstimate}%</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Payback:</span>
                      <div className="font-medium text-slate-200">{opportunity.potentialSavings.paybackPeriod} months</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Opportunity Details */}
        <div>
          {selectedOpportunity ? (
            <div className="space-y-4">
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Opportunity Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedOpportunity.type)}`}>
                        {selectedOpportunity.type.replace('_', ' ')}
                      </span>
                      <span className={`text-sm font-medium ${getPriorityColor(selectedOpportunity.priority)}`}>
                        Priority {selectedOpportunity.priority}
                      </span>
                    </div>
                    <p className="text-slate-300">{selectedOpportunity.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Complexity:</span>
                      <div className={`font-medium ${getComplexityColor(selectedOpportunity.implementationComplexity)}`}>
                        {selectedOpportunity.implementationComplexity}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Risk Level:</span>
                      <div className={`font-medium ${getRiskColor(selectedOpportunity.riskLevel)}`}>
                        {selectedOpportunity.riskLevel}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Potential Savings</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Time Reduction:</span>
                    <span className="text-green-400 font-medium">{selectedOpportunity.potentialSavings.timeReduction}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Cost Reduction:</span>
                    <span className="text-yellow-400 font-medium">${selectedOpportunity.potentialSavings.costReduction.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Quality Improvement:</span>
                    <span className="text-blue-400 font-medium">{selectedOpportunity.potentialSavings.qualityImprovement}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Risk Reduction:</span>
                    <span className="text-purple-400 font-medium">{selectedOpportunity.potentialSavings.riskReduction}%</span>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400">Expected ROI:</span>
                      <span className="text-sky-400 font-bold text-lg">{selectedOpportunity.potentialSavings.roiEstimate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Payback Period:</span>
                      <span className="text-slate-200 font-medium">{selectedOpportunity.potentialSavings.paybackPeriod} months</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Prerequisites</h3>
                
                <div className="space-y-2">
                  {selectedOpportunity.prerequisites.map((prerequisite, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{prerequisite}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-700">
                  <button className="w-full px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors">
                    Start Implementation
                  </button>
                </div>
              </GlassCard>
            </div>
          ) : (
            <GlassCard className="p-6 text-center">
              <Icon path="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-200 mb-2">Select Opportunity</h3>
              <p className="text-slate-400">Click on an optimization opportunity to view detailed analysis and implementation plan</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptimizationPage;