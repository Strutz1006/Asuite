import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard, Icon } from '../../shared/components';
import GoalVisualizationContainer from '../components/GoalVisualizationContainer';

interface Objective {
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

const mockObjectives: Objective[] = [
  {
    id: 'corp-1',
    title: 'Achieve Carbon Neutrality by 2026',
    description: 'Implement comprehensive sustainability initiatives across all operations to achieve net-zero carbon emissions.',
    level: 'corporate',
    ownerId: 'exec-1',
    ownerName: 'Executive Team',
    progress: 68,
    status: 'on-track',
    priority: 'high',
    startDate: new Date('2024-01-01'),
    dueDate: new Date('2026-12-31'),
    keyResults: [
      { id: 'kr-1', title: 'Reduce emissions', currentValue: '450', targetValue: '200', unit: 'tCO2e', progress: 65 },
      { id: 'kr-2', title: 'Renewable energy', currentValue: '70', targetValue: '100', unit: '%', progress: 70 },
      { id: 'kr-3', title: 'Carbon offset projects', currentValue: '8', targetValue: '15', unit: 'projects', progress: 53 }
    ],
    children: [
      {
        id: 'dept-1',
        title: 'Operations Carbon Reduction',
        description: 'Reduce carbon footprint in manufacturing and facilities operations.',
        level: 'department',
        parentId: 'corp-1',
        ownerId: 'dept-1',
        ownerName: 'Sarah Chen',
        department: 'Operations',
        progress: 75,
        status: 'on-track',
        priority: 'high',
        startDate: new Date('2024-02-01'),
        dueDate: new Date('2025-12-31'),
        keyResults: [
          { id: 'kr-4', title: 'Energy efficiency', currentValue: '15', targetValue: '25', unit: '%', progress: 60 },
          { id: 'kr-5', title: 'Waste reduction', currentValue: '30', targetValue: '50', unit: '%', progress: 60 }
        ],
        children: [
          {
            id: 'team-1',
            title: 'Manufacturing Efficiency Program',
            description: 'Optimize manufacturing processes for energy efficiency.',
            level: 'team',
            parentId: 'dept-1',
            ownerId: 'team-1',
            ownerName: 'Manufacturing Team',
            department: 'Operations',
            team: 'Manufacturing',
            progress: 82,
            status: 'on-track',
            priority: 'high',
            startDate: new Date('2024-03-01'),
            dueDate: new Date('2024-12-31'),
            keyResults: [
              { id: 'kr-6', title: 'Machine efficiency', currentValue: '78', targetValue: '85', unit: '%', progress: 82 }
            ],
            children: [
              {
                id: 'ind-1',
                title: 'Q4 Energy Audit Completion',
                description: 'Complete comprehensive energy audit of manufacturing equipment.',
                level: 'individual',
                parentId: 'team-1',
                ownerId: 'user-1',
                ownerName: 'Alex Kim',
                department: 'Operations',
                team: 'Manufacturing',
                progress: 90,
                status: 'on-track',
                priority: 'medium',
                startDate: new Date('2024-10-01'),
                dueDate: new Date('2024-12-31'),
                keyResults: [
                  { id: 'kr-7', title: 'Audits completed', currentValue: '18', targetValue: '20', unit: 'audits', progress: 90 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'dept-2',
        title: 'R&D Sustainable Innovation',
        description: 'Develop eco-friendly products and sustainable technologies.',
        level: 'department',
        parentId: 'corp-1',
        ownerId: 'dept-2',
        ownerName: 'Mike Torres',
        department: 'R&D',
        progress: 45,
        status: 'on-track',
        priority: 'high',
        startDate: new Date('2024-01-15'),
        dueDate: new Date('2025-09-30'),
        keyResults: [
          { id: 'kr-8', title: 'Sustainable products', currentValue: '2', targetValue: '5', unit: 'products', progress: 40 },
          { id: 'kr-9', title: 'Green materials', currentValue: '25', targetValue: '75', unit: '%', progress: 33 }
        ]
      }
    ]
  }
];

const ObjectivesPage: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['corp-1', 'dept-1', 'team-1']));
  
  // Visualization state management (currently unused but ready for future enhancements)
  // const { state: vizState, actions: vizActions } = useVisualizationState(mockObjectives);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  // Handlers for visualization interactions
  const handleUpdateObjective = (objective: Objective) => {
    // TODO: Implement objective update logic
    console.log('Update objective:', objective);
  };

  const handleAddChild = (parentId: string) => {
    // TODO: Implement add child logic
    console.log('Add child to:', parentId);
  };

  const handleEditObjective = (objectiveId: string) => {
    // TODO: Implement edit logic
    console.log('Edit objective:', objectiveId);
  };

  const handleReorganize = (sourceId: string, targetId: string) => {
    // TODO: Implement reorganization logic
    console.log('Reorganize:', sourceId, 'to', targetId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'text-green-400 bg-green-500/20';
      case 'at-risk': return 'text-yellow-400 bg-yellow-500/20';
      case 'completed': return 'text-blue-400 bg-blue-500/20';
      case 'paused': return 'text-slate-400 bg-slate-500/20';
      default: return 'text-sky-400 bg-sky-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-green-500';
      default: return 'border-slate-500';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'corporate': return "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4";
      case 'department': return "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z";
      case 'team': return "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z";
      case 'individual': return "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z";
      default: return "M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'corporate': return 'text-purple-400';
      case 'department': return 'text-blue-400';
      case 'team': return 'text-green-400';
      case 'individual': return 'text-sky-400';
      default: return 'text-slate-400';
    }
  };

  const renderObjective = (objective: Objective, depth: number = 0) => {
    const isExpanded = expandedIds.has(objective.id);
    const hasChildren = objective.children && objective.children.length > 0;
    const indentClass = depth > 0 ? `ml-${depth * 8}` : '';

    return (
      <div key={objective.id} className={`space-y-4`}>
        <GlassCard className={`p-4 border-l-4 ${getPriorityColor(objective.priority)} ${indentClass}`}>
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Icon 
                  path={getLevelIcon(objective.level)} 
                  className={`w-5 h-5 ${getLevelColor(objective.level)}`} 
                />
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getLevelColor(objective.level)} bg-opacity-20`}>
                  {objective.level.toUpperCase()}
                </span>
                {objective.department && (
                  <span className="text-xs text-slate-400 px-2 py-1 bg-slate-700 rounded-full">
                    {objective.department}
                  </span>
                )}
                {objective.team && (
                  <span className="text-xs text-slate-400 px-2 py-1 bg-slate-600 rounded-full">
                    {objective.team}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3 mb-2">
                {hasChildren && (
                  <button
                    onClick={() => toggleExpanded(objective.id)}
                    className="text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    <Icon 
                      path={isExpanded ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} 
                      className="w-4 h-4" 
                    />
                  </button>
                )}
                <h3 className="text-lg font-semibold text-white">{objective.title}</h3>
              </div>
              
              <p className="text-slate-300 text-sm mb-3">{objective.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Owner:</span>
                  <div className="font-medium">{objective.ownerName}</div>
                </div>
                <div>
                  <span className="text-slate-400">Due Date:</span>
                  <div className="font-medium">{objective.dueDate.toLocaleDateString()}</div>
                </div>
                <div>
                  <span className="text-slate-400">Status:</span>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(objective.status)}`}>
                    {objective.status.replace('-', ' ').toUpperCase()}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Progress:</span>
                  <div className="font-mono font-bold">{objective.progress}%</div>
                </div>
              </div>
            </div>
            
            <div className="text-right ml-4">
              <div className="text-3xl font-bold text-sky-400 mb-1">{objective.progress}%</div>
              <div className="w-24 bg-slate-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-sky-500 to-blue-500 h-2 rounded-full" 
                  style={{ width: `${objective.progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Key Results */}
          {objective.keyResults.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-600">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-slate-300">Key Results</h4>
                <button className="text-xs text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1">
                  <Icon path="M12 4v16m8-8H4" className="w-3 h-3" />
                  Add Key Result
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {objective.keyResults.map(kr => (
                  <div key={kr.id} className="bg-slate-800/50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{kr.title}</span>
                      <span className="text-xs font-mono">{kr.progress}%</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                      <span>{kr.currentValue} {kr.unit}</span>
                      <span>Target: {kr.targetValue} {kr.unit}</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-1.5">
                      <div 
                        className="bg-sky-400 h-1.5 rounded-full" 
                        style={{ width: `${kr.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Key Results when empty */}
          {objective.keyResults.length === 0 && (
            <div className="mt-4 pt-4 border-t border-slate-600">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-slate-300">Key Results</h4>
                <button className="text-xs text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1">
                  <Icon path="M12 4v16m8-8H4" className="w-3 h-3" />
                  Add Key Result
                </button>
              </div>
              <div className="text-center py-8 text-slate-400">
                <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                <p className="text-sm">No key results defined yet</p>
                <p className="text-xs mt-1">Add measurable outcomes to track progress</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-slate-600">
            <Link
              to={`/objectives/${objective.id}`}
              className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
            >
              View Details
            </Link>
            <span className="text-slate-600">•</span>
            <Link
              to={`/objectives/${objective.id}/edit`}
              className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
            >
              Edit
            </Link>
            {hasChildren && (
              <>
                <span className="text-slate-600">•</span>
                <button className="text-sm text-green-400 hover:text-green-300 transition-colors">
                  Add Child Objective
                </button>
              </>
            )}
          </div>
        </GlassCard>

        {/* Render Children */}
        {hasChildren && isExpanded && (
          <div className="space-y-4">
            {objective.children!.map(child => renderObjective(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-100">Strategic Objectives</h2>
        <div className="flex items-center gap-4">
          <select 
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Levels</option>
            <option value="corporate">Corporate</option>
            <option value="department">Department</option>
            <option value="team">Team</option>
            <option value="individual">Individual</option>
          </select>
          <Link
            to="/objectives/new"
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
          >
            <Icon path="M12 4v16m8-8H4" className="w-4 h-4" />
            New Objective
          </Link>
        </div>
      </div>

      {/* Hierarchy Summary */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-sky-300">Objective Hierarchy</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">1</div>
            <div className="text-sm text-slate-400">Corporate Objectives</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">2</div>
            <div className="text-sm text-slate-400">Department Objectives</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">1</div>
            <div className="text-sm text-slate-400">Team Objectives</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-sky-400 mb-1">1</div>
            <div className="text-sm text-slate-400">Individual Objectives</div>
          </div>
        </div>
      </GlassCard>

      {/* Interactive Goal Visualization */}
      <GoalVisualizationContainer
        objectives={mockObjectives}
        onUpdateObjective={handleUpdateObjective}
        onAddChild={handleAddChild}
        onEditObjective={handleEditObjective}
        onReorganize={handleReorganize}
        renderListView={() => (
          <div className="space-y-6">
            {mockObjectives.map(objective => renderObjective(objective))}
          </div>
        )}
      />
    </div>
  );
};

export default ObjectivesPage;