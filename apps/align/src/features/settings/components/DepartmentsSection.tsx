import { useState, useEffect } from 'react'
import { Building, Plus, Edit, Trash2, Search, Users, X, Loader2, AlertCircle } from 'lucide-react'
import { useSetupStatus } from '@/hooks/useSetupStatus'
import { supabase } from '@aesyros/supabase'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Department {
  id: string
  name: string
  description: string | null
  head_id: string | null
  budget: number | null
  organization_id: string | null
  created_at: string | null
  updated_at: string | null
  // Computed fields
  teamCount?: number
  memberCount?: number
  headName?: string
}

interface User {
  id: string
  full_name: string | null
  email: string
  job_title: string | null
}


export function DepartmentsSection() {
  const { organization } = useSetupStatus()
  const [departments, setDepartments] = useState<Department[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    head_id: '',
    budget: ''
  })

  // Fetch departments and users data
  useEffect(() => {
    if (organization?.id) {
      fetchData()
    }
  }, [organization])

  const fetchData = async () => {
    try {
      setLoading(true)
      setErrorMessage(null)

      // Fetch departments with computed team and member counts
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('departments')
        .select(`
          *,
          teams(id),
          users(id)
        `)
        .eq('organization_id', organization?.id)
        .order('name')

      if (departmentsError) throw departmentsError

      // Fetch users for department head selection
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, full_name, email, job_title')
        .eq('organization_id', organization?.id)
        .order('full_name')

      if (usersError) throw usersError

      // Process departments data with computed fields
      const processedDepartments = (departmentsData || []).map(dept => ({
        ...dept,
        teamCount: dept.teams?.length || 0,
        memberCount: dept.users?.length || 0,
        headName: usersData?.find(u => u.id === dept.head_id)?.full_name || ''
      }))

      setDepartments(processedDepartments)
      setUsers(usersData || [])

    } catch (error) {
      console.error('Error fetching departments data:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load departments data')
    } finally {
      setLoading(false)
    }
  }

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dept.description?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (dept.headName?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleCreate = async () => {
    if (!formData.name.trim() || !organization?.id) {
      setErrorMessage('Please fill in required fields')
      return
    }

    try {
      setSaving(true)
      setErrorMessage(null)

      const { data, error } = await supabase
        .from('departments')
        .insert({
          name: formData.name,
          description: formData.description || null,
          head_id: formData.head_id || null,
          budget: formData.budget ? parseFloat(formData.budget) : null,
          organization_id: organization.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('*')
        .single()

      if (error) throw error

      // Add computed fields and add to local state
      if (data) {
        const headUser = users.find(u => u.id === data.head_id)
        const newDepartment = {
          ...data,
          teamCount: 0,
          memberCount: 0,
          headName: headUser?.full_name || ''
        }
        setDepartments([...departments, newDepartment])
      }
      
      setFormData({ name: '', description: '', head_id: '', budget: '' })
      setShowCreateModal(false)
      
    } catch (error) {
      console.error('Error creating department:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create department')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setFormData({
      name: department.name,
      description: department.description || '',
      head_id: department.head_id || '',
      budget: department.budget?.toString() || ''
    })
    setShowCreateModal(true)
  }

  const handleUpdate = async () => {
    if (!editingDepartment || !formData.name.trim()) {
      setErrorMessage('Please fill in required fields')
      return
    }

    try {
      setSaving(true)
      setErrorMessage(null)

      const { data, error } = await supabase
        .from('departments')
        .update({
          name: formData.name,
          description: formData.description || null,
          head_id: formData.head_id || null,
          budget: formData.budget ? parseFloat(formData.budget) : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingDepartment.id)
        .select('*')
        .single()

      if (error) throw error

      // Update local state with computed fields
      if (data) {
        const headUser = users.find(u => u.id === data.head_id)
        const updatedDepartment = {
          ...data,
          teamCount: editingDepartment.teamCount || 0,
          memberCount: editingDepartment.memberCount || 0,
          headName: headUser?.full_name || ''
        }
        
        setDepartments(departments.map(dept => 
          dept.id === editingDepartment.id ? updatedDepartment : dept
        ))
      }
      
      setFormData({ name: '', description: '', head_id: '', budget: '' })
      setEditingDepartment(null)
      setShowCreateModal(false)
      
    } catch (error) {
      console.error('Error updating department:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update department')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (departmentId: string) => {
    if (!confirm('Are you sure you want to delete this department? This will affect all associated teams and users.')) {
      return
    }

    try {
      setErrorMessage(null)

      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', departmentId)

      if (error) throw error

      // Remove from local state
      setDepartments(departments.filter(dept => dept.id !== departmentId))
      
    } catch (error) {
      console.error('Error deleting department:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete department')
    }
  }

  const closeModal = () => {
    setShowCreateModal(false)
    setEditingDepartment(null)
    setFormData({ name: '', description: '', head_id: '', budget: '' })
    setErrorMessage(null)
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
            <Loader2 className="w-6 h-6 text-green-400 animate-spin" />
            <span className="text-slate-300">Loading departments...</span>
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
                <div className="text-2xl font-bold text-slate-100">{department.teamCount || 0}</div>
                <div className="text-sm text-slate-400">Teams</div>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <div className="text-2xl font-bold text-slate-100">{department.memberCount || 0}</div>
                <div className="text-sm text-slate-400">Members</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Department Head</span>
                <span className="text-sm text-slate-300">{department.headName || 'No head assigned'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Annual Budget</span>
                <span className="text-sm text-slate-300 font-medium">
                  {department.budget ? formatCurrency(department.budget) : 'Not set'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Created</span>
                <span className="text-sm text-slate-300">
                  {department.created_at ? new Date(department.created_at).toLocaleDateString() : 'Unknown'}
                </span>
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
                  value={formData.head_id}
                  onChange={(e) => setFormData({...formData, head_id: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select department head</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.full_name} {user.job_title && `- ${user.job_title}`}
                    </option>
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
                disabled={!formData.name.trim() || saving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {editingDepartment ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editingDepartment ? 'Update Department' : 'Create Department'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}