import { Tables } from './database'

// Direct table types
export type LicensePlan = Tables<'license_plans'>
export type OrganizationLicense = Tables<'organization_licenses'>
export type OrganizationAppAccess = Tables<'organization_app_access'>
export type UserLicenseAssignment = Tables<'user_license_assignments'>

// Pricing models
export type PricingModel = 'per_user' | 'organization' | 'usage_based'
export type BillingCycle = 'monthly' | 'yearly' | 'one_time'
export type LicenseStatus = 'active' | 'expired' | 'suspended' | 'trial'

// App names for the Aesyros Suite
export type AppName = 'align' | 'drive' | 'pulse' | 'catalyst' | 'flow' | 'foresight'

// License plan features interface
export interface LicenseFeatures {
  // Common features
  unlimited?: boolean
  sso?: boolean
  advanced_analytics?: boolean
  priority_support?: boolean
  trial_days?: number
  max_users?: number
  
  // App-specific features
  goals_per_user?: number
  objectives_per_org?: number
  projects_per_user?: number
  storage_gb?: number
  advanced_reporting?: boolean
  integrations?: string[]
  
  // Usage-based features
  api_calls_per_month?: number
  data_retention_months?: number
  
  // Add more as needed
  [key: string]: any
}

// Extended license plan with typed features
export interface LicensePlanWithFeatures extends Omit<LicensePlan, 'features' | 'pricing_model' | 'billing_cycle'> {
  pricing_model: PricingModel
  billing_cycle: BillingCycle | null
  features: LicenseFeatures | null
}

// Extended organization license with license plan details
export interface OrganizationLicenseWithPlan extends Omit<OrganizationLicense, 'status'> {
  status: LicenseStatus
  license_plan: LicensePlanWithFeatures
}

// License validation result
export interface LicenseValidation {
  isValid: boolean
  hasAppAccess: (appName: AppName) => boolean
  canAddUsers: boolean
  remainingUsers?: number
  isTrialExpired: boolean
  isSubscriptionExpired: boolean
  errors: string[]
}

// License usage stats
export interface LicenseUsageStats {
  currentUsers: number
  maxUsers: number | null
  usagePercentage: number
  appsEnabled: AppName[]
  subscriptionStatus: LicenseStatus
  daysUntilExpiry?: number
  isOverLimit: boolean
}

// License enforcement options
export interface LicenseEnforcementOptions {
  strictMode?: boolean // Prevent actions when over limit vs. warn
  gracePeriodDays?: number // Allow usage for X days after expiry
  allowTrialOverage?: boolean // Allow going over user limit during trial
}

// User creation validation
export interface UserCreationValidation {
  canCreate: boolean
  reason?: string
  suggestedAction?: string
  upgradeRequired?: boolean
}

// License plan comparison
export interface LicensePlanComparison {
  currentPlan: LicensePlanWithFeatures
  suggestedPlans: LicensePlanWithFeatures[]
  reasons: string[]
}

// Licensing hooks return types
export interface UseLicenseReturn {
  license: OrganizationLicenseWithPlan | null
  validation: LicenseValidation
  usage: LicenseUsageStats
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export interface UseAppAccessReturn {
  hasAccess: boolean
  appAccess: OrganizationAppAccess | null
  loading: boolean
  error: string | null
}

// License management actions
export interface LicenseManagementActions {
  upgradeToPlain: (planSlug: string) => Promise<void>
  assignUserToApps: (userId: string, apps: AppName[]) => Promise<void>
  removeUserFromApps: (userId: string, apps: AppName[]) => Promise<void>
  updateBillingContact: (email: string) => Promise<void>
  cancelSubscription: () => Promise<void>
  renewSubscription: () => Promise<void>
}

// License event types for analytics
export type LicenseEvent = 
  | 'license_upgraded'
  | 'license_downgraded'
  | 'user_limit_reached'
  | 'user_limit_exceeded'
  | 'trial_started'
  | 'trial_expired'
  | 'subscription_renewed'
  | 'subscription_cancelled'
  | 'app_access_granted'
  | 'app_access_revoked'

export interface LicenseEventData {
  event: LicenseEvent
  organizationId: string
  userId?: string
  planSlug?: string
  metadata?: Record<string, any>
  timestamp: string
}