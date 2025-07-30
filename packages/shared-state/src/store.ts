import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { SharedStateStore, CrossAppNotification, ActivityEvent } from './types'

export const useSharedState = create<SharedStateStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    organization: null,
    user: null,
    goals: [],
    projects: [],
    notifications: [],
    recentActivity: [],
    currentApp: '',
    previousApp: null,
    navigationContext: {},
    connectionStatus: 'disconnected',
    lastSync: null,

    // Organization & User actions
    setOrganization: (organization) => {
      set({ organization })
    },

    setUser: (user) => {
      set({ user })
    },

    updateUserPreferences: (preferences) => {
      const currentUser = get().user
      if (currentUser) {
        set({
          user: {
            ...currentUser,
            preferences: {
              ...currentUser.preferences,
              ...preferences
            }
          }
        })
      }
    },

    // Notification actions
    addNotification: (notificationData) => {
      const notification: CrossAppNotification = {
        ...notificationData,
        id: crypto.randomUUID(),
        read: false,
        created_at: new Date().toISOString()
      }
      
      set((state) => ({
        notifications: [notification, ...state.notifications].slice(0, 50) // Keep last 50
      }))
    },

    markNotificationRead: (id) => {
      set((state) => ({
        notifications: state.notifications.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      }))
    },

    clearNotifications: () => {
      set({ notifications: [] })
    },

    // Cache actions
    updateGoalsCache: (goals) => {
      set({ goals: goals.map(goal => ({
        id: goal.id,
        title: goal.title,
        progress: goal.progress_percentage || 0,
        status: goal.status || 'active'
      })) })
    },

    updateProjectsCache: (projects) => {
      set({ projects: projects.map(project => ({
        id: project.id,
        name: project.name,
        status: project.status || 'planning',
        progress: project.progress_percentage || 0
      })) })
    },

    // Navigation actions
    setNavigationContext: (app, context) => {
      const currentApp = get().currentApp
      set({
        previousApp: currentApp || null,
        currentApp: app,
        navigationContext: {
          ...get().navigationContext,
          [app]: context
        }
      })
    },

    // Activity actions
    addActivity: (activityData) => {
      const activity: ActivityEvent = {
        ...activityData,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString()
      }
      
      set((state) => ({
        recentActivity: [activity, ...state.recentActivity].slice(0, 100) // Keep last 100
      }))
    },

    // Connection actions
    setConnectionStatus: (connectionStatus) => {
      set({ connectionStatus })
    },

    updateLastSync: () => {
      set({ lastSync: new Date().toISOString() })
    }
  }))
)

// Selector hooks for common data access patterns
export const useOrganization = () => useSharedState((state) => state.organization)
export const useUser = () => useSharedState((state) => state.user)
export const useNotifications = () => useSharedState((state) => state.notifications)
export const useUnreadNotifications = () => useSharedState((state) => 
  state.notifications.filter(n => !n.read)
)
export const useGoalsCache = () => useSharedState((state) => state.goals)
export const useProjectsCache = () => useSharedState((state) => state.projects)
export const useNavigationContext = () => useSharedState((state) => ({
  currentApp: state.currentApp,
  previousApp: state.previousApp,
  context: state.navigationContext
}))
export const useConnectionStatus = () => useSharedState((state) => ({
  status: state.connectionStatus,
  lastSync: state.lastSync
}))
export const useRecentActivity = () => useSharedState((state) => state.recentActivity)