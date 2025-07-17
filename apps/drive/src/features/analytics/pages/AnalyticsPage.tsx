import { TrendingUp, BarChart3, Clock, Target, Users, CheckSquare } from 'lucide-react'

const performanceMetrics = [
  {
    name: 'Project Completion Rate',
    value: '87%',
    change: '+5%',
    changeType: 'increase',
    icon: Target,
  },
  {
    name: 'Average Task Duration',
    value: '2.3 days',
    change: '-0.5 days',
    changeType: 'decrease',
    icon: Clock,
  },
  {
    name: 'Team Productivity',
    value: '94%',
    change: '+8%',
    changeType: 'increase',
    icon: Users,
  },
  {
    name: 'Tasks Completed',
    value: '156',
    change: '+24',
    changeType: 'increase',
    icon: CheckSquare,
  },
]

const projectPerformance = [
  {
    name: 'Customer Portal Redesign',
    progress: 68,
    tasksCompleted: 12,
    totalTasks: 18,
    onTime: true,
    teamSize: 3,
  },
  {
    name: 'Mobile App Launch',
    progress: 35,
    tasksCompleted: 8,
    totalTasks: 23,
    onTime: false,
    teamSize: 3,
  },
  {
    name: 'API Documentation Update',
    progress: 95,
    tasksCompleted: 19,
    totalTasks: 20,
    onTime: true,
    teamSize: 2,
  },
  {
    name: 'Security Audit Implementation',
    progress: 20,
    tasksCompleted: 4,
    totalTasks: 20,
    onTime: true,
    teamSize: 3,
  },
]

const teamPerformance = [
  {
    name: 'Sarah Chen',
    tasksCompleted: 24,
    averageTaskTime: '1.8 days',
    efficiency: 96,
    projects: 2,
  },
  {
    name: 'Mike Johnson',
    tasksCompleted: 18,
    averageTaskTime: '2.1 days',
    efficiency: 92,
    projects: 3,
  },
  {
    name: 'Lisa Wang',
    tasksCompleted: 22,
    averageTaskTime: '1.9 days',
    efficiency: 94,
    projects: 2,
  },
  {
    name: 'David Kim',
    tasksCompleted: 20,
    averageTaskTime: '2.3 days',
    efficiency: 88,
    projects: 2,
  },
  {
    name: 'Emma Thompson',
    tasksCompleted: 16,
    averageTaskTime: '2.5 days',
    efficiency: 85,
    projects: 2,
  },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Analytics</h1>
          <p className="text-slate-400 mt-1">
            Track project performance and team productivity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="glass-button text-slate-300 px-4 py-2 bg-slate-800/60 border border-slate-700 rounded-lg">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last 6 months</option>
            <option>Last year</option>
          </select>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.name} className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{metric.name}</p>
                  <p className="text-2xl font-semibold text-slate-100 mt-1">{metric.value}</p>
                </div>
                <div className="p-3 rounded-xl bg-orange-500/20">
                  <Icon className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  metric.changeType === 'increase' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.change}
                </span>
                <span className="text-sm text-slate-400 ml-1">from last month</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Project Performance */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">Project Performance</h2>
          <BarChart3 className="w-6 h-6 text-orange-400" />
        </div>
        <div className="space-y-4">
          {projectPerformance.map((project, index) => (
            <div key={index} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-medium text-slate-100">{project.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.onTime 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {project.onTime ? 'On Time' : 'Delayed'}
                  </span>
                </div>
                <div className="text-sm text-slate-400">
                  {project.teamSize} team members
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-400">Progress</span>
                    <span className="text-sm text-slate-300">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-400">Tasks Completed</p>
                  <p className="text-2xl font-semibold text-slate-100">
                    {project.tasksCompleted}/{project.totalTasks}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-400">Completion Rate</p>
                  <p className="text-2xl font-semibold text-slate-100">
                    {Math.round((project.tasksCompleted / project.totalTasks) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Performance */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">Team Performance</h2>
          <Users className="w-6 h-6 text-orange-400" />
        </div>
        <div className="space-y-4">
          {teamPerformance.map((member, index) => (
            <div key={index} className="glass-card p-4 bg-slate-800/40">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                <div>
                  <p className="font-medium text-slate-100">{member.name}</p>
                  <p className="text-sm text-slate-400">{member.projects} projects</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-400">Tasks Completed</p>
                  <p className="text-xl font-semibold text-slate-100">{member.tasksCompleted}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-400">Avg. Task Time</p>
                  <p className="text-xl font-semibold text-slate-100">{member.averageTaskTime}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-400">Efficiency</p>
                  <p className="text-xl font-semibold text-slate-100">{member.efficiency}%</p>
                </div>
                <div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${member.efficiency}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Task Completion Trends</h3>
          <div className="h-64 bg-slate-800/40 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400">Chart visualization would appear here</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Project Timeline</h3>
          <div className="h-64 bg-slate-800/40 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400">Gantt chart would appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}