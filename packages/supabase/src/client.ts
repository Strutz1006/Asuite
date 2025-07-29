import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types/database'

// Environment variables - use import.meta.env for Vite apps
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  )
}

// Create typed Supabase client
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
)

// Export client creation function for apps that need custom configuration
export function createSupabaseClient(options?: {
  url?: string
  key?: string
  autoRefresh?: boolean
}): SupabaseClient<Database> {
  const url = options?.url || supabaseUrl
  const key = options?.key || supabaseAnonKey
  
  return createClient<Database>(url, key, {
    auth: {
      autoRefreshToken: options?.autoRefresh ?? true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })
}

export type { Database }