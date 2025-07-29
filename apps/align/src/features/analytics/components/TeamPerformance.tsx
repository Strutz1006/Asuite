import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Trophy, TrendingUp, TrendingDown, Target, Clock, Star } from 'lucide-react';

interface TeamPerformanceProps {
  timePeriod: string;
  department: string;
}

export function TeamPerformance({ timePeriod, department }: TeamPerformanceProps) {
  // Mock data - would come from API
  const teamData = {
    departments: [
      {
        name: 'Engineering',
        members: 15,
        goals: 12,
        completed: 8,
        progress: 78,
        velocity: 15,
        trend: 'up',
        score: 92,
        rank: 1
      },
      {
        name: 'Operations',
        members: 8,
        goals: 5,
        completed: 4,
        progress: 85,
        velocity: 18,
        trend: 'up',
        score: 88,
        rank: 2
      },
      {
        name: 'Sales',
        members: 12,
        goals: 8,
        completed: 6,
        progress: 72,
        velocity: 12,
        trend: 'up',
        score: 82,
        rank: 3
      },
      {
        name: 'Marketing',
        members: 6,
        goals: 6,
        completed: 2,
        progress: 45,
        velocity: 8,
        trend: 'down',
        score: 65,
        rank: 4
      },
      {
        name: 'Human Resources',
        members: 4,
        goals: 4,
        completed: 1,
        progress: 38,
        velocity: 5,
        trend: 'down',
        score: 58,
        rank: 5
      }
    ],
    topContributors: [
      {
        name: 'Sarah Chen',
        department: 'Engineering',
        goals: 5,
        completed: 4,
        progress: 88,
        contributions: 23,
        streak: 8
      },
      {
        name: 'Lisa Rodriguez',
        department: 'Operations',
        goals: 3,
        completed: 3,
        progress: 95,
        contributions: 18,
        streak: 12
      },
      {
        name: 'Mike Johnson',
        department: 'Sales',
        goals: 4,
        completed: 3,
        progress: 82,
        contributions: 15,
        streak: 6
      },
      {
        name: 'Alex Kim',
        department: 'Engineering',
        goals: 3,
        completed: 2,
        progress: 75,
        contributions: 12,
        streak: 4
      }
    ],
    collaborationMetrics: [
      { metric: 'Cross-team Goals', value: 12, change: '+3', trend: 'up' },
      { metric: 'Avg Team Size', value: 4.2, change: '+0.3', trend: 'up' },
      { metric: 'Inter-dept Dependencies', value: 18, change: '+2', trend: 'up' },
      { metric: 'Collaboration Score', value: 78, change: '+5', trend: 'up' }
    ],
    teamHealthIndicators: [
      { indicator: 'Goal Alignment', score: 85, status: 'good' },
      { indicator: 'Communication', score: 72, status: 'fair' },
      { indicator: 'Resource Utilization', score: 90, status: 'excellent' },
      { indicator: 'Knowledge Sharing', score: 68, status: 'fair' },
      { indicator: 'Goal Clarity', score: 88, status: 'good' }
    ]
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-slate-300';
      case 3: return 'text-orange-400';
      default: return 'text-slate-400';
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) {
      return <Trophy className={`h-4 w-4 ${getRankColor(rank)}`} />;
    }
    return <Target className="h-4 w-4 text-slate-400" />;
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-400" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-400" />
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'good': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'fair': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'poor': return 'bg-red-500/20 text-red-300 border-red-500/50';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Department Rankings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-100">Department Performance Rankings</CardTitle>
          <CardDescription className="text-slate-400">
            Performance scores and rankings for {timePeriod}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamData.departments.map((dept) => (
              <div key={dept.name} className="glass-card p-4 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getRankIcon(dept.rank)}
                    <div>
                      <h4 className="font-medium text-slate-200">{dept.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Users className="h-3 w-3" />
                        {dept.members} members
                        <span>•</span>
                        {dept.goals} goals
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getScoreColor(dept.score)}`}>
                        {dept.score}
                      </div>
                      <div className="text-xs text-slate-400">
                        #{dept.rank} rank
                      </div>
                    </div>
                    {getTrendIcon(dept.trend)}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-sm font-medium text-slate-200">{dept.completed}</div>
                    <div className="text-xs text-slate-400">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-slate-200">{dept.progress}%</div>
                    <div className="text-xs text-slate-400">Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-slate-200">{dept.velocity}%</div>
                    <div className="text-xs text-slate-400">Velocity/week</div>
                  </div>
                </div>
                
                <Progress value={dept.progress} className="w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Contributors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-100 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Top Contributors
          </CardTitle>
          <CardDescription className="text-slate-400">
            Individual team members with outstanding performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamData.topContributors.map((contributor, index) => (
              <div key={contributor.name} className="glass-card p-4 rounded-lg border border-slate-600">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 glass-card rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-slate-200">
                        #{index + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-200">{contributor.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {contributor.department}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Progress value={contributor.progress} className="flex-1" />
                    <span className="text-sm font-medium text-slate-200">
                      {contributor.progress}%
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-medium text-slate-200">{contributor.completed}/{contributor.goals}</div>
                      <div className="text-slate-400">Goals</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-slate-200">{contributor.contributions}</div>
                      <div className="text-slate-400">Contributions</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-green-400">{contributor.streak}</div>
                      <div className="text-slate-400">Day streak</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Collaboration Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-100">Collaboration Metrics</CardTitle>
          <CardDescription className="text-slate-400">
            Cross-team collaboration and teamwork indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {teamData.collaborationMetrics.map((metric) => (
              <div key={metric.metric} className="glass-card p-4 rounded-lg border border-slate-600">
                <div className="space-y-2">
                  <div className="text-sm text-slate-400">{metric.metric}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-100">
                      {metric.value}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(metric.trend)}
                    <span className={`text-xs ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {metric.change} from last period
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Health Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-100">Team Health Indicators</CardTitle>
          <CardDescription className="text-slate-400">
            Key indicators of team effectiveness and collaboration quality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamData.teamHealthIndicators.map((indicator) => (
              <div key={indicator.indicator} className="flex items-center justify-between p-3 glass-card rounded-lg border border-slate-600">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-slate-200">{indicator.indicator}</span>
                  <Badge className={getHealthColor(indicator.status)}>
                    {indicator.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={indicator.score} className="w-24" />
                  <span className={`text-sm font-medium ${getScoreColor(indicator.score)}`}>
                    {indicator.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-100">Performance Highlights</CardTitle>
            <CardDescription className="text-slate-400">
              Notable achievements and positive trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 glass-card rounded-lg border border-green-500/30">
                <Trophy className="h-5 w-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Engineering Leading Performance</p>
                  <p className="text-xs text-slate-400">
                    Maintains #1 ranking with 92 performance score and 15%/week velocity
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 glass-card rounded-lg border border-green-500/30">
                <Users className="h-5 w-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Strong Cross-Team Collaboration</p>
                  <p className="text-xs text-slate-400">
                    12 cross-team goals active with 78% collaboration score
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 glass-card rounded-lg border border-green-500/30">
                <Star className="h-5 w-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Individual Excellence</p>
                  <p className="text-xs text-slate-400">
                    4 team members maintain 80%+ individual performance scores
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-slate-100">Improvement Opportunities</CardTitle>
            <CardDescription className="text-slate-400">
              Areas where teams can enhance performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 glass-card rounded-lg border border-yellow-500/30">
                <Clock className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Communication Gaps</p>
                  <p className="text-xs text-slate-400">
                    Team communication score at 72% - consider more frequent check-ins
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 glass-card rounded-lg border border-yellow-500/30">
                <TrendingDown className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-200">HR & Marketing Support Needed</p>
                  <p className="text-xs text-slate-400">
                    Bottom two departments may need additional resources or training
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 glass-card rounded-lg border border-yellow-500/30">
                <Target className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Knowledge Sharing</p>
                  <p className="text-xs text-slate-400">
                    68% knowledge sharing score suggests room for better collaboration
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