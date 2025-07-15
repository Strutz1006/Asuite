import React, { useState } from 'react';
import { GlassCard, Icon } from '../../shared/components';
import { mockPulseSurveys } from '../../shared/data/mockData';

interface PulseSurveysProps {
  journeyId?: string;
}

const PulseSurveys: React.FC<PulseSurveysProps> = ({ journeyId }) => {
  const [activeSurvey, setActiveSurvey] = useState<string | null>(null);
  
  const surveys = journeyId 
    ? mockPulseSurveys.filter(s => s.journeyId === journeyId)
    : mockPulseSurveys;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return { icon: "M15 17h5l-5 5v-5zM9 1v5L4 1h5zm6 0h5v5l-5-5zM1 9h5L1 4v5z", color: "text-green-400" };
      case 'completed':
        return { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-blue-400" };
      default:
        return { icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", color: "text-slate-400" };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-400';
    if (score >= 3) return 'text-blue-400';
    if (score >= 2) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getResponseRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-400';
    if (rate >= 60) return 'text-blue-400';
    if (rate >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <GlassCard className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-slate-100">Pulse Surveys & Micro-feedback</h3>
        <button className="bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:from-sky-600 hover:to-blue-600 transition-all">
          + New Survey
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Active Surveys</h4>
          {surveys.filter(s => s.status === 'active').map((survey) => {
            const statusIcon = getStatusIcon(survey.status);
            const isExpanded = activeSurvey === survey.id;
            
            return (
              <div key={survey.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h5 className="font-semibold text-slate-100">{survey.title}</h5>
                      <div className={`px-2 py-1 text-xs rounded-full ${statusIcon.color.replace('text-', 'bg-').replace('400', '500/20')} ${statusIcon.color}`}>
                        <Icon path={statusIcon.icon} className={`w-3 h-3 ${statusIcon.color} inline mr-1`} />
                        {survey.status}
                      </div>
                    </div>
                    <p className="text-sm text-slate-400">
                      Target: {survey.targetAudience.join(', ')}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setActiveSurvey(isExpanded ? null : survey.id)}
                    className="text-sky-400 hover:text-sky-300"
                  >
                    <Icon 
                      path={isExpanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
                      className="w-5 h-5" 
                    />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-center">
                    <div className={`text-xl font-bold ${getResponseRateColor(survey.responseRate)}`}>
                      {survey.responseRate}%
                    </div>
                    <div className="text-xs text-slate-400">Response Rate</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${getScoreColor(survey.avgScore)}`}>
                      {survey.avgScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-slate-400">Avg Score</div>
                  </div>
                </div>
                
                <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full ${getResponseRateColor(survey.responseRate).replace('text-', 'bg-')}`}
                    style={{ width: `${survey.responseRate}%` }}
                  ></div>
                </div>
                
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-600">
                    <h6 className="font-medium mb-3">Survey Questions:</h6>
                    <div className="space-y-2">
                      {survey.questions.map((question) => (
                        <div key={question.id} className="text-sm p-2 bg-slate-800/50 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-slate-300">{question.question}</span>
                            {question.required && (
                              <span className="text-red-400 text-xs">*</span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400">
                            Type: {question.type}
                            {('options' in question) && question.options && ` • Options: ${question.options.join(', ')}`}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 bg-sky-500 hover:bg-sky-600 text-white text-sm py-2 rounded transition-colors">
                        View Results
                      </button>
                      <button className="flex-1 bg-slate-600 hover:bg-slate-500 text-white text-sm py-2 rounded transition-colors">
                        Edit Survey
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-slate-400 mt-3">
                  Created: {new Date(survey.createdAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Quick Feedback</h4>
          
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <h5 className="font-medium mb-3">How are you feeling about the current changes?</h5>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {['😟', '😐', '🙂', '😊', '🤩'].map((emoji, index) => (
                <button
                  key={index}
                  className="p-3 text-2xl bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Any specific feedback? (optional)"
              className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 text-sm resize-none"
              rows={3}
            />
            <button className="w-full mt-3 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-lg transition-colors">
              Submit Feedback
            </button>
          </div>
          
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <h5 className="font-medium mb-3">Recent Micro-feedback</h5>
            <div className="space-y-3">
              {[
                { emoji: '😊', text: 'Training was very helpful!', time: '2h ago', dept: 'Technology' },
                { emoji: '😐', text: 'Need more time to adapt', time: '4h ago', dept: 'Operations' },
                { emoji: '🤩', text: 'Love the new efficiency!', time: '1d ago', dept: 'Sales' }
              ].map((feedback, index) => (
                <div key={index} className="flex items-start gap-3 p-2 bg-slate-800/50 rounded">
                  <span className="text-lg">{feedback.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm text-slate-300">{feedback.text}</p>
                    <div className="text-xs text-slate-400 mt-1">
                      {feedback.dept} • {feedback.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold mb-4">Survey Analytics</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-700/50 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400 mb-2">
              {surveys.filter(s => s.status === 'active').length}
            </div>
            <div className="text-sm text-slate-400">Active Surveys</div>
          </div>
          
          <div className="p-4 bg-slate-700/50 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">
              {Math.round(surveys.reduce((acc, s) => acc + s.responseRate, 0) / surveys.length)}%
            </div>
            <div className="text-sm text-slate-400">Avg Response Rate</div>
          </div>
          
          <div className="p-4 bg-slate-700/50 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-400 mb-2">
              {(surveys.reduce((acc, s) => acc + s.avgScore, 0) / surveys.length).toFixed(1)}
            </div>
            <div className="text-sm text-slate-400">Avg Satisfaction</div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default PulseSurveys;