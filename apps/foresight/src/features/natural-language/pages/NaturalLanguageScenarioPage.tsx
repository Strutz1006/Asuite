import React, { useState } from 'react';
import { GlassCard, Icon } from '../../shared/components';

interface ParsedScenario {
  intent: string;
  extractedLevers: Array<{
    name: string;
    change: string;
    value: number;
    confidence: number;
  }>;
  suggestedTimeframe: string;
  estimatedImpact: {
    revenue: string;
    cost: string;
    risk: string;
  };
  confidence: number;
}

const NaturalLanguageScenarioPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedScenario, setParsedScenario] = useState<ParsedScenario | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const exampleQueries = [
    "What if we cut marketing spend by 15% next quarter?",
    "How would hiring 20 more engineers affect our product delivery?",
    "What's the impact of reducing our office footprint by 30%?",
    "If we increase R&D investment by $2M, what happens to innovation?",
    "What if we delay the new product launch by 6 months?",
    "How would a 25% price increase affect customer retention?",
    "What if we outsource customer support to reduce costs?",
    "Impact of expanding to 3 new markets in Europe?"
  ];

  const mockParseResponse = (query: string): ParsedScenario => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('marketing') && lowerQuery.includes('cut')) {
      return {
        intent: "Analyze marketing budget reduction impact",
        extractedLevers: [
          { name: "Marketing Budget", change: "decrease", value: 15, confidence: 95 },
          { name: "Customer Acquisition Rate", change: "decrease", value: 8, confidence: 78 },
          { name: "Brand Awareness", change: "decrease", value: 12, confidence: 82 }
        ],
        suggestedTimeframe: "Q1 2024",
        estimatedImpact: {
          revenue: "-5.2% (3 month lag)",
          cost: "-$450K quarterly",
          risk: "Medium - customer acquisition slowdown"
        },
        confidence: 87
      };
    }
    
    if (lowerQuery.includes('engineer') || lowerQuery.includes('hiring')) {
      return {
        intent: "Model engineering team expansion effects",
        extractedLevers: [
          { name: "Engineering Headcount", change: "increase", value: 20, confidence: 98 },
          { name: "Development Velocity", change: "increase", value: 35, confidence: 74 },
          { name: "Operational Costs", change: "increase", value: 18, confidence: 92 }
        ],
        suggestedTimeframe: "6 months",
        estimatedImpact: {
          revenue: "+12.8% (9 month projection)",
          cost: "+$3.2M annually",
          risk: "Low - proven scaling model"
        },
        confidence: 91
      };
    }

    // Default response for other queries
    return {
      intent: "General business impact analysis",
      extractedLevers: [
        { name: "Primary Variable", change: "adjust", value: 10, confidence: 85 },
        { name: "Secondary Effect", change: "monitor", value: 5, confidence: 70 }
      ],
      suggestedTimeframe: "Next quarter",
      estimatedImpact: {
        revenue: "TBD - needs calibration",
        cost: "TBD - needs calibration",
        risk: "Medium - requires further analysis"
      },
      confidence: 75
    };
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const parsed = mockParseResponse(input);
      setParsedScenario(parsed);
      setIsProcessing(false);
    }, 2000);
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
  };

  const generateSuggestions = (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const matchingSuggestions = exampleQueries.filter(example => 
      example.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3);

    setSuggestions(matchingSuggestions);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">Natural Language Scenario Builder</h2>
          <p className="text-slate-400 mt-2">Describe your scenario in plain English and let AI build the simulation model</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-slate-400">AI Engine Active</span>
        </div>
      </div>

      {/* Natural Language Input */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-sky-300 flex items-center gap-2">
          <Icon path="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" className="w-6 h-6" />
          Ask Foresight
        </h3>
        
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                generateSuggestions(e.target.value);
              }}
              placeholder="Type your scenario question here... e.g., 'What if we reduce our marketing budget by 15% next quarter?'"
              rows={3}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none resize-none"
            />
            
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-10">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-slate-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    <span className="text-sm text-slate-300">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">
              {input.length}/500 characters
            </span>
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isProcessing}
              className="flex items-center gap-2 px-6 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-4 h-4" />
                  Build Scenario
                </>
              )}
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Example Queries */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-sky-300">Try These Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {exampleQueries.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="p-3 bg-slate-800/50 rounded-lg text-left hover:bg-slate-800/70 transition-colors border border-slate-700 hover:border-sky-500/50"
            >
              <span className="text-sm text-slate-300">{example}</span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Parsed Scenario Results */}
      {parsedScenario && (
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-sky-300 flex items-center gap-2">
              <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z" className="w-6 h-6" />
              AI Analysis Results
            </h3>
            
            <div className="space-y-6">
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h4 className="font-semibold text-blue-300 mb-2">Scenario Intent</h4>
                <p className="text-slate-300">{parsedScenario.intent}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-slate-400">Confidence:</span>
                  <div className="flex-1 bg-slate-700 rounded-full h-2 max-w-32">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${parsedScenario.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-mono text-blue-400">{parsedScenario.confidence}%</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3">Extracted Business Levers</h4>
                <div className="space-y-3">
                  {parsedScenario.extractedLevers.map((lever, index) => (
                    <div key={index} className="p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-white">{lever.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          lever.change === 'increase' ? 'bg-green-500/20 text-green-400' :
                          lever.change === 'decrease' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {lever.change.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">
                          {lever.change === 'increase' ? '+' : lever.change === 'decrease' ? '-' : ''}{lever.value}%
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">AI Confidence:</span>
                          <span className="text-xs font-mono text-sky-400">{lever.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">Estimated Impact</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Revenue:</span>
                      <span className={`font-mono ${
                        parsedScenario.estimatedImpact.revenue.startsWith('+') ? 'text-green-400' : 
                        parsedScenario.estimatedImpact.revenue.startsWith('-') ? 'text-red-400' : 'text-slate-300'
                      }`}>
                        {parsedScenario.estimatedImpact.revenue}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cost:</span>
                      <span className={`font-mono ${
                        parsedScenario.estimatedImpact.cost.startsWith('+') ? 'text-red-400' : 
                        parsedScenario.estimatedImpact.cost.startsWith('-') ? 'text-green-400' : 'text-slate-300'
                      }`}>
                        {parsedScenario.estimatedImpact.cost}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Risk Level:</span>
                      <span className="text-slate-300">{parsedScenario.estimatedImpact.risk}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Suggested Timeframe</h4>
                  <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                    <span className="text-lg font-mono text-sky-400">{parsedScenario.suggestedTimeframe}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors font-medium">
                  Create Full Scenario
                </button>
                <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium">
                  Run Simulation
                </button>
                <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium">
                  Refine Query
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* AI Tips */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-sky-300 flex items-center gap-2">
          <Icon path="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5" />
          Tips for Better Results
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-white">Be Specific</h4>
                <p className="text-sm text-slate-400">Include numbers, timeframes, and specific business areas</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-white">Use Business Terms</h4>
                <p className="text-sm text-slate-400">Reference budgets, headcount, revenue, costs, etc.</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-white">Consider Outcomes</h4>
                <p className="text-sm text-slate-400">Mention what you want to measure or optimize for</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-white">Ask Follow-ups</h4>
                <p className="text-sm text-slate-400">Refine scenarios based on initial results</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default NaturalLanguageScenarioPage;