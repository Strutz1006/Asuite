import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertTriangle, Calendar, Plus, Target } from 'lucide-react';
import { useState } from 'react';

interface MilestoneTrackerProps {
  filterPeriod: string;
  filterDepartment: string;
  goals: any[];
}

export function MilestoneTracker({ filterPeriod, filterDepartment, goals }: MilestoneTrackerProps) {
  const [selectedGoal, setSelectedGoal] = useState('all');

  // Generate milestones from real goals data
  const generateMilestonesFromGoals = () => {
    if (!goals || goals.length === 0) return [];

    return goals
      .filter(goal => {
        // Apply department filter
        if (filterDepartment !== 'all' && goal.department_id !== filterDepartment) {
          return false;
        }
        
        // Apply period filter based on due_date or created_at
        const goalDate = goal.due_date || goal.created_at;
        if (!goalDate) return true; // Include goals without dates
        
        const date = new Date(goalDate);
        const now = new Date();
        
        switch (filterPeriod) {
          case 'current-quarter': {
            const quarter = Math.floor(now.getMonth() / 3);
            const quarterStart = new Date(now.getFullYear(), quarter * 3, 1);
            const quarterEnd = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
            return date >= quarterStart && date <= quarterEnd;
          }
          case 'last-quarter': {
            const quarter = Math.floor(now.getMonth() / 3) - 1;
            const year = quarter < 0 ? now.getFullYear() - 1 : now.getFullYear();
            const adjustedQuarter = quarter < 0 ? 3 : quarter;
            const quarterStart = new Date(year, adjustedQuarter * 3, 1);
            const quarterEnd = new Date(year, (adjustedQuarter + 1) * 3, 0);
            return date >= quarterStart && date <= quarterEnd;
          }
          case 'current-year':
            return date.getFullYear() === now.getFullYear();
          case 'last-30-days': {
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return date >= thirtyDaysAgo && date <= now;
          }
          case 'last-90-days': {
            const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            return date >= ninetyDaysAgo && date <= now;
          }
          default:
            return true;
        }
      })
      .map(goal => {
        // Determine milestone status based on goal status and progress
        let status = 'pending';
        if (goal.status === 'completed') {
          status = 'completed';
        } else if (goal.progress_percentage >= 80) {
          status = 'in-progress';
        } else if (goal.due_date) {
          const dueDate = new Date(goal.due_date);
          const now = new Date();
          const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysUntilDue < 0) {
            status = 'overdue';
          } else if (daysUntilDue <= 7 && goal.progress_percentage < 70) {
            status = 'at-risk';
          } else if (goal.progress_percentage > 0) {
            status = 'in-progress';
          }
        } else if (goal.progress_percentage > 0) {
          status = 'in-progress';
        }

        return {
          id: goal.id,
          goalId: goal.id,
          goalTitle: goal.title,
          title: `${goal.title} Milestone`,
          description: goal.description || `Complete ${goal.title}`,
          status,
          dueDate: goal.due_date || '',
          completedDate: goal.completion_date || null,
          progress: goal.progress_percentage,
          dependencies: [], // Could be derived from parent_id if needed
          assignee: goal.owner?.full_name || 'Unassigned',
          department: goal.department?.name || goal.team?.name || 'General'
        };
      });
  };

  const milestones = generateMilestonesFromGoals();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'in-progress': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'at-risk': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'overdue': return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'pending': return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-400" />;
      case 'at-risk': 
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'pending': return <Clock className="h-4 w-4 text-slate-400" />;
      default: return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDateString: string) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Group milestones by goal
  const milestonesByGoal = milestones.reduce((acc, milestone) => {
    if (!acc[milestone.goalId]) {
      acc[milestone.goalId] = {
        goalTitle: milestone.goalTitle,
        milestones: []
      };
    }
    acc[milestone.goalId].milestones.push(milestone);
    return acc;
  }, {} as Record<string, { goalTitle: string; milestones: typeof milestones }>);

  return (
    <div className="space-y-6">
      {/* Milestone Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-200">Total Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">
              {milestones.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-200">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {milestones.filter(m => m.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-200">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {milestones.filter(m => m.status === 'in-progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-200">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {milestones.filter(m => m.status === 'overdue').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Milestone Button */}
      <div className="flex justify-end">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Milestone
        </Button>
      </div>

      {/* Milestones by Goal */}
      <div className="space-y-6">
        {Object.entries(milestonesByGoal).map(([goalId, goalData]) => (
          <Card key={goalId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-100 flex items-center gap-2">
                    <Target className="h-5 w-5 text-sky-400" />
                    {goalData.goalTitle}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {goalData.milestones.length} milestones • {goalData.milestones.filter(m => m.status === 'completed').length} completed
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goalData.milestones.map((milestone, index) => {
                  const daysUntilDue = getDaysUntilDue(milestone.dueDate);
                  
                  return (
                    <div key={milestone.id} className="relative">
                      {/* Timeline connector */}
                      {index < goalData.milestones.length - 1 && (
                        <div className="absolute left-6 top-12 bottom-0 w-px bg-slate-700" />
                      )}
                      
                      <div className="flex gap-4">
                        {/* Milestone icon */}
                        <div className="flex-shrink-0 w-12 h-12 glass-card rounded-full flex items-center justify-center border border-slate-600">
                          {getStatusIcon(milestone.status)}
                        </div>
                        
                        {/* Milestone content */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h4 className="font-medium text-slate-200">{milestone.title}</h4>
                              <p className="text-sm text-slate-400">{milestone.description}</p>
                              <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Calendar className="h-3 w-3" />
                                Due: {formatDate(milestone.dueDate)}
                                {milestone.completedDate && (
                                  <>
                                    <span>•</span>
                                    <span className="text-green-400">
                                      Completed: {formatDate(milestone.completedDate)}
                                    </span>
                                  </>
                                )}
                                {!milestone.completedDate && daysUntilDue <= 7 && daysUntilDue >= 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="text-yellow-400">
                                      Due in {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}
                                    </span>
                                  </>
                                )}
                                {daysUntilDue < 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="text-red-400">
                                      {Math.abs(daysUntilDue)} day{Math.abs(daysUntilDue) !== 1 ? 's' : ''} overdue
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(milestone.status)}>
                                {milestone.status.replace('-', ' ')}
                              </Badge>
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </div>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="flex items-center gap-3">
                            <Progress value={milestone.progress} className="flex-1" />
                            <span className="text-sm font-medium text-slate-200 min-w-[3rem]">
                              {milestone.progress}%
                            </span>
                          </div>
                          
                          {/* Dependencies and assignee */}
                          <div className="flex items-center justify-between text-sm">
                            <div className="space-y-1">
                              {milestone.dependencies.length > 0 && (
                                <div>
                                  <span className="text-slate-400">Dependencies: </span>
                                  <span className="text-slate-300">
                                    {milestone.dependencies.join(', ')}
                                  </span>
                                </div>
                              )}
                              <div>
                                <span className="text-slate-400">Assignee: </span>
                                <span className="text-slate-300">{milestone.assignee}</span>
                                <span className="text-slate-400"> • </span>
                                <Badge variant="outline" className="text-xs">
                                  {milestone.department}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}