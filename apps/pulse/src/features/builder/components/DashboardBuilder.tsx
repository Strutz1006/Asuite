import { useState } from 'react'
import { Plus, Layout, BarChart3, PieChart, TrendingUp, Gauge, Grid, Save, Eye, Settings, Trash2, Copy, Move } from 'lucide-react'

interface Widget {
  id: string
  type: 'chart' | 'metric' | 'gauge' | 'table'
  title: string
  kpiId?: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  config: any
}

const widgetTypes = [
  {
    type: 'metric',
    label: 'Metric Card',
    icon: BarChart3,
    description: 'Single KPI value with trend',
    minSize: { width: 1, height: 1 },
  },
  {
    type: 'chart',
    label: 'Line Chart',
    icon: TrendingUp,
    description: 'Time series trend visualization',
    minSize: { width: 2, height: 2 },
  },
  {
    type: 'gauge',
    label: 'Gauge Chart',
    icon: Gauge,
    description: 'Performance gauge with thresholds',
    minSize: { width: 2, height: 2 },
  },
  {
    type: 'table',
    label: 'Data Table',
    icon: Grid,
    description: 'Tabular data display',
    minSize: { width: 3, height: 2 },
  },
]

const sampleKPIs = [
  { id: '1', name: 'Revenue Growth', value: '125%', trend: 'up' },
  { id: '2', name: 'Customer Satisfaction', value: '4.8/5', trend: 'up' },
  { id: '3', name: 'Response Time', value: '2.3s', trend: 'down' },
  { id: '4', name: 'Conversion Rate', value: '12.5%', trend: 'up' },
]

export default function DashboardBuilder() {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null)
  const [showWidgetPanel, setShowWidgetPanel] = useState(true)
  const [dashboardName, setDashboardName] = useState('New Dashboard')
  const [previewMode, setPreviewMode] = useState(false)

  const addWidget = (type: string) => {
    const widgetType = widgetTypes.find(w => w.type === type)
    if (!widgetType) return

    const newWidget: Widget = {
      id: Date.now().toString(),
      type: type as any,
      title: `New ${widgetType.label}`,
      position: { x: 0, y: 0 },
      size: widgetType.minSize,
      config: {},
    }

    setWidgets([...widgets, newWidget])
    setSelectedWidget(newWidget.id)
  }

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id))
    if (selectedWidget === id) {
      setSelectedWidget(null)
    }
  }

  const duplicateWidget = (id: string) => {
    const widget = widgets.find(w => w.id === id)
    if (!widget) return

    const newWidget: Widget = {
      ...widget,
      id: Date.now().toString(),
      title: `${widget.title} (Copy)`,
      position: { x: widget.position.x + 1, y: widget.position.y + 1 },
    }

    setWidgets([...widgets, newWidget])
  }

  const updateWidget = (id: string, updates: Partial<Widget>) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, ...updates } : w))
  }

  const renderWidget = (widget: Widget) => {
    const isSelected = selectedWidget === widget.id

    return (
      <div
        key={widget.id}
        className={`
          glass-card p-4 transition-all duration-200 cursor-pointer relative group
          ${isSelected ? 'border-blue-500 bg-blue-500/20' : 'hover:bg-slate-800/40'}
        `}
        style={{
          gridColumn: `span ${widget.size.width}`,
          gridRow: `span ${widget.size.height}`,
        }}
        onClick={() => setSelectedWidget(widget.id)}
      >
        {/* Widget Controls */}
        {!previewMode && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation()
                duplicateWidget(widget.id)
              }}
              className="p-1 text-slate-400 hover:text-slate-300 bg-slate-800/80 rounded"
            >
              <Copy className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeWidget(widget.id)
              }}
              className="p-1 text-red-400 hover:text-red-300 bg-slate-800/80 rounded"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Widget Content */}
        <div className="h-full flex flex-col">
          <h3 className="text-sm font-medium text-slate-200 mb-3">{widget.title}</h3>
          
          {widget.type === 'metric' && (
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">125%</div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-400">+12.3%</span>
              </div>
            </div>
          )}
          
          {widget.type === 'chart' && (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full h-20 bg-slate-700/30 rounded flex items-end justify-center gap-1 p-2">
                {[40, 65, 55, 80, 70, 90, 85].map((height, index) => (
                  <div
                    key={index}
                    className="bg-blue-400 rounded-sm flex-1 transition-all duration-300"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          )}
          
          {widget.type === 'gauge' && (
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-24 h-12">
                <div className="absolute inset-0 rounded-t-full border-4 border-slate-700"></div>
                <div className="absolute inset-0 rounded-t-full border-4 border-green-400 border-b-transparent transform rotate-45"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-slate-400">
                  78%
                </div>
              </div>
            </div>
          )}
          
          {widget.type === 'table' && (
            <div className="flex-1">
              <div className="space-y-2">
                {sampleKPIs.slice(0, 3).map((kpi) => (
                  <div key={kpi.id} className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">{kpi.name}</span>
                    <span className="text-blue-400">{kpi.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="glass-card border-b border-slate-700/80 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              className="glass-input px-3 py-1 text-lg font-semibold text-slate-100 bg-transparent border-none"
            />
            <span className="text-sm text-slate-400">Dashboard Builder</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowWidgetPanel(!showWidgetPanel)}
              className={`glass-button px-3 py-2 flex items-center gap-2 text-sm
                ${showWidgetPanel ? 'text-blue-300' : 'text-slate-300'}
              `}
            >
              <Layout className="w-4 h-4" />
              Widgets
            </button>
            
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`glass-button px-3 py-2 flex items-center gap-2 text-sm
                ${previewMode ? 'text-green-300' : 'text-slate-300'}
              `}
            >
              <Eye className="w-4 h-4" />
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <Save className="w-4 h-4" />
              Save Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Widget Panel */}
        {showWidgetPanel && !previewMode && (
          <div className="w-80 glass-card border-r border-slate-700/80 p-4 overflow-y-auto">
            <div className="space-y-6">
              {/* Add Widgets */}
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Add Widgets</h3>
                <div className="space-y-3">
                  {widgetTypes.map((widgetType) => {
                    const Icon = widgetType.icon
                    return (
                      <button
                        key={widgetType.type}
                        onClick={() => addWidget(widgetType.type)}
                        className="w-full glass-card p-4 text-left hover:bg-slate-800/40 transition-colors"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-5 h-5 text-blue-400" />
                          <span className="font-medium text-slate-200">{widgetType.label}</span>
                        </div>
                        <p className="text-xs text-slate-400">{widgetType.description}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Widget Properties */}
              {selectedWidget && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-4">Widget Properties</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={widgets.find(w => w.id === selectedWidget)?.title || ''}
                        onChange={(e) => updateWidget(selectedWidget, { title: e.target.value })}
                        className="glass-input w-full px-3 py-2 text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Data Source
                      </label>
                      <select className="glass-input w-full px-3 py-2 text-slate-100">
                        <option value="" className="bg-slate-900">Select KPI</option>
                        {sampleKPIs.map((kpi) => (
                          <option key={kpi.id} value={kpi.id} className="bg-slate-900">
                            {kpi.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Width
                        </label>
                        <select
                          value={widgets.find(w => w.id === selectedWidget)?.size.width || 1}
                          onChange={(e) => updateWidget(selectedWidget, {
                            size: { 
                              ...widgets.find(w => w.id === selectedWidget)?.size,
                              width: parseInt(e.target.value)
                            }
                          })}
                          className="glass-input w-full px-3 py-2 text-slate-100"
                        >
                          <option value="1" className="bg-slate-900">1 col</option>
                          <option value="2" className="bg-slate-900">2 cols</option>
                          <option value="3" className="bg-slate-900">3 cols</option>
                          <option value="4" className="bg-slate-900">4 cols</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Height
                        </label>
                        <select
                          value={widgets.find(w => w.id === selectedWidget)?.size.height || 1}
                          onChange={(e) => updateWidget(selectedWidget, {
                            size: {
                              ...widgets.find(w => w.id === selectedWidget)?.size,
                              height: parseInt(e.target.value)
                            }
                          })}
                          className="glass-input w-full px-3 py-2 text-slate-100"
                        >
                          <option value="1" className="bg-slate-900">1 row</option>
                          <option value="2" className="bg-slate-900">2 rows</option>
                          <option value="3" className="bg-slate-900">3 rows</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700/50">
                      <button
                        onClick={() => removeWidget(selectedWidget)}
                        className="w-full glass-button text-red-400 hover:text-red-300 px-3 py-2 flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove Widget
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Templates */}
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Templates</h3>
                <div className="space-y-2">
                  <button className="w-full glass-card p-3 text-left hover:bg-slate-800/40 transition-colors">
                    <p className="font-medium text-slate-200 text-sm">Executive Dashboard</p>
                    <p className="text-xs text-slate-400">High-level KPIs for leadership</p>
                  </button>
                  <button className="w-full glass-card p-3 text-left hover:bg-slate-800/40 transition-colors">
                    <p className="font-medium text-slate-200 text-sm">Sales Performance</p>
                    <p className="text-xs text-slate-400">Revenue and sales metrics</p>
                  </button>
                  <button className="w-full glass-card p-3 text-left hover:bg-slate-800/40 transition-colors">
                    <p className="font-medium text-slate-200 text-sm">Operations Monitor</p>
                    <p className="text-xs text-slate-400">Operational efficiency tracking</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Canvas */}
        <div className="flex-1 p-6 overflow-auto">
          {widgets.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Layout className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">Empty Dashboard</h3>
                <p className="text-slate-500 mb-6">
                  Add widgets from the panel to start building your dashboard
                </p>
                <button
                  onClick={() => addWidget('metric')}
                  className="glass-button text-blue-300 hover:text-blue-200 px-4 py-2 flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add First Widget
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-4 auto-rows-min">
              {widgets.map(renderWidget)}
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="glass-card border-t border-slate-700/80 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>{widgets.length} widgets</span>
          <div className="flex items-center gap-4">
            <span>6-column grid</span>
            <span className="flex items-center gap-1">
              <Settings className="w-4 h-4" />
              Auto-save enabled
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}