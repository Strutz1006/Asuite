import { createClient } from '@supabase/supabase-js'

// These would normally come from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For development, we'll create a mock client if no real credentials are provided
if (supabaseUrl === 'https://your-project.supabase.co') {
  console.warn('Using mock Supabase client for development. Configure environment variables for production.')
}