import { useState, useEffect, useCallback } from 'react'
import { OrganizationsService } from '../services/organizations'
import { useAuth } from './useAuth'
import type { 
  Organization,
  Department,
  Team,
  OrganizationStructure,
  CreateDepartmentForm,
  CreateTeamForm,
  UpdateVisionMissionForm
} from '../types/database'

export function useOrganization() {
  const { organizationId } = useAuth()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrganization = useCallback(async () => {
    if (!organizationId) return

    setLoading(true)
    setError(null)

    try {
      const response = await OrganizationsService.getOrganization(organizationId)

      if (response.error) {
        setError(response.error.message)
      } else {
        setOrganization(response.data || null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch organization')
    } finally {
      setLoading(false)
    }
  }, [organizationId])

  useEffect(() => {
    fetchOrganization()
  }, [fetchOrganization])

  const updateVisionMission = useCallback(async (updates: UpdateVisionMissionForm) => {
    if (!organizationId) return null

    setLoading(true)
    setError(null)

    try {
      const response = await OrganizationsService.updateVisionMission(organizationId, updates)

      if (response.error) {
        setError(response.error.message)
        return null
      }

      setOrganization(response.data || null)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update vision/mission')
      return null
    } finally {
      setLoading(false)
    }
  }, [organizationId])

  return {
    organization,
    loading,
    error,
    updateVisionMission,
    refetch: fetchOrganization
  }
}

export function useDepartments() {
  const { organizationId } = useAuth()
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDepartments = useCallback(async () => {
    if (!organizationId) return

    setLoading(true)
    setError(null)

    try {
      const response = await OrganizationsService.getDepartments(organizationId)

      if (response.error) {
        setError(response.error.message)
      } else {
        setDepartments(response.data || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch departments')
    } finally {
      setLoading(false)
    }
  }, [organizationId])

  useEffect(() => {
    fetchDepartments()
  }, [fetchDepartments])

  const createDepartment = useCallback(async (data: CreateDepartmentForm) => {
    if (!organizationId) return null

    setLoading(true)
    setError(null)

    try {
      const response = await OrganizationsService.createDepartment(organizationId, data)

      if (response.error) {
        setError(response.error.message)
        return null
      }

      // Refresh departments list
      await fetchDepartments()
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create department')
      return null
    } finally {
      setLoading(false)
    }
  }, [organizationId, fetchDepartments])

  const updateDepartment = useCallback(async (id: string, data: Partial<CreateDepartmentForm>) => {
    setLoading(true)
    setError(null)

    try {
      const response = await OrganizationsService.updateDepartment(id, data)

      if (response.error) {
        setError(response.error.message)
        return null
      }

      // Refresh departments list
      await fetchDepartments()
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update department')
      return null
    } finally {
      setLoading(false)
    }
  }, [fetchDepartments])

  const deleteDepartment = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await OrganizationsService.deleteDepartment(id)

      if (response.error) {
        setError(response.error.message)
        return false
      }

      // Refresh departments list
      await fetchDepartments()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete department')
      return false
    } finally {
      setLoading(false)
    }
  }, [fetchDepartments])

  return {
    departments,
    loading,
    error,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    refetch: fetchDepartments
  }
}

export function useTeams(departmentId?: string) {
  const { organizationId } = useAuth()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTeams = useCallback(async () => {
    if (!organizationId) return

    setLoading(true)
    setError(null)

    try {
      const response = await OrganizationsService.getTeams(organizationId, departmentId)

      if (response.error) {
        setError(response.error.message)
      } else {
        setTeams(response.data || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch teams')
    } finally {
      setLoading(false)
    }
  }, [organizationId, departmentId])

  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  const createTeam = useCallback(async (data: CreateTeamForm) => {
    if (!organizationId) return null

    setLoading(true)
    setError(null)

    try {
      const response = await OrganizationsService.createTeam(organizationId, data)

      if (response.error) {
        setError(response.error.message)
        return null
      }

      // Refresh teams list
      await fetchTeams()
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team')
      return null
    } finally {
      setLoading(false)
    }
  }, [organizationId, fetchTeams])

  const updateTeam = useCallback(async (id: string, data: Partial<CreateTeamForm>) => {
    setLoading(true)
    setError(null)

    try {
      const response = await OrganizationsService.updateTeam(id, data)

      if (response.error) {
        setError(response.error.message)
        return null
      }

      // Refresh teams list
      await fetchTeams()
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update team')
      return null
    } finally {
      setLoading(false)
    }
  }, [fetchTeams])

  const deleteTeam = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await OrganizationsService.deleteTeam(id)

      if (response.error) {
        setError(response.error.message)
        return false
      }

      // Refresh teams list
      await fetchTeams()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete team')
      return false
    } finally {
      setLoading(false)
    }
  }, [fetchTeams])

  return {
    teams,
    loading,
    error,
    createTeam,
    updateTeam,
    deleteTeam,
    refetch: fetchTeams
  }
}

export function useOrganizationStructure() {
  const { organizationId } = useAuth()
  const [structure, setStructure] = useState<OrganizationStructure | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStructure = useCallback(async () => {
    if (!organizationId) return

    setLoading(true)
    setError(null)

    try {
      const response = await OrganizationsService.getOrganizationStructure(organizationId)

      if (response.error) {
        setError(response.error.message)
      } else {
        setStructure(response.data || null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch organization structure')
    } finally {
      setLoading(false)
    }
  }, [organizationId])

  useEffect(() => {
    fetchStructure()
  }, [fetchStructure])

  return {
    structure,
    loading,
    error,
    refetch: fetchStructure
  }
}