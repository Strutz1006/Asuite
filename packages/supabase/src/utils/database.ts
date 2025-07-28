import { supabase } from '../client'
import type { Database } from '../types/database'

// Type helpers
type Tables = Database['public']['Tables']
type TableName = keyof Tables
type Row<T extends TableName> = Tables[T]['Row']
type Insert<T extends TableName> = Tables[T]['Insert']
type Update<T extends TableName> = Tables[T]['Update']

// Generic database operations
export class DatabaseService<T extends TableName> {
  constructor(private tableName: T) {}

  async findAll(select = '*') {
    return supabase
      .from(this.tableName)
      .select(select)
  }

  async findById(id: string, select = '*') {
    return supabase
      .from(this.tableName)
      .select(select)
      .eq('id', id)
      .single()
  }

  async findBy(filters: Partial<Row<T>>, select = '*') {
    let query = supabase.from(this.tableName).select(select)
    
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
    
    return query
  }

  async create(data: Insert<T>) {
    return supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single()
  }

  async update(id: string, data: Update<T>) {
    return supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single()
  }

  async delete(id: string) {
    return supabase
      .from(this.tableName)
      .delete()
      .eq('id', id)
  }

  async upsert(data: Insert<T> | Insert<T>[]) {
    return supabase
      .from(this.tableName)
      .upsert(data)
      .select()
  }
}

// Specific service instances
export const alignCompaniesService = new DatabaseService('align_companies')
export const alignGoalsService = new DatabaseService('align_goals')
export const driveProjectsService = new DatabaseService('drive_projects')
export const driveTasksService = new DatabaseService('drive_tasks')
export const pulseKpisService = new DatabaseService('pulse_kpis')
export const usersService = new DatabaseService('users')

// Utility functions
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile(userId: string) {
  return usersService.findById(userId)
}

export async function createUserProfile(userData: Insert<'users'>) {
  return usersService.create(userData)
}

// Real-time subscriptions
export function subscribeToTable<T extends TableName>(
  tableName: T,
  callback: (payload: any) => void,
  filters?: string
) {
  return supabase
    .channel(`${tableName}_changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: tableName,
        filter: filters
      },
      callback
    )
    .subscribe()
}

// Batch operations
export async function batchInsert<T extends TableName>(
  tableName: T,
  data: Insert<T>[]
) {
  return supabase
    .from(tableName)
    .insert(data)
    .select()
}

export async function batchUpdate<T extends TableName>(
  tableName: T,
  updates: Array<{ id: string; data: Update<T> }>
) {
  const promises = updates.map(({ id, data }) =>
    supabase
      .from(tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single()
  )
  
  return Promise.all(promises)
}