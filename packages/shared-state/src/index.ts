// Store and state management
export { useSharedState } from './store'
export {
  useOrganization,
  useUser,
  useNotifications,
  useUnreadNotifications,
  useGoalsCache,
  useProjectsCache,
  useNavigationContext,
  useConnectionStatus,
  useRecentActivity
} from './store'

// Providers
export { CrossAppProvider, useCrossAppNotifications, useCrossAppLinks } from './providers/CrossAppProvider'

// Hooks
export { useOrganizationSync } from './hooks/useOrganizationSync'

// Components
export { CrossAppNotificationBell } from './components/CrossAppNotificationBell'
export { CrossAppGoalSelector } from './components/CrossAppGoalSelector'

// Types
export type {
  OrganizationState,
  UserState,
  CrossAppNotification,
  CrossAppLink,
  ActivityEvent,
  SharedStateStore
} from './types'