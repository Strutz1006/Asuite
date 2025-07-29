import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Calendar, TrendingUp, TrendingDown, User, MessageSquare, Clock, Filter } from 'lucide-react';

interface ProgressHistoryProps {
  filterPeriod: string;
  filterDepartment: string;
}

export function ProgressHistory({ filterPeriod, filterDepartment }: ProgressHistoryProps) {
  const [selectedGoal, setSelectedGoal] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Mock data - would come from API
  const progressUpdates = [
    {
      id: 1,
      goalId: 'goal-1',
      goalTitle: 'Cloud Infrastructure Migration',
      previousProgress: 78,
      currentProgress: 85,
      updateType: 'manual',
      updatedBy: 'Sarah Chen',
      updatedAt: '2024-01-15T10:30:00Z',
      comment: 'Completed server migration for production environment. All systems are stable and performance metrics are exceeding expectations.',
      achievements: ['Production deployment completed', 'Zero downtime achieved', 'Performance improved by 25%'],
      blockers: [],
      nextSteps: ['Begin data center consolidation', 'Implement monitoring alerts'],
      confidenceScore: 95,
      attachments: ['migration-report.pdf', 'performance-metrics.xlsx']
    },
    {
      id: 2,
      goalId: 'goal-2',
      goalTitle: 'Customer Satisfaction Score',
      previousProgress: 82,
      currentProgress: 88,
      updateType: 'automated',
      updatedBy: 'System',
      updatedAt: '2024-01-14T14:20:00Z',
      comment: 'Automated update from customer survey results. Significant improvement in response ratings.',
      achievements: ['Customer response rate increased to 78%', 'Average rating improved to 4.4/5'],
      blockers: [],
      nextSteps: ['Analyze feedback themes', 'Implement suggested improvements'],
      confidenceScore: 88,
      attachments: ['survey-results-jan.pdf']
    },
    {
      id: 3,
      goalId: 'goal-3',
      goalTitle: 'Brand Awareness Campaign',
      previousProgress: 42,
      currentProgress: 35,
      updateType: 'manual',
      updatedBy: 'David Kim',
      updatedAt: '2024-01-13T16:45:00Z',
      comment: 'Progress has slowed due to budget approval delays and creative review bottlenecks. Need management intervention.',
      achievements: ['Initial creative concepts approved'],
      blockers: ['Budget approval pending for 3 weeks', 'Creative review process taking too long', 'Key stakeholder unavailable'],
      nextSteps: ['Escalate budget approval', 'Schedule emergency stakeholder meeting'],
      confidenceScore: 45,
      attachments: []
    },
    {
      id: 4,
      goalId: 'goal-1',
      goalTitle: 'Cloud Infrastructure Migration',
      previousProgress: 65,
      currentProgress: 78,
      updateType: 'milestone',
      updatedBy: 'Sarah Chen',
      updatedAt: '2024-01-10T09:15:00Z',
      comment: 'Milestone: Development environment migration completed successfully. Ready to proceed with staging.',
      achievements: ['Dev environment fully migrated', 'All applications tested and verified', 'Team trained on new infrastructure'],
      blockers: [],
      nextSteps: ['Begin staging environment migration', 'Schedule production cutover'],
      confidenceScore: 90,
      attachments: ['dev-migration-summary.pdf']
    },
    {
      id: 5,
      goalId: 'goal-4',
      goalTitle: 'Talent Retention Program',
      previousProgress: 35,
      currentProgress: 28,
      updateType: 'manual',
      updatedBy: 'Emma Wilson',
      updatedAt: '2024-01-12T11:30:00Z',
      comment: 'Progress has regressed due to unexpected policy changes and compliance requirements. Timeline needs adjustment.',
      achievements: ['Initial employee survey completed'],
      blockers: ['New compliance requirements', 'Policy review taking longer than expected', 'Budget reallocation needed'],
      nextSteps: ['Meet with legal team', 'Revise program timeline', 'Request additional budget'],
      confidenceScore: 35,
      attachments: ['compliance-requirements.pdf']
    }
  ];

  const goals = [
    { id: 'all', title: 'All Goals' },
    { id: 'goal-1', title: 'Cloud Infrastructure Migration' },
    { id: 'goal-2', title: 'Customer Satisfaction Score' },
    { id: 'goal-3', title: 'Brand Awareness Campaign' },
    { id: 'goal-4', title: 'Talent Retention Program' }
  ];

  const filteredUpdates = progressUpdates.filter(update => {
    if (selectedGoal !== 'all' && update.goalId !== selectedGoal) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    if (sortBy === 'oldest') return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    return 0;
  });

  const getUpdateTypeColor = (type: string) => {
    switch (type) {
      case 'manual': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'automated': return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'milestone': return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
    }
  };

  const getProgressDirection = (previous: number, current: number) => {
    if (current > previous) return { icon: TrendingUp, color: 'text-green-400', text: 'increased' };
    if (current < previous) return { icon: TrendingDown, color: 'text-red-400', text: 'decreased' };
    return { icon: TrendingUp, color: 'text-slate-400', text: 'unchanged' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-100 flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Progress History Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={selectedGoal} onValueChange={setSelectedGoal}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select goal" />
              </SelectTrigger>
              <SelectContent>
                {goals.map(goal => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Progress Updates Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-100">Progress Update History</CardTitle>
          <CardDescription className="text-slate-400">
            Detailed timeline of all progress updates and changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredUpdates.map((update, index) => {
              const direction = getProgressDirection(update.previousProgress, update.currentProgress);
              const DirectionIcon = direction.icon;
              
              return (
                <div key={update.id} className="relative">
                  {/* Timeline connector */}
                  {index < filteredUpdates.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-px bg-slate-700" />
                  )}
                  
                  <div className="flex gap-4">
                    {/* Timeline dot */}
                    <div className="flex-shrink-0 w-12 h-12 glass-card rounded-full flex items-center justify-center border border-slate-600">
                      <DirectionIcon className={`h-5 w-5 ${direction.color}`} />
                    </div>
                    
                    {/* Update content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium text-slate-200">{update.goalTitle}</h4>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <User className="h-3 w-3" />
                            {update.updatedBy}
                            <span>•</span>
                            <Calendar className="h-3 w-3" />
                            {formatDate(update.updatedAt)}
                            <span>•</span>
                            <Badge className={getUpdateTypeColor(update.updateType)}>
                              {update.updateType}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-400">
                              {update.previousProgress}%
                            </span>
                            <DirectionIcon className={`h-4 w-4 ${direction.color}`} />
                            <span className="text-sm font-medium text-slate-200">
                              {update.currentProgress}%
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            Progress {direction.text} by {Math.abs(update.currentProgress - update.previousProgress)}%
                          </div>
                        </div>
                      </div>
                      
                      {/* Update details */}
                      <div className="glass-card p-4 rounded-lg border border-slate-700 space-y-3">
                        {update.comment && (
                          <div className="flex gap-2">
                            <MessageSquare className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-slate-300">{update.comment}</p>
                          </div>
                        )}
                        
                        {update.achievements.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-green-300 mb-2">Achievements</h5>
                            <ul className="space-y-1">
                              {update.achievements.map((achievement, i) => (
                                <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {update.blockers.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-red-300 mb-2">Blockers</h5>
                            <ul className="space-y-1">
                              {update.blockers.map((blocker, i) => (
                                <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                                  {blocker}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {update.nextSteps.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-blue-300 mb-2">Next Steps</h5>
                            <ul className="space-y-1">
                              {update.nextSteps.map((step, i) => (
                                <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                  {step}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <Clock className="h-3 w-3" />
                              Confidence: {update.confidenceScore}%
                            </div>
                            {update.attachments.length > 0 && (
                              <div className="text-xs text-slate-400">
                                {update.attachments.length} attachment{update.attachments.length > 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
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
    </div>
  );
}