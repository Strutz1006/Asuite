// Advanced Flow Types for World-Class Process Management

// Process Mining & Discovery
export interface ProcessMiningResult {
  id: string;
  processName: string;
  discoveredVariants: ProcessVariant[];
  gapAnalysis: GapAnalysis;
  shadowProcesses: ShadowProcess[];
  fingerprint: ProcessFingerprint;
  confidence: number;
  lastAnalyzed: Date;
}

export interface ProcessVariant {
  id: string;
  frequency: number;
  avgDuration: number;
  path: ProcessStep[];
  performance: VariantPerformance;
}

export interface GapAnalysis {
  documentedSteps: string[];
  actualSteps: string[];
  missingSteps: string[];
  extraSteps: string[];
  deviationScore: number;
  recommendations: string[];
}

export interface ShadowProcess {
  id: string;
  name: string;
  frequency: number;
  participants: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  businessImpact: string;
}

export interface ProcessFingerprint {
  id: string;
  pattern: string;
  complexity: number;
  stakeholderCount: number;
  systemCount: number;
  riskProfile: string;
  similarProcesses: string[];
}

// Process Orchestration
export interface WorkflowExecution {
  id: string;
  processId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  currentStep: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  context: Record<string, any>;
  exceptions: WorkflowException[];
}

export interface WorkflowException {
  id: string;
  type: 'timeout' | 'approval_denied' | 'resource_unavailable' | 'system_error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  escalationPath: string[];
  fallbackProcedure?: string;
  timestamp: Date;
  resolved: boolean;
}

export interface SmartRouting {
  conditions: RoutingCondition[];
  loadBalancing: boolean;
  expertiseMatching: boolean;
  workloadDistribution: WorkloadRule[];
}

export interface RoutingCondition {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'contains' | 'in';
  value: any;
  target: string;
}

export interface WorkloadRule {
  role: string;
  maxConcurrent: number;
  priorityWeighting: number;
  skillsetRequired: string[];
}

// Compliance Intelligence
export interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  jurisdiction: string[];
  regulatoryBody: string;
  requirements: ComplianceRequirement[];
  lastUpdated: Date;
  riskProfile: ComplianceRisk;
}

export interface ComplianceRequirement {
  id: string;
  section: string;
  description: string;
  mandatory: boolean;
  evidence: string[];
  controls: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface ComplianceRisk {
  overall: number;
  categories: Record<string, number>;
  mitigation: string[];
  residualRisk: number;
}

export interface RegulatoryChange {
  id: string;
  frameworkId: string;
  changeType: 'new' | 'modified' | 'retired';
  effectiveDate: Date;
  impact: ProcessImpact[];
  description: string;
  actionRequired: boolean;
}

export interface ProcessImpact {
  processId: string;
  impactLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  requiredChanges: string[];
  estimatedEffort: number;
  deadline?: Date;
}

// Process Analytics
export interface ProcessMetrics {
  processId: string;
  cycleTime: CycleTimeMetrics;
  resourceUtilization: ResourceMetrics;
  qualityMetrics: QualityMetrics;
  costMetrics: CostMetrics;
  performanceTrend: PerformanceTrend;
}

export interface CycleTimeMetrics {
  average: number;
  median: number;
  standardDeviation: number;
  percentiles: Record<string, number>;
  bottlenecks: Bottleneck[];
}

export interface Bottleneck {
  stepId: string;
  stepName: string;
  avgWaitTime: number;
  frequency: number;
  impact: 'low' | 'medium' | 'high';
  suggestions: string[];
}

export interface ResourceMetrics {
  totalUtilization: number;
  byRole: Record<string, number>;
  overAllocated: string[];
  underUtilized: string[];
  skillGaps: SkillGap[];
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  affectedSteps: string[];
  trainingRequired: boolean;
}

export interface QualityMetrics {
  defectRate: number;
  reworkRate: number;
  firstPassYield: number;
  customerSatisfaction: number;
  qualityTrends: QualityTrend[];
}

export interface QualityTrend {
  date: Date;
  metric: string;
  value: number;
  benchmark: number;
}

export interface CostMetrics {
  totalCost: number;
  costPerExecution: number;
  laborCost: number;
  systemCost: number;
  optimizationPotential: number;
  benchmarkComparison: number;
}

export interface PerformanceTrend {
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  data: PerformanceDataPoint[];
  forecast: PerformanceDataPoint[];
  seasonality: boolean;
}

export interface PerformanceDataPoint {
  date: Date;
  value: number;
  confidence?: number;
}

// Collaborative Design
export interface ProcessReviewWorkflow {
  id: string;
  processId: string;
  reviewType: 'draft' | 'change' | 'periodic' | 'audit';
  reviewers: ProcessReviewer[];
  approvalChain: ApprovalStep[];
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'needs_revision';
  comments: ReviewComment[];
  deadline?: Date;
}

export interface ProcessReviewer {
  userId: string;
  role: 'stakeholder' | 'expert' | 'approver' | 'observer';
  department: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  weight: number;
}

export interface ApprovalStep {
  order: number;
  approverRole: string;
  required: boolean;
  delegationAllowed: boolean;
  timeoutDays: number;
  escalationPath: string[];
}

export interface ReviewComment {
  id: string;
  userId: string;
  stepId?: string;
  type: 'suggestion' | 'concern' | 'approval' | 'rejection';
  text: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  resolved: boolean;
}

export interface ProcessImprovement {
  id: string;
  title: string;
  description: string;
  submittedBy: string;
  category: 'efficiency' | 'quality' | 'cost' | 'compliance' | 'safety';
  potentialImpact: ImpactAssessment;
  votes: ImprovementVote[];
  status: 'submitted' | 'under_review' | 'approved' | 'implemented' | 'rejected';
}

export interface ImpactAssessment {
  timeReduction?: number;
  costSavings?: number;
  qualityImprovement?: number;
  riskReduction?: number;
  implementationCost: number;
  implementationTime: number;
  roiEstimate: number;
}

export interface ImprovementVote {
  userId: string;
  vote: 'support' | 'neutral' | 'oppose';
  reason?: string;
  timestamp: Date;
}

// Visual Intelligence
export interface ProcessMap {
  id: string;
  processId: string;
  type: 'bpmn' | 'swimlane' | 'flowchart' | 'heatmap';
  diagram: DiagramElement[];
  metadata: MapMetadata;
  interactiveElements: InteractiveElement[];
}

export interface DiagramElement {
  id: string;
  type: 'start' | 'end' | 'task' | 'decision' | 'gateway' | 'pool' | 'lane';
  label: string;
  position: { x: number; y: number };
  properties: Record<string, any>;
  connections: Connection[];
}

export interface Connection {
  targetId: string;
  label?: string;
  condition?: string;
  probability?: number;
}

export interface MapMetadata {
  generatedFrom: 'text' | 'discovery' | 'manual';
  confidence: number;
  lastUpdated: Date;
  version: string;
  stakeholders: string[];
}

export interface InteractiveElement {
  elementId: string;
  drillDownTarget?: string;
  performanceData?: any;
  complianceStatus?: string;
  alerts?: string[];
}

// Smart Documentation
export interface ProcessKnowledge {
  id: string;
  processId: string;
  extractedPolicies: ExtractedPolicy[];
  generatedFaqs: ProcessFaq[];
  contextualHelp: ContextualHelp[];
  translations: Translation[];
  documentClusters: DocumentCluster[];
}

export interface ExtractedPolicy {
  id: string;
  text: string;
  category: string;
  confidence: number;
  sourceDocument: string;
  enforceable: boolean;
}

export interface ProcessFaq {
  id: string;
  question: string;
  answer: string;
  category: string;
  relevance: number;
  sources: string[];
}

export interface ContextualHelp {
  stepId: string;
  triggers: string[];
  content: string;
  type: 'tip' | 'warning' | 'procedure' | 'reference';
}

export interface Translation {
  language: string;
  content: Record<string, string>;
  quality: number;
  lastUpdated: Date;
}

export interface DocumentCluster {
  id: string;
  documents: string[];
  theme: string;
  redundancy: number;
  conflicts: DocumentConflict[];
}

export interface DocumentConflict {
  document1: string;
  document2: string;
  conflictType: 'procedure' | 'policy' | 'approval' | 'timeline';
  description: string;
  severity: 'low' | 'medium' | 'high';
}

// Process Optimization
export interface OptimizationOpportunity {
  id: string;
  processId: string;
  type: 'automation' | 'simplification' | 'parallelization' | 'resource_optimization';
  description: string;
  potentialSavings: PotentialSavings;
  implementationComplexity: 'low' | 'medium' | 'high';
  prerequisites: string[];
  riskLevel: 'low' | 'medium' | 'high';
  priority: number;
}

export interface PotentialSavings {
  timeReduction: number;
  costReduction: number;
  qualityImprovement: number;
  riskReduction: number;
  roiEstimate: number;
  paybackPeriod: number;
}

export interface AutomationOpportunity {
  stepId: string;
  automationType: 'rpa' | 'api' | 'rule_engine' | 'ml_decision';
  feasibilityScore: number;
  requiredTechnology: string[];
  estimatedEffort: number;
  riskFactors: string[];
}

// Integration & Ecosystem
export interface IntegrationConfig {
  id: string;
  name: string;
  type: 'rpa' | 'document_management' | 'itsm' | 'erp' | 'custom';
  platform: string;
  connectionString: string;
  credentials: Record<string, string>;
  mappings: DataMapping[];
  enabled: boolean;
  lastSync?: Date;
}

export interface DataMapping {
  sourceField: string;
  targetField: string;
  transformation?: string;
  required: boolean;
}

// Governance Framework
export interface ProcessGovernance {
  processId: string;
  owner: ProcessOwner;
  stakeholders: ProcessStakeholder[];
  lifecycle: ProcessLifecycle;
  changeControl: ChangeControl;
  attestations: ComplianceAttestation[];
}

export interface ProcessOwner {
  userId: string;
  role: string;
  responsibilities: string[];
  accountabilityMetrics: string[];
  delegationRules: DelegationRule[];
}

export interface ProcessStakeholder {
  userId: string;
  role: 'contributor' | 'reviewer' | 'approver' | 'consumer';
  influence: 'low' | 'medium' | 'high';
  notificationPreferences: NotificationPreference[];
}

export interface ProcessLifecycle {
  status: 'draft' | 'active' | 'deprecated' | 'retired';
  version: string;
  effectiveDate: Date;
  retirementDate?: Date;
  changeHistory: LifecycleChange[];
}

export interface LifecycleChange {
  version: string;
  changeType: 'minor' | 'major' | 'patch';
  description: string;
  approvedBy: string;
  effectiveDate: Date;
  impact: string[];
}

export interface ChangeControl {
  requiresApproval: boolean;
  approvalThreshold: number;
  changeControlBoard: string[];
  votingRules: VotingRule[];
  emergencyBypass: boolean;
}

export interface VotingRule {
  role: string;
  weight: number;
  vetoRight: boolean;
}

export interface ComplianceAttestation {
  id: string;
  attestedBy: string;
  framework: string;
  attestationType: 'design' | 'operating_effectiveness' | 'annual';
  status: 'current' | 'expired' | 'pending';
  validUntil: Date;
  digitalSignature: string;
  evidence: string[];
}

export interface NotificationPreference {
  event: string;
  method: 'email' | 'slack' | 'teams' | 'in_app';
  frequency: 'immediate' | 'daily' | 'weekly';
}

export interface DelegationRule {
  condition: string;
  delegateTo: string;
  duration: number;
  restrictions: string[];
}