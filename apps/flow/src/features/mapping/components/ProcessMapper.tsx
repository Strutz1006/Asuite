import { useState } from 'react'
import { 
  GitBranch, 
  Play, 
  Square, 
  Diamond, 
  Circle, 
  Plus, 
  Trash2, 
  Settings, 
  Download, 
  Upload, 
  ZoomIn, 
  ZoomOut, 
  Move,
  Eye,
  Edit3,
  Share,
  Save,
  RotateCcw,
  Layers,
  Timer,
  Users,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'

export interface ProcessNode {
  id: string
  type: 'start' | 'end' | 'task' | 'decision' | 'subprocess'
  label: string
  description?: string
  position: { x: number; y: number }
  assignee?: string
  estimatedTime?: number
  dependencies?: string[]
  conditions?: string[]
  status?: 'active' | 'completed' | 'pending' | 'error'
}

export interface ProcessConnection {
  id: string
  from: string
  to: string
  label?: string
  condition?: string
  probability?: number
}

export interface ProcessMap {
  id: string
  name: string
  description: string
  nodes: ProcessNode[]
  connections: ProcessConnection[]
  metadata: {
    department: string
    owner: string
    version: string
    lastModified: string
    status: 'draft' | 'active' | 'deprecated'
    complexity: 'low' | 'medium' | 'high'
    estimatedDuration: string
  }
}

const mockProcessMaps: ProcessMap[] = [
  {
    id: '1',
    name: 'Customer Support Ticket Resolution',
    description: 'End-to-end process for handling customer support tickets',
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        label: 'Ticket Received',
        position: { x: 100, y: 100 }
      },
      {
        id: 'task-1',
        type: 'task',
        label: 'Initial Triage',
        description: 'Categorize and prioritize the ticket',
        position: { x: 300, y: 100 },
        assignee: 'Support Agent',
        estimatedTime: 5
      },
      {
        id: 'decision-1',
        type: 'decision',
        label: 'Is it a simple issue?',
        position: { x: 500, y: 100 },
        conditions: ['Simple', 'Complex']
      },
      {
        id: 'task-2',
        type: 'task',
        label: 'Resolve Immediately',
        position: { x: 700, y: 50 },
        assignee: 'Support Agent',
        estimatedTime: 15
      },
      {
        id: 'task-3',
        type: 'task',
        label: 'Escalate to Specialist',
        position: { x: 700, y: 150 },
        assignee: 'Technical Specialist',
        estimatedTime: 30
      },
      {
        id: 'end-1',
        type: 'end',
        label: 'Ticket Closed',
        position: { x: 900, y: 100 }
      }
    ],
    connections: [
      { id: 'c1', from: 'start-1', to: 'task-1' },
      { id: 'c2', from: 'task-1', to: 'decision-1' },
      { id: 'c3', from: 'decision-1', to: 'task-2', label: 'Simple', condition: 'Yes' },
      { id: 'c4', from: 'decision-1', to: 'task-3', label: 'Complex', condition: 'No' },
      { id: 'c5', from: 'task-2', to: 'end-1' },
      { id: 'c6', from: 'task-3', to: 'end-1' }
    ],
    metadata: {
      department: 'Customer Support',
      owner: 'Sarah Johnson',
      version: '2.1',
      lastModified: '2024-01-15',
      status: 'active',
      complexity: 'medium',
      estimatedDuration: '15-45 minutes'
    }
  }
]

const nodeShapes = {
  start: { icon: Play, color: 'bg-green-500', shape: 'rounded-full' },
  end: { icon: Square, color: 'bg-red-500', shape: 'rounded-full' },
  task: { icon: Circle, color: 'bg-blue-500', shape: 'rounded-lg' },
  decision: { icon: Diamond, color: 'bg-yellow-500', shape: 'transform rotate-45' },
  subprocess: { icon: Layers, color: 'bg-purple-500', shape: 'rounded-lg' }
}

export default function ProcessMapper() {
  const [processMaps] = useState<ProcessMap[]>(mockProcessMaps)
  const [selectedMap, setSelectedMap] = useState<ProcessMap | null>(null)
  const [viewMode, setViewMode] = useState<'gallery' | 'editor' | 'create'>('gallery')
  const [zoom, setZoom] = useState(100)
  const [selectedNode, setSelectedNode] = useState<ProcessNode | null>(null)

  const renderNode = (node: ProcessNode) => {
    const shape = nodeShapes[node.type]
    const Icon = shape.icon

    return (
      <div
        key={node.id}
        className={`absolute cursor-pointer group transition-all duration-200 hover:scale-110`}
        style={{ 
          left: node.position.x, 
          top: node.position.y,
          transform: `scale(${zoom / 100})`
        }}
        onClick={() => setSelectedNode(node)}
      >
        <div className={`w-16 h-16 ${shape.color} ${shape.shape} flex items-center justify-center shadow-lg group-hover:shadow-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-32 text-center">
          <div className="text-sm font-medium text-slate-100 mb-1">{node.label}</div>
          {node.assignee && (
            <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
              <Users className="w-3 h-3" />
              {node.assignee}
            </div>
          )}
          {node.estimatedTime && (
            <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
              <Timer className="w-3 h-3" />
              {node.estimatedTime}m
            </div>
          )}
        </div>

        {/* Status indicator */}
        {node.status && (
          <div className="absolute -top-2 -right-2">
            {node.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
            {node.status === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
            {node.status === 'active' && <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />}
          </div>
        )}
      </div>
    )
  }

  const renderConnection = (connection: ProcessConnection) => {
    if (!selectedMap) return null
    
    const fromNode = selectedMap.nodes.find(n => n.id === connection.from)
    const toNode = selectedMap.nodes.find(n => n.id === connection.to)
    
    if (!fromNode || !toNode) return null

    const fromX = fromNode.position.x + 32 // Center of node
    const fromY = fromNode.position.y + 32
    const toX = toNode.position.x + 32
    const toY = toNode.position.y + 32

    const dx = toX - fromX
    const dy = toY - fromY
    const length = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx) * 180 / Math.PI

    return (
      <div
        key={connection.id}
        className="absolute"
        style={{
          left: fromX,
          top: fromY,
          width: length,
          height: 2,
          transform: `rotate(${angle}deg)`,
          transformOrigin: '0 50%',
          scale: zoom / 100
        }}
      >
        <div className="w-full h-full bg-slate-400 relative">
          {/* Arrow head */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <div className="w-0 h-0 border-l-4 border-l-slate-400 border-t-2 border-t-transparent border-b-2 border-b-transparent" />
          </div>
          
          {/* Connection label */}
          {connection.label && (
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 text-xs text-slate-400 bg-slate-900/80 px-2 py-1 rounded whitespace-nowrap">
              {connection.label}
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderGallery = () => (
    <div className="space-y-6">
      {/* Gallery Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Process Gallery</h2>
          <p className="text-slate-400">Browse and manage your process maps</p>
        </div>
        <button
          onClick={() => setViewMode('create')}
          className="glass-button px-4 py-2 text-teal-400 hover:text-teal-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Process Map
        </button>
      </div>

      {/* Process Maps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {processMaps.map((map) => (
          <div key={map.id} className="glass-card p-6 hover:bg-slate-800/40 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-1">{map.name}</h3>
                <p className="text-slate-400 text-sm">{map.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedMap(map)
                    setViewMode('editor')
                  }}
                  className="glass-button p-2 text-slate-400 hover:text-slate-300"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button className="glass-button p-2 text-slate-400 hover:text-slate-300">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="glass-button p-2 text-slate-400 hover:text-slate-300">
                  <Share className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Process Preview */}
            <div className="bg-slate-900/50 rounded-lg p-4 mb-4 h-32 overflow-hidden relative">
              <div className="absolute inset-0 scale-50 origin-top-left">
                {map.nodes.map(renderNode)}
                {map.connections.map(renderConnection)}
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Department:</span>
                <span className="text-slate-300 ml-2">{map.metadata.department}</span>
              </div>
              <div>
                <span className="text-slate-400">Owner:</span>
                <span className="text-slate-300 ml-2">{map.metadata.owner}</span>
              </div>
              <div>
                <span className="text-slate-400">Complexity:</span>
                <span className={`ml-2 capitalize ${
                  map.metadata.complexity === 'high' ? 'text-red-400' :
                  map.metadata.complexity === 'medium' ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {map.metadata.complexity}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Duration:</span>
                <span className="text-slate-300 ml-2">{map.metadata.estimatedDuration}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
              <div className="text-xs text-slate-500">
                v{map.metadata.version} • Modified {map.metadata.lastModified}
              </div>
              <div className={`px-2 py-1 rounded text-xs ${
                map.metadata.status === 'active' ? 'bg-green-500/20 text-green-400' :
                map.metadata.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-slate-500/20 text-slate-400'
              }`}>
                {map.metadata.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderEditor = () => {
    if (!selectedMap) return null

    return (
      <div className="space-y-6">
        {/* Editor Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">{selectedMap.name}</h2>
            <p className="text-slate-400">{selectedMap.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('gallery')}
              className="glass-button px-3 py-2 text-slate-400 hover:text-slate-300"
            >
              ← Gallery
            </button>
            <button className="glass-button p-2 text-slate-400 hover:text-slate-300">
              <Save className="w-4 h-4" />
            </button>
            <button className="glass-button p-2 text-slate-400 hover:text-slate-300">
              <Download className="w-4 h-4" />
            </button>
            <button className="glass-button p-2 text-slate-400 hover:text-slate-300">
              <Share className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Editor Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button className="glass-button p-2 text-slate-400 hover:text-slate-300">
                <Plus className="w-4 h-4" />
              </button>
              <button className="glass-button p-2 text-slate-400 hover:text-slate-300">
                <Move className="w-4 h-4" />
              </button>
              <button className="glass-button p-2 text-slate-400 hover:text-slate-300">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 25))}
              className="glass-button p-2 text-slate-400 hover:text-slate-300"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-slate-400 text-sm w-12 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              className="glass-button p-2 text-slate-400 hover:text-slate-300"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="glass-card p-6">
          <div className="relative bg-slate-900/50 rounded-lg min-h-96 overflow-hidden">
            {selectedMap.nodes.map(renderNode)}
            {selectedMap.connections.map(renderConnection)}
          </div>
        </div>

        {/* Properties Panel */}
        {selectedNode && (
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-100">Node Properties</h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="glass-button p-1 text-slate-400 hover:text-slate-300"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Label</label>
                <input 
                  type="text" 
                  className="glass-input w-full" 
                  value={selectedNode.label}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                <input 
                  type="text" 
                  className="glass-input w-full" 
                  value={selectedNode.type}
                  readOnly
                />
              </div>
              {selectedNode.assignee && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Assignee</label>
                  <input 
                    type="text" 
                    className="glass-input w-full" 
                    value={selectedNode.assignee}
                    readOnly
                  />
                </div>
              )}
              {selectedNode.estimatedTime && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Estimated Time (minutes)</label>
                  <input 
                    type="number" 
                    className="glass-input w-full" 
                    value={selectedNode.estimatedTime}
                    readOnly
                  />
                </div>
              )}
            </div>
            
            {selectedNode.description && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea 
                  className="glass-input w-full h-20 resize-none" 
                  value={selectedNode.description}
                  readOnly
                />
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderCreateNew = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <GitBranch className="w-12 h-12 text-teal-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Create New Process Map</h2>
        <p className="text-slate-400">Start mapping your business processes</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold text-slate-100 mb-4">Process Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Process Name</label>
              <input 
                type="text" 
                className="glass-input w-full" 
                placeholder="e.g., Customer Onboarding Process"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea 
                className="glass-input w-full h-20 resize-none" 
                placeholder="Describe the purpose and scope of this process..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
                <select className="glass-input w-full">
                  <option>Select department</option>
                  <option>Customer Support</option>
                  <option>Sales</option>
                  <option>Engineering</option>
                  <option>HR</option>
                  <option>Finance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Process Owner</label>
                <input 
                  type="text" 
                  className="glass-input w-full" 
                  placeholder="Process owner name"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-semibold text-slate-100 mb-4">Template Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="glass-card p-4 text-left hover:bg-slate-800/40 transition-colors">
              <div className="font-medium text-slate-100 mb-2">Blank Canvas</div>
              <div className="text-sm text-slate-400">Start with an empty process map</div>
            </button>
            <button className="glass-card p-4 text-left hover:bg-slate-800/40 transition-colors">
              <div className="font-medium text-slate-100 mb-2">Basic Workflow</div>
              <div className="text-sm text-slate-400">Simple linear process template</div>
            </button>
            <button className="glass-card p-4 text-left hover:bg-slate-800/40 transition-colors">
              <div className="font-medium text-slate-100 mb-2">Approval Process</div>
              <div className="text-sm text-slate-400">Multi-step approval workflow</div>
            </button>
            <button className="glass-card p-4 text-left hover:bg-slate-800/40 transition-colors">
              <div className="font-medium text-slate-100 mb-2">Support Ticket</div>
              <div className="text-sm text-slate-400">Customer support process template</div>
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setViewMode('gallery')}
            className="glass-button flex-1 px-6 py-3 text-slate-400 hover:text-slate-300"
          >
            Cancel
          </button>
          <button className="glass-button flex-1 px-6 py-3 text-teal-400 hover:text-teal-300 bg-teal-500/20">
            Create Process Map
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Process Mapper</h1>
          <p className="text-slate-400 mt-1">Visualize and optimize your business processes</p>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'gallery' && renderGallery()}
      {viewMode === 'editor' && renderEditor()}
      {viewMode === 'create' && renderCreateNew()}
    </div>
  )
}