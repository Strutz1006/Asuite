import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlignLeft, Target, GitBranch, AlertCircle, CheckCircle2, Loader2, Plus, BarChart3 } from 'lucide-react';
import { useGoals } from '../../goals/hooks/useGoals';
import { supabase } from '@aesyros/supabase';

export function AlignmentMatrixPage() {
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [departments, setDepartments] = useState<any[]>([]);
  const [strategicObjectives, setStrategicObjectives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { goals, loading: goalsLoading } = useGoals();

  // Fetch departments and strategic pillars
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch departments
        const { data: deptData } = await supabase
          .from('departments')
          .select('id, name')
          .order('name');
        
        if (deptData) {
          setDepartments(deptData);
        }

        // Get strategic objectives from goals data
        const objectives = goals.filter(goal => 
          goal.strategic_level === 'objective' || goal.framework === 'objective'
        ).map(objective => ({
          id: objective.id,
          name: objective.title,
          shortName: objective.title.length > 15 ? objective.title.substring(0, 15) + '...' : objective.title,
          description: objective.description,
          progress: objective.progress_percentage || 0
        }));
        
        // If no objectives exist yet, show placeholder message
        setStrategicObjectives(objectives);

      } catch (error) {
        console.error('Error fetching alignment data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [goals]);

  // Filter goals based on selected filters (exclude objectives from the goal list)
  const filteredGoals = goals.filter(goal => {
    // Exclude strategic objectives from goals list
    if (goal.strategic_level === 'objective' || goal.framework === 'objective') return false;
    if (filterLevel !== 'all' && goal.level !== filterLevel) return false;
    if (filterDepartment !== 'all' && goal.department_id !== filterDepartment) return false;
    return true;
  });

  // Calculate alignment metrics
  const calculateAlignmentMetrics = () => {
    const totalGoals = filteredGoals.length;
    const strategicGoals = filteredGoals.filter(g => g.level === 'company').length;
    
    // Simplified alignment score calculation based on goal categories
    const strategicAlignment = filteredGoals.filter(g => g.category === 'strategic').length;
    const alignmentScore = totalGoals > 0 ? Math.round((strategicAlignment / totalGoals) * 100) : 0;
    
    // Calculate coverage gaps (objectives with fewer than 2 aligned goals)
    const coverageGaps = strategicObjectives.filter(objective => {
      const alignedGoals = filteredGoals.filter(g => 
        g.parent_id === objective.id // Direct parent relationship
      ).length;
      return alignedGoals < 2;
    }).length;

    // Calculate dependencies (goals linked to objectives)
    const dependencies = filteredGoals.filter(g => 
      g.parent_id
    ).length;

    return {
      alignmentScore,
      totalGoals,
      strategicGoals,
      coverageGaps,
      dependencies
    };
  };

  const metrics = calculateAlignmentMetrics();

  // Calculate department alignment insights
  const getDepartmentInsights = () => {
    const insights: Array<{
      department: string;
      alignedGoals: number;
      totalGoals: number;
      coverage: number;
      recommendation: string;
    }> = [];
    
    departments.forEach(dept => {
      const deptGoals = filteredGoals.filter(g => g.department_id === dept.id);
      const strategicGoals = deptGoals.filter(g => g.category === 'strategic').length;
      const alignmentRate = deptGoals.length > 0 ? Math.round((strategicGoals / deptGoals.length) * 100) : 0;
      
      if (alignmentRate >= 80) {
        insights.push({
          type: 'success',
          title: `Strong alignment in ${dept.name}`,
          description: `${alignmentRate}% of ${dept.name} goals support strategic initiatives`
        });
      } else if (alignmentRate < 40 && deptGoals.length > 0) {
        insights.push({
          type: 'warning',
          title: `Alignment opportunity in ${dept.name}`,
          description: `Only ${alignmentRate}% of ${dept.name} goals are strategically aligned`
        });
      }
    });

    return insights.slice(0, 3); // Limit to 3 insights
  };

  const insights = getDepartmentInsights();

  if (loading || goalsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 text-sky-400 animate-spin" />
          <span className="text-slate-300">Loading alignment data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">Alignment Matrix</h1>
          <p className="text-slate-400 mt-2">
            Visualize how goals align with strategic objectives across your organization
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/goals/new"
            className="glass-button text-sky-300 hover:text-sky-200 px-4 py-2 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Goal
          </Link>
          <Link
            to="/analytics"
            className="glass-button text-purple-300 hover:text-purple-200 px-4 py-2 flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Alignment Score</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">{metrics.alignmentScore}%</p>
              <p className="text-xs text-slate-400 mt-1">Strategic alignment</p>
            </div>
            <AlignLeft className="w-8 h-8 text-sky-400" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Goals</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">{metrics.totalGoals}</p>
              <p className="text-xs text-slate-400 mt-1">{metrics.strategicGoals} strategic</p>
            </div>
            <Target className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Coverage Gaps</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">{metrics.coverageGaps}</p>
              <p className="text-xs text-slate-400 mt-1">Strategic areas</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Dependencies</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">{metrics.dependencies}</p>
              <p className="text-xs text-slate-400 mt-1">Linked goals</p>
            </div>
            <GitBranch className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="glass-card p-1">
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="bg-transparent text-slate-200 px-3 py-2 text-sm focus:outline-none"
          >
            <option value="all">All Levels</option>
            <option value="company">Company</option>
            <option value="department">Department</option>
            <option value="team">Team</option>
            <option value="individual">Individual</option>
          </select>
        </div>
        
        <div className="glass-card p-1">
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="bg-transparent text-slate-200 px-3 py-2 text-sm focus:outline-none"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content - Alignment Matrix */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-100">Goal-Objective Alignment Matrix</h3>
            <p className="text-slate-400 text-sm mt-1">
              Shows how goals align with strategic objectives across your organization
            </p>
          </div>
        </div>

        {strategicObjectives.length === 0 ? (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No strategic objectives found</p>
            <p className="text-slate-300 text-sm mt-2">Create strategic objectives first to build the alignment matrix</p>
            <Link
              to="/objectives/new"
              className="inline-flex items-center gap-2 mt-4 text-sky-400 hover:text-sky-300"
            >
              <Plus className="w-4 h-4" />
              Create Strategic Objective
            </Link>
          </div>
        ) : filteredGoals.length === 0 ? (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No goals match the selected filters</p>
            <Link
              to="/goals/new"
              className="inline-flex items-center gap-2 mt-4 text-sky-400 hover:text-sky-300"
            >
              <Plus className="w-4 h-4" />
              Create First Goal
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 font-medium text-slate-200">Goals</th>
                  {strategicObjectives.map(objective => (
                    <th key={objective.id} className="text-center p-4 font-medium text-slate-200 min-w-[140px]">
                      <div className="space-y-1">
                        <div className="font-medium" title={objective.name}>{objective.shortName}</div>
                        <div className="text-xs text-slate-400">{objective.progress}% complete</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredGoals.map(goal => {
                  const getDepartmentName = (deptId?: string) => {
                    if (!deptId) return 'No Department';
                    const dept = departments.find(d => d.id === deptId);
                    return dept?.name || 'Unknown';
                  };

                  return (
                    <tr key={goal.id} className="border-b border-slate-700/50 hover:bg-slate-800/40">
                      <td className="p-4">
                        <div className="space-y-2">
                          <Link
                            to={`/goals/${goal.id}`}
                            className="font-medium text-slate-200 hover:text-sky-300 transition-colors"
                          >
                            {goal.title}
                          </Link>
                          <div className="flex gap-2">
                            <span className="px-2 py-1 rounded text-xs bg-slate-700/50 text-slate-300">
                              {getDepartmentName(goal.department_id)}
                            </span>
                            <span className="px-2 py-1 rounded text-xs bg-slate-700/50 text-slate-300 capitalize">
                              {goal.level}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              goal.category === 'strategic' ? 'bg-blue-500/20 text-blue-400' :
                              goal.category === 'operational' ? 'bg-green-500/20 text-green-400' :
                              goal.category === 'financial' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-purple-500/20 text-purple-400'
                            }`}>
                              {goal.category || 'general'}
                            </span>
                          </div>
                        </div>
                      </td>
                      {strategicObjectives.map(objective => {
                        // Calculate alignment based on goal-objective relationship
                        const getAlignment = () => {
                          // Direct parent relationship (strongest alignment)
                          if (goal.parent_id === objective.id) return 'strong';
                          // Keyword matching for medium alignment
                          const goalWords = goal.title.toLowerCase().split(' ');
                          const objectiveWords = objective.name.toLowerCase().split(' ');
                          const commonWords = goalWords.filter(word => 
                            word.length > 3 && objectiveWords.some(oWord => oWord.includes(word) || word.includes(oWord))
                          );
                          if (commonWords.length >= 2) return 'medium';
                          if (commonWords.length === 1) return 'weak';
                          return 'none';
                        };

                        const alignment = getAlignment();
                        const getAlignmentColor = () => {
                          switch (alignment) {
                            case 'strong': return 'bg-green-500';
                            case 'medium': return 'bg-yellow-500';
                            case 'weak': return 'bg-orange-500';
                            default: return 'bg-slate-600';
                          }
                        };

                        return (
                          <td key={objective.id} className="p-4 text-center">
                            <div className="flex justify-center">
                              <div
                                className={`w-8 h-8 rounded-full ${getAlignmentColor()}`}
                                title={`${alignment === 'none' ? 'No' : alignment} alignment with ${objective.name}`}
                              />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Legend */}
            <div className="mt-6 flex items-center gap-6 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500" />
                <span className="text-sm text-slate-300">Strong Alignment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500" />
                <span className="text-sm text-slate-300">Medium Alignment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500" />
                <span className="text-sm text-slate-300">Weak Alignment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-600" />
                <span className="text-sm text-slate-300">No Alignment</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Insights Panel */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-100">Alignment Insights</h3>
            <p className="text-slate-400 text-sm mt-1">Key findings and recommendations</p>
          </div>
        </div>
        
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <p className="text-slate-400">All departments show balanced strategic alignment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3">
                {insight.type === 'success' ? 
                  <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" /> :
                  <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                }
                <div>
                  <p className="font-medium text-slate-200">{insight.title}</p>
                  <p className="text-sm text-slate-400">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}