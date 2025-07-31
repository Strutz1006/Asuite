import { useState } from 'react'
import { Users, Plus, Edit, Trash2, Search, UserPlus, X } from 'lucide-react'

interface Team {
  id: string
  name: string
  description: string
  memberCount: number
  departmentId: string
  departmentName: string
  leaderId: string
  leaderName: string
  createdAt: string
}

const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Engineering',
    description: 'Software development and technical implementation',
    memberCount: 12,
    departmentId: '1',
    departmentName: 'Technology',
    leaderId: '1',
    leaderName: 'Sarah Chen',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Product Marketing',
    description: 'Go-to-market strategy and product positioning',
    memberCount: 6,
    departmentId: '2',
    departmentName: 'Marketing',
    leaderId: '2',
    leaderName: 'Mike Rodriguez',
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    name: 'Customer Success',
    description: 'Client onboarding and relationship management',
    memberCount: 8,
    departmentId: '3',
    departmentName: 'Sales',
    leaderId: '3',
    leaderName: 'Emma Thompson',
    createdAt: '2024-02-01'
  }
]

const mockDepartments = [
  { id: '1', name: 'Technology' },
  { id: '2', name: 'Marketing' },
  { id: '3', name: 'Sales' },
  { id: '4', name: 'Operations' }
]

const mockUsers = [
  { id: '1', name: 'Sarah Chen', role: 'Engineering Manager' },
  { id: '2', name: 'Mike Rodriguez', role: 'Product Marketing Manager' },
  { id: '3', name: 'Emma Thompson', role: 'Customer Success Lead' },
  { id: '4', name: 'David Kim', role: 'Senior Developer' },
  { id: '5', name: 'Lisa Wang', role: 'UX Designer' }
]

export function TeamsSection() {
  const [teams, setTeams] = useState<Team[]>(mockTeams)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    departmentId: '',
    leaderId: ''
  })

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreate = () => {
    if (formData.name.trim()) {
      const department = mockDepartments.find(d => d.id === formData.departmentId)
      const leader = mockUsers.find(u => u.id === formData.leaderId)
      
      const newTeam: Team = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        memberCount: 1, // Just the leader initially
        departmentId: formData.departmentId,
        departmentName: department?.name || '',
        leaderId: formData.leaderId,
        leaderName: leader?.name || '',
        createdAt: new Date().toISOString().split('T')[0]
      }
      
      setTeams([...teams, newTeam])
      setFormData({ name: '', description: '', departmentId: '', leaderId: '' })
      setShowCreateModal(false)
    }
  }

  const handleEdit = (team: Team) => {
    setEditingTeam(team)
    setFormData({
      name: team.name,
      description: team.description,
      departmentId: team.departmentId,
      leaderId: team.leaderId
    })
    setShowCreateModal(true)
  }

  const handleUpdate = () => {
    if (editingTeam && formData.name.trim()) {
      const department = mockDepartments.find(d => d.id === formData.departmentId)
      const leader = mockUsers.find(u => u.id === formData.leaderId)
      
      setTeams(teams.map(team => 
        team.id === editingTeam.id 
          ? {
              ...team,
              name: formData.name,
              description: formData.description,
              departmentId: formData.departmentId,
              departmentName: department?.name || '',
              leaderId: formData.leaderId,
              leaderName: leader?.name || ''
            }
          : team
      ))
      
      setFormData({ name: '', description: '', departmentId: '', leaderId: '' })
      setEditingTeam(null)
      setShowCreateModal(false)
    }
  }

  const handleDelete = (teamId: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      setTeams(teams.filter(team => team.id !== teamId))
    }
  }

  const closeModal = () => {
    setShowCreateModal(false)
    setEditingTeam(null)
    setFormData({ name: '', description: '', departmentId: '', leaderId: '' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            Teams Management
          </h2>
          <p className="text-slate-400 mt-1">Organize your workforce into collaborative teams</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="glass-button bg-blue-500/20 text-blue-300 hover:text-blue-200 px-4 py-2 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Team
        </button>
      </div>

      {/* Search */}
      <div className="glass-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search teams..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <div key={team.id} className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">{team.name}</h3>
                <p className="text-sm text-slate-400 mt-1">{team.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(team)}
                  className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(team.id)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Department</span>
                <span className="text-sm text-slate-300">{team.departmentName}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Team Lead</span>
                <span className="text-sm text-slate-300">{team.leaderName}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Members</span>
                <span className="text-sm text-slate-300 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {team.memberCount}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Created</span>
                <span className="text-sm text-slate-300">{new Date(team.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <button className="w-full text-sm text-blue-400 hover:text-blue-300 flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" />
                Manage Members
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <div className="glass-card p-8 text-center">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">No teams found</h3>
          <p className="text-slate-400 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first team to get started'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="glass-button bg-blue-500/20 text-blue-300 hover:text-blue-200 px-4 py-2 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Create Team
            </button>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-100">
                  {editingTeam ? 'Edit Team' : 'Create New Team'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-slate-400 hover:text-slate-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter team name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Describe the team's purpose and responsibilities"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Department *
                </label>
                <select
                  value={formData.departmentId}
                  onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select department</option>
                  {mockDepartments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Team Lead *
                </label>
                <select
                  value={formData.leaderId}
                  onChange={(e) => setFormData({...formData, leaderId: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select team lead</option>
                  {mockUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.name} - {user.role}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-700/50 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-800/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingTeam ? handleUpdate : handleCreate}
                disabled={!formData.name.trim() || !formData.departmentId || !formData.leaderId}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {editingTeam ? 'Update Team' : 'Create Team'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}