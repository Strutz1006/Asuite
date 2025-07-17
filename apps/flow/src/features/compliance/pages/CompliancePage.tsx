import { Shield, AlertTriangle, CheckCircle, Clock, TrendingUp, FileText, Users, Calendar, Play, RefreshCw, Settings } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const complianceFrameworks = [
  {
    id: '1',
    name: 'GDPR',
    description: 'General Data Protection Regulation',
    status: 'compliant',
    score: 94,
    lastAssessment: '2024-07-15',
    requirements: 47,
    completed: 44,
    overdue: 1,
    category: 'Data Privacy',
  },
  {
    id: '2',
    name: 'SOX',
    description: 'Sarbanes-Oxley Act',
    status: 'needs-attention',
    score: 78,
    lastAssessment: '2024-07-10',
    requirements: 32,
    completed: 25,
    overdue: 3,
    category: 'Financial',
  },
  {
    id: '3',
    name: 'ISO 27001',
    description: 'Information Security Management',
    status: 'compliant',
    score: 96,
    lastAssessment: '2024-07-12',
    requirements: 114,
    completed: 109,
    overdue: 0,
    category: 'Security',
  },
  {
    id: '4',
    name: 'HIPAA',
    description: 'Health Insurance Portability',
    status: 'in-progress',
    score: 82,
    lastAssessment: '2024-07-08',
    requirements: 18,
    completed: 15,
    overdue: 1,
    category: 'Healthcare',
  },
]

const complianceAlerts = [
  {
    id: '1',
    title: 'GDPR Data Retention Policy Update Required',
    framework: 'GDPR',
    severity: 'high',
    dueDate: '2024-07-20',
    description: 'Data retention clauses need updating to comply with latest regulations',
    assignedTo: 'Legal Team',
    documents: ['Data Privacy Policy', 'Data Processing Agreement'],
    status: 'open',
  },
  {
    id: '2',
    title: 'SOX Financial Controls Review',
    framework: 'SOX',
    severity: 'medium',
    dueDate: '2024-07-25',
    description: 'Quarterly review of financial controls and reporting procedures',
    assignedTo: 'Finance Team',
    documents: ['Financial Procedures', 'Audit Trail Policy'],
    status: 'in-progress',
  },
  {
    id: '3',
    title: 'ISO 27001 Security Assessment',
    framework: 'ISO 27001',
    severity: 'low',
    dueDate: '2024-08-01',
    description: 'Annual security assessment and certification renewal',
    assignedTo: 'IT Security',
    documents: ['Security Policy', 'Risk Assessment'],
    status: 'scheduled',
  },
]

const complianceMetrics = [
  {
    metric: 'Overall Compliance Score',
    value: 87,
    change: '+5',
    changeType: 'increase',
    target: 95,
  },
  {
    metric: 'Active Frameworks',
    value: 4,
    change: '+1',
    changeType: 'increase',
    target: 6,
  },
  {
    metric: 'Overdue Items',
    value: 5,
    change: '-2',
    changeType: 'decrease',
    target: 0,
  },
  {
    metric: 'Last Assessment',
    value: '3 days ago',
    change: 'On schedule',
    changeType: 'neutral',
    target: 'Weekly',
  },
]

const auditHistory = [
  {
    id: '1',
    framework: 'GDPR',
    date: '2024-07-15',
    auditor: 'External Auditor',
    result: 'Passed',
    score: 94,
    findings: 2,
  },
  {
    id: '2',
    framework: 'ISO 27001',
    date: '2024-07-12',
    auditor: 'Internal Team',
    result: 'Passed',
    score: 96,
    findings: 1,
  },
  {
    id: '3',
    framework: 'SOX',
    date: '2024-07-10',
    auditor: 'External Auditor',
    result: 'Conditional',
    score: 78,
    findings: 5,
  },
]

const statusColors = {
  compliant: 'bg-green-500/20 text-green-400',
  'needs-attention': 'bg-yellow-500/20 text-yellow-400',
  'in-progress': 'bg-blue-500/20 text-blue-400',
  'non-compliant': 'bg-red-500/20 text-red-400',
}

const severityColors = {
  high: 'bg-red-500/20 text-red-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  low: 'bg-green-500/20 text-green-400',
}

export default function CompliancePage() {
  const [selectedFramework, setSelectedFramework] = useState('all')
  const [selectedSeverity, setSelectedSeverity] = useState('all')

  const filteredAlerts = complianceAlerts.filter(alert => {
    const matchesFramework = selectedFramework === 'all' || alert.framework === selectedFramework
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity
    return matchesFramework && matchesSeverity
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Compliance</h1>
          <p className="text-slate-400 mt-1">
            Monitor and manage compliance across frameworks and regulations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="glass-button text-blue-300 hover:text-blue-200 px-4 py-2 flex items-center gap-2">
            <Play className="w-4 h-4" />
            Run Assessment
          </button>
          <button className="glass-button text-green-300 hover:text-green-200 px-4 py-2 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Compliance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {complianceMetrics.map((metric, index) => (
          <div key={index} className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-400">{metric.metric}</h3>
              <Shield className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-100">{metric.value}</span>
              {metric.changeType !== 'neutral' && (
                <span className={`text-sm font-medium ${
                  metric.changeType === 'increase' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.change}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">Target: {metric.target}</p>
          </div>
        ))}
      </div>

      {/* Compliance Frameworks */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">Compliance Frameworks</h2>
          <Link
            to="/compliance/frameworks"
            className="text-green-400 hover:text-green-300 text-sm"
          >
            Manage Frameworks →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complianceFrameworks.map((framework) => (
            <div key={framework.id} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-medium text-slate-100">{framework.name}</h3>
                  <p className="text-sm text-slate-400">{framework.description}</p>
                  <span className="inline-block px-2 py-1 mt-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                    {framework.category}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[framework.status]}`}>
                  {framework.status === 'compliant' ? 'Compliant' : 
                   framework.status === 'needs-attention' ? 'Needs Attention' : 
                   framework.status === 'in-progress' ? 'In Progress' : 'Non-Compliant'}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-400">Compliance Score</span>
                    <span className="text-sm font-medium text-slate-100">{framework.score}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        framework.score >= 90 ? 'bg-green-500' : 
                        framework.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${framework.score}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Requirements</p>
                    <p className="font-medium text-slate-100">{framework.requirements}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Completed</p>
                    <p className="font-medium text-green-400">{framework.completed}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Overdue</p>
                    <p className="font-medium text-red-400">{framework.overdue}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                  <div className="flex items-center gap-1 text-sm text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>Last: {new Date(framework.lastAssessment).toLocaleDateString()}</span>
                  </div>
                  <Link
                    to={`/compliance/frameworks/${framework.id}`}
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

      {/* Compliance Alerts */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Compliance Alerts
          </h2>
          <div className="flex items-center gap-3">
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            >
              <option value="all">All Frameworks</option>
              {complianceFrameworks.map(f => (
                <option key={f.id} value={f.name}>{f.name}</option>
              ))}
            </select>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            >
              <option value="all">All Severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-slate-100">{alert.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityColors[alert.severity]}`}>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </span>
                    <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                      {alert.framework}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{alert.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {new Date(alert.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{alert.assignedTo}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{alert.documents.length} documents</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm hover:bg-green-500/30">
                    Resolve
                  </button>
                  <button className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded text-sm hover:bg-slate-700/70">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit History */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">Recent Audits</h2>
          <Link
            to="/compliance/audits"
            className="text-green-400 hover:text-green-300 text-sm"
          >
            View All Audits →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-3 text-sm font-medium text-slate-400">Framework</th>
                <th className="text-left py-3 text-sm font-medium text-slate-400">Date</th>
                <th className="text-left py-3 text-sm font-medium text-slate-400">Auditor</th>
                <th className="text-left py-3 text-sm font-medium text-slate-400">Result</th>
                <th className="text-left py-3 text-sm font-medium text-slate-400">Score</th>
                <th className="text-left py-3 text-sm font-medium text-slate-400">Findings</th>
              </tr>
            </thead>
            <tbody>
              {auditHistory.map((audit) => (
                <tr key={audit.id} className="border-b border-slate-700/30">
                  <td className="py-3 text-sm text-slate-100">{audit.framework}</td>
                  <td className="py-3 text-sm text-slate-400">{new Date(audit.date).toLocaleDateString()}</td>
                  <td className="py-3 text-sm text-slate-400">{audit.auditor}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      audit.result === 'Passed' ? 'bg-green-500/20 text-green-400' :
                      audit.result === 'Conditional' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {audit.result}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-slate-100">{audit.score}%</td>
                  <td className="py-3 text-sm text-slate-400">{audit.findings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}