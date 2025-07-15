import { supabase } from '../lib/supabase';
import type { User, ApiResponse } from '../types/database'

const API_BASE_URL = 'http://localhost:3001/api';

export class AuthService {
  // =========================================================================
  // AUTHENTICATION METHODS
  // =========================================================================

  static async signIn(email: string, password: string): Promise<ApiResponse<{ user: any; profile: User }>> {
    try {
      console.log('AuthService: Attempting to sign in with email:', email);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('AuthService: Backend response:', data);

      if (!response.ok) {
        console.error('AuthService: Authentication error:', data);
        return { 
          error: { 
            message: data.error || 'Sign in failed' 
          } 
        };
      }

      if (!data.success) {
        return { 
          error: { 
            message: data.error || 'Authentication failed' 
          } 
        };
      }

      console.log('AuthService: Successfully authenticated user:', data.user.email);

      // Store JWT token in localStorage
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }

      return { 
        data: { 
          user: data.user, 
          profile: data.profile 
        } 
      }
    } catch (error) {
      console.error('AuthService: Sign in error:', error);
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Sign in failed' 
        } 
      }
    }
  }

  static async signUp(
    email: string, 
    password: string, 
    userData: {
      full_name: string;
      organization_id: string;
      department_id?: string;
      job_title?: string;
    }
  ): Promise<ApiResponse<{ user: any; profile: User }>> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name
          }
        }
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error('Sign up failed')
      }

      // Create user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email!,
          full_name: userData.full_name,
          organization_id: userData.organization_id,
          department_id: userData.department_id,
          job_title: userData.job_title,
          role: 'contributor'
        })
        .select(`
          *,
          organization:organizations(*),
          department_info:departments(*),
          primary_team:teams(*)
        `)
        .single()

      if (profileError) throw profileError

      return { 
        data: { 
          user: authData.user, 
          profile: profile as User 
        } 
      }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Sign up failed' 
        } 
      }
    }
  }

  static async signOut(): Promise<ApiResponse<void>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        credentials: 'include'
      });

      // Clear token regardless of response
      localStorage.removeItem('auth_token');
      localStorage.removeItem('aesyros_dev_bypass');
      localStorage.removeItem('aesyros_dev_organization_id');
      localStorage.removeItem('aesyros_dev_user_id');

      if (!response.ok) {
        const data = await response.json();
        console.warn('Sign out error:', data);
      }

      return {}
    } catch (error) {
      // Clear token even if request fails
      localStorage.removeItem('auth_token');
      localStorage.removeItem('aesyros_dev_bypass');
      localStorage.removeItem('aesyros_dev_organization_id');
      localStorage.removeItem('aesyros_dev_user_id');
      
      console.error('Sign out error:', error);
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Sign out failed' 
        } 
      }
    }
  }

  static async getCurrentUser(): Promise<ApiResponse<{ user: any; profile: User | null }>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return { data: { user: null, profile: null } }
      }

      const response = await fetch(`${API_BASE_URL}/auth/session`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        // Token is invalid, clear it
        localStorage.removeItem('auth_token');
        return { data: { user: null, profile: null } }
      }

      const data = await response.json();

      if (!data.success) {
        localStorage.removeItem('auth_token');
        return { data: { user: null, profile: null } }
      }

      return { 
        data: { 
          user: data.user, 
          profile: data.profile 
        } 
      }
    } catch (error) {
      localStorage.removeItem('auth_token');
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to get current user' 
        } 
      }
    }
  }

  static async updateProfile(
    userId: string,
    updates: Partial<{
      full_name: string;
      job_title: string;
      department_id: string;
      primary_team_id: string;
      preferences: Record<string, any>;
    }>
  ): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select(`
          *,
          organization:organizations(*),
          department_info:departments(*),
          primary_team:teams(*)
        `)
        .single()

      if (error) throw error

      return { data: data as User }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to update profile' 
        } 
      }
    }
  }

  static async resetPassword(email: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error

      return {}
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to send reset email' 
        } 
      }
    }
  }

  static async updatePassword(newPassword: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) throw error

      return {}
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to update password' 
        } 
      }
    }
  }

  // =========================================================================
  // PERMISSION HELPERS
  // =========================================================================

  static async checkPermission(
    userId: string,
    permission: string,
    resourceId?: string
  ): Promise<boolean> {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('role, permissions, department_id, primary_team_id')
        .eq('id', userId)
        .single()

      if (!user) return false

      // Admin has all permissions
      if (user.role === 'admin') return true

      // Check role-based permissions
      if (user.role === 'manager') {
        // Managers have extended permissions
        const managerPermissions = [
          'create_objectives',
          'update_objectives',
          'delete_objectives',
          'create_teams',
          'update_teams',
          'manage_team_members'
        ]
        if (managerPermissions.includes(permission)) return true
      }

      // Check specific permissions in user.permissions
      if (user.permissions && user.permissions[permission]) {
        return true
      }

      // Check resource-specific permissions
      if (resourceId) {
        // Implementation depends on specific permission logic
        // This would need to be expanded based on requirements
      }

      return false
    } catch (error) {
      console.error('Permission check failed:', error)
      return false
    }
  }

  static async isAdmin(userId: string): Promise<boolean> {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

      return user?.role === 'admin'
    } catch (error) {
      return false
    }
  }

  static async isManager(userId: string): Promise<boolean> {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

      return user?.role === 'admin' || user?.role === 'manager'
    } catch (error) {
      return false
    }
  }

  static async isDepartmentHead(userId: string, departmentId?: string): Promise<boolean> {
    try {
      let query = supabase
        .from('departments')
        .select('id')
        .eq('head_of_department_id', userId)

      if (departmentId) {
        query = query.eq('id', departmentId)
      }

      const { data } = await query.single()
      return !!data
    } catch (error) {
      return false
    }
  }

  static async isTeamLead(userId: string, teamId?: string): Promise<boolean> {
    try {
      let query = supabase
        .from('teams')
        .select('id')
        .eq('team_lead_id', userId)

      if (teamId) {
        query = query.eq('id', teamId)
      }

      const { data } = await query.single()
      return !!data
    } catch (error) {
      return false
    }
  }
}