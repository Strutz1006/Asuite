import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Clock, Users, TrendingUp, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';

interface GoalAnalysisProps {
  timePeriod: string;
  department: string;
}

export function GoalAnalysis({ timePeriod, department }: GoalAnalysisProps) {
  // Mock data - would come from API
  const analysisData = {
    goalDistribution: [
      { category: 'Strategic', count: 12, percentage: 28, avgProgress: 75, avgDuration: 12 },
      { category: 'Operational', count: 15, percentage: 36, avgProgress: 68, avgDuration: 8 },
      { category: 'Financial', count: 8, percentage: 19, avgProgress: 82, avgDuration: 6 },
      { category: 'Customer', count: 7, percentage: 17, avgProgress: 71, avgDuration: 10 }
    ],
    goalsByPriority: [
      { priority: 'High', count: 18, completed: 12, onTrack: 4, atRisk: 2 },
      { priority: 'Medium', count: 16, completed: 8, onTrack: 6, atRisk: 2 },
      { priority: 'Low', count: 8, completed: 3, onTrack: 4, atRisk: 1 }
    ],
    completionPatterns: [
      { timeframe: 'Under 4 weeks', count: 8, percentage: 19 },
      { timeframe: '4-8 weeks', count: 12, percentage: 29 },
      { timeframe: '8-12 weeks', count: 15, percentage: 36 },
      { timeframe: 'Over 12 weeks', count: 7, percentage: 17 }
    ],
    topPerformingGoals: [
      {
        id: 1,
        title: 'Cloud Infrastructure Migration',
        progress: 95,
        category: 'Strategic',
        owner: 'Sarah Chen',
        department: 'Engineering',
        daysToComplete: 45,
        velocity: 22
      },
      {
        id: 2,
        title: 'Customer Satisfaction Improvement',
        progress: 88,
        category: 'Customer',
        owner: 'Mike Johnson',
        department: 'Sales',
        daysToComplete: 32,
        velocity: 18
      },
      {
        id: 3,
        title: 'Process Automation Initiative',
        progress: 92,
        category: 'Operational',
        owner: 'Lisa Rodriguez',
        department: 'Operations',
        daysToComplete: 28,
        velocity: 20
      }
    ],
    strugglingGoals: [
      {
        id: 4,
        title: 'Brand Awareness Campaign',
        progress: 35,
        category: 'Strategic',
        owner: 'David Kim',
        department: 'Marketing',
        daysStalled: 18,
        blockers: 3
      },
      {
        id: 5,
        title: 'Talent Retention Program',
        progress: 28,
        category: 'Operational',
        owner: 'Emma Wilson',
        department: 'HR',
        daysStalled: 12,
        blockers: 2
      }
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'Low': return 'bg-green-500/20 text-green-300 border-green-500/50';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Strategic': return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
      case 'Operational': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'Financial': return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'Customer': return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Goal Distribution Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-100">Goal Distribution by Category</CardTitle>
          <CardDescription className="text-slate-400">
            Analysis of goals across different categories and their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analysisData.goalDistribution.map((category) => (
              <div key={category.category} className="glass-card p-4 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-slate-200">{category.category}</span>
                  </div>
                  <Badge className={getCategoryColor(category.category)}>
                    {category.percentage}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-slate-100">{category.count}</div>
                  <div className="text-xs text-slate-400">goals total</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Avg Progress</span>
                      <span className="text-slate-200">{category.avgProgress}%</span>
                    </div>
                    <Progress value={category.avgProgress} className="h-1" />
                  </div>
                  <div className="text-xs text-slate-400">
                    Avg Duration: {category.avgDuration} weeks
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priority Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-100">Goals by Priority Level</CardTitle>
          <CardDescription className="text-slate-400">
            Distribution and status of goals across priority levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysisData.goalsByPriority.map((priority) => (
              <div key={priority.priority} className="glass-card p-4 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className={getPriorityColor(priority.priority)}>
                      {priority.priority} Priority
                    </Badge>
                    <span className="text-sm text-slate-400">
                      {priority.count} total goals
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span className="text-xs text-slate-400">Completed</span>
                    </div>
                    <div className="text-lg font-bold text-green-400">{priority.completed}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Target className="h-3 w-3 text-blue-400" />
                      <span className="text-xs text-slate-400">On Track</span>
                    </div>
                    <div className="text-lg font-bold text-blue-400">{priority.onTrack}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <AlertTriangle className="h-3 w-3 text-red-400" />
                      <span className="text-xs text-slate-400">At Risk</span>
                    </div>
                    <div className="text-lg font-bold text-red-400">{priority.atRisk}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completion Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-100">Goal Completion Patterns</CardTitle>
          <CardDescription className="text-slate-400">
            Analysis of typical completion timeframes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analysisData.completionPatterns.map((pattern) => (
              <div key={pattern.timeframe} className="glass-card p-4 rounded-lg border border-slate-600 text-center">
                <div className="text-sm text-slate-400 mb-2">{pattern.timeframe}</div>
                <div className="text-2xl font-bold text-slate-100 mb-1">{pattern.count}</div>
                <div className="text-xs text-slate-400">goals ({pattern.percentage}%)</div>
                <div className="mt-2">
                  <Progress value={pattern.percentage} className="h-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing vs Struggling Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Top Performing Goals
            </CardTitle>
            <CardDescription className="text-slate-400">
              Goals with exceptional progress and velocity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisData.topPerformingGoals.map((goal) => (
                <div key={goal.id} className="glass-card p-4 rounded-lg border border-green-500/30">
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1">
                      <h4 className="font-medium text-slate-200">{goal.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Users className="h-3 w-3" />
                        {goal.owner}
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {goal.department}
                        </Badge>
                      </div>
                    </div>
                    <Badge className={getCategoryColor(goal.category)}>
                      {goal.category}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Progress value={goal.progress} className="flex-1" />
                      <span className="text-sm font-medium text-slate-200">
                        {goal.progress}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Completed in {goal.daysToComplete} days</span>
                      <span className="text-green-400">+{goal.velocity}%/week velocity</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-400" />
              Goals Needing Support
            </CardTitle>
            <CardDescription className="text-slate-400">
              Goals with slow progress requiring intervention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisData.strugglingGoals.map((goal) => (
                <div key={goal.id} className="glass-card p-4 rounded-lg border border-yellow-500/30">
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1">
                      <h4 className="font-medium text-slate-200">{goal.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Users className="h-3 w-3" />
                        {goal.owner}
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {goal.department}
                        </Badge>
                      </div>
                    </div>
                    <Badge className={getCategoryColor(goal.category)}>
                      {goal.category}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Progress value={goal.progress} className="flex-1" />
                      <span className="text-sm font-medium text-slate-200">
                        {goal.progress}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-red-400">Stalled {goal.daysStalled} days</span>
                      <span className="text-yellow-400">{goal.blockers} blockers</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goal Analysis Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-100">Key Insights & Recommendations</CardTitle>
          <CardDescription className="text-slate-400">
            Data-driven insights from goal analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-green-400">Positive Patterns</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">
                    Financial goals show highest completion rate (82% avg progress)
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">
                    High-priority goals have 67% completion rate vs 38% for low-priority
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">
                    Most goals (65%) complete within their planned timeframe
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-yellow-400">Areas for Improvement</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">
                    Strategic goals taking 50% longer than planned on average
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">
                    Marketing department shows consistent delays across goal types
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">
                    Goals with 3+ blockers have 73% lower completion rate
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}