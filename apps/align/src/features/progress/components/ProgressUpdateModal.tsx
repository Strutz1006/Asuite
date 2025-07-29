import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { X, Upload, Plus, Minus, Save } from 'lucide-react';

interface ProgressUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function ProgressUpdateModal({ isOpen, onClose, onSubmit }: ProgressUpdateModalProps) {
  const [selectedGoal, setSelectedGoal] = useState('');
  const [progressValue, setProgressValue] = useState(0);
  const [comment, setComment] = useState('');
  const [achievements, setAchievements] = useState(['']);
  const [blockers, setBlockers] = useState(['']);
  const [nextSteps, setNextSteps] = useState(['']);
  const [confidenceScore, setConfidenceScore] = useState(75);
  const [attachments, setAttachments] = useState<File[]>([]);

  // Mock goals data
  const goals = [
    {
      id: 'goal-1',
      title: 'Cloud Infrastructure Migration',
      currentProgress: 85,
      department: 'Engineering',
      owner: 'Sarah Chen'
    },
    {
      id: 'goal-2',
      title: 'Customer Satisfaction Score',
      currentProgress: 88,
      department: 'Sales',
      owner: 'Mike Johnson'
    },
    {
      id: 'goal-3',
      title: 'Brand Awareness Campaign',
      currentProgress: 35,
      department: 'Marketing',
      owner: 'David Kim'
    },
    {
      id: 'goal-4',
      title: 'Talent Retention Program',
      currentProgress: 28,
      department: 'Human Resources',
      owner: 'Emma Wilson'
    }
  ];

  const selectedGoalData = goals.find(g => g.id === selectedGoal);

  const handleSubmit = () => {
    const updateData = {
      goalId: selectedGoal,
      progressValue,
      comment,
      achievements: achievements.filter(a => a.trim() !== ''),
      blockers: blockers.filter(b => b.trim() !== ''),
      nextSteps: nextSteps.filter(n => n.trim() !== ''),
      confidenceScore,
      attachments
    };
    onSubmit(updateData);
  };

  const addListItem = (list: string[], setList: (items: string[]) => void) => {
    setList([...list, '']);
  };

  const removeListItem = (list: string[], setList: (items: string[]) => void, index: number) => {
    if (list.length > 1) {
      setList(list.filter((_, i) => i !== index));
    }
  };

  const updateListItem = (list: string[], setList: (items: string[]) => void, index: number, value: string) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-600">
        <Card className="border-0 bg-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-slate-100">Update Progress</CardTitle>
              <CardDescription className="text-slate-400">
                Submit a detailed progress update with achievements, blockers, and next steps
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Goal Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Select Goal</label>
              <select
                value={selectedGoal}
                onChange={(e) => {
                  setSelectedGoal(e.target.value);
                  const goal = goals.find(g => g.id === e.target.value);
                  if (goal) setProgressValue(goal.currentProgress);
                }}
                className="w-full glass-input px-3 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              >
                <option value="">Choose a goal...</option>
                {goals.map(goal => (
                  <option key={goal.id} value={goal.id}>
                    {goal.title} ({goal.department})
                  </option>
                ))}
              </select>
              
              {selectedGoalData && (
                <div className="flex items-center gap-2 text-sm text-slate-400 mt-2">
                  <span>Current progress: {selectedGoalData.currentProgress}%</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedGoalData.department}
                  </Badge>
                  <span>•</span>
                  <span>Owner: {selectedGoalData.owner}</span>
                </div>
              )}
            </div>

            {selectedGoal && (
              <>
                {/* Progress Update */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-200">New Progress Value</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={progressValue}
                        onChange={(e) => setProgressValue(Number(e.target.value))}
                        className="flex-1"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={progressValue}
                        onChange={(e) => setProgressValue(Number(e.target.value))}
                        className="w-20 glass-input px-2 py-1 text-slate-200 bg-slate-800/50 border border-slate-600 rounded text-center"
                      />
                      <span className="text-slate-400">%</span>
                    </div>
                    <Progress value={progressValue} className="w-full" />
                    {selectedGoalData && (
                      <div className="text-sm text-slate-400">
                        Change: {progressValue > selectedGoalData.currentProgress ? '+' : ''}{progressValue - selectedGoalData.currentProgress}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">Progress Comment</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe the progress made, current status, and any important updates..."
                    rows={4}
                    className="w-full glass-input px-3 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                </div>

                {/* Achievements */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-200">Achievements</label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addListItem(achievements, setAchievements)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={achievement}
                          onChange={(e) => updateListItem(achievements, setAchievements, index, e.target.value)}
                          placeholder="What was accomplished?"
                          className="flex-1 glass-input px-3 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                        />
                        {achievements.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeListItem(achievements, setAchievements, index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Blockers */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-200">Blockers</label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addListItem(blockers, setBlockers)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {blockers.map((blocker, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={blocker}
                          onChange={(e) => updateListItem(blockers, setBlockers, index, e.target.value)}
                          placeholder="What's blocking progress?"
                          className="flex-1 glass-input px-3 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                        />
                        {blockers.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeListItem(blockers, setBlockers, index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Steps */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-200">Next Steps</label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addListItem(nextSteps, setNextSteps)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {nextSteps.map((step, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={step}
                          onChange={(e) => updateListItem(nextSteps, setNextSteps, index, e.target.value)}
                          placeholder="What's planned next?"
                          className="flex-1 glass-input px-3 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                        />
                        {nextSteps.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeListItem(nextSteps, setNextSteps, index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confidence Score */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-200">Confidence Score</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={confidenceScore}
                        onChange={(e) => setConfidenceScore(Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-slate-200 font-medium min-w-[3rem]">
                        {confidenceScore}%
                      </span>
                    </div>
                    <div className="text-sm text-slate-400">
                      How confident are you that this goal will be completed on time?
                    </div>
                  </div>
                </div>

                {/* Attachments */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-200">Attachments</label>
                  <div className="glass-card p-4 border-2 border-dashed border-slate-600 rounded-lg text-center">
                    <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-400 mb-2">
                      Drop files here or click to browse
                    </p>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      id="file-upload"
                      onChange={(e) => {
                        if (e.target.files) {
                          setAttachments(Array.from(e.target.files));
                        }
                      }}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" size="sm" className="cursor-pointer">
                        Choose Files
                      </Button>
                    </label>
                  </div>
                  {attachments.length > 0 && (
                    <div className="space-y-1">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between text-sm text-slate-300">
                          <span>{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    <Save className="h-4 w-4 mr-2" />
                    Submit Update
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}