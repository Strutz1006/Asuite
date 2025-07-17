import { Workflow, FileText, Shield, CheckCircle, Plus, ArrowRight, AlertTriangle, Clock, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

const stats = [
  {
    name: 'Active Documents',
    value: '156',
    change: '+12',
    changeType: 'increase',
    icon: FileText,
  },
  {
    name: 'Compliance Score',
    value: '94%',
    change: '+8%',
    changeType: 'increase',
    icon: Shield,
  },
  {
    name: 'Process Health',
    value: '87%',
    change: '+5%',
    changeType: 'increase',
    icon: CheckCircle,
  },
  {
    name: 'Efficiency Gain',
    value: '23%',
    change: '+15%',
    changeType: 'increase',
    icon: TrendingUp,
  },
]

const recentDocuments = [
  {
    id: '1',
    title: 'Customer Onboarding Process',
    type: 'SOP',
    status: 'validated',
    lastReviewed: '2024-07-15',
    complianceScore: 96,
    issues: 0,
    department: 'Sales',
  },
  {
    id: '2',
    title: 'Data Privacy Policy',
    type: 'Policy',
    status: 'needs-review',
    lastReviewed: '2024-07-10',
    complianceScore: 78,
    issues: 3,
    department: 'Legal',
  },
  {
    id: '3',
    title: 'Software Development Lifecycle',
    type: 'Process',
    status: 'validated',
    lastReviewed: '2024-07-17',
    complianceScore: 92,
    issues: 1,
    department: 'Engineering',
  },
]

const complianceAlerts = [
  {
    id: '1',
    title: 'GDPR Compliance Gap Detected',
    document: 'Data Privacy Policy',
    severity: 'high',
    description: 'Missing data retention clauses in privacy policy',
    dueDate: '2024-07-20',
    assigned: 'Legal Team',
  },
  {
    id: '2',
    title: 'Process Efficiency Below Threshold',
    document: 'Invoice Processing Workflow',
    severity: 'medium',
    description: 'Current process taking 40% longer than benchmark',
    dueDate: '2024-07-25',
    assigned: 'Finance Team',
  },
  {
    id: '3',
    title: 'Documentation Update Required',
    document: 'Employee Handbook',
    severity: 'low',
    description: 'Annual review cycle due for completion',
    dueDate: '2024-08-01',
    assigned: 'HR Team',
  },
]

const processMetrics = [
  {
    name: 'Customer Onboarding',
    efficiency: 94,
    compliance: 96,
    lastUpdated: '2024-07-15',
    trend: 'up',
  },
  {
    name: 'Invoice Processing',
    efficiency: 67,
    compliance: 89,
    lastUpdated: '2024-07-14',
    trend: 'down',
  },
  {
    name: 'Employee Onboarding',
    efficiency: 88,
    compliance: 94,
    lastUpdated: '2024-07-16',
    trend: 'up',
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Validate processes, ensure compliance, and optimize workflows
          </p>
        </div>
        <Link
          to="/documents/new"
          className="glass-button text-green-300 hover:text-green-200 px-4 py-2 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Document
        </Link>
      </div>

      {/* Company Message/Slogan */}
      <div className="glass-card p-6 text-center">
        <h2 className="text-xl font-semibold text-slate-100 mb-2">
          Validate Processes, Ensure Compliance, Drive Excellence
        </h2>
        <p className="text-slate-400">
          Transform your operational documentation into validated, compliant, and efficient workflows
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{stat.name}</p>
                  <p className="text-2xl font-semibold text-slate-100 mt-1">{stat.value}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/20">
                  <Icon className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-green-400 font-medium">{stat.change}</span>
                <span className="text-sm text-slate-400 ml-1">from last month</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Documents */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">Recent Documents</h2>
          <Link
            to="/documents"
            className="text-green-400 hover:text-green-300 flex items-center gap-1 text-sm"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {recentDocuments.map((doc) => (
            <div key={doc.id} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Link
                    to={`/documents/${doc.id}`}
                    className="text-slate-100 hover:text-green-300 font-medium"
                  >
                    {doc.title}
                  </Link>
                  <span className="text-sm text-slate-400">({doc.type})</span>
                  <span className="text-sm text-slate-400">• {doc.department}</span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    doc.status === 'validated'
                      ? 'bg-green-500/20 text-green-400'
                      : doc.status === 'needs-review'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {doc.status === 'validated' ? 'Validated' : doc.status === 'needs-review' ? 'Needs Review' : 'Issues Found'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-400">Compliance Score</span>
                    <span className="text-sm text-slate-300">{doc.complianceScore}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        doc.complianceScore >= 90 ? 'bg-green-500' : 
                        doc.complianceScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${doc.complianceScore}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-400">Issues</p>
                    <p className="text-sm font-medium text-slate-100">{doc.issues}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-400">Last Reviewed</p>
                    <p className="text-sm font-medium text-slate-100">{new Date(doc.lastReviewed).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Link
                    to={`/documents/${doc.id}`}
                    className="text-green-400 hover:text-green-300 text-sm"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Process Health Overview */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">Process Health Overview</h2>
          <Link
            to="/analytics"
            className="text-green-400 hover:text-green-300 flex items-center gap-1 text-sm"
          >
            View Analytics
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {processMetrics.map((process, index) => (
            <div key={index} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-slate-100 font-medium">{process.name}</h3>
                  <TrendingUp className={`w-4 h-4 ${
                    process.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`} />
                </div>
                <span className="text-sm text-slate-400">
                  Updated {new Date(process.lastUpdated).toLocaleDateString()}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Efficiency</span>
                    <span className="text-sm text-slate-300">{process.efficiency}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        process.efficiency >= 80 ? 'bg-green-500' : 
                        process.efficiency >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${process.efficiency}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Compliance</span>
                    <span className="text-sm text-slate-300">{process.compliance}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        process.compliance >= 90 ? 'bg-green-500' : 
                        process.compliance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${process.compliance}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Alerts */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Compliance Alerts
          </h2>
          <Link
            to="/compliance"
            className="text-green-400 hover:text-green-300 flex items-center gap-1 text-sm"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {complianceAlerts.map((alert) => (
            <div key={alert.id} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-slate-100 font-medium">{alert.title}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.severity === 'high'
                          ? 'bg-red-500/20 text-red-400'
                          : alert.severity === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}
                    >
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-2">{alert.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>Document: <span className="text-green-400">{alert.document}</span></span>
                    <span>Due: {new Date(alert.dueDate).toLocaleDateString()}</span>
                    <span>Assigned: {alert.assigned}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/documents/new" className="glass-card p-6 hover:bg-slate-800/40 transition-colors">
          <FileText className="w-8 h-8 text-green-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Upload Document</h3>
          <p className="text-slate-400 text-sm">Upload and validate a new process document</p>
        </Link>
        
        <Link to="/compliance" className="glass-card p-6 hover:bg-slate-800/40 transition-colors">
          <Shield className="w-8 h-8 text-blue-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Compliance Check</h3>
          <p className="text-slate-400 text-sm">Run compliance validation on existing processes</p>
        </Link>
        
        <Link to="/analytics" className="glass-card p-6 hover:bg-slate-800/40 transition-colors">
          <TrendingUp className="w-8 h-8 text-purple-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Process Analytics</h3>
          <p className="text-slate-400 text-sm">Analyze process efficiency and optimization opportunities</p>
        </Link>
      </div>
    </div>
  )
}