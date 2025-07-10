import React, { useState } from 'react';
import { GlassCard, Icon } from '../../shared/components';

interface CollaborationUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'viewer' | 'editor' | 'admin';
  status: 'online' | 'offline' | 'away';
  lastActive: string;
  currentScenario?: string;
  cursor?: {
    x: number;
    y: number;
    element: string;
  };
}

interface LiveEdit {
  id: string;
  user: CollaborationUser;
  action: 'editing' | 'commenting' | 'viewing';
  element: string;
  timestamp: string;
  changes?: {
    field: string;
    oldValue: string | number;
    newValue: string | number;
  };
}

interface Comment {
  id: string;
  user: CollaborationUser;
  content: string;
  timestamp: string;
  elementId: string;
  resolved: boolean;
  replies?: Comment[];
}

const mockUsers: CollaborationUser[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@acme.corp',
    avatar: 'SC',
    role: 'admin',
    status: 'online',
    lastActive: '2024-01-15T10:30:00Z',
    currentScenario: 'Q1 Growth Analysis',
    cursor: { x: 45, y: 62, element: 'marketing-budget-slider' }
  },
  {
    id: 'user-2',
    name: 'David Rodriguez',
    email: 'david.rodriguez@acme.corp',
    avatar: 'DR',
    role: 'editor',
    status: 'online',
    lastActive: '2024-01-15T10:28:00Z',
    currentScenario: 'Q1 Growth Analysis'
  },
  {
    id: 'user-3',
    name: 'Emily Johnson',
    email: 'emily.johnson@acme.corp',
    avatar: 'EJ',
    role: 'viewer',
    status: 'away',
    lastActive: '2024-01-15T09:45:00Z'
  },
  {
    id: 'user-4',
    name: 'Michael Kim',
    email: 'michael.kim@acme.corp',
    avatar: 'MK',
    role: 'editor',
    status: 'offline',
    lastActive: '2024-01-14T17:30:00Z'
  }
];

const mockLiveEdits: LiveEdit[] = [
  {
    id: 'edit-1',
    user: mockUsers[0],
    action: 'editing',
    element: 'Marketing Budget Slider',
    timestamp: '2024-01-15T10:30:00Z',
    changes: {
      field: 'marketing-budget',
      oldValue: 2500000,
      newValue: 3200000
    }
  },
  {
    id: 'edit-2',
    user: mockUsers[1],
    action: 'commenting',
    element: 'ROI Projection Chart',
    timestamp: '2024-01-15T10:28:00Z'
  },
  {
    id: 'edit-3',
    user: mockUsers[0],
    action: 'viewing',
    element: 'Sensitivity Analysis Results',
    timestamp: '2024-01-15T10:25:00Z'
  }
];

const mockComments: Comment[] = [
  {
    id: 'comment-1',
    user: mockUsers[1],
    content: 'The ROI projection looks optimistic. Have we factored in the increased competition in Q2?',
    timestamp: '2024-01-15T10:28:00Z',
    elementId: 'roi-chart',
    resolved: false,
    replies: [
      {
        id: 'reply-1',
        user: mockUsers[0],
        content: 'Good point. Let me adjust the market competition factor and re-run the simulation.',
        timestamp: '2024-01-15T10:29:00Z',
        elementId: 'roi-chart',
        resolved: false
      }
    ]
  },
  {
    id: 'comment-2',
    user: mockUsers[2],
    content: 'Should we consider a more conservative approach for the first quarter?',
    timestamp: '2024-01-15T09:45:00Z',
    elementId: 'growth-strategy',
    resolved: true
  }
];

const CollaborationPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [_shareModalOpen, setShareModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-slate-500';
      default: return 'bg-slate-500';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-400 bg-red-500/20';
      case 'editor': return 'text-blue-400 bg-blue-500/20';
      case 'viewer': return 'text-green-400 bg-green-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">Real-Time Collaboration</h2>
          <p className="text-slate-400 mt-2">Multi-user editing with live updates, comments, and version control</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShareModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
          >
            <Icon path="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" className="w-4 h-4" />
            Share Scenario
          </button>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-slate-400">Live Session Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Live Users Panel */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-sky-300 flex items-center gap-2">
              <Icon path="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" className="w-6 h-6" />
              Active Users ({mockUsers.filter(u => u.status === 'online').length})
            </h3>

            <div className="space-y-3">
              {mockUsers.map((user) => (
                <div 
                  key={user.id} 
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedUser === user.id ? 'bg-sky-500/20 border border-sky-500/50' : 'bg-slate-800/50 hover:bg-slate-800/70'
                  }`}
                  onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">{user.avatar}</span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-slate-800`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white truncate">{user.name}</div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                          {user.role.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-400 capitalize">{user.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  {user.currentScenario && (
                    <div className="mt-2 text-xs text-slate-400">
                      Working on: <span className="text-sky-400">{user.currentScenario}</span>
                    </div>
                  )}
                  
                  {selectedUser === user.id && (
                    <div className="mt-3 pt-3 border-t border-slate-600 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Email:</span>
                        <span className="text-slate-300">{user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Last Active:</span>
                        <span className="text-slate-300">{new Date(user.lastActive).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Live Activity Feed */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-sky-300">Live Activity</h3>
            
            <div className="space-y-3">
              {mockLiveEdits.map((edit) => (
                <div key={edit.id} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-xs">{edit.user.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300">
                      <span className="font-medium text-white">{edit.user.name}</span>
                      {' '}
                      <span className={`${
                        edit.action === 'editing' ? 'text-yellow-400' :
                        edit.action === 'commenting' ? 'text-blue-400' : 'text-green-400'
                      }`}>
                        {edit.action}
                      </span>
                      {' '}
                      <span className="text-slate-400">{edit.element}</span>
                    </p>
                    {edit.changes && (
                      <p className="text-xs text-slate-500 mt-1">
                        {edit.changes.field}: {
                          typeof edit.changes.oldValue === 'number' && edit.changes.oldValue > 1000 
                            ? formatCurrency(edit.changes.oldValue) 
                            : edit.changes.oldValue
                        } → {
                          typeof edit.changes.newValue === 'number' && edit.changes.newValue > 1000 
                            ? formatCurrency(edit.changes.newValue) 
                            : edit.changes.newValue
                        }
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(edit.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Main Collaboration Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Collaborative Scenario Editor */}
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-sky-300">Q1 Growth Analysis - Live Edit Session</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowComments(!showComments)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    showComments ? 'bg-sky-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Icon path="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" className="w-4 h-4" />
                  Comments ({mockComments.filter(c => !c.resolved).length})
                </button>
              </div>
            </div>

            {/* Live Cursors Overlay */}
            <div className="relative bg-slate-800/50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-white mb-4">Business Levers - Live Editing</h4>
              
              {/* Mock scenario editing interface with live cursors */}
              <div className="space-y-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Marketing Budget</label>
                  <div className="relative">
                    <input 
                      type="range" 
                      min="1000000" 
                      max="5000000" 
                      defaultValue="3200000"
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    {/* Live cursor indicator */}
                    <div className="absolute -top-8 left-1/3 flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">S</span>
                      </div>
                      <div className="bg-red-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                        Sarah is editing
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>$1M</span>
                    <span className="text-red-400 font-mono">$3.2M (Sarah's edit)</span>
                    <span>$5M</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Sales Team Size</label>
                  <input 
                    type="range" 
                    min="30" 
                    max="80" 
                    defaultValue="45"
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>30</span>
                    <span>45 people</span>
                    <span>80</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Product Price</label>
                  <input 
                    type="range" 
                    min="199" 
                    max="499" 
                    defaultValue="299"
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>$199</span>
                    <span>$299</span>
                    <span>$499</span>
                  </div>
                </div>
              </div>

              {/* Real-time results preview */}
              <div className="mt-6 pt-6 border-t border-slate-600">
                <h5 className="font-medium text-white mb-3">Live Results Preview</h5>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-slate-900/50 rounded">
                    <div className="text-lg font-bold text-green-400">+18.7%</div>
                    <div className="text-xs text-slate-400">Revenue Growth</div>
                    <div className="text-xs text-red-400 mt-1">↑ Sarah's edit: +2.3%</div>
                  </div>
                  <div className="text-center p-3 bg-slate-900/50 rounded">
                    <div className="text-lg font-bold text-yellow-400">84%</div>
                    <div className="text-xs text-slate-400">Success Probability</div>
                  </div>
                  <div className="text-center p-3 bg-slate-900/50 rounded">
                    <div className="text-lg font-bold text-blue-400">$5.2M</div>
                    <div className="text-xs text-slate-400">Projected Revenue</div>
                    <div className="text-xs text-red-400 mt-1">↑ Sarah's edit: +$420K</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-save indicator */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-400">Auto-saved 2 seconds ago</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-sky-400 hover:text-sky-300">View Version History</button>
                <button className="text-sky-400 hover:text-sky-300">Export Snapshot</button>
              </div>
            </div>
          </GlassCard>

          {/* Comments Section */}
          {showComments && (
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-sky-300">Comments & Discussions</h3>
              
              <div className="space-y-6">
                {mockComments.map((comment) => (
                  <div key={comment.id} className={`p-4 rounded-lg ${comment.resolved ? 'bg-green-500/10 border border-green-500/30' : 'bg-slate-800/50'}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">{comment.user.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-white">{comment.user.name}</span>
                          <span className="text-xs text-slate-400">{new Date(comment.timestamp).toLocaleString()}</span>
                          <span className="text-xs text-slate-500">on {comment.elementId}</span>
                          {comment.resolved && (
                            <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">Resolved</span>
                          )}
                        </div>
                        <p className="text-slate-300 text-sm mb-3">{comment.content}</p>
                        
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ml-4 pl-4 border-l border-slate-600 space-y-3">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white font-semibold text-xs">{reply.user.avatar}</span>
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-white text-sm">{reply.user.name}</span>
                                    <span className="text-xs text-slate-400">{new Date(reply.timestamp).toLocaleString()}</span>
                                  </div>
                                  <p className="text-slate-300 text-sm">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3 mt-3">
                          <button className="text-xs text-sky-400 hover:text-sky-300">Reply</button>
                          {!comment.resolved && (
                            <button className="text-xs text-green-400 hover:text-green-300">Mark Resolved</button>
                          )}
                          <button className="text-xs text-slate-500 hover:text-slate-400">Edit</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add new comment */}
              <div className="mt-6 pt-6 border-t border-slate-600">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">JD</span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none resize-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-slate-500">@mention team members to notify them</span>
                      <button 
                        disabled={!newComment.trim()}
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-lg transition-colors text-sm"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Permissions & Sharing */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-sky-300">Scenario Permissions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Icon path="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" className="w-4 h-4" />
                  Viewers (2)
                </h4>
                <p className="text-sm text-slate-400 mb-3">Can view scenario and results</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">EJ</span>
                    </div>
                    <span className="text-sm text-slate-300">Emily Johnson</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Icon path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" className="w-4 h-4" />
                  Editors (2)
                </h4>
                <p className="text-sm text-slate-400 mb-3">Can edit scenario parameters</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">DR</span>
                    </div>
                    <span className="text-sm text-slate-300">David Rodriguez</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">MK</span>
                    </div>
                    <span className="text-sm text-slate-300">Michael Kim</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Icon path="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" className="w-4 h-4" />
                  Admins (1)
                </h4>
                <p className="text-sm text-slate-400 mb-3">Full control & permissions</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">SC</span>
                    </div>
                    <span className="text-sm text-slate-300">Sarah Chen</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors">
                <Icon path="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" className="w-4 h-4" />
                Invite Users
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                <Icon path="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" className="w-4 h-4" />
                Copy Share Link
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                <Icon path="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" className="w-4 h-4" />
                Manage Permissions
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default CollaborationPage;