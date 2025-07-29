import { Brain, Plus, Search, Filter, Users, Target, Clock, TrendingUp, AlertTriangle, Eye, Edit, Trash2, Play, Pause, BarChart3 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const scenarios = [
  {
    id: '1',
    title: 'Economic Recession Impact',
    description: 'Analyze the potential impact of a global economic recession on revenue and operations',
    category: 'Economic',
    status: 'active',
    probability: 34,
    impact: 'High',
    createdDate: '2024-06-15',
    lastUpdated: '2024-07-15',
    participants: 8,
    insights: 12,
    variables: 15,
    outcomes: 6,
    confidence: 87,
    timeframe: '12 months',
    owner: 'Sarah Johnson',
    tags: ['recession', 'financial', 'risk'],
  },
  {
    id: '2',
    title: 'Market Expansion Strategy',
    description: 'Model potential outcomes of expanding into European markets',
    category: 'Strategic',
    status: 'planning',
    probability: 78,
    impact: 'Medium',
    createdDate: '2024-06-20',
    lastUpdated: '2024-07-14',
    participants: 15,
    insights: 8,
    variables: 12,
    outcomes: 4,
    confidence: 76,
    timeframe: '18 months',
    owner: 'Michael Chen',
    tags: ['expansion', 'market', 'growth'],
  },
  {
    id: '3',
    title: 'Supply Chain Disruption',
    description: 'Assess risks and mitigation strategies for supply chain disruptions',
    category: 'Operational',
    status: 'active',
    probability: 45,
    impact: 'High',
    createdDate: '2024-06-25',
    lastUpdated: '2024-07-13',
    participants: 12,
    insights: 18,
    variables: 20,
    outcomes: 8,
    confidence: 92,
    timeframe: '6 months',
    owner: 'Alex Rodriguez',
    tags: ['supply-chain', 'disruption', 'risk'],
  },
  {
    id: '4',
    title: 'Digital Transformation Initiative',
    description: 'Model the impact of comprehensive digital transformation on efficiency',
    category: 'Technology',
    status: 'draft',
    probability: 85,
    impact: 'Medium',
    createdDate: '2024-07-01',
    lastUpdated: '2024-07-12',
    participants: 10,
    insights: 5,
    variables: 8,
    outcomes: 3,
    confidence: 68,
    timeframe: '24 months',
    owner: 'Jennifer Williams',
    tags: ['digital', 'transformation', 'efficiency'],
  },
  {
    id: '5',
    title: 'Competitive Threat Response',
    description: 'Strategic response scenarios to major competitor product launches',
    category: 'Competitive',
    status: 'active',
    probability: 67,
    impact: 'High',
    createdDate: '2024-07-05',
    lastUpdated: '2024-07-11',
    participants: 9,
    insights: 14,
    variables: 18,
    outcomes: 7,
    confidence: 81,
    timeframe: '9 months',
    owner: 'Robert Davis',
    tags: ['competition', 'threat', 'response'],
  },
]

const statusColors = {
  active: 'bg-green-500/20 text-green-400',
  planning: 'bg-blue-500/20 text-blue-400',
  draft: 'bg-gray-500/20 text-gray-400',
  archived: 'bg-slate-500/20 text-slate-400',
}

const categoryColors = {
  Economic: 'bg-red-500/20 text-red-400',
  Strategic: 'bg-purple-500/20 text-purple-400',
  Operational: 'bg-orange-500/20 text-orange-400',
  Technology: 'bg-blue-500/20 text-blue-400',
  Competitive: 'bg-yellow-500/20 text-yellow-400',
}

const impactColors = {
  High: 'text-red-400',
  Medium: 'text-yellow-400',
  Low: 'text-green-400',
}

export default function ScenariosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedImpact, setSelectedImpact] = useState('all')

  const filteredScenarios = scenarios.filter(scenario => {
    const matchesSearch = scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scenario.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scenario.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = selectedStatus === 'all' || scenario.status === selectedStatus
    const matchesCategory = selectedCategory === 'all' || scenario.category === selectedCategory
    const matchesImpact = selectedImpact === 'all' || scenario.impact === selectedImpact
    return matchesSearch && matchesStatus && matchesCategory && matchesImpact
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Scenarios</h1>
          <p className="text-slate-400 mt-1">
            Design, model, and analyze strategic scenarios
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/builder"
            className="glass-button text-purple-300 hover:text-purple-200 px-4 py-2 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Scenario
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
              placeholder="Search scenarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <option value="all">All Categories</option>
            <option value="Economic">Economic</option>
            <option value="Strategic">Strategic</option>
            <option value="Operational">Operational</option>
            <option value="Technology">Technology</option>
            <option value="Competitive">Competitive</option>
          </select>

          {/* Impact Filter */}
          <select
            value={selectedImpact}
            onChange={(e) => setSelectedImpact(e.target.value)}
            className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <option value="all">All Impact</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Scenario Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Scenarios</p>
              <p className="text-2xl font-bold text-slate-100">{scenarios.length}</p>
            </div>
            <Brain className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Active</p>
              <p className="text-2xl font-bold text-green-400">
                {scenarios.filter(s => s.status === 'active').length}
              </p>
            </div>
            <Play className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">High Impact</p>
              <p className="text-2xl font-bold text-red-400">
                {scenarios.filter(s => s.impact === 'High').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Avg Confidence</p>
              <p className="text-2xl font-bold text-blue-400">
                {Math.round(scenarios.reduce((sum, s) => sum + s.confidence, 0) / scenarios.length)}%
              </p>
            </div>
            <Target className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Scenarios List */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">
            Scenarios ({filteredScenarios.length})
          </h2>
        </div>

        <div className="space-y-4">
          {filteredScenarios.map((scenario) => (
            <div key={scenario.id} className="glass-card p-4 bg-slate-800/40 hover:bg-slate-800/60 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      to={`/scenarios/${scenario.id}`}
                      className="text-lg font-medium text-slate-100 hover:text-purple-300"
                    >
                      {scenario.title}
                    </Link>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[scenario.category] || 'bg-gray-500/20 text-gray-400'}`}>
                      {scenario.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[scenario.status] || 'bg-gray-500/20 text-gray-400'}`}>
                      {scenario.status === 'active' ? 'Active' : 
                       scenario.status === 'planning' ? 'Planning' : 
                       scenario.status === 'draft' ? 'Draft' : 'Archived'}
                    </span>
                  </div>
                  
                  <p className="text-slate-400 text-sm mb-3">{scenario.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-3">
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
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-400">Confidence</span>
                        <span className="text-sm text-slate-300">{scenario.confidence}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            scenario.confidence >= 80 ? 'bg-green-500' : 
                            scenario.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${scenario.confidence}%` }}
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
                      <BarChart3 className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-400">Variables</p>
                        <p className="text-sm font-medium text-slate-100">{scenario.variables}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-400">Outcomes</p>
                        <p className="text-sm font-medium text-slate-100">{scenario.outcomes}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Owner:</span>
                      <span>{scenario.owner}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Updated {new Date(scenario.lastUpdated).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Timeframe:</span>
                      <span>{scenario.timeframe}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {scenario.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <div className="text-sm text-slate-400 mb-1">Impact Level</div>
                    <div className={`text-sm font-medium ${impactColors[scenario.impact]}`}>
                      {scenario.impact}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-purple-300 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-blue-300 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-green-300 transition-colors">
                      {scenario.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-300 transition-colors">
                      <Trash2 className="w-4 h-4" />
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