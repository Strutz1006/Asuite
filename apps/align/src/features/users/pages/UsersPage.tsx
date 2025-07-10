import React, { useState } from 'react';
import { GlassCard, Icon } from '../../shared/components';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'manager' | 'contributor' | 'viewer';
  department: string;
  jobTitle: string;
  managerId?: string;
  avatarUrl?: string;
  lastActive: Date;
  status: 'active' | 'inactive' | 'pending';
  objectives: {
    total: number;
    completed: number;
    onTrack: number;
    atRisk: number;
  };
}

const mockUsers: User[] = [
  {
    id: '1',
    fullName: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'admin',
    department: 'Operations',
    jobTitle: 'VP of Operations',
    lastActive: new Date('2024-07-10T09:30:00'),
    status: 'active',
    objectives: { total: 8, completed: 2, onTrack: 5, atRisk: 1 }
  },
  {
    id: '2',
    fullName: 'Mike Torres',
    email: 'mike.torres@company.com',
    role: 'manager',
    department: 'R&D',
    jobTitle: 'R&D Director',
    lastActive: new Date('2024-07-10T08:15:00'),
    status: 'active',
    objectives: { total: 6, completed: 1, onTrack: 4, atRisk: 1 }
  },
  {
    id: '3',
    fullName: 'Lisa Park',
    email: 'lisa.park@company.com',
    role: 'manager',
    department: 'Facilities',
    jobTitle: 'Facilities Manager',
    managerId: '1',
    lastActive: new Date('2024-07-09T17:45:00'),
    status: 'active',
    objectives: { total: 4, completed: 0, onTrack: 2, atRisk: 2 }
  },
  {
    id: '4',
    fullName: 'Alex Kim',
    email: 'alex.kim@company.com',
    role: 'contributor',
    department: 'Operations',
    jobTitle: 'Energy Specialist',
    managerId: '3',
    lastActive: new Date('2024-07-10T10:00:00'),
    status: 'active',
    objectives: { total: 3, completed: 1, onTrack: 2, atRisk: 0 }
  },
  {
    id: '5',
    fullName: 'Jordan Lee',
    email: 'jordan.lee@company.com',
    role: 'contributor',
    department: 'R&D',
    jobTitle: 'Materials Researcher',
    managerId: '2',
    lastActive: new Date('2024-07-08T16:20:00'),
    status: 'active',
    objectives: { total: 2, completed: 0, onTrack: 1, atRisk: 1 }
  },
  {
    id: '6',
    fullName: 'Sam Rivera',
    email: 'sam.rivera@company.com',
    role: 'contributor',
    department: 'Marketing',
    jobTitle: 'Marketing Specialist',
    lastActive: new Date('2024-07-10T11:30:00'),
    status: 'active',
    objectives: { total: 2, completed: 1, onTrack: 1, atRisk: 0 }
  },
  {
    id: '7',
    fullName: 'Emily Watson',
    email: 'emily.watson@company.com',
    role: 'viewer',
    department: 'Finance',
    jobTitle: 'Financial Analyst',
    lastActive: new Date('2024-07-07T14:10:00'),
    status: 'pending',
    objectives: { total: 0, completed: 0, onTrack: 0, atRisk: 0 }
  }
];

const UsersPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'list' | 'org-chart'>('list');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const departments = Array.from(new Set(mockUsers.map(user => user.department)));
  
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || user.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-400 bg-red-500/20';
      case 'manager': return 'text-purple-400 bg-purple-500/20';
      case 'contributor': return 'text-blue-400 bg-blue-500/20';
      case 'viewer': return 'text-green-400 bg-green-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'inactive': return 'text-slate-400 bg-slate-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const buildOrgChart = () => {
    const userMap = new Map(mockUsers.map(user => [user.id, user]));
    const tree: { user: User; children: any[] }[] = [];
    
    // Find root users (no manager)
    const rootUsers = mockUsers.filter(user => !user.managerId);
    
    const buildSubtree = (userId: string): any => {
      const user = userMap.get(userId);
      if (!user) return null;
      
      const children = mockUsers
        .filter(u => u.managerId === userId)
        .map(child => buildSubtree(child.id))
        .filter(Boolean);
      
      return { user, children };
    };

    return rootUsers.map(user => buildSubtree(user.id)).filter(Boolean);
  };

  const renderOrgNode = (node: { user: User; children: any[] }, depth: number = 0) => {
    const { user, children } = node;
    
    return (
      <div key={user.id} className="space-y-4">
        <div className={`${depth > 0 ? 'ml-8' : ''} relative`}>
          {depth > 0 && (
            <div className="absolute -left-8 top-6 w-6 h-px bg-slate-600"></div>
          )}
          {depth > 0 && (
            <div className="absolute -left-8 top-0 w-px h-6 bg-slate-600"></div>
          )}
          
          <GlassCard className="p-4 w-80">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user.fullName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">{user.fullName}</h3>
                <p className="text-sm text-slate-400">{user.jobTitle}</p>
                <p className="text-xs text-slate-500">{user.department}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                {user.role.toUpperCase()}
              </div>
            </div>
            
            <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
              <div>
                <div className="font-bold text-sky-400">{user.objectives.total}</div>
                <div className="text-slate-500">Total</div>
              </div>
              <div>
                <div className="font-bold text-green-400">{user.objectives.onTrack}</div>
                <div className="text-slate-500">On Track</div>
              </div>
              <div>
                <div className="font-bold text-yellow-400">{user.objectives.atRisk}</div>
                <div className="text-slate-500">At Risk</div>
              </div>
              <div>
                <div className="font-bold text-blue-400">{user.objectives.completed}</div>
                <div className="text-slate-500">Done</div>
              </div>
            </div>
          </GlassCard>
        </div>
        
        {children.length > 0 && (
          <div className="space-y-4">
            {children.map(child => renderOrgNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-100">Team Management</h2>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setSelectedTab('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === 'list' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              User List
            </button>
            <button
              onClick={() => setSelectedTab('org-chart')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === 'org-chart' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Org Chart
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors">
            <Icon path="M12 4v16m8-8H4" className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-sky-300">Team Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-sky-400 mb-1">{mockUsers.length}</div>
            <div className="text-sm text-slate-400">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">
              {mockUsers.filter(u => u.status === 'active').length}
            </div>
            <div className="text-sm text-slate-400">Active</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {mockUsers.filter(u => u.role === 'manager' || u.role === 'admin').length}
            </div>
            <div className="text-sm text-slate-400">Managers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-1">{departments.length}</div>
            <div className="text-sm text-slate-400">Departments</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-1">
              {mockUsers.reduce((sum, u) => sum + u.objectives.total, 0)}
            </div>
            <div className="text-sm text-slate-400">Total Objectives</div>
          </div>
        </div>
      </GlassCard>

      {selectedTab === 'list' && (
        <>
          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* User List */}
          <div className="space-y-4">
            {filteredUsers.map(user => (
              <GlassCard key={user.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.fullName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{user.fullName}</h3>
                      <p className="text-slate-400">{user.jobTitle} • {user.department}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-sm text-slate-400">Role</div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-slate-400">Status</div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-slate-400">Objectives</div>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-sky-500/20 text-sky-400 px-2 py-1 rounded">
                          {user.objectives.total}
                        </span>
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                          {user.objectives.onTrack}
                        </span>
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                          {user.objectives.atRisk}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-slate-400">Last Active</div>
                      <div className="text-sm font-mono">
                        {user.lastActive.toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="p-2 text-slate-400 hover:text-sky-400 transition-colors">
                        <Icon path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                        <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </>
      )}

      {selectedTab === 'org-chart' && (
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-6 text-sky-300">Organization Chart</h3>
          <div className="space-y-8 overflow-x-auto">
            {buildOrgChart().map(node => renderOrgNode(node))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default UsersPage;