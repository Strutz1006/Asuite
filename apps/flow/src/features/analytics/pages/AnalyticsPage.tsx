import { TrendingUp, BarChart3, PieChart, Activity, Clock, Users, FileText, CheckCircle, AlertTriangle, Download, Calendar } from 'lucide-react'
import { useState } from 'react'

const performanceMetrics = [
  {
    name: 'Process Efficiency',
    value: 87,
    change: '+12%',
    changeType: 'increase',
    target: 95,
    description: 'Average efficiency across all processes',
  },
  {
    name: 'Compliance Rate',
    value: 94,
    change: '+8%',
    changeType: 'increase',
    target: 98,
    description: 'Overall compliance across frameworks',
  },
  {
    name: 'Document Quality',
    value: 91,
    change: '+3%',
    changeType: 'increase',
    target: 95,
    description: 'Average document validation score',
  },
  {
    name: 'Time to Resolution',
    value: 2.4,
    change: '-0.6 days',
    changeType: 'decrease',
    target: 1.5,
    description: 'Average time to resolve issues',
    unit: 'days',
  },
]

const processAnalytics = [
  {
    name: 'Customer Onboarding',
    efficiency: 94,
    compliance: 96,
    documents: 8,
    avgTime: '3.2 days',
    completionRate: 98,
    issues: 2,
    trend: 'up',
  },
  {
    name: 'Invoice Processing',
    efficiency: 67,
    compliance: 89,
    documents: 12,
    avgTime: '5.8 days',
    completionRate: 87,
    issues: 8,
    trend: 'down',
  },
  {
    name: 'Employee Onboarding',
    efficiency: 88,
    compliance: 94,
    documents: 15,
    avgTime: '7.2 days',
    completionRate: 92,
    issues: 4,
    trend: 'up',
  },
  {
    name: 'Data Privacy Review',
    efficiency: 79,
    compliance: 98,
    documents: 6,
    avgTime: '2.1 days',
    completionRate: 95,
    issues: 1,
    trend: 'stable',
  },
]

const complianceBreakdown = [
  { framework: 'GDPR', score: 94, requirements: 47, completed: 44, overdue: 1 },
  { framework: 'SOX', score: 78, requirements: 32, completed: 25, overdue: 3 },
  { framework: 'ISO 27001', score: 96, requirements: 114, completed: 109, overdue: 0 },
  { framework: 'HIPAA', score: 82, requirements: 18, completed: 15, overdue: 1 },
]

const timeSeriesData = [
  { month: 'Jan', efficiency: 78, compliance: 87, documents: 45 },
  { month: 'Feb', efficiency: 81, compliance: 89, documents: 52 },
  { month: 'Mar', efficiency: 79, compliance: 91, documents: 48 },
  { month: 'Apr', efficiency: 84, compliance: 92, documents: 58 },
  { month: 'May', efficiency: 86, compliance: 93, documents: 62 },
  { month: 'Jun', efficiency: 87, compliance: 94, documents: 65 },
]

const issueCategories = [
  { category: 'Documentation', count: 12, percentage: 35, color: 'bg-blue-500' },
  { category: 'Compliance', count: 8, percentage: 24, color: 'bg-red-500' },
  { category: 'Process Flow', count: 7, percentage: 21, color: 'bg-yellow-500' },
  { category: 'Quality', count: 4, percentage: 12, color: 'bg-green-500' },
  { category: 'Other', count: 3, percentage: 8, color: 'bg-gray-500' },
]

export default function AnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6m')
  const [selectedMetric, setSelectedMetric] = useState('efficiency')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Analytics</h1>
          <p className="text-slate-400 mt-1">
            Analyze process performance and compliance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500/50"
          >
            <option value="1m">Last Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
          </select>
          <button className="glass-button text-green-300 hover:text-green-200 px-4 py-2 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-400">{metric.name}</h3>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-slate-100">
                {metric.value}{metric.unit || '%'}
              </span>
              <span className={`text-sm font-medium ${
                metric.changeType === 'increase' ? 'text-green-400' : 
                metric.changeType === 'decrease' ? 'text-red-400' : 'text-slate-400'
              }`}>
                {metric.change}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">{metric.description}</p>
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  metric.value >= metric.target ? 'bg-green-500' : 
                  metric.value >= metric.target * 0.8 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ 
                  width: `${Math.min((metric.value / metric.target) * 100, 100)}%` 
                }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Target: {metric.target}{metric.unit || '%'}</p>
          </div>
        ))}
      </div>

      {/* Performance Chart */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">Performance Trends</h2>
          <div className="flex items-center gap-3">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            >
              <option value="efficiency">Efficiency</option>
              <option value="compliance">Compliance</option>
              <option value="documents">Documents</option>
            </select>
          </div>
        </div>
        
        <div className="h-64 flex items-end justify-between gap-4">
          {timeSeriesData.map((data, index) => {
            const value = data[selectedMetric as keyof typeof data] as number
            const maxValue = Math.max(...timeSeriesData.map(d => d[selectedMetric as keyof typeof d] as number))
            const height = (value / maxValue) * 100
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full flex items-end h-48">
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      selectedMetric === 'efficiency' ? 'bg-green-500' :
                      selectedMetric === 'compliance' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium text-slate-100">{value}{selectedMetric === 'documents' ? '' : '%'}</div>
                  <div className="text-xs text-slate-400">{data.month}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Process Analytics */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">Process Performance</h2>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-400" />
            <span className="text-sm text-slate-400">By Process</span>
          </div>
        </div>

        <div className="space-y-4">
          {processAnalytics.map((process, index) => (
            <div key={index} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-medium text-slate-100">{process.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {process.documents} docs
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {process.avgTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {process.issues} issues
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    process.trend === 'up' ? 'text-green-400' : 
                    process.trend === 'down' ? 'text-red-400' : 'text-slate-400'
                  }`}>
                    {process.trend === 'up' ? '↗' : process.trend === 'down' ? '↘' : '→'} {process.completionRate}%
                  </div>
                  <div className="text-xs text-slate-500">completion rate</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Efficiency</span>
                    <span className="text-sm font-medium text-slate-100">{process.efficiency}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        process.efficiency >= 90 ? 'bg-green-500' : 
                        process.efficiency >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${process.efficiency}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Compliance</span>
                    <span className="text-sm font-medium text-slate-100">{process.compliance}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        process.compliance >= 95 ? 'bg-green-500' : 
                        process.compliance >= 85 ? 'bg-yellow-500' : 'bg-red-500'
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

      {/* Compliance Breakdown and Issue Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Breakdown */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-6">Compliance Breakdown</h2>
          <div className="space-y-4">
            {complianceBreakdown.map((framework, index) => (
              <div key={index} className="glass-card p-4 bg-slate-800/40">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-slate-100">{framework.framework}</h3>
                  <span className="text-sm font-medium text-slate-100">{framework.score}%</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      framework.score >= 90 ? 'bg-green-500' : 
                      framework.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${framework.score}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="text-center">
                    <div className="text-slate-400">Total</div>
                    <div className="font-medium text-slate-100">{framework.requirements}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-400">Completed</div>
                    <div className="font-medium text-green-400">{framework.completed}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-400">Overdue</div>
                    <div className="font-medium text-red-400">{framework.overdue}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Issue Categories */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-6">Issue Categories</h2>
          <div className="space-y-4">
            {issueCategories.map((category, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-100">{category.category}</span>
                    <span className="text-sm text-slate-400">{category.count} issues</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${category.color}`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-100">{category.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Total Issues</span>
              <span className="text-lg font-bold text-slate-100">
                {issueCategories.reduce((sum, cat) => sum + cat.count, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 hover:bg-slate-800/40 transition-colors cursor-pointer">
          <BarChart3 className="w-8 h-8 text-blue-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Process Report</h3>
          <p className="text-slate-400 text-sm">Generate detailed process performance report</p>
        </div>
        
        <div className="glass-card p-6 hover:bg-slate-800/40 transition-colors cursor-pointer">
          <PieChart className="w-8 h-8 text-green-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Compliance Dashboard</h3>
          <p className="text-slate-400 text-sm">View comprehensive compliance analytics</p>
        </div>
        
        <div className="glass-card p-6 hover:bg-slate-800/40 transition-colors cursor-pointer">
          <Activity className="w-8 h-8 text-purple-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Real-time Monitoring</h3>
          <p className="text-slate-400 text-sm">Monitor process performance in real-time</p>
        </div>
      </div>
    </div>
  )
}