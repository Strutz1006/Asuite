import { useState } from 'react'
import { Target, TrendingUp, Users, Building, Search } from 'lucide-react'

const objectives = [
  {
    id: '1',
    level: 'company',
    title: 'Become the leading customer satisfaction platform',
    description: 'Achieve market leadership in customer satisfaction solutions',
    progress: 68,
    children: [
      {
        id: '2',
        level: 'department',
        title: 'Improve product quality and reliability',
        description: 'Enhance product stability and user experience',
        progress: 75,
        children: [
          {
            id: '3',
            level: 'team',
            title: 'Reduce bug count by 50%',
            description: 'Implement better testing and QA processes',
            progress: 80,
          },
          {
            id: '4',
            level: 'team',
            title: 'Improve app performance by 30%',
            description: 'Optimize loading times and responsiveness',
            progress: 65,
          },
        ],
      },
      {
        id: '5',
        level: 'department',
        title: 'Expand customer support capabilities',
        description: 'Build world-class customer support team',
        progress: 60,
        children: [
          {
            id: '6',
            level: 'team',
            title: 'Hire 10 new support agents',
            description: 'Scale support team to handle growth',
            progress: 70,
          },
          {
            id: '7',
            level: 'team',
            title: 'Implement 24/7 support coverage',
            description: 'Provide round-the-clock customer support',
            progress: 50,
          },
        ],
      },
    ],
  },
]

const levelConfig = {
  company: {
    icon: Building,
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/50',
  },
  department: {
    icon: Users,
    color: 'text-sky-400',
    bg: 'bg-sky-500/20',
    border: 'border-sky-500/50',
  },
  team: {
    icon: Target,
    color: 'text-green-400',
    bg: 'bg-green-500/20',
    border: 'border-green-500/50',
  },
}

function ObjectiveCard({ objective, depth = 0 }: { objective: any; depth?: number }) {
  const [isExpanded, setIsExpanded] = useState(depth < 2)
  const config = levelConfig[objective.level as keyof typeof levelConfig]
  const Icon = config.icon

  return (
    <div className={`ml-${depth * 8}`}>
      <div className={`glass-card p-4 border-l-4 ${config.border}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-lg ${config.bg}`}>
              <Icon className={`w-4 h-4 ${config.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-slate-100">{objective.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                  {objective.level}
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-3">{objective.description}</p>
              
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">Progress</span>
                    <span className="text-xs text-slate-300">{objective.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${objective.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {objective.children && objective.children.length > 0 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-sm text-sky-400 hover:text-sky-300"
                >
                  {isExpanded ? 'Hide' : 'Show'} {objective.children.length} sub-objectives
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isExpanded && objective.children && (
        <div className="mt-4 space-y-4">
          {objective.children.map((child: any) => (
            <ObjectiveCard key={child.id} objective={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ObjectivesPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Objectives</h1>
          <p className="text-slate-400 mt-1">
            View the complete goal hierarchy and organizational alignment
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search objectives..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="glass-input w-full pl-10 pr-4 py-2 text-slate-100 placeholder-slate-400"
        />
      </div>

      {/* Legend */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Hierarchy Levels</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(levelConfig).map(([level, config]) => {
            const Icon = config.icon
            return (
              <div key={level} className="flex items-center gap-2">
                <div className={`p-1 rounded ${config.bg}`}>
                  <Icon className={`w-3 h-3 ${config.color}`} />
                </div>
                <span className="text-sm text-slate-300 capitalize">{level}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Objectives Tree */}
      <div className="space-y-6">
        {objectives.map((objective) => (
          <ObjectiveCard key={objective.id} objective={objective} />
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Objectives</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">7</p>
            </div>
            <Target className="w-8 h-8 text-sky-400" />
          </div>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Average Progress</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">68%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">On Track</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">85%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  )
}