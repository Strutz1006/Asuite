import React, { useState, Suspense, useMemo } from 'react';
import { ReactFlowProvider } from 'reactflow';
import VisualizationToggle from './VisualizationToggle';
import type { ViewMode } from './VisualizationToggle';
import type { Objective, alignObjectivesToLegacy } from '../utils/hierarchyTransformers';
import type { AlignObjective } from '../../../types/database';

// Lazy load the heavy visualization components
const GoalTree = React.lazy(() => import('./visualizations/GoalTree/GoalTree'));
const SunburstChart = React.lazy(() => import('./visualizations/Sunburst/SunburstChart'));

interface GoalVisualizationContainerProps {
  objectives: AlignObjective[];
  onUpdateObjective?: (objective: AlignObjective) => void;
  onAddChild?: (parentId: string) => void;
  onEditObjective?: (objectiveId: string) => void;
  onReorganize?: (sourceId: string, targetId: string) => void;
  renderListView: () => React.ReactNode;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-96 bg-slate-800/50 rounded-lg">
    <div className="flex items-center gap-3 text-slate-400">
      <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
        <circle 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4" 
          className="opacity-25"
        />
        <path 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          className="opacity-75"
        />
      </svg>
      <span>Loading visualization...</span>
    </div>
  </div>
);

const ComingSoonView: React.FC<{ viewType: string }> = ({ viewType }) => (
  <div className="flex items-center justify-center h-96 bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-600">
    <div className="text-center">
      <svg className="w-16 h-16 text-slate-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <h3 className="text-lg font-semibold text-slate-300 mb-2">
        {viewType} View Coming Soon
      </h3>
      <p className="text-slate-400 max-w-md">
        We're working on bringing you an amazing {viewType.toLowerCase()} visualization 
        experience. Stay tuned for updates!
      </p>
    </div>
  </div>
);

const GoalVisualizationContainer: React.FC<GoalVisualizationContainerProps> = ({
  objectives,
  onUpdateObjective,
  onAddChild,
  onEditObjective,
  onReorganize,
  renderListView
}) => {
  const [currentView, setCurrentView] = useState<ViewMode>('list');

  // Convert AlignObjective to legacy Objective format for visualization components
  const legacyObjectives = useMemo(() => {
    return alignObjectivesToLegacy(objectives);
  }, [objectives]);

  // Wrapper functions to handle the conversion back to AlignObjective
  const handleUpdateObjective = (legacyObj: Objective) => {
    if (onUpdateObjective) {
      // Find the original AlignObjective
      const findObjective = (objs: AlignObjective[]): AlignObjective | undefined => {
        for (const obj of objs) {
          if (obj.id === legacyObj.id) return obj;
          if (obj.children) {
            const found = findObjective(obj.children);
            if (found) return found;
          }
        }
        return undefined;
      };
      
      const originalObj = findObjective(objectives);
      if (originalObj) {
        onUpdateObjective(originalObj);
      }
    }
  };

  const renderVisualization = () => {
    switch (currentView) {
      case 'list':
        return renderListView();
        
      case 'tree':
        return (
          <div className="h-[800px] w-full">
            <ReactFlowProvider>
              <Suspense fallback={<LoadingSpinner />}>
                <GoalTree
                  objectives={legacyObjectives}
                  onUpdateObjective={handleUpdateObjective}
                  onAddChild={onAddChild}
                  onEditObjective={onEditObjective}
                  onReorganize={onReorganize}
                />
              </Suspense>
            </ReactFlowProvider>
          </div>
        );
        
      case 'sunburst':
        return (
          <div className="w-full">
            <Suspense fallback={<LoadingSpinner />}>
              <SunburstChart
                objectives={legacyObjectives}
                onUpdateObjective={handleUpdateObjective}
                onAddChild={onAddChild}
                onEditObjective={onEditObjective}
              />
            </Suspense>
          </div>
        );
        
      case 'mindmap':
        return <ComingSoonView viewType="Mind Map" />;
        
      default:
        return renderListView();
    }
  };

  return (
    <div className="space-y-6">
      <VisualizationToggle 
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <div className="min-h-[400px]">
        {renderVisualization()}
      </div>
      
      {/* Help Text for Tree View */}
      {currentView === 'tree' && (
        <div className="bg-sky-500/10 border border-sky-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-sky-200">
              <strong>Tree View Tips:</strong>
              <ul className="mt-1 space-y-1 text-sky-300">
                <li>• Click the expand/collapse arrows to show/hide child goals</li>
                <li>• Use the zoom controls in the top-right to navigate large hierarchies</li>
                <li>• Drag nodes to reorganize the hierarchy (experimental)</li>
                <li>• Click the edit icon on any goal to modify its details</li>
                <li>• Use "Fit to View" to center and scale the entire tree</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Help Text for Sunburst View */}
      {currentView === 'sunburst' && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-amber-200">
              <strong>Sunburst Chart Tips:</strong>
              <ul className="mt-1 space-y-1 text-amber-300">
                <li>• Each ring represents a different organizational level (corporate → department → team → individual)</li>
                <li>• Segment size is proportional to the number of key results</li>
                <li>• Progress is shown as colored fill within each segment</li>
                <li>• Hover over segments to see detailed tooltips</li>
                <li>• Click segments to select and view detailed information</li>
                <li>• Double-click any segment to edit that goal</li>
                <li>• Colors indicate both organizational level and goal status</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalVisualizationContainer;