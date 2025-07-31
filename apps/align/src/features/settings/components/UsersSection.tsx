import { useState } from 'react'
import { Shield, Plus, Edit, Trash2, Search, Mail, Phone, Calendar, X, UserPlus } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  team: string
  phone: string
  status: 'active' | 'inactive' | 'pending'
  lastLogin: string
  joinedAt: string
  permissions: string[]
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'VP Technology',
    department: 'Technology',
    team: 'Engineering',
    phone: '+1 (555) 123-4567',
    status: 'active',
    lastLogin: '2024-01-25T10:30:00',
    joinedAt: '2023-06-15',
    permissions: ['admin', 'create_goals', 'manage_teams', 'view_analytics']
  },
  {
    id: '2',
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@company.com',
    role: 'Product Marketing Manager',
    department: 'Marketing',
    team: 'Product Marketing',
    phone: '+1 (555) 234-5678',
    status: 'active',
    lastLogin: '2024-01-24T15:45:00',
    joinedAt: '2023-08-20',
    permissions: ['create_goals', 'view_analytics', 'manage_objectives']
  },
  {
    id: '3',
    name: 'Emma Thompson',
    email: 'emma.thompson@company.com',
    role: 'Customer Success Lead',
    department: 'Sales',
    team: 'Customer Success',
    phone: '+1 (555) 345-6789',
    status: 'active',
    lastLogin: '2024-01-25T09:15:00',
    joinedAt: '2023-09-10',
    permissions: ['create_goals', 'view_progress']
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@company.com',
    role: 'Senior Developer',
    department: 'Technology',
    team: 'Engineering',
    phone: '+1 (555) 456-7890',
    status: 'inactive',
    lastLogin: '2024-01-20T14:20:00',
    joinedAt: '2023-07-01',
    permissions: ['create_goals', 'view_progress']
  },
  {
    id: '5',
    name: 'Lisa Wang',
    email: 'lisa.wang@company.com',
    role: 'UX Designer',
    department: 'Technology',
    team: 'Engineering',
    phone: '+1 (555) 567-8901',
    status: 'pending',
    lastLogin: '',
    joinedAt: '2024-01-22',
    permissions: ['view_progress']
  }
]

const roleOptions = [
  'VP Technology',
  'VP Marketing', 
  'VP Sales',
  'VP Operations',
  'Director',
  'Senior Manager',
  'Manager',
  'Senior Developer',
  'Developer',
  'UX Designer',
  'Product Manager',
  'Marketing Specialist',
  'Sales Representative',
  'Customer Success Manager'
]

const departmentOptions = [
  'Technology',
  'Marketing',
  'Sales',
  'Operations'
]

const permissionOptions = [
  { id: 'admin', name: 'Administrator', description: 'Full system access' },
  { id: 'create_goals', name: 'Create Goals', description: 'Create and edit goals' },
  { id: 'manage_teams', name: 'Manage Teams', description: 'Manage team assignments' },
  { id: 'manage_objectives', name: 'Manage Objectives', description: 'Create and edit strategic objectives' },
  { id: 'view_analytics', name: 'View Analytics', description: 'Access analytics and reports' },
  { id: 'view_progress', name: 'View Progress', description: 'View goal progress and updates' }
]

export function UsersSection() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    team: '',
    phone: '',
    permissions: [] as string[]
  })

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleCreate = () => {
    if (formData.name.trim() && formData.email.trim()) {
      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        team: formData.team,
        phone: formData.phone,
        status: 'pending',
        lastLogin: '',
        joinedAt: new Date().toISOString().split('T')[0],
        permissions: formData.permissions
      }
      
      setUsers([...users, newUser])
      setFormData({ name: '', email: '', role: '', department: '', team: '', phone: '', permissions: [] })
      setShowCreateModal(false)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      team: user.team,
      phone: user.phone,
      permissions: user.permissions
    })
    setShowCreateModal(true)
  }

  const handleUpdate = () => {
    if (editingUser && formData.name.trim() && formData.email.trim()) {
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? {
              ...user,
              name: formData.name,
              email: formData.email,
              role: formData.role,
              department: formData.department,
              team: formData.team,
              phone: formData.phone,
              permissions: formData.permissions
            }
          : user
      ))
      
      setFormData({ name: '', email: '', role: '', department: '', team: '', phone: '', permissions: [] })
      setEditingUser(null)
      setShowCreateModal(false)
    }
  }

  const handleDelete = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId))
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
    setFormData({ name: '', email: '', role: '', department: '', team: '', phone: '', permissions: [] })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400'
      case 'inactive': return 'bg-gray-500/20 text-gray-400'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const formatLastLogin = (timestamp: string) => {
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
        <button
          onClick={() => setShowCreateModal(true)}
          className="glass-button bg-purple-500/20 text-purple-300 hover:text-purple-200 px-4 py-2 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

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
                      <div className="text-sm font-medium text-slate-100">{user.name}</div>
                      <div className="text-sm text-slate-400 flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-100">{user.role}</div>
                    <div className="text-sm text-slate-400">{user.department} • {user.team}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-100">{formatLastLogin(user.lastLogin)}</div>
                    <div className="text-sm text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Joined {new Date(user.joinedAt).toLocaleDateString()}
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
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select role</option>
                    {roleOptions.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select department</option>
                    {departmentOptions.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Team
                  </label>
                  <input
                    type="text"
                    value={formData.team}
                    onChange={(e) => setFormData({...formData, team: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Team name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Permissions
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {permissionOptions.map(permission => (
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
                disabled={!formData.name.trim() || !formData.email.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {editingUser ? 'Update User' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}