import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Calendar, BarChart3, Zap, Brain, Clock } from 'lucide-react';

interface PredictiveAnalyticsProps {
  timePeriod: string;
  department: string;
}

export function PredictiveAnalytics({ timePeriod, department }: PredictiveAnalyticsProps) {
  // Mock data - would come from ML/AI analysis
  const predictiveData = {
    completionPredictions: [
      {
        goalId: 1,
        title: 'Cloud Infrastructure Migration',
        currentProgress: 85,
        predictedCompletion: '2024-02-15',
        confidence: 92,
        daysRemaining: 12,
        riskLevel: 'low',
        factors: ['Strong velocity', 'No blockers', 'Sufficient resources']
      },
      {
        goalId: 2,
        title: 'Brand Awareness Campaign',
        currentProgress: 35,
        predictedCompletion: '2024-03-22',
        confidence: 68,
        daysRemaining: 45,
        riskLevel: 'high',
        factors: ['Slow progress', 'Budget delays', 'Resource constraints']
      },
      {
        goalId: 3,
        title: 'Customer Satisfaction Program',
        currentProgress: 72,
        predictedCompletion: '2024-02-28',
        confidence: 85,
        daysRemaining: 25,
        riskLevel: 'medium',
        factors: ['Good progress', 'External dependencies', 'Seasonal factors']
      }
    ],
    riskAnalysis: [
      {
        type: 'Resource Shortage',
        probability: 78,
        impact: 'High',
        affectedGoals: 8,
        timeframe: 'Next 30 days',
        recommendation: 'Consider reallocating resources from completed projects'
      },
      {
        type: 'Deadline Pressure',
        probability: 65,
        impact: 'Medium',
        affectedGoals: 5,
        timeframe: 'Next 60 days',
        recommendation: 'Review and adjust timelines for at-risk goals'
      },
      {
        type: 'Dependency Bottleneck',
        probability: 55,
        impact: 'High',
        affectedGoals: 12,
        timeframe: 'Next 45 days',
        recommendation: 'Identify and resolve critical path dependencies'
      }
    ],
    modelInsights: {
      accuracyScore: 87,
      dataPoints: 1240,
      lastUpdated: '2024-01-15T10:30:00Z',
      improvements: [
        'Added seasonal trend analysis',
        'Enhanced resource utilization modeling',
        'Improved cross-department dependency detection'
      ]
    },
    futureRecommendations: [
      {
        action: 'Increase Engineering Team Size',
        impact: '+15% completion rate',
        confidence: 82,
        timeframe: 'Q2 2024',
        cost: 'High',
        benefits: ['Reduced bottlenecks', 'Faster delivery', 'Better work-life balance']
      },
      {
        action: 'Implement Goal Automation Tools',
        impact: '+22% efficiency',
        confidence: 75,
        timeframe: 'Q1 2024',
        cost: 'Medium',
        benefits: ['Reduced manual work', 'Better tracking', 'Real-time updates']
      },
      {
        action: 'Cross-Training Initiative',
        impact: '+12% flexibility',
        confidence: 88,
        timeframe: 'Q3 2024',
        cost: 'Low',
        benefits: ['Reduced dependencies', 'Knowledge sharing', 'Better coverage']
      }
    ]
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/50';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Low': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'High': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'Low': return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'High': return 'bg-red-500/20 text-red-300 border-red-500/50';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Model Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-100 flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            Predictive Model Performance
          </CardTitle>
          <CardDescription className="text-slate-400">
            AI model accuracy and data insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-lg border border-slate-600 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {predictiveData.modelInsights.accuracyScore}%
              </div>
              <div className="text-sm text-slate-400">Model Accuracy</div>
              <Progress value={predictiveData.modelInsights.accuracyScore} className="mt-2" />
            </div>
            <div className="glass-card p-4 rounded-lg border border-slate-600 text-center">
              <div className="text-2xl font-bold text-slate-100 mb-1">
                {predictiveData.modelInsights.dataPoints.toLocaleString()}
              </div>
              <div className="text-sm text-slate-400">Training Data Points</div>
            </div>
            <div className="glass-card p-4 rounded-lg border border-slate-600 text-center">
              <div className="text-sm text-slate-100 mb-1">Last Updated</div>
              <div className="text-xs text-slate-400">
                {formatDate(predictiveData.modelInsights.lastUpdated)}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-slate-200 mb-2">Recent Model Improvements</h4>
            <div className="space-y-1">
              {predictiveData.modelInsights.improvements.map((improvement, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                  {improvement}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goal Completion Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-100">Goal Completion Predictions</CardTitle>
          <CardDescription className="text-slate-400">
            AI-powered predictions for goal completion dates and success probability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictiveData.completionPredictions.map((prediction) => (
              <div key={prediction.goalId} className="glass-card p-4 rounded-lg border border-slate-600">
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-slate-200">{prediction.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="h-3 w-3" />
                      Predicted completion: {formatDate(prediction.predictedCompletion)}
                      <span>•</span>
                      <span>{prediction.daysRemaining} days remaining</span>
                    </div>
                  </div>
                  <Badge className={getRiskColor(prediction.riskLevel)}>
                    {prediction.riskLevel} risk
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400">Progress:</span>
                    <Progress value={prediction.currentProgress} className="flex-1" />
                    <span className="text-sm font-medium text-slate-200">
                      {prediction.currentProgress}%
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400">Confidence:</span>
                    <Progress value={prediction.confidence} className="flex-1" />
                    <span className="text-sm font-medium text-slate-200">
                      {prediction.confidence}%
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-slate-400">Key factors:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {prediction.factors.map((factor, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-100 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            Risk Analysis & Early Warnings
          </CardTitle>
          <CardDescription className="text-slate-400">
            Potential risks that could impact goal achievement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictiveData.riskAnalysis.map((risk, index) => (
              <div key={index} className="glass-card p-4 rounded-lg border border-yellow-500/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-slate-200">{risk.type}</h4>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span>Affects {risk.affectedGoals} goals</span>
                      <span>•</span>
                      <span>{risk.timeframe}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getImpactColor(risk.impact)}`}>
                      {risk.probability}%
                    </div>
                    <div className="text-xs text-slate-400">
                      {risk.impact} Impact
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Progress value={risk.probability} className="w-full h-2" />
                  <div className="p-3 glass-card rounded border border-slate-700">
                    <div className="text-sm text-slate-400 mb-1">Recommendation:</div>
                    <div className="text-sm text-slate-200">{risk.recommendation}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Future Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-100 flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-400" />
            Strategic Recommendations
          </CardTitle>
          <CardDescription className="text-slate-400">
            Data-driven recommendations to improve future performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictiveData.futureRecommendations.map((recommendation, index) => (
              <div key={index} className="glass-card p-4 rounded-lg border border-slate-600">
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-slate-200">{recommendation.action}</h4>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {recommendation.timeframe}
                      <span>•</span>
                      <Badge className={getCostColor(recommendation.cost)}>
                        {recommendation.cost} Cost
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">{recommendation.impact}</div>
                    <div className="text-xs text-slate-400">
                      {recommendation.confidence}% confidence
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Progress value={recommendation.confidence} className="w-full h-1" />
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Expected Benefits:</div>
                    <div className="flex flex-wrap gap-1">
                      {recommendation.benefits.map((benefit, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    View Full Analysis
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictive Insights Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-100">Key Predictions</CardTitle>
            <CardDescription className="text-slate-400">
              High-confidence predictions for next quarter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 glass-card rounded-lg border border-green-500/30">
                <TrendingUp className="h-5 w-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-200">85% of Goals On Track</p>
                  <p className="text-xs text-slate-400">
                    Current trajectory suggests strong Q1 performance with 92% confidence
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 glass-card rounded-lg border border-blue-500/30">
                <Target className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Engineering Team Excellence</p>
                  <p className="text-xs text-slate-400">
                    Predicted to maintain #1 ranking with 95% goal completion rate
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 glass-card rounded-lg border border-purple-500/30">
                <BarChart3 className="h-5 w-5 text-purple-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Velocity Increase</p>
                  <p className="text-xs text-slate-400">
                    Overall velocity expected to increase by 18% with current optimizations
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-slate-100">Attention Required</CardTitle>
            <CardDescription className="text-slate-400">
              Areas requiring immediate focus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 glass-card rounded-lg border border-yellow-500/30">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Resource Allocation Risk</p>
                  <p className="text-xs text-slate-400">
                    78% probability of resource shortage affecting 8 goals in next 30 days
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 glass-card rounded-lg border border-red-500/30">
                <TrendingDown className="h-5 w-5 text-red-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Marketing Goals at Risk</p>
                  <p className="text-xs text-slate-400">
                    65% chance of missing Q1 targets without intervention
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 glass-card rounded-lg border border-orange-500/30">
                <Clock className="h-5 w-5 text-orange-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Dependency Bottlenecks</p>
                  <p className="text-xs text-slate-400">
                    12 goals at risk due to cross-team dependencies in next 45 days
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}