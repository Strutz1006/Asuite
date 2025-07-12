import { supabase } from '../lib/supabase'
import type { 
  Organization, 
  Department, 
  Team, 
  TeamMembership,
  CreateDepartmentForm,
  CreateTeamForm,
  UpdateVisionMissionForm,
  ApiResponse,
  OrganizationStructure
} from '../types/database'

export class OrganizationsService {
  // =========================================================================
  // ORGANIZATION METHODS
  // =========================================================================

  static async getOrganization(id: string): Promise<ApiResponse<Organization>> {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return { data }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to fetch organization' 
        } 
      }
    }
  }

  static async updateVisionMission(
    organizationId: string, 
    updates: UpdateVisionMissionForm
  ): Promise<ApiResponse<Organization>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Authentication required')

      const updateData: any = {}
      
      if (updates.vision_statement !== undefined) {
        updateData.vision_statement = updates.vision_statement
        updateData.vision_last_updated = new Date().toISOString()
        updateData.vision_updated_by = user.id
      }
      
      if (updates.mission_statement !== undefined) {
        updateData.mission_statement = updates.mission_statement
        updateData.mission_last_updated = new Date().toISOString()
        updateData.mission_updated_by = user.id
      }
      
      if (updates.core_values !== undefined) {
        updateData.core_values = updates.core_values
      }

      const { data, error } = await supabase
        .from('organizations')
        .update(updateData)
        .eq('id', organizationId)
        .select()
        .single()

      if (error) throw error

      return { data }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to update vision/mission' 
        } 
      }
    }
  }

  // =========================================================================
  // DEPARTMENT METHODS
  // =========================================================================

  static async getDepartments(organizationId: string): Promise<ApiResponse<Department[]>> {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select(`
          *,
          head_of_department:users!departments_head_of_department_id_fkey(id, full_name, email),
          parent_department:departments!departments_parent_department_id_fkey(id, name),
          teams(id, name, member_count, goals_count)
        `)
        .eq('organization_id', organizationId)
        .eq('status', 'active')
        .order('name')

      if (error) throw error

      return { data: data as Department[] }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to fetch departments' 
        } 
      }
    }
  }

  static async createDepartment(
    organizationId: string,
    departmentData: CreateDepartmentForm
  ): Promise<ApiResponse<Department>> {
    try {
      const { data, error } = await supabase
        .from('departments')
        .insert({
          organization_id: organizationId,
          ...departmentData
        })
        .select()
        .single()

      if (error) throw error

      return { data }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to create department' 
        } 
      }
    }
  }

  static async updateDepartment(
    id: string,
    updates: Partial<CreateDepartmentForm>
  ): Promise<ApiResponse<Department>> {
    try {
      const { data, error } = await supabase
        .from('departments')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return { data }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to update department' 
        } 
      }
    }
  }

  static async deleteDepartment(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('departments')
        .update({ status: 'inactive' })
        .eq('id', id)

      if (error) throw error

      return {}
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to delete department' 
        } 
      }
    }
  }

  // =========================================================================
  // TEAM METHODS
  // =========================================================================

  static async getTeams(organizationId: string, departmentId?: string): Promise<ApiResponse<Team[]>> {
    try {
      let query = supabase
        .from('teams')
        .select(`
          *,
          department:departments(id, name),
          team_lead:users!teams_team_lead_id_fkey(id, full_name, email),
          members:team_memberships(
            id,
            role,
            is_active,
            user:users(id, full_name, email)
          )
        `)
        .eq('organization_id', organizationId)
        .eq('status', 'active')

      if (departmentId) {
        query = query.eq('department_id', departmentId)
      }

      const { data, error } = await query.order('name')

      if (error) throw error

      return { data: data as Team[] }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to fetch teams' 
        } 
      }
    }
  }

  static async createTeam(
    organizationId: string,
    teamData: CreateTeamForm
  ): Promise<ApiResponse<Team>> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert({
          organization_id: organizationId,
          ...teamData
        })
        .select()
        .single()

      if (error) throw error

      return { data }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to create team' 
        } 
      }
    }
  }

  static async updateTeam(
    id: string,
    updates: Partial<CreateTeamForm>
  ): Promise<ApiResponse<Team>> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return { data }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to update team' 
        } 
      }
    }
  }

  static async deleteTeam(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('teams')
        .update({ status: 'inactive' })
        .eq('id', id)

      if (error) throw error

      return {}
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to delete team' 
        } 
      }
    }
  }

  // =========================================================================
  // TEAM MEMBERSHIP METHODS
  // =========================================================================

  static async addTeamMember(
    teamId: string,
    userId: string,
    role: string = 'member'
  ): Promise<ApiResponse<TeamMembership>> {
    try {
      const { data, error } = await supabase
        .from('team_memberships')
        .insert({
          team_id: teamId,
          user_id: userId,
          role
        })
        .select()
        .single()

      if (error) throw error

      return { data }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to add team member' 
        } 
      }
    }
  }

  static async removeTeamMember(
    teamId: string,
    userId: string
  ): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('team_memberships')
        .update({ 
          is_active: false,
          left_at: new Date().toISOString()
        })
        .eq('team_id', teamId)
        .eq('user_id', userId)
        .eq('is_active', true)

      if (error) throw error

      return {}
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to remove team member' 
        } 
      }
    }
  }

  static async updateTeamMemberRole(
    teamId: string,
    userId: string,
    role: string
  ): Promise<ApiResponse<TeamMembership>> {
    try {
      const { data, error } = await supabase
        .from('team_memberships')
        .update({ role })
        .eq('team_id', teamId)
        .eq('user_id', userId)
        .eq('is_active', true)
        .select()
        .single()

      if (error) throw error

      return { data }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to update team member role' 
        } 
      }
    }
  }

  // =========================================================================
  // ORGANIZATIONAL STRUCTURE METHODS
  // =========================================================================

  static async getOrganizationStructure(organizationId: string): Promise<ApiResponse<OrganizationStructure>> {
    try {
      // Get organization
      const orgResponse = await this.getOrganization(organizationId)
      if (orgResponse.error || !orgResponse.data) {
        throw new Error(orgResponse.error?.message || 'Organization not found')
      }

      // Get departments with teams
      const deptResponse = await this.getDepartments(organizationId)
      if (deptResponse.error) {
        throw new Error(deptResponse.error.message)
      }

      // Get teams
      const teamsResponse = await this.getTeams(organizationId)
      if (teamsResponse.error) {
        throw new Error(teamsResponse.error.message)
      }

      // Get employee count
      const { count: totalEmployees } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId)

      // Get objectives count
      const { count: totalObjectives } = await supabase
        .from('align_objectives')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId)

      // Calculate hierarchy depth
      const maxDepth = Math.max(
        ...(deptResponse.data || []).map(dept => {
          let depth = 1
          let current = dept
          while (current.parent_department_id) {
            depth++
            current = (deptResponse.data || []).find(d => d.id === current.parent_department_id) || current
            if (depth > 10) break // Prevent infinite loops
          }
          return depth
        }),
        1
      )

      const structure: OrganizationStructure = {
        organization: orgResponse.data,
        departments: deptResponse.data || [],
        teams: teamsResponse.data || [],
        total_employees: totalEmployees || 0,
        total_objectives: totalObjectives || 0,
        hierarchy_depth: maxDepth
      }

      return { data: structure }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to fetch organization structure' 
        } 
      }
    }
  }
}