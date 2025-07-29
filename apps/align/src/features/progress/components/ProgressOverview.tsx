import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Clock, Users, Target, ArrowUpRight } from 'lucide-react';

interface ProgressOverviewProps {
  filterPeriod: string;
  filterDepartment: string;
}

export function ProgressOverview({ filterPeriod, filterDepartment }: ProgressOverviewProps) {
  // Mock data - would come from API
  const departmentProgress = [
    {
      name: 'Engineering',
      progress: 85,
      goals: 12,
      trend: 'up',
      velocity: 15,
      status: 'on-track'
    },
    {
      name: 'Sales',
      progress: 72,
      goals: 8,
      trend: 'up',
      velocity: 12,
      status: 'on-track'
    },
    {
      name: 'Marketing',
      progress: 58,
      goals: 6,
      trend: 'down',
      velocity: 8,
      status: 'at-risk'
    },
    {
      name: 'Operations',
      progress: 91,
      goals: 5,
      trend: 'up',
      velocity: 18,
      status: 'ahead'
    },
    {
      name: 'Human Resources',
      progress: 45,
      goals: 4,
      trend: 'down',
      velocity: 5,
      status: 'behind'
    }
  ];

  const topPerformingGoals = [
    {
      id: 1,
      title: 'Cloud Infrastructure Migration',
      progress: 95,
      department: 'Engineering',
      owner: 'Sarah Chen',
      dueDate: '2024-12-15',
      velocity: 22
    },
    {
      id: 2,
      title: 'Customer Satisfaction Score',
      progress: 88,
      department: 'Sales',
      owner: 'Mike Johnson',
      dueDate: '2024-11-30',
      velocity: 18
    },
    {
      id: 3,
      title: 'Process Automation Initiative',
      progress: 92,
      department: 'Operations',
      owner: 'Lisa Rodriguez',
      dueDate: '2024-12-31',
      velocity: 20
    }
  ];

  const needsAttentionGoals = [
    {
      id: 4,
      title: 'Brand Awareness Campaign',
      progress: 35,
      department: 'Marketing',
      owner: 'David Kim',
      dueDate: '2024-10-31',
      daysOverdue: 12,
      blockers: ['Budget approval pending', 'Design review']
    },
    {
      id: 5,
      title: 'Talent Retention Program',
      progress: 28,
      department: 'Human Resources',
      owner: 'Emma Wilson',
      dueDate: '2024-11-15',
      daysOverdue: 0,
      blockers: ['Policy review', 'Management approval']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
      case 'on-track': return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'at-risk': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'behind': return 'bg-red-500/20 text-red-300 border-red-500/50';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-400" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-400" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Department Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-100">Department Progress Overview</CardTitle>
          <CardDescription className="text-slate-400">
            Progress tracking across all departments for {filterPeriod}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {departmentProgress.map((dept) => (
              <div key={dept.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium text-slate-200">{dept.name}</h4>
                    <Badge className={getStatusColor(dept.status)}>
                      {dept.status.replace('-', ' ')}
                    </Badge>
                    {getTrendIcon(dept.trend)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {dept.goals} goals
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {dept.velocity}%/week
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={dept.progress} className="flex-1" />
                  <span className="text-sm font-medium text-slate-200 min-w-[3rem]">
                    {dept.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Top Performing Goals
            </CardTitle>
            <CardDescription className="text-slate-400">
              Goals exceeding expectations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingGoals.map((goal) => (
                <div key={goal.id} className="space-y-2 p-3 glass-card rounded-lg border border-slate-700">
                  <div className="flex items-start justify-between">
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
                    <Button variant="ghost" size="sm">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={goal.progress} className="flex-1" />
                    <span className="text-sm font-medium text-slate-200">
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Due: {goal.dueDate}</span>
                    <span className="flex items-center gap-1 text-green-400">
                      <TrendingUp className="h-3 w-3" />
                      {goal.velocity}%/week
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Goals Needing Attention */}
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-400" />
              Needs Attention
            </CardTitle>
            <CardDescription className="text-slate-400">
              Goals requiring immediate focus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {needsAttentionGoals.map((goal) => (
                <div key={goal.id} className="space-y-2 p-3 glass-card rounded-lg border border-yellow-500/30">
                  <div className="flex items-start justify-between">
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
                    <Button variant="ghost" size="sm">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={goal.progress} className="flex-1" />
                    <span className="text-sm font-medium text-slate-200">
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Due: {goal.dueDate}</span>
                      {goal.daysOverdue > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {goal.daysOverdue} days overdue
                        </Badge>
                      )}
                    </div>
                    {goal.blockers && goal.blockers.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-xs text-slate-400">Blockers:</span>
                        <div className="flex flex-wrap gap-1">
                          {goal.blockers.map((blocker, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {blocker}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}