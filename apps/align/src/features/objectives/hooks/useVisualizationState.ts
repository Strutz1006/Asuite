import { useState, useCallback, useMemo } from 'react';
import type { Objective } from '../utils/hierarchyTransformers';

export interface VisualizationState {
  expandedNodes: Set<string>;
  selectedNode: string | null;
  viewMode: 'list' | 'tree' | 'sunburst' | 'mindmap';
  filterLevel: 'all' | 'corporate' | 'department' | 'team' | 'individual';
  filterStatus: 'all' | 'active' | 'on-track' | 'at-risk' | 'completed' | 'paused';
}

export const useVisualizationState = (objectives: Objective[]) => {
  const [state, setState] = useState<VisualizationState>(() => {
    // Initialize with corporate level expanded
    const corporateIds = objectives
      .filter(obj => obj.level === 'corporate')
      .map(obj => obj.id);
    
    return {
      expandedNodes: new Set(corporateIds),
      selectedNode: null,
      viewMode: 'list',
      filterLevel: 'all',
      filterStatus: 'all',
    };
  });

  const toggleNodeExpansion = useCallback((nodeId: string) => {
    setState(prev => {
      const newExpanded = new Set(prev.expandedNodes);
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }
      return {
        ...prev,
        expandedNodes: newExpanded,
      };
    });
  }, []);

  const expandAllNodes = useCallback(() => {
    const getAllIds = (objs: Objective[]): string[] => {
      const ids: string[] = [];
      objs.forEach(obj => {
        ids.push(obj.id);
        if (obj.children) {
          ids.push(...getAllIds(obj.children));
        }
      });
      return ids;
    };

    setState(prev => ({
      ...prev,
      expandedNodes: new Set(getAllIds(objectives)),
    }));
  }, [objectives]);

  const collapseAllNodes = useCallback(() => {
    const corporateIds = objectives
      .filter(obj => obj.level === 'corporate')
      .map(obj => obj.id);
    
    setState(prev => ({
      ...prev,
      expandedNodes: new Set(corporateIds),
    }));
  }, [objectives]);

  const selectNode = useCallback((nodeId: string | null) => {
    setState(prev => ({
      ...prev,
      selectedNode: nodeId,
    }));
  }, []);

  const setViewMode = useCallback((viewMode: VisualizationState['viewMode']) => {
    setState(prev => ({
      ...prev,
      viewMode,
    }));
  }, []);

  const setFilterLevel = useCallback((filterLevel: VisualizationState['filterLevel']) => {
    setState(prev => ({
      ...prev,
      filterLevel,
    }));
  }, []);

  const setFilterStatus = useCallback((filterStatus: VisualizationState['filterStatus']) => {
    setState(prev => ({
      ...prev,
      filterStatus,
    }));
  }, []);

  // Memoized filtered objectives
  const filteredObjectives = useMemo(() => {
    const filterByLevel = (objs: Objective[]): Objective[] => {
      return objs
        .filter(obj => {
          if (state.filterLevel === 'all') return true;
          return obj.level === state.filterLevel;
        })
        .map(obj => ({
          ...obj,
          children: obj.children ? filterByLevel(obj.children) : undefined,
        }))
        .filter(obj => {
          // Keep nodes that either match the filter or have matching children
          if (state.filterLevel === 'all') return true;
          return obj.level === state.filterLevel || (obj.children && obj.children.length > 0);
        });
    };

    const filterByStatus = (objs: Objective[]): Objective[] => {
      return objs
        .filter(obj => {
          if (state.filterStatus === 'all') return true;
          return obj.status === state.filterStatus;
        })
        .map(obj => ({
          ...obj,
          children: obj.children ? filterByStatus(obj.children) : undefined,
        }))
        .filter(obj => {
          // Keep nodes that either match the filter or have matching children
          if (state.filterStatus === 'all') return true;
          return obj.status === state.filterStatus || (obj.children && obj.children.length > 0);
        });
    };

    let filtered = objectives;
    
    if (state.filterLevel !== 'all') {
      filtered = filterByLevel(filtered);
    }
    
    if (state.filterStatus !== 'all') {
      filtered = filterByStatus(filtered);
    }
    
    return filtered;
  }, [objectives, state.filterLevel, state.filterStatus]);

  return {
    state,
    filteredObjectives,
    actions: {
      toggleNodeExpansion,
      expandAllNodes,
      collapseAllNodes,
      selectNode,
      setViewMode,
      setFilterLevel,
      setFilterStatus,
    },
  };
};