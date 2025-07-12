// Enhanced TypeScript interfaces for Supabase database schema
// This file defines all types for the proper organizational hierarchy

// =============================================================================
// SUPABASE DATABASE TYPE DEFINITION
// =============================================================================

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: Organization
        Insert: Omit<Organization, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Organization, 'id' | 'created_at' | 'updated_at'>>
      }
      departments: {
        Row: Department
        Insert: Omit<Department, 'id' | 'created_at' | 'updated_at' | 'employee_count' | 'goals_count'>
        Update: Partial<Omit<Department, 'id' | 'created_at' | 'updated_at'>>
      }
      teams: {
        Row: Team
        Insert: Omit<Team, 'id' | 'created_at' | 'updated_at' | 'member_count' | 'goals_count'>
        Update: Partial<Omit<Team, 'id' | 'created_at' | 'updated_at'>>
      }
      team_memberships: {
        Row: TeamMembership
        Insert: Omit<TeamMembership, 'id' | 'joined_at'>
        Update: Partial<Omit<TeamMembership, 'id' | 'joined_at'>>
      }
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
      }
      align_objectives: {
        Row: AlignObjective
        Insert: Omit<AlignObjective, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<AlignObjective, 'id' | 'created_at' | 'updated_at'>>
      }
      align_key_results: {
        Row: AlignKeyResult
        Insert: Omit<AlignKeyResult, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<AlignKeyResult, 'id' | 'created_at' | 'updated_at'>>
      }
      align_progress_updates: {
        Row: AlignProgressUpdate
        Insert: Omit<AlignProgressUpdate, 'id' | 'created_at'>
        Update: Partial<Omit<AlignProgressUpdate, 'id' | 'created_at'>>
      }
      cross_app_links: {
        Row: CrossAppLink
        Insert: Omit<CrossAppLink, 'id' | 'created_at'>
        Update: Partial<Omit<CrossAppLink, 'id' | 'created_at'>>
      }
      value_impacts: {
        Row: ValueImpact
        Insert: Omit<ValueImpact, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ValueImpact, 'id' | 'created_at' | 'updated_at'>>
      }
      notifications: {
        Row: Notification
        Insert: Omit<Notification, 'id' | 'created_at'>
        Update: Partial<Omit<Notification, 'id' | 'created_at'>>
      }
      activity_logs: {
        Row: ActivityLog
        Insert: Omit<ActivityLog, 'id' | 'created_at'>
        Update: Partial<Omit<ActivityLog, 'id' | 'created_at'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// =============================================================================
// CORE ORGANIZATIONAL STRUCTURE
// =============================================================================

export interface Organization {
  id: string;
  name: string;
  slug: string;
  industry?: string;
  size_category?: string;
  website?: string;
  logo_url?: string;
  timezone: string;
  settings: Record<string, any>;
  active_products: string[];
  subscription_tier: string;
  ai_coach_enabled: boolean;
  trust_layer_enabled: boolean;
  
  // Enhanced fields for vision/mission
  vision_statement?: string;
  mission_statement?: string;
  core_values: string[];
  vision_last_updated?: string;
  mission_last_updated?: string;
  vision_updated_by?: string;
  mission_updated_by?: string;
  
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  code?: string; // Optional department code/abbreviation
  head_of_department_id?: string;
  parent_department_id?: string; // For sub-departments
  budget_allocated?: number;
  employee_count: number;
  status: 'active' | 'inactive';
  goals_count: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  
  // Populated via joins
  head_of_department?: User;
  parent_department?: Department;
  teams?: Team[];
  employees?: User[];
}

export interface Team {
  id: string;
  organization_id: string;
  department_id: string;
  name: string;
  description?: string;
  code?: string; // Optional team code/abbreviation
  team_lead_id?: string;
  team_type: 'functional' | 'cross-functional' | 'project' | 'temporary';
  member_count: number;
  status: 'active' | 'inactive';
  goals_count: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  
  // Populated via joins
  department?: Department;
  team_lead?: User;
  members?: TeamMembership[];
}

export interface TeamMembership {
  id: string;
  team_id: string;
  user_id: string;
  role: 'member' | 'lead' | 'coordinator' | 'specialist';
  joined_at: string;
  left_at?: string;
  is_active: boolean;
  
  // Populated via joins
  team?: Team;
  user?: User;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  organization_id?: string;
  role: 'admin' | 'manager' | 'contributor';
  department?: string; // Legacy field - to be deprecated
  job_title?: string;
  permissions: Record<string, any>;
  preferences: Record<string, any>;
  last_active_at?: string;
  
  // Enhanced organizational structure
  department_id?: string;
  primary_team_id?: string;
  
  created_at: string;
  updated_at: string;
  
  // Populated via joins
  organization?: Organization;
  department_info?: Department;
  primary_team?: Team;
  team_memberships?: TeamMembership[];
}

// =============================================================================
// ALIGN APP SPECIFIC TYPES
// =============================================================================

export interface AlignObjective {
  id: string;
  organization_id?: string;
  title: string;
  description?: string;
  level: 'corporate' | 'department' | 'team' | 'individual';
  parent_id?: string;
  owner_id?: string;
  category?: string;
  framework: 'smart' | 'okr';
  target_value?: string;
  current_value?: string;
  unit?: string;
  progress_percentage: number;
  status: 'active' | 'on-track' | 'at-risk' | 'completed' | 'paused';
  priority: 'high' | 'medium' | 'low';
  impact_weight: number;
  confidence_score?: number;
  start_date?: string;
  due_date?: string;
  completion_date?: string;
  tags: string[];
  metadata: Record<string, any>;
  
  // Enhanced organizational hierarchy
  department_id?: string;
  team_id?: string;
  visibility: 'public' | 'department' | 'team' | 'private';
  cascade_from_id?: string; // For OKR cascading
  alignment_score?: number;
  
  created_at: string;
  updated_at: string;
  
  // Populated via joins
  owner?: User;
  parent?: AlignObjective;
  cascade_from?: AlignObjective;
  department?: Department;
  team?: Team;
  key_results?: AlignKeyResult[];
  children?: AlignObjective[];
  progress_updates?: AlignProgressUpdate[];
}

export interface AlignKeyResult {
  id: string;
  objective_id?: string;
  title: string;
  description?: string;
  target_value?: string;
  current_value?: string;
  unit?: string;
  progress_percentage: number;
  status: 'active' | 'on-track' | 'at-risk' | 'completed' | 'paused';
  due_date?: string;
  completion_date?: string;
  created_at: string;
  updated_at: string;
  
  // Populated via joins
  objective?: AlignObjective;
}

export interface AlignProgressUpdate {
  id: string;
  objective_id?: string;
  user_id?: string;
  value?: string;
  progress_percentage?: number;
  comment?: string;
  confidence_score?: number;
  blockers?: string;
  achievements?: string;
  next_steps?: string;
  created_at: string;
  
  // Populated via joins
  objective?: AlignObjective;
  user?: User;
}

// =============================================================================
// CROSS-APP TYPES
// =============================================================================

export interface CrossAppLink {
  id: string;
  organization_id?: string;
  source_app: string;
  source_entity_type: string;
  source_entity_id: string;
  target_app: string;
  target_entity_type: string;
  target_entity_id: string;
  link_type?: string;
  strength: number; // 1-5 scale
  notes?: string;
  created_by?: string;
  created_at: string;
  
  // Populated via joins
  creator?: User;
}

export interface ValueImpact {
  id: string;
  organization_id?: string;
  source_app: string;
  source_entity_id: string;
  impact_category?: string;
  metric_name?: string;
  baseline_value?: number;
  current_value?: number;
  target_value?: number;
  unit?: string;
  measurement_period?: string;
  stakeholder_group?: string;
  verified: boolean;
  verification_source?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  organization_id?: string;
  user_id?: string;
  app: string;
  type?: string;
  title: string;
  message?: string;
  entity_type?: string;
  entity_id?: string;
  priority: 'high' | 'medium' | 'low';
  read_at?: string;
  action_url?: string;
  metadata: Record<string, any>;
  created_at: string;
  
  // Populated via joins
  user?: User;
}

export interface ActivityLog {
  id: string;
  organization_id?: string;
  user_id?: string;
  product: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  
  // Populated via joins
  user?: User;
}

// =============================================================================
// HELPER TYPES FOR UI COMPONENTS
// =============================================================================

export interface ObjectiveHierarchy {
  corporate: AlignObjective[];
  departments: {
    [departmentId: string]: {
      department: Department;
      objectives: AlignObjective[];
      teams: {
        [teamId: string]: {
          team: Team;
          objectives: AlignObjective[];
          individuals: {
            [userId: string]: {
              user: User;
              objectives: AlignObjective[];
            };
          };
        };
      };
    };
  };
}

export interface ObjectiveStats {
  total: number;
  by_level: {
    corporate: number;
    department: number;
    team: number;
    individual: number;
  };
  by_status: {
    active: number;
    'on-track': number;
    'at-risk': number;
    completed: number;
    paused: number;
  };
  average_progress: number;
  completion_rate: number;
}

export interface OrganizationStructure {
  organization: Organization;
  departments: Department[];
  teams: Team[];
  total_employees: number;
  total_objectives: number;
  hierarchy_depth: number;
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  count?: number;
  status?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// =============================================================================
// FORM TYPES
// =============================================================================

export interface CreateObjectiveForm {
  title: string;
  description?: string;
  level: 'corporate' | 'department' | 'team' | 'individual';
  parent_id?: string;
  cascade_from_id?: string;
  department_id?: string;
  team_id?: string;
  owner_id?: string;
  framework: 'smart' | 'okr';
  target_value?: string;
  unit?: string;
  priority: 'high' | 'medium' | 'low';
  visibility: 'public' | 'department' | 'team' | 'private';
  start_date?: string;
  due_date?: string;
  tags: string[];
  key_results?: CreateKeyResultForm[];
}

export interface CreateKeyResultForm {
  title: string;
  description?: string;
  target_value?: string;
  unit?: string;
  due_date?: string;
}

export interface UpdateProgressForm {
  current_value?: string;
  progress_percentage?: number;
  comment?: string;
  confidence_score?: number;
  blockers?: string;
  achievements?: string;
  next_steps?: string;
}

export interface CreateDepartmentForm {
  name: string;
  description?: string;
  code?: string;
  head_of_department_id?: string;
  parent_department_id?: string;
  budget_allocated?: number;
}

export interface CreateTeamForm {
  name: string;
  description?: string;
  code?: string;
  department_id: string;
  team_lead_id?: string;
  team_type: 'functional' | 'cross-functional' | 'project' | 'temporary';
}

export interface UpdateVisionMissionForm {
  vision_statement?: string;
  mission_statement?: string;
  core_values?: string[];
}

// =============================================================================
// FILTER AND SEARCH TYPES
// =============================================================================

export interface ObjectiveFilters {
  level?: ('corporate' | 'department' | 'team' | 'individual')[];
  status?: ('active' | 'on-track' | 'at-risk' | 'completed' | 'paused')[];
  priority?: ('high' | 'medium' | 'low')[];
  department_id?: string[];
  team_id?: string[];
  owner_id?: string[];
  framework?: ('smart' | 'okr')[];
  visibility?: ('public' | 'department' | 'team' | 'private')[];
  tags?: string[];
  due_date_from?: string;
  due_date_to?: string;
  search?: string;
}

export interface ObjectiveSort {
  field: 'title' | 'created_at' | 'updated_at' | 'due_date' | 'progress_percentage' | 'priority';
  direction: 'asc' | 'desc';
}

// =============================================================================
// DASHBOARD TYPES
// =============================================================================

export interface DashboardData {
  organization: Organization;
  user: User;
  objectives: AlignObjective[];
  stats: ObjectiveStats;
  recent_updates: AlignProgressUpdate[];
  upcoming_deadlines: AlignObjective[];
  notifications: Notification[];
  team_performance?: {
    team: Team;
    objectives: AlignObjective[];
    progress: number;
  }[];
  department_performance?: {
    department: Department;
    objectives: AlignObjective[];
    progress: number;
  }[];
}

export type { AlignObjective as Objective }; // For backward compatibility with existing code