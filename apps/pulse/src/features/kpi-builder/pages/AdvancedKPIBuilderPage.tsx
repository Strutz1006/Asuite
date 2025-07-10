import React, { useState } from 'react';
import { GlassCard, Icon } from '../../shared/components';

interface KPIDefinition {
  name: string;
  description: string;
  category: string;
  owner: string;
  frequency: 'real-time' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  type: 'leading' | 'lagging';
  dataType: 'quantitative' | 'qualitative';
  unit: string;
  formula?: string;
  targetValue: string;
  thresholds: {
    red: string;
    yellow: string;
    green: string;
  };
  dataSources: {
    primary: string;
    secondary?: string;
    apiEndpoint?: string;
  };
  businessContext: {
    strategicObjectives: string[];
    impactArea: string;
    stakeholders: string[];
  };
  riskLevel: 'low' | 'medium' | 'high';
  dataQualityScore: number;
  tags: string[];
  approvalRequired: boolean;
  benchmarkSource?: string;
  automationLevel: 'manual' | 'semi-automated' | 'fully-automated';
}

const AdvancedKPIBuilderPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [kpiData, setKpiData] = useState<KPIDefinition>({
    name: '',
    description: '',
    category: '',
    owner: '',
    frequency: 'monthly',
    type: 'lagging',
    dataType: 'quantitative',
    unit: '',
    targetValue: '',
    thresholds: { red: '', yellow: '', green: '' },
    dataSources: { primary: '' },
    businessContext: { strategicObjectives: [], impactArea: '', stakeholders: [] },
    riskLevel: 'medium',
    dataQualityScore: 80,
    tags: [],
    approvalRequired: false,
    automationLevel: 'manual'
  });

  const mockObjectives = [
    'Achieve Carbon Neutrality by 2026',
    'Operations Carbon Reduction (25%)',
    'R&D Sustainable Innovation',
    'Supply Chain Sustainability',
    'Customer Satisfaction Excellence',
    'Revenue Growth Acceleration',
    'Team Performance Enhancement'
  ];

  const mockStakeholders = [
    'Executive Team', 'Operations Team', 'Finance Team', 'HR Team', 
    'Marketing Team', 'Sales Team', 'Customer Success', 'Board of Directors'
  ];

  const kpiTemplates = [
    {
      name: 'Customer Satisfaction Score',
      category: 'Customer',
      type: 'lagging',
      frequency: 'monthly',
      description: 'Measures overall customer satisfaction through surveys',
      unit: '/10',
      formula: 'AVG(satisfaction_ratings)',
      thresholds: { red: '<7', yellow: '7-8.5', green: '>8.5' }
    },
    {
      name: 'Net Promoter Score',
      category: 'Customer',
      type: 'leading',
      frequency: 'quarterly',
      description: 'Likelihood of customer recommendation',
      unit: 'score',
      formula: '% Promoters - % Detractors',
      thresholds: { red: '<30', yellow: '30-70', green: '>70' }
    },
    {
      name: 'Revenue Growth Rate',
      category: 'Financial',
      type: 'lagging',
      frequency: 'monthly',
      description: 'Month-over-month revenue growth',
      unit: '%',
      formula: '((Current Month Revenue - Previous Month Revenue) / Previous Month Revenue) * 100',
      thresholds: { red: '<5%', yellow: '5-15%', green: '>15%' }
    },
    {
      name: 'Employee Engagement Index',
      category: 'People',
      type: 'leading',
      frequency: 'quarterly',
      description: 'Overall employee engagement and satisfaction',
      unit: '/5',
      formula: 'AVG(engagement_survey_scores)',
      thresholds: { red: '<3.5', yellow: '3.5-4.0', green: '>4.0' }
    }
  ];

  const aiSuggestions = [
    {
      type: 'formula',
      suggestion: 'Consider adding time-based weighting to your customer satisfaction formula for more accurate trending',
      confidence: 85
    },
    {
      type: 'benchmark',
      suggestion: 'Industry benchmark for this KPI type is typically 15-20% higher. Consider adjusting thresholds.',
      confidence: 78
    },
    {
      type: 'frequency',
      suggestion: 'Based on similar KPIs, weekly frequency might provide better early warning signals',
      confidence: 72
    },
    {
      type: 'alignment',
      suggestion: 'This KPI could be better aligned with "Customer Satisfaction Excellence" objective',
      confidence: 90
    }
  ];

  const handleTemplateSelect = (template: typeof kpiTemplates[0]) => {
    setKpiData(prev => ({
      ...prev,
      name: template.name,
      category: template.category,
      type: template.type as 'leading' | 'lagging',
      frequency: template.frequency as any,
      description: template.description,
      unit: template.unit,
      formula: template.formula,
      thresholds: template.thresholds
    }));
    setStep(2);
  };

  const updateKpiData = (field: string, value: any) => {
    setKpiData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setKpiData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof KPIDefinition],
        [field]: value
      }
    }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 6));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < step) return 'completed';
    if (stepNumber === step) return 'current';
    return 'upcoming';
  };

  const steps = [
    { number: 1, title: 'Template Selection', description: 'Choose a starting template or create from scratch' },
    { number: 2, title: 'Basic Definition', description: 'Name, description, and core properties' },
    { number: 3, title: 'Measurement Setup', description: 'Formula, thresholds, and data sources' },
    { number: 4, title: 'Strategic Alignment', description: 'Link to objectives and stakeholders' },
    { number: 5, title: 'Governance & Quality', description: 'Approval workflow and data quality' },
    { number: 6, title: 'Review & Deploy', description: 'Final review and activation' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">Advanced KPI Builder</h2>
          <p className="text-slate-400 mt-2">Create sophisticated KPIs with AI-powered insights and strategic alignment</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">Step {step} of {steps.length}</span>
          <div className="flex gap-2">
            {steps.map(s => (
              <div 
                key={s.number}
                className={`w-3 h-3 rounded-full ${
                  getStepStatus(s.number) === 'completed' ? 'bg-green-500' :
                  getStepStatus(s.number) === 'current' ? 'bg-sky-500' :
                  'bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <GlassCard className="p-6">
        <div className="flex justify-between items-center">
          {steps.map((s, index) => (
            <div key={s.number} className="flex items-center">
              <div className="text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  getStepStatus(s.number) === 'completed' ? 'bg-green-500 text-white' :
                  getStepStatus(s.number) === 'current' ? 'bg-sky-500 text-white' :
                  'bg-slate-600 text-slate-400'
                }`}>
                  {getStepStatus(s.number) === 'completed' ? (
                    <Icon path="M5 13l4 4L19 7" className="w-5 h-5" />
                  ) : (
                    s.number
                  )}
                </div>
                <div className="mt-2">
                  <div className={`text-sm font-medium ${
                    getStepStatus(s.number) === 'current' ? 'text-sky-300' : 'text-slate-400'
                  }`}>
                    {s.title}
                  </div>
                  <div className="text-xs text-slate-500">{s.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-px mx-4 ${
                  getStepStatus(s.number) === 'completed' ? 'bg-green-500' : 'bg-slate-600'
                }`} />
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Step Content */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-sky-300">Quick Start Templates</h3>
            <div className="space-y-4">
              {kpiTemplates.map((template, index) => (
                <div 
                  key={index}
                  onClick={() => handleTemplateSelect(template)}
                  className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-sky-500 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">{template.name}</h4>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        template.type === 'leading' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                      }`}>
                        {template.type}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-slate-600 text-slate-300">
                        {template.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{template.description}</p>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Frequency: {template.frequency}</span>
                    <span>Unit: {template.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-sky-300">Create from Scratch</h3>
            <div className="space-y-4">
              <div className="p-6 bg-slate-800/30 rounded-lg border-2 border-dashed border-slate-600 hover:border-sky-500 cursor-pointer transition-colors text-center">
                <Icon path="M12 4v16m8-8H4" className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h4 className="font-semibold text-white mb-2">Custom KPI Builder</h4>
                <p className="text-sm text-slate-400 mb-4">Start with a blank canvas and build your KPI step by step with AI assistance</p>
                <button 
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
                >
                  Start Building
                </button>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h4 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
                  <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z" className="w-5 h-5" />
                  AI KPI Assistant
                </h4>
                <p className="text-sm text-slate-300 mb-3">Let AI analyze your business context and suggest optimal KPIs based on your industry and objectives.</p>
                <button className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                  Launch AI Assistant
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {step === 2 && (
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-6 text-sky-300">Basic KPI Definition</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">KPI Name *</label>
                <input
                  type="text"
                  value={kpiData.name}
                  onChange={(e) => updateKpiData('name', e.target.value)}
                  placeholder="e.g. Customer Satisfaction Score"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
                <textarea
                  value={kpiData.description}
                  onChange={(e) => updateKpiData('description', e.target.value)}
                  placeholder="Provide a clear description of what this KPI measures and why it matters"
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category *</label>
                  <select
                    value={kpiData.category}
                    onChange={(e) => updateKpiData('category', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none"
                  >
                    <option value="">Select category</option>
                    <option value="Financial">Financial</option>
                    <option value="Customer">Customer</option>
                    <option value="Operations">Operations</option>
                    <option value="People">People</option>
                    <option value="Sustainability">Sustainability</option>
                    <option value="Strategy">Strategy</option>
                    <option value="Quality">Quality</option>
                    <option value="Innovation">Innovation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Owner *</label>
                  <select
                    value={kpiData.owner}
                    onChange={(e) => updateKpiData('owner', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none"
                  >
                    <option value="">Select owner</option>
                    <option value="Sarah Chen">Sarah Chen</option>
                    <option value="Mike Torres">Mike Torres</option>
                    <option value="Lisa Park">Lisa Park</option>
                    <option value="Jordan Lee">Jordan Lee</option>
                    <option value="Alex Kim">Alex Kim</option>
                    <option value="Taylor Kim">Taylor Kim</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">KPI Type *</label>
                  <div className="flex gap-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="leading"
                        checked={kpiData.type === 'leading'}
                        onChange={(e) => updateKpiData('type', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">Leading</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="lagging"
                        checked={kpiData.type === 'lagging'}
                        onChange={(e) => updateKpiData('type', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">Lagging</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Data Type *</label>
                  <div className="flex gap-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="quantitative"
                        checked={kpiData.dataType === 'quantitative'}
                        onChange={(e) => updateKpiData('dataType', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">Quantitative</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="qualitative"
                        checked={kpiData.dataType === 'qualitative'}
                        onChange={(e) => updateKpiData('dataType', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">Qualitative</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Frequency *</label>
                  <select
                    value={kpiData.frequency}
                    onChange={(e) => updateKpiData('frequency', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none"
                  >
                    <option value="real-time">Real-time</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Unit *</label>
                  <input
                    type="text"
                    value={kpiData.unit}
                    onChange={(e) => updateKpiData('unit', e.target.value)}
                    placeholder="e.g. %, $, /10, count"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-sky-300">AI Suggestions</h4>
              <div className="space-y-4">
                {aiSuggestions.filter(s => s.type === 'formula' || s.type === 'frequency').map((suggestion, index) => (
                  <div key={index} className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z" className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-slate-300 mb-2">{suggestion.suggestion}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">Confidence: {suggestion.confidence}%</span>
                          <button className="text-xs font-semibold text-blue-400 hover:text-blue-300">
                            Apply Suggestion
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {step === 3 && (
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-6 text-sky-300">Measurement Setup</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Formula {kpiData.dataType === 'quantitative' && '*'}
                </label>
                <textarea
                  value={kpiData.formula}
                  onChange={(e) => updateKpiData('formula', e.target.value)}
                  placeholder="e.g. SUM(satisfaction_ratings) / COUNT(responses)"
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none resize-none"
                />
                <p className="text-xs text-slate-500 mt-1">Use SQL-like syntax for calculations</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Target Value *</label>
                <input
                  type="text"
                  value={kpiData.targetValue}
                  onChange={(e) => updateKpiData('targetValue', e.target.value)}
                  placeholder="e.g. 8.5, 95%, $1M"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-4">Threshold Bands *</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-red-400 mb-1">Critical (Red)</label>
                    <input
                      type="text"
                      value={kpiData.thresholds.red}
                      onChange={(e) => updateNestedField('thresholds', 'red', e.target.value)}
                      placeholder="< 6.0"
                      className="w-full px-3 py-2 bg-slate-700 border border-red-500/50 rounded text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-yellow-400 mb-1">Warning (Yellow)</label>
                    <input
                      type="text"
                      value={kpiData.thresholds.yellow}
                      onChange={(e) => updateNestedField('thresholds', 'yellow', e.target.value)}
                      placeholder="6.0 - 8.0"
                      className="w-full px-3 py-2 bg-slate-700 border border-yellow-500/50 rounded text-white focus:border-yellow-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-green-400 mb-1">Good (Green)</label>
                    <input
                      type="text"
                      value={kpiData.thresholds.green}
                      onChange={(e) => updateNestedField('thresholds', 'green', e.target.value)}
                      placeholder="> 8.0"
                      className="w-full px-3 py-2 bg-slate-700 border border-green-500/50 rounded text-white focus:border-green-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Primary Data Source *</label>
                <select
                  value={kpiData.dataSources.primary}
                  onChange={(e) => updateNestedField('dataSources', 'primary', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none"
                >
                  <option value="">Select data source</option>
                  <option value="salesforce">Salesforce CRM</option>
                  <option value="hubspot">HubSpot</option>
                  <option value="postgresql">PostgreSQL Database</option>
                  <option value="excel">Excel/Google Sheets</option>
                  <option value="powerbi">Power BI</option>
                  <option value="tableau">Tableau</option>
                  <option value="api">Custom API Endpoint</option>
                  <option value="manual">Manual Entry</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">API Endpoint (Optional)</label>
                <input
                  type="url"
                  value={kpiData.dataSources.apiEndpoint}
                  onChange={(e) => updateNestedField('dataSources', 'apiEndpoint', e.target.value)}
                  placeholder="https://api.example.com/kpi/data"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-4">Automation Level</label>
                <div className="space-y-3">
                  <label className="flex items-center p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800/70">
                    <input
                      type="radio"
                      value="manual"
                      checked={kpiData.automationLevel === 'manual'}
                      onChange={(e) => updateKpiData('automationLevel', e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Manual Entry</div>
                      <div className="text-xs text-slate-400">Data entered manually by team members</div>
                    </div>
                  </label>
                  <label className="flex items-center p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800/70">
                    <input
                      type="radio"
                      value="semi-automated"
                      checked={kpiData.automationLevel === 'semi-automated'}
                      onChange={(e) => updateKpiData('automationLevel', e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Semi-Automated</div>
                      <div className="text-xs text-slate-400">Automated data pull with manual validation</div>
                    </div>
                  </label>
                  <label className="flex items-center p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800/70">
                    <input
                      type="radio"
                      value="fully-automated"
                      checked={kpiData.automationLevel === 'fully-automated'}
                      onChange={(e) => updateKpiData('automationLevel', e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Fully Automated</div>
                      <div className="text-xs text-slate-400">Real-time data sync with automatic updates</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <h4 className="font-semibold text-green-300 mb-2 flex items-center gap-2">
                  <Icon path="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5" />
                  Data Quality Preview
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completeness:</span>
                    <span className="text-green-400">95%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Accuracy:</span>
                    <span className="text-green-400">92%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Timeliness:</span>
                    <span className="text-yellow-400">78%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                  <p className="text-xs text-slate-400">Overall Data Quality Score: 88%</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {step === 4 && (
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-6 text-sky-300">Strategic Alignment</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Strategic Objectives *</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {mockObjectives.map((objective, index) => (
                    <label key={index} className="flex items-center p-2 hover:bg-slate-800/50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={kpiData.businessContext.strategicObjectives.includes(objective)}
                        onChange={(e) => {
                          const updated = e.target.checked 
                            ? [...kpiData.businessContext.strategicObjectives, objective]
                            : kpiData.businessContext.strategicObjectives.filter(o => o !== objective);
                          updateNestedField('businessContext', 'strategicObjectives', updated);
                        }}
                        className="mr-3"
                      />
                      <span className="text-sm">{objective}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Impact Area *</label>
                <select
                  value={kpiData.businessContext.impactArea}
                  onChange={(e) => updateNestedField('businessContext', 'impactArea', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none"
                >
                  <option value="">Select impact area</option>
                  <option value="revenue">Revenue Growth</option>
                  <option value="cost">Cost Optimization</option>
                  <option value="customer">Customer Experience</option>
                  <option value="operational">Operational Excellence</option>
                  <option value="innovation">Innovation & Growth</option>
                  <option value="risk">Risk Management</option>
                  <option value="compliance">Compliance & Governance</option>
                  <option value="sustainability">Sustainability</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Key Stakeholders *</label>
                <div className="grid grid-cols-2 gap-2">
                  {mockStakeholders.map((stakeholder, index) => (
                    <label key={index} className="flex items-center p-2 hover:bg-slate-800/50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={kpiData.businessContext.stakeholders.includes(stakeholder)}
                        onChange={(e) => {
                          const updated = e.target.checked 
                            ? [...kpiData.businessContext.stakeholders, stakeholder]
                            : kpiData.businessContext.stakeholders.filter(s => s !== stakeholder);
                          updateNestedField('businessContext', 'stakeholders', updated);
                        }}
                        className="mr-2"
                      />
                      <span className="text-xs">{stakeholder}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h4 className="font-semibold text-blue-300 mb-3">Alignment Analysis</h4>
                {aiSuggestions.filter(s => s.type === 'alignment').map((suggestion, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-sm text-slate-300 mb-2">{suggestion.suggestion}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Confidence: {suggestion.confidence}%</span>
                      <button className="text-xs font-semibold text-blue-400 hover:text-blue-300">
                        Apply Suggestion
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="font-semibold text-white mb-3">Cross-App Integration</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon path="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-sky-400" />
                      <span className="text-sm">Link to Align objectives</span>
                    </div>
                    <span className="text-xs text-green-400">Available</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-4 h-4 text-sky-400" />
                      <span className="text-sm">Trigger Foresight scenarios</span>
                    </div>
                    <span className="text-xs text-green-400">Available</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon path="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" className="w-4 h-4 text-sky-400" />
                      <span className="text-sm">Create Catalyst workflows</span>
                    </div>
                    <span className="text-xs text-green-400">Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={step === 1}
          className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <Icon path="M15 19l-7-7 7-7" className="w-4 h-4" />
          Previous
        </button>

        <div className="flex gap-3">
          <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
            Save Draft
          </button>
          <button
            onClick={nextStep}
            disabled={step === 6}
            className="flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {step === 6 ? 'Deploy KPI' : 'Next'}
            {step < 6 && <Icon path="M9 5l7 7-7 7" className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedKPIBuilderPage;