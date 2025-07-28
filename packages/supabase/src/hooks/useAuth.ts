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

  useEffect(() => {
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
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: false,
        error: null
      }))
    })

    return () => subscription.unsubscribe()
  }, [])

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