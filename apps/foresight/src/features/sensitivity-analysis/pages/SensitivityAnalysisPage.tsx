import React, { useState } from 'react';
import { GlassCard, Icon } from '../../shared/components';

interface Variable {
  id: string;
  name: string;
  currentValue: number;
  unit: string;
  min: number;
  max: number;
  distribution: 'normal' | 'uniform' | 'triangular';
  sensitivity: number;
  impact: number;
}

interface SimulationRun {
  id: string;
  timestamp: string;
  iterations: number;
  confidence: number;
  results: {
    mean: number;
    median: number;
    standardDeviation: number;
    min: number;
    max: number;
    percentile5: number;
    percentile95: number;
  };
  topDrivers: Array<{
    variable: string;
    contribution: number;
    correlation: number;
  }>;
}

const mockVariables: Variable[] = [
  {
    id: 'marketing-budget',
    name: 'Marketing Budget',
    currentValue: 2500000,
    unit: '$',
    min: 1500000,
    max: 4000000,
    distribution: 'normal',
    sensitivity: 87,
    impact: 34
  },
  {
    id: 'sales-headcount',
    name: 'Sales Team Headcount',
    currentValue: 45,
    unit: 'people',
    min: 30,
    max: 70,
    distribution: 'uniform',
    sensitivity: 72,
    impact: 28
  },
  {
    id: 'product-price',
    name: 'Product Price Point',
    currentValue: 299,
    unit: '$',
    min: 199,
    max: 499,
    distribution: 'triangular',
    sensitivity: 91,
    impact: 42
  },
  {
    id: 'market-growth',
    name: 'Market Growth Rate',
    currentValue: 15,
    unit: '%',
    min: 5,
    max: 25,
    distribution: 'normal',
    sensitivity: 65,
    impact: 38
  },
  {
    id: 'churn-rate',
    name: 'Customer Churn Rate',
    currentValue: 8,
    unit: '%',
    min: 4,
    max: 15,
    distribution: 'triangular',
    sensitivity: 83,
    impact: 31
  }
];

const mockSimulationRun: SimulationRun = {
  id: 'sim-001',
  timestamp: '2024-01-15T10:30:00Z',
  iterations: 10000,
  confidence: 95,
  results: {
    mean: 4280000,
    median: 4195000,
    standardDeviation: 890000,
    min: 1850000,
    max: 7420000,
    percentile5: 2840000,
    percentile95: 5920000
  },
  topDrivers: [
    { variable: 'Product Price Point', contribution: 42, correlation: 0.78 },
    { variable: 'Market Growth Rate', contribution: 38, correlation: 0.65 },
    { variable: 'Marketing Budget', contribution: 34, correlation: 0.72 },
    { variable: 'Customer Churn Rate', contribution: 31, correlation: -0.68 },
    { variable: 'Sales Team Headcount', contribution: 28, correlation: 0.59 }
  ]
};

const SensitivityAnalysisPage: React.FC = () => {
  const [selectedVariables, setSelectedVariables] = useState<string[]>(['marketing-budget', 'product-price']);
  const [iterations, setIterations] = useState(10000);
  const [confidence, setConfidence] = useState(95);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<SimulationRun | null>(mockSimulationRun);
  const [analysisMode, setAnalysisMode] = useState<'sensitivity' | 'monte-carlo'>('monte-carlo');

  const toggleVariable = (variableId: string) => {
    setSelectedVariables(prev => 
      prev.includes(variableId) 
        ? prev.filter(id => id !== variableId)
        : [...prev, variableId]
    );
  };

  const runSimulation = async () => {
    setIsRunning(true);
    
    // Simulate analysis processing
    setTimeout(() => {
      setResults(mockSimulationRun);
      setIsRunning(false);
    }, 3000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getDistributionColor = (distribution: string) => {
    switch (distribution) {
      case 'normal': return 'text-blue-400 bg-blue-500/20';
      case 'uniform': return 'text-green-400 bg-green-500/20';
      case 'triangular': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">Sensitivity & Monte Carlo Analysis</h2>
          <p className="text-slate-400 mt-2">Run probabilistic simulations to understand which variables drive the most outcome variance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setAnalysisMode('monte-carlo')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                analysisMode === 'monte-carlo' 
                  ? 'bg-sky-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monte Carlo
            </button>
            <button
              onClick={() => setAnalysisMode('sensitivity')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                analysisMode === 'sensitivity' 
                  ? 'bg-sky-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sensitivity
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Variable Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-sky-300 flex items-center gap-2">
              <Icon path="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" className="w-6 h-6" />
              Variable Configuration
            </h3>

            <div className="space-y-4">
              {mockVariables.map((variable) => (
                <div key={variable.id} className="p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedVariables.includes(variable.id)}
                        onChange={() => toggleVariable(variable.id)}
                        className="w-4 h-4 text-sky-600 bg-slate-700 border-slate-600 rounded focus:ring-sky-500"
                      />
                      <div>
                        <h4 className="font-medium text-white">{variable.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${getDistributionColor(variable.distribution)}`}>
                            {variable.distribution.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-400">
                            {variable.min}{variable.unit} - {variable.max}{variable.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current:</span>
                      <span className="font-mono text-white">
                        {variable.unit === '$' ? formatCurrency(variable.currentValue) : `${variable.currentValue}${variable.unit}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sensitivity:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${variable.sensitivity}%` }}
                          ></div>
                        </div>
                        <span className="text-orange-400 font-mono text-xs">{variable.sensitivity}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Impact:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-sky-500 h-2 rounded-full"
                            style={{ width: `${variable.impact}%` }}
                          ></div>
                        </div>
                        <span className="text-sky-400 font-mono text-xs">{variable.impact}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Simulation Settings */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-sky-300">Simulation Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Iterations
                </label>
                <select
                  value={iterations}
                  onChange={(e) => setIterations(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none"
                >
                  <option value={1000}>1,000 (Fast)</option>
                  <option value={5000}>5,000 (Balanced)</option>
                  <option value={10000}>10,000 (Accurate)</option>
                  <option value={50000}>50,000 (High Precision)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confidence Level
                </label>
                <select
                  value={confidence}
                  onChange={(e) => setConfidence(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none"
                >
                  <option value={90}>90%</option>
                  <option value={95}>95%</option>
                  <option value={99}>99%</option>
                </select>
              </div>

              <button
                onClick={runSimulation}
                disabled={selectedVariables.length === 0 || isRunning}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                {isRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Running Analysis...
                  </>
                ) : (
                  <>
                    <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-4 h-4" />
                    Run {analysisMode === 'monte-carlo' ? 'Monte Carlo' : 'Sensitivity'} Analysis
                  </>
                )}
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {results && (
            <>
              {/* Statistical Summary */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-sky-300 flex items-center gap-2">
                  <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" className="w-6 h-6" />
                  Statistical Results
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-sky-400">{formatCurrency(results.results.mean)}</div>
                    <div className="text-sm text-slate-400">Mean</div>
                  </div>
                  <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{formatCurrency(results.results.median)}</div>
                    <div className="text-sm text-slate-400">Median</div>
                  </div>
                  <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-400">{formatCurrency(results.results.standardDeviation)}</div>
                    <div className="text-sm text-slate-400">Std Dev</div>
                  </div>
                  <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">{results.confidence}%</div>
                    <div className="text-sm text-slate-400">Confidence</div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <h4 className="font-semibold text-red-300 mb-2">Worst Case (5%)</h4>
                    <div className="text-lg font-bold text-red-400">{formatCurrency(results.results.percentile5)}</div>
                  </div>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h4 className="font-semibold text-blue-300 mb-2">Range</h4>
                    <div className="text-lg font-bold text-blue-400">
                      {formatCurrency(results.results.min)} - {formatCurrency(results.results.max)}
                    </div>
                  </div>
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <h4 className="font-semibold text-green-300 mb-2">Best Case (95%)</h4>
                    <div className="text-lg font-bold text-green-400">{formatCurrency(results.results.percentile95)}</div>
                  </div>
                </div>
              </GlassCard>

              {/* Top Drivers */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-sky-300">Top Variance Drivers</h3>
                
                <div className="space-y-4">
                  {results.topDrivers.map((driver, index) => (
                    <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-white">{driver.variable}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-400">
                            Correlation: <span className={`font-mono ${driver.correlation > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {driver.correlation > 0 ? '+' : ''}{driver.correlation.toFixed(2)}
                            </span>
                          </span>
                          <span className="text-sm font-bold text-sky-400">{driver.contribution}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-sky-500 h-2 rounded-full"
                          style={{ width: `${driver.contribution}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Distribution Visualization */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-sky-300">Distribution Visualization</h3>
                
                <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500">Interactive distribution chart would be rendered here</p>
                    <p className="text-xs text-slate-600 mt-2">Showing outcome probability distribution with confidence intervals</p>
                  </div>
                </div>
              </GlassCard>

              {/* Action Recommendations */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-sky-300 flex items-center gap-2">
                  <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z" className="w-6 h-6" />
                  AI Recommendations
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <h4 className="font-semibold text-green-300 mb-2">Focus Areas</h4>
                    <p className="text-sm text-slate-300 mb-3">Product pricing shows highest impact on outcomes. Consider A/B testing price points between $299-$399.</p>
                    <button className="text-sm font-semibold text-green-400 hover:text-green-300">Explore Pricing</button>
                  </div>
                  
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <h4 className="font-semibold text-yellow-300 mb-2">Risk Mitigation</h4>
                    <p className="text-sm text-slate-300 mb-3">High variance in churn rate creates uncertainty. Implement retention program to reduce downside risk.</p>
                    <button className="text-sm font-semibold text-yellow-400 hover:text-yellow-300">Plan Retention</button>
                  </div>
                </div>
              </GlassCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SensitivityAnalysisPage;