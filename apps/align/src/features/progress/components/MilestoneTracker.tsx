import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertTriangle, Calendar, Plus, Target } from 'lucide-react';
import { useState } from 'react';

interface MilestoneTrackerProps {
  filterPeriod: string;
  filterDepartment: string;
}

export function MilestoneTracker({ filterPeriod, filterDepartment }: MilestoneTrackerProps) {
  const [selectedGoal, setSelectedGoal] = useState('all');

  // Mock data - would come from API
  const milestones = [
    {
      id: 1,
      goalId: 'goal-1',
      goalTitle: 'Cloud Infrastructure Migration',
      title: 'Development Environment Migration',
      description: 'Complete migration of all development servers and applications',
      status: 'completed',
      dueDate: '2024-01-10',
      completedDate: '2024-01-08',
      progress: 100,
      dependencies: [],
      assignee: 'Sarah Chen',
      department: 'Engineering'
    },
    {
      id: 2,
      goalId: 'goal-1',
      goalTitle: 'Cloud Infrastructure Migration',
      title: 'Staging Environment Migration',
      description: 'Migrate staging environment with full testing suite',
      status: 'in-progress',
      dueDate: '2024-01-20',
      completedDate: null,
      progress: 75,
      dependencies: ['Development Environment Migration'],
      assignee: 'Sarah Chen',
      department: 'Engineering'
    },
    {
      id: 3,
      goalId: 'goal-1',
      goalTitle: 'Cloud Infrastructure Migration',
      title: 'Production Cutover',
      description: 'Execute production migration with zero-downtime strategy',
      status: 'pending',
      dueDate: '2024-02-01',
      completedDate: null,
      progress: 15,
      dependencies: ['Staging Environment Migration'],
      assignee: 'Sarah Chen',
      department: 'Engineering'
    },
    {
      id: 4,
      goalId: 'goal-2',
      goalTitle: 'Customer Satisfaction Score',
      title: 'Customer Survey Implementation',
      description: 'Deploy new customer feedback collection system',
      status: 'completed',
      dueDate: '2024-01-05',
      completedDate: '2024-01-05',
      progress: 100,
      dependencies: [],
      assignee: 'Mike Johnson',
      department: 'Sales'
    },
    {
      id: 5,
      goalId: 'goal-2',
      goalTitle: 'Customer Satisfaction Score',
      title: 'Response Rate Optimization',
      description: 'Achieve 75% customer survey response rate',
      status: 'in-progress',
      dueDate: '2024-01-25',
      completedDate: null,
      progress: 82,
      dependencies: ['Customer Survey Implementation'],
      assignee: 'Mike Johnson',
      department: 'Sales'
    },
    {
      id: 6,
      goalId: 'goal-3',
      goalTitle: 'Brand Awareness Campaign',
      title: 'Creative Asset Development',
      description: 'Complete all creative assets for multi-channel campaign',
      status: 'overdue',
      dueDate: '2024-01-15',
      completedDate: null,
      progress: 45,
      dependencies: [],
      assignee: 'David Kim',
      department: 'Marketing'
    },
    {
      id: 7,
      goalId: 'goal-3',
      goalTitle: 'Brand Awareness Campaign',
      title: 'Campaign Launch Preparation',
      description: 'Finalize media buying and launch schedule',
      status: 'at-risk',
      dueDate: '2024-01-30',
      completedDate: null,
      progress: 20,
      dependencies: ['Creative Asset Development'],
      assignee: 'David Kim',
      department: 'Marketing'
    }
  ];

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