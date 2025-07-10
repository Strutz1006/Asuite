import React, { useState, useEffect } from 'react';
import { GlassCard, Icon } from '../../shared/components';
import type { ProcessMap, DiagramElement, InteractiveElement } from '../../shared/types/advanced';

const VisualIntelligencePage: React.FC = () => {
  const [processMaps, setProcessMaps] = useState<ProcessMap[]>([]);
  const [selectedMap, setSelectedMap] = useState<ProcessMap | null>(null);
  const [activeView, setActiveView] = useState<'bpmn' | 'swimlane' | 'heatmap' | 'dependency'>('bpmn');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMapConfig, setShowMapConfig] = useState(false);

  useEffect(() => {
    loadProcessMaps();
  }, []);

  const loadProcessMaps = () => {
    // Mock process maps data
    const mockMaps: ProcessMap[] = [
      {
        id: 'map-1',
        processId: 'proc-1',
        type: 'bpmn',
        metadata: {
          generatedFrom: 'text',
          confidence: 0.89,
          lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
          version: '1.2',
          stakeholders: ['sarah.chen@company.com', 'alex.kim@company.com']
        },
        diagram: [
          {
            id: 'start-1',
            type: 'start',
            label: 'Process Start',
            position: { x: 50, y: 200 },
            properties: { shape: 'circle', color: 'green' },
            connections: [{ targetId: 'task-1' }]
          },
          {
            id: 'task-1',
            type: 'task',
            label: 'Document Collection',
            position: { x: 200, y: 200 },
            properties: { 
              shape: 'rectangle', 
              color: 'blue',
              duration: '30min',
              assignee: 'Admin'
            },
            connections: [{ targetId: 'decision-1' }]
          },
          {
            id: 'decision-1',
            type: 'decision',
            label: 'Documents Complete?',
            position: { x: 400, y: 200 },
            properties: { shape: 'diamond', color: 'yellow' },
            connections: [
              { targetId: 'task-2', label: 'Yes', condition: 'complete === true' },
              { targetId: 'task-1', label: 'No', condition: 'complete === false' }
            ]
          },
          {
            id: 'task-2',
            type: 'task',
            label: 'Background Check',
            position: { x: 600, y: 200 },
            properties: { 
              shape: 'rectangle', 
              color: 'blue',
              duration: '2-5 days',
              assignee: 'HR Specialist'
            },
            connections: [{ targetId: 'task-3' }]
          },
          {
            id: 'task-3',
            type: 'task',
            label: 'IT Setup',
            position: { x: 800, y: 200 },
            properties: { 
              shape: 'rectangle', 
              color: 'blue',
              duration: '45min',
              assignee: 'IT Admin'
            },
            connections: [{ targetId: 'end-1' }]
          },
          {
            id: 'end-1',
            type: 'end',
            label: 'Process End',
            position: { x: 950, y: 200 },
            properties: { shape: 'circle', color: 'red' },
            connections: []
          }
        ],
        interactiveElements: [
          {
            elementId: 'task-1',
            performanceData: { avgDuration: 28, completionRate: 98.5 },
            complianceStatus: 'compliant',
            alerts: []
          },
          {
            elementId: 'task-2',
            performanceData: { avgDuration: 72, completionRate: 94.2 },
            complianceStatus: 'warning',
            alerts: ['Potential delay risk', 'High variation in processing time']
          },
          {
            elementId: 'task-3',
            performanceData: { avgDuration: 42, completionRate: 99.1 },
            complianceStatus: 'compliant',
            alerts: []
          }
        ]
      },
      {
        id: 'map-2',
        processId: 'proc-2',
        type: 'swimlane',
        metadata: {
          generatedFrom: 'discovery',
          confidence: 0.76,
          lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000),
          version: '1.0',
          stakeholders: ['mike.torres@company.com']
        },
        diagram: [
          {
            id: 'pool-1',
            type: 'pool',
            label: 'Procurement Process',
            position: { x: 0, y: 0 },
            properties: { width: 1000, height: 400 },
            connections: []
          },
          {
            id: 'lane-1',
            type: 'lane',
            label: 'Requestor',
            position: { x: 0, y: 50 },
            properties: { width: 1000, height: 100, parentId: 'pool-1' },
            connections: []
          },
          {
            id: 'lane-2',
            type: 'lane',
            label: 'Manager',
            position: { x: 0, y: 150 },
            properties: { width: 1000, height: 100, parentId: 'pool-1' },
            connections: []
          },
          {
            id: 'lane-3',
            type: 'lane',
            label: 'Procurement',
            position: { x: 0, y: 250 },
            properties: { width: 1000, height: 100, parentId: 'pool-1' },
            connections: []
          }
        ],
        interactiveElements: []
      }
    ];

    setProcessMaps(mockMaps);
    if (!selectedMap && mockMaps.length > 0) {
      setSelectedMap(mockMaps[0]);
    }
  };

  const generateProcessMap = async (processId: string, mapType: ProcessMap['type']) => {
    setIsGenerating(true);
    
    // Mock generation process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // In real implementation, this would call the AI service to generate the map
    const newMap: ProcessMap = {
      id: `map-${Date.now()}`,
      processId,
      type: mapType,
      metadata: {
        generatedFrom: 'text',
        confidence: 0.85,
        lastUpdated: new Date(),
        version: '1.0',
        stakeholders: []
      },
      diagram: [],
      interactiveElements: []
    };
    
    setProcessMaps(prev => [...prev, newMap]);
    setSelectedMap(newMap);
    setIsGenerating(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-400 bg-green-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      case 'violation': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getElementColor = (element: DiagramElement) => {
    switch (element.type) {
      case 'start': return 'border-green-500 bg-green-500/20';
      case 'end': return 'border-red-500 bg-red-500/20';
      case 'task': return 'border-blue-500 bg-blue-500/20';
      case 'decision': return 'border-yellow-500 bg-yellow-500/20';
      case 'gateway': return 'border-purple-500 bg-purple-500/20';
      default: return 'border-slate-500 bg-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-200">Visual Process Intelligence</h1>
          <p className="text-slate-400 mt-1">
            Auto-generated BPMN diagrams, swimlanes, and interactive process maps
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-800 rounded-lg p-1">
            {(['bpmn', 'swimlane', 'heatmap', 'dependency'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeView === view
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {view.toUpperCase()}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setShowMapConfig(true)}
            disabled={isGenerating}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-600/50 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                Generating...
              </>
            ) : (
              <>
                <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z" />
                Generate Map
              </>
            )}
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Process Maps</p>
              <p className="text-2xl font-bold text-slate-200">{processMaps.length}</p>
            </div>
            <Icon path="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l-1-3m1 3l-1-3m-16.5 0l1 3m-1-3l1 3" className="w-8 h-8 text-sky-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Avg Confidence</p>
              <p className="text-2xl font-bold text-slate-200">
                {processMaps.length > 0 ? 
                  Math.round((processMaps.reduce((acc, m) => acc + m.metadata.confidence, 0) / processMaps.length) * 100) + '%'
                  : '0%'
                }
              </p>
            </div>
            <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-green-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Interactive Elements</p>
              <p className="text-2xl font-bold text-slate-200">
                {processMaps.reduce((acc, m) => acc + m.interactiveElements.length, 0)}
              </p>
            </div>
            <Icon path="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" className="w-8 h-8 text-purple-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Map Types</p>
              <p className="text-2xl font-bold text-slate-200">
                {new Set(processMaps.map(m => m.type)).size}
              </p>
            </div>
            <Icon path="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m-15 0A2.25 2.25 0 005.25 12v6.75a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0017.25 18.75V12a2.25 2.25 0 00-1.5-2.122m-15 0V9a2.25 2.25 0 012.25-2.25" className="w-8 h-8 text-yellow-400" />
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map List */}
        <div>
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Process Maps</h3>
            
            <div className="space-y-3">
              {processMaps.map((map) => (
                <div
                  key={map.id}
                  onClick={() => setSelectedMap(map)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedMap?.id === map.id
                      ? 'bg-sky-600/20 border border-sky-600/50'
                      : 'bg-slate-800/50 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-slate-200">Process {map.processId}</h4>
                    <span className="text-xs text-slate-400 uppercase bg-slate-700/50 px-2 py-1 rounded">
                      {map.type}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Confidence:</span>
                      <span className={getConfidenceColor(map.metadata.confidence)}>
                        {Math.round(map.metadata.confidence * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Elements:</span>
                      <span className="text-slate-200">{map.diagram.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Updated:</span>
                      <span className="text-slate-400">{map.metadata.lastUpdated.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Main Canvas */}
        <div className="lg:col-span-3">
          {selectedMap ? (
            <GlassCard className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-200">
                    Process {selectedMap.processId} - {selectedMap.type.toUpperCase()} View
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                    <span>Version: {selectedMap.metadata.version}</span>
                    <span>Generated from: {selectedMap.metadata.generatedFrom}</span>
                    <span className={getConfidenceColor(selectedMap.metadata.confidence)}>
                      Confidence: {Math.round(selectedMap.metadata.confidence * 100)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-sm">
                    Export SVG
                  </button>
                  <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-sm">
                    Share
                  </button>
                </div>
              </div>

              {/* Process Diagram Canvas */}
              <div className="relative bg-slate-900/50 rounded-lg p-8 min-h-[500px] overflow-auto">
                {activeView === 'bpmn' && selectedMap.type === 'bpmn' && (
                  <div className="relative" style={{ width: '1000px', height: '400px' }}>
                    {/* Render BPMN elements */}
                    {selectedMap.diagram.map((element) => (
                      <div
                        key={element.id}
                        className={`absolute border-2 rounded-lg p-2 text-xs font-medium text-center cursor-pointer hover:scale-105 transition-transform ${getElementColor(element)}`}
                        style={{
                          left: element.position.x,
                          top: element.position.y,
                          width: element.type === 'decision' ? '80px' : '120px',
                          height: element.type === 'start' || element.type === 'end' ? '40px' : '60px',
                          borderRadius: element.type === 'start' || element.type === 'end' ? '50%' : 
                                       element.type === 'decision' ? '12px' : '8px',
                          transform: element.type === 'decision' ? 'rotate(45deg)' : 'none'
                        }}
                        title={`${element.type}: ${element.label}`}
                      >
                        <div className={element.type === 'decision' ? 'transform -rotate-45' : ''}>
                          {element.label}
                        </div>
                        
                        {/* Performance indicators */}
                        {selectedMap.interactiveElements.find(ie => ie.elementId === element.id) && (
                          <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-yellow-500 border-2 border-slate-900"></div>
                        )}
                      </div>
                    ))}
                    
                    {/* Render connections */}
                    <svg className="absolute inset-0 pointer-events-none" style={{ width: '1000px', height: '400px' }}>
                      {selectedMap.diagram.map((element) =>
                        element.connections.map((connection, index) => {
                          const target = selectedMap.diagram.find(e => e.id === connection.targetId);
                          if (!target) return null;
                          
                          return (
                            <g key={`${element.id}-${connection.targetId}-${index}`}>
                              <line
                                x1={element.position.x + 60}
                                y1={element.position.y + 30}
                                x2={target.position.x}
                                y2={target.position.y + 30}
                                stroke="#64748b"
                                strokeWidth="2"
                                markerEnd="url(#arrowhead)"
                              />
                              {connection.label && (
                                <text
                                  x={(element.position.x + target.position.x) / 2}
                                  y={(element.position.y + target.position.y) / 2 - 10}
                                  fill="#94a3b8"
                                  fontSize="10"
                                  textAnchor="middle"
                                >
                                  {connection.label}
                                </text>
                              )}
                            </g>
                          );
                        })
                      )}
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="10"
                          markerHeight="7"
                          refX="9"
                          refY="3.5"
                          orient="auto"
                        >
                          <polygon
                            points="0 0, 10 3.5, 0 7"
                            fill="#64748b"
                          />
                        </marker>
                      </defs>
                    </svg>
                  </div>
                )}
                
                {activeView === 'heatmap' && (
                  <div className="text-center py-20">
                    <Icon path="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-slate-200 mb-2">Performance Heatmap</h4>
                    <p className="text-slate-400">Heatmap view showing performance hotspots and bottlenecks</p>
                  </div>
                )}
                
                {activeView === 'dependency' && (
                  <div className="text-center py-20">
                    <Icon path="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-slate-200 mb-2">Dependency Map</h4>
                    <p className="text-slate-400">Visual representation of process dependencies and upstream/downstream impacts</p>
                  </div>
                )}
              </div>

              {/* Interactive Elements Panel */}
              {selectedMap.interactiveElements.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <h4 className="text-lg font-semibold text-slate-200 mb-4">Performance Insights</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedMap.interactiveElements.map((element) => {
                      const diagramElement = selectedMap.diagram.find(de => de.id === element.elementId);
                      return (
                        <div key={element.elementId} className="p-4 bg-slate-800/50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-slate-200">{diagramElement?.label}</h5>
                            {element.complianceStatus && (
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getComplianceColor(element.complianceStatus)}`}>
                                {element.complianceStatus}
                              </span>
                            )}
                          </div>
                          
                          {element.performanceData && (
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Avg Duration:</span>
                                <span className="text-slate-200">{element.performanceData.avgDuration}min</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Completion Rate:</span>
                                <span className="text-green-400">{element.performanceData.completionRate}%</span>
                              </div>
                            </div>
                          )}
                          
                          {element.alerts && element.alerts.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-slate-700/50">
                              <div className="space-y-1">
                                {element.alerts.map((alert, index) => (
                                  <div key={index} className="text-xs text-yellow-400 flex items-center gap-1">
                                    <Icon path="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" className="w-3 h-3" />
                                    {alert}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </GlassCard>
          ) : (
            <GlassCard className="p-6 text-center">
              <Icon path="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l-1-3m1 3l-1-3m-16.5 0l1 3m-1-3l1 3" className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-200 mb-2">Select Process Map</h3>
              <p className="text-slate-400 mb-6">
                Choose a process map to view interactive diagrams and performance insights
              </p>
              <button
                onClick={() => setShowMapConfig(true)}
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
              >
                Generate New Map
              </button>
            </GlassCard>
          )}
        </div>
      </div>

      {showMapConfig && (
        <MapGenerationModal
          onClose={() => setShowMapConfig(false)}
          onGenerate={generateProcessMap}
        />
      )}
    </div>
  );
};

const MapGenerationModal: React.FC<{
  onClose: () => void;
  onGenerate: (processId: string, mapType: ProcessMap['type']) => void;
}> = ({ onClose, onGenerate }) => {
  const [processId, setProcessId] = useState('');
  const [mapType, setMapType] = useState<ProcessMap['type']>('bpmn');
  const [sourceType, setSourceType] = useState<'text' | 'discovery' | 'template'>('text');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (processId) {
      onGenerate(processId, mapType);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <GlassCard className="w-full max-w-md p-6 mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-200">Generate Process Map</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200"
          >
            <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Process ID
            </label>
            <input
              type="text"
              value={processId}
              onChange={(e) => setProcessId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g., proc-1"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Map Type
            </label>
            <select
              value={mapType}
              onChange={(e) => setMapType(e.target.value as ProcessMap['type'])}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="bpmn">BPMN Diagram</option>
              <option value="swimlane">Swimlane Diagram</option>
              <option value="flowchart">Flowchart</option>
              <option value="heatmap">Performance Heatmap</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Source
            </label>
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="text">Text Description</option>
              <option value="discovery">Process Discovery</option>
              <option value="template">Template Library</option>
            </select>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
            >
              Generate
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default VisualIntelligencePage;