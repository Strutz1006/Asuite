import { useState, useEffect } from 'react'
import { Users, Plus, Edit, Trash2, Search, UserPlus, X, Loader2, AlertCircle } from 'lucide-react'
import { useSetupStatus } from '@/hooks/useSetupStatus'
import { supabase } from '@aesyros/supabase'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Team {
  id: string
  name: string
  description: string | null
  department_id: string | null
  team_lead_id: string | null
  organization_id: string | null
  created_at: string | null
  // Computed fields
  memberCount?: number
  departmentName?: string
  leaderName?: string
}

interface Department {
  id: string
  name: string
}

interface User {
  id: string
  full_name: string | null
  email: string
  job_title: string | null
}


export function TeamsSection() {
  const { organization } = useSetupStatus()
  const [teams, setTeams] = useState<Team[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department_id: '',
    team_lead_id: ''
  })

  // Fetch teams, departments, and users data
  useEffect(() => {
    if (organization?.id) {
      fetchData()
    }
  }, [organization])

  const fetchData = async () => {
    try {
      setLoading(true)
      setErrorMessage(null)

      // Fetch teams with member counts
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select(`
          *,
          users(id)
        `)
        .eq('organization_id', organization?.id)
        .order('name')

      if (teamsError) throw teamsError

      // Fetch departments
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('departments')
        .select('id, name')
        .eq('organization_id', organization?.id)
        .order('name')

      if (departmentsError) throw departmentsError

      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, full_name, email, job_title')
        .eq('organization_id', organization?.id)
        .order('full_name')

      if (usersError) throw usersError

      // Process teams data with computed fields
      const processedTeams = (teamsData || []).map(team => ({
        ...team,
        memberCount: team.users?.length || 0,
        departmentName: departmentsData?.find(d => d.id === team.department_id)?.name || '',
        leaderName: usersData?.find(u => u.id === team.team_lead_id)?.full_name || ''
      }))

      setTeams(processedTeams)
      setDepartments(departmentsData || [])
      setUsers(usersData || [])

    } catch (error) {
      console.error('Error fetching teams data:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load teams data')
    } finally {
      setLoading(false)
    }
  }

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (team.description?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (team.departmentName?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleCreate = async () => {
    if (!formData.name.trim() || !organization?.id) {
      setErrorMessage('Please fill in required fields')
      return
    }

    // For cross-functional teams, we need a department_id due to schema constraints
    // Create a "Cross-Functional" department if none selected and none exists
    let departmentId = formData.department_id

    if (!departmentId) {
      // Check if "Cross-Functional" department exists
      const { data: crossFunctionalDept } = await supabase
        .from('departments')
        .select('id')
        .eq('organization_id', organization.id)
        .eq('name', 'Cross-Functional')
        .single()

      if (crossFunctionalDept) {
        departmentId = crossFunctionalDept.id
      } else {
        // Create Cross-Functional department
        const { data: newDept, error: deptError } = await supabase
          .from('departments')
          .insert({
            name: 'Cross-Functional',
            description: 'Cross-functional teams that span multiple departments',
            organization_id: organization.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select('id')
          .single()

        if (deptError) {
          setErrorMessage('Failed to create cross-functional department: ' + deptError.message)
          return
        }
        departmentId = newDept.id
      }
    }

    try {
      setSaving(true)
      setErrorMessage(null)

      const { data, error } = await supabase
        .from('teams')
        .insert({
          name: formData.name,
          description: formData.description || null,
          department_id: departmentId,
          team_lead_id: formData.team_lead_id || null,
          organization_id: organization.id,
          created_at: new Date().toISOString()
        })
        .select('*')
        .single()

      if (error) throw error

      // Add computed fields and add to local state
      if (data) {
        const department = departments.find(d => d.id === data.department_id)
        const leader = users.find(u => u.id === data.team_lead_id)
        
        const newTeam = {
          ...data,
          memberCount: 0, // No members initially
          departmentName: department?.name || '',
          leaderName: leader?.full_name || ''
        }
        setTeams([...teams, newTeam])
      }
      
      setFormData({ name: '', description: '', department_id: '', team_lead_id: '' })
      setShowCreateModal(false)
      
    } catch (error) {
      console.error('Error creating team:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create team')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (team: Team) => {
    setEditingTeam(team)
    setFormData({
      name: team.name,
      description: team.description || '',
      department_id: team.department_id || '',
      team_lead_id: team.team_lead_id || ''
    })
    setShowCreateModal(true)
  }

  const handleUpdate = async () => {
    if (!editingTeam || !formData.name.trim()) {
      setErrorMessage('Please fill in required fields')
      return
    }

    try {
      setSaving(true)
      setErrorMessage(null)

      const { data, error } = await supabase
        .from('teams')
        .update({
          name: formData.name,
          description: formData.description || null,
          department_id: formData.department_id || null,
          team_lead_id: formData.team_lead_id || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingTeam.id)
        .select('*')
        .single()

      if (error) throw error

      // Update local state with computed fields
      if (data) {
        const department = departments.find(d => d.id === data.department_id)
        const leader = users.find(u => u.id === data.team_lead_id)
        
        const updatedTeam = {
          ...data,
          memberCount: editingTeam.memberCount || 0,
          departmentName: department?.name || '',
          leaderName: leader?.full_name || ''
        }
        
        setTeams(teams.map(team => 
          team.id === editingTeam.id ? updatedTeam : team
        ))
      }
      
      setFormData({ name: '', description: '', department_id: '', team_lead_id: '' })
      setEditingTeam(null)
      setShowCreateModal(false)
      
    } catch (error) {
      console.error('Error updating team:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update team')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (teamId: string) => {
    if (!confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      return
    }

    try {
      setErrorMessage(null)

      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId)

      if (error) throw error

      // Remove from local state
      setTeams(teams.filter(team => team.id !== teamId))
      
    } catch (error) {
      console.error('Error deleting team:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete team')
    }
  }

  const closeModal = () => {
    setShowCreateModal(false)
    setEditingTeam(null)
    setFormData({ name: '', description: '', department_id: '', team_lead_id: '' })
    setErrorMessage(null)
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

      {/* Error Display */}
      {errorMessage && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="glass-card p-8 text-center">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
            <span className="text-slate-300">Loading teams...</span>
          </div>
        </div>
      )}

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
                <span className="text-sm text-slate-300">{team.departmentName || 'No department'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Team Lead</span>
                <span className="text-sm text-slate-300">{team.leaderName || 'No lead assigned'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Members</span>
                <span className="text-sm text-slate-300 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {team.memberCount || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Created</span>
                <span className="text-sm text-slate-300">
                  {team.created_at ? new Date(team.created_at).toLocaleDateString() : 'Unknown'}
                </span>
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
                  Department
                </label>
                <select
                  value={formData.department_id}
                  onChange={(e) => setFormData({...formData, department_id: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Cross-Functional Team (No specific department)</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  Leave empty for cross-functional teams that span multiple departments
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Team Lead
                </label>
                <select
                  value={formData.team_lead_id}
                  onChange={(e) => setFormData({...formData, team_lead_id: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select team lead</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.full_name} {user.job_title && `- ${user.job_title}`}
                    </option>
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
                disabled={!formData.name.trim() || saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {editingTeam ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editingTeam ? 'Update Team' : 'Create Team'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}