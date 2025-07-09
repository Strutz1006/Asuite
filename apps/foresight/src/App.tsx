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

const ForesightDashboard = () => {
  const [selectedView, setSelectedView] = useState('sandbox');
  const [selectedScenario, setSelectedScenario] = useState(0);

  const scenarios = [
    { 
      name: "Aggressive Market Expansion", 
      confidence: 68, 
      impact: { revenue: "+18%", cost: "+25%", risk: "High", timeline: "18 months" },
      description: "Enter 3 new markets with dedicated teams and local partnerships",
      factors: ["Market penetration rate", "Competition response", "Regulatory barriers"],
      outcomes: {
        financial: { revenue: 118, profit: 95, cashflow: 85 },
        operational: { headcount: 135, efficiency: 88, satisfaction: 78 },
        strategic: { marketShare: 125, innovation: 110, sustainability: 92 }
      }
    },
    { 
      name: "AI-Driven Optimization", 
      confidence: 85, 
      impact: { revenue: "+12%", cost: "-15%", risk: "Medium", timeline: "12 months" },
      description: "Implement AI across operations, customer service, and product development",
      factors: ["Technology adoption rate", "Employee training success", "ROI timeline"],
      outcomes: {
        financial: { revenue: 112, profit: 128, cashflow: 115 },
        operational: { headcount: 98, efficiency: 142, satisfaction: 85 },
        strategic: { marketShare: 108, innovation: 135, sustainability: 105 }
      }
    },
    { 
      name: "Sustainability Focus", 
      confidence: 92, 
      impact: { revenue: "+8%", cost: "+5%", risk: "Low", timeline: "24 months" },
      description: "Comprehensive ESG transformation with carbon neutrality by 2026",
      factors: ["Consumer response", "Regulatory support", "Supply chain adaptation"],
      outcomes: {
        financial: { revenue: 108, profit: 103, cashflow: 102 },
        operational: { headcount: 105, efficiency: 115, satisfaction: 128 },
        strategic: { marketShare: 115, innovation: 120, sustainability: 165 }
      }
    },
  ];

  const businessLevers = [
    { name: "Marketing Spend", current: 65, min: 0, max: 100, unit: "% of revenue" },
    { name: "R&D Investment", current: 45, min: 0, max: 80, unit: "% allocation" },
    { name: "Headcount Growth", current: 20, min: -10, max: 50, unit: "% change" },
    { name: "Pricing Strategy", current: 75, min: 50, max: 120, unit: "index" },
    { name: "Geographic Expansion", current: 30, min: 0, max: 100, unit: "% coverage" },
    { name: "Automation Level", current: 40, min: 0, max: 90, unit: "% automated" }
  ];

  const riskFactors = [
    { name: "Market Volatility", probability: 35, impact: "Medium", mitigation: "Diversification strategy" },
    { name: "Competitive Response", probability: 68, impact: "High", mitigation: "IP protection & innovation" },
    { name: "Regulatory Changes", probability: 42, impact: "Medium", mitigation: "Compliance monitoring" },
    { name: "Technology Disruption", probability: 55, impact: "High", mitigation: "Continuous R&D investment" },
    { name: "Economic Downturn", probability: 28, impact: "High", mitigation: "Financial reserves & flexibility" }
  ];

  const marketInsights = [
    { 
      title: "Industry Growth Forecast", 
      value: "+12.5%", 
      trend: "up", 
      description: "Sector expected to grow significantly over next 3 years",
      confidence: 88
    },
    { 
      title: "Competitive Pressure", 
      value: "Increasing", 
      trend: "down", 
      description: "3 new entrants in key markets, pricing pressure expected",
      confidence: 75
    },
    { 
      title: "Technology Adoption", 
      value: "+45%", 
      trend: "up", 
      description: "Customer demand for digital solutions accelerating",
      confidence: 92
    },
    { 
      title: "Regulatory Environment", 
      value: "Stable", 
      trend: "neutral", 
      description: "No major policy changes expected in next 18 months",
      confidence: 82
    }
  ];

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Icon path="M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-8 h-8 text-sky-400" />
            <Icon path="M12 15v-3m0 0V9m0 3h3m-3 0H9" className="w-4 h-4 text-sky-300 absolute top-1 left-1" />
          </div>
          <h1 className="text-2xl font-bold">Aesyros Foresight</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="flex gap-2">
            <button 
              onClick={() => setSelectedView('sandbox')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedView === 'sandbox' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-sky-400'}`}
            >
              Strategy Sandbox
            </button>
            <button 
              onClick={() => setSelectedView('scenarios')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedView === 'scenarios' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-sky-400'}`}
            >
              Scenarios
            </button>
            <button 
              onClick={() => setSelectedView('insights')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedView === 'insights' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-sky-400'}`}
            >
              Market Insights
            </button>
          </nav>
          <button className="bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold py-2 px-5 rounded-lg shadow-lg hover:from-sky-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all">
            + New Simulation
          </button>
        </div>
      </header>

      <main className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-100">Strategy Sandbox</h2>
            <p className="text-slate-400 mt-2">Test potential decisions, model downstream effects, and build smarter roadmaps.</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-sky-400">3 Active</div>
            <div className="text-sm text-slate-400">Simulations Running</div>
          </div>
        </div>

        {selectedView === 'sandbox' && (
          <>
            {/* Business Levers Control Panel */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">Business Levers & Variables</h3>
              <p className="text-slate-400 mb-6">Adjust these inputs to model a new scenario. See the projected impact in real-time.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businessLevers.map(lever => (
                  <div key={lever.name} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold">{lever.name}</label>
                      <span className="text-sm font-mono text-sky-400">{lever.current}{lever.unit}</span>
                    </div>
                    <input 
                      type="range" 
                      min={lever.min} 
                      max={lever.max} 
                      defaultValue={lever.current}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb"
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-sky-300">Strategic Impact</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Market Position</span>
                      <span className="font-mono text-green-400">+2 ranks</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Innovation Index</span>
                      <span className="font-mono text-green-400">+18%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">ESG Score</span>
                      <span className="font-mono text-green-400">+8 points</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Risk Level</span>
                      <span className="font-mono text-yellow-400">Medium</span>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </>
        )}

        {selectedView === 'scenarios' && (
          <>
            {/* Scenario Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {scenarios.map((scenario, index) => (
                <GlassCard 
                  key={scenario.name} 
                  className={`p-6 cursor-pointer transition-all ${
                    selectedScenario === index ? 'ring-2 ring-sky-500 border-sky-500/50' : 'hover:border-sky-500/30'
                  }`}
                  onClick={() => setSelectedScenario(index)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold">{scenario.name}</h3>
                    <div className="text-right">
                      <div className="text-sm text-slate-400">Confidence</div>
                      <div className="text-xl font-bold text-sky-400">{scenario.confidence}%</div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-400 mb-4">{scenario.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Revenue Impact</span>
                      <span className="font-mono text-green-400">{scenario.impact.revenue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cost Impact</span>
                      <span className={`font-mono ${scenario.impact.cost.includes('+') ? 'text-red-400' : 'text-green-400'}`}>
                        {scenario.impact.cost}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Risk Level</span>
                      <span className={`font-mono ${
                        scenario.impact.risk === 'High' ? 'text-red-400' : 
                        scenario.impact.risk === 'Medium' ? 'text-yellow-400' : 
                        'text-green-400'
                      }`}>
                        {scenario.impact.risk}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Timeline</span>
                      <span className="font-mono text-slate-300">{scenario.impact.timeline}</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-slate-700 rounded-full h-2.5 mb-2">
                    <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${scenario.confidence}%` }}></div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Detailed Scenario Analysis */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">Detailed Analysis: {scenarios[selectedScenario].name}</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-sky-300 mb-4">Key Success Factors</h4>
                  <div className="space-y-3">
                    {scenarios[selectedScenario].factors.map((factor, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                        <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-sm">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sky-300 mb-4">Outcome Projections</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium mb-2">Financial Metrics</h5>
                      <div className="space-y-2">
                        {Object.entries(scenarios[selectedScenario].outcomes.financial).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-sm capitalize">{key}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-700 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full ${value >= 100 ? 'bg-green-500' : value >= 90 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${Math.min(value, 100)}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-mono w-8">{value}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium mb-2">Operational Metrics</h5>
                      <div className="space-y-2">
                        {Object.entries(scenarios[selectedScenario].outcomes.operational).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-sm capitalize">{key}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-700 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full ${value >= 100 ? 'bg-green-500' : value >= 90 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${Math.min(value, 100)}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-mono w-8">{value}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </>
        )}

        {selectedView === 'insights' && (
          <>
            {/* Market Intelligence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {marketInsights.map((insight, index) => (
                <GlassCard key={index} className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold">{insight.title}</h3>
                    <div className="flex items-center gap-2">
                      <Icon 
                        path={insight.trend === 'up' ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 
                              insight.trend === 'down' ? 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6' : 
                              'M5 12h14'} 
                        className={`w-5 h-5 ${
                          insight.trend === 'up' ? 'text-green-400' : 
                          insight.trend === 'down' ? 'text-red-400' : 
                          'text-slate-400'
                        }`} 
                      />
                      <span className={`font-bold ${
                        insight.trend === 'up' ? 'text-green-400' : 
                        insight.trend === 'down' ? 'text-red-400' : 
                        'text-slate-400'
                      }`}>
                        {insight.value}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{insight.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Confidence: {insight.confidence}%</span>
                    <button className="text-sm text-sky-400 hover:text-sky-300">View Details</button>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Risk Assessment Matrix */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">Strategic Risk Assessment</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="p-3 font-semibold">Risk Factor</th>
                      <th className="p-3 font-semibold">Probability</th>
                      <th className="p-3 font-semibold">Impact</th>
                      <th className="p-3 font-semibold">Mitigation Strategy</th>
                      <th className="p-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riskFactors.map((risk, index) => (
                      <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/50">
                        <td className="p-3 font-medium">{risk.name}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  risk.probability >= 60 ? 'bg-red-500' : 
                                  risk.probability >= 40 ? 'bg-yellow-500' : 
                                  'bg-green-500'
                                }`}
                                style={{ width: `${risk.probability}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-mono">{risk.probability}%</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                            risk.impact === 'High' ? 'bg-red-500/20 text-red-300' : 
                            risk.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' : 
                            'bg-green-500/20 text-green-300'
                          }`}>
                            {risk.impact}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-slate-400">{risk.mitigation}</td>
                        <td className="p-3">
                          <button className="text-sky-400 hover:text-sky-300 text-sm font-medium">
                            Monitor
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            {/* Scenario Timeline */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">Strategic Timeline Projections</h3>
              <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center">
                <p className="text-slate-500">Interactive timeline showing scenario outcomes over time</p>
              </div>
            </GlassCard>
          </>
        )}
      </main>
    </div>
  );
};

export default ForesightDashboard;