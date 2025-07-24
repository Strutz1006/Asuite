import { useState } from 'react'
import { 
  Layers, 
  Plus, 
  Play, 
  Settings, 
  Calculator, 
  TrendingUp, 
  Calendar, 
  Target, 
  Zap,
  BarChart3,
  LineChart,
  PieChart,
  DollarSign,
  Users,
  Globe,
  Briefcase,
  ArrowRight,
  Save,
  Copy,
  Share,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react'

export interface Scenario {
  id: string
  name: string
  description: string
  type: 'financial' | 'operational' | 'strategic' | 'esg'
  status: 'draft' | 'simulation' | 'completed' | 'archived'
  createdDate: string
  timeHorizon: { start: string; end: string; periods: number }
  variables: Variable[]
  results?: SimulationResults
  confidence?: number
}

export interface Variable {
  id: string
  name: string
  category: 'revenue' | 'cost' | 'capacity' | 'market' | 'resource'
  type: 'input' | 'calculated' | 'constraint'
  value: number
  unit: string
  range?: { min: number; max: number }
  formula?: string
  dependencies?: string[]
}

export interface SimulationResults {
  summary: {
    netPresentValue: number
    returnOnInvestment: number
    paybackPeriod: number
    riskScore: number
  }
  timeSeries: TimeSeriesData[]
  impacts: ImpactAssessment[]
  confidence: {
    overall: number
    financial: number
    operational: number
    strategic: number
  }
}

export interface TimeSeriesData {
  period: string
  revenue: number
  costs: number
  profit: number
  cashFlow: number
}

export interface ImpactAssessment {
  category: string
  impact: 'positive' | 'negative' | 'neutral'
  magnitude: 'low' | 'medium' | 'high'
  description: string
  confidence: number
}

const scenarioTemplates = [
  {
    type: 'financial',
    name: 'Market Expansion',
    description: 'Analyze the financial impact of expanding into new markets',
    icon: Globe,
    color: 'bg-blue-500',
    variables: ['Market Size', 'Penetration Rate', 'Customer Acquisition Cost', 'Churn Rate']
  },
  {
    type: 'operational',
    name: 'Process Automation',
    description: 'Model the operational impact of automating key processes',
    icon: Zap,
    color: 'bg-yellow-500',
    variables: ['Automation Cost', 'Efficiency Gain', 'Labor Savings', 'Training Cost']
  },
  {
    type: 'strategic',
    name: 'Product Launch',
    description: 'Simulate the strategic impact of launching a new product',
    icon: Briefcase,
    color: 'bg-purple-500',
    variables: ['Development Cost', 'Launch Cost', 'Market Response', 'Cannibalization']
  },
  {
    type: 'esg',
    name: 'Sustainability Initiative',
    description: 'Evaluate the comprehensive impact of ESG initiatives',
    icon: Target,
    color: 'bg-green-500',
    variables: ['Investment Cost', 'Energy Savings', 'Brand Value', 'Regulatory Risk']
  }
]

const mockScenarios: Scenario[] = [
  {
    id: '1',
    name: 'European Market Expansion',
    description: 'Analysis of expanding sales operations to EU markets',
    type: 'financial',
    status: 'completed',
    createdDate: '2024-01-10',
    timeHorizon: { start: '2024-01', end: '2026-12', periods: 36 },
    variables: [
      {
        id: 'v1',
        name: 'Market Size',
        category: 'market',
        type: 'input',
        value: 50000000,
        unit: '$',
        range: { min: 40000000, max: 60000000 }
      },
      {
        id: 'v2',
        name: 'Penetration Rate',
        category: 'market',
        type: 'input',
        value: 2.5,
        unit: '%',
        range: { min: 1, max: 5 }
      }
    ],
    results: {
      summary: {
        netPresentValue: 2500000,
        returnOnInvestment: 185,
        paybackPeriod: 18,
        riskScore: 35
      },
      timeSeries: [],
      impacts: [],
      confidence: {
        overall: 78,
        financial: 85,
        operational: 72,
        strategic: 76
      }
    },
    confidence: 78
  }
]

export default function ScenarioBuilder() {
  const [scenarios] = useState<Scenario[]>(mockScenarios)
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [viewMode, setViewMode] = useState<'gallery' | 'builder' | 'simulation'>('gallery')
  const [selectedTemplate, setSelectedTemplate] = useState<typeof scenarioTemplates[0] | null>(null)

  const renderGallery = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Scenario Gallery</h2>
          <p className="text-slate-400">Manage and analyze your strategic scenarios</p>
        </div>
        <button
          onClick={() => setViewMode('builder')}
          className="glass-button px-4 py-2 text-emerald-400 hover:text-emerald-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Scenario
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Layers className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-100">{scenarios.length}</div>
              <div className="text-sm text-slate-400">Active Scenarios</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Calculator className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-100">48</div>
              <div className="text-sm text-slate-400">Simulations Run</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-100">76%</div>
              <div className="text-sm text-slate-400">Avg Confidence</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-100">$8.2M</div>
              <div className="text-sm text-slate-400">Total NPV Impact</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scenarios List */}
      <div className="space-y-4">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="glass-card p-6 hover:bg-slate-800/40 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 rounded-lg">
                  <Layers className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">{scenario.name}</h3>
                  <p className="text-slate-400 text-sm">{scenario.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs px-2 py-1 bg-slate-700/50 rounded text-slate-400 capitalize">
                      {scenario.type}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      scenario.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      scenario.status === 'simulation' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {scenario.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedScenario(scenario)
                    setViewMode('simulation')
                  }}
                  className="glass-button p-2 text-slate-400 hover:text-slate-300"
                >
                  <Play className="w-4 h-4" />
                </button>
                <button className="glass-button p-2 text-slate-400 hover:text-slate-300">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="glass-button p-2 text-slate-400 hover:text-slate-300">
                  <Share className="w-4 h-4" />
                </button>
              </div>
            </div>

            {scenario.results && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">
                    ${(scenario.results.summary.netPresentValue / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-slate-400">NPV</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-400">
                    {scenario.results.summary.returnOnInvestment}%
                  </div>
                  <div className="text-sm text-slate-400">ROI</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-400">
                    {scenario.results.summary.paybackPeriod}mo
                  </div>
                  <div className="text-sm text-slate-400">Payback</div>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-bold ${
                    scenario.confidence && scenario.confidence > 70 ? 'text-green-400' :
                    scenario.confidence && scenario.confidence > 50 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {scenario.confidence}%
                  </div>
                  <div className="text-sm text-slate-400">Confidence</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderBuilder = () => (
    <div className="space-y-6">
      {/* Builder Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Scenario Builder</h2>
          <p className="text-slate-400">Create a new strategic scenario</p>
        </div>
        <button
          onClick={() => setViewMode('gallery')}
          className="glass-button px-4 py-2 text-slate-400 hover:text-slate-300"
        >
          ← Back to Gallery
        </button>
      </div>

      {!selectedTemplate ? (
        <div className="space-y-6">
          {/* Template Selection */}
          <div className="text-center mb-8">
            <Layers className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-100 mb-2">Choose a Scenario Template</h3>
            <p className="text-slate-400">Start with a pre-built template or create from scratch</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scenarioTemplates.map((template) => (
              <div
                key={template.type}
                className="glass-card p-6 cursor-pointer hover:bg-slate-800/40 transition-colors"
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 ${template.color} rounded-lg`}>
                    <template.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-100 mb-2">{template.name}</h4>
                    <p className="text-slate-400 text-sm mb-3">{template.description}</p>
                    <div className="space-y-1">
                      <div className="text-xs text-slate-500">Key Variables:</div>
                      <div className="flex flex-wrap gap-1">
                        {template.variables.slice(0, 3).map((variable) => (
                          <span key={variable} className="text-xs px-2 py-1 bg-slate-700/50 rounded text-slate-400">
                            {variable}
                          </span>
                        ))}
                        {template.variables.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-slate-700/50 rounded text-slate-400">
                            +{template.variables.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Option */}
          <div className="glass-card p-6 border-2 border-dashed border-slate-600 hover:border-emerald-500 transition-colors cursor-pointer">
            <div className="text-center">
              <Plus className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <h4 className="font-semibold text-slate-100 mb-2">Start from Scratch</h4>
              <p className="text-slate-400 text-sm">Build a completely custom scenario with your own variables</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Scenario Configuration */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-slate-100 mb-4">Scenario Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Scenario Name</label>
                <input
                  type="text"
                  className="glass-input w-full"
                  placeholder="e.g., Q2 Market Expansion"
                  defaultValue={selectedTemplate.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Time Horizon</label>
                <select className="glass-input w-full">
                  <option>12 months</option>
                  <option>24 months</option>
                  <option>36 months</option>
                  <option>60 months</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea
                className="glass-input w-full h-20 resize-none"
                placeholder="Describe the scenario and its objectives..."
                defaultValue={selectedTemplate.description}
              />
            </div>
          </div>

          {/* Variable Configuration */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-100">Variables</h3>
              <button className="glass-button px-3 py-2 text-emerald-400 hover:text-emerald-300">
                <Plus className="w-4 h-4 mr-2" />
                Add Variable
              </button>
            </div>
            
            <div className="space-y-4">
              {selectedTemplate.variables.map((variable, index) => (
                <div key={index} className="border border-slate-700/50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                      <input
                        type="text"
                        className="glass-input w-full"
                        defaultValue={variable}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                      <select className="glass-input w-full">
                        <option>Revenue</option>
                        <option>Cost</option>
                        <option>Market</option>
                        <option>Resource</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Value</label>
                      <input
                        type="number"
                        className="glass-input w-full"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Unit</label>
                      <select className="glass-input w-full">
                        <option>$</option>
                        <option>%</option>
                        <option>Units</option>
                        <option>Hours</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedTemplate(null)}
              className="glass-button flex-1 px-6 py-3 text-slate-400 hover:text-slate-300"
            >
              Back to Templates
            </button>
            <button 
              onClick={() => setViewMode('simulation')}
              className="glass-button flex-1 px-6 py-3 text-emerald-400 hover:text-emerald-300 bg-emerald-500/20"
            >
              Create Scenario
            </button>
          </div>
        </div>
      )}
    </div>
  )

  const renderSimulation = () => (
    <div className="space-y-6">
      {/* Simulation Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">
            {selectedScenario?.name || 'New Scenario'}
          </h2>
          <p className="text-slate-400">Run simulation and analyze results</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('gallery')}
            className="glass-button px-3 py-2 text-slate-400 hover:text-slate-300"
          >
            ← Gallery
          </button>
          <button className="glass-button p-2 text-slate-400 hover:text-slate-300">
            <Save className="w-4 h-4" />
          </button>
          <button className="glass-button p-2 text-slate-400 hover:text-slate-300">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Simulation Controls */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-100">Simulation Controls</h3>
          <div className="flex items-center gap-2">
            <button className="glass-button px-4 py-2 text-emerald-400 hover:text-emerald-300">
              <Play className="w-4 h-4 mr-2" />
              Run Simulation
            </button>
            <button className="glass-button p-2 text-slate-400 hover:text-slate-300">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="glass-button p-2 text-slate-400 hover:text-slate-300">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Simulation Type</label>
            <select className="glass-input w-full">
              <option>Base Case</option>
              <option>Monte Carlo</option>
              <option>Sensitivity Analysis</option>
              <option>Stress Test</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Iterations</label>
            <input type="number" className="glass-input w-full" defaultValue="1000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Confidence Level</label>
            <select className="glass-input w-full">
              <option>90%</option>
              <option>95%</option>
              <option>99%</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Dashboard */}
      {selectedScenario?.results && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Summary Metrics */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-slate-100 mb-4">Financial Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Net Present Value</span>
                <span className="text-xl font-bold text-green-400">
                  ${(selectedScenario.results.summary.netPresentValue / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Return on Investment</span>
                <span className="text-xl font-bold text-blue-400">
                  {selectedScenario.results.summary.returnOnInvestment}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Payback Period</span>
                <span className="text-xl font-bold text-purple-400">
                  {selectedScenario.results.summary.paybackPeriod} months
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Risk Score</span>
                <span className={`text-xl font-bold ${
                  selectedScenario.results.summary.riskScore < 30 ? 'text-green-400' :
                  selectedScenario.results.summary.riskScore < 60 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {selectedScenario.results.summary.riskScore}/100
                </span>
              </div>
            </div>
          </div>

          {/* Confidence Scores */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-slate-100 mb-4">Confidence Analysis</h3>
            <div className="space-y-4">
              {Object.entries(selectedScenario.results.confidence).map(([key, value]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 capitalize">{key}</span>
                    <span className="text-slate-300">{value}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        value > 70 ? 'bg-green-500' :
                        value > 50 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold text-slate-100 mb-4">Financial Projection</h3>
          <div className="h-64 bg-slate-900/50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <LineChart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">Time series chart would display here</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-semibold text-slate-100 mb-4">Impact Distribution</h3>
          <div className="h-64 bg-slate-900/50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">Impact breakdown chart would display here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Scenario Builder & Simulation</h1>
          <p className="text-slate-400 mt-1">Design, simulate, and analyze strategic scenarios</p>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'gallery' && renderGallery()}
      {viewMode === 'builder' && renderBuilder()}
      {viewMode === 'simulation' && renderSimulation()}
    </div>
  )
}