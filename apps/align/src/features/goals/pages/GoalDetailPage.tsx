import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Calendar, User, TrendingUp, Target, BarChart } from 'lucide-react'

const mockGoal = {
  id: '1',
  title: 'Increase customer satisfaction score',
  description: 'Improve overall customer satisfaction from 7.2 to 8.5 by implementing better support processes, training programs, and feedback loops.',
  progress: 78,
  status: 'on-track',
  dueDate: '2024-08-15',
  owner: 'Sarah Johnson',
  category: 'customer',
  priority: 'high',
  keyResults: [
    {
      id: '1',
      title: 'Implement new support ticketing system',
      target: '100',
      current: '85',
      unit: '%',
      progress: 85,
      status: 'on-track'
    },
    {
      id: '2',
      title: 'Train support team on new processes',
      target: '24',
      current: '18',
      unit: 'people',
      progress: 75,
      status: 'on-track'
    },
    {
      id: '3',
      title: 'Achieve customer satisfaction score',
      target: '8.5',
      current: '7.8',
      unit: 'score',
      progress: 80,
      status: 'on-track'
    }
  ],
  progressHistory: [
    { date: '2024-01-01', value: 0 },
    { date: '2024-02-01', value: 15 },
    { date: '2024-03-01', value: 28 },
    { date: '2024-04-01', value: 45 },
    { date: '2024-05-01', value: 62 },
    { date: '2024-06-01', value: 78 },
  ]
}

export default function GoalDetailPage() {
  const { id } = useParams()
  
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/goals"
          className="glass-button p-2 text-slate-300 hover:text-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-100">{mockGoal.title}</h1>
          <p className="text-slate-400 mt-1">{mockGoal.description}</p>
        </div>
        <Link
          to={`/goals/${id}/edit`}
          className="glass-button text-sky-300 hover:text-sky-200 px-4 py-2 flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Link>
      </div>

      {/* Status and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-100">Overall Progress</h3>
            <Target className="w-5 h-5 text-sky-400" />
          </div>
          <div className="text-3xl font-bold text-slate-100 mb-2">{mockGoal.progress}%</div>
          <div className="w-full bg-slate-700/50 rounded-full h-3 mb-4">
            <div
              className="bg-sky-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${mockGoal.progress}%` }}
            />
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              mockGoal.status === 'on-track'
                ? 'bg-green-500/20 text-green-400'
                : mockGoal.status === 'at-risk'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-sky-500/20 text-sky-400'
            }`}
          >
            {mockGoal.status === 'on-track' ? 'On Track' : mockGoal.status === 'at-risk' ? 'At Risk' : 'Ahead'}
          </span>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-100">Goal Details</h3>
            <BarChart className="w-5 h-5 text-green-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">Owner:</span>
              <span className="text-sm text-slate-100">{mockGoal.owner}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">Due:</span>
              <span className="text-sm text-slate-100">
                {new Date(mockGoal.dueDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">Priority:</span>
              <span className={`text-sm px-2 py-1 rounded-full ${
                mockGoal.priority === 'high' 
                  ? 'bg-red-500/20 text-red-400' 
                  : mockGoal.priority === 'medium'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-blue-500/20 text-blue-400'
              }`}>
                {mockGoal.priority}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-100">Key Results</h3>
            <span className="text-2xl font-bold text-slate-100">{mockGoal.keyResults.length}</span>
          </div>
          <div className="text-sm text-slate-400 mb-2">
            {mockGoal.keyResults.filter(kr => kr.progress >= 100).length} completed
          </div>
          <div className="text-sm text-slate-400">
            {mockGoal.keyResults.filter(kr => kr.progress < 100).length} in progress
          </div>
        </div>
      </div>

      {/* Key Results */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-6">Key Results</h2>
        <div className="space-y-4">
          {mockGoal.keyResults.map((keyResult) => (
            <div key={keyResult.id} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-slate-100">{keyResult.title}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    keyResult.status === 'on-track'
                      ? 'bg-green-500/20 text-green-400'
                      : keyResult.status === 'at-risk'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-sky-500/20 text-sky-400'
                  }`}
                >
                  {keyResult.status === 'on-track' ? 'On Track' : keyResult.status === 'at-risk' ? 'At Risk' : 'Ahead'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <span className="text-sm text-slate-400">Current:</span>
                  <span className="text-sm text-slate-100 ml-2">
                    {keyResult.current} {keyResult.unit}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Target:</span>
                  <span className="text-sm text-slate-100 ml-2">
                    {keyResult.target} {keyResult.unit}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Progress:</span>
                  <span className="text-sm text-slate-100 ml-2">{keyResult.progress}%</span>
                </div>
              </div>

              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div
                  className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${keyResult.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-6">Progress Timeline</h2>
        <div className="space-y-4">
          {mockGoal.progressHistory.map((entry, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-2 h-2 bg-sky-500 rounded-full flex-shrink-0" />
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm text-slate-400">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
                <span className="text-sm text-slate-100">{entry.value}% complete</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}