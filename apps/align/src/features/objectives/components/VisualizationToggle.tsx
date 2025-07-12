import React from 'react';

export type ViewMode = 'list' | 'tree' | 'sunburst' | 'mindmap';

interface VisualizationToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const viewOptions: Array<{
  value: ViewMode;
  label: string;
  icon: string;
  description: string;
  comingSoon?: boolean;
}> = [
  {
    value: 'list',
    label: 'List View',
    icon: 'M4 6h16M4 10h16M4 14h16M4 18h16',
    description: 'Traditional hierarchical list'
  },
  {
    value: 'tree',
    label: 'Tree View',
    icon: 'M5 3v4M3 5h4m6-2v14m-2-2h4m-7-2a3 3 0 01-3-3V8a3 3 0 013-3h3',
    description: 'Interactive node-based visualization'
  },
  {
    value: 'sunburst',
    label: 'Sunburst',
    icon: 'M12 2l3.09 6.26L22 9l-5.91 5.2L17.82 22 12 18.27 6.18 22l1.73-7.8L2 9l6.91-.74L12 2z',
    description: 'Radial hierarchy chart'
  },
  {
    value: 'mindmap',
    label: 'Mind Map',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    description: 'Creative branching layout',
    comingSoon: true
  }
];

const VisualizationToggle: React.FC<VisualizationToggleProps> = ({
  currentView,
  onViewChange
}) => {
  return (
    <div className="bg-slate-800/90 backdrop-blur-xl rounded-lg p-4 border border-slate-700/80 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">View Mode</h3>
        <div className="text-xs text-slate-400">
          Choose how to visualize your goal hierarchy
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {viewOptions.map((option) => {
          const isActive = currentView === option.value;
          const isDisabled = option.comingSoon;
          
          return (
            <button
              key={option.value}
              onClick={() => !isDisabled && onViewChange(option.value)}
              disabled={isDisabled}
              className={`
                relative p-4 rounded-lg border transition-all duration-200 text-left
                ${isActive
                  ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                  : isDisabled
                    ? 'bg-slate-700/30 border-slate-600/30 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:border-slate-500/50 hover:text-slate-200'
                }
              `}
              title={isDisabled ? 'Coming Soon' : option.description}
            >
              {/* Icon */}
              <div className="flex items-center gap-3 mb-2">
                <svg 
                  className={`w-5 h-5 ${isActive ? 'text-sky-400' : 'text-current'}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d={option.icon} 
                  />
                </svg>
                
                {/* Coming Soon Badge */}
                {option.comingSoon && (
                  <span className="text-xs bg-slate-600 text-slate-400 px-2 py-1 rounded-full">
                    Soon
                  </span>
                )}
              </div>
              
              {/* Label */}
              <div className="font-medium text-sm mb-1">
                {option.label}
              </div>
              
              {/* Description */}
              <div className="text-xs opacity-75">
                {option.description}
              </div>
              
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Help Text */}
      <div className="mt-4 pt-3 border-t border-slate-700">
        <div className="text-xs text-slate-400">
          💡 <strong>Tree View</strong> allows drag & drop reorganization and detailed interactions. 
          <strong>Sunburst Chart</strong> provides radial hierarchy visualization with progress arcs.
        </div>
      </div>
    </div>
  );
};

export default VisualizationToggle;