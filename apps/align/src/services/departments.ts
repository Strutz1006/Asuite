import type { Department, ApiResponse } from '../types/database'

const API_BASE_URL = 'http://localhost:3001/api';

export class DepartmentsService {
  // Get authentication token from localStorage
  private static getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Get all departments in the organization
  static async getDepartments(organizationId?: string): Promise<ApiResponse<Department[]>> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return { error: { message: 'Authentication required' } };
      }

      const url = organizationId 
        ? `${API_BASE_URL}/align/departments?organizationId=${organizationId}`
        : `${API_BASE_URL}/align/departments`;

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
        return { error: { message: data.error || 'Failed to fetch departments' } };
      }

      return { data: data.departments || [] };
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to fetch departments' 
        } 
      };
    }
  }

  // Get department by ID
  static async getDepartment(departmentId: string): Promise<ApiResponse<Department>> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return { error: { message: 'Authentication required' } };
      }

      const response = await fetch(`${API_BASE_URL}/align/departments/${departmentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.error || 'Failed to fetch department' } };
      }

      return { data: data.department };
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to fetch department' 
        } 
      };
    }
  }

  // Update department
  static async updateDepartment(departmentId: string, updates: Partial<Department>): Promise<ApiResponse<Department>> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return { error: { message: 'Authentication required' } };
      }

      const response = await fetch(`${API_BASE_URL}/align/departments/${departmentId}`, {
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
        return { error: { message: data.error || 'Failed to update department' } };
      }

      return { data: data.department };
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to update department' 
        } 
      };
    }
  }

  // Create new department
  static async createDepartment(departmentData: Omit<Department, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Department>> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return { error: { message: 'Authentication required' } };
      }

      const response = await fetch(`${API_BASE_URL}/align/departments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(departmentData)
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.error || 'Failed to create department' } };
      }

      return { data: data.department };
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to create department' 
        } 
      };
    }
  }

  // Delete department
  static async deleteDepartment(departmentId: string): Promise<ApiResponse<void>> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return { error: { message: 'Authentication required' } };
      }

      const response = await fetch(`${API_BASE_URL}/align/departments/${departmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        return { error: { message: data.error || 'Failed to delete department' } };
      }

      return {};
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to delete department' 
        } 
      };
    }
  }
}