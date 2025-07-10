import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard, Icon } from '../../shared/components';
import { mockChangeJourneys, mockChangeTemplates, mockCatalystMetrics, mockRecentActivities, mockChangePulseMetrics, mockEarlyWarningAlerts } from '../../shared/data/mockData';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">Change Activation Hub</h2>
          <p className="text-slate-400 mt-2">Turn strategy into movement that sticks. Manage resistance, engage stakeholders, and track adoption</p>
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-sky-400">{mockCatalystMetrics.activeJourneys}</div>
            <div className="text-xs text-slate-400">Active Journeys</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">{mockCatalystMetrics.averageReadiness}%</div>
            <div className="text-xs text-slate-400">Avg Readiness</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">{mockCatalystMetrics.completionRate}%</div>
            <div className="text-xs text-slate-400">Completion Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">{mockCatalystMetrics.riskLevel}</div>
            <div className="text-xs text-slate-400">Risk Level</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Change Journeys */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-slate-100">Active Change Journeys</h3>
              <Link 
                to="/journeys" 
                className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
              >
                View All Journeys →
              </Link>
            </div>
            
            <div className="space-y-4">
              {mockChangeJourneys.map(journey => (
                <div key={journey.id} className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-100 mb-1">{journey.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>Phase: {journey.phase}</span>
                        <span>{journey.completion}% Complete</span>
                        <span>{journey.stakeholders} stakeholders</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${
                      journey.status === 'In Progress' ? 'bg-sky-500/20 text-sky-300' : 
                      journey.status === 'Completed' ? 'bg-green-500/20 text-green-300' : 
                      'bg-slate-500/20 text-slate-300'
                    }`}>
                      {journey.status}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-slate-400">Readiness:</span>
                        <span className="font-mono text-sm text-sky-400">{journey.readiness}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-slate-400">Resistance:</span>
                        <span className={`text-sm font-medium ${
                          journey.resistance === 'High' ? 'text-red-400' : 
                          journey.resistance === 'Medium' ? 'text-yellow-400' : 
                          'text-green-400'
                        }`}>
                          {journey.resistance}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/journeys/${journey.id}`}
                      className="text-sm bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded transition-colors"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Quick Start Templates */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4">Quick Start Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockChangeTemplates.map(template => (
                <div key={template.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-sky-500/50 transition-colors cursor-pointer">
                  <Icon path={template.icon} className="w-8 h-8 text-sky-400 mb-2" />
                  <h4 className="font-semibold mb-1">{template.name}</h4>
                  <p className="text-sm text-slate-400">{template.description}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {mockRecentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Icon path={activity.icon} className="w-5 h-5 text-sky-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                to="/journeys/new"
                className="w-full p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors text-left block"
              >
                <div className="flex items-center gap-3">
                  <Icon path="M12 4v16m8-8H4" className="w-5 h-5 text-sky-400" />
                  <div>
                    <div className="font-medium">New Journey</div>
                    <div className="text-xs text-slate-400">Start change initiative</div>
                  </div>
                </div>
              </Link>
              
              <Link 
                to="/stakeholders"
                className="w-full p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors text-left block"
              >
                <div className="flex items-center gap-3">
                  <Icon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" className="w-5 h-5 text-sky-400" />
                  <div>
                    <div className="font-medium">Stakeholder Map</div>
                    <div className="text-xs text-slate-400">Manage engagement</div>
                  </div>
                </div>
              </Link>
              
              <Link 
                to="/insights"
                className="w-full p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors text-left block"
              >
                <div className="flex items-center gap-3">
                  <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" className="w-5 h-5 text-sky-400" />
                  <div>
                    <div className="font-medium">Change Insights</div>
                    <div className="text-xs text-slate-400">View analytics</div>
                  </div>
                </div>
              </Link>
              
              <Link 
                to="/pulse"
                className="w-full p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors text-left block"
              >
                <div className="flex items-center gap-3">
                  <Icon path="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" className="w-5 h-5 text-sky-400" />
                  <div>
                    <div className="font-medium">Change Pulse</div>
                    <div className="text-xs text-slate-400">Real-time analytics</div>
                  </div>
                </div>
              </Link>
            </div>
          </GlassCard>

          {/* Change Health */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4">Change Health</h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-sky-400 mb-2">73%</div>
                <p className="text-slate-400 text-sm">Overall Readiness</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Champions Active</span>
                  <span className="text-sm font-mono text-green-400">17</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Resistance Issues</span>
                  <span className="text-sm font-mono text-yellow-400">10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Training Complete</span>
                  <span className="text-sm font-mono text-blue-400">68%</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Change Pulse Summary */}
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Change Pulse</h3>
              <Link 
                to="/pulse" 
                className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
              >
                View Details →
              </Link>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {(mockChangePulseMetrics[0].overallSentiment * 100).toFixed(0)}%
                </div>
                <p className="text-slate-400 text-xs mb-3">Overall Sentiment</p>
                <div className="flex items-center justify-center gap-2">
                  <Icon 
                    path={mockChangePulseMetrics[0].sentimentTrend === 'improving' ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : mockChangePulseMetrics[0].sentimentTrend === 'declining' ? "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" : "M20 12H4"} 
                    className={`w-4 h-4 ${ 
                      mockChangePulseMetrics[0].sentimentTrend === 'improving' ? 'text-green-400' :
                      mockChangePulseMetrics[0].sentimentTrend === 'declining' ? 'text-red-400' :
                      'text-slate-400'
                    }`} 
                  />
                  <span className={`text-xs ${ 
                    mockChangePulseMetrics[0].sentimentTrend === 'improving' ? 'text-green-400' :
                    mockChangePulseMetrics[0].sentimentTrend === 'declining' ? 'text-red-400' :
                    'text-slate-400'
                  }`}>
                    {mockChangePulseMetrics[0].sentimentTrend}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Velocity Score</span>
                  <span className="font-mono text-blue-400">{mockChangePulseMetrics[0].velocityScore}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Active Alerts</span>
                  <span className={`font-mono ${mockEarlyWarningAlerts.filter(a => !a.acknowledged).length > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {mockEarlyWarningAlerts.filter(a => !a.acknowledged).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Response Rate</span>
                  <span className="font-mono text-purple-400">{mockChangePulseMetrics[0].responseRate}%</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;