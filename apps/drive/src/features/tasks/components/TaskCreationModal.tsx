import { useState, useEffect } from 'react'
import { X, Save, Loader2, Calendar, User, Target } from 'lucide-react'
import { Task } from '../hooks/useTasks'
import { supabase } from '@aesyros/supabase'
import { CrossAppGoalSelector } from '@aesyros/shared-state'

interface TaskCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (taskData: Partial<Task>) => Promise<Task>
}

export function TaskCreationModal({ isOpen, onClose, onSubmit }: TaskCreationModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<Task['status']>('todo')
  const [priority, setPriority] = useState<Task['priority']>('medium')
  const [assigneeId, setAssigneeId] = useState('')
  const [projectId, setProjectId] = useState('')
  const [alignGoalId, setAlignGoalId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [estimatedHours, setEstimatedHours] = useState('')
  const [tags, setTags] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([])

  // Fetch reference data
  useEffect(() => {
    if (isOpen) {
      fetchReferenceData()
    }
  }, [isOpen])

  const fetchReferenceData = async () => {
    try {
      // Fetch users
      const { data: usersData } = await supabase
        .from('users')
        .select('id, full_name')
        .order('full_name')

      // Fetch projects
      const { data: projectsData } = await supabase
        .from('drive_projects')
        .select('id, name')
        .order('name')

      // Fetch goals
      const { data: goalsData } = await supabase
        .from('align_objectives')
        .select('id, title')
        .order('title')

      setUsers(usersData || [])
      setProjects(projectsData || [])
      setGoals(goalsData || [])
    } catch (error) {
      console.error('Error fetching reference data:', error)
    }
  }

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('')
      setDescription('')
      setStatus('todo')
      setPriority('medium')
      setAssigneeId('')
      setProjectId('')
      setAlignGoalId('')
      setDueDate('')
      setEstimatedHours('')
      setTags('')
      setSubmitting(false)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      setSubmitting(true)

      const taskData: Partial<Task> = {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        assignee_id: assigneeId || undefined,
        project_id: projectId || undefined,
        align_goal_id: alignGoalId || undefined,
        due_date: dueDate || undefined,
        estimated_hours: estimatedHours ? parseFloat(estimatedHours) : undefined,
        tags: tags.trim() ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
      }

      await onSubmit(taskData)
      onClose()
    } catch (error) {
      console.error('Error creating task:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-600">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-100">Create New Task</h2>
              <p className="text-slate-400 text-sm mt-1">
                Add a new task to your project workflow
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={submitting}
              className="glass-button text-slate-400 hover:text-slate-300 p-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Task Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title..."
                className="w-full px-3 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                required
                disabled={submitting}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the task..."
                rows={3}
                className="w-full px-3 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                disabled={submitting}
              />
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Task['status'])}
                  className="w-full px-3 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  disabled={submitting}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Task['priority'])}
                  className="w-full px-3 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  disabled={submitting}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Assignee and Project */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Assignee
                </label>
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full px-3 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  disabled={submitting}
                >
                  <option value="">Select assignee...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Project
                </label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-3 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  disabled={submitting}
                >
                  <option value="">Select project...</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Goal Alignment and Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Aligned Goal
                </label>
                <CrossAppGoalSelector
                  selectedGoalId={alignGoalId}
                  onSelect={(goal) => setAlignGoalId(goal?.id || '')}
                  placeholder="Align with strategic goal..."
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Estimated Hours and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                  placeholder="8"
                  min="0"
                  step="0.5"
                  className="w-full px-3 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="frontend, api, urgent"
                  className="w-full px-3 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  disabled={submitting}
                />
                <p className="text-xs text-slate-400">Comma-separated tags</p>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="glass-button text-slate-300 hover:text-slate-200 px-4 py-2 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || submitting}
                className="glass-button text-orange-300 hover:text-orange-200 px-4 py-2 flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Task
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}