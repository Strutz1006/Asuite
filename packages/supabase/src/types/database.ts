export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Align Tables
      align_companies: {
        Row: {
          id: string
          name: string
          description: string | null
          vision: string | null
          mission: string | null
          values: Json | null
          industry: string | null
          size: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          vision?: string | null
          mission?: string | null
          values?: Json | null
          industry?: string | null
          size?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          vision?: string | null
          mission?: string | null
          values?: Json | null
          industry?: string | null
          size?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      align_goals: {
        Row: {
          id: string
          company_id: string
          parent_id: string | null
          title: string
          description: string | null
          type: string
          status: string
          priority: string
          target_value: number | null
          current_value: number | null
          unit: string | null
          start_date: string | null
          target_date: string | null
          owner_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          parent_id?: string | null
          title: string
          description?: string | null
          type?: string
          status?: string
          priority?: string
          target_value?: number | null
          current_value?: number | null
          unit?: string | null
          start_date?: string | null
          target_date?: string | null
          owner_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          parent_id?: string | null
          title?: string
          description?: string | null
          type?: string
          status?: string
          priority?: string
          target_value?: number | null
          current_value?: number | null
          unit?: string | null
          start_date?: string | null
          target_date?: string | null
          owner_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Drive Tables
      drive_projects: {
        Row: {
          id: string
          company_id: string
          name: string
          description: string | null
          status: string
          priority: string
          health: string
          budget: number | null
          spent: number | null
          start_date: string | null
          end_date: string | null
          owner_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          description?: string | null
          status?: string
          priority?: string
          health?: string
          budget?: number | null
          spent?: number | null
          start_date?: string | null
          end_date?: string | null
          owner_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          description?: string | null
          status?: string
          priority?: string
          health?: string
          budget?: number | null
          spent?: number | null
          start_date?: string | null
          end_date?: string | null
          owner_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      drive_tasks: {
        Row: {
          id: string
          company_id: string
          project_id: string | null
          parent_id: string | null
          title: string
          description: string | null
          status: string
          priority: string
          type: string
          estimated_hours: number | null
          actual_hours: number | null
          assignee_id: string | null
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          project_id?: string | null
          parent_id?: string | null
          title: string
          description?: string | null
          status?: string
          priority?: string
          type?: string
          estimated_hours?: number | null
          actual_hours?: number | null
          assignee_id?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          project_id?: string | null
          parent_id?: string | null
          title?: string
          description?: string | null
          status?: string
          priority?: string
          type?: string
          estimated_hours?: number | null
          actual_hours?: number | null
          assignee_id?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Pulse Tables
      pulse_kpis: {
        Row: {
          id: string
          company_id: string
          name: string
          description: string | null
          category: string
          measurement_type: string
          target_value: number | null
          current_value: number | null
          unit: string | null
          frequency: string
          owner_id: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          description?: string | null
          category?: string
          measurement_type?: string
          target_value?: number | null
          current_value?: number | null
          unit?: string | null
          frequency?: string
          owner_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          description?: string | null
          category?: string
          measurement_type?: string
          target_value?: number | null
          current_value?: number | null
          unit?: string | null
          frequency?: string
          owner_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      // Additional tables would be defined here...
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}