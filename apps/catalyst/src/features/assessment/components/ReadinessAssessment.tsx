import React, { useState } from 'react'
import { Users, TrendingUp, AlertTriangle, CheckCircle, Target, BarChart3, Clock, MessageSquare, Plus, Edit, Eye } from 'lucide-react'

interface AssessmentQuestion {
  id: string
  category: string
  question: string
  type: 'scale' | 'yes_no' | 'multiple_choice'
  options?: string[]
  weight: number
}

interface Assessment {
  id: string
  name: string
  description: string
  targetGroup: string
  status: 'draft' | 'active' | 'completed'
  responses: number
  totalInvited: number
  averageScore: number
  completionRate: number
  createdAt: string
  dueDate: string
}

interface ReadinessAssessmentProps {
  onCreateAssessment: () => void
  onEditAssessment: (assessment: Assessment) => void
  onViewResults: (assessment: Assessment) => void
}

const mockAssessments: Assessment[] = [
  {
    id: '1',
    name: 'Digital Transformation Readiness',
    description: 'Assess organizational readiness for digital transformation initiative',
    targetGroup: 'All Employees',
    status: 'active',
    responses: 127,
    totalInvited: 150,
    averageScore: 72,
    completionRate: 85,
    createdAt: '2024-01-15',
    dueDate: '2024-01-30'
  },
  {
    id: '2',
    name: 'New CRM System Adoption',
    description: 'Evaluate readiness for CRM system implementation',
    targetGroup: 'Sales & Support Teams',
    status: 'active',
    responses: 34,
    totalInvited: 45,
    averageScore: 68,
    completionRate: 76,
    createdAt: '2024-01-18',
    dueDate: '2024-02-01'
  },
  {
    id: '3',
    name: 'Remote Work Policy Assessment',
    description: 'Assess readiness for new remote work policies',
    targetGroup: 'Management',
    status: 'completed',
    responses: 25,
    totalInvited: 25,
    averageScore: 84,
    completionRate: 100,
    createdAt: '2024-01-10',
    dueDate: '2024-01-25'
  },
  {
    id: '4',
    name: 'Agile Methodology Readiness',
    description: 'Evaluate team readiness for agile transformation',
    targetGroup: 'Engineering Teams',
    status: 'draft',
    responses: 0,
    totalInvited: 0,
    averageScore: 0,
    completionRate: 0,
    createdAt: '2024-01-20',
    dueDate: '2024-02-15'
  }
]

const readinessCategories = [
  {
    name: 'Organizational Culture',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: 'Culture alignment and openness to change'
  },
  {
    name: 'Leadership Support',
    icon: Target,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: 'Leadership commitment and vision clarity'
  },
  {
    name: 'Resource Availability',
    icon: BarChart3,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    description: 'Time, budget, and skill availability'
  },
  {
    name: 'Technical Capability',
    icon: TrendingUp,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    description: 'Technical skills and infrastructure readiness'
  },
  {
    name: 'Communication Effectiveness',
    icon: MessageSquare,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    description: 'Communication channels and change messaging'
  }
]

const statusConfig = {
  draft: { color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'Draft' },
  active: { color: 'text-green-600', bgColor: 'bg-green-100', label: 'Active' },
  completed: { color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Completed' }
}

export function ReadinessAssessment({ onCreateAssessment, onEditAssessment, onViewResults }: ReadinessAssessmentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterGroup, setFilterGroup] = useState('all')

  const filteredAssessments = mockAssessments.filter(assessment => {
    const matchesSearch = assessment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assessment.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || assessment.status === filterStatus
    const matchesGroup = filterGroup === 'all' || assessment.targetGroup.includes(filterGroup)
    
    return matchesSearch && matchesStatus && matchesGroup
  })

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getReadinessLevel = (score: number) => {
    if (score >= 80) return 'High Readiness'
    if (score >= 60) return 'Medium Readiness'
    return 'Low Readiness'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Change Readiness Assessment</h2>
          <p className="text-slate-600 mt-1">Evaluate organizational readiness for change initiatives</p>
        </div>
        <button
          onClick={onCreateAssessment}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Assessment</span>
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Assessments</p>
              <p className="text-2xl font-bold text-slate-900">{mockAssessments.length}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Active Assessments</p>
              <p className="text-2xl font-bold text-green-600">
                {mockAssessments.filter(a => a.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Responses</p>
              <p className="text-2xl font-bold text-blue-600">
                {mockAssessments.reduce((sum, a) => sum + a.responses, 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Avg. Completion</p>
              <p className="text-2xl font-bold text-slate-900">
                {Math.round(mockAssessments.reduce((sum, a) => sum + a.completionRate, 0) / mockAssessments.length)}%
              </p>
            </div>
            <Target className="h-8 w-8 text-slate-500" />
          </div>
        </div>
      </div>

      {/* Readiness Categories Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Assessment Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {readinessCategories.map(category => {
            const Icon = category.icon
            return (
              <div key={category.name} className="text-center p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
                <div className={`inline-flex p-3 rounded-lg ${category.bgColor} mb-3`}>
                  <Icon className={`h-6 w-6 ${category.color}`} />
                </div>
                <h4 className="font-medium text-slate-900 mb-2">{category.name}</h4>
                <p className="text-sm text-slate-600">{category.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assessments..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-slate-700">Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-slate-700">Target Group:</label>
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Groups</option>
            <option value="All Employees">All Employees</option>
            <option value="Management">Management</option>
            <option value="Sales">Sales Teams</option>
            <option value="Engineering">Engineering Teams</option>
          </select>
        </div>
      </div>

      {/* Assessments List */}
      <div className="space-y-4">
        {filteredAssessments.map(assessment => {
          const status = statusConfig[assessment.status]
          const scoreColor = getScoreColor(assessment.averageScore)
          const scoreBgColor = getScoreBgColor(assessment.averageScore)
          
          return (
            <div key={assessment.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{assessment.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                      {status.label}
                    </span>
                    {assessment.status !== 'draft' && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${scoreBgColor} ${scoreColor}`}>
                        {getReadinessLevel(assessment.averageScore)}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 mb-3">{assessment.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{assessment.targetGroup}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Due: {new Date(assessment.dueDate).toLocaleDateString()}</span>
                    </div>
                    {assessment.status !== 'draft' && (
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="h-4 w-4" />
                        <span>{assessment.responses}/{assessment.totalInvited} responses</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEditAssessment(assessment)}
                    className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit Assessment"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  {assessment.status !== 'draft' && (
                    <button
                      onClick={() => onViewResults(assessment)}
                      className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-lg transition-colors"
                      title="View Results"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {assessment.status !== 'draft' && (
                <>
                  {/* Progress and Score */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-600">Completion Rate</span>
                        <span className="text-sm font-medium text-slate-900">{assessment.completionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${assessment.completionRate}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-600">Average Score</span>
                        <span className={`text-sm font-medium ${scoreColor}`}>{assessment.averageScore}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            assessment.averageScore >= 80 ? 'bg-green-500' :
                            assessment.averageScore >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${assessment.averageScore}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-slate-900">{assessment.responses}</p>
                        <p className="text-sm text-slate-600">Total Responses</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Insights */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {assessment.averageScore >= 80 ? (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">High readiness - Ready to proceed</span>
                          </div>
                        ) : assessment.averageScore >= 60 ? (
                          <div className="flex items-center space-x-2 text-yellow-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm font-medium">Medium readiness - Address concerns</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-red-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm font-medium">Low readiness - Significant preparation needed</span>
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => onViewResults(assessment)}
                        className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center space-x-1"
                      >
                        <span>View Full Results</span>
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredAssessments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || filterStatus !== 'all' || filterGroup !== 'all'
              ? 'Try adjusting your filters to see more assessments.'
              : 'Create your first readiness assessment to evaluate change readiness.'
            }
          </p>
          <button
            onClick={onCreateAssessment}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Your First Assessment
          </button>
        </div>
      )}
    </div>
  )
}