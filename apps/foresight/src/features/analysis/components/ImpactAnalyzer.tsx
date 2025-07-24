import { useState } from 'react'
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target, 
  DollarSign,
  Users,
  Globe,
  Zap,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Filter,
  Download,
  Share,
  Settings,
  RefreshCw,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'

export interface ImpactData {
  scenario: {
    id: string
    name: string
    type: string
    confidence: number
  }
  dimensions: ImpactDimension[]
  timeline: TimelineImpact[]
  stakeholders: StakeholderImpact[]
  risks: RiskAssessment[]
  opportunities: OpportunityAssessment[]
  summary: ImpactSummary
}

export interface ImpactDimension {
  category: 'financial' | 'operational' | 'strategic' | 'social' | 'environmental'
  name: string
  impact: number // -100 to 100 scale
  confidence: number // 0 to 100
  metrics: DimensionMetric[]
  trend: 'improving' | 'declining' | 'stable'
}

export interface DimensionMetric {
  name: string
  current: number
  projected: number
  unit: string
  change: number
  changeType: 'absolute' | 'percentage'
}

export interface TimelineImpact {
  period: string
  financial: number
  operational: number
  strategic: number
  social: number
  environmental: number
  overall: number
}

export interface StakeholderImpact {
  group: string
  impact: number
  confidence: number
  description: string
  priority: 'high' | 'medium' | 'low'
}

export interface RiskAssessment {
  id: string
  category: string
  description: string
  probability: number
  impact: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  mitigation: string
}

export interface OpportunityAssessment {
  id: string
  category: string
  description: string
  potential: number
  feasibility: number
  priority: 'high' | 'medium' | 'low'
}

export interface ImpactSummary {
  overallScore: number
  netBenefit: number
  riskAdjustedReturn: number
  sustainabilityIndex: number
  stakeholderAlignment: number
  recommendation: 'proceed' | 'modify' | 'delay' | 'abandon'
  rationale: string
}

const mockImpactData: ImpactData = {
  scenario: {
    id: '1',
    name: 'European Market Expansion',
    type: 'Market Entry',
    confidence: 78
  },
  dimensions: [
    {
      category: 'financial',
      name: 'Financial Impact',
      impact: 75,
      confidence: 85,
      trend: 'improving',
      metrics: [
        { name: 'Revenue', current: 10000000, projected: 13500000, unit: '$', change: 35, changeType: 'percentage' },
        { name: 'Operating Margin', current: 18, projected: 22, unit: '%', change: 4, changeType: 'absolute' },
        { name: 'Market Share', current: 12, projected: 18, unit: '%', change: 6, changeType: 'absolute' }
      ]
    },
    {
      category: 'operational',
      name: 'Operational Impact',
      impact: 45,
      confidence: 72,
      trend: 'stable',
      metrics: [
        { name: 'Team Size', current: 250, projected: 380, unit: 'people', change: 52, changeType: 'percentage' },
        { name: 'Process Efficiency', current: 78, projected: 82, unit: '%', change: 4, changeType: 'absolute' },
        { name: 'Customer Satisfaction', current: 4.2, projected: 4.5, unit: 'rating', change: 7, changeType: 'percentage' }
      ]
    },
    {
      category: 'strategic',
      name: 'Strategic Impact',
      impact: 85,
      confidence: 76,
      trend: 'improving',
      metrics: [
        { name: 'Brand Recognition', current: 65, projected: 78, unit: '%', change: 20, changeType: 'percentage' },
        { name: 'Competitive Position', current: 3, projected: 2, unit: 'rank', change: -33, changeType: 'percentage' },
        { name: 'Innovation Index', current: 72, projected: 85, unit: 'score', change: 18, changeType: 'percentage' }
      ]
    },
    {
      category: 'social',
      name: 'Social Impact',
      impact: 65,
      confidence: 68,
      trend: 'improving',
      metrics: [
        { name: 'Local Employment', current: 0, projected: 180, unit: 'jobs', change: 180, changeType: 'absolute' },
        { name: 'Community Investment', current: 50000, projected: 150000, unit: '$', change: 200, changeType: 'percentage' },
        { name: 'Skills Development', current: 0, projected: 45, unit: 'programs', change: 45, changeType: 'absolute' }
      ]
    },
    {
      category: 'environmental',
      name: 'Environmental Impact',
      impact: 25,
      confidence: 55,
      trend: 'declining',
      metrics: [
        { name: 'Carbon Footprint', current: 1200, projected: 1650, unit: 'tons CO2', change: 38, changeType: 'percentage' },
        { name: 'Energy Efficiency', current: 85, projected: 82, unit: '%', change: -4, changeType: 'percentage' },
        { name: 'Waste Reduction', current: 0, projected: 15, unit: '%', change: 15, changeType: 'absolute' }
      ]
    }
  ],
  timeline: [
    { period: 'Q1', financial: 20, operational: 15, strategic: 30, social: 25, environmental: 10, overall: 22 },
    { period: 'Q2', financial: 35, operational: 25, strategic: 45, social: 40, environmental: 15, overall: 35 },
    { period: 'Q3', financial: 55, operational: 35, strategic: 65, social: 55, environmental: 20, overall: 50 },
    { period: 'Q4', financial: 75, operational: 45, strategic: 85, social: 65, environmental: 25, overall: 65 }
  ],
  stakeholders: [
    { group: 'Shareholders', impact: 85, confidence: 90, description: 'Strong positive financial returns expected', priority: 'high' },
    { group: 'Employees', impact: 70, confidence: 75, description: 'New opportunities and career growth', priority: 'high' },
    { group: 'Customers', impact: 65, confidence: 80, description: 'Improved service availability and localization', priority: 'medium' },
    { group: 'Local Community', impact: 75, confidence: 70, description: 'Job creation and economic development', priority: 'medium' },
    { group: 'Competitors', impact: -45, confidence: 85, description: 'Increased competitive pressure in market', priority: 'low' },
    { group: 'Regulators', impact: 35, confidence: 60, description: 'Compliance with local regulations required', priority: 'high' }
  ],
  risks: [
    {
      id: 'r1',
      category: 'Market',
      description: 'Economic downturn in target region',
      probability: 25,
      impact: 75,
      severity: 'high',
      mitigation: 'Diversify across multiple markets, maintain flexible cost structure'
    },
    {
      id: 'r2',
      category: 'Regulatory',
      description: 'Changes in data privacy regulations',
      probability: 40,
      impact: 45,
      severity: 'medium',
      mitigation: 'Engage early with regulatory bodies, implement robust compliance framework'
    },
    {
      id: 'r3',
      category: 'Operational',
      description: 'Talent acquisition challenges',
      probability: 60,
      impact: 55,
      severity: 'medium',
      mitigation: 'Partner with local universities, offer competitive packages'
    }
  ],
  opportunities: [
    {
      id: 'o1',
      category: 'Strategic',
      description: 'Partnership with regional market leader',
      potential: 85,
      feasibility: 70,
      priority: 'high'
    },
    {
      id: 'o2',
      category: 'Innovation',
      description: 'Access to EU research grants and programs',
      potential: 65,
      feasibility: 80,
      priority: 'medium'
    },
    {
      id: 'o3',
      category: 'Market',
      description: 'Cross-selling to adjacent markets',
      potential: 75,
      feasibility: 65,
      priority: 'medium'
    }
  ],
  summary: {
    overallScore: 68,
    netBenefit: 2850000,
    riskAdjustedReturn: 142,
    sustainabilityIndex: 45,
    stakeholderAlignment: 72,
    recommendation: 'proceed',
    rationale: 'Strong financial returns with manageable risks. Recommend proceeding with enhanced environmental mitigation measures.'
  }
}

const dimensionIcons = {
  financial: DollarSign,
  operational: Zap,
  strategic: Target,
  social: Users,
  environmental: Globe
}

const dimensionColors = {
  financial: 'text-green-400',
  operational: 'text-blue-400',
  strategic: 'text-purple-400',
  social: 'text-orange-400',
  environmental: 'text-emerald-400'
}

export default function ImpactAnalyzer() {
  const [impactData] = useState<ImpactData>(mockImpactData)
  const [selectedDimension, setSelectedDimension] = useState<ImpactDimension | null>(null)
  const [viewMode, setViewMode] = useState<'overview' | 'timeline' | 'stakeholders' | 'risks'>('overview')

  const getImpactColor = (impact: number) => {
    if (impact > 60) return 'text-green-400'
    if (impact > 30) return 'text-yellow-400'
    if (impact > 0) return 'text-orange-400'
    return 'text-red-400'
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return ArrowUp
    if (change < 0) return ArrowDown
    return Minus
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Impact Summary */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-100">Impact Overview</h3>
          <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
            impactData.summary.recommendation === 'proceed' ? 'bg-green-500/20 text-green-400' :
            impactData.summary.recommendation === 'modify' ? 'bg-yellow-500/20 text-yellow-400' :
            impactData.summary.recommendation === 'delay' ? 'bg-orange-500/20 text-orange-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            Recommendation: {impactData.summary.recommendation.toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getImpactColor(impactData.summary.overallScore)}`}>
              {impactData.summary.overallScore}
            </div>
            <div className="text-sm text-slate-400 mt-1">Overall Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">
              ${(impactData.summary.netBenefit / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-slate-400 mt-1">Net Benefit</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">
              {impactData.summary.riskAdjustedReturn}%
            </div>
            <div className="text-sm text-slate-400 mt-1">Risk-Adj. Return</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${getImpactColor(impactData.summary.stakeholderAlignment)}`}>
              {impactData.summary.stakeholderAlignment}%
            </div>
            <div className="text-sm text-slate-400 mt-1">Stakeholder Alignment</div>
          </div>
        </div>

        <div className="bg-slate-800/40 rounded-lg p-4">
          <p className="text-slate-300">{impactData.summary.rationale}</p>
        </div>
      </div>

      {/* Impact Dimensions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {impactData.dimensions.map((dimension) => {
          const Icon = dimensionIcons[dimension.category]
          const colorClass = dimensionColors[dimension.category]
          
          return (
            <div
              key={dimension.category}
              className="glass-card p-6 cursor-pointer hover:bg-slate-800/40 transition-colors"
              onClick={() => setSelectedDimension(dimension)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-slate-800/40 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${colorClass}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100">{dimension.name}</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-400">Confidence:</span>
                      <span className="text-slate-300">{dimension.confidence}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getImpactColor(dimension.impact)}`}>
                    {dimension.impact > 0 ? '+' : ''}{dimension.impact}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {dimension.trend === 'improving' && <TrendingUp className="w-4 h-4 text-green-400" />}
                    {dimension.trend === 'declining' && <TrendingDown className="w-4 h-4 text-red-400" />}
                    {dimension.trend === 'stable' && <Activity className="w-4 h-4 text-yellow-400" />}
                    <span className="text-slate-400 capitalize">{dimension.trend}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {dimension.metrics.slice(0, 2).map((metric) => {
                  const ChangeIcon = getChangeIcon(metric.change)
                  return (
                    <div key={metric.name} className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">{metric.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300">
                          {metric.projected.toLocaleString()} {metric.unit}
                        </span>
                        <div className={`flex items-center gap-1 ${
                          metric.change > 0 ? 'text-green-400' :
                          metric.change < 0 ? 'text-red-400' :
                          'text-slate-400'
                        }`}>
                          <ChangeIcon className="w-3 h-3" />
                          <span>{Math.abs(metric.change)}{metric.changeType === 'percentage' ? '%' : ''}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Detailed Metrics Modal */}
      {selectedDimension && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-100">{selectedDimension.name}</h3>
              <button
                onClick={() => setSelectedDimension(null)}
                className="glass-button p-2 text-slate-400 hover:text-slate-300"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {selectedDimension.metrics.map((metric) => {
                const ChangeIcon = getChangeIcon(metric.change)
                return (
                  <div key={metric.name} className="bg-slate-800/40 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-100">{metric.name}</h4>
                      <div className={`flex items-center gap-1 ${
                        metric.change > 0 ? 'text-green-400' :
                        metric.change < 0 ? 'text-red-400' :
                        'text-slate-400'
                      }`}>
                        <ChangeIcon className="w-4 h-4" />
                        <span className="font-medium">
                          {Math.abs(metric.change)}{metric.changeType === 'percentage' ? '%' : ''}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Current:</span>
                        <span className="text-slate-300 ml-2">
                          {metric.current.toLocaleString()} {metric.unit}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Projected:</span>
                        <span className="text-slate-300 ml-2">
                          {metric.projected.toLocaleString()} {metric.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderTimeline = () => (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-slate-100 mb-6">Impact Timeline</h3>
        
        <div className="space-y-4">
          {impactData.timeline.map((period, index) => (
            <div key={period.period} className="relative">
              {index < impactData.timeline.length - 1 && (
                <div className="absolute left-4 top-12 w-px h-16 bg-slate-700"></div>
              )}
              
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {index + 1}
                </div>
                
                <div className="flex-1 glass-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-slate-100">{period.period}</h4>
                    <div className={`text-lg font-bold ${getImpactColor(period.overall)}`}>
                      Overall: {period.overall}%
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-slate-400 mb-1">Financial</div>
                      <div className={`font-semibold ${getImpactColor(period.financial)}`}>
                        {period.financial}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-400 mb-1">Operational</div>
                      <div className={`font-semibold ${getImpactColor(period.operational)}`}>
                        {period.operational}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-400 mb-1">Strategic</div>
                      <div className={`font-semibold ${getImpactColor(period.strategic)}`}>
                        {period.strategic}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-400 mb-1">Social</div>
                      <div className={`font-semibold ${getImpactColor(period.social)}`}>
                        {period.social}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-400 mb-1">Environmental</div>
                      <div className={`font-semibold ${getImpactColor(period.environmental)}`}>
                        {period.environmental}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStakeholders = () => (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-slate-100 mb-6">Stakeholder Impact Analysis</h3>
        
        <div className="space-y-4">
          {impactData.stakeholders.map((stakeholder) => (
            <div key={stakeholder.group} className="bg-slate-800/40 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-slate-100">{stakeholder.group}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className={`px-2 py-1 rounded text-xs ${
                      stakeholder.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      stakeholder.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {stakeholder.priority} priority
                    </span>
                    <span className="text-sm text-slate-400">
                      Confidence: {stakeholder.confidence}%
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-xl font-bold ${getImpactColor(Math.abs(stakeholder.impact))}`}>
                    {stakeholder.impact > 0 ? '+' : ''}{stakeholder.impact}
                  </div>
                  <div className="text-sm text-slate-400">Impact Score</div>
                </div>
              </div>
              
              <p className="text-slate-300 text-sm">{stakeholder.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderRisks = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risks */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-slate-100 mb-6">Risk Assessment</h3>
          
          <div className="space-y-4">
            {impactData.risks.map((risk) => (
              <div key={risk.id} className="border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-100">{risk.category}</h4>
                    <div className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                      risk.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                      risk.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      risk.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {risk.severity} severity
                    </div>
                  </div>
                  
                  <div className="text-right text-sm">
                    <div className="text-slate-400">Risk Score</div>
                    <div className="text-slate-100 font-semibold">
                      {Math.round(risk.probability * risk.impact / 100)}
                    </div>
                  </div>
                </div>
                
                <p className="text-slate-300 text-sm mb-3">{risk.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div>
                    <span className="text-slate-400">Probability:</span>
                    <span className="text-slate-300 ml-2">{risk.probability}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Impact:</span>
                    <span className="text-slate-300 ml-2">{risk.impact}%</span>
                  </div>
                </div>
                
                <div className="bg-slate-900/50 rounded p-3">
                  <div className="text-xs text-slate-400 mb-1">Mitigation Strategy:</div>
                  <div className="text-sm text-slate-300">{risk.mitigation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Opportunities */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-slate-100 mb-6">Opportunities</h3>
          
          <div className="space-y-4">
            {impactData.opportunities.map((opportunity) => (
              <div key={opportunity.id} className="border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-100">{opportunity.category}</h4>
                    <div className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                      opportunity.priority === 'high' ? 'bg-green-500/20 text-green-400' :
                      opportunity.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {opportunity.priority} priority
                    </div>
                  </div>
                  
                  <div className="text-right text-sm">
                    <div className="text-slate-400">Opportunity Score</div>
                    <div className="text-slate-100 font-semibold">
                      {Math.round(opportunity.potential * opportunity.feasibility / 100)}
                    </div>
                  </div>
                </div>
                
                <p className="text-slate-300 text-sm mb-3">{opportunity.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Potential:</span>
                    <span className="text-slate-300 ml-2">{opportunity.potential}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Feasibility:</span>
                    <span className="text-slate-300 ml-2">{opportunity.feasibility}%</span>
                  </div>
                </div>
              </div>
            ))}
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
          <h1 className="text-2xl font-bold text-slate-100">Impact Analysis</h1>
          <p className="text-slate-400 mt-1">
            {impactData.scenario.name} • {impactData.scenario.type} • {impactData.scenario.confidence}% confidence
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="glass-button p-2 text-slate-400 hover:text-slate-300">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="glass-button p-2 text-slate-400 hover:text-slate-300">
            <Download className="w-4 h-4" />
          </button>
          <button className="glass-button p-2 text-slate-400 hover:text-slate-300">
            <Share className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-1 glass-card p-1">
        {(['overview', 'timeline', 'stakeholders', 'risks'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 text-sm font-medium rounded transition-all duration-200 ${
              viewMode === mode
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {viewMode === 'overview' && renderOverview()}
      {viewMode === 'timeline' && renderTimeline()}
      {viewMode === 'stakeholders' && renderStakeholders()}
      {viewMode === 'risks' && renderRisks()}
    </div>
  )
}