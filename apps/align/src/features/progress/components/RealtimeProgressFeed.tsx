import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@aesyros/supabase';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  User, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface ProgressUpdate {
  id: string;
  objective_id: string;
  value?: string;
  progress_percentage: number;
  comment?: string;
  created_at: string;
  updated_at: string;
  objective?: {
    title: string;
    owner_id?: string;
    department_id?: string;
  };
}

interface RealtimeProgressFeedProps {
  maxUpdates?: number;
  showControls?: boolean;
}

export function RealtimeProgressFeed({ 
  maxUpdates = 10, 
  showControls = true 
}: RealtimeProgressFeedProps) {
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial progress updates
  const fetchProgressUpdates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
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
        .limit(maxUpdates);

      if (fetchError) throw fetchError;

      setUpdates(data || []);
    } catch (err) {
      console.error('Error fetching progress updates:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch updates');
    } finally {
      setLoading(false);
    }
  }, [maxUpdates]);

  // Handle real-time progress updates
  const handleRealtimeProgressUpdate = useCallback((payload: RealtimePostgresChangesPayload<any>) => {
    console.log('Real-time progress update:', payload);

    if (payload.eventType === 'INSERT') {
      const newUpdate = payload.new as ProgressUpdate;
      
      setUpdates(prev => {
        // Add new update and keep only the most recent ones
        const updated = [newUpdate, ...prev].slice(0, maxUpdates);
        return updated;
      });

      // Show a brief notification (could be enhanced with a toast system)
      console.log(`Progress updated: ${newUpdate.progress_percentage}%`);
    }
  }, [maxUpdates]);

  // Handle real-time objective updates to refresh data
  const handleRealtimeObjectiveUpdate = useCallback((payload: RealtimePostgresChangesPayload<any>) => {
    console.log('Real-time objective update:', payload);
    
    if (payload.eventType === 'UPDATE') {
      // Refresh the updates to get latest objective data
      fetchProgressUpdates();
    }
  }, [fetchProgressUpdates]);

  // Set up real-time subscriptions
  useEffect(() => {
    fetchProgressUpdates();

    // Subscribe to progress updates
    const progressSubscription = supabase
      .channel('progress_updates_feed')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'align_progress_updates'
        },
        handleRealtimeProgressUpdate
      )
      .subscribe((status) => {
        console.log('Progress updates subscription status:', status);
        setConnected(status === 'SUBSCRIBED');
      });

    // Subscribe to objective updates to refresh data
    const objectiveSubscription = supabase
      .channel('objectives_for_progress_feed')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'align_objectives'
        },
        handleRealtimeObjectiveUpdate
      )
      .subscribe();

    return () => {
      progressSubscription.unsubscribe();
      objectiveSubscription.unsubscribe();
    };
  }, [handleRealtimeProgressUpdate, handleRealtimeObjectiveUpdate, fetchProgressUpdates]);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const updateTime = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - updateTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getProgressIcon = (progress: number) => {
    if (progress >= 100) return <CheckCircle className="h-4 w-4 text-green-400" />;
    if (progress >= 70) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (progress >= 40) return <Target className="h-4 w-4 text-yellow-400" />;
    return <AlertCircle className="h-4 w-4 text-red-400" />;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'text-green-400 bg-green-500/10';
    if (progress >= 70) return 'text-green-400 bg-green-500/10';
    if (progress >= 40) return 'text-yellow-400 bg-yellow-500/10';
    return 'text-red-400 bg-red-500/10';
  };

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="h-5 w-5 text-sky-400" />
          <h3 className="text-lg font-semibold text-slate-100">Live Progress Updates</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 text-sky-400 animate-spin" />
          <span className="ml-2 text-slate-300">Loading updates...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-sky-400" />
          <h3 className="text-lg font-semibold text-slate-100">Live Progress Updates</h3>
          <div className="flex items-center gap-2">
            {connected ? (
              <Wifi className="h-4 w-4 text-green-400" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-400" />
            )}
            <span className={`text-xs ${connected ? 'text-green-400' : 'text-red-400'}`}>
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {showControls && (
          <button
            onClick={fetchProgressUpdates}
            className="glass-button text-slate-300 hover:text-slate-200 p-2"
            title="Refresh updates"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        </div>
      )}

      {/* Updates List */}
      {updates.length === 0 ? (
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-400">No recent progress updates</p>
          <p className="text-slate-500 text-sm mt-1">Updates will appear here in real-time</p>
        </div>
      ) : (
        <div className="space-y-4">
          {updates.map((update, index) => (
            <div 
              key={update.id} 
              className={`flex items-start gap-3 p-4 rounded-lg transition-all duration-500 ${
                index === 0 ? 'bg-sky-500/5 border border-sky-500/20' : 'bg-slate-800/30'
              }`}
            >
              {/* Progress Icon */}
              <div className="flex-shrink-0 w-8 h-8 glass-card rounded-full flex items-center justify-center">
                {getProgressIcon(update.progress_percentage)}
              </div>

              {/* Update Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-200 truncate">
                      {update.objective?.title || 'Unknown Goal'}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                      <User className="h-3 w-3" />
                      <span>{update.objective?.owner_id || 'System'}</span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(update.created_at)}</span>
                    </div>
                    {update.comment && (
                      <p className="text-sm text-slate-300 mt-2 line-clamp-2">
                        {update.comment}
                      </p>
                    )}
                  </div>

                  {/* Progress Badge */}
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getProgressColor(update.progress_percentage)}`}>
                    {update.progress_percentage}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {updates.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-400 text-center">
            Showing {updates.length} most recent updates • Updates refresh automatically
          </p>
        </div>
      )}
    </div>
  );
}