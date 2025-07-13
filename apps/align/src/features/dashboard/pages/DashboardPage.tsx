import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard, Icon } from '../../shared/components';
import { useAuth } from '../../../hooks/useAuth';
import { useObjectives, useObjectiveStats } from '../../../hooks/useObjectives';
import { useOrganization } from '../../../hooks/useOrganization';

const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { organization } = useOrganization();
  const { stats, loading: statsLoading } = useObjectiveStats();
  const { objectives, loading: objectivesLoading } = useObjectives(
    { level: ['corporate', 'department', 'team'] },
    { field: 'created_at', direction: 'desc' },
    1,
    10
  );



  const corporateObjectives = objectives.filter(obj => obj.level === 'corporate');
  const departmentObjectives = objectives.filter(obj => obj.level === 'department');
  const teamObjectives = objectives.filter(obj => obj.level === 'team');
  const individualObjectives = objectives.filter(obj => obj.level === 'individual');

  const onTrackCount = stats?.by_status['on-track'] || 0;
  const atRiskCount = stats?.by_status['at-risk'] || 0;

  if (objectivesLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">Strategic Alignment Hub</h2>
          {organization && (
            <p className="text-slate-400 mt-1">{organization.name}</p>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
            <span>On Track ({onTrackCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>At Risk ({atRiskCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Completed ({stats?.by_status.completed || 0})</span>
          </div>
        </div>
      </div>

      {/* Company Level Goal */}
      <GlassCard className="p-6">
        {corporateObjectives.length > 0 ? (
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-sky-300 mb-2">Company-Level Objectives</h3>
                <p className="text-2xl font-bold mb-3">{corporateObjectives[0].title}</p>
                <div className="flex gap-6 text-sm text-slate-400">
                  <span>Owner: {corporateObjectives[0].owner?.full_name || 'Unassigned'}</span>
                  {corporateObjectives[0].due_date && (
                    <span>Due: {new Date(corporateObjectives[0].due_date).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-sky-400">{corporateObjectives[0].progress_percentage}%</div>
                <div className={`text-sm capitalize ${
                  corporateObjectives[0].status === 'on-track' ? 'text-green-400' :
                  corporateObjectives[0].status === 'at-risk' ? 'text-yellow-400' :
                  corporateObjectives[0].status === 'completed' ? 'text-green-400' :
                  'text-slate-400'
                }`}>
                  {corporateObjectives[0].status.replace('-', ' ')}
                </div>
              </div>
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-4 mb-2">
              <div 
                className="bg-gradient-to-r from-sky-500 to-blue-500 h-4 rounded-full" 
                style={{ width: `${corporateObjectives[0].progress_percentage}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold text-sky-300 mb-2">No Corporate Objectives</h3>
            <p className="text-slate-400 mb-4">Create your first company-level objective to align your organization</p>
            <Link 
              to="/objectives/new"
              className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              Create Objective
            </Link>
          </div>
        )}

        {(departmentObjectives.length > 0 || teamObjectives.length > 0) && (
          <>
            {/* Connecting Lines */}
            <div className="relative text-center my-8">
              <div className="border-l-2 border-sky-400/30 h-8 w-1/2 mx-auto"></div>
            </div>

            {/* Department Level */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-sky-300">Department & Team Objectives</h3>
              <Link 
                to="/objectives" 
                className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
              >
                View All Objectives →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...departmentObjectives, ...teamObjectives].slice(0, 6).map(obj => (
                <div key={obj.id} className="bg-slate-800/80 p-4 rounded-lg border border-slate-700 relative hover:border-sky-500/50 transition-colors">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 h-6 w-px bg-sky-400/30"></div>
                  
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-sm">{obj.title}</p>
                      <p className="text-xs text-slate-500">
                        Owner: {obj.owner?.full_name || 'Unassigned'}
                      </p>
                      <p className="text-xs text-slate-600 capitalize">
                        {obj.level} level
                      </p>
                    </div>
                    <div className={`px-2 py-1 text-xs font-bold rounded-full ${
                      obj.status === 'at-risk' ? 'bg-yellow-500/20 text-yellow-300' : 
                      obj.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                      'bg-sky-500/20 text-sky-300'
                    }`}>
                      {obj.status === 'at-risk' ? 'At Risk' : 
                       obj.status === 'completed' ? 'Completed' : 'On Track'}
                    </div>
                  </div>

                  <div className="w-full bg-slate-600 rounded-full h-2.5 mb-3">
                    <div 
                      className={`h-2.5 rounded-full ${
                        obj.status === 'on-track' ? 'bg-sky-500' :
                        obj.status === 'at-risk' ? 'bg-yellow-500' :
                        obj.status === 'completed' ? 'bg-green-500' :
                        'bg-slate-500'
                      }`} 
                      style={{ width: `${obj.progress_percentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="font-mono">{obj.progress_percentage}%</span>
                    <Link 
                      to={`/objectives/${obj.id}`}
                      className="text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Individual Goals */}
        {individualObjectives.length > 0 && (
          <div className="mt-8">
            <h4 className="text-md font-semibold text-sky-300 mb-4">Recent Individual Objectives</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {individualObjectives.slice(0, 3).map(goal => (
                <div key={goal.id} className="bg-slate-700/50 p-3 rounded-lg">
                  <p className="text-sm font-medium">{goal.title}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-slate-400">{goal.owner?.full_name || 'Unassigned'}</span>
                    <span className="text-xs font-mono">{goal.progress_percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-sky-400 h-1.5 rounded-full" 
                      style={{ width: `${goal.progress_percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassCard>

      {/* Statistics Overview */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold mb-4">Organization Overview</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-sky-400">{stats?.total || 0}</div>
            <div className="text-sm text-slate-400">Total Objectives</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{Math.round(stats?.average_progress || 0)}%</div>
            <div className="text-sm text-slate-400">Avg Progress</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{Math.round(stats?.completion_rate || 0)}%</div>
            <div className="text-sm text-slate-400">Completion Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-300">
              {(stats?.by_level.corporate || 0) + (stats?.by_level.department || 0) + (stats?.by_level.team || 0)}
            </div>
            <div className="text-sm text-slate-400">Org Objectives</div>
          </div>
        </div>

        {profile && (
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-sm text-slate-400">
              Welcome back, <span className="text-slate-200">{profile.full_name}</span>
              {profile.department_info && (
                <span> from {profile.department_info.name}</span>
              )}
            </p>
          </div>
        )}
      </GlassCard>

    </div>
  );
};

export default DashboardPage;