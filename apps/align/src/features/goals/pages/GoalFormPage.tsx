import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GlassCard, Icon } from '../../shared/components';
import { mockCompanyObjective, mockDepartmentObjectives, mockUsers } from '../../shared/data/mockData';

const GoalFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id !== undefined && id !== 'new';

  const allGoals = [mockCompanyObjective, ...mockDepartmentObjectives];
  const existingGoal = isEdit ? allGoals.find(g => g.id === id) : null;

  const [formData, setFormData] = useState({
    title: existingGoal?.title || '',
    description: existingGoal?.description || '',
    owner: existingGoal?.owner || '',
    dueDate: existingGoal?.dueDate?.toISOString().split('T')[0] || '',
    progress: existingGoal?.progress || 0,
    status: existingGoal?.status || 'on-track',
    parentGoal: existingGoal?.parentGoal || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.owner.trim()) {
      newErrors.owner = 'Owner is required';
    }
    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = 'Progress must be between 0 and 100';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    
    // In a real app, this would make an API call
    console.log('Saving goal:', formData);
    
    // Navigate back to goals list
    navigate('/goals');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const possibleParents = allGoals.filter(g => g.id !== id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          to="/goals"
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <Icon path="M10 19l-7-7m0 0l7-7m-7 7h18" className="w-5 h-5 text-slate-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            {isEdit ? 'Edit Goal' : 'Create New Goal'}
          </h1>
          <p className="text-slate-400 mt-1">
            {isEdit ? 'Update your goal details' : 'Define a new strategic objective'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Details */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-6">Goal Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    errors.title ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="Enter goal title..."
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Describe the goal and its importance..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Owner *
                </label>
                <select
                  name="owner"
                  value={formData.owner}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    errors.owner ? 'border-red-500' : 'border-slate-600'
                  }`}
                >
                  <option value="">Select owner...</option>
                  {mockUsers.map(user => (
                    <option key={user.id} value={user.name}>{user.name}</option>
                  ))}
                </select>
                {errors.owner && (
                  <p className="text-red-400 text-sm mt-1">{errors.owner}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Parent Goal
                </label>
                <select
                  name="parentGoal"
                  value={formData.parentGoal}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">No parent goal</option>
                  {possibleParents.map(goal => (
                    <option key={goal.id} value={goal.id}>{goal.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </GlassCard>

          {/* Progress & Status */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-6">Progress & Timeline</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Progress (0-100) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="progress"
                    value={formData.progress}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      errors.progress ? 'border-red-500' : 'border-slate-600'
                    }`}
                  />
                  <span className="absolute right-3 top-2 text-slate-400">%</span>
                </div>
                {errors.progress && (
                  <p className="text-red-400 text-sm mt-1">{errors.progress}</p>
                )}
                
                {/* Progress Bar Preview */}
                <div className="mt-2">
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, formData.progress))}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="on-track">On Track</option>
                  <option value="at-risk">At Risk</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Link
            to="/goals"
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-lg hover:from-sky-600 hover:to-blue-600 transition-all"
          >
            {isEdit ? 'Update Goal' : 'Create Goal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalFormPage;