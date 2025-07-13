import type { Team, ApiResponse } from '../types/database'

const API_BASE_URL = 'http://localhost:3001/api';

export class TeamsService {
  // Get authentication token from localStorage
  private static getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Get all teams in the organization
  static async getTeams(organizationId?: string, departmentId?: string): Promise<ApiResponse<Team[]>> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return { error: { message: 'Authentication required' } };
      }

      let url = `${API_BASE_URL}/align/teams`;
      const params = new URLSearchParams();
      
      if (organizationId) params.append('organizationId', organizationId);
      if (departmentId) params.append('departmentId', departmentId);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

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
        return { error: { message: data.error || 'Failed to fetch teams' } };
      }

      return { data: data.teams || [] };
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to fetch teams' 
        } 
      };
    }
  }

  // Get team by ID
  static async getTeam(teamId: string): Promise<ApiResponse<Team>> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return { error: { message: 'Authentication required' } };
      }

      const response = await fetch(`${API_BASE_URL}/align/teams/${teamId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.error || 'Failed to fetch team' } };
      }

      return { data: data.team };
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to fetch team' 
        } 
      };
    }
  }

  // Update team
  static async updateTeam(teamId: string, updates: Partial<Team>): Promise<ApiResponse<Team>> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return { error: { message: 'Authentication required' } };
      }

      const response = await fetch(`${API_BASE_URL}/align/teams/${teamId}`, {
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
        return { error: { message: data.error || 'Failed to update team' } };
      }

      return { data: data.team };
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to update team' 
        } 
      };
    }
  }

  // Create new team
  static async createTeam(teamData: Omit<Team, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Team>> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return { error: { message: 'Authentication required' } };
      }

      const response = await fetch(`${API_BASE_URL}/align/teams`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(teamData)
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.error || 'Failed to create team' } };
      }

      return { data: data.team };
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to create team' 
        } 
      };
    }
  }

  // Delete team
  static async deleteTeam(teamId: string): Promise<ApiResponse<void>> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return { error: { message: 'Authentication required' } };
      }

      const response = await fetch(`${API_BASE_URL}/align/teams/${teamId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        return { error: { message: data.error || 'Failed to delete team' } };
      }

      return {};
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to delete team' 
        } 
      };
    }
  }
}