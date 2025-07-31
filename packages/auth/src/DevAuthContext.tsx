import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth as useSupabaseAuth } from '@aesyros/supabase'

export interface MockUser {
  id: string
  email: string
  full_name: string
  company_id: string
  company_name: string
  role: 'admin' | 'manager' | 'user'
}

interface DevAuthContextType {
  user: MockUser | null
  isAuthenticated: boolean
  isDevelopment: boolean
  login: (email?: string) => void
  logout: () => void
  loading: boolean
}

// Mock users for development
const MOCK_USERS: Record<string, MockUser> = {
  admin: {
    id: 'dev-admin-001',
    email: 'admin@aesyros.dev',
    full_name: 'Dev Admin',
    company_id: 'dev-company-001',
    company_name: 'Aesyros Dev Company',
    role: 'admin'
  },
  manager: {
    id: 'dev-manager-001',
    email: 'manager@aesyros.dev',
    full_name: 'Dev Manager',
    company_id: 'dev-company-001',
    company_name: 'Aesyros Dev Company',
    role: 'manager'
  },
  user: {
    id: 'dev-user-001',
    email: 'user@aesyros.dev',
    full_name: 'Dev User',
    company_id: 'dev-company-001',
    company_name: 'Aesyros Dev Company',
    role: 'user'
  }
}

const DevAuthContext = createContext<DevAuthContextType | undefined>(undefined)

export function DevAuthProvider({ children }: { children: React.ReactNode }) {
  const isDevelopment = import.meta.env.DEV || import.meta.env.VITE_APP_ENV === 'development'
  const forceRealAuth = import.meta.env.VITE_FORCE_REAL_AUTH === 'true'
  const [mockUser, setMockUser] = useState<MockUser | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Use real Supabase auth in production
  const supabaseAuth = useSupabaseAuth()

  useEffect(() => {
    if (isDevelopment && !forceRealAuth) {
      // Auto-login as admin in development
      const savedUser = localStorage.getItem('dev-auth-user')
      if (savedUser) {
        setMockUser(JSON.parse(savedUser))
      } else {
        // Auto-login as admin by default
        setMockUser(MOCK_USERS.admin)
        localStorage.setItem('dev-auth-user', JSON.stringify(MOCK_USERS.admin))
      }
      setLoading(false)
    }
  }, [isDevelopment, forceRealAuth])

  const login = (email?: string) => {
    if (isDevelopment && !forceRealAuth) {
      // Determine which mock user to use based on email
      let user = MOCK_USERS.admin
      if (email?.includes('manager')) {
        user = MOCK_USERS.manager
      } else if (email?.includes('user')) {
        user = MOCK_USERS.user
      }
      
      setMockUser(user)
      localStorage.setItem('dev-auth-user', JSON.stringify(user))
    } else {
      // In production, this would trigger real login flow
      console.warn('Real authentication not implemented yet')
    }
  }

  const logout = () => {
    if (isDevelopment && !forceRealAuth) {
      setMockUser(null)
      localStorage.removeItem('dev-auth-user')
    } else {
      supabaseAuth.signOut()
    }
  }

  // In production or when forced, use real auth
  if (!isDevelopment || forceRealAuth) {
    return (
      <DevAuthContext.Provider
        value={{
          user: supabaseAuth.user ? {
            id: supabaseAuth.user.id,
            email: supabaseAuth.user.email || '',
            full_name: supabaseAuth.user.user_metadata?.full_name || '',
            company_id: supabaseAuth.user.user_metadata?.company_id || '',
            company_name: supabaseAuth.user.user_metadata?.company_name || '',
            role: supabaseAuth.user.user_metadata?.role || 'user'
          } : null,
          isAuthenticated: !!supabaseAuth.user,
          isDevelopment: false,
          login: () => console.warn('Use Supabase auth in production'),
          logout: supabaseAuth.signOut,
          loading: supabaseAuth.loading
        }}
      >
        {children}
      </DevAuthContext.Provider>
    )
  }

  // Development mode with mock auth
  return (
    <DevAuthContext.Provider
      value={{
        user: mockUser,
        isAuthenticated: !!mockUser,
        isDevelopment: true,
        login,
        logout,
        loading
      }}
    >
      {children}
    </DevAuthContext.Provider>
  )
}

export function useDevAuth() {
  const context = useContext(DevAuthContext)
  if (context === undefined) {
    throw new Error('useDevAuth must be used within a DevAuthProvider')
  }
  return context
}