import React, { useState } from 'react';
import { GlassCard, Icon } from '../../shared/components';

interface DashboardTemplate {
  id: string;
  name: string;
  role: 'executive' | 'manager' | 'analyst' | 'contributor';
  description: string;
  layout: {
    widgets: Array<{
      id: string;
      type: 'kpi-card' | 'chart' | 'table' | 'gauge' | 'alert-feed' | 'insights';
      title: string;
      size: 'small' | 'medium' | 'large';
      position: { x: number; y: number; w: number; h: number };
      config: any;
    }>;
  };
  filters: string[];
  refreshRate: 'real-time' | '1min' | '5min' | '15min' | 'hourly';
  isDefault: boolean;
}

const mockDashboardTemplates: DashboardTemplate[] = [
  {
    id: 'exec-summary',
    name: 'Executive Summary',
    role: 'executive',
    description: 'High-level strategic KPIs and performance overview for leadership',
    layout: {
      widgets: [
        {
          id: 'kpi-overview',
          type: 'kpi-card',
          title: 'Strategic KPI Overview',
          size: 'large',
          position: { x: 0, y: 0, w: 8, h: 3 },
          config: { kpis: ['Revenue Growth', 'Customer Satisfaction', 'ESG Score', 'Innovation Pipeline'] }
        },
        {
          id: 'trend-chart',
          type: 'chart',
          title: 'Performance Trends',
          size: 'medium',
          position: { x: 8, y: 0, w: 4, h: 3 },
          config: { type: 'line', timeframe: '12months' }
        },
        {
          id: 'alerts',
          type: 'alert-feed',
          title: 'Critical Alerts',
          size: 'medium',
          position: { x: 0, y: 3, w: 6, h: 2 },
          config: { severity: 'high', limit: 5 }
        },
        {
          id: 'insights',
          type: 'insights',
          title: 'AI Strategic Insights',
          size: 'medium',
          position: { x: 6, y: 3, w: 6, h: 2 },
          config: { type: 'executive', limit: 3 }
        }
      ]
    },
    filters: ['time-period', 'business-unit'],
    refreshRate: '15min',
    isDefault: true
  },
  {
    id: 'dept-deepdive',
    name: 'Department Deep Dive',
    role: 'manager',
    description: 'Detailed departmental metrics with drill-down capabilities',
    layout: {
      widgets: [
        {
          id: 'dept-kpis',
          type: 'kpi-card',
          title: 'Department KPIs',
          size: 'large',
          position: { x: 0, y: 0, w: 6, h: 2 },
          config: { filterByDepartment: true }
        },
        {
          id: 'team-comparison',
          type: 'chart',
          title: 'Team Performance Comparison',
          size: 'medium',
          position: { x: 6, y: 0, w: 6, h: 2 },
          config: { type: 'bar', groupBy: 'team' }
        },
        {
          id: 'progress-table',
          type: 'table',
          title: 'Goal Progress Tracking',
          size: 'large',
          position: { x: 0, y: 2, w: 8, h: 3 },
          config: { columns: ['goal', 'owner', 'progress', 'target_date', 'status'] }
        },
        {
          id: 'resource-gauge',
          type: 'gauge',
          title: 'Resource Utilization',
          size: 'small',
          position: { x: 8, y: 2, w: 4, h: 3 },
          config: { metric: 'resource_utilization' }
        }
      ]
    },
    filters: ['department', 'team', 'time-period'],
    refreshRate: '5min',
    isDefault: true
  },
  {
    id: 'team-scorecard',
    name: 'Team Scorecard',
    role: 'contributor',
    description: 'Team-level metrics and individual contribution tracking',
    layout: {
      widgets: [
        {
          id: 'team-metrics',
          type: 'kpi-card',
          title: 'Team Metrics',
          size: 'medium',
          position: { x: 0, y: 0, w: 6, h: 2 },
          config: { showTeamOnly: true }
        },
        {
          id: 'individual-progress',
          type: 'chart',
          title: 'My Contributions',
          size: 'medium',
          position: { x: 6, y: 0, w: 6, h: 2 },
          config: { type: 'progress', showPersonal: true }
        },
        {
          id: 'milestone-tracker',
          type: 'table',
          title: 'Upcoming Milestones',
          size: 'large',
          position: { x: 0, y: 2, w: 12, h: 2 },
          config: { filterByUser: true, timeframe: 'next30days' }
        },
        {
          id: 'peer-comparison',
          type: 'chart',
          title: 'Peer Benchmarking',
          size: 'medium',
          position: { x: 0, y: 4, w: 12, h: 2 },
          config: { type: 'comparison', anonymized: true }
        }
      ]
    },
    filters: ['team', 'time-period'],
    refreshRate: '1min',
    isDefault: true
  },
  {
    id: 'analyst-workbench',
    name: 'Analyst Workbench',
    role: 'analyst',
    description: 'Advanced analytics tools with data exploration capabilities',
    layout: {
      widgets: [
        {
          id: 'correlation-matrix',
          type: 'chart',
          title: 'KPI Correlation Analysis',
          size: 'large',
          position: { x: 0, y: 0, w: 6, h: 3 },
          config: { type: 'heatmap', showCorrelations: true }
        },
        {
          id: 'anomaly-detection',
          type: 'chart',
          title: 'Anomaly Detection',
          size: 'large',
          position: { x: 6, y: 0, w: 6, h: 3 },
          config: { type: 'scatter', highlightAnomalies: true }
        },
        {
          id: 'forecast-model',
          type: 'chart',
          title: 'Predictive Forecasting',
          size: 'large',
          position: { x: 0, y: 3, w: 8, h: 3 },
          config: { type: 'forecast', confidence_intervals: true }
        },
        {
          id: 'data-quality',
          type: 'gauge',
          title: 'Data Quality Score',
          size: 'small',
          position: { x: 8, y: 3, w: 4, h: 3 },
          config: { metric: 'data_quality' }
        }
      ]
    },
    filters: ['data-source', 'time-period', 'kpi-category'],
    refreshRate: 'real-time',
    isDefault: true
  }
];

const RoleBasedDashboardsPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('executive');
  const [selectedTemplate, setSelectedTemplate] = useState<DashboardTemplate | null>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'executive': return 'text-purple-400 bg-purple-500/20';
      case 'manager': return 'text-blue-400 bg-blue-500/20';
      case 'analyst': return 'text-green-400 bg-green-500/20';
      case 'contributor': return 'text-sky-400 bg-sky-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'executive': return 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4';
      case 'manager': return 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z';
      case 'analyst': return 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z';
      case 'contributor': return 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z';
      default: return 'M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  };

  const getWidgetIcon = (type: string) => {
    switch (type) {
      case 'kpi-card': return 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z';
      case 'chart': return 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6';
      case 'table': return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
      case 'gauge': return 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4';
      case 'alert-feed': return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0l-5.898 6.5c-.77.833.192 2.5 1.732 2.5z';
      case 'insights': return 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z';
      default: return 'M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  };

  const filteredTemplates = mockDashboardTemplates.filter(
    template => selectedRole === 'all' || template.role === selectedRole
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">Role-Based Dashboards</h2>
          <p className="text-slate-400 mt-2">Customized dashboard templates optimized for different roles and responsibilities</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="executive">Executive</option>
            <option value="manager">Manager</option>
            <option value="analyst">Analyst</option>
            <option value="contributor">Contributor</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors">
            <Icon path="M12 4v16m8-8H4" className="w-4 h-4" />
            Create Custom Dashboard
          </button>
        </div>
      </div>

      {/* Role Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['executive', 'manager', 'analyst', 'contributor'].map(role => (
          <GlassCard 
            key={role} 
            className={`p-4 cursor-pointer transition-colors ${
              selectedRole === role ? 'border-sky-500 bg-sky-500/10' : 'hover:border-slate-600'
            }`}
            onClick={() => setSelectedRole(role)}
          >
            <div className="flex items-center gap-3 mb-3">
              <Icon path={getRoleIcon(role)} className={`w-6 h-6 ${getRoleColor(role).split(' ')[0]}`} />
              <h3 className="font-semibold text-white capitalize">{role}</h3>
            </div>
            <p className="text-sm text-slate-400">
              {mockDashboardTemplates.filter(t => t.role === role).length} templates available
            </p>
          </GlassCard>
        ))}
      </div>

      {/* Dashboard Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredTemplates.map((template, index) => (
          <GlassCard key={index} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <Icon path={getRoleIcon(template.role)} className={`w-6 h-6 ${getRoleColor(template.role).split(' ')[0]}`} />
                <div>
                  <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getRoleColor(template.role)}`}>
                      {template.role.toUpperCase()}
                    </span>
                    {template.isDefault && (
                      <span className="px-2 py-1 text-xs rounded-full font-medium bg-green-500/20 text-green-400">
                        DEFAULT
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedTemplate(template)}
                  className="p-2 text-slate-400 hover:text-sky-400 transition-colors"
                >
                  <Icon path="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsCustomizing(true)}
                  className="p-2 text-slate-400 hover:text-purple-400 transition-colors"
                >
                  <Icon path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-sm text-slate-400 mb-4">{template.description}</p>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-2">
                  Widgets ({template.layout.widgets.length})
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {template.layout.widgets.map((widget, widgetIndex) => (
                    <div key={widgetIndex} className="flex items-center gap-2 p-2 bg-slate-800/50 rounded text-xs">
                      <Icon path={getWidgetIcon(widget.type)} className="w-3 h-3 text-sky-400" />
                      <span>{widget.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Refresh Rate:</span>
                  <div className="font-medium capitalize">{template.refreshRate.replace('-', ' ')}</div>
                </div>
                <div>
                  <span className="text-slate-400">Filters:</span>
                  <div className="font-medium">{template.filters.length} available</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded transition-colors text-sm font-medium">
                  Use Template
                </button>
                <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors text-sm font-medium">
                  Customize
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-700">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-white">{selectedTemplate.name}</h3>
                  <p className="text-slate-400">{selectedTemplate.description}</p>
                </div>
                <button 
                  onClick={() => setSelectedTemplate(null)}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Dashboard Layout Preview</h4>
              <div className="grid grid-cols-12 gap-4 h-96 bg-slate-900/50 rounded-lg p-4">
                {selectedTemplate.layout.widgets.map((widget, index) => (
                  <div 
                    key={index}
                    className="bg-slate-700/50 rounded border border-slate-600 p-3 flex items-center justify-center"
                    style={{
                      gridColumnStart: widget.position.x + 1,
                      gridColumnEnd: widget.position.x + widget.position.w + 1,
                      gridRowStart: widget.position.y + 1,
                      gridRowEnd: widget.position.y + widget.position.h + 1
                    }}
                  >
                    <div className="text-center">
                      <Icon path={getWidgetIcon(widget.type)} className="w-6 h-6 text-sky-400 mx-auto mb-1" />
                      <div className="text-xs text-slate-300">{widget.title}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <button className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors">
                  Use This Template
                </button>
                <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  Customize Layout
                </button>
                <button 
                  onClick={() => setSelectedTemplate(null)}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-sky-300 mb-4">Dashboard Usage Analytics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Most Used Template:</span>
              <span className="text-white font-medium">Executive Summary</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Avg Session Time:</span>
              <span className="text-green-400 font-medium">12m 34s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active Dashboards:</span>
              <span className="text-sky-400 font-medium">47</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-sky-300 mb-4">Popular Widgets</h3>
          <div className="space-y-3">
            {[
              { name: 'KPI Cards', usage: 85 },
              { name: 'Trend Charts', usage: 72 },
              { name: 'Alert Feed', usage: 68 },
              { name: 'Progress Tables', usage: 54 }
            ].map((widget, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-slate-300">{widget.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-sky-500 h-2 rounded-full"
                      style={{ width: `${widget.usage}%` }}
                    ></div>
                  </div>
                  <span className="text-sky-400 font-mono text-sm">{widget.usage}%</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-sky-300 mb-4">AI Recommendations</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-300 mb-2">Optimize Layout</p>
              <p className="text-xs text-slate-400">Consider moving alert feed to top-right for better visibility</p>
            </div>
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm text-green-300 mb-2">New Widget Suggestion</p>
              <p className="text-xs text-slate-400">Add competitive benchmarking widget based on your role</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default RoleBasedDashboardsPage;