import type { Process } from '@aesyros/types';

export const mockProcesses: Process[] = [
  {
    id: '1',
    name: 'Employee Onboarding SOP',
    description: 'Comprehensive process for onboarding new employees including documentation, training, and integration steps.',
    steps: [
      { id: '1-1', title: 'Document Collection', description: 'Collect all required legal and tax documents', order: 1, required: true, estimatedTime: 30 },
      { id: '1-2', title: 'IT Setup', description: 'Provision accounts, devices, and access permissions', order: 2, required: true, estimatedTime: 60 },
      { id: '1-3', title: 'Department Introduction', description: 'Meet team members and understand role responsibilities', order: 3, required: true, estimatedTime: 120 },
      { id: '1-4', title: 'Training Program', description: 'Complete mandatory training modules', order: 4, required: true, estimatedTime: 480 }
    ],
    owner: 'Sarah Chen',
    version: 'v2.1',
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    id: '2',
    name: 'Procurement Policy',
    description: 'Guidelines and procedures for purchasing goods and services, including approval workflows and vendor management.',
    steps: [
      { id: '2-1', title: 'Request Submission', description: 'Submit purchase request with business justification', order: 1, required: true, estimatedTime: 15 },
      { id: '2-2', title: 'Budget Approval', description: 'Department head reviews and approves budget allocation', order: 2, required: true, estimatedTime: 60 },
      { id: '2-3', title: 'Vendor Selection', description: 'Research and select approved vendors', order: 3, required: true, estimatedTime: 120 },
      { id: '2-4', title: 'Purchase Order', description: 'Create and send purchase order to vendor', order: 4, required: true, estimatedTime: 30 }
    ],
    owner: 'Alex Kim',
    version: 'v1.8',
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
  },
  {
    id: '3',
    name: 'Data Handling Protocol',
    description: 'Security procedures for handling, storing, and processing sensitive customer and business data.',
    steps: [
      { id: '3-1', title: 'Data Classification', description: 'Classify data sensitivity level and requirements', order: 1, required: true, estimatedTime: 20 },
      { id: '3-2', title: 'Access Control', description: 'Implement appropriate access controls and permissions', order: 2, required: true, estimatedTime: 45 },
      { id: '3-3', title: 'Encryption Setup', description: 'Apply encryption for data at rest and in transit', order: 3, required: true, estimatedTime: 60 },
      { id: '3-4', title: 'Audit Trail', description: 'Enable logging and monitoring for data access', order: 4, required: true, estimatedTime: 30 }
    ],
    owner: 'Mike Torres',
    version: 'v1.2',
    lastUpdated: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) // 3 weeks ago
  }
];

export const mockDocuments = [
  {
    id: '1',
    name: 'Employee Onboarding SOP',
    quality: 92,
    compliance: 'Pass' as const,
    issues: 1,
    category: 'HR Process',
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    owner: 'Sarah Chen',
    version: 'v2.1',
    wordCount: 2400,
    processId: '1'
  },
  {
    id: '2',
    name: 'Procurement Policy',
    quality: 78,
    compliance: 'Review' as const,
    issues: 4,
    category: 'Finance Policy',
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    owner: 'Alex Kim',
    version: 'v1.8',
    wordCount: 3200,
    processId: '2'
  },
  {
    id: '3',
    name: 'Data Handling Protocol',
    quality: 65,
    compliance: 'Fail' as const,
    issues: 7,
    category: 'IT Security',
    lastUpdated: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    owner: 'Mike Torres',
    version: 'v1.2',
    wordCount: 1800,
    processId: '3'
  }
];

export const mockValidationIssues = [
  {
    id: '1',
    documentId: '2',
    type: 'compliance' as const,
    severity: 'high' as const,
    title: 'Missing Risk Assessment',
    description: 'Procurement policy lacks mandatory risk assessment procedures for high-value purchases.',
    suggestion: 'Add section 4.3 covering risk evaluation criteria and mitigation strategies.',
    line: 45,
    resolved: false
  },
  {
    id: '2',
    documentId: '3',
    type: 'clarity' as const,
    severity: 'medium' as const,
    title: 'Ambiguous Data Retention Policy',
    description: 'Section 2.1 uses vague terms like "reasonable time" without specific timeframes.',
    suggestion: 'Replace with specific retention periods (e.g., "7 years for financial records").',
    line: 23,
    resolved: false
  },
  {
    id: '3',
    documentId: '3',
    type: 'redundancy' as const,
    severity: 'low' as const,
    title: 'Duplicate Authorization Steps',
    description: 'Steps 3 and 7 both require manager approval for the same action.',
    suggestion: 'Consolidate into single approval step or clarify different approval levels.',
    line: 67,
    resolved: true
  }
];

export const mockComplianceTemplates = [
  {
    id: '1',
    name: 'ISO 27001 Security',
    description: 'Information security management system requirements',
    category: 'Security',
    checkpoints: ['Access Control', 'Risk Assessment', 'Incident Response', 'Business Continuity']
  },
  {
    id: '2',
    name: 'GDPR Data Protection',
    description: 'European data protection regulation compliance',
    category: 'Privacy',
    checkpoints: ['Consent Management', 'Data Subject Rights', 'Privacy by Design', 'Breach Notification']
  },
  {
    id: '3',
    name: 'SOX Financial Controls',
    description: 'Sarbanes-Oxley financial reporting controls',
    category: 'Finance',
    checkpoints: ['Segregation of Duties', 'Management Oversight', 'Documentation', 'Testing']
  }
];

export const mockProcessMetrics = {
  totalProcesses: 24,
  documentsValidated: 156,
  complianceRate: 87,
  averageQuality: 84,
  issuesResolved: 78,
  pendingReviews: 12
};

export const mockUsers = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@company.com', role: 'admin' as const, department: 'HR' },
  { id: '2', name: 'Alex Kim', email: 'alex@company.com', role: 'user' as const, department: 'Finance' },
  { id: '3', name: 'Mike Torres', email: 'mike@company.com', role: 'user' as const, department: 'IT' },
  { id: '4', name: 'Lisa Park', email: 'lisa@company.com', role: 'user' as const, department: 'Operations' },
  { id: '5', name: 'Jordan Lee', email: 'jordan@company.com', role: 'user' as const, department: 'Legal' }
];