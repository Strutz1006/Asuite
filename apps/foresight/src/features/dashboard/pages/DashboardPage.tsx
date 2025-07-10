import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard, Icon } from '../../shared/components';
import { mockBusinessLevers, mockSimulationMetrics, mockScenarios } from '../../shared/data/mockData';

const DashboardPage: React.FC = () => {
  const [leverValues, setLeverValues] = useState<Record<string, number>>({});

  const updateLever = (leverName: string, value: number) => {
    setLeverValues(prev => ({ ...prev, [leverName]: value }));
  };

  const getCurrentLeverValue = (leverName: string, defaultValue: number) => {
    return leverValues[leverName] ?? defaultValue;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">Strategy Sandbox</h2>
          <p className="text-slate-400 mt-2">Test potential decisions, model downstream effects, and build smarter roadmaps</p>
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-sky-400">{mockSimulationMetrics.activeSimulations}</div>
            <div className="text-xs text-slate-400">Active Simulations</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">{mockSimulationMetrics.averageConfidence}%</div>
            <div className="text-xs text-slate-400">Avg Confidence</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">{mockSimulationMetrics.predictedROI}%</div>
            <div className="text-xs text-slate-400">Predicted ROI</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">{mockSimulationMetrics.riskLevel}</div>
            <div className="text-xs text-slate-400">Risk Level</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Business Levers Control Panel */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-4">Business Levers & Variables</h3>
          <p className="text-slate-400 mb-6">Adjust these inputs to model a new scenario. See the projected impact in real-time.</p>
          
          <div className="space-y-6">
            {mockBusinessLevers.map(lever => (
              <div key={lever.name} className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold">{lever.name}</label>
                  <span className="text-sm font-mono text-sky-400">
                    {getCurrentLeverValue(lever.name, lever.current)}{lever.unit}
                  </span>
                </div>
                <input 
                  type="range" 
                  min={lever.min} 
                  max={lever.max} 
                  value={getCurrentLeverValue(lever.name, lever.current)}
                  onChange={(e) => updateLever(lever.name, Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{lever.min}</span>
                  <span>{lever.max}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center">
            <button className="bg-sky-500 hover:bg-sky-600 text-white font-medium py-3 px-8 rounded-lg transition-colors">
              Run Simulation
            </button>
          </div>
        </GlassCard>

        {/* Real-time Impact Preview */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-4">Projected Impact Dashboard</h3>
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-sky-300">Financial Impact</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Revenue Growth</span>
                  <span className="font-mono text-green-400">+14.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Profit Margin</span>
                  <span className="font-mono text-yellow-400">-2.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cash Flow</span>
                  <span className="font-mono text-green-400">+8.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">ROI Timeline</span>
                  <span className="font-mono text-slate-300">18 months</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-sky-300">Operational Impact</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Team Capacity</span>
                  <span className="font-mono text-yellow-400">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Process Efficiency</span>
                  <span className="font-mono text-green-400">+12%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Quality Score</span>
                  <span className="font-mono text-green-400">94%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Change Readiness</span>
                  <span className="font-mono text-yellow-400">72%</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Recent Scenarios */}
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-slate-100">Recent Scenarios</h3>
          <Link 
            to="/scenarios" 
            className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
          >
            View All Scenarios →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockScenarios.map(scenario => (
            <div key={scenario.id} className="p-4 bg-slate-700/50 rounded-lg">
              <h4 className="font-semibold text-slate-100 mb-2">{scenario.name}</h4>
              <div className="text-sm text-slate-400 mb-3">
                Confidence: {scenario.confidence}% • {scenario.impact.timeline}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">
                  {scenario.impact.revenue} revenue
                </span>
                <Link
                  to={`/scenarios/${scenario.id}`}
                  className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Quick Actions */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-slate-100 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/scenarios/new"
            className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors text-left block"
          >
            <div className="flex items-center gap-3">
              <Icon path="M12 4v16m8-8H4" className="w-5 h-5 text-sky-400" />
              <div>
                <div className="font-medium">New Scenario</div>
                <div className="text-xs text-slate-400">Create simulation</div>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/insights"
            className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors text-left block"
          >
            <div className="flex items-center gap-3">
              <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" className="w-5 h-5 text-sky-400" />
              <div>
                <div className="font-medium">Market Insights</div>
                <div className="text-xs text-slate-400">View analysis</div>
              </div>
            </div>
          </Link>
          
          <button className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors text-left">
            <div className="flex items-center gap-3">
              <Icon path="M15 17h5l-5 5v-5z" className="w-5 h-5 text-sky-400" />
              <div>
                <div className="font-medium">Export Report</div>
                <div className="text-xs text-slate-400">Download insights</div>
              </div>
            </div>
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default DashboardPage;