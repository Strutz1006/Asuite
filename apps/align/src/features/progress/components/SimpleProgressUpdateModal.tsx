import { useState, useEffect } from 'react';
import { X, Save, Loader2, AlertCircle } from 'lucide-react';
import { useGoals } from '../../goals/hooks/useGoals';
import { supabase } from '@aesyros/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SimpleProgressUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalId?: string;
  onSuccess?: () => void;
}

export function SimpleProgressUpdateModal({ 
  isOpen, 
  onClose, 
  goalId, 
  onSuccess 
}: SimpleProgressUpdateModalProps) {
  const [selectedGoal, setSelectedGoal] = useState(goalId || '');
  const [progressValue, setProgressValue] = useState(0);
  const [currentValue, setCurrentValue] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { goals, updateGoalProgress } = useGoals();

  // Set initial values when goal is selected or modal opens
  useEffect(() => {
    if (goalId && goals.length > 0) {
      const goal = goals.find(g => g.id === goalId);
      if (goal) {
        setSelectedGoal(goalId);
        setProgressValue(goal.progress_percentage);
        setCurrentValue(goal.current_value || '');
      }
    }
  }, [goalId, goals]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      if (!goalId) {
        setSelectedGoal('');
        setProgressValue(0);
        setCurrentValue('');
      }
      setComment('');
      setSubmitting(false);
      setErrorMessage(null); // Clear error message when modal closes
    }
  }, [isOpen, goalId]);

  const selectedGoalData = goals.find(g => g.id === selectedGoal);

  const handleSubmit = async () => {
    if (!selectedGoal) {
      setErrorMessage('Please select a goal to update');
      return;
    }

    // Basic validation
    if (progressValue < 0 || progressValue > 100) {
      setErrorMessage('Progress percentage must be between 0 and 100');
      return;
    }

    if (selectedGoalData?.target_value && !currentValue.trim()) {
      setErrorMessage('Current value is required for this goal');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null); // Clear any previous errors

      // Update goal progress using the hook
      await updateGoalProgress(selectedGoal, progressValue, currentValue);

      // If there's a comment, also create a progress update record
      if (comment.trim()) {
        await supabase
          .from('align_progress_updates')
          .insert({
            objective_id: selectedGoal,
            value: currentValue,
            progress_percentage: progressValue,
            comment: comment.trim(),
            created_at: new Date().toISOString()
          });
      }

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }

      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error updating progress:', error);
      
      // Extract meaningful error message
      let message = 'Failed to update progress. Please try again.';
      
      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // Handle Supabase errors
        const supabaseError = error as any;
        if (supabaseError.message) {
          message = supabaseError.message;
        } else if (supabaseError.error?.message) {
          message = supabaseError.error.message;
        }
      }
      
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-md w-full border border-slate-600">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-100">Update Progress</h2>
              <p className="text-slate-400 text-sm mt-1">
                Submit a progress update
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={submitting}
              className="glass-button text-slate-400 hover:text-slate-300 p-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Error Message */}
            {errorMessage && (
              <Alert className="border-red-500/20 bg-red-500/10 relative">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <AlertDescription className="text-red-400 flex-1">
                    {errorMessage}
                  </AlertDescription>
                  <button
                    type="button"
                    onClick={() => setErrorMessage(null)}
                    className="text-red-400 hover:text-red-300 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </Alert>
            )}

            {/* Goal Selection */}
            {!goalId && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Select Goal</label>
                <select
                  value={selectedGoal}
                  onChange={(e) => {
                    setSelectedGoal(e.target.value);
                    const goal = goals.find(g => g.id === e.target.value);
                    if (goal) {
                      setProgressValue(goal.progress_percentage);
                      setCurrentValue(goal.current_value || '');
                    }
                  }}
                  className="w-full px-3 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  disabled={submitting}
                >
                  <option value="">Choose a goal...</option>
                  {goals.map(goal => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {selectedGoalData && (
              <div className="glass-card p-3 bg-slate-800/30">
                <h3 className="font-medium text-slate-200 text-sm">{selectedGoalData.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>Current: {selectedGoalData.progress_percentage}%</span>
                  {selectedGoalData.target_value && (
                    <>
                      <span>•</span>
                      <span>Target: {selectedGoalData.target_value}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {selectedGoal && (
              <>
                {/* Progress Update */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">Progress Percentage</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progressValue}
                      onChange={(e) => setProgressValue(Number(e.target.value))}
                      className="flex-1"
                      disabled={submitting}
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={progressValue}
                        onChange={(e) => setProgressValue(Number(e.target.value))}
                        className="w-16 px-2 py-1 text-slate-200 bg-slate-800/50 border border-slate-600 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                        disabled={submitting}
                      />
                      <span className="text-slate-400 text-sm">%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressValue}%` }}
                    />
                  </div>
                  {selectedGoalData && (
                    <div className="text-xs text-slate-400">
                      Change: {progressValue > selectedGoalData.progress_percentage ? '+' : ''}{progressValue - selectedGoalData.progress_percentage}%
                    </div>
                  )}
                </div>

                {/* Current Value */}
                {selectedGoalData?.target_value && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">
                      Current Value {selectedGoalData.unit && `(${selectedGoalData.unit})`}
                    </label>
                    <input
                      type="text"
                      value={currentValue}
                      onChange={(e) => setCurrentValue(e.target.value)}
                      placeholder={`Target: ${selectedGoalData.target_value}`}
                      className="w-full px-3 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                      disabled={submitting}
                    />
                  </div>
                )}

                {/* Comment */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">Comment (Optional)</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe the progress made..."
                    rows={3}
                    className="w-full px-3 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    disabled={submitting}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                  <button
                    onClick={onClose}
                    disabled={submitting}
                    className="glass-button text-slate-300 hover:text-slate-200 px-4 py-2 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="glass-button text-sky-300 hover:text-sky-200 px-4 py-2 flex items-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Update Progress
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}