import { useState } from 'react'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Building, 
  Star,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  Calendar,
  Target,
  Activity
} from 'lucide-react'

export interface Stakeholder {
  id: string
  name: string
  role: string
  department: string
  email: string
  phone?: string
  influenceLevel: 'high' | 'medium' | 'low'
  interestLevel: 'high' | 'medium' | 'low'
  supportLevel: 'champion' | 'supporter' | 'neutral' | 'skeptic' | 'blocker'
  communicationPreference: 'email' | 'phone' | 'meeting' | 'chat'
  lastEngagement: string
  engagementScore: number
  riskLevel: 'low' | 'medium' | 'high'
  notes: string
  tags: string[]
}

const mockStakeholders: Stakeholder[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'CTO',
    department: 'Technology',
    email: 'sarah.chen@company.com',
    phone: '+1 555-0123',
    influenceLevel: 'high',
    interestLevel: 'high',
    supportLevel: 'champion',
    communicationPreference: 'meeting',
    lastEngagement: '2024-01-15',
    engagementScore: 95,
    riskLevel: 'low',
    notes: 'Strong advocate for the change initiative. Key decision maker.',
    tags: ['executive', 'technology', 'sponsor']
  },
  {
    id: '2',
    name: 'Mike Rodriguez',
    role: 'Operations Manager',
    department: 'Operations',
    email: 'mike.rodriguez@company.com',
    influenceLevel: 'medium',
    interestLevel: 'high',
    supportLevel: 'supporter',
    communicationPreference: 'email',
    lastEngagement: '2024-01-12',
    engagementScore: 78,
    riskLevel: 'low',
    notes: 'Supportive but concerned about operational disruption.',
    tags: ['operations', 'process-owner']
  },
  {
    id: '3',
    name: 'Jennifer Liu',
    role: 'Team Lead',
    department: 'Engineering',
    email: 'jennifer.liu@company.com',
    influenceLevel: 'medium',
    interestLevel: 'medium',
    supportLevel: 'skeptic',
    communicationPreference: 'chat',
    lastEngagement: '2024-01-10',
    engagementScore: 45,
    riskLevel: 'medium',
    notes: 'Concerns about technical complexity and timeline.',
    tags: ['technical', 'team-lead']
  },
  {
    id: '4',
    name: 'Robert Thompson',
    role: 'VP Finance',
    department: 'Finance',
    email: 'robert.thompson@company.com',
    influenceLevel: 'high',
    interestLevel: 'low',
    supportLevel: 'neutral',
    communicationPreference: 'email',
    lastEngagement: '2024-01-08',
    engagementScore: 62,
    riskLevel: 'medium',
    notes: 'Focused on ROI and budget impact.',
    tags: ['executive', 'finance', 'budget-owner']
  }
]

const getSupportColor = (support: string) => {
  switch (support) {
    case 'champion': return 'bg-green-500/20 text-green-400'
    case 'supporter': return 'bg-blue-500/20 text-blue-400'
    case 'neutral': return 'bg-slate-500/20 text-slate-400'
    case 'skeptic': return 'bg-yellow-500/20 text-yellow-400'
    case 'blocker': return 'bg-red-500/20 text-red-400'
    default: return 'bg-slate-500/20 text-slate-400'
  }
}

const getInfluenceColor = (level: string) => {
  switch (level) {
    case 'high': return 'text-red-400'
    case 'medium': return 'text-yellow-400'
    case 'low': return 'text-green-400'
    default: return 'text-slate-400'
  }
}

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'high': return 'text-red-400'
    case 'medium': return 'text-yellow-400'
    case 'low': return 'text-green-400'
    default: return 'text-slate-400'
  }
}

export default function StakeholderManager() {
  const [stakeholders] = useState<Stakeholder[]>(mockStakeholders)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'matrix'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high-risk' | 'champions' | 'skeptics'>('all')

  const filteredStakeholders = stakeholders.filter(stakeholder => {
    const matchesSearch = stakeholder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stakeholder.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stakeholder.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = 
      selectedFilter === 'all' ||
      (selectedFilter === 'high-risk' && stakeholder.riskLevel === 'high') ||
      (selectedFilter === 'champions' && stakeholder.supportLevel === 'champion') ||
      (selectedFilter === 'skeptics' && (stakeholder.supportLevel === 'skeptic' || stakeholder.supportLevel === 'blocker'))

    return matchesSearch && matchesFilter
  })

  const getQuadrantStakeholders = (influence: string, interest: string) => {
    return filteredStakeholders.filter(s => s.influenceLevel === influence && s.interestLevel === interest)
  }

  const renderStakeholderCard = (stakeholder: Stakeholder) => (
    <div key={stakeholder.id} className="glass-card p-6 hover:bg-slate-800/40 transition-colors group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100">{stakeholder.name}</h3>
            <p className="text-sm text-slate-400">{stakeholder.role}</p>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-300 p-1 transition-opacity">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Support Level</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getSupportColor(stakeholder.supportLevel)}`}>
            {stakeholder.supportLevel.charAt(0).toUpperCase() + stakeholder.supportLevel.slice(1)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Influence</span>
          <div className="flex items-center gap-1">
            <Star className={`w-4 h-4 ${getInfluenceColor(stakeholder.influenceLevel)}`} />
            <span className={`text-sm ${getInfluenceColor(stakeholder.influenceLevel)}`}>
              {stakeholder.influenceLevel.charAt(0).toUpperCase() + stakeholder.influenceLevel.slice(1)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Engagement Score</span>
          <div className="flex items-center gap-2">
            <div className="w-16 bg-slate-700/50 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stakeholder.engagementScore}%` }}
              />
            </div>
            <span className="text-sm text-slate-300">{stakeholder.engagementScore}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Risk Level</span>
          <div className="flex items-center gap-1">
            <AlertTriangle className={`w-4 h-4 ${getRiskColor(stakeholder.riskLevel)}`} />
            <span className={`text-sm ${getRiskColor(stakeholder.riskLevel)}`}>
              {stakeholder.riskLevel.charAt(0).toUpperCase() + stakeholder.riskLevel.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Building className="w-3 h-3" />
          <span>{stakeholder.department}</span>
          <span>•</span>
          <span>Last contact: {new Date(stakeholder.lastEngagement).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button className="glass-button p-2 text-slate-400 hover:text-slate-300">
          <Mail className="w-4 h-4" />
        </button>
        <button className="glass-button p-2 text-slate-400 hover:text-slate-300">
          <MessageSquare className="w-4 h-4" />
        </button>
        <button className="glass-button p-2 text-slate-400 hover:text-slate-300">
          <Calendar className="w-4 h-4" />
        </button>
      </div>
    </div>
  )

  const renderMatrixView = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-2">Influence-Interest Matrix</h3>
        <p className="text-slate-400">Stakeholders positioned by influence and interest levels</p>
      </div>

      <div className="grid grid-cols-2 gap-4 h-96">
        {/* High Interest, High Influence */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-slate-200">Manage Closely</h4>
            <div className="text-xs text-purple-400">High Interest • High Influence</div>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {getQuadrantStakeholders('high', 'high').map(stakeholder => (
              <div key={stakeholder.id} className="bg-slate-800/40 p-3 rounded-lg">
                <div className="font-medium text-slate-100 text-sm">{stakeholder.name}</div>
                <div className="text-xs text-slate-400">{stakeholder.role}</div>
                <div className={`inline-block px-2 py-0.5 rounded text-xs mt-1 ${getSupportColor(stakeholder.supportLevel)}`}>
                  {stakeholder.supportLevel}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High Interest, Low Influence */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-slate-200">Keep Informed</h4>
            <div className="text-xs text-purple-400">High Interest • Low Influence</div>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {getQuadrantStakeholders('low', 'high').map(stakeholder => (
              <div key={stakeholder.id} className="bg-slate-800/40 p-3 rounded-lg">
                <div className="font-medium text-slate-100 text-sm">{stakeholder.name}</div>
                <div className="text-xs text-slate-400">{stakeholder.role}</div>
                <div className={`inline-block px-2 py-0.5 rounded text-xs mt-1 ${getSupportColor(stakeholder.supportLevel)}`}>
                  {stakeholder.supportLevel}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Interest, High Influence */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-slate-200">Keep Satisfied</h4>
            <div className="text-xs text-purple-400">Low Interest • High Influence</div>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {getQuadrantStakeholders('high', 'low').map(stakeholder => (
              <div key={stakeholder.id} className="bg-slate-800/40 p-3 rounded-lg">
                <div className="font-medium text-slate-100 text-sm">{stakeholder.name}</div>
                <div className="text-xs text-slate-400">{stakeholder.role}</div>
                <div className={`inline-block px-2 py-0.5 rounded text-xs mt-1 ${getSupportColor(stakeholder.supportLevel)}`}>
                  {stakeholder.supportLevel}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Interest, Low Influence */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-slate-200">Monitor</h4>
            <div className="text-xs text-purple-400">Low Interest • Low Influence</div>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {getQuadrantStakeholders('low', 'low').map(stakeholder => (
              <div key={stakeholder.id} className="bg-slate-800/40 p-3 rounded-lg">
                <div className="font-medium text-slate-100 text-sm">{stakeholder.name}</div>
                <div className="text-xs text-slate-400">{stakeholder.role}</div>
                <div className={`inline-block px-2 py-0.5 rounded text-xs mt-1 ${getSupportColor(stakeholder.supportLevel)}`}>
                  {stakeholder.supportLevel}
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
          <h1 className="text-2xl font-bold text-slate-100">Stakeholder Management</h1>
          <p className="text-slate-400 mt-1">Manage stakeholder engagement and track change readiness</p>
        </div>
        <button className="glass-button px-4 py-2 text-purple-400 hover:text-purple-300">
          <Plus className="w-4 h-4 mr-2" />
          Add Stakeholder
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-100">2</div>
              <div className="text-sm text-slate-400">Champions</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-100">1</div>
              <div className="text-sm text-slate-400">At Risk</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-100">70%</div>
              <div className="text-sm text-slate-400">Avg Engagement</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-100">{stakeholders.length}</div>
              <div className="text-sm text-slate-400">Total Stakeholders</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search stakeholders..."
              className="glass-input pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <select
          className="glass-input"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value as any)}
        >
          <option value="all">All Stakeholders</option>
          <option value="champions">Champions</option>
          <option value="skeptics">Skeptics & Blockers</option>
          <option value="high-risk">High Risk</option>
        </select>

        <div className="flex gap-1 glass-card p-1">
          {(['grid', 'list', 'matrix'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 text-sm font-medium rounded transition-all duration-200
                ${viewMode === mode
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'text-slate-400 hover:text-slate-300'
                }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {viewMode === 'matrix' ? (
        renderMatrixView()
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStakeholders.map(renderStakeholderCard)}
        </div>
      ) : (
        <div className="space-y-4">
          {/* List Header */}
          <div className="glass-card p-4 bg-slate-800/40">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-slate-400">
              <div className="col-span-3">Stakeholder</div>
              <div className="col-span-2">Support Level</div>
              <div className="col-span-2">Influence</div>
              <div className="col-span-2">Engagement</div>
              <div className="col-span-2">Risk Level</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>

          {/* List Items */}
          <div className="space-y-2">
            {filteredStakeholders.map((stakeholder) => (
              <div key={stakeholder.id} className="glass-card p-4 hover:bg-slate-800/40 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-100">{stakeholder.name}</div>
                        <div className="text-sm text-slate-400">{stakeholder.role}</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSupportColor(stakeholder.supportLevel)}`}>
                      {stakeholder.supportLevel.charAt(0).toUpperCase() + stakeholder.supportLevel.slice(1)}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-1">
                      <Star className={`w-4 h-4 ${getInfluenceColor(stakeholder.influenceLevel)}`} />
                      <span className={`text-sm ${getInfluenceColor(stakeholder.influenceLevel)}`}>
                        {stakeholder.influenceLevel.charAt(0).toUpperCase() + stakeholder.influenceLevel.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-700/50 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${stakeholder.engagementScore}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-300">{stakeholder.engagementScore}%</span>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-1">
                      <AlertTriangle className={`w-4 h-4 ${getRiskColor(stakeholder.riskLevel)}`} />
                      <span className={`text-sm ${getRiskColor(stakeholder.riskLevel)}`}>
                        {stakeholder.riskLevel.charAt(0).toUpperCase() + stakeholder.riskLevel.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <button className="text-slate-400 hover:text-slate-300 p-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredStakeholders.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No stakeholders found</h3>
          <p className="text-slate-500 mb-4">
            {searchTerm || selectedFilter !== 'all' 
              ? 'Try adjusting your search or filters.' 
              : 'Get started by adding your first stakeholder.'}
          </p>
          <button className="glass-button px-4 py-2 text-purple-400 hover:text-purple-300">
            <Plus className="w-4 h-4 mr-2" />
            Add Stakeholder
          </button>
        </div>
      )}
    </div>
  )
}