import { useState } from 'react'
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Zap, 
  Brain, 
  Clock, 
  TrendingUp,
  FileCheck,
  Search,
  Settings,
  Download,
  Eye,
  MessageSquare,
  BarChart3,
  Target,
  Lightbulb
} from 'lucide-react'

export interface DocumentAnalysis {
  id: string
  documentName: string
  documentType: 'policy' | 'process' | 'procedure' | 'manual'
  uploadDate: string
  analysisStatus: 'pending' | 'analyzing' | 'completed' | 'failed'
  qualityScore: number
  complianceScore: number
  efficiencyScore: number
  issues: AnalysisIssue[]
  suggestions: AnalysisSuggestion[]
  metrics: DocumentMetrics
}

export interface AnalysisIssue {
  id: string
  type: 'critical' | 'warning' | 'info'
  category: 'quality' | 'compliance' | 'efficiency' | 'clarity'
  description: string
  location: string
  recommendation: string
  priority: number
}

export interface AnalysisSuggestion {
  id: string
  type: 'optimization' | 'automation' | 'simplification' | 'standardization'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  effort: 'low' | 'medium' | 'high'
  estimatedSavings: string
}

export interface DocumentMetrics {
  readabilityScore: number
  completenessPercentage: number
  consistencyRating: number
  processSteps: number
  decisionPoints: number
  estimatedTime: string
  complexity: 'low' | 'medium' | 'high'
}

const mockAnalyses: DocumentAnalysis[] = [
  {
    id: '1',
    documentName: 'Employee Onboarding Process.pdf',
    documentType: 'process',
    uploadDate: '2024-01-15T10:30:00Z',
    analysisStatus: 'completed',
    qualityScore: 78,
    complianceScore: 85,
    efficiencyScore: 62,
    issues: [
      {
        id: '1-1',
        type: 'critical',
        category: 'compliance',
        description: 'Missing GDPR data handling procedures',
        location: 'Section 3: Data Collection',
        recommendation: 'Add explicit consent collection and data retention policies',
        priority: 1
      },
      {
        id: '1-2',
        type: 'warning',
        category: 'efficiency',
        description: 'Redundant approval steps detected',
        location: 'Steps 7-9',
        recommendation: 'Consolidate approvals to reduce processing time',
        priority: 2
      }
    ],
    suggestions: [
      {
        id: '1-s1',
        type: 'automation',
        title: 'Automate IT Setup Tasks',
        description: 'Steps 12-15 can be automated through HR system integration',
        impact: 'high',
        effort: 'medium',
        estimatedSavings: '4 hours per onboarding'
      }
    ],
    metrics: {
      readabilityScore: 75,
      completenessPercentage: 88,
      consistencyRating: 82,
      processSteps: 18,
      decisionPoints: 4,
      estimatedTime: '6-8 hours',
      complexity: 'medium'
    }
  },
  {
    id: '2',
    documentName: 'Data Privacy Policy.docx',
    documentType: 'policy',
    uploadDate: '2024-01-14T14:15:00Z',
    analysisStatus: 'completed',
    qualityScore: 92,
    complianceScore: 96,
    efficiencyScore: 88,
    issues: [
      {
        id: '2-1',
        type: 'info',
        category: 'clarity',
        description: 'Technical terms could be simplified',
        location: 'Section 5: Data Processing',
        recommendation: 'Add glossary or plain language explanations',
        priority: 3
      }
    ],
    suggestions: [
      {
        id: '2-s1',
        type: 'simplification',
        title: 'Create Visual Data Flow',
        description: 'Replace complex text with visual data flow diagram',
        impact: 'medium',
        effort: 'low',
        estimatedSavings: 'Improved comprehension'
      }
    ],
    metrics: {
      readabilityScore: 85,
      completenessPercentage: 95,
      consistencyRating: 90,
      processSteps: 0,
      decisionPoints: 0,
      estimatedTime: 'N/A',
      complexity: 'low'
    }
  }
]

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-400'
  if (score >= 60) return 'text-yellow-400'
  return 'text-red-400'
}

const getIssueColor = (type: string) => {
  switch (type) {
    case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30'
    case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    case 'info': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  }
}

const getIssueIcon = (type: string) => {
  switch (type) {
    case 'critical': return XCircle
    case 'warning': return AlertTriangle
    case 'info': return MessageSquare
    default: return MessageSquare
  }
}

export default function DocumentAnalyzer() {
  const [analyses] = useState<DocumentAnalysis[]>(mockAnalyses)
  const [selectedAnalysis, setSelectedAnalysis] = useState<DocumentAnalysis | null>(null)
  const [viewMode, setViewMode] = useState<'overview' | 'details' | 'upload'>('overview')

  const renderUploadArea = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Upload className="w-12 h-12 text-teal-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Upload Document for Analysis</h2>
        <p className="text-slate-400">Upload your process documents for AI-powered analysis and optimization</p>
      </div>

      <div className="glass-card p-8">
        <div className="border-2 border-dashed border-slate-600 rounded-lg p-12 text-center hover:border-teal-500 transition-colors cursor-pointer">
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-200 mb-2">Drop files here or click to upload</h3>
          <p className="text-slate-400 mb-4">Supports PDF, Word, Excel, and text formats</p>
          <button className="glass-button px-6 py-3 text-teal-400 hover:text-teal-300">
            Select Files
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 text-center">
          <Brain className="w-8 h-8 text-teal-400 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-100 mb-2">AI Analysis</h3>
          <p className="text-sm text-slate-400">Advanced AI scans for quality, compliance, and efficiency</p>
        </div>
        
        <div className="glass-card p-6 text-center">
          <Zap className="w-8 h-8 text-teal-400 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-100 mb-2">Instant Results</h3>
          <p className="text-sm text-slate-400">Get immediate feedback and actionable recommendations</p>
        </div>
        
        <div className="glass-card p-6 text-center">
          <Target className="w-8 h-8 text-teal-400 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-100 mb-2">Smart Optimization</h3>
          <p className="text-sm text-slate-400">Receive tailored suggestions for process improvement</p>
        </div>
      </div>
    </div>
  )

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/20 rounded-lg">
              <FileCheck className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-100">{analyses.length}</div>
              <div className="text-sm text-slate-400">Documents Analyzed</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-100">18</div>
              <div className="text-sm text-slate-400">Issues Resolved</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-100">23%</div>
              <div className="text-sm text-slate-400">Efficiency Gain</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-100">42h</div>
              <div className="text-sm text-slate-400">Time Saved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      <div className="space-y-4">
        {analyses.map((analysis) => (
          <div key={analysis.id} className="glass-card p-6 hover:bg-slate-800/40 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">{analysis.documentName}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="capitalize">{analysis.documentType}</span>
                    <span>•</span>
                    <span>{new Date(analysis.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setSelectedAnalysis(analysis)
                    setViewMode('details')
                  }}
                  className="glass-button p-2 text-slate-400 hover:text-slate-300"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button className="glass-button p-2 text-slate-400 hover:text-slate-300">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Score Indicators */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(analysis.qualityScore)}`}>
                  {analysis.qualityScore}%
                </div>
                <div className="text-sm text-slate-400">Quality Score</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(analysis.complianceScore)}`}>
                  {analysis.complianceScore}%
                </div>
                <div className="text-sm text-slate-400">Compliance</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(analysis.efficiencyScore)}`}>
                  {analysis.efficiencyScore}%
                </div>
                <div className="text-sm text-slate-400">Efficiency</div>
              </div>
            </div>

            {/* Issues Summary */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-slate-400">
                  {analysis.issues.filter(i => i.type === 'critical').length} Critical
                </span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-slate-400">
                  {analysis.issues.filter(i => i.type === 'warning').length} Warnings
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Lightbulb className="w-4 h-4 text-blue-400" />
                <span className="text-slate-400">
                  {analysis.suggestions.length} Suggestions
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderDetails = () => {
    if (!selectedAnalysis) return null

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">{selectedAnalysis.documentName}</h2>
            <p className="text-slate-400">Detailed analysis results and recommendations</p>
          </div>
          <button 
            onClick={() => setViewMode('overview')}
            className="glass-button px-4 py-2 text-slate-400 hover:text-slate-300"
          >
            ← Back to Overview
          </button>
        </div>

        {/* Detailed Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-100">Quality Analysis</h3>
              <div className={`text-2xl font-bold ${getScoreColor(selectedAnalysis.qualityScore)}`}>
                {selectedAnalysis.qualityScore}%
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Readability</span>
                <span className="text-slate-300">{selectedAnalysis.metrics.readabilityScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Completeness</span>
                <span className="text-slate-300">{selectedAnalysis.metrics.completenessPercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Consistency</span>
                <span className="text-slate-300">{selectedAnalysis.metrics.consistencyRating}%</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-100">Process Metrics</h3>
              <BarChart3 className="w-6 h-6 text-teal-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Process Steps</span>
                <span className="text-slate-300">{selectedAnalysis.metrics.processSteps}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Decision Points</span>
                <span className="text-slate-300">{selectedAnalysis.metrics.decisionPoints}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Complexity</span>
                <span className="text-slate-300 capitalize">{selectedAnalysis.metrics.complexity}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-100">Compliance Status</h3>
              <div className={`text-2xl font-bold ${getScoreColor(selectedAnalysis.complianceScore)}`}>
                {selectedAnalysis.complianceScore}%
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Coverage</span>
                <span className="text-slate-300">85%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Risk Level</span>
                <span className="text-yellow-400">Medium</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gaps</span>
                <span className="text-slate-300">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Issues */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-slate-100 mb-4">Issues Identified</h3>
          <div className="space-y-4">
            {selectedAnalysis.issues.map((issue) => {
              const IconComponent = getIssueIcon(issue.type)
              return (
                <div key={issue.id} className={`border rounded-lg p-4 ${getIssueColor(issue.type)}`}>
                  <div className="flex items-start gap-3">
                    <IconComponent className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{issue.description}</span>
                        <span className="text-xs px-2 py-1 bg-slate-700/50 rounded">
                          {issue.category}
                        </span>
                      </div>
                      <div className="text-sm opacity-75 mb-2">
                        Location: {issue.location}
                      </div>
                      <div className="text-sm">
                        <strong>Recommendation:</strong> {issue.recommendation}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Suggestions */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-slate-100 mb-4">Optimization Suggestions</h3>
          <div className="space-y-4">
            {selectedAnalysis.suggestions.map((suggestion) => (
              <div key={suggestion.id} className="border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-slate-100">{suggestion.title}</h4>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      suggestion.impact === 'high' ? 'bg-green-500/20 text-green-400' :
                      suggestion.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {suggestion.impact} impact
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      suggestion.effort === 'low' ? 'bg-green-500/20 text-green-400' :
                      suggestion.effort === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {suggestion.effort} effort
                    </span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-2">{suggestion.description}</p>
                <div className="text-sm text-teal-400">
                  Estimated savings: {suggestion.estimatedSavings}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Document Analyzer</h1>
          <p className="text-slate-400 mt-1">AI-powered analysis for process optimization and compliance</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('upload')}
            className={`glass-button px-4 py-2 ${viewMode === 'upload' ? 'text-teal-300' : 'text-slate-400'}`}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </button>
          <button
            onClick={() => setViewMode('overview')}
            className={`glass-button px-4 py-2 ${viewMode === 'overview' ? 'text-teal-300' : 'text-slate-400'}`}
          >
            <Search className="w-4 h-4 mr-2" />
            Analysis
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'upload' && renderUploadArea()}
      {viewMode === 'overview' && renderOverview()}
      {viewMode === 'details' && renderDetails()}
    </div>
  )
}