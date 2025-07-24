import { Link } from 'react-router-dom'
import { Plus, Target, BarChart3, Layout, TrendingUp, Gauge, Sparkles, ArrowRight } from 'lucide-react'

const builderOptions = [
  {
    type: 'kpi',
    title: 'KPI Builder',
    description: 'Create SMART KPIs with guided wizard',
    icon: Target,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/50',
    path: '/builder/kpi',
    features: ['SMART validation', 'Data source integration', 'Threshold alerts', 'Strategic alignment'],
  },
  {
    type: 'dashboard',
    title: 'Dashboard Builder',
    description: 'Design interactive dashboards with drag & drop',
    icon: Layout,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/50',
    path: '/builder/dashboard',
    features: ['Drag & drop widgets', 'Real-time data', 'Custom layouts', 'Responsive design'],
  },
]

const quickTemplates = [
  {
    id: '1',
    name: 'Executive Dashboard',
    description: 'High-level KPIs for leadership',
    type: 'dashboard',
    icon: TrendingUp,
    color: 'text-purple-400',
  },
  {
    id: '2',
    name: 'Customer Satisfaction KPI',
    description: 'Track NPS and CSAT scores',
    type: 'kpi',
    icon: Target,
    color: 'text-blue-400',
  },
  {
    id: '3',
    name: 'Sales Performance Dashboard',
    description: 'Revenue and conversion tracking',
    type: 'dashboard',
    icon: BarChart3,
    color: 'text-green-400',
  },
  {
    id: '4',
    name: 'Financial Health KPI',
    description: 'Revenue growth and profitability',
    type: 'kpi',
    icon: TrendingUp,
    color: 'text-yellow-400',
  },
]

const recentActivity = [
  { name: 'Customer Satisfaction KPI', type: 'KPI', status: 'Active', lastUpdated: '2 hours ago' },
  { name: 'Executive Dashboard', type: 'Dashboard', status: 'Draft', lastUpdated: '1 day ago' },
  { name: 'Revenue Growth KPI', type: 'KPI', status: 'Active', lastUpdated: '3 days ago' },
]

export default function BuilderPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Pulse Builder</h1>
        <p className="text-slate-400 text-lg">
          Create KPIs and dashboards that drive performance insights
        </p>
      </div>

      {/* Main Builder Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {builderOptions.map((option) => {
          const Icon = option.icon
          return (
            <Link
              key={option.type}
              to={option.path}
              className={`
                glass-card p-8 hover:bg-slate-800/40 transition-all duration-200 group
                ${option.bgColor} ${option.borderColor}
              `}
            >
              <div className="flex items-start gap-6">
                <div className={`p-4 rounded-2xl ${option.bgColor}`}>
                  <Icon className={`w-8 h-8 ${option.color}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-2xl font-bold text-slate-100">{option.title}</h2>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <p className="text-slate-400 mb-4">{option.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {option.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${option.color.replace('text-', 'bg-')}`} />
                        <span className="text-sm text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Templates */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">Quick Start Templates</h2>
          <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
            View All Templates
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickTemplates.map((template) => {
            const Icon = template.icon
            return (
              <button
                key={template.id}
                className="glass-card p-4 text-left hover:bg-slate-800/40 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className={`w-6 h-6 ${template.color}`} />
                  <span className={`text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-400`}>
                    {template.type.toUpperCase()}
                  </span>
                </div>
                <h3 className="font-medium text-slate-100 mb-1 group-hover:text-blue-300 transition-colors">
                  {template.name}
                </h3>
                <p className="text-xs text-slate-400">{template.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Recent Activity & AI Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 glass-card bg-slate-800/40">
                <div>
                  <p className="font-medium text-slate-200">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.type} • {item.lastUpdated}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full
                  ${item.status === 'Active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                  }
                `}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 glass-button text-blue-400 hover:text-blue-300 py-2 text-sm">
            View All Activity
          </button>
        </div>

        {/* AI Assistant */}
        <div className="glass-card p-6 bg-purple-500/10 border-purple-500/30">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-purple-400 mt-1" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-purple-300 mb-3">AI Assistant</h2>
              <p className="text-sm text-slate-300 mb-4">
                Get intelligent suggestions for KPIs and dashboard designs based on your industry and goals.
              </p>
              
              <div className="space-y-3">
                <button className="w-full glass-button text-purple-300 hover:text-purple-200 p-3 text-left">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4" />
                    <span className="text-sm">Suggest KPIs for my department</span>
                  </div>
                </button>
                
                <button className="w-full glass-button text-purple-300 hover:text-purple-200 p-3 text-left">
                  <div className="flex items-center gap-2">
                    <Layout className="w-4 h-4" />
                    <span className="text-sm">Design dashboard layout</span>
                  </div>
                </button>
                
                <button className="w-full glass-button text-purple-300 hover:text-purple-200 p-3 text-left">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span className="text-sm">Validate KPI effectiveness</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started Guide */}
      <div className="glass-card p-6 bg-blue-500/10 border-blue-500/30">
        <h2 className="text-lg font-semibold text-blue-300 mb-4">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-400 font-semibold">1</span>
            </div>
            <h3 className="font-medium text-slate-200 mb-2">Define Your KPIs</h3>
            <p className="text-xs text-slate-400">
              Use our guided wizard to create SMART KPIs aligned with your strategic goals
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-400 font-semibold">2</span>
            </div>
            <h3 className="font-medium text-slate-200 mb-2">Build Dashboards</h3>
            <p className="text-xs text-slate-400">
              Create interactive dashboards with drag-and-drop widgets to visualize your data
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-400 font-semibold">3</span>
            </div>
            <h3 className="font-medium text-slate-200 mb-2">Monitor & Optimize</h3>
            <p className="text-xs text-slate-400">
              Track performance, set alerts, and continuously improve your metrics
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}