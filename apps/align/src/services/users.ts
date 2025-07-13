import type { User, ApiResponse } from '../types/database'

const API_BASE_URL = 'http://localhost:3001/api';

export class UsersService {
  // Get authentication token from localStorage
  private static getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Get all users in the organization
  static async getUsers(organizationId?: string): Promise<ApiResponse<User[]>> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return { error: { message: 'Authentication required' } };
      }

      const url = organizationId 
        ? `${API_BASE_URL}/align/users?organizationId=${organizationId}`
        : `${API_BASE_URL}/align/users`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.error || 'Failed to fetch users' } };
      }

      return { data: data.users || [] };
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to fetch users' 
        } 
      };
    }
  }

  // Get user by ID
  static async getUser(userId: string): Promise<ApiResponse<User>> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return { error: { message: 'Authentication required' } };
      }

      const response = await fetch(`${API_BASE_URL}/align/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.error || 'Failed to fetch user' } };
      }

      return { data: data.user };
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to fetch user' 
        } 
      };
    }
  }

  // Update user
  static async updateUser(userId: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return { error: { message: 'Authentication required' } };
      }

      const response = await fetch(`${API_BASE_URL}/align/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.error || 'Failed to update user' } };
      }

      return { data: data.user };
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to update user' 
        } 
      };
    }
  }

  // Create new user
  static async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<User>> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return { error: { message: 'Authentication required' } };
      }

      const response = await fetch(`${API_BASE_URL}/align/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.error || 'Failed to create user' } };
      }

      return { data: data.user };
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to create user' 
        } 
      };
    }
  }

  // Delete user
  static async deleteUser(userId: string): Promise<ApiResponse<void>> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return { error: { message: 'Authentication required' } };
      }

      const response = await fetch(`${API_BASE_URL}/align/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        return { error: { message: data.error || 'Failed to delete user' } };
      }

      return {};
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to delete user' 
        } 
      };
    }
  }
}