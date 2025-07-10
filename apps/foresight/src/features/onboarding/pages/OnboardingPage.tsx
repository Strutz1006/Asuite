import React, { useState } from 'react';
import { GlassCard, Icon } from '@aesyros/ui';
import { scenarioTemplates } from '../data/templates';
import type { ScenarioTemplate, TemplateCategory } from '../types';

const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTemplates, setShowTemplates] = useState(false);
  const [_selectedTemplate, setSelectedTemplate] = useState<ScenarioTemplate | null>(null);
  
  const onboardingSteps = [
    {
      id: 'welcome',
      title: 'Welcome to Foresight',
      description: 'Strategy simulation and impact modeling made simple',
      content: (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Icon path="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-200 mb-4">Get Started with Foresight</h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Foresight helps you model business scenarios, analyze outcomes, and make data-driven strategic decisions. Let's walk through the key features.
          </p>
        </div>
      ),
      completed: false,
      skippable: false
    },
    {
      id: 'scenarios',
      title: 'Understanding Scenarios',
      description: 'Learn how to create and manage business scenarios',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Icon path="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l-1-3m1 3l-1-3m-16.5 0l1 3m-1-3l1 3" className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-200 mb-3">Business Scenarios</h3>
            <p className="text-slate-400 mb-6">
              Scenarios are strategic models that help you explore "what if" questions about your business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-6 h-6 text-green-400 mb-2" />
              <h4 className="font-medium text-slate-200 mb-1">Create</h4>
              <p className="text-sm text-slate-400">Define business levers and outcomes you want to model</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <Icon path="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m0 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" className="w-6 h-6 text-blue-400 mb-2" />
              <h4 className="font-medium text-slate-200 mb-1">Adjust</h4>
              <p className="text-sm text-slate-400">Modify variables to see how changes impact outcomes</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" className="w-6 h-6 text-purple-400 mb-2" />
              <h4 className="font-medium text-slate-200 mb-1">Analyze</h4>
              <p className="text-sm text-slate-400">Get insights and recommendations based on your model</p>
            </div>
          </div>
        </div>
      ),
      completed: false,
      skippable: true
    },
    {
      id: 'templates',
      title: 'Template Library',
      description: 'Choose from pre-built scenario templates',
      content: (
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Icon path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0-1.125-.504-1.125-1.125V11.25a9 9 0 00-9-9z" className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-200 mb-3">Start with Templates</h3>
          <p className="text-slate-400 mb-6">
            Speed up your analysis with our curated collection of scenario templates for common business situations.
          </p>
          <button
            onClick={() => setShowTemplates(true)}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Icon path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0-1.125-.504-1.125-1.125V11.25a9 9 0 00-9-9z" className="w-5 h-5" />
            Browse Templates
          </button>
        </div>
      ),
      completed: false,
      skippable: true
    },
    {
      id: 'features',
      title: 'Key Features',
      description: 'Explore advanced capabilities',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-slate-200 mb-3">Powerful Features</h3>
            <p className="text-slate-400">
              Discover the advanced capabilities that make Foresight a comprehensive strategy tool.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Icon path="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z" className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-slate-200">AI Insights</h4>
              </div>
              <p className="text-slate-400">Get intelligent recommendations and insights powered by machine learning.</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Icon path="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-slate-200">Data Sync</h4>
              </div>
              <p className="text-slate-400">Bi-directional sync with spreadsheets and business intelligence tools.</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                  <Icon path="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-slate-200">Smart Alerts</h4>
              </div>
              <p className="text-slate-400">Automated notifications when scenarios hit critical thresholds.</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Icon path="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-slate-200">Collaboration</h4>
              </div>
              <p className="text-slate-400">Share scenarios and collaborate with team members in real-time.</p>
            </div>
          </div>
        </div>
      ),
      completed: false,
      skippable: true
    },
    {
      id: 'complete',
      title: 'Ready to Start',
      description: 'You\'re all set to begin using Foresight',
      content: (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Icon path="M4.5 12.75l6 6 9-13.5" className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-200 mb-4">You're Ready!</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-6">
            You now have everything you need to start creating powerful scenario models and making data-driven decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setShowTemplates(true)}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Icon path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0-1.125-.504-1.125-1.125V11.25a9 9 0 00-9-9z" className="w-5 h-5" />
              Start with Template
            </button>
            <button
              onClick={() => {/* Navigate to scenarios */}}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-5 h-5" />
              Create from Scratch
            </button>
          </div>
        </div>
      ),
      completed: false,
      skippable: false
    }
  ];

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    setCurrentStep(onboardingSteps.length - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {!showTemplates ? (
        <div className="container mx-auto px-4 py-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-400">
                Step {currentStep + 1} of {onboardingSteps.length}
              </span>
              <button
                onClick={skipOnboarding}
                className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
              >
                Skip Tour
              </button>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Step Content */}
          <div className="max-w-4xl mx-auto">
            <GlassCard className="p-8 mb-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-200 mb-2">
                  {onboardingSteps[currentStep].title}
                </h1>
                <p className="text-slate-400">
                  {onboardingSteps[currentStep].description}
                </p>
              </div>
              
              <div className="mb-8">
                {onboardingSteps[currentStep].content}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-200 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Icon path="M15.75 19.5L8.25 12l7.5-7.5" className="w-5 h-5" />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {onboardingSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index <= currentStep ? 'bg-sky-600' : 'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextStep}
                  disabled={currentStep === onboardingSteps.length - 1}
                  className="px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-600 text-white rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
                  <Icon path="M8.25 4.5l7.5 7.5-7.5 7.5" className="w-5 h-5" />
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      ) : (
        <TemplateLibrary
          onClose={() => setShowTemplates(false)}
          onSelectTemplate={setSelectedTemplate}
        />
      )}
    </div>
  );
};

const TemplateLibrary: React.FC<{
  onClose: () => void;
  onSelectTemplate: (template: ScenarioTemplate) => void;
}> = ({ onClose, onSelectTemplate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | ''>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ScenarioTemplate['difficulty'] | ''>('');

  const categories: TemplateCategory[] = [
    'financial-planning',
    'market-expansion',
    'product-launch',
    'operational-efficiency',
    'risk-assessment',
    'strategic-planning',
    'digital-transformation'
  ];

  const filteredTemplates = scenarioTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || template.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: ScenarioTemplate['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'advanced': return 'text-red-400 bg-red-500/20';
    }
  };

  const formatCategoryName = (category: TemplateCategory) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-200 mb-2">Template Library</h1>
            <p className="text-slate-400">
              Choose from {scenarioTemplates.length} pre-built scenario templates to get started quickly
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5" />
            Close
          </button>
        </div>

        {/* Filters */}
        <GlassCard className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Search Templates
              </label>
              <div className="relative">
                <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, description, or tags..."
                  className="w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as TemplateCategory | '')}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {formatCategoryName(category)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as ScenarioTemplate['difficulty'] | '')}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <GlassCard key={template.id} className="p-6 hover:bg-slate-800/70 transition-all cursor-pointer group">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-200 group-hover:text-sky-400 transition-colors">
                    {template.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                    {template.difficulty}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-3">
                  {template.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                  <Icon path="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4" />
                  {template.estimatedTime} min
                </div>
              </div>

              {template.preview?.metrics && (
                <div className="space-y-2 mb-4">
                  {Object.entries(template.preview.metrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-slate-400">{key}:</span>
                      <span className="text-slate-200 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
                {template.tags.length > 3 && (
                  <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                    +{template.tags.length - 3}
                  </span>
                )}
              </div>

              <button
                onClick={() => onSelectTemplate(template)}
                className="w-full px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors inline-flex items-center justify-center gap-2"
              >
                Use Template
                <Icon path="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" className="w-4 h-4" />
              </button>
            </GlassCard>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-200 mb-2">No Templates Found</h3>
            <p className="text-slate-400">
              Try adjusting your search criteria or browse all templates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;