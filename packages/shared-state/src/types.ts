export interface OrganizationState {
  id: string
  name: string
  industry?: string
  size?: string
  settings: {
    goal_framework: 'okr' | 'smart' | 'kpi'
    planning_cycle: 'quarterly' | 'annual' | 'monthly'
    alignment_required: boolean
    progress_frequency: 'weekly' | 'biweekly' | 'monthly'
  }
}

export interface UserState {
  id: string
  full_name: string
  email: string
  role: string
  department_id?: string
  team_id?: string
  preferences: {
    theme: 'light' | 'dark' | 'system'
    notifications_enabled: boolean
    default_view: 'kanban' | 'list' | 'calendar'
    dashboard_layout: string[]
  }
}

export interface CrossAppNotification {
  id: string
  type: 'goal_updated' | 'task_completed' | 'project_milestone' | 'alignment_changed'
  source_app: 'align' | 'drive' | 'pulse' | 'catalyst' | 'flow' | 'foresight'
  target_app: 'align' | 'drive' | 'pulse' | 'catalyst' | 'flow' | 'foresight'
  entity_type: 'goal' | 'task' | 'project' | 'milestone'
  entity_id: string
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  created_at: string
}

export interface CrossAppLink {
  id: string
  source_app: string
  source_entity_type: string
  source_entity_id: string
  target_app: string
  target_entity_type: string
  target_entity_id: string
  relationship_type: 'alignment' | 'dependency' | 'milestone' | 'reference'
  metadata?: Record<string, any>
}

export interface ActivityEvent {
  id: string
  product: string
  action: string
  entity_type: string
  entity_id: string
  user_id: string
  details: Record<string, any>
  created_at: string
}

export interface SharedStateStore {
  // Organization & User
  organization: OrganizationState | null
  user: UserState | null
  
  // Cross-app Data Cache
  goals: { id: string; title: string; progress: number; status: string }[]
  projects: { id: string; name: string; status: string; progress: number }[]
  
  // Notifications & Activity
  notifications: CrossAppNotification[]
  recentActivity: ActivityEvent[]
  
  // Navigation State
  currentApp: string
  previousApp: string | null
  navigationContext: Record<string, any>
  
  // Real-time Connection Status
  connectionStatus: 'connected' | 'disconnected' | 'connecting'
  lastSync: string | null
  
  // Actions
  setOrganization: (org: OrganizationState) => void
  setUser: (user: UserState) => void
  updateUserPreferences: (preferences: Partial<UserState['preferences']>) => void
  
  addNotification: (notification: Omit<CrossAppNotification, 'id' | 'created_at'>) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
  
  updateGoalsCache: (goals: any[]) => void
  updateProjectsCache: (projects: any[]) => void
  
  setNavigationContext: (app: string, context: Record<string, any>) => void
  
  addActivity: (activity: Omit<ActivityEvent, 'id' | 'created_at'>) => void
  
  setConnectionStatus: (status: 'connected' | 'disconnected' | 'connecting') => void
  updateLastSync: () => void
}