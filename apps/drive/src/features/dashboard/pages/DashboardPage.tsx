import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../shared/components';
import { DashboardLayout, DashboardCard } from '@aesyros/ui';

const DashboardPage: React.FC = () => {
  const dashboardStats = [
    { label: 'Active Projects', value: 12, color: 'text-sky-400' },
    { label: 'Completed', value: 128, color: 'text-green-400' },
    { label: 'In Progress', value: 47, color: 'text-yellow-400' },
    { label: 'Alignment', value: '85%', color: 'text-purple-400' },
  ];

  const sideContent = (
    <>
      {/* Task Progress */}
      <DashboardCard>
        <h3 className="text-xl font-semibold mb-4">Task Progress</h3>
        <div className="space-y-4">
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Today</h4>
              <span className="text-sm font-mono text-green-400">12/15</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <div className="text-xs text-slate-400 mt-1">80% complete</div>
          </div>
          
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">This Week</h4>
              <span className="text-sm font-mono text-yellow-400">47/82</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '57%' }}></div>
            </div>
            <div className="text-xs text-slate-400 mt-1">57% complete</div>
          </div>
          
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">This Sprint</h4>
              <span className="text-sm font-mono text-sky-400">128/150</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div className="bg-sky-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <div className="text-xs text-slate-400 mt-1">85% complete</div>
          </div>
        </div>
      </DashboardCard>

      {/* Upcoming Deadlines */}
      <DashboardCard>
        <h3 className="text-xl font-semibold mb-4">Upcoming Deadlines</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Icon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="font-medium text-white">UI Component Library</p>
                <p className="text-sm text-slate-400">Due in 2 days</p>
              </div>
            </div>
            <div className="text-sm text-red-400">High Priority</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Icon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <p className="font-medium text-white">Database Migration</p>
                <p className="text-sm text-slate-400">Due in 5 days</p>
              </div>
            </div>
            <div className="text-sm text-yellow-400">Medium Priority</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Icon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="font-medium text-white">Performance Testing</p>
                <p className="text-sm text-slate-400">Due in 1 week</p>
              </div>
            </div>
            <div className="text-sm text-green-400">Low Priority</div>
          </div>
        </div>
      </DashboardCard>

      {/* Quick Actions */}
      <DashboardCard>
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button className="w-full inline-flex items-center justify-center gap-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/50 px-4 py-3 rounded-lg transition-all">
            <Icon path="M12 4v16m8-8H4" className="w-5 h-5" />
            New Project
          </button>
          <button className="w-full inline-flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border border-slate-600/50 px-4 py-3 rounded-lg transition-all">
            <Icon path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7l2 2 4-4" className="w-5 h-5" />
            New Task
          </button>
          <Link to="/projects" className="w-full inline-flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border border-slate-600/50 px-4 py-3 rounded-lg transition-all">
            <Icon path="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-5 h-5" />
            View Reports
          </Link>
        </div>
      </DashboardCard>
    </>
  );

  const mainContent = (
    <>
      {/* Project Health Overview */}
      <DashboardCard>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Project Portfolio Overview</h3>
          <Link 
            to="/projects" 
            className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
          >
            View All Projects →
          </Link>
        </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-slate-700/50 rounded-lg text-center">
                    <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-400">8</p>
                    <p className="text-sm text-slate-400">On Track</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg text-center">
                    <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-400">3</p>
                    <p className="text-sm text-slate-400">At Risk</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg text-center">
                    <Icon path="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-400">1</p>
                    <p className="text-sm text-slate-400">Blocked</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg text-center">
                    <Icon path="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-400">92%</p>
                    <p className="text-sm text-slate-400">Team Health</p>
                  </div>
                </div>
              </div>
          </div>
      </DashboardCard>

      {/* Recent Projects */}
      <DashboardCard>
            <h3 className="text-xl font-semibold mb-4">Recent Projects</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div>
                    <p className="font-medium text-white">Mobile App Redesign</p>
                    <p className="text-sm text-slate-400">8 tasks • 3 team members</p>
                  </div>
                </div>
                <div className="text-sm text-slate-400">75% complete</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div>
                    <p className="font-medium text-white">API Integration</p>
                    <p className="text-sm text-slate-400">12 tasks • 5 team members</p>
                  </div>
                </div>
                <div className="text-sm text-slate-400">42% complete</div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-sky-400 rounded-full"></div>
                  <div>
                    <p className="font-medium text-white">Customer Portal</p>
                    <p className="text-sm text-slate-400">15 tasks • 4 team members</p>
                  </div>
                </div>
                <div className="text-sm text-slate-400">90% complete</div>
              </div>
            </div>
      </DashboardCard>
    </>
  );

  return (
    <DashboardLayout
      title="Project Command Center"
      description="Drive execution with clarity. Transform strategy into action."
      stats={dashboardStats}
      mainContent={mainContent}
      sideContent={sideContent}
    />
  );
};

export default DashboardPage;