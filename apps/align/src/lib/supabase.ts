import { createClient } from '@supabase/supabase-js'

// Primary environment variables
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if we have placeholder values (indicating development without real config)
const hasPlaceholderValues = supabaseUrl === 'your-supabase-url' || supabaseAnonKey === 'your-supabase-anon-key'

// Fallback for development if env vars aren't loaded or have placeholder values
if (!supabaseUrl || !supabaseAnonKey || hasPlaceholderValues) {
  console.warn('Environment variables not loaded or have placeholder values, using fallback values')
  supabaseUrl = 'https://hucqmzhvuccrxgevxxfc.supabase.co'
  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1Y3Ftemh2dWNjcnhnZXZ4eGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMDMwMjcsImV4cCI6MjA2NzU3OTAyN30.4U2wq3vPsf1xRxtXQExyhNXNglaNJsQLTFgl0mIvC_M'
}

// Debug logging for development
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key exists:', !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    VITE_SUPABASE_URL: supabaseUrl,
    VITE_SUPABASE_ANON_KEY: !!supabaseAnonKey
  })
  throw new Error('Supabase URL and anonymous key are required.')
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  console.error('Invalid Supabase URL format:', supabaseUrl)
  throw new Error(`Invalid Supabase URL: ${supabaseUrl}`)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
