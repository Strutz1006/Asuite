import { useState, useEffect } from 'react'
import { Shield, Plus, Edit, Trash2, Search, Mail, Calendar, X, Loader2, AlertCircle, Lock } from 'lucide-react'
import { useSetupStatus } from '@/hooks/useSetupStatus'
import { supabase, useLicenseValidation } from '@aesyros/supabase'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  job_title: string | null
  role: string | null
  department_id: string | null
  team_id: string | null
  organization_id: string | null
  permissions: any
  preferences: any
  last_active_at: string | null
  created_at: string | null
  updated_at: string | null
  // Joined data
  department?: { id: string; name: string } | null
  team?: { id: string; name: string } | null
}

const defaultPermissionOptions = [
  { id: 'admin', name: 'Administrator', description: 'Full system access' },
  { id: 'create_goals', name: 'Create Goals', description: 'Create and edit goals' },
  { id: 'manage_teams', name: 'Manage Teams', description: 'Manage team assignments' },
  { id: 'manage_objectives', name: 'Manage Objectives', description: 'Create and edit strategic objectives' },
  { id: 'view_analytics', name: 'View Analytics', description: 'Access analytics and reports' },
  { id: 'view_progress', name: 'View Progress', description: 'View goal progress and updates' }
]

export function UsersSection() {
  const { organization } = useSetupStatus()
  const { validateUserCreation, usage, getLicenseStatus, loading: licenseLoading } = useLicenseValidation(organization?.id || null)
  const [users, setUsers] = useState<User[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    job_title: '',
    role: '',
    department_id: '',
    team_id: '',
    permissions: [] as string[]
  })

  // Fetch users, departments, and teams data
  useEffect(() => {
    if (organization?.id) {
      fetchData()
    }
  }, [organization])

  const fetchData = async () => {
    try {
      setLoading(true)
      setErrorMessage(null)

      // Fetch users with their department and team information
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select(`
          *,
          department:departments(id, name),
          team:teams(id, name)
        `)
        .eq('organization_id', organization?.id)
        .order('full_name')

      if (usersError) throw usersError

      // Fetch departments
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('departments')
        .select('*')
        .eq('organization_id', organization?.id)
        .order('name')

      if (departmentsError) throw departmentsError

      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .eq('organization_id', organization?.id)
        .order('name')

      if (teamsError) throw teamsError

      setUsers(usersData || [])
      setDepartments(departmentsData || [])
      setTeams(teamsData || [])

    } catch (error) {
      console.error('Error fetching users data:', error)
      let message = 'Failed to load users data. Please try refreshing the page.'
      if (error instanceof Error) {
        message = error.message
      }
      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = 
      (user.full_name?.toLowerCase().includes(searchLower)) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.job_title?.toLowerCase().includes(searchLower)) ||
      (user.role?.toLowerCase().includes(searchLower)) ||
      (user.department?.name?.toLowerCase().includes(searchLower))
    
    // For now, we'll consider all users as "active" since we don't have a status field in the DB
    const matchesStatus = statusFilter === 'all' || statusFilter === 'active'
    
    return matchesSearch && matchesStatus
  })

  const handleCreate = async () => {
    if (!formData.full_name.trim() || !formData.email.trim() || !organization?.id) {
      setErrorMessage('Please fill in required fields')
      return
    }

    // Validate license before creating user
    const userValidation = validateUserCreation()
    if (!userValidation.canCreate) {
      setErrorMessage(userValidation.reason || 'Cannot create user due to license restrictions')
      return
    }

    try {
      setSaving(true)
      setErrorMessage(null)

      const { data, error } = await supabase
        .from('users')
        .insert({
          full_name: formData.full_name,
          email: formData.email,
          job_title: formData.job_title || null,
          role: formData.role || null,
          department_id: formData.department_id || null,
          team_id: formData.team_id || null,
          organization_id: organization.id,
          permissions: formData.permissions.length > 0 ? formData.permissions : null,
          preferences: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select(`
          *,
          department:departments(id, name),
          team:teams(id, name)
        `)
        .single()

      if (error) throw error

      // Add to local state
      if (data) {
        setUsers([...users, data])
      }
      
      setFormData({ full_name: '', email: '', job_title: '', role: '', department_id: '', team_id: '', permissions: [] })
      setShowCreateModal(false)
      
    } catch (error) {
      console.error('Error creating user:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create user')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      full_name: user.full_name || '',
      email: user.email,
      job_title: user.job_title || '',
      role: user.role || '',
      department_id: user.department_id || '',
      team_id: user.team_id || '',
      permissions: Array.isArray(user.permissions) ? user.permissions : []
    })
    setShowCreateModal(true)
  }

  const handleUpdate = async () => {
    if (!editingUser || !formData.full_name.trim() || !formData.email.trim()) {
      setErrorMessage('Please fill in required fields')
      return
    }

    try {
      setSaving(true)
      setErrorMessage(null)

      const { data, error } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          email: formData.email,
          job_title: formData.job_title || null,
          role: formData.role || null,
          department_id: formData.department_id || null,
          team_id: formData.team_id || null,
          permissions: formData.permissions.length > 0 ? formData.permissions : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUser.id)
        .select(`
          *,
          department:departments(id, name),
          team:teams(id, name)
        `)
        .single()

      if (error) throw error

      // Update local state
      if (data) {
        setUsers(users.map(user => 
          user.id === editingUser.id ? data : user
        ))
      }
      
      setFormData({ full_name: '', email: '', job_title: '', role: '', department_id: '', team_id: '', permissions: [] })
      setEditingUser(null)
      setShowCreateModal(false)
      
    } catch (error) {
      console.error('Error updating user:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      setErrorMessage(null)

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) throw error

      // Remove from local state
      setUsers(users.filter(user => user.id !== userId))
      
    } catch (error) {
      console.error('Error deleting user:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete user')
    }
  }

  const togglePermission = (permission: string) => {
    setFormData({
      ...formData,
      permissions: formData.permissions.includes(permission)
        ? formData.permissions.filter(p => p !== permission)
        : [...formData.permissions, permission]
    })
  }

  const closeModal = () => {
    setShowCreateModal(false)
    setEditingUser(null)
    setFormData({ full_name: '', email: '', job_title: '', role: '', department_id: '', team_id: '', permissions: [] })
    setErrorMessage(null)
  }

  const getStatusColor = (lastActive: string | null) => {
    if (!lastActive) return 'bg-gray-500/20 text-gray-400' // Never logged in
    
    const lastActiveDate = new Date(lastActive)
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff <= 7) return 'bg-green-500/20 text-green-400' // Active
    if (daysDiff <= 30) return 'bg-yellow-500/20 text-yellow-400' // Recently active
    return 'bg-gray-500/20 text-gray-400' // Inactive
  }

  const getStatusText = (lastActive: string | null) => {
    if (!lastActive) return 'Never logged in'
    
    const lastActiveDate = new Date(lastActive)
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff <= 7) return 'Active'
    if (daysDiff <= 30) return 'Recently Active'
    return 'Inactive'
  }

  const formatLastLogin = (timestamp: string | null) => {
    if (!timestamp) return 'Never'
    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-400" />
            Users Management
          </h2>
          <p className="text-slate-400 mt-1">Manage user accounts, roles, and permissions</p>
        </div>
        <div className="flex items-center gap-4">
          {/* License Status */}
          {!licenseLoading && (
            <div className="text-right">
              <div className="text-sm text-slate-300">
                License: <span className={`font-medium ${getLicenseStatus() === 'Active' ? 'text-green-400' : 'text-amber-400'}`}>
                  {getLicenseStatus()}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                {usage.maxUsers ? `${usage.currentUsers}/${usage.maxUsers} users` : `${usage.currentUsers} users`}
                {usage.maxUsers && (
                  <span className={`ml-2 ${usage.usagePercentage > 80 ? 'text-amber-400' : 'text-slate-400'}`}>
                    ({usage.usagePercentage}%)
                  </span>
                )}
              </div>
            </div>
          )}
          <button
            onClick={() => {
              const validation = validateUserCreation()
              if (!validation.canCreate) {
                setErrorMessage(validation.reason || 'Cannot create user')
                return
              }
              setShowCreateModal(true)
            }}
            disabled={!validateUserCreation().canCreate}
            className="glass-button bg-purple-500/20 text-purple-300 hover:text-purple-200 px-4 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!validateUserCreation().canCreate ? <Lock className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            Add User
          </button>
        </div>
      </div>

      {/* License Warning */}
      {!licenseLoading && usage.usagePercentage > 80 && usage.usagePercentage < 100 && (
        <Alert className="border-amber-500/20 bg-amber-500/10">
          <AlertCircle className="h-4 w-4 text-amber-400" />
          <AlertDescription className="text-amber-300">
            You're approaching your user limit ({usage.currentUsers}/{usage.maxUsers}). 
            Consider upgrading your license to add more users.
          </AlertDescription>
        </Alert>
      )}

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
            <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
            <span className="text-slate-300">Loading users...</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role & Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-slate-100">{user.full_name || 'Unnamed User'}</div>
                      <div className="text-sm text-slate-400 flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                      {user.job_title && (
                        <div className="text-sm text-slate-400 mt-1">
                          {user.job_title}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-100">{user.role || 'No role assigned'}</div>
                    <div className="text-sm text-slate-400">
                      {user.department?.name || 'No department'} 
                      {user.team?.name && ` • ${user.team.name}`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.last_active_at)}`}>
                      {getStatusText(user.last_active_at)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-100">{formatLastLogin(user.last_active_at)}</div>
                    <div className="text-sm text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="glass-card p-8 text-center">
          <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">No users found</h3>
          <p className="text-slate-400 mb-4">
            {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Add your first user to get started'}
          </p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-100">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-slate-400 hover:text-slate-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="px-6 py-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="user@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.job_title}
                    onChange={(e) => setFormData({...formData, job_title: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g. Senior Developer, Product Manager"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g. Admin, Manager, Employee"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Department
                  </label>
                  <select
                    value={formData.department_id}
                    onChange={(e) => setFormData({...formData, department_id: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">No department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                  {departments.length === 0 && (
                    <p className="text-xs text-amber-400 mt-1">
                      💡 Create departments first in the Departments tab, then assign users to them
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Team
                  </label>
                  <select
                    value={formData.team_id}
                    onChange={(e) => setFormData({...formData, team_id: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">No team</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                  {teams.length === 0 && (
                    <p className="text-xs text-amber-400 mt-1">
                      💡 Create teams first in the Teams tab, then assign users to them
                    </p>
                  )}
                </div>

              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Permissions
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {defaultPermissionOptions.map(permission => (
                    <div key={permission.id} className="flex items-start">
                      <input
                        type="checkbox"
                        id={permission.id}
                        checked={formData.permissions.includes(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-600 rounded bg-slate-800"
                      />
                      <div className="ml-3">
                        <label htmlFor={permission.id} className="text-sm font-medium text-slate-300 cursor-pointer">
                          {permission.name}
                        </label>
                        <p className="text-xs text-slate-400">{permission.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                onClick={editingUser ? handleUpdate : handleCreate}
                disabled={!formData.full_name.trim() || !formData.email.trim() || saving}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {editingUser ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  editingUser ? 'Update User' : 'Add User'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}