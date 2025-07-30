import { Eye, Brain, TrendingUp, AlertTriangle, Plus, ArrowRight, Clock, Target, BarChart3, Lightbulb, Activity, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const stats = [
  {
    name: 'Active Scenarios',
    value: '24',
    change: '+6',
    changeType: 'increase',
    icon: Brain,
  },
  {
    name: 'Forecast Accuracy',
    value: '92%',
    change: '+8%',
    changeType: 'increase',
    icon: Target,
  },
  {
    name: 'Insights Generated',
    value: '156',
    change: '+23',
    changeType: 'increase',
    icon: Lightbulb,
  },
  {
    name: 'Risk Probability',
    value: '23%',
    change: '-5%',
    changeType: 'decrease',
    icon: AlertTriangle,
  },
]

const recentScenarios = [
  {
    id: '1',
    title: 'Economic Recession Impact',
    category: 'Economic',
    probability: 34,
    impact: 'High',
    lastUpdated: '2024-07-15',
    status: 'active',
    participants: 8,
    insights: 12,
  },
  {
    id: '2',
    title: 'Market Expansion Strategy',
    category: 'Strategic',
    probability: 78,
    impact: 'Medium',
    lastUpdated: '2024-07-14',
    status: 'planning',
    participants: 15,
    insights: 8,
  },
  {
    id: '3',
    title: 'Supply Chain Disruption',
    category: 'Operational',
    probability: 45,
    impact: 'High',
    lastUpdated: '2024-07-13',
    status: 'active',
    participants: 12,
    insights: 18,
  },
]

const keyInsights = [
  {
    id: '1',
    title: 'Revenue Growth Accelerating',
    description: 'Q3 projections show 23% increase in revenue based on current market trends',
    confidence: 87,
    impact: 'positive',
    category: 'Financial',
    timestamp: '2024-07-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'Customer Churn Risk Elevated',
    description: 'Model predicts 15% increase in churn rate within next 6 months',
    confidence: 92,
    impact: 'negative',
    category: 'Customer',
    timestamp: '2024-07-15T09:15:00Z',
  },
  {
    id: '3',
    title: 'New Market Opportunity Identified',
    description: 'Analytics reveal untapped market segment with 40% growth potential',
    confidence: 76,
    impact: 'positive',
    category: 'Market',
    timestamp: '2024-07-15T08:45:00Z',
  },
]

const riskAlerts = [
  {
    id: '1',
    title: 'Supply Chain Vulnerability',
    description: 'Single point of failure detected in logistics network',
    severity: 'high',
    probability: 67,
    timeframe: '3 months',
    scenario: 'Supply Chain Disruption',
  },
  {
    id: '2',
    title: 'Competitor Product Launch',
    description: 'Intelligence suggests major competitor launching similar product',
    severity: 'medium',
    probability: 82,
    timeframe: '6 months',
    scenario: 'Market Competition',
  },
  {
    id: '3',
    title: 'Regulatory Changes',
    description: 'Proposed legislation could impact operational compliance',
    severity: 'medium',
    probability: 54,
    timeframe: '12 months',
    scenario: 'Regulatory Shift',
  },
]

const forecastMetrics = [
  {
    metric: 'Revenue Growth',
    current: 15.2,
    forecast: 18.7,
    confidence: 89,
    trend: 'up',
    timeframe: 'Q4 2024',
  },
  {
    metric: 'Market Share',
    current: 12.8,
    forecast: 14.2,
    confidence: 76,
    trend: 'up',
    timeframe: 'Q4 2024',
  },
  {
    metric: 'Operating Costs',
    current: 8.9,
    forecast: 7.8,
    confidence: 82,
    trend: 'down',
    timeframe: 'Q4 2024',
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Monitor scenarios, insights, and strategic forecasts
          </p>
        </div>
        <Link
          to="/builder"
          className="glass-button text-purple-300 hover:text-purple-200 px-4 py-2 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Scenario
        </Link>
      </div>

      {/* Company Message/Slogan */}
      <div className="glass-card p-6 text-center">
        <h2 className="text-xl font-semibold text-slate-100 mb-2">
          Envision Tomorrow, Navigate Today
        </h2>
        <p className="text-slate-400">
          Transform uncertainty into strategic advantage with advanced scenario planning and predictive analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{stat.name}</p>
                  <p className="text-2xl font-semibold text-slate-100 mt-1">{stat.value}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/20">
                  <Icon className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-slate-400 ml-1">from last month</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Scenarios */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">Active Scenarios</h2>
          <Link
            to="/scenarios"
            className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {recentScenarios.map((scenario) => (
            <div key={scenario.id} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Link
                    to={`/scenarios/${scenario.id}`}
                    className="text-slate-100 hover:text-purple-300 font-medium"
                  >
                    {scenario.title}
                  </Link>
                  <span className="text-sm text-slate-400">({scenario.category})</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    scenario.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    scenario.status === 'planning' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {scenario.status === 'active' ? 'Active' : 
                     scenario.status === 'planning' ? 'Planning' : 'Archived'}
                  </span>
                </div>
                <span className={`text-sm font-medium ${
                  scenario.impact === 'High' ? 'text-red-400' :
                  scenario.impact === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {scenario.impact} Impact
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-400">Probability</span>
                    <span className="text-sm text-slate-300">{scenario.probability}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        scenario.probability >= 70 ? 'bg-red-500' : 
                        scenario.probability >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${scenario.probability}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-400">Participants</p>
                    <p className="text-sm font-medium text-slate-100">{scenario.participants}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-400">Insights</p>
                    <p className="text-sm font-medium text-slate-100">{scenario.insights}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-400">Updated</p>
                    <p className="text-sm font-medium text-slate-100">{new Date(scenario.lastUpdated).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Key Insights
          </h2>
          <Link
            to="/insights"
            className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {keyInsights.map((insight) => (
            <div key={insight.id} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-slate-100 font-medium">{insight.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      insight.impact === 'positive' ? 'bg-green-500/20 text-green-400' :
                      insight.impact === 'negative' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {insight.impact === 'positive' ? 'Positive' : 
                       insight.impact === 'negative' ? 'Negative' : 'Neutral'}
                    </span>
                    <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                      {insight.category}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-2">{insight.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span>Confidence: {insight.confidence}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(insight.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Alerts and Forecast Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Alerts */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Risk Alerts
            </h2>
          </div>
          <div className="space-y-4">
            {riskAlerts.map((alert) => (
              <div key={alert.id} className="glass-card p-4 bg-slate-800/40">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-slate-100 font-medium">{alert.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                        alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{alert.description}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>Probability: {alert.probability}%</span>
                      <span>Timeframe: {alert.timeframe}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Forecast Metrics */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Forecast Metrics
            </h2>
          </div>
          <div className="space-y-4">
            {forecastMetrics.map((metric, index) => (
              <div key={index} className="glass-card p-4 bg-slate-800/40">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-slate-100 font-medium">{metric.metric}</h3>
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {metric.trend === 'up' ? '↗' : '↘'} {metric.forecast}%
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
                  <span>Current: {metric.current}%</span>
                  <span>Forecast: {metric.forecast}%</span>
                  <span>Confidence: {metric.confidence}%</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      metric.confidence >= 80 ? 'bg-green-500' : 
                      metric.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${metric.confidence}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Target: {metric.timeframe}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/builder" className="glass-card p-6 hover:bg-slate-800/40 transition-colors">
          <Brain className="w-8 h-8 text-purple-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Create Scenario</h3>
          <p className="text-slate-400 text-sm">Design and model new strategic scenarios</p>
        </Link>
        
        <Link to="/insights" className="glass-card p-6 hover:bg-slate-800/40 transition-colors">
          <Lightbulb className="w-8 h-8 text-yellow-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Generate Insights</h3>
          <p className="text-slate-400 text-sm">Analyze data and generate strategic insights</p>
        </Link>
        
        <Link to="/analytics" className="glass-card p-6 hover:bg-slate-800/40 transition-colors">
          <TrendingUp className="w-8 h-8 text-blue-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">View Analytics</h3>
          <p className="text-slate-400 text-sm">Explore predictive analytics and forecasts</p>
        </Link>
      </div>
    </div>
  )
}