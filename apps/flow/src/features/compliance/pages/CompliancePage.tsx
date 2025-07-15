import React, { useState, useEffect } from 'react';
import { GlassCard, Icon } from '../../shared/components';
import type { ComplianceFramework, RegulatoryChange, ProcessImpact } from '../../shared/types/advanced';

const CompliancePage: React.FC = () => {
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<ComplianceFramework | null>(null);
  const [regulatoryChanges, setRegulatoryChanges] = useState<RegulatoryChange[]>([]);
  const [activeTab, setActiveTab] = useState<'frameworks' | 'changes' | 'assessment'>('frameworks');

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = () => {
    // Mock compliance frameworks
    const mockFrameworks: ComplianceFramework[] = [
      {
        id: 'iso27001',
        name: 'ISO 27001',
        version: '2022',
        jurisdiction: ['Global'],
        regulatoryBody: 'International Organization for Standardization',
        lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        riskProfile: {
          overall: 7.2,
          categories: {
            'Access Control': 8.1,
            'Incident Management': 6.8,
            'Risk Assessment': 7.5,
            'Business Continuity': 6.9
          },
          mitigation: [
            'Implement comprehensive access control policies',
            'Establish incident response procedures',
            'Conduct regular risk assessments'
          ],
          residualRisk: 4.2
        },
        requirements: [
          {
            id: 'iso-acc-001',
            section: 'A.9.1.1',
            description: 'Access control policy shall be established, documented and reviewed',
            mandatory: true,
            evidence: ['Access Control Policy Document', 'Review Meeting Minutes'],
            controls: ['Document Control', 'Management Review'],
            riskLevel: 'high'
          },
          {
            id: 'iso-inc-001',
            section: 'A.16.1.1',
            description: 'Incident management responsibilities and procedures shall be established',
            mandatory: true,
            evidence: ['Incident Response Plan', 'Training Records'],
            controls: ['Incident Tracking System', 'Response Team'],
            riskLevel: 'medium'
          }
        ]
      },
      {
        id: 'gdpr',
        name: 'GDPR',
        version: '2018',
        jurisdiction: ['EU', 'EEA'],
        regulatoryBody: 'European Commission',
        lastUpdated: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        riskProfile: {
          overall: 8.5,
          categories: {
            'Consent Management': 9.2,
            'Data Subject Rights': 8.8,
            'Privacy by Design': 7.9,
            'Breach Notification': 8.1
          },
          mitigation: [
            'Implement consent management system',
            'Establish data subject request procedures',
            'Design privacy controls into processes'
          ],
          residualRisk: 5.1
        },
        requirements: [
          {
            id: 'gdpr-con-001',
            section: 'Art. 7',
            description: 'Consent must be freely given, specific, informed and unambiguous',
            mandatory: true,
            evidence: ['Consent Records', 'Privacy Notices'],
            controls: ['Consent Management Platform', 'Audit Logs'],
            riskLevel: 'critical'
          },
          {
            id: 'gdpr-dsr-001',
            section: 'Art. 15-22',
            description: 'Data subjects have rights to access, rectification, erasure and portability',
            mandatory: true,
            evidence: ['Request Handling Procedures', 'Response Templates'],
            controls: ['Request Management System', 'Identity Verification'],
            riskLevel: 'high'
          }
        ]
      },
      {
        id: 'sox',
        name: 'Sarbanes-Oxley',
        version: '2002',
        jurisdiction: ['US'],
        regulatoryBody: 'SEC',
        lastUpdated: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        riskProfile: {
          overall: 6.8,
          categories: {
            'Segregation of Duties': 7.5,
            'Management Oversight': 6.2,
            'Documentation': 7.1,
            'Testing': 6.8
          },
          mitigation: [
            'Implement role-based access controls',
            'Establish management review processes',
            'Maintain comprehensive documentation'
          ],
          residualRisk: 3.9
        },
        requirements: [
          {
            id: 'sox-sod-001',
            section: '404',
            description: 'Adequate segregation of duties in financial processes',
            mandatory: true,
            evidence: ['Role Assignment Matrix', 'Access Reviews'],
            controls: ['Role-Based Access Control', 'Periodic Reviews'],
            riskLevel: 'high'
          }
        ]
      }
    ];

    // Mock regulatory changes
    const mockChanges: RegulatoryChange[] = [
      {
        id: 'change-1',
        frameworkId: 'gdpr',
        changeType: 'modified',
        effectiveDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        description: 'Updated guidance on consent mechanisms for digital services',
        actionRequired: true,
        impact: [
          {
            processId: 'proc-1',
            impactLevel: 'high',
            requiredChanges: [
              'Update consent collection forms',
              'Revise privacy notices',
              'Modify data processing procedures'
            ],
            estimatedEffort: 40,
            deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
          }
        ]
      },
      {
        id: 'change-2',
        frameworkId: 'iso27001',
        changeType: 'new',
        effectiveDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        description: 'New requirements for cloud security controls',
        actionRequired: true,
        impact: [
          {
            processId: 'proc-2',
            impactLevel: 'medium',
            requiredChanges: [
              'Implement cloud security assessment',
              'Update vendor management procedures'
            ],
            estimatedEffort: 24,
            deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    ];

    setFrameworks(mockFrameworks);
    setRegulatoryChanges(mockChanges);
  };

  const getRiskColor = (level: string | number) => {
    if (typeof level === 'string') {
      switch (level) {
        case 'critical': return 'text-red-400 bg-red-500/20';
        case 'high': return 'text-orange-400 bg-orange-500/20';
        case 'medium': return 'text-yellow-400 bg-yellow-500/20';
        case 'low': return 'text-green-400 bg-green-500/20';
        default: return 'text-slate-400 bg-slate-500/20';
      }
    } else {
      if (level >= 8) return 'text-red-400';
      if (level >= 6) return 'text-yellow-400';
      return 'text-green-400';
    }
  };

  const getImpactColor = (impact: ProcessImpact['impactLevel']) => {
    switch (impact) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      case 'none': return 'text-slate-400 bg-slate-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getChangeTypeColor = (type: RegulatoryChange['changeType']) => {
    switch (type) {
      case 'new': return 'text-blue-400 bg-blue-500/20';
      case 'modified': return 'text-yellow-400 bg-yellow-500/20';
      case 'retired': return 'text-slate-400 bg-slate-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-200">Compliance Intelligence</h1>
          <p className="text-slate-400 mt-1">
            Track regulatory frameworks, monitor changes, and assess compliance risks
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-800 rounded-lg p-1">
            {(['frameworks', 'changes', 'assessment'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setShowRiskAssessment(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            Run Assessment
          </button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Frameworks</p>
              <p className="text-2xl font-bold text-slate-200">{frameworks.length}</p>
            </div>
            <Icon path="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" className="w-8 h-8 text-sky-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Pending Changes</p>
              <p className="text-2xl font-bold text-slate-200">
                {regulatoryChanges.filter(c => c.actionRequired).length}
              </p>
            </div>
            <Icon path="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" className="w-8 h-8 text-yellow-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Avg Risk Score</p>
              <p className="text-2xl font-bold text-slate-200">
                {(frameworks.reduce((acc, f) => acc + f.riskProfile.overall, 0) / frameworks.length).toFixed(1)}
              </p>
            </div>
            <Icon path="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" className="w-8 h-8 text-orange-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">High Risk Items</p>
              <p className="text-2xl font-bold text-slate-200">
                {frameworks.reduce((acc, f) => 
                  acc + f.requirements.filter(r => r.riskLevel === 'high' || r.riskLevel === 'critical').length, 0
                )}
              </p>
            </div>
            <Icon path="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" className="w-8 h-8 text-red-400" />
          </div>
        </GlassCard>
      </div>

      {/* Tab Content */}
      {activeTab === 'frameworks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Frameworks List */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Compliance Frameworks</h3>
              
              <div className="space-y-4">
                {frameworks.map((framework) => (
                  <div
                    key={framework.id}
                    onClick={() => setSelectedFramework(framework)}
                    className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-200 mb-1">{framework.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>Version: {framework.version}</span>
                          <span>{framework.jurisdiction.join(', ')}</span>
                          <span>{framework.requirements.length} requirements</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getRiskColor(framework.riskProfile.overall)}`}>
                          {framework.riskProfile.overall.toFixed(1)}
                        </div>
                        <div className="text-xs text-slate-400">Risk Score</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-400">
                          Updated: {framework.lastUpdated.toLocaleDateString()}
                        </span>
                        <span className="text-slate-400">
                          By: {framework.regulatoryBody}
                        </span>
                      </div>
                      
                      <button className="text-sky-400 hover:text-sky-300 text-sm">
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Framework Details */}
          <div>
            {selectedFramework ? (
              <div className="space-y-4">
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4">Framework Details</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Risk Categories</h4>
                      <div className="space-y-2">
                        {Object.entries(selectedFramework.riskProfile.categories).map(([category, score]) => (
                          <div key={category} className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">{category}</span>
                            <span className={`text-sm font-medium ${getRiskColor(score)}`}>
                              {score.toFixed(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Mitigation Actions</h4>
                      <div className="space-y-1">
                        {selectedFramework.riskProfile.mitigation.map((action, index) => (
                          <div key={index} className="text-sm text-slate-400 bg-slate-700/50 p-2 rounded">
                            {action}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
                
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4">Key Requirements</h3>
                  
                  <div className="space-y-3">
                    {selectedFramework.requirements.slice(0, 3).map((req) => (
                      <div key={req.id} className="p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm font-medium text-slate-200">{req.section}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(req.riskLevel)}`}>
                            {req.riskLevel}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{req.description}</p>
                        <div className="text-xs text-slate-500">
                          {req.evidence.length} evidence items • {req.controls.length} controls
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            ) : (
              <GlassCard className="p-6 text-center">
                <Icon path="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-200 mb-2">Select Framework</h3>
                <p className="text-slate-400">Click on a framework to view detailed requirements and risk analysis</p>
              </GlassCard>
            )}
          </div>
        </div>
      )}

      {activeTab === 'changes' && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Regulatory Changes</h3>
          
          <div className="space-y-4">
            {regulatoryChanges.map((change) => (
              <div key={change.id} className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-slate-200">
                        {frameworks.find(f => f.id === change.frameworkId)?.name}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChangeTypeColor(change.changeType)}`}>
                        {change.changeType}
                      </span>
                      {change.actionRequired && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium text-red-400 bg-red-500/20">
                          Action Required
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 mb-2">{change.description}</p>
                    <div className="text-sm text-slate-400">
                      Effective: {change.effectiveDate.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                {change.impact.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <h5 className="text-sm font-medium text-slate-300 mb-2">Process Impact</h5>
                    <div className="space-y-2">
                      {change.impact.map((impact, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-slate-400">Process {impact.processId}</span>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getImpactColor(impact.impactLevel)}`}>
                              {impact.impactLevel}
                            </span>
                            <span className="text-slate-400">{impact.estimatedEffort}h effort</span>
                            {impact.deadline && (
                              <span className="text-slate-400">
                                Due: {impact.deadline.toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {activeTab === 'assessment' && (
        <GlassCard className="p-6">
          <div className="text-center py-12">
            <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Compliance Assessment</h3>
            <p className="text-slate-400 mb-6">
              Run automated compliance assessments against your processes and identify gaps
            </p>
            <button
              onClick={() => setShowRiskAssessment(true)}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
            >
              Start Assessment
            </button>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default CompliancePage;