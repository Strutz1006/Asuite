// Service layer exports for Align app Supabase integration

export { AuthService } from './auth'
export { ObjectivesService } from './objectives'  
export { OrganizationsService } from './organizations'

// Re-export types for convenience
export type {
  AlignObjective,
  AlignKeyResult,
  AlignProgressUpdate,
  Organization,
  Department,
  Team,
  TeamMembership,
  User,
  CreateObjectiveForm,
  CreateKeyResultForm,
  UpdateProgressForm,
  CreateDepartmentForm,
  CreateTeamForm,
  UpdateVisionMissionForm,
  ObjectiveFilters,
  ObjectiveSort,
  ObjectiveStats,
  ObjectiveHierarchy,
  OrganizationStructure,
  ApiResponse,
  PaginatedResponse
} from '../types/database'