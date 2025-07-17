// Supabase database types
export interface Database {
  public: {
    Tables: {
      align_organizations: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          logo: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          logo?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          logo?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      align_objectives: {
        Row: {
          id: string
          title: string
          description: string
          status: 'draft' | 'active' | 'completed' | 'cancelled'
          priority: 'low' | 'medium' | 'high' | 'critical'
          category: 'strategic' | 'operational' | 'financial' | 'customer' | 'learning'
          progress: number
          start_date: string
          due_date: string
          owner_id: string
          organization_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          status?: 'draft' | 'active' | 'completed' | 'cancelled'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          category?: 'strategic' | 'operational' | 'financial' | 'customer' | 'learning'
          progress?: number
          start_date: string
          due_date: string
          owner_id: string
          organization_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: 'draft' | 'active' | 'completed' | 'cancelled'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          category?: 'strategic' | 'operational' | 'financial' | 'customer' | 'learning'
          progress?: number
          start_date?: string
          due_date?: string
          owner_id?: string
          organization_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      align_key_results: {
        Row: {
          id: string
          objective_id: string
          title: string
          description: string | null
          target: number
          current: number
          unit: string
          progress: number
          status: 'not-started' | 'on-track' | 'at-risk' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          objective_id: string
          title: string
          description?: string | null
          target: number
          current?: number
          unit: string
          progress?: number
          status?: 'not-started' | 'on-track' | 'at-risk' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          objective_id?: string
          title?: string
          description?: string | null
          target?: number
          current?: number
          unit?: string
          progress?: number
          status?: 'not-started' | 'on-track' | 'at-risk' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      align_progress_updates: {
        Row: {
          id: string
          objective_id: string
          key_result_id: string | null
          value: number
          note: string | null
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          objective_id: string
          key_result_id?: string | null
          value: number
          note?: string | null
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          objective_id?: string
          key_result_id?: string | null
          value?: number
          note?: string | null
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}