import { useState, useEffect } from 'react'
import { PostgrestError } from '@supabase/supabase-js'
import { supabase } from '../client'

export interface QueryState<T> {
  data: T | null
  loading: boolean
  error: PostgrestError | null
}

export function useSupabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  deps: any[] = []
) {
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    let isCancelled = false

    const executeQuery = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      try {
        const { data, error } = await queryFn()
        
        if (!isCancelled) {
          setState({
            data,
            loading: false,
            error
          })
        }
      } catch (err) {
        if (!isCancelled) {
          setState({
            data: null,
            loading: false,
            error: err as PostgrestError
          })
        }
      }
    }

    executeQuery()

    return () => {
      isCancelled = true
    }
  }, deps)

  const refetch = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { data, error } = await queryFn()
      setState({
        data,
        loading: false,
        error
      })
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err as PostgrestError
      })
    }
  }

  return {
    ...state,
    refetch
  }
}

// Specific hooks for common queries
export function useSupabaseTable<T>(
  tableName: string,
  select = '*',
  filters?: Record<string, any>
) {
  return useSupabaseQuery<T[]>(async () => {
    let query = supabase.from(tableName).select(select)
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }
    
    return query
  }, [tableName, select, JSON.stringify(filters)])
}

export function useSupabaseRow<T>(
  tableName: string,
  id: string,
  select = '*'
) {
  return useSupabaseQuery<T>(async () => {
    return supabase
      .from(tableName)
      .select(select)
      .eq('id', id)
      .single()
  }, [tableName, id, select])
}