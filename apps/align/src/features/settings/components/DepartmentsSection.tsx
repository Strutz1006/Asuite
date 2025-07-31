import { useState } from 'react'
import { Building, Plus, Edit, Trash2, Search, Users, X } from 'lucide-react'

interface Department {
  id: string
  name: string
  description: string
  headId: string
  headName: string
  teamCount: number
  memberCount: number
  budget: number
  createdAt: string
}

const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Technology',
    description: 'Software development, infrastructure, and technical operations',
    headId: '1',
    headName: 'Sarah Chen',
    teamCount: 3,
    memberCount: 25,
    budget: 850000,
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    name: 'Marketing',
    description: 'Brand management, digital marketing, and customer acquisition',
    headId: '2',
    headName: 'Mike Rodriguez',
    teamCount: 2,
    memberCount: 12,
    budget: 320000,
    createdAt: '2024-01-12'
  },
  {
    id: '3',
    name: 'Sales',
    description: 'Customer relationships, revenue generation, and business development',
    headId: '3',
    headName: 'Emma Thompson',
    teamCount: 2,
    memberCount: 15,
    budget: 480000,
    createdAt: '2024-01-15'
  },
  {
    id: '4',
    name: 'Operations',
    description: 'Business operations, HR, finance, and administrative functions',
    headId: '4',
    headName: 'David Kim',
    teamCount: 1,
    memberCount: 8,
    budget: 240000,
    createdAt: '2024-01-18'
  }
]

const mockUsers = [
  { id: '1', name: 'Sarah Chen', role: 'VP Technology' },
  { id: '2', name: 'Mike Rodriguez', role: 'VP Marketing' },
  { id: '3', name: 'Emma Thompson', role: 'VP Sales' },
  { id: '4', name: 'David Kim', role: 'VP Operations' },
  { id: '5', name: 'Lisa Wang', role: 'Director' },
  { id: '6', name: 'John Smith', role: 'Senior Manager' }
]

export function DepartmentsSection() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    headId: '',
    budget: ''
  })

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.headName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreate = () => {
    if (formData.name.trim()) {
      const head = mockUsers.find(u => u.id === formData.headId)
      
      const newDepartment: Department = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        headId: formData.headId,
        headName: head?.name || '',
        teamCount: 0,
        memberCount: 0,
        budget: parseFloat(formData.budget) || 0,
        createdAt: new Date().toISOString().split('T')[0]
      }
      
      setDepartments([...departments, newDepartment])
      setFormData({ name: '', description: '', headId: '', budget: '' })
      setShowCreateModal(false)
    }
  }

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setFormData({
      name: department.name,
      description: department.description,
      headId: department.headId,
      budget: department.budget.toString()
    })
    setShowCreateModal(true)
  }

  const handleUpdate = () => {
    if (editingDepartment && formData.name.trim()) {
      const head = mockUsers.find(u => u.id === formData.headId)
      
      setDepartments(departments.map(dept => 
        dept.id === editingDepartment.id 
          ? {
              ...dept,
              name: formData.name,
              description: formData.description,
              headId: formData.headId,
              headName: head?.name || '',
              budget: parseFloat(formData.budget) || 0
            }
          : dept
      ))
      
      setFormData({ name: '', description: '', headId: '', budget: '' })
      setEditingDepartment(null)
      setShowCreateModal(false)
    }
  }

  const handleDelete = (departmentId: string) => {
    if (confirm('Are you sure you want to delete this department? This will affect all associated teams and users.')) {
      setDepartments(departments.filter(dept => dept.id !== departmentId))
    }
  }

  const closeModal = () => {
    setShowCreateModal(false)
    setEditingDepartment(null)
    setFormData({ name: '', description: '', headId: '', budget: '' })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Building className="w-6 h-6 text-green-400" />
            Departments Management
          </h2>
          <p className="text-slate-400 mt-1">Configure organizational structure and departmental hierarchy</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="glass-button bg-green-500/20 text-green-300 hover:text-green-200 px-4 py-2 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Department
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
            placeholder="Search departments..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDepartments.map((department) => (
          <div key={department.id} className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-100">{department.name}</h3>
                <p className="text-sm text-slate-400 mt-1">{department.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(department)}
                  className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(department.id)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <div className="text-2xl font-bold text-slate-100">{department.teamCount}</div>
                <div className="text-sm text-slate-400">Teams</div>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <div className="text-2xl font-bold text-slate-100">{department.memberCount}</div>
                <div className="text-sm text-slate-400">Members</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Department Head</span>
                <span className="text-sm text-slate-300">{department.headName}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Annual Budget</span>
                <span className="text-sm text-slate-300 font-medium">{formatCurrency(department.budget)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Created</span>
                <span className="text-sm text-slate-300">{new Date(department.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/50 flex gap-2">
              <button className="flex-1 text-sm text-green-400 hover:text-green-300 flex items-center justify-center gap-2 py-2">
                <Users className="w-4 h-4" />
                View Teams
              </button>
              <button className="flex-1 text-sm text-slate-400 hover:text-slate-300 flex items-center justify-center gap-2 py-2">
                <Building className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDepartments.length === 0 && (
        <div className="glass-card p-8 text-center">
          <Building className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">No departments found</h3>
          <p className="text-slate-400 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first department to establish organizational structure'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="glass-button bg-green-500/20 text-green-300 hover:text-green-200 px-4 py-2 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Create Department
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
                  {editingDepartment ? 'Edit Department' : 'Create New Department'}
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
                  Department Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter department name"
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
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  placeholder="Describe the department's role and responsibilities"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Department Head *
                </label>
                <select
                  value={formData.headId}
                  onChange={(e) => setFormData({...formData, headId: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select department head</option>
                  {mockUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.name} - {user.role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Annual Budget ($)
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="0"
                  min="0"
                />
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
                onClick={editingDepartment ? handleUpdate : handleCreate}
                disabled={!formData.name.trim() || !formData.headId}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {editingDepartment ? 'Update Department' : 'Create Department'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}