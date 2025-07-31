import { useState, useEffect } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../client'

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: AuthError | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  })

  // Mock user for development mode
  const mockUser = process.env.NODE_ENV === 'development' ? {
    id: '550e8400-e29b-41d4-a716-446655440001', // Proper UUID format
    email: 'dev@aesyros.com',
    user_metadata: {
      full_name: 'Dev User'
    },
    role: 'authenticated',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    aud: 'authenticated',
    app_metadata: {},
    identities: [],
    factors: []
  } as User : null

  useEffect(() => {
    // In development mode, use mock user
    if (process.env.NODE_ENV === 'development') {
      setState(prev => ({
        ...prev,
        user: mockUser,
        session: null, // Mock session not needed for dev
        loading: false,
        error: null
      }))
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      setState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: false,
        error
      }))
    })

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: false,
        error: null
      }))
    })

    return () => subscription.unsubscribe()
  }, []) // Remove mockUser dependency to prevent infinite loop

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    setState(prev => ({
      ...prev,
      loading: false,
      error
    }))

    return { data, error }
  }

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })

    setState(prev => ({
      ...prev,
      loading: false,
      error
    }))

    return { data, error }
  }

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    const { error } = await supabase.auth.signOut()

    setState(prev => ({
      ...prev,
      loading: false,
      error
    }))

    return { error }
  }

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    return { data, error }
  }

  const updatePassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password
    })

    return { data, error }
  }

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword
  }
}