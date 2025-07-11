import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  useReactFlow,
} from 'reactflow';
import type {
  Node,
  Connection,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';

import GoalNode from './GoalNode';
import TreeControls from './TreeControls';
import type { Objective } from '../../../utils/hierarchyTransformers';
import { transformObjectivesToFlow, calculateTreeStats } from '../../../utils/hierarchyTransformers';

interface GoalTreeProps {
  objectives: Objective[];
  onUpdateObjective?: (objective: Objective) => void;
  onAddChild?: (parentId: string) => void;
  onEditObjective?: (objectiveId: string) => void;
  onReorganize?: (sourceId: string, targetId: string) => void;
}

const nodeTypes: NodeTypes = {
  goalNode: GoalNode,
};

const defaultEdgeOptions = {
  style: { strokeWidth: 2, stroke: '#475569' },
  type: 'smoothstep',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#475569',
  },
};

const GoalTree: React.FC<GoalTreeProps> = ({
  objectives,
  onAddChild,
  onEditObjective,
  onReorganize,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(objectives.filter(obj => obj.level === 'corporate').map(obj => obj.id))
  );
  
  const { fitView } = useReactFlow();

  const handleToggleExpand = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  // Transform objectives to flow data
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const flowData = transformObjectivesToFlow(objectives, expandedNodes);
    
    // Add callback handlers to nodes
    const enhancedNodes = flowData.nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onToggleExpand: handleToggleExpand,
        onEdit: onEditObjective,
        onAddChild: onAddChild,
      },
    }));

    return {
      nodes: enhancedNodes,
      edges: flowData.edges,
    };
  }, [objectives, expandedNodes, handleToggleExpand, onEditObjective, onAddChild]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Calculate statistics
  const stats = useMemo(() => calculateTreeStats(objectives), [objectives]);

  const handleExpandAll = useCallback(() => {
    const getAllIds = (obj: Objective): string[] => {
      const ids = [obj.id];
      if (obj.children) {
        obj.children.forEach(child => ids.push(...getAllIds(child)));
      }
      return ids;
    };

    const allIds = objectives.flatMap(getAllIds);
    setExpandedNodes(new Set(allIds));
  }, [objectives]);

  const handleCollapseAll = useCallback(() => {
    const corporateIds = objectives
      .filter(obj => obj.level === 'corporate')
      .map(obj => obj.id);
    setExpandedNodes(new Set(corporateIds));
  }, [objectives]);

  const handleFitView = useCallback(() => {
    fitView({ duration: 800, padding: 0.2 });
  }, [fitView]);

  const handleAutoLayout = useCallback(() => {
    // Regenerate layout with current expanded state
    const { nodes: newNodes, edges: newEdges } = transformObjectivesToFlow(objectives, expandedNodes);
    
    const enhancedNodes = newNodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onToggleExpand: handleToggleExpand,
        onEdit: onEditObjective,
        onAddChild: onAddChild,
      },
    }));

    setNodes(enhancedNodes);
    setEdges(newEdges);
    
    // Fit view after a brief delay to allow for layout
    setTimeout(() => {
      fitView({ duration: 800, padding: 0.2 });
    }, 100);
  }, [objectives, expandedNodes, handleToggleExpand, onEditObjective, onAddChild, fitView, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle node drag and drop for reorganization
  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    // Find if node was dropped on another node
    const elements = document.elementsFromPoint(event.clientX, event.clientY);
    const targetNodeElement = elements.find(el => 
      el.classList.contains('react-flow__node') && 
      el.getAttribute('data-id') !== node.id
    );

    if (targetNodeElement && onReorganize) {
      const targetNodeId = targetNodeElement.getAttribute('data-id');
      if (targetNodeId) {
        onReorganize(node.id, targetNodeId);
      }
    }
  }, [onReorganize]);

  // Update nodes when data changes
  React.useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = transformObjectivesToFlow(objectives, expandedNodes);
    
    const enhancedNodes = newNodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onToggleExpand: handleToggleExpand,
        onEdit: onEditObjective,
        onAddChild: onAddChild,
      },
    }));

    setNodes(enhancedNodes);
    setEdges(newEdges);
  }, [objectives, expandedNodes, handleToggleExpand, onEditObjective, onAddChild, setNodes, setEdges]);

  return (
    <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        attributionPosition="bottom-right"
        className="bg-slate-900"
        minZoom={0.1}
        maxZoom={2}
      >
        <Background 
          color="#1e293b" 
          gap={20} 
          size={1}
          style={{ backgroundColor: '#0f172a' }}
        />
        
        <TreeControls
          onFitView={handleFitView}
          onZoomIn={() => {}}
          onZoomOut={() => {}}
          onExpandAll={handleExpandAll}
          onCollapseAll={handleCollapseAll}
          onAutoLayout={handleAutoLayout}
          stats={stats}
        />
      </ReactFlow>
    </div>
  );
};

export default GoalTree;