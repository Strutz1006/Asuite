import { supabase } from '../lib/supabase'
import type { 
  AlignObjective, 
  AlignKeyResult, 
  AlignProgressUpdate,
  CreateObjectiveForm,
  CreateKeyResultForm,
  UpdateProgressForm,
  ObjectiveFilters,
  ObjectiveSort,
  ObjectiveStats,
  ObjectiveHierarchy,
  ApiResponse,
  PaginatedResponse
} from '../types/database'

export class ObjectivesService {
  // =========================================================================
  // OBJECTIVES CRUD
  // =========================================================================

  static async getObjectives(
    organizationId: string,
    filters?: ObjectiveFilters,
    sort?: ObjectiveSort,
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<AlignObjective>> {
    try {
      let query = supabase
        .from('align_objectives')
        .select(`
          *,
          owner:users!align_objectives_owner_id_fkey(id, full_name, email),
          parent:align_objectives!align_objectives_parent_id_fkey(id, title),
          cascade_from:align_objectives!align_objectives_cascade_from_id_fkey(id, title),
          department:departments(id, name),
          team:teams(id, name),
          key_results:align_key_results(id, title, progress_percentage, status),
          progress_updates:align_progress_updates(
            id, 
            progress_percentage, 
            comment, 
            created_at,
            user:users(id, full_name)
          )
        `, { count: 'exact' })
        .eq('organization_id', organizationId)

      // Apply filters
      if (filters) {
        if (filters.level?.length) {
          query = query.in('level', filters.level)
        }
        if (filters.status?.length) {
          query = query.in('status', filters.status)
        }
        if (filters.priority?.length) {
          query = query.in('priority', filters.priority)
        }
        if (filters.department_id?.length) {
          query = query.in('department_id', filters.department_id)
        }
        if (filters.team_id?.length) {
          query = query.in('team_id', filters.team_id)
        }
        if (filters.owner_id?.length) {
          query = query.in('owner_id', filters.owner_id)
        }
        if (filters.framework?.length) {
          query = query.in('framework', filters.framework)
        }
        if (filters.visibility?.length) {
          query = query.in('visibility', filters.visibility)
        }
        if (filters.due_date_from) {
          query = query.gte('due_date', filters.due_date_from)
        }
        if (filters.due_date_to) {
          query = query.lte('due_date', filters.due_date_to)
        }
        if (filters.search) {
          query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
        }
      }

      // Apply sorting
      if (sort) {
        query = query.order(sort.field, { ascending: sort.direction === 'asc' })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      // Apply pagination
      if (page && limit) {
        const from = (page - 1) * limit
        const to = from + limit - 1
        query = query.range(from, to)
      }

      const { data, error, count } = await query

      if (error) throw error

      const response: PaginatedResponse<AlignObjective> = { data: data as AlignObjective[] }
      
      if (page && limit && count !== null) {
        response.pagination = {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit)
        }
      }

      return response
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to fetch objectives' 
        } 
      }
    }
  }

  static async getObjective(id: string): Promise<ApiResponse<AlignObjective>> {
    try {
      const { data, error } = await supabase
        .from('align_objectives')
        .select(`
          *,
          owner:users!align_objectives_owner_id_fkey(id, full_name, email),
          parent:align_objectives!align_objectives_parent_id_fkey(id, title),
          cascade_from:align_objectives!align_objectives_cascade_from_id_fkey(id, title),
          department:departments(id, name),
          team:teams(id, name),
          key_results:align_key_results(*),
          children:align_objectives!align_objectives_parent_id_fkey(id, title, progress_percentage, status),
          progress_updates:align_progress_updates(
            *,
            user:users(id, full_name, email)
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      return { data: data as AlignObjective }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to fetch objective' 
        } 
      }
    }
  }

  static async createObjective(
    organizationId: string,
    objectiveData: CreateObjectiveForm
  ): Promise<ApiResponse<AlignObjective>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Authentication required')

      const { key_results, ...objectiveFields } = objectiveData

      // Create the objective
      const { data: objective, error: objectiveError } = await supabase
        .from('align_objectives')
        .insert({
          organization_id: organizationId,
          owner_id: user.id,
          ...objectiveFields
        })
        .select()
        .single()

      if (objectiveError) throw objectiveError

      // Create key results if provided
      if (key_results && key_results.length > 0) {
        const keyResultsData = key_results.map(kr => ({
          objective_id: objective.id,
          ...kr
        }))

        const { error: keyResultsError } = await supabase
          .from('align_key_results')
          .insert(keyResultsData)

        if (keyResultsError) throw keyResultsError
      }

      // Fetch the complete objective with relations
      const fullObjective = await this.getObjective(objective.id)
      return fullObjective
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to create objective' 
        } 
      }
    }
  }

  static async updateObjective(
    id: string,
    updates: Partial<CreateObjectiveForm>
  ): Promise<ApiResponse<AlignObjective>> {
    try {
      const { data, error } = await supabase
        .from('align_objectives')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Fetch the complete objective with relations
      const fullObjective = await this.getObjective(id)
      return fullObjective
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to update objective' 
        } 
      }
    }
  }

  static async deleteObjective(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('align_objectives')
        .delete()
        .eq('id', id)

      if (error) throw error

      return {}
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to delete objective' 
        } 
      }
    }
  }

  // =========================================================================
  // KEY RESULTS
  // =========================================================================

  static async createKeyResult(
    objectiveId: string,
    keyResultData: CreateKeyResultForm
  ): Promise<ApiResponse<AlignKeyResult>> {
    try {
      const { data, error } = await supabase
        .from('align_key_results')
        .insert({
          objective_id: objectiveId,
          ...keyResultData
        })
        .select()
        .single()

      if (error) throw error

      return { data }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to create key result' 
        } 
      }
    }
  }

  static async updateKeyResult(
    id: string,
    updates: Partial<CreateKeyResultForm>
  ): Promise<ApiResponse<AlignKeyResult>> {
    try {
      const { data, error } = await supabase
        .from('align_key_results')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return { data }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to update key result' 
        } 
      }
    }
  }

  static async deleteKeyResult(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('align_key_results')
        .delete()
        .eq('id', id)

      if (error) throw error

      return {}
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to delete key result' 
        } 
      }
    }
  }

  // =========================================================================
  // PROGRESS UPDATES
  // =========================================================================

  static async createProgressUpdate(
    objectiveId: string,
    updateData: UpdateProgressForm
  ): Promise<ApiResponse<AlignProgressUpdate>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Authentication required')

      const { data, error } = await supabase
        .from('align_progress_updates')
        .insert({
          objective_id: objectiveId,
          user_id: user.id,
          ...updateData
        })
        .select(`
          *,
          objective:align_objectives(id, title),
          user:users(id, full_name, email)
        `)
        .single()

      if (error) throw error

      // Update the objective's current progress if provided
      if (updateData.progress_percentage !== undefined) {
        await supabase
          .from('align_objectives')
          .update({ 
            progress_percentage: updateData.progress_percentage,
            current_value: updateData.current_value
          })
          .eq('id', objectiveId)
      }

      return { data: data as AlignProgressUpdate }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to create progress update' 
        } 
      }
    }
  }

  // =========================================================================
  // ANALYTICS & STATISTICS
  // =========================================================================

  static async getObjectiveStats(organizationId: string): Promise<ApiResponse<ObjectiveStats>> {
    try {
      // Get all objectives for the organization
      const { data: objectives, error } = await supabase
        .from('align_objectives')
        .select('level, status, progress_percentage')
        .eq('organization_id', organizationId)

      if (error) throw error

      if (!objectives) {
        throw new Error('No objectives found')
      }

      // Calculate statistics
      const total = objectives.length
      const by_level = {
        corporate: objectives.filter(o => o.level === 'corporate').length,
        department: objectives.filter(o => o.level === 'department').length,
        team: objectives.filter(o => o.level === 'team').length,
        individual: objectives.filter(o => o.level === 'individual').length
      }
      const by_status = {
        active: objectives.filter(o => o.status === 'active').length,
        'on-track': objectives.filter(o => o.status === 'on-track').length,
        'at-risk': objectives.filter(o => o.status === 'at-risk').length,
        completed: objectives.filter(o => o.status === 'completed').length,
        paused: objectives.filter(o => o.status === 'paused').length
      }
      const average_progress = total > 0 
        ? objectives.reduce((sum, o) => sum + (o.progress_percentage || 0), 0) / total 
        : 0
      const completion_rate = total > 0 
        ? (by_status.completed / total) * 100 
        : 0

      const stats: ObjectiveStats = {
        total,
        by_level,
        by_status,
        average_progress: Math.round(average_progress * 100) / 100,
        completion_rate: Math.round(completion_rate * 100) / 100
      }

      return { data: stats }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to fetch objective statistics' 
        } 
      }
    }
  }

  static async getObjectiveHierarchy(organizationId: string): Promise<ApiResponse<ObjectiveHierarchy>> {
    try {
      // This is a complex query that builds the full hierarchy
      // We'll implement a simplified version for now
      const objectivesResponse = await this.getObjectives(organizationId)
      if (objectivesResponse.error || !objectivesResponse.data) {
        throw new Error(objectivesResponse.error?.message || 'Failed to fetch objectives')
      }

      const objectives = objectivesResponse.data

      // Build hierarchy structure
      const corporate = objectives.filter(o => o.level === 'corporate')
      const departments: ObjectiveHierarchy['departments'] = {}

      // Group by departments
      objectives.filter(o => o.department_id).forEach(obj => {
        if (!obj.department_id) return

        if (!departments[obj.department_id]) {
          departments[obj.department_id] = {
            department: obj.department!,
            objectives: [],
            teams: {}
          }
        }

        if (obj.level === 'department') {
          departments[obj.department_id].objectives.push(obj)
        } else if (obj.level === 'team' && obj.team_id) {
          if (!departments[obj.department_id].teams[obj.team_id]) {
            departments[obj.department_id].teams[obj.team_id] = {
              team: obj.team!,
              objectives: [],
              individuals: {}
            }
          }
          departments[obj.department_id].teams[obj.team_id].objectives.push(obj)
        } else if (obj.level === 'individual' && obj.owner_id) {
          // Handle individual objectives
          if (obj.team_id && departments[obj.department_id].teams[obj.team_id]) {
            if (!departments[obj.department_id].teams[obj.team_id].individuals[obj.owner_id]) {
              departments[obj.department_id].teams[obj.team_id].individuals[obj.owner_id] = {
                user: obj.owner!,
                objectives: []
              }
            }
            departments[obj.department_id].teams[obj.team_id].individuals[obj.owner_id].objectives.push(obj)
          }
        }
      })

      const hierarchy: ObjectiveHierarchy = {
        corporate,
        departments
      }

      return { data: hierarchy }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to fetch objective hierarchy' 
        } 
      }
    }
  }
}