import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface PerformanceMetricsProps {
  timePeriod: string;
  department: string;
}

export function PerformanceMetrics({ timePeriod, department }: PerformanceMetricsProps) {
  // Mock data - would come from API
  const performanceData = {
    goalsByStatus: [
      { status: 'Completed', count: 15, percentage: 36, color: 'text-green-400', bgColor: 'bg-green-500/20' },
      { status: 'On Track', count: 18, percentage: 43, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
      { status: 'At Risk', count: 6, percentage: 14, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
      { status: 'Overdue', count: 3, percentage: 7, color: 'text-red-400', bgColor: 'bg-red-500/20' }
    ],
    departmentPerformance: [
      { name: 'Engineering', goals: 12, completed: 8, progress: 78, velocity: 15, trend: 'up' },
      { name: 'Sales', goals: 8, completed: 6, progress: 72, velocity: 12, trend: 'up' },
      { name: 'Marketing', goals: 6, completed: 2, progress: 45, velocity: 8, trend: 'down' },
      { name: 'Operations', goals: 5, completed: 4, progress: 85, velocity: 18, trend: 'up' },
      { name: 'HR', goals: 4, completed: 1, progress: 38, velocity: 5, trend: 'down' }
    ],
    keyMetrics: [
      { label: 'Overall Goal Velocity', value: '12.3%', subtext: 'per week', trend: 'up', change: '+2.1%' },
      { label: 'Average Time to Complete', value: '8.5', subtext: 'weeks', trend: 'down', change: '-1.2 weeks' },
      { label: 'Goal Success Rate', value: '87%', subtext: 'historical', trend: 'up', change: '+5%' },
      { label: 'Active Contributors', value: '48', subtext: 'team members', trend: 'up', change: '+6' }
    ]
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-400" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-400" />
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'On Track': return <Target className="h-4 w-4 text-blue-400" />;
      case 'At Risk': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'Overdue': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <Target className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Goals by Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-100">Goals by Status</CardTitle>
          <CardDescription className="text-slate-400">
            Current distribution of goals across different statuses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceData.goalsByStatus.map((item) => (
              <div key={item.status} className={`glass-card p-4 rounded-lg border border-slate-600 ${item.bgColor}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className="text-sm font-medium text-slate-200">{item.status}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.percentage}%
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-slate-100 mb-1">{item.count}</div>
                <div className="text-xs text-slate-400">
                  {item.count} of 42 total goals
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-100">Key Performance Metrics</CardTitle>
          <CardDescription className="text-slate-400">
            Critical performance indicators for {timePeriod}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceData.keyMetrics.map((metric) => (
              <div key={metric.label} className="glass-card p-4 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">{metric.label}</span>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-100">{metric.value}</span>
                    <span className="text-xs text-slate-400">{metric.subtext}</span>
                  </div>
                  <div className={`text-xs ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.change} from last period
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-100">Department Performance</CardTitle>
          <CardDescription className="text-slate-400">
            Goal completion and progress by department
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {performanceData.departmentPerformance.map((dept) => (
              <div key={dept.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium text-slate-200">{dept.name}</h4>
                    {getTrendIcon(dept.trend)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>{dept.completed}/{dept.goals} completed</span>
                    <span>{dept.velocity}%/week velocity</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={dept.progress} className="flex-1" />
                  <span className="text-sm font-medium text-slate-200 min-w-[3rem]">
                    {dept.progress}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Goals: {dept.goals} total</span>
                  <span>Completion Rate: {Math.round((dept.completed / dept.goals) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-100">Top Performers</CardTitle>
            <CardDescription className="text-slate-400">
              Departments exceeding expectations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performanceData.departmentPerformance
                .filter(dept => dept.progress > 70)
                .sort((a, b) => b.progress - a.progress)
                .map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between p-3 glass-card rounded-lg border border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="font-medium text-slate-200">{dept.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-200">{dept.progress}%</div>
                      <div className="text-xs text-green-400">+{dept.velocity}%/week</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-slate-100">Needs Attention</CardTitle>
            <CardDescription className="text-slate-400">
              Areas requiring focus and support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performanceData.departmentPerformance
                .filter(dept => dept.progress < 50)
                .sort((a, b) => a.progress - b.progress)
                .map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between p-3 glass-card rounded-lg border border-red-500/30">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full" />
                      <span className="font-medium text-slate-200">{dept.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-200">{dept.progress}%</div>
                      <div className="text-xs text-red-400">{dept.velocity}%/week</div>
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