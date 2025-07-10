# API Patterns for Aesyros Suite

This document defines consistent patterns for API integration across all applications.

## Supabase Client Setup

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
```

## Hook Patterns

### Data Fetching Hooks
```typescript
// hooks/useGoals.ts
export function useGoals() {
  return useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })
}

// hooks/useGoal.ts
export function useGoal(id: string) {
  return useQuery({
    queryKey: ['goals', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!id
  })
}
```

### Mutation Hooks
```typescript
// hooks/useCreateGoal.ts
export function useCreateGoal() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('goals')
        .insert(goal)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    }
  })
}

// hooks/useUpdateGoal.ts
export function useUpdateGoal() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Goal> & { id: string }) => {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      queryClient.invalidateQueries({ queryKey: ['goals', data.id] })
    }
  })
}
```

## Service Layer Patterns

### Base Service Class
```typescript
// services/BaseService.ts
export abstract class BaseService<T> {
  constructor(protected tableName: string) {}
  
  async findAll(filters?: Record<string, any>): Promise<T[]> {
    let query = supabase.from(this.tableName).select('*')
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }
    
    const { data, error } = await query
    if (error) throw error
    return data || []
  }
  
  async findById(id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }
  
  async create(item: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(item)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
  
  async update(id: string, updates: Partial<T>): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
  
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
```

### App-Specific Services
```typescript
// services/GoalService.ts (Align)
export class GoalService extends BaseService<Goal> {
  constructor() {
    super('goals')
  }
  
  async findByParent(parentId: string): Promise<Goal[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at')
    
    if (error) throw error
    return data || []
  }
  
  async updateProgress(id: string, progress: number): Promise<Goal> {
    return this.update(id, { progress, updated_at: new Date().toISOString() })
  }
}

// services/KPIService.ts (Pulse)
export class KPIService extends BaseService<KPI> {
  constructor() {
    super('kpis')
  }
  
  async findByCategory(category: string): Promise<KPI[]> {
    return this.findAll({ category })
  }
  
  async getKPIWithValues(id: string): Promise<KPI & { values: KPIValue[] }> {
    const { data, error } = await supabase
      .from('kpis')
      .select(`
        *,
        kpi_values (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }
}
```

## Error Handling Patterns

```typescript
// utils/errors.ts
export class APIError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 400
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function handleSupabaseError(error: any): never {
  console.error('Supabase error:', error)
  
  switch (error.code) {
    case 'PGRST116':
      throw new APIError('Resource not found', 'NOT_FOUND', 404)
    case '23505':
      throw new APIError('Resource already exists', 'CONFLICT', 409)
    case '42501':
      throw new APIError('Insufficient permissions', 'FORBIDDEN', 403)
    default:
      throw new APIError(error.message || 'An unexpected error occurred', 'INTERNAL_ERROR', 500)
  }
}
```

## Real-time Subscriptions

```typescript
// hooks/useRealtimeGoals.ts
export function useRealtimeGoals() {
  const [goals, setGoals] = useState<Goal[]>([])
  
  useEffect(() => {
    // Initial fetch
    const fetchGoals = async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching goals:', error)
        return
      }
      
      setGoals(data || [])
    }
    
    fetchGoals()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('goals-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'goals' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setGoals(prev => [payload.new as Goal, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setGoals(prev => prev.map(goal => 
              goal.id === payload.new.id ? payload.new as Goal : goal
            ))
          } else if (payload.eventType === 'DELETE') {
            setGoals(prev => prev.filter(goal => goal.id !== payload.old.id))
          }
        }
      )
      .subscribe()
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])
  
  return goals
}
```

## Type Generation

```bash
# Generate TypeScript types from Supabase schema
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/database.types.ts
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Query Optimization

```typescript
// Efficient queries with select and joins
export async function getGoalsWithUpdates(): Promise<GoalWithUpdates[]> {
  const { data, error } = await supabase
    .from('goals')
    .select(`
      *,
      goal_updates (
        id,
        value,
        comment,
        created_at,
        user:users(name, email)
      ),
      owner:users(name, email)
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}
```

## Caching Strategy

```typescript
// React Query configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error instanceof APIError && error.status >= 400 && error.status < 500) {
          return false // Don't retry client errors
        }
        return failureCount < 3
      }
    }
  }
})
```