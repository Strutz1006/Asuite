import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { Objective } from '../../../utils/hierarchyTransformers';

interface GoalNodeData {
  objective: Objective;
  isExpanded: boolean;
  levelColor: string;
  statusColor: string;
  onToggleExpand?: (id: string) => void;
  onEdit?: (id: string) => void;
  onAddChild?: (id: string) => void;
}

const GoalNode = memo(({ data, selected }: NodeProps<GoalNodeData>) => {
  const { objective, isExpanded, levelColor, statusColor } = data;
  const hasChildren = objective.children && objective.children.length > 0;

  const priorityBorderColor = {
    high: 'border-l-red-500',
    medium: 'border-l-yellow-500',
    low: 'border-l-green-500',
  };

  return (
    <>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      
      <div
        className={`
          bg-slate-800/90 backdrop-blur-xl rounded-lg p-4 min-w-[280px] max-w-[320px]
          border-2 transition-all duration-200
          ${selected ? 'border-sky-500 shadow-lg shadow-sky-500/20' : 'border-slate-700/80'}
          ${priorityBorderColor[objective.priority]} border-l-4
        `}
        style={{
          backgroundColor: 'rgba(30, 41, 59, 0.9)',
          borderColor: selected ? '#0ea5e9' : 'rgba(51, 65, 85, 0.8)',
        }}
      >
        {/* Header with level and status */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full text-white"
            style={{ backgroundColor: levelColor }}
          >
            {objective.level.toUpperCase()}
          </span>
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full text-white"
            style={{ backgroundColor: statusColor }}
          >
            {objective.status.replace('-', ' ').toUpperCase()}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
          {objective.title}
        </h3>

        {/* Owner and Department */}
        <div className="text-xs text-slate-400 mb-2">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{objective.ownerName}</span>
          </div>
          {objective.department && (
            <div className="flex items-center gap-1 mt-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{objective.department}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400">Progress</span>
            <span className="text-sky-400 font-semibold">{objective.progress}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full transition-all duration-300"
              style={{ width: `${objective.progress}%` }}
            />
          </div>
        </div>

        {/* Key Results Summary */}
        {objective.keyResults && objective.keyResults.length > 0 && (
          <div className="border-t border-slate-700 pt-2 mt-2">
            <div className="text-xs text-slate-400 mb-1">
              {objective.keyResults.length} Key Results
            </div>
            <div className="space-y-1">
              {objective.keyResults.slice(0, 2).map((kr) => (
                <div key={kr.id} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 truncate mr-2">{kr.title}</span>
                  <span className="text-sky-400 font-semibold">{kr.progress}%</span>
                </div>
              ))}
              {objective.keyResults.length > 2 && (
                <div className="text-xs text-slate-500">
                  +{objective.keyResults.length - 2} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-700">
          <div className="flex items-center gap-2">
            {hasChildren && (
              <button
                onClick={() => data.onToggleExpand?.(objective.id)}
                className="text-slate-400 hover:text-sky-400 transition-colors"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d={isExpanded 
                      ? "M19 9l-7 7-7-7" 
                      : "M9 5l7 7-7 7"
                    } />
                </svg>
              </button>
            )}
            <button
              onClick={() => data.onEdit?.(objective.id)}
              className="text-slate-400 hover:text-sky-400 transition-colors"
              title="Edit"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => data.onAddChild?.(objective.id)}
              className="text-slate-400 hover:text-sky-400 transition-colors"
              title="Add Child"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          {/* Due date indicator */}
          <div className="text-xs text-slate-500">
            {new Date(objective.dueDate).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </>
  );
});

GoalNode.displayName = 'GoalNode';

export default GoalNode;