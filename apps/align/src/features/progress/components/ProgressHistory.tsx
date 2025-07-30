import { useState, useEffect } from 'react';
import { supabase } from '@aesyros/supabase';
import { Calendar, TrendingUp, TrendingDown, User, MessageSquare, Clock, Filter, Loader2 } from 'lucide-react';
import { Goal } from '../../goals/hooks/useGoals';

interface ProgressHistoryProps {
  filterPeriod: string;
  filterDepartment: string;
  goals: Goal[];
}

interface ProgressUpdate {
  id: string;
  objective_id: string;
  value?: string;
  progress_percentage: number;
  comment?: string;
  created_at: string;
  objective?: {
    title: string;
    owner_id?: string;
    department_id?: string;
  };
}

export function ProgressHistory({ filterPeriod, filterDepartment, goals }: ProgressHistoryProps) {
  const [selectedGoal, setSelectedGoal] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch progress updates from database
  useEffect(() => {
    const fetchProgressUpdates = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('align_progress_updates')
          .select(`
            *,
            objective:align_objectives(
              title,
              owner_id,
              department_id
            )
          `)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        setProgressUpdates(data || []);
      } catch (error) {
        console.error('Error fetching progress updates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressUpdates();
  }, []);

  const goalOptions = [
    { id: 'all', title: 'All Goals' },
    ...goals.map(goal => ({ id: goal.id, title: goal.title }))
  ];

  const filteredUpdates = progressUpdates.filter(update => {
    if (selectedGoal !== 'all' && update.objective_id !== selectedGoal) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    return 0;
  });

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'text-green-400';
    if (progress >= 70) return 'text-green-400';
    if (progress >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressIcon = (progress: number) => {
    if (progress >= 70) return { icon: TrendingUp, color: 'text-green-400' };
    return { icon: TrendingDown, color: 'text-red-400' };
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 text-sky-400 animate-spin" />
          <span className="text-slate-300">Loading progress history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="h-5 w-5 text-sky-400" />
          <h3 className="text-lg font-semibold text-slate-100">Progress History Filters</h3>
        </div>
        <div className="flex gap-4">
          <select
            value={selectedGoal}
            onChange={(e) => setSelectedGoal(e.target.value)}
            className="glass-card px-3 py-2 text-slate-200 bg-transparent border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          >
            {goalOptions.map(goal => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="glass-card px-3 py-2 text-slate-200 bg-transparent border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Progress Updates Timeline */}
      <div className="glass-card p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-slate-100">Progress Update History</h3>
          <p className="text-slate-400 text-sm mt-1">
            Detailed timeline of all progress updates and changes
          </p>
        </div>
        {filteredUpdates.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No progress updates found</p>
            <p className="text-slate-500 text-sm mt-1">Updates will appear here as goals progress</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredUpdates.map((update, index) => {
              const progressInfo = getProgressIcon(update.progress_percentage);
              const ProgressIcon = progressInfo.icon;
              
              return (
                <div key={update.id} className="relative">
                  {/* Timeline connector */}
                  {index < filteredUpdates.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-px bg-slate-700" />
                  )}
                  
                  <div className="flex gap-4">
                    {/* Timeline dot */}
                    <div className="flex-shrink-0 w-12 h-12 glass-card rounded-full flex items-center justify-center border border-slate-600">
                      <ProgressIcon className={`h-5 w-5 ${progressInfo.color}`} />
                    </div>
                    
                    {/* Update content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium text-slate-200">{update.objective?.title || 'Unknown Goal'}</h4>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <User className="h-3 w-3" />
                            {update.objective?.owner_id || 'System'}
                            <span>•</span>
                            <Calendar className="h-3 w-3" />
                            {formatDate(update.created_at)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium px-2 py-1 rounded ${getProgressColor(update.progress_percentage)} bg-slate-800/50`}>
                            {update.progress_percentage}%
                          </div>
                          {update.value && (
                            <div className="text-xs text-slate-400 mt-1">
                              Value: {update.value}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Update details */}
                      {update.comment && (
                        <div className="glass-card p-4 rounded-lg border border-slate-700">
                          <div className="flex gap-2">
                            <MessageSquare className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-slate-300">{update.comment}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}