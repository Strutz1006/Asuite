import { FileText, Upload, Search, Filter, Download, Eye, Edit, Trash2, CheckCircle, AlertTriangle, Clock, Users } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const documents = [
  {
    id: '1',
    title: 'Customer Onboarding Process',
    type: 'SOP',
    category: 'Customer Success',
    status: 'validated',
    version: '2.1',
    lastModified: '2024-07-15',
    author: 'Sarah Johnson',
    size: '2.4 MB',
    complianceScore: 96,
    downloadCount: 147,
    department: 'Sales',
    tags: ['onboarding', 'customer', 'process'],
    description: 'Comprehensive guide for customer onboarding process including validation steps and compliance requirements.',
  },
  {
    id: '2',
    title: 'Data Privacy Policy',
    type: 'Policy',
    category: 'Legal',
    status: 'needs-review',
    version: '1.3',
    lastModified: '2024-07-10',
    author: 'Michael Chen',
    size: '1.8 MB',
    complianceScore: 78,
    downloadCount: 89,
    department: 'Legal',
    tags: ['privacy', 'gdpr', 'compliance'],
    description: 'Data privacy policy covering GDPR compliance and data handling procedures.',
  },
  {
    id: '3',
    title: 'Software Development Lifecycle',
    type: 'Process',
    category: 'Engineering',
    status: 'validated',
    version: '3.0',
    lastModified: '2024-07-17',
    author: 'Alex Rodriguez',
    size: '5.2 MB',
    complianceScore: 92,
    downloadCount: 203,
    department: 'Engineering',
    tags: ['development', 'lifecycle', 'process'],
    description: 'Complete software development lifecycle documentation including coding standards and review processes.',
  },
  {
    id: '4',
    title: 'Employee Handbook',
    type: 'Handbook',
    category: 'Human Resources',
    status: 'draft',
    version: '1.0',
    lastModified: '2024-07-12',
    author: 'Jennifer Williams',
    size: '3.1 MB',
    complianceScore: 85,
    downloadCount: 45,
    department: 'HR',
    tags: ['handbook', 'policies', 'hr'],
    description: 'Employee handbook containing company policies, procedures, and guidelines.',
  },
  {
    id: '5',
    title: 'Invoice Processing Workflow',
    type: 'Workflow',
    category: 'Finance',
    status: 'needs-review',
    version: '1.2',
    lastModified: '2024-07-14',
    author: 'Robert Davis',
    size: '1.5 MB',
    complianceScore: 67,
    downloadCount: 78,
    department: 'Finance',
    tags: ['invoice', 'finance', 'workflow'],
    description: 'Automated invoice processing workflow with approval stages and compliance checks.',
  },
]

const statusColors = {
  validated: 'bg-green-500/20 text-green-400',
  'needs-review': 'bg-yellow-500/20 text-yellow-400',
  draft: 'bg-blue-500/20 text-blue-400',
  archived: 'bg-gray-500/20 text-gray-400',
}

const typeColors = {
  SOP: 'bg-purple-500/20 text-purple-400',
  Policy: 'bg-red-500/20 text-red-400',
  Process: 'bg-green-500/20 text-green-400',
  Handbook: 'bg-blue-500/20 text-blue-400',
  Workflow: 'bg-orange-500/20 text-orange-400',
}

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus
    const matchesType = selectedType === 'all' || doc.type === selectedType
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Documents</h1>
          <p className="text-slate-400 mt-1">
            Manage and validate your process documentation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/documents/new"
            className="glass-button text-green-300 hover:text-green-200 px-4 py-2 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            >
              <option value="all">All Status</option>
              <option value="validated">Validated</option>
              <option value="needs-review">Needs Review</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500/50"
          >
            <option value="all">All Types</option>
            <option value="SOP">SOP</option>
            <option value="Policy">Policy</option>
            <option value="Process">Process</option>
            <option value="Handbook">Handbook</option>
            <option value="Workflow">Workflow</option>
          </select>
        </div>
      </div>

      {/* Document Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Documents</p>
              <p className="text-2xl font-bold text-slate-100">{documents.length}</p>
            </div>
            <FileText className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Validated</p>
              <p className="text-2xl font-bold text-green-400">
                {documents.filter(d => d.status === 'validated').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Needs Review</p>
              <p className="text-2xl font-bold text-yellow-400">
                {documents.filter(d => d.status === 'needs-review').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Draft</p>
              <p className="text-2xl font-bold text-blue-400">
                {documents.filter(d => d.status === 'draft').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">
            Documents ({filteredDocuments.length})
          </h2>
        </div>

        <div className="space-y-4">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="glass-card p-4 bg-slate-800/40 hover:bg-slate-800/60 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      to={`/documents/${doc.id}`}
                      className="text-lg font-medium text-slate-100 hover:text-green-300"
                    >
                      {doc.title}
                    </Link>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[doc.type] || 'bg-gray-500/20 text-gray-400'}`}>
                      {doc.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[doc.status] || 'bg-gray-500/20 text-gray-400'}`}>
                      {doc.status === 'validated' ? 'Validated' : 
                       doc.status === 'needs-review' ? 'Needs Review' : 
                       doc.status === 'draft' ? 'Draft' : 'Archived'}
                    </span>
                  </div>
                  
                  <p className="text-slate-400 text-sm mb-3">{doc.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{doc.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(doc.lastModified).toLocaleDateString()}</span>
                    </div>
                    <span>v{doc.version}</span>
                    <span>{doc.size}</span>
                    <span>{doc.downloadCount} downloads</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    {doc.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-sm text-slate-400">Compliance Score</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-700/50 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            doc.complianceScore >= 90 ? 'bg-green-500' : 
                            doc.complianceScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${doc.complianceScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-100">{doc.complianceScore}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-green-300 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-blue-300 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-yellow-300 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-300 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}