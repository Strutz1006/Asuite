import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { AuthService } from '../services/auth'
import type { User } from '../types/database'

interface AuthContextType {
  user: any | null
  profile: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: { message: string } }>
  signUp: (email: string, password: string, userData: {
    full_name: string;
    organization_id: string;
    department_id?: string;
    job_title?: string;
  }) => Promise<{ error?: { message: string } }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<{
    full_name: string;
    job_title: string;
    department_id: string;
    primary_team_id: string;
    preferences: Record<string, any>;
  }>) => Promise<{ error?: { message: string } }>
  isAdmin: boolean
  isManager: boolean
  organizationId: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session
  useEffect(() => {
    const initAuth = async () => {
      try {
        // First check if dev mode bypass is enabled
        const devBypass = localStorage.getItem('aesyros_dev_bypass');
        if (devBypass === 'true') {
          console.log('Dev bypass enabled, setting up mock user');
          const storedOrg = localStorage.getItem('aesyros_dev_organization_id');
          const storedUser = localStorage.getItem('aesyros_dev_user_id');
          
          if (storedOrg && storedUser) {
            const mockUser = { id: storedUser, email: 'dev@example.com' }
            const mockProfile: User = {
              id: storedUser,
              email: 'dev@example.com',
              full_name: 'Development User',
              role: 'admin',
              organization_id: storedOrg,
              department_id: null,
              job_title: 'Developer',
              is_active: true,
              preferences: {},
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            
            setUser(mockUser);
            setProfile(mockProfile);
            setLoading(false);
            return;
          }
        }

        // Check for backend JWT token session
        const result = await AuthService.getCurrentUser();
        
        if (result.error) {
          console.error('Session error:', result.error);
          setUser(null);
          setProfile(null);
        } else if (result.data?.user) {
          console.log('Found backend session for user:', result.data.user.email);
          setUser(result.data.user);
          setProfile(result.data.profile);
        } else {
          console.log('No session found, user not authenticated');
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await AuthService.signIn(email, password)
    if (result.data) {
      setUser(result.data.user)
      setProfile(result.data.profile)
      return {}
    }
    return { error: result.error || { message: 'Sign in failed' } }
  }

  const signUp = async (
    email: string, 
    password: string, 
    userData: {
      full_name: string;
      organization_id: string;
      department_id?: string;
      job_title?: string;
    }
  ) => {
    const result = await AuthService.signUp(email, password, userData)
    if (result.data) {
      setUser(result.data.user)
      setProfile(result.data.profile)
      return {}
    }
    return { error: result.error || { message: 'Sign up failed' } }
  }

  const signOut = async () => {
    await AuthService.signOut()
    // Clear dev mode bypass
    localStorage.removeItem('aesyros_dev_bypass')
    localStorage.removeItem('aesyros_dev_organization_id')
    localStorage.removeItem('aesyros_dev_user_id')
    setUser(null)
    setProfile(null)
  }

  const updateProfile = async (updates: Partial<{
    full_name: string;
    job_title: string;
    department_id: string;
    primary_team_id: string;
    preferences: Record<string, any>;
  }>) => {
    if (!user) return { error: { message: 'User not authenticated' } }

    const result = await AuthService.updateProfile(user.id, updates)
    if (result.data) {
      setProfile(result.data)
      return {}
    }
    return { error: result.error || { message: 'Profile update failed' } }
  }

  const isAdmin = profile?.role === 'admin'
  const isManager = profile?.role === 'admin' || profile?.role === 'manager'
  const organizationId = profile?.organization_id || null

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAdmin,
    isManager,
    organizationId
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protecting routes (disabled during development)
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    // Skip authentication during development
    return <Component {...props} />
  }
}

// Hook for checking permissions
export function usePermissions() {
  const { profile, user } = useAuth()

  const checkPermission = async (permission: string, resourceId?: string): Promise<boolean> => {
    if (!user || !profile) return false
    return AuthService.checkPermission(user.id, permission, resourceId)
  }

  const isAdmin = async (): Promise<boolean> => {
    if (!user) return false
    return AuthService.isAdmin(user.id)
  }

  const isManager = async (): Promise<boolean> => {
    if (!user) return false
    return AuthService.isManager(user.id)
  }

  const isDepartmentHead = async (departmentId?: string): Promise<boolean> => {
    if (!user) return false
    return AuthService.isDepartmentHead(user.id, departmentId)
  }

  const isTeamLead = async (teamId?: string): Promise<boolean> => {
    if (!user) return false
    return AuthService.isTeamLead(user.id, teamId)
  }

  return {
    checkPermission,
    isAdmin,
    isManager,
    isDepartmentHead,
    isTeamLead
  }
}