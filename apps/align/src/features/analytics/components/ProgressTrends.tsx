import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react';

interface ProgressTrendsProps {
  timePeriod: string;
  department: string;
}

export function ProgressTrends({ timePeriod, department }: ProgressTrendsProps) {
  const [chartType, setChartType] = useState('progress');

  // Mock data - in real app this would come from API
  const trendsData = {
    weeklyProgress: [
      { week: 'Week 1', progress: 15, completed: 2, created: 3 },
      { week: 'Week 2', progress: 28, completed: 3, created: 1 },
      { week: 'Week 3', progress: 42, completed: 4, created: 2 },
      { week: 'Week 4', progress: 55, completed: 2, created: 4 },
      { week: 'Week 5', progress: 68, completed: 5, created: 1 },
      { week: 'Week 6', progress: 74, completed: 3, created: 2 }
    ],
    departmentTrends: [
      { 
        department: 'Engineering', 
        data: [65, 70, 68, 75, 78, 82, 85, 88],
        color: 'rgb(59, 130, 246)',
        trend: 'up'
      },
      { 
        department: 'Sales', 
        data: [45, 50, 55, 62, 68, 70, 72, 75],
        color: 'rgb(16, 185, 129)',
        trend: 'up'
      },
      { 
        department: 'Marketing', 
        data: [35, 40, 42, 38, 35, 40, 45, 48],
        color: 'rgb(245, 158, 11)',
        trend: 'stable'
      },
      { 
        department: 'Operations', 
        data: [55, 60, 65, 70, 75, 80, 85, 88],
        color: 'rgb(139, 92, 246)',
        trend: 'up'
      }
    ],
    velocityMetrics: [
      { metric: 'Average Weekly Progress', current: 12.3, previous: 10.1, unit: '%' },
      { metric: 'Goals Completed per Week', current: 3.2, previous: 2.8, unit: 'goals' },
      { metric: 'Time to Complete (avg)', current: 8.5, previous: 9.7, unit: 'weeks' },
      { metric: 'Goal Creation Rate', current: 2.1, previous: 2.5, unit: 'per week' }
    ]
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      case 'stable': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-400" />;
      default: return <TrendingUp className="h-4 w-4 text-slate-400" />;
    }
  };

  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      type: change >= 0 ? 'increase' : 'decrease',
      icon: change >= 0 ? 'up' : 'down'
    };
  };

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-100">Progress Trends Analysis</CardTitle>
              <CardDescription className="text-slate-400">
                Visual analysis of goal progress over time
              </CardDescription>
            </div>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="progress">Progress Over Time</SelectItem>
                <SelectItem value="completion">Completion Rate</SelectItem>
                <SelectItem value="velocity">Velocity Trends</SelectItem>
                <SelectItem value="department">Department Comparison</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {/* Chart Placeholder - would use a real charting library */}
          <div className="h-80 glass-card rounded-lg border border-slate-600 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <BarChart3 className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg font-medium">Interactive {chartType} Chart</p>
              <p className="text-sm">
                Showing trends for {timePeriod} • {department === 'all' ? 'All Departments' : department}
              </p>
              <div className="mt-4 text-xs">
                Chart visualization would be rendered here using a library like Chart.js or D3
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-100">Weekly Progress Summary</CardTitle>
          <CardDescription className="text-slate-400">
            Week-over-week progress tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trendsData.weeklyProgress.map((week) => (
              <div key={week.week} className="glass-card p-4 rounded-lg border border-slate-600 text-center">
                <div className="text-xs text-slate-400 mb-2">{week.week}</div>
                <div className="text-2xl font-bold text-slate-100 mb-1">{week.progress}%</div>
                <div className="space-y-1 text-xs text-slate-400">
                  <div className="flex items-center justify-center gap-1">
                    <Target className="h-3 w-3" />
                    <span>{week.completed} completed</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{week.created} created</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-100">Department Progress Trends</CardTitle>
          <CardDescription className="text-slate-400">
            Progress trends by department over the last 8 weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trendsData.departmentTrends.map((dept) => (
              <div key={dept.department} className="glass-card p-4 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: dept.color }}
                    />
                    <span className="font-medium text-slate-200">{dept.department}</span>
                    {getTrendIcon(dept.trend)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getTrendColor(dept.trend)}>
                      {dept.trend}
                    </Badge>
                    <span className="text-sm text-slate-400">
                      Current: {dept.data[dept.data.length - 1]}%
                    </span>
                  </div>
                </div>
                
                {/* Mini trend visualization */}
                <div className="flex items-end gap-1 h-12">
                  {dept.data.map((value, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-t"
                      style={{
                        height: `${(value / 100) * 100}%`,
                        backgroundColor: dept.color,
                        opacity: 0.7 + (index * 0.1)
                      }}
                    />
                  ))}
                </div>
                
                <div className="mt-2 text-xs text-slate-400">
                  Week-over-week trend • {dept.data.length} data points
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Velocity Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-100">Velocity Metrics</CardTitle>
          <CardDescription className="text-slate-400">
            Key performance velocity indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendsData.velocityMetrics.map((metric) => {
              const change = calculateChange(metric.current, metric.previous);
              
              return (
                <div key={metric.metric} className="glass-card p-4 rounded-lg border border-slate-600">
                  <div className="space-y-2">
                    <div className="text-sm text-slate-400">{metric.metric}</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-slate-100">
                        {metric.current}
                      </span>
                      <span className="text-xs text-slate-400">{metric.unit}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {change.icon === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-green-400" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-400" />
                      )}
                      <span className={`text-xs ${change.type === 'increase' ? 'text-green-400' : 'text-red-400'}`}>
                        {change.type === 'increase' ? '+' : '-'}{change.value}%
                      </span>
                      <span className="text-xs text-slate-400">vs previous</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Trend Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-100">Positive Trends</CardTitle>
            <CardDescription className="text-slate-400">
              Areas showing improvement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 glass-card rounded-lg border border-green-500/30">
                <TrendingUp className="h-5 w-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Engineering Velocity</p>
                  <p className="text-xs text-slate-400">
                    23% increase in weekly progress completion over last month
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 glass-card rounded-lg border border-green-500/30">
                <TrendingUp className="h-5 w-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Goal Completion Rate</p>
                  <p className="text-xs text-slate-400">
                    Consistent upward trend with 8.1% improvement this quarter
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-slate-100">Areas for Improvement</CardTitle>
            <CardDescription className="text-slate-400">
              Trends requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 glass-card rounded-lg border border-yellow-500/30">
                <TrendingDown className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Marketing Progress</p>
                  <p className="text-xs text-slate-400">
                    Plateau in progress over last 3 weeks, may need intervention
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 glass-card rounded-lg border border-yellow-500/30">
                <TrendingDown className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Goal Creation Rate</p>
                  <p className="text-xs text-slate-400">
                    16% decrease in new goal creation may indicate planning gaps
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