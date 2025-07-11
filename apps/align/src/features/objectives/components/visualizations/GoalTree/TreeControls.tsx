import React from 'react';
import { Panel, useReactFlow, useViewport } from 'reactflow';

interface TreeControlsProps {
  onFitView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onAutoLayout: () => void;
  stats: {
    totalNodes: number;
    completedNodes: number;
    atRiskNodes: number;
    averageProgress: number;
  };
}

const TreeControls: React.FC<TreeControlsProps> = ({
  onFitView,
  onZoomIn,
  onZoomOut,
  onExpandAll,
  onCollapseAll,
  onAutoLayout,
  stats
}) => {
  const { zoomIn, zoomOut } = useReactFlow();
  const { zoom } = useViewport();

  const handleZoomIn = () => {
    zoomIn();
    onZoomIn();
  };

  const handleZoomOut = () => {
    zoomOut();
    onZoomOut();
  };

  return (
    <>
      {/* Main Controls Panel */}
      <Panel position="top-right" className="space-y-2">
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-lg p-3 border border-slate-700/80">
          <div className="space-y-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleZoomIn}
                className="p-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-lg transition-colors"
                title="Zoom In"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <span className="text-xs text-slate-400 px-2 min-w-[3rem] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomOut}
                className="p-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-lg transition-colors"
                title="Zoom Out"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={onFitView}
                className="p-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-lg transition-colors"
                title="Fit to View"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              </button>
              <button
                onClick={onAutoLayout}
                className="p-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-lg transition-colors"
                title="Auto Layout"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </button>
            </div>

            {/* Expand/Collapse Controls */}
            <div className="border-t border-slate-700 pt-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={onExpandAll}
                  className="px-3 py-1 text-xs bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded transition-colors"
                >
                  Expand All
                </button>
                <button
                  onClick={onCollapseAll}
                  className="px-3 py-1 text-xs bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded transition-colors"
                >
                  Collapse All
                </button>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {/* Stats Panel */}
      <Panel position="top-left" className="space-y-2">
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-lg p-3 border border-slate-700/80">
          <h3 className="text-sm font-semibold text-white mb-2">Goal Statistics</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Goals:</span>
              <span className="text-white font-semibold">{stats.totalNodes}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Completed:</span>
              <span className="text-green-400 font-semibold">{stats.completedNodes}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">At Risk:</span>
              <span className="text-red-400 font-semibold">{stats.atRiskNodes}</span>
            </div>
            <div className="border-t border-slate-700 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Avg Progress:</span>
                <span className="text-sky-400 font-semibold">
                  {Math.round(stats.averageProgress)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {/* Legend Panel */}
      <Panel position="bottom-left" className="space-y-2">
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-lg p-3 border border-slate-700/80">
          <h3 className="text-sm font-semibold text-white mb-2">Legend</h3>
          <div className="space-y-2">
            {/* Level Colors */}
            <div>
              <div className="text-xs text-slate-400 mb-1">Levels</div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-slate-300">Corporate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-slate-300">Department</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-slate-300">Team</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-sky-500"></div>
                  <span className="text-slate-300">Individual</span>
                </div>
              </div>
            </div>

            {/* Priority Colors */}
            <div className="border-t border-slate-700 pt-2">
              <div className="text-xs text-slate-400 mb-1">Priority</div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-red-500"></div>
                  <span className="text-slate-300">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-yellow-500"></div>
                  <span className="text-slate-300">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-green-500"></div>
                  <span className="text-slate-300">Low</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </>
  );
};

export default TreeControls;