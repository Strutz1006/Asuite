import React, { useState } from 'react';
import { GlassCard, Icon } from '../../shared/components';
import { mockValidationIssues, mockComplianceTemplates } from '../../shared/data/mockData';

const ValidatorPage: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<string>('');
  const [validationResults, setValidationResults] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
    }
  };

  const handleValidation = async () => {
    if (!uploadedFile) return;
    
    setIsValidating(true);
    // Simulate validation process
    setTimeout(() => {
      setValidationResults({
        overallScore: 78,
        issues: mockValidationIssues.slice(0, 3),
        suggestions: [
          'Add clear ownership assignments for each process step',
          'Include risk mitigation strategies for high-impact activities',
          'Define specific timeframes instead of relative terms'
        ]
      });
      setIsValidating(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => window.history.back()}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <Icon path="M10 19l-7-7m0 0l7-7m-7 7h18" className="w-5 h-5 text-slate-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">AI Document Validator</h1>
          <p className="text-slate-400 mt-1">Upload and validate your process documents for compliance and quality</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload and Validation */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Document Upload</h3>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-sky-500 transition-colors">
                <Icon path="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 mb-2">Drop your document here or click to browse</p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload"
                  className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  <Icon path="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" className="w-4 h-4" />
                  Choose File
                </label>
                <p className="text-xs text-slate-500 mt-2">Supported: PDF, DOC, DOCX, TXT</p>
              </div>

              {uploadedFile && (
                <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                  <Icon path="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-5 h-5 text-sky-400" />
                  <span className="text-slate-200">{uploadedFile}</span>
                  <button 
                    onClick={() => setUploadedFile('')}
                    className="ml-auto text-slate-400 hover:text-red-400"
                  >
                    <Icon path="M6 18L18 6M6 6l12 12" className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Compliance Template (Optional)
                </label>
                <select 
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">No specific template</option>
                  {mockComplianceTemplates.map(template => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleValidation}
                disabled={!uploadedFile || isValidating}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:from-sky-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-sky-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isValidating ? (
                  <div className="flex items-center justify-center gap-2">
                    <Icon path="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" className="w-5 h-5 animate-spin" />
                    Validating Document...
                  </div>
                ) : (
                  'Validate with AI'
                )}
              </button>
            </div>
          </GlassCard>

          {/* Validation Results */}
          {validationResults && (
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold text-slate-100 mb-4">Validation Results</h3>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-4xl font-bold text-sky-400 mb-2">
                    {validationResults.overallScore}%
                  </div>
                  <div className="text-slate-400">Overall Quality Score</div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-200 mb-3">Issues Found</h4>
                  <div className="space-y-3">
                    {validationResults.issues.map((issue: any) => (
                      <div key={issue.id} className="p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Icon 
                            path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" 
                            className={`w-5 h-5 mt-0.5 ${
                              issue.severity === 'high' ? 'text-red-400' :
                              issue.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                            }`}
                          />
                          <div className="flex-1">
                            <h5 className="font-medium text-slate-200">{issue.title}</h5>
                            <p className="text-sm text-slate-400 mt-1">{issue.description}</p>
                            <p className="text-sm text-sky-300 mt-2">💡 {issue.suggestion}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-200 mb-3">AI Suggestions</h4>
                  <div className="space-y-2">
                    {validationResults.suggestions.map((suggestion: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z" className="w-4 h-4 text-sky-400 mt-0.5" />
                        <span className="text-sm text-slate-300">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Templates and Help */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Compliance Templates</h3>
            <div className="space-y-4">
              {mockComplianceTemplates.map(template => (
                <div key={template.id} className="p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="font-semibold text-slate-200 mb-2">{template.name}</h4>
                  <p className="text-sm text-slate-400 mb-3">{template.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {template.checkpoints.map((checkpoint, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-sky-500/20 text-sky-300 rounded">
                        {checkpoint}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Validation Help</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h4 className="font-medium text-blue-300 mb-2">What We Check</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Clarity and readability</li>
                  <li>• Compliance with standards</li>
                  <li>• Completeness of information</li>
                  <li>• Process efficiency</li>
                  <li>• Risk identification</li>
                </ul>
              </div>
              
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <h4 className="font-medium text-green-300 mb-2">Best Practices</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Use clear, specific language</li>
                  <li>• Include measurable criteria</li>
                  <li>• Define roles and responsibilities</li>
                  <li>• Specify timeframes</li>
                  <li>• Include exception handling</li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ValidatorPage;