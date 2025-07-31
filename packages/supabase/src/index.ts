// Client
export { supabase, createSupabaseClient } from './client'

// Types
export type { Database } from './types/database'
export type {
  LicensePlan,
  OrganizationLicense,
  OrganizationAppAccess,
  UserLicenseAssignment,
  PricingModel,
  BillingCycle,
  LicenseStatus,
  AppName,
  LicenseFeatures,
  LicensePlanWithFeatures,
  OrganizationLicenseWithPlan,
  LicenseValidation,
  LicenseUsageStats,
  UserCreationValidation,
  UseLicenseReturn,
  UseAppAccessReturn
} from './types/licensing'
export type {
  SuperAdminCapabilities,
  SuperAdminReturn
} from './hooks/useSuperAdmin'

// Hooks
export { useAuth } from './hooks/useAuth'
export { useSupabaseQuery, useSupabaseTable, useSupabaseRow } from './hooks/useSupabaseQuery'
export { useLicense } from './hooks/useLicense'
export { useAppAccess } from './hooks/useAppAccess'
export { useLicenseValidation } from './hooks/useLicenseValidation'
export { useSuperAdmin } from './hooks/useSuperAdmin'

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