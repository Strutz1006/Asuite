// Client
export { supabase, createSupabaseClient } from './client'

// Types
export type { Database } from './types/database'

// Hooks
export { useAuth } from './hooks/useAuth'
export { useSupabaseQuery, useSupabaseTable, useSupabaseRow } from './hooks/useSupabaseQuery'

// Utils
export {
  DatabaseService,
  alignCompaniesService,
  alignGoalsService,
  driveProjectsService,
  driveTasksService,
  pulseKpisService,
  usersService,
  getCurrentUser,
  getUserProfile,
  createUserProfile,
  subscribeToTable,
  batchInsert,
  batchUpdate
} from './utils/database'