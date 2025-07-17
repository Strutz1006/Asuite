import { Lightbulb, Plus, Search, Filter, Target, Brain, TrendingUp, TrendingDown, AlertTriangle, Clock, Users, BarChart3, Download, Bookmark, Share2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const insights = [
  {
    id: '1',
    title: 'Revenue Growth Accelerating',
    description: 'Q3 projections show 23% increase in revenue based on current market trends and customer acquisition patterns. Growth is driven by strong performance in enterprise segment.',
    category: 'Financial',
    type: 'Predictive',
    confidence: 87,
    impact: 'positive',
    priority: 'high',
    dataPoints: 15674,
    modelAccuracy: 92,
    timeframe: '3 months',
    generatedDate: '2024-07-15T10:30:00Z',
    lastUpdated: '2024-07-15T14:22:00Z',
    scenario: 'Market Expansion Strategy',
    author: 'AI Analytics Engine',
    tags: ['revenue', 'growth', 'prediction'],
    keyMetrics: [
      { name: 'Revenue Growth', value: '23%', trend: 'up' },
      { name: 'Customer Acquisition', value: '156%', trend: 'up' },
      { name: 'Market Share', value: '12.8%', trend: 'up' },
    ],
  },
  {
    id: '2',
    title: 'Customer Churn Risk Elevated',
    description: 'Machine learning model predicts 15% increase in customer churn rate within next 6 months. Primary risk factors include pricing pressure and competitive threats.',
    category: 'Customer',
    type: 'Risk Analysis',
    confidence: 92,
    impact: 'negative',
    priority: 'high',
    dataPoints: 23891,
    modelAccuracy: 89,
    timeframe: '6 months',
    generatedDate: '2024-07-15T09:15:00Z',
    lastUpdated: '2024-07-15T11:45:00Z',
    scenario: 'Competitive Threat Response',
    author: 'Customer Analytics Model',
    tags: ['churn', 'risk', 'customer'],
    keyMetrics: [
      { name: 'Churn Rate', value: '15%', trend: 'up' },
      { name: 'Customer Satisfaction', value: '78%', trend: 'down' },
      { name: 'Retention Cost', value: '$2.3M', trend: 'up' },
    ],
  },
  {
    id: '3',
    title: 'Supply Chain Optimization Opportunity',
    description: 'Analysis reveals potential 18% cost reduction through supply chain optimization. Key opportunities in logistics routing and inventory management.',
    category: 'Operations',
    type: 'Optimization',
    confidence: 76,
    impact: 'positive',
    priority: 'medium',
    dataPoints: 8934,
    modelAccuracy: 84,
    timeframe: '9 months',
    generatedDate: '2024-07-15T08:45:00Z',
    lastUpdated: '2024-07-15T13:20:00Z',
    scenario: 'Supply Chain Disruption',
    author: 'Operations Analytics',
    tags: ['supply-chain', 'optimization', 'cost'],
    keyMetrics: [
      { name: 'Cost Reduction', value: '18%', trend: 'down' },
      { name: 'Efficiency Gain', value: '24%', trend: 'up' },
      { name: 'Inventory Turnover', value: '5.2x', trend: 'up' },
    ],
  },
  {
    id: '4',
    title: 'Market Volatility Patterns Detected',
    description: 'Historical analysis identifies recurring market volatility patterns that correlate with seasonal trends. Proactive positioning recommended.',
    category: 'Market',
    type: 'Pattern Analysis',
    confidence: 68,
    impact: 'neutral',
    priority: 'low',
    dataPoints: 45621,
    modelAccuracy: 71,
    timeframe: '12 months',
    generatedDate: '2024-07-14T16:30:00Z',
    lastUpdated: '2024-07-15T09:10:00Z',
    scenario: 'Economic Recession Impact',
    author: 'Market Intelligence',
    tags: ['market', 'volatility', 'patterns'],
    keyMetrics: [
      { name: 'Volatility Index', value: '34%', trend: 'up' },
      { name: 'Correlation Score', value: '0.76', trend: 'up' },
      { name: 'Confidence Level', value: '68%', trend: 'stable' },
    ],
  },
  {
    id: '5',
    title: 'Technology Adoption Acceleration',
    description: 'Digital transformation metrics show 45% faster adoption rates than industry average. Competitive advantage opportunity identified.',
    category: 'Technology',
    type: 'Trend Analysis',
    confidence: 81,
    impact: 'positive',
    priority: 'medium',
    dataPoints: 12456,
    modelAccuracy: 87,
    timeframe: '18 months',
    generatedDate: '2024-07-14T11:20:00Z',
    lastUpdated: '2024-07-15T10:30:00Z',
    scenario: 'Digital Transformation Initiative',
    author: 'Tech Analytics Platform',
    tags: ['technology', 'adoption', 'competitive'],
    keyMetrics: [
      { name: 'Adoption Rate', value: '45%', trend: 'up' },
      { name: 'User Engagement', value: '78%', trend: 'up' },
      { name: 'ROI Improvement', value: '32%', trend: 'up' },
    ],
  },
]

const categories = ['Financial', 'Customer', 'Operations', 'Market', 'Technology']
const types = ['Predictive', 'Risk Analysis', 'Optimization', 'Pattern Analysis', 'Trend Analysis']
const impacts = ['positive', 'negative', 'neutral']
const priorities = ['high', 'medium', 'low']

const impactColors = {
  positive: 'bg-green-500/20 text-green-400',
  negative: 'bg-red-500/20 text-red-400',
  neutral: 'bg-gray-500/20 text-gray-400',
}

const priorityColors = {
  high: 'bg-red-500/20 text-red-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  low: 'bg-green-500/20 text-green-400',
}

export default function InsightsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedImpact, setSelectedImpact] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')

  const filteredInsights = insights.filter(insight => {
    const matchesSearch = insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insight.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insight.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || insight.category === selectedCategory
    const matchesType = selectedType === 'all' || insight.type === selectedType
    const matchesImpact = selectedImpact === 'all' || insight.impact === selectedImpact
    const matchesPriority = selectedPriority === 'all' || insight.priority === selectedPriority
    return matchesSearch && matchesCategory && matchesType && matchesImpact && matchesPriority
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Insights</h1>
          <p className="text-slate-400 mt-1">
            AI-generated insights and strategic recommendations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="glass-button text-blue-300 hover:text-blue-200 px-4 py-2 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export All
          </button>
          <Link
            to="/insights/generate"
            className="glass-button text-purple-300 hover:text-purple-200 px-4 py-2 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Generate Insights
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search insights..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <option value="all">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={selectedImpact}
            onChange={(e) => setSelectedImpact(e.target.value)}
            className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <option value="all">All Impact</option>
            {impacts.map(impact => (
              <option key={impact} value={impact}>{impact.charAt(0).toUpperCase() + impact.slice(1)}</option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <option value="all">All Priority</option>
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Insight Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Insights</p>
              <p className="text-2xl font-bold text-slate-100">{insights.length}</p>
            </div>
            <Lightbulb className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">High Priority</p>
              <p className="text-2xl font-bold text-red-400">
                {insights.filter(i => i.priority === 'high').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Avg Confidence</p>
              <p className="text-2xl font-bold text-green-400">
                {Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length)}%
              </p>
            </div>
            <Target className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Positive Impact</p>
              <p className="text-2xl font-bold text-blue-400">
                {insights.filter(i => i.impact === 'positive').length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Insights List */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">
            Insights ({filteredInsights.length})
          </h2>
        </div>

        <div className="space-y-6">
          {filteredInsights.map((insight) => (
            <div key={insight.id} className="glass-card p-6 bg-slate-800/40 hover:bg-slate-800/60 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-100">{insight.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${impactColors[insight.impact]}`}>
                      {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[insight.priority]}`}>
                      {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)}
                    </span>
                    <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                      {insight.category}
                    </span>
                    <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                      {insight.type}
                    </span>
                  </div>
                  
                  <p className="text-slate-300 mb-4">{insight.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {insight.keyMetrics.map((metric, index) => (
                      <div key={index} className="glass-card p-3 bg-slate-800/40">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">{metric.name}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium text-slate-100">{metric.value}</span>
                            {metric.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-400" />}
                            {metric.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-400" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span>Confidence: {insight.confidence}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-4 h-4" />
                      <span>Data Points: {insight.dataPoints.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Timeframe: {insight.timeframe}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Brain className="w-4 h-4" />
                      <span>Model Accuracy: {insight.modelAccuracy}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Scenario:</span>
                      <Link to={`/scenarios/${insight.scenario}`} className="text-purple-400 hover:text-purple-300">
                        {insight.scenario}
                      </Link>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Author:</span>
                      <span>{insight.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Generated: {new Date(insight.generatedDate).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {insight.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="text-right mb-2">
                    <div className="text-sm text-slate-400">Confidence</div>
                    <div className="text-lg font-bold text-slate-100">{insight.confidence}%</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-yellow-300 transition-colors">
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-blue-300 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-green-300 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}