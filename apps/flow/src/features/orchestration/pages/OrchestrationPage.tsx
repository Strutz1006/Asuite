import React, { useState, useEffect } from 'react';
import { GlassCard, Icon } from '../../shared/components';
import type { WorkflowExecution, WorkflowException, SmartRouting } from '../../shared/types/advanced';

const OrchestrationPage: React.FC = () => {
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'failed'>('active');
  const [showRoutingConfig, setShowRoutingConfig] = useState(false);

  useEffect(() => {
    loadExecutions();
    const interval = setInterval(loadExecutions, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadExecutions = () => {
    // Mock data - in real implementation, this would call the orchestration service
    const mockExecutions: WorkflowExecution[] = [
      {
        id: 'exec-1',
        processId: 'proc-1',
        status: 'running',
        currentStep: 'Document Review',
        assignedTo: 'sarah.chen@company.com',
        priority: 'high',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        context: {
          documentId: 'doc-123',
          requestor: 'john.doe@company.com',
          amount: 15000,
          department: 'Engineering'
        },
        exceptions: []
      },
      {
        id: 'exec-2',
        processId: 'proc-2',
        status: 'pending',
        currentStep: 'Initial Assessment',
        priority: 'medium',
        startTime: new Date(Date.now() - 30 * 60 * 1000),
        context: {
          candidateId: 'cand-456',
          position: 'Senior Developer',
          department: 'Engineering'
        },
        exceptions: []
      },
      {
        id: 'exec-3',
        processId: 'proc-1',
        status: 'failed',
        currentStep: 'Budget Approval',
        assignedTo: 'alex.kim@company.com',
        priority: 'urgent',
        startTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
        duration: 180,
        context: {
          documentId: 'doc-789',
          requestor: 'jane.smith@company.com',
          amount: 50000,
          department: 'Marketing'
        },
        exceptions: [
          {
            id: 'exc-1',
            type: 'approval_denied',
            severity: 'high',
            message: 'Budget exceeds departmental limit without CFO approval',
            escalationPath: ['dept.manager@company.com', 'cfo@company.com'],
            fallbackProcedure: 'Escalate to CFO approval workflow',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            resolved: false
          }
        ]
      },
      {
        id: 'exec-4',
        processId: 'proc-3',
        status: 'completed',
        currentStep: 'Process Complete',
        assignedTo: 'mike.torres@company.com',
        priority: 'low',
        startTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 30 * 60 * 1000),
        duration: 330,
        context: {
          vendorId: 'vendor-123',
          contractValue: 25000,
          renewalDate: '2024-12-31'
        },
        exceptions: []
      }
    ];
    
    setExecutions(mockExecutions);
  };

  const getStatusColor = (status: WorkflowExecution['status']) => {
    switch (status) {
      case 'running': return 'text-blue-400 bg-blue-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'failed': return 'text-red-400 bg-red-500/20';
      case 'cancelled': return 'text-slate-400 bg-slate-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getPriorityColor = (priority: WorkflowExecution['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const getExceptionSeverityColor = (severity: WorkflowException['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const filteredExecutions = executions.filter(execution => {
    switch (activeTab) {
      case 'active': return ['running', 'pending'].includes(execution.status);
      case 'completed': return execution.status === 'completed';
      case 'failed': return execution.status === 'failed' || execution.status === 'cancelled';
      default: return true;
    }
  });

  const handleRetryExecution = (executionId: string) => {
    // Mock retry logic
    setExecutions(prev => prev.map(exec => 
      exec.id === executionId 
        ? { ...exec, status: 'pending', exceptions: [] }
        : exec
    ));
  };

  const handleEscalateException = (executionId: string, exceptionId: string) => {
    // Mock escalation logic
    setExecutions(prev => prev.map(exec => {
      if (exec.id === executionId) {
        return {
          ...exec,
          exceptions: exec.exceptions.map(exc =>
            exc.id === exceptionId ? { ...exc, resolved: true } : exc
          )
        };
      }
      return exec;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-200">Process Orchestration</h1>
          <p className="text-slate-400 mt-1">
            Monitor and manage workflow executions with intelligent routing and exception handling
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRoutingConfig(true)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors flex items-center gap-2"
          >
            <Icon path="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m0 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            Configure Routing
          </button>
          
          <button className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center gap-2">
            <Icon path="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
            Start Workflow
          </button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Active Executions</p>
              <p className="text-2xl font-bold text-slate-200">
                {executions.filter(e => ['running', 'pending'].includes(e.status)).length}
              </p>
            </div>
            <Icon path="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" className="w-8 h-8 text-blue-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Completed Today</p>
              <p className="text-2xl font-bold text-slate-200">
                {executions.filter(e => e.status === 'completed').length}
              </p>
            </div>
            <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-green-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Exceptions</p>
              <p className="text-2xl font-bold text-slate-200">
                {executions.reduce((acc, e) => acc + e.exceptions.filter(ex => !ex.resolved).length, 0)}
              </p>
            </div>
            <Icon path="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" className="w-8 h-8 text-yellow-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Avg Completion</p>
              <p className="text-2xl font-bold text-slate-200">
                {Math.round(executions.filter(e => e.duration).reduce((acc, e) => acc + (e.duration || 0), 0) / executions.filter(e => e.duration).length)}m
              </p>
            </div>
            <Icon path="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-sky-400" />
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Execution List */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-200">Workflow Executions</h3>
              
              <div className="flex bg-slate-800 rounded-lg p-1">
                {(['active', 'completed', 'failed'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-sky-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              {filteredExecutions.map((execution) => (
                <div
                  key={execution.id}
                  onClick={() => setSelectedExecution(execution)}
                  className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-slate-200">Process {execution.processId}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(execution.status)}`}>
                          {execution.status}
                        </span>
                        <Icon 
                          path="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"
                          className={`w-4 h-4 ${getPriorityColor(execution.priority)}`}
                        />
                      </div>
                      <p className="text-sm text-slate-400 mb-2">Current: {execution.currentStep}</p>
                      {execution.assignedTo && (
                        <p className="text-sm text-slate-500">Assigned to: {execution.assignedTo}</p>
                      )}
                    </div>
                    
                    <div className="text-right text-sm text-slate-400">
                      <p>Started: {execution.startTime.toLocaleTimeString()}</p>
                      {execution.duration && (
                        <p>Duration: {execution.duration}m</p>
                      )}
                    </div>
                  </div>
                  
                  {execution.exceptions.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Icon path="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" className="w-4 h-4 text-red-400" />
                      <span className="text-red-300">
                        {execution.exceptions.filter(e => !e.resolved).length} unresolved exceptions
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Execution Details */}
        <div>
          {selectedExecution ? (
            <div className="space-y-4">
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Execution Details</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">ID:</span>
                    <span className="text-slate-200 font-mono text-sm">{selectedExecution.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedExecution.status)}`}>
                      {selectedExecution.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Priority:</span>
                    <span className={`font-medium ${getPriorityColor(selectedExecution.priority)}`}>
                      {selectedExecution.priority}
                    </span>
                  </div>
                  {selectedExecution.assignedTo && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Assigned:</span>
                      <span className="text-slate-200 text-sm">{selectedExecution.assignedTo}</span>
                    </div>
                  )}
                </div>
                
                {selectedExecution.status === 'failed' && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <button
                      onClick={() => handleRetryExecution(selectedExecution.id)}
                      className="w-full px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors text-sm"
                    >
                      Retry Execution
                    </button>
                  </div>
                )}
              </GlassCard>
              
              {selectedExecution.exceptions.length > 0 && (
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4">Exceptions</h3>
                  
                  <div className="space-y-3">
                    {selectedExecution.exceptions.map((exception) => (
                      <div key={exception.id} className="p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getExceptionSeverityColor(exception.severity)}`}>
                            {exception.severity}
                          </span>
                          <span className="text-xs text-slate-500">
                            {exception.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-200 mb-2">{exception.message}</p>
                        {exception.fallbackProcedure && (
                          <p className="text-xs text-slate-400 mb-2">
                            Fallback: {exception.fallbackProcedure}
                          </p>
                        )}
                        {!exception.resolved && (
                          <button
                            onClick={() => handleEscalateException(selectedExecution.id, exception.id)}
                            className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded transition-colors"
                          >
                            Escalate
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
              
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Context</h3>
                
                <div className="space-y-2">
                  {Object.entries(selectedExecution.context).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-slate-400">{key}:</span>
                      <span className="text-slate-200">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          ) : (
            <GlassCard className="p-6 text-center">
              <Icon path="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-200 mb-2">Select Execution</h3>
              <p className="text-slate-400">Click on an execution to view details and manage exceptions</p>
            </GlassCard>
          )}
        </div>
      </div>

      {showRoutingConfig && (
        <SmartRoutingConfig onClose={() => setShowRoutingConfig(false)} />
      )}
    </div>
  );
};

const SmartRoutingConfig: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <GlassCard className="w-full max-w-2xl p-6 mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-200">Smart Routing Configuration</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200"
          >
            <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-slate-200 mb-3">Routing Conditions</h3>
            <div className="space-y-3">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <select className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm">
                    <option>Priority</option>
                    <option>Department</option>
                    <option>Amount</option>
                  </select>
                  <select className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm">
                    <option>equals</option>
                    <option>greater than</option>
                    <option>contains</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Value"
                    className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Route to (user/role)"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm"
                />
              </div>
            </div>
            <button className="mt-3 px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-sm">
              Add Condition
            </button>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-slate-200 mb-3">Load Balancing</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600 bg-slate-700 text-sky-600" />
                <span className="text-slate-300">Enable automatic load balancing</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600 bg-slate-700 text-sky-600" />
                <span className="text-slate-300">Match tasks to user expertise</span>
              </label>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default OrchestrationPage;