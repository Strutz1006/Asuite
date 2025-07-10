import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard, Icon } from '../../shared/components';
import { mockScenarios } from '../../shared/data/mockData';

const ScenariosPage: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState(0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Scenario Analysis</h1>
          <p className="text-slate-400 mt-1">Compare strategic scenarios and their projected outcomes</p>
        </div>
        <Link 
          to="/scenarios/new"
          className="bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold py-2 px-5 rounded-lg shadow-lg hover:from-sky-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all"
        >
          + New Scenario
        </Link>
      </div>

      {/* Scenario Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mockScenarios.map((scenario, index) => (
          <GlassCard 
            key={scenario.id} 
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
        <h3 className="text-xl font-semibold mb-4">Detailed Analysis: {mockScenarios[selectedScenario].name}</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-sky-300 mb-4">Key Success Factors</h4>
            <div className="space-y-3">
              {mockScenarios[selectedScenario].factors.map((factor, index) => (
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
                  {Object.entries(mockScenarios[selectedScenario].outcomes.financial).map(([key, value]) => (
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
                  {Object.entries(mockScenarios[selectedScenario].outcomes.operational).map(([key, value]) => (
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
                <h5 className="text-sm font-medium mb-2">Strategic Metrics</h5>
                <div className="space-y-2">
                  {Object.entries(mockScenarios[selectedScenario].outcomes.strategic).map(([key, value]) => (
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

      {/* Scenario Comparison Table */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold mb-4">Scenario Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="p-3 font-semibold">Scenario</th>
                <th className="p-3 font-semibold">Confidence</th>
                <th className="p-3 font-semibold">Revenue</th>
                <th className="p-3 font-semibold">Cost</th>
                <th className="p-3 font-semibold">Risk</th>
                <th className="p-3 font-semibold">Timeline</th>
                <th className="p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockScenarios.map((scenario, index) => (
                <tr key={scenario.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="p-3 font-medium">{scenario.name}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-sky-500 h-2 rounded-full"
                          style={{ width: `${scenario.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-mono">{scenario.confidence}%</span>
                    </div>
                  </td>
                  <td className="p-3 text-green-400 font-mono">{scenario.impact.revenue}</td>
                  <td className={`p-3 font-mono ${scenario.impact.cost.includes('+') ? 'text-red-400' : 'text-green-400'}`}>
                    {scenario.impact.cost}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      scenario.impact.risk === 'High' ? 'bg-red-500/20 text-red-300' : 
                      scenario.impact.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' : 
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {scenario.impact.risk}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">{scenario.impact.timeline}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedScenario(index)}
                        className="text-sky-400 hover:text-sky-300 text-sm font-medium"
                      >
                        View
                      </button>
                      <Link 
                        to={`/scenarios/${scenario.id}/edit`}
                        className="text-green-400 hover:text-green-300 text-sm font-medium"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default ScenariosPage;