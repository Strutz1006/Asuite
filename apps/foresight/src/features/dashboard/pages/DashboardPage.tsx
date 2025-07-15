import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../shared/components';
import { DashboardLayout, DashboardCard } from '@aesyros/ui';
import { mockBusinessLevers, mockSimulationMetrics, mockScenarios } from '../../shared/data/mockData';

const DashboardPage: React.FC = () => {
  const [leverValues, setLeverValues] = useState<Record<string, number>>({});

  const updateLever = (leverName: string, value: number) => {
    setLeverValues(prev => ({ ...prev, [leverName]: value }));
  };

  const getCurrentLeverValue = (leverName: string, defaultValue: number) => {
    return leverValues[leverName] ?? defaultValue;
  };

  const dashboardStats = [
    { label: 'Active Simulations', value: mockSimulationMetrics.activeSimulations, color: 'text-sky-400' },
    { label: 'Avg Confidence', value: `${mockSimulationMetrics.averageConfidence}%`, color: 'text-green-400' },
    { label: 'Predicted ROI', value: `${mockSimulationMetrics.predictedROI}%`, color: 'text-yellow-400' },
    { label: 'Risk Level', value: mockSimulationMetrics.riskLevel, color: 'text-blue-400' },
  ];

  const mainContent = (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Business Levers Control Panel */}
        <DashboardCard>
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
        </DashboardCard>

        {/* Real-time Impact Preview */}
        <DashboardCard>
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
        </DashboardCard>
      </div>

      {/* Recent Scenarios */}
      <DashboardCard>
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
      </DashboardCard>

      {/* Quick Actions */}
      <DashboardCard>
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
      </DashboardCard>

      {/* Advanced Features */}
      <DashboardCard>
        <h3 className="text-xl font-semibold text-slate-100 mb-4">Advanced Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/natural-language"
            className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors text-left block"
          >
            <div className="flex items-center gap-3">
              <Icon path="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" className="w-5 h-5 text-sky-400" />
              <div>
                <div className="font-medium">Natural Language</div>
                <div className="text-xs text-slate-400">AI scenario builder</div>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/recommendations"
            className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors text-left block"
          >
            <div className="flex items-center gap-3">
              <Icon path="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" className="w-5 h-5 text-sky-400" />
              <div>
                <div className="font-medium">AI Recommendations</div>
                <div className="text-xs text-slate-400">ML insights</div>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/sensitivity-analysis"
            className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors text-left block"
          >
            <div className="flex items-center gap-3">
              <Icon path="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" className="w-5 h-5 text-sky-400" />
              <div>
                <div className="font-medium">Sensitivity Analysis</div>
                <div className="text-xs text-slate-400">Monte Carlo sims</div>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/batch-runs"
            className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors text-left block"
          >
            <div className="flex items-center gap-3">
              <Icon path="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" className="w-5 h-5 text-sky-400" />
              <div>
                <div className="font-medium">Batch Runs</div>
                <div className="text-xs text-slate-400">Automated sweeps</div>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/collaboration"
            className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors text-left block"
          >
            <div className="flex items-center gap-3">
              <Icon path="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" className="w-5 h-5 text-sky-400" />
              <div>
                <div className="font-medium">Collaboration</div>
                <div className="text-xs text-slate-400">Real-time editing</div>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/versioning"
            className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors text-left block"
          >
            <div className="flex items-center gap-3">
              <Icon path="M12 10.5v6m3-3l-3 3-3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" className="w-5 h-5 text-sky-400" />
              <div>
                <div className="font-medium">Version Control</div>
                <div className="text-xs text-slate-400">Audit trail</div>
              </div>
            </div>
          </Link>
          
          <button className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors text-left">
            <div className="flex items-center gap-3">
              <Icon path="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-5 h-5 text-sky-400" />
              <div>
                <div className="font-medium">Settings</div>
                <div className="text-xs text-slate-400">Configure features</div>
              </div>
            </div>
          </button>
          
          <button className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors text-left">
            <div className="flex items-center gap-3">
              <Icon path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" className="w-5 h-5 text-sky-400" />
              <div>
                <div className="font-medium">Documentation</div>
                <div className="text-xs text-slate-400">Help & guides</div>
              </div>
            </div>
          </button>
        </div>
      </DashboardCard>
    </>
  );

  const sideContent = (
    <>
      {/* Simulation Status */}
      <DashboardCard>
        <h3 className="text-lg font-semibold mb-4">Simulation Status</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">Active (3)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm">Queued (1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
            <span className="text-sm">Completed (12)</span>
          </div>
        </div>
      </DashboardCard>

      {/* Market Conditions */}
      <DashboardCard>
        <h3 className="text-lg font-semibold mb-4">Market Conditions</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Market Volatility</span>
            <span className="text-sm text-yellow-400">Medium</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Competition</span>
            <span className="text-sm text-red-400">High</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Growth Potential</span>
            <span className="text-sm text-green-400">High</span>
          </div>
        </div>
      </DashboardCard>
    </>
  );

  return (
    <DashboardLayout
      title="Strategy Sandbox"
      description="Test potential decisions, model downstream effects, and build smarter roadmaps"
      stats={dashboardStats}
      mainContent={mainContent}
      sideContent={sideContent}
    />
  );
};

export default DashboardPage;