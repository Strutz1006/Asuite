import type { Node, Edge } from 'reactflow';

export interface Objective {
  id: string;
  title: string;
  description: string;
  level: 'corporate' | 'department' | 'team' | 'individual';
  parentId?: string;
  ownerId: string;
  ownerName: string;
  department?: string;
  team?: string;
  progress: number;
  status: 'active' | 'on-track' | 'at-risk' | 'completed' | 'paused';
  priority: 'high' | 'medium' | 'low';
  startDate: Date;
  dueDate: Date;
  keyResults: Array<{
    id: string;
    title: string;
    currentValue: string;
    targetValue: string;
    unit: string;
    progress: number;
  }>;
  children?: Objective[];
}

const levelColors = {
  corporate: '#a855f7', // Purple
  department: '#3b82f6', // Blue
  team: '#10b981', // Green
  individual: '#0ea5e9', // Sky
};

const statusColors = {
  'active': '#3b82f6',
  'on-track': '#10b981',
  'at-risk': '#f59e0b',
  'completed': '#6b7280',
  'paused': '#ef4444'
};

export function transformObjectivesToFlow(
  objectives: Objective[],
  expandedNodes: Set<string> = new Set()
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const positions = new Map<string, { x: number; y: number }>();

  // Calculate positions using a tree layout algorithm
  const calculatePositions = (
    items: Objective[],
    parentId: string | null = null,
    depth: number = 0,
    siblingIndex: number = 0,
    totalSiblings: number = 1
  ) => {
    const verticalSpacing = 120;
    const horizontalSpacing = 350;
    const sectionWidth = horizontalSpacing * totalSiblings;
    const startX = parentId ? (positions.get(parentId)?.x || 0) - sectionWidth / 2 : 0;

    items.forEach((item, index) => {
      const x = startX + (horizontalSpacing * (siblingIndex + index)) + (horizontalSpacing * index);
      const y = depth * verticalSpacing;
      
      positions.set(item.id, { x, y });

      // Create node
      const node: Node = {
        id: item.id,
        type: 'goalNode',
        position: { x, y },
        data: {
          objective: item,
          isExpanded: expandedNodes.has(item.id),
          levelColor: levelColors[item.level],
          statusColor: statusColors[item.status],
        },
      };
      nodes.push(node);

      // Create edge to parent
      if (parentId) {
        edges.push({
          id: `${parentId}-${item.id}`,
          source: parentId,
          target: item.id,
          type: 'smoothstep',
          animated: item.status === 'active',
          style: {
            stroke: '#475569',
            strokeWidth: 2,
          },
        });
      }

      // Process children if expanded
      if (item.children && item.children.length > 0 && expandedNodes.has(item.id)) {
        calculatePositions(
          item.children,
          item.id,
          depth + 1,
          0,
          item.children.length
        );
      }
    });
  };

  // Start with corporate level objectives
  const corporateObjectives = objectives.filter(obj => obj.level === 'corporate');
  calculatePositions(corporateObjectives, null, 0, 0, corporateObjectives.length);

  return { nodes, edges };
}

export function flattenObjectives(objectives: Objective[]): Objective[] {
  const flattened: Objective[] = [];
  
  const traverse = (items: Objective[]) => {
    items.forEach(item => {
      flattened.push(item);
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      }
    });
  };
  
  traverse(objectives);
  return flattened;
}

export function findObjectiveById(objectives: Objective[], id: string): Objective | null {
  for (const obj of objectives) {
    if (obj.id === id) return obj;
    if (obj.children) {
      const found = findObjectiveById(obj.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function updateObjectiveParent(
  objectives: Objective[],
  objectiveId: string,
  newParentId: string | null
): Objective[] {
  const objective = findObjectiveById(objectives, objectiveId);
  if (!objective) return objectives;

  // Remove from current location
  const removeFromTree = (items: Objective[]): Objective[] => {
    return items
      .filter(item => item.id !== objectiveId)
      .map(item => ({
        ...item,
        children: item.children ? removeFromTree(item.children) : []
      }));
  };

  let updatedObjectives = removeFromTree(objectives);

  // Add to new location
  if (newParentId) {
    const addToParent = (items: Objective[]): Objective[] => {
      return items.map(item => {
        if (item.id === newParentId) {
          return {
            ...item,
            children: [...(item.children || []), { ...objective, parentId: newParentId }]
          };
        }
        return {
          ...item,
          children: item.children ? addToParent(item.children) : []
        };
      });
    };
    updatedObjectives = addToParent(updatedObjectives);
  } else {
    // Add to root level
    updatedObjectives.push({ ...objective, parentId: undefined });
  }

  return updatedObjectives;
}

export function calculateTreeStats(objectives: Objective[]): {
  totalNodes: number;
  completedNodes: number;
  atRiskNodes: number;
  averageProgress: number;
} {
  const allObjectives = flattenObjectives(objectives);
  
  return {
    totalNodes: allObjectives.length,
    completedNodes: allObjectives.filter(obj => obj.status === 'completed').length,
    atRiskNodes: allObjectives.filter(obj => obj.status === 'at-risk').length,
    averageProgress: allObjectives.reduce((sum, obj) => sum + obj.progress, 0) / allObjectives.length
  };
}