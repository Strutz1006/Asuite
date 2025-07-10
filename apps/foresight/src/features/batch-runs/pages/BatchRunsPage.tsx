import React, { useState } from 'react';
import { GlassCard, Icon } from '../../shared/components';

interface BatchVariable {
  id: string;
  name: string;
  unit: string;
  type: 'range' | 'list' | 'step';
  config: {
    min?: number;
    max?: number;
    step?: number;
    values?: number[];
  };
  currentValue: number;
}

interface BatchRun {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startedAt?: string;
  completedAt?: string;
  totalScenarios: number;
  completedScenarios: number;
  variables: string[];
  results?: {
    bestScenario: {
      revenue: number;
      cost: number;
      roi: number;
      variables: Record<string, number>;
    };
    worstScenario: {
      revenue: number;
      cost: number;
      roi: number;
      variables: Record<string, number>;
    };
    averageROI: number;
    successRate: number;
  };
}

const mockBatchVariables: BatchVariable[] = [
  {
    id: 'marketing-budget',
    name: 'Marketing Budget',
    unit: '$',
    type: 'range',
    config: { min: 1000000, max: 5000000, step: 500000 },
    currentValue: 2500000
  },
  {
    id: 'product-price',
    name: 'Product Price',
    unit: '$',
    type: 'list',
    config: { values: [199, 249, 299, 349, 399, 449, 499] },
    currentValue: 299
  },
  {
    id: 'sales-team',
    name: 'Sales Team Size',
    unit: 'people',
    type: 'step',
    config: { min: 30, max: 80, step: 5 },
    currentValue: 45
  },
  {
    id: 'ad-spend',
    name: 'Ad Spend Ratio',
    unit: '%',
    type: 'range',
    config: { min: 5, max: 25, step: 2.5 },
    currentValue: 15
  }
];

const mockBatchRuns: BatchRun[] = [
  {
    id: 'batch-001',
    name: 'Q1 2024 Growth Scenarios',
    status: 'completed',
    progress: 100,
    startedAt: '2024-01-15T09:00:00Z',
    completedAt: '2024-01-15T09:45:00Z',
    totalScenarios: 240,
    completedScenarios: 240,
    variables: ['marketing-budget', 'product-price'],
    results: {
      bestScenario: {
        revenue: 8500000,
        cost: 3200000,
        roi: 165,
        variables: { 'marketing-budget': 3500000, 'product-price': 399 }
      },
      worstScenario: {
        revenue: 3200000,
        cost: 2800000,
        roi: 14,
        variables: { 'marketing-budget': 1000000, 'product-price': 199 }
      },
      averageROI: 89,
      successRate: 73
    }
  },
  {
    id: 'batch-002',
    name: 'Pricing Optimization Sweep',
    status: 'running',
    progress: 62,
    startedAt: '2024-01-15T14:30:00Z',
    totalScenarios: 350,
    completedScenarios: 217,
    variables: ['product-price', 'ad-spend', 'sales-team']
  },
  {
    id: 'batch-003',
    name: 'Conservative Growth Path',
    status: 'pending',
    progress: 0,
    totalScenarios: 120,
    completedScenarios: 0,
    variables: ['marketing-budget', 'sales-team']
  }
];

const BatchRunsPage: React.FC = () => {
  const [selectedVariables, setSelectedVariables] = useState<string[]>(['marketing-budget', 'product-price']);
  const [batchName, setBatchName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showResults, setShowResults] = useState<string | null>('batch-001');

  const toggleVariable = (variableId: string) => {
    setSelectedVariables(prev => 
      prev.includes(variableId) 
        ? prev.filter(id => id !== variableId)
        : [...prev, variableId]
    );
  };

  const calculateTotalScenarios = () => {
    return selectedVariables.reduce((total, varId) => {
      const variable = mockBatchVariables.find(v => v.id === varId);
      if (!variable) return total;
      
      let scenarios = 1;
      if (variable.type === 'range') {
        const { min = 0, max = 100, step = 1 } = variable.config;
        scenarios = Math.floor((max - min) / step) + 1;
      } else if (variable.type === 'list') {
        scenarios = variable.config.values?.length || 1;
      } else if (variable.type === 'step') {
        const { min = 0, max = 100, step = 1 } = variable.config;
        scenarios = Math.floor((max - min) / step) + 1;
      }
      
      return total === 1 ? scenarios : total * scenarios;
    }, 1);
  };

  const createBatchRun = async () => {
    if (!batchName.trim() || selectedVariables.length === 0) return;
    
    setIsCreating(true);
    
    // Simulate batch run creation
    setTimeout(() => {
      setIsCreating(false);
      setBatchName('');
      // In real app, would refresh the batch runs list
    }, 2000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'running': return 'text-yellow-400 bg-yellow-500/20';
      case 'pending': return 'text-slate-400 bg-slate-500/20';
      case 'failed': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">What-If Batch Runs</h2>
          <p className="text-slate-400 mt-2">Automate scenario sweeps across variable ranges to find optimal combinations</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-slate-400">Automation Engine Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Batch Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-sky-300 flex items-center gap-2">
              <Icon path="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" className="w-6 h-6" />
              Create New Batch Run
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Batch Run Name
                </label>
                <input
                  type="text"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  placeholder="e.g., Q2 2024 Pricing Analysis"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Variables to Sweep
                </label>
                <div className="space-y-3">
                  {mockBatchVariables.map((variable) => (
                    <div key={variable.id} className="p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedVariables.includes(variable.id)}
                            onChange={() => toggleVariable(variable.id)}
                            className="w-4 h-4 text-sky-600 bg-slate-700 border-slate-600 rounded focus:ring-sky-500"
                          />
                          <div>
                            <h4 className="font-medium text-white">{variable.name}</h4>
                            <div className="text-xs text-slate-400 mt-1">
                              Current: {variable.currentValue}{variable.unit}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500">
                        {variable.type === 'range' && variable.config.min !== undefined && variable.config.max !== undefined && (
                          `Range: ${variable.config.min} - ${variable.config.max} (step: ${variable.config.step})`
                        )}
                        {variable.type === 'list' && variable.config.values && (
                          `Values: ${variable.config.values.join(', ')}`
                        )}
                        {variable.type === 'step' && variable.config.min !== undefined && variable.config.max !== undefined && (
                          `Steps: ${variable.config.min} to ${variable.config.max} by ${variable.config.step}`
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="text-sm text-blue-300 font-medium">Estimated Scenarios</div>
                <div className="text-2xl font-bold text-blue-400">{calculateTotalScenarios().toLocaleString()}</div>
                <div className="text-xs text-blue-300/70 mt-1">
                  ~{Math.ceil(calculateTotalScenarios() / 60)} minutes runtime
                </div>
              </div>

              <button
                onClick={createBatchRun}
                disabled={!batchName.trim() || selectedVariables.length === 0 || isCreating}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Batch Run...
                  </>
                ) : (
                  <>
                    <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-4 h-4" />
                    Start Batch Run
                  </>
                )}
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Batch Runs List & Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Batch Runs */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-sky-300">Batch Run Queue</h3>
            
            <div className="space-y-4">
              {mockBatchRuns.map((run) => (
                <div key={run.id} className="p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-white">{run.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(run.status)}`}>
                          {run.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-400">
                          {run.completedScenarios}/{run.totalScenarios} scenarios
                        </span>
                        <span className="text-xs text-slate-400">
                          Variables: {run.variables.length}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {run.status === 'running' && (
                        <button className="text-sm text-red-400 hover:text-red-300">
                          Cancel
                        </button>
                      )}
                      {run.status === 'completed' && (
                        <button
                          onClick={() => setShowResults(showResults === run.id ? null : run.id)}
                          className="text-sm text-sky-400 hover:text-sky-300"
                        >
                          {showResults === run.id ? 'Hide' : 'View'} Results
                        </button>
                      )}
                    </div>
                  </div>

                  {run.status === 'running' && (
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-sky-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${run.progress}%` }}
                      ></div>
                    </div>
                  )}

                  {run.startedAt && (
                    <div className="text-xs text-slate-500 mt-2">
                      {run.status === 'completed' ? 'Completed' : 'Started'}: {new Date(run.startedAt).toLocaleString()}
                      {run.completedAt && ` • Duration: ${Math.round((new Date(run.completedAt).getTime() - new Date(run.startedAt).getTime()) / 60000)} minutes`}
                    </div>
                  )}

                  {showResults === run.id && run.results && (
                    <div className="mt-4 space-y-4 border-t border-slate-600 pt-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-slate-900/50 rounded">
                          <div className="text-lg font-bold text-green-400">{run.results.averageROI}%</div>
                          <div className="text-xs text-slate-400">Avg ROI</div>
                        </div>
                        <div className="text-center p-3 bg-slate-900/50 rounded">
                          <div className="text-lg font-bold text-blue-400">{run.results.successRate}%</div>
                          <div className="text-xs text-slate-400">Success Rate</div>
                        </div>
                        <div className="text-center p-3 bg-slate-900/50 rounded">
                          <div className="text-lg font-bold text-sky-400">{run.results.bestScenario.roi}%</div>
                          <div className="text-xs text-slate-400">Best ROI</div>
                        </div>
                        <div className="text-center p-3 bg-slate-900/50 rounded">
                          <div className="text-lg font-bold text-orange-400">{run.results.worstScenario.roi}%</div>
                          <div className="text-xs text-slate-400">Worst ROI</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <h5 className="font-semibold text-green-300 mb-2">Best Performing Scenario</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Revenue:</span>
                              <span className="text-green-400 font-mono">{formatCurrency(run.results.bestScenario.revenue)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Cost:</span>
                              <span className="text-red-400 font-mono">{formatCurrency(run.results.bestScenario.cost)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">ROI:</span>
                              <span className="text-green-400 font-mono">{run.results.bestScenario.roi}%</span>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-green-500/20">
                            <div className="text-xs text-green-300/70">Optimal Variables:</div>
                            {Object.entries(run.results.bestScenario.variables).map(([key, value]) => (
                              <div key={key} className="text-xs text-slate-300 flex justify-between">
                                <span>{key.replace('-', ' ')}:</span>
                                <span className="font-mono">{typeof value === 'number' && value > 1000 ? formatCurrency(value) : value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <h5 className="font-semibold text-red-300 mb-2">Worst Performing Scenario</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Revenue:</span>
                              <span className="text-green-400 font-mono">{formatCurrency(run.results.worstScenario.revenue)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Cost:</span>
                              <span className="text-red-400 font-mono">{formatCurrency(run.results.worstScenario.cost)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">ROI:</span>
                              <span className="text-red-400 font-mono">{run.results.worstScenario.roi}%</span>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-red-500/20">
                            <div className="text-xs text-red-300/70">Problem Variables:</div>
                            {Object.entries(run.results.worstScenario.variables).map(([key, value]) => (
                              <div key={key} className="text-xs text-slate-300 flex justify-between">
                                <span>{key.replace('-', ' ')}:</span>
                                <span className="font-mono">{typeof value === 'number' && value > 1000 ? formatCurrency(value) : value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors font-medium">
                          Export Full Results
                        </button>
                        <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium">
                          Implement Best
                        </button>
                        <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium">
                          Clone Run
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Batch Run Templates */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-sky-300">Quick Start Templates</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors cursor-pointer">
                <h4 className="font-semibold text-white mb-2">Pricing Optimization</h4>
                <p className="text-sm text-slate-400 mb-3">Sweep price points with marketing spend variations to find revenue sweet spot</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Variables: Price, Marketing, Sales Team</span>
                  <button className="text-sm text-sky-400 hover:text-sky-300">Use Template</button>
                </div>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors cursor-pointer">
                <h4 className="font-semibold text-white mb-2">Growth Scenarios</h4>
                <p className="text-sm text-slate-400 mb-3">Model different growth paths with varying investment levels</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Variables: R&D, Marketing, Headcount</span>
                  <button className="text-sm text-sky-400 hover:text-sky-300">Use Template</button>
                </div>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors cursor-pointer">
                <h4 className="font-semibold text-white mb-2">Cost Reduction</h4>
                <p className="text-sm text-slate-400 mb-3">Analyze efficiency improvements across operational areas</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Variables: Operations, Support, Infrastructure</span>
                  <button className="text-sm text-sky-400 hover:text-sky-300">Use Template</button>
                </div>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors cursor-pointer">
                <h4 className="font-semibold text-white mb-2">Market Expansion</h4>
                <p className="text-sm text-slate-400 mb-3">Test different market entry strategies and investment levels</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Variables: Market Spend, Geography, Timing</span>
                  <button className="text-sm text-sky-400 hover:text-sky-300">Use Template</button>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default BatchRunsPage;