import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import type { Objective } from '../../../utils/hierarchyTransformers';

interface SunburstNode extends d3.HierarchyRectangularNode<Objective> {
  current?: SunburstNode;
  target?: SunburstNode;
}

interface SunburstChartProps {
  objectives: Objective[];
  onUpdateObjective?: (objective: Objective) => void;
  onAddChild?: (parentId: string) => void;
  onEditObjective?: (objectiveId: string) => void;
}

interface SunburstData {
  name: string;
  value: number;
  progress: number;
  status: string;
  level: string;
  objective?: Objective;
  children?: SunburstData[];
}

const SunburstChart: React.FC<SunburstChartProps> = ({
  objectives,
  onUpdateObjective,
  onAddChild,
  onEditObjective
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<SunburstNode | null>(null);
  const [currentData, setCurrentData] = useState<SunburstData | null>(null);

  // Transform objectives data to hierarchical format for D3
  const transformDataForSunburst = useCallback((objectives: Objective[]): SunburstData => {
    const createHierarchy = (objs: Objective[], parentLevel = ''): SunburstData[] => {
      return objs.map(obj => ({
        name: obj.title,
        value: obj.keyResults.length || 1, // Use number of key results as value, minimum 1
        progress: obj.progress,
        status: obj.status,
        level: obj.level,
        objective: obj,
        children: obj.children ? createHierarchy(obj.children, obj.level) : undefined
      }));
    };

    const corporateObjectives = objectives.filter(obj => obj.level === 'corporate');
    
    return {
      name: 'Goals',
      value: 1,
      progress: 0,
      status: 'active',
      level: 'root',
      children: createHierarchy(corporateObjectives)
    };
  }, []);

  // Color schemes for different levels and statuses
  const levelColors = {
    root: '#1e293b',
    corporate: '#a855f7',
    department: '#3b82f6', 
    team: '#10b981',
    individual: '#0ea5e9'
  };

  const statusColors = {
    'active': '#3b82f6',
    'on-track': '#10b981',
    'at-risk': '#f59e0b',
    'completed': '#6b7280',
    'paused': '#ef4444'
  };

  const getNodeColor = (d: SunburstData): string => {
    if (d.level === 'root') return levelColors.root;
    return statusColors[d.status as keyof typeof statusColors] || levelColors[d.level as keyof typeof levelColors];
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 80) return '#10b981'; // green
    if (progress >= 60) return '#f59e0b'; // amber
    if (progress >= 40) return '#fb7185'; // rose
    return '#ef4444'; // red
  };

  useEffect(() => {
    if (!svgRef.current || objectives.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const width = 800;
    const height = 800;
    const radius = Math.min(width, height) / 2 - 10;

    // Set up the SVG
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('font', '12px sans-serif');

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Create the data hierarchy
    const data = transformDataForSunburst(objectives);
    const root = d3
      .hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // Create the partition layout
    const partition = d3.partition<SunburstData>()
      .size([2 * Math.PI, radius]);

    partition(root);

    // Create the arc generator
    const arc = d3
      .arc<SunburstNode>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1);

    // Create the progress arc generator (for showing progress as fill)
    const progressArc = d3
      .arc<SunburstNode>()
      .startAngle(d => d.x0)
      .endAngle(d => {
        const totalAngle = d.x1 - d.x0;
        const progressAngle = totalAngle * ((d.data.progress || 0) / 100);
        return d.x0 + progressAngle;
      })
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1);

    // Tooltip functions
    const showTooltip = (event: MouseEvent, d: SunburstNode) => {
      if (!tooltipRef.current || !svgRef.current) return;
      
      const tooltip = d3.select(tooltipRef.current);
      const objective = d.data.objective;
      
      // Get the bounding rect of the SVG container to position tooltip relative to it
      const svgRect = svgRef.current.getBoundingClientRect();
      const x = event.clientX - svgRect.left;
      const y = event.clientY - svgRect.top;
      
      tooltip
        .style('opacity', 1)
        .style('left', Math.min(x + 10, svgRect.width - 250) + 'px')
        .style('top', Math.min(y - 10, svgRect.height - 150) + 'px')
        .html(`
          <div class="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
            <div class="font-semibold text-slate-100 mb-2">${d.data.name}</div>
            ${objective ? `
              <div class="text-xs text-slate-300 space-y-1">
                <div><span class="text-slate-400">Level:</span> ${objective.level}</div>
                <div><span class="text-slate-400">Owner:</span> ${objective.ownerName}</div>
                <div><span class="text-slate-400">Status:</span> ${objective.status}</div>
                <div><span class="text-slate-400">Progress:</span> ${objective.progress}%</div>
                <div><span class="text-slate-400">Key Results:</span> ${objective.keyResults.length}</div>
                ${objective.dueDate ? `<div><span class="text-slate-400">Due:</span> ${objective.dueDate.toLocaleDateString()}</div>` : ''}
              </div>
            ` : ''}
          </div>
        `);
    };

    const hideTooltip = () => {
      if (!tooltipRef.current) return;
      d3.select(tooltipRef.current).style('opacity', 0);
    };

    // Create the segments
    const path = g
      .selectAll('path')
      .data(root.descendants())
      .join('path')
      .attr('d', arc as any)
      .style('fill', d => getNodeColor(d.data))
      .style('stroke', '#1e293b')
      .style('stroke-width', 2)
      .style('cursor', 'pointer')
      .style('opacity', 0.8)
      .on('mouseover', function(event, d) {
        d3.select(this).style('opacity', 1);
        showTooltip(event, d as SunburstNode);
      })
      .on('mousemove', function(event, d) {
        showTooltip(event, d as SunburstNode);
      })
      .on('mouseout', function() {
        d3.select(this).style('opacity', 0.8);
        hideTooltip();
      })
      .on('click', function(event, d) {
        // Zoom to clicked segment
        const node = d as SunburstNode;
        setSelectedNode(node);
        setCurrentData(node.data);
        
        // Handle click events
        if (event.detail === 2 && node.data.objective && onEditObjective) {
          // Double click to edit
          onEditObjective(node.data.objective.id);
        }
      });

    // Add progress overlay
    const progressPaths = g
      .selectAll('.progress-arc')
      .data(root.descendants().filter(d => d.data.progress > 0))
      .join('path')
      .attr('class', 'progress-arc')
      .attr('d', progressArc as any)
      .style('fill', d => getProgressColor(d.data.progress))
      .style('opacity', 0.6)
      .style('pointer-events', 'none');

    // Add labels for larger segments
    const label = g
      .selectAll('text')
      .data(root.descendants().filter(d => (d.x1 - d.x0) > 0.1))
      .join('text')
      .attr('transform', d => {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      })
      .attr('dy', '0.35em')
      .style('text-anchor', 'middle')
      .style('font-size', d => Math.min(12, ((d.x1 - d.x0) * 50)) + 'px')
      .style('fill', 'white')
      .style('pointer-events', 'none')
      .text(d => d.data.name.length > 15 ? d.data.name.substring(0, 15) + '...' : d.data.name);

    // Add center circle with summary info
    const centerCircle = g
      .append('circle')
      .attr('r', root.children?.[0]?.y0 || 50)
      .style('fill', '#0f172a')
      .style('stroke', '#334155')
      .style('stroke-width', 2);

    // Add center text
    const centerText = g.append('g').attr('class', 'center-text');
    
    centerText
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('fill', '#f1f5f9')
      .text('Strategic Goals');

    const totalObjectives = objectives.length;
    const avgProgress = objectives.reduce((sum, obj) => sum + obj.progress, 0) / totalObjectives || 0;
    
    centerText
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.8em')
      .style('font-size', '12px')
      .style('fill', '#94a3b8')
      .text(`${totalObjectives} Objectives`);

    centerText
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '2em')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', getProgressColor(avgProgress))
      .text(`${Math.round(avgProgress)}% Complete`);

  }, [objectives, transformDataForSunburst, onEditObjective]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Controls */}
      <div className="mb-4 flex items-center gap-4 bg-slate-800/50 rounded-lg p-3 border border-slate-700">
        <div className="text-sm text-slate-300">
          <span className="font-semibold">Sunburst View:</span> Click segments to explore • Double-click to edit
        </div>
        {selectedNode && selectedNode.data.objective && (
          <div className="flex gap-2">
            {onAddChild && (
              <button
                onClick={() => onAddChild(selectedNode.data.objective!.id)}
                className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white text-xs rounded transition-colors"
              >
                Add Child Goal
              </button>
            )}
            {onEditObjective && (
              <button
                onClick={() => onEditObjective(selectedNode.data.objective!.id)}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
              >
                Edit Goal
              </button>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="text-slate-400 font-semibold">Levels:</div>
          {Object.entries(levelColors).map(([level, color]) => (
            level !== 'root' && (
              <div key={level} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded" 
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-slate-300 capitalize">{level}</span>
              </div>
            )
          ))}
        </div>
        <div className="flex items-center gap-6">
          <div className="text-slate-400 font-semibold">Status:</div>
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded" 
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-slate-300 capitalize">{status.replace('-', ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative bg-slate-900/50 rounded-lg border border-slate-700 p-4 overflow-hidden">
        <svg ref={svgRef} className="drop-shadow-lg mx-auto"></svg>
        
        {/* Tooltip - positioned relative to SVG container */}
        <div
          ref={tooltipRef}
          className="absolute pointer-events-none opacity-0 z-10 transition-opacity duration-200 max-w-xs"
          style={{ left: 0, top: 0 }}
        ></div>
      </div>

      {/* Selected Node Info */}
      {selectedNode && selectedNode.data.objective && (
        <div className="mt-4 w-full max-w-2xl bg-slate-800/90 backdrop-blur-xl rounded-lg p-4 border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-100 mb-2">
            {selectedNode.data.name}
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-slate-400 mb-1">Details</div>
              <div className="text-slate-300 space-y-1">
                <div>Level: <span className="capitalize">{selectedNode.data.level}</span></div>
                <div>Owner: {selectedNode.data.objective.ownerName}</div>
                <div>Status: <span className="capitalize">{selectedNode.data.status.replace('-', ' ')}</span></div>
              </div>
            </div>
            <div>
              <div className="text-slate-400 mb-1">Progress</div>
              <div className="text-slate-300 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${selectedNode.data.progress}%`,
                        backgroundColor: getProgressColor(selectedNode.data.progress)
                      }}
                    ></div>
                  </div>
                  <span>{selectedNode.data.progress}%</span>
                </div>
                <div>Key Results: {selectedNode.data.objective.keyResults.length}</div>
                {selectedNode.data.objective.dueDate && (
                  <div>Due: {selectedNode.data.objective.dueDate.toLocaleDateString()}</div>
                )}
              </div>
            </div>
          </div>
          {selectedNode.data.objective.description && (
            <div className="mt-3 pt-3 border-t border-slate-700">
              <div className="text-slate-400 text-sm mb-1">Description</div>
              <div className="text-slate-300 text-sm">{selectedNode.data.objective.description}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SunburstChart;