import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, Icon } from '../../shared/components';
import { mockKPITemplates, mockUsers } from '../../shared/data/mockData';

const KPIBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    objective: '',
    category: '',
    targetValue: '',
    frequency: 'Monthly',
    owner: '',
    description: ''
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = ['Financial', 'Customer', 'Operations', 'People', 'Sustainability', 'Strategy'];
  const frequencies = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Simulate AI suggestions based on objective
    if (field === 'objective' && value.length > 10) {
      generateSuggestions(value);
    }
  };

  const generateSuggestions = (_objective: string) => {
    setIsGenerating(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const mockSuggestions = [
        'Time to First Value',
        'User Activation Rate',
        'Feature Adoption Score',
        'Customer Satisfaction Index',
        'Completion Rate'
      ];
      setSuggestions(mockSuggestions);
      setIsGenerating(false);
    }, 1500);
  };

  const handleSubmit = () => {
    console.log('Creating KPI:', formData);
    navigate('/kpis');
  };

  const useTemplate = (template: typeof mockKPITemplates[0]) => {
    setFormData(prev => ({
      ...prev,
      objective: `Improve ${template.name.toLowerCase()}`,
      category: template.name.includes('Customer') ? 'Customer' : 
               template.name.includes('Financial') ? 'Financial' : 
               template.name.includes('ESG') ? 'Sustainability' : 'Operations'
    }));
    setStep(2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <Icon path="M10 19l-7-7m0 0l7-7m-7 7h18" className="w-5 h-5 text-slate-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">The Workshop: KPI Builder</h1>
          <p className="text-slate-400 mt-1">Create meaningful KPIs tied to your mission with AI guidance</p>
        </div>
      </div>

      {/* Progress Steps */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map(stepNumber => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= stepNumber ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-400'
              }`}>
                {stepNumber}
              </div>
              <div className="ml-3">
                <div className={`font-medium ${step >= stepNumber ? 'text-slate-100' : 'text-slate-400'}`}>
                  {stepNumber === 1 && 'Define Objective'}
                  {stepNumber === 2 && 'Configure Details'}
                  {stepNumber === 3 && 'Review & Create'}
                </div>
              </div>
              {stepNumber < 3 && (
                <div className={`flex-1 h-1 mx-4 rounded ${
                  step > stepNumber ? 'bg-sky-500' : 'bg-slate-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {step === 1 && (
        <>
          {/* KPI Templates */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4">Start with a Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {mockKPITemplates.map(template => (
                <div key={template.id} className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors cursor-pointer"
                     onClick={() => useTemplate(template)}>
                  <h4 className="font-semibold mb-2">{template.name}</h4>
                  <p className="text-xs text-slate-400 mb-3">{template.description}</p>
                  <div className="space-y-1">
                    {template.metrics.slice(0, 3).map(metric => (
                      <div key={metric} className="text-sm text-slate-300">• {metric}</div>
                    ))}
                  </div>
                  <button className="w-full mt-3 text-sm bg-sky-500/20 text-sky-300 py-2 rounded hover:bg-sky-500/30 transition-colors">
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Custom Objective */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4">Or Define Your Own Objective</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">What do you want to measure?</label>
                <textarea
                  value={formData.objective}
                  onChange={(e) => handleInputChange('objective', e.target.value)}
                  placeholder="e.g., 'Improve customer onboarding experience to reduce time to first value'"
                  className="w-full bg-slate-700/80 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 h-24 resize-none"
                />
              </div>
              
              <button 
                onClick={() => setStep(2)}
                disabled={!formData.objective.trim()}
                className="bg-sky-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-400/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue with AI Analysis
              </button>
            </div>
          </GlassCard>
        </>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Form */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-6">Configure Your KPI</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Objective</label>
                <div className="p-3 bg-slate-700/50 rounded-lg text-sm text-slate-300">
                  {formData.objective}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select 
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full bg-slate-700/80 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  <option value="">Select category...</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Target Value *</label>
                  <input 
                    type="text" 
                    value={formData.targetValue}
                    onChange={(e) => handleInputChange('targetValue', e.target.value)}
                    placeholder="e.g., 95%" 
                    className="w-full bg-slate-700/80 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Frequency *</label>
                  <select 
                    value={formData.frequency}
                    onChange={(e) => handleInputChange('frequency', e.target.value)}
                    className="w-full bg-slate-700/80 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    {frequencies.map(freq => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Owner *</label>
                <select 
                  value={formData.owner}
                  onChange={(e) => handleInputChange('owner', e.target.value)}
                  className="w-full bg-slate-700/80 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  <option value="">Select owner...</option>
                  {mockUsers.map(user => (
                    <option key={user.id} value={user.name}>{user.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Additional context about this KPI..."
                  className="w-full bg-slate-700/80 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 h-20 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setStep(1)}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Back
              </button>
              <button 
                onClick={() => setStep(3)}
                disabled={!formData.category || !formData.targetValue || !formData.owner}
                className="flex-1 bg-sky-500 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-400/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Review KPI
              </button>
            </div>
          </GlassCard>
          
          {/* AI Recommendations */}
          <div className="space-y-6">
            <GlassCard className="p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z" className="w-5 h-5 text-sky-400" />
                AI Recommendations
              </h4>
              
              {isGenerating ? (
                <div className="text-center py-6">
                  <Icon path="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" className="w-6 h-6 text-sky-400 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Analyzing your objective...</p>
                </div>
              ) : suggestions.length > 0 ? (
                <div>
                  <h5 className="font-medium text-sky-300 mb-3">Suggested Metrics</h5>
                  <div className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-sm">{suggestion}</span>
                        <button className="text-sky-400 hover:text-sky-300 text-sm font-medium">Add</button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </GlassCard>

            <GlassCard className="p-6">
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h5 className="font-medium text-blue-300 mb-2 flex items-center gap-2">
                  <Icon path="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4" />
                  Best Practice Alert
                </h5>
                <p className="text-sm text-slate-300">Consider adding a qualitative metric alongside quantitative ones for balanced insights.</p>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {step === 3 && (
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-6">Review Your KPI</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-100 mb-2">KPI Configuration</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Objective:</span>
                    <span className="text-slate-200 max-w-xs text-right">{formData.objective}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Category:</span>
                    <span className="text-slate-200">{formData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target:</span>
                    <span className="text-slate-200">{formData.targetValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Frequency:</span>
                    <span className="text-slate-200">{formData.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Owner:</span>
                    <span className="text-slate-200">{formData.owner}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <h5 className="font-medium text-green-300 mb-2 flex items-center gap-2">
                  <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4" />
                  Validation Complete
                </h5>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>✓ Objective is specific and measurable</li>
                  <li>✓ Target value is realistic</li>
                  <li>✓ Owner is assigned</li>
                  <li>✓ Frequency is appropriate</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button 
              onClick={() => setStep(2)}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Back to Edit
            </button>
            <button 
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:from-sky-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-sky-400/50 transition-all"
            >
              Create KPI
            </button>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default KPIBuilderPage;