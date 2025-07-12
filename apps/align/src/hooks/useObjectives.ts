import { useState, useEffect, useCallback } from 'react'
import { ObjectivesService } from '../services/objectives'
import { useAuth } from './useAuth'
import type { 
  AlignObjective, 
  ObjectiveFilters, 
  ObjectiveSort, 
  ObjectiveStats,
  ObjectiveHierarchy,
  CreateObjectiveForm,
  PaginatedResponse
} from '../types/database'

export function useObjectives(
  filters?: ObjectiveFilters,
  sort?: ObjectiveSort,
  page?: number,
  limit?: number
) {
  const { organizationId } = useAuth()
  const [objectives, setObjectives] = useState<AlignObjective[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<any>(null)

  const fetchObjectives = useCallback(async () => {
    if (!organizationId) return

    setLoading(true)
    setError(null)

    try {
      const response: PaginatedResponse<AlignObjective> = await ObjectivesService.getObjectives(
        organizationId,
        filters,
        sort,
        page,
        limit
      )

      if (response.error) {
        setError(response.error.message)
      } else {
        setObjectives(response.data || [])
        setPagination(response.pagination)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch objectives')
    } finally {
      setLoading(false)
    }
  }, [organizationId, filters, sort, page, limit])

  useEffect(() => {
    fetchObjectives()
  }, [fetchObjectives])

  const refetch = useCallback(() => {
    fetchObjectives()
  }, [fetchObjectives])

  return {
    objectives,
    loading,
    error,
    pagination,
    refetch
  }
}

export function useObjective(id: string) {
  const [objective, setObjective] = useState<AlignObjective | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchObjective = useCallback(async () => {
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      const response = await ObjectivesService.getObjective(id)

      if (response.error) {
        setError(response.error.message)
      } else {
        setObjective(response.data || null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch objective')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchObjective()
  }, [fetchObjective])

  const refetch = useCallback(() => {
    fetchObjective()
  }, [fetchObjective])

  return {
    objective,
    loading,
    error,
    refetch
  }
}

export function useObjectiveStats() {
  const { organizationId } = useAuth()
  const [stats, setStats] = useState<ObjectiveStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    if (!organizationId) return

    setLoading(true)
    setError(null)

    try {
      const response = await ObjectivesService.getObjectiveStats(organizationId)

      if (response.error) {
        setError(response.error.message)
      } else {
        setStats(response.data || null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch objective stats')
    } finally {
      setLoading(false)
    }
  }, [organizationId])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const refetch = useCallback(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch
  }
}

export function useObjectiveHierarchy() {
  const { organizationId } = useAuth()
  const [hierarchy, setHierarchy] = useState<ObjectiveHierarchy | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHierarchy = useCallback(async () => {
    if (!organizationId) return

    setLoading(true)
    setError(null)

    try {
      const response = await ObjectivesService.getObjectiveHierarchy(organizationId)

      if (response.error) {
        setError(response.error.message)
      } else {
        setHierarchy(response.data || null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch objective hierarchy')
    } finally {
      setLoading(false)
    }
  }, [organizationId])

  useEffect(() => {
    fetchHierarchy()
  }, [fetchHierarchy])

  const refetch = useCallback(() => {
    fetchHierarchy()
  }, [fetchHierarchy])

  return {
    hierarchy,
    loading,
    error,
    refetch
  }
}

export function useObjectiveMutations() {
  const { organizationId } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createObjective = useCallback(async (data: CreateObjectiveForm) => {
    if (!organizationId) {
      setError('Organization ID required')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await ObjectivesService.createObjective(organizationId, data)

      if (response.error) {
        setError(response.error.message)
        return null
      }

      return response.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create objective'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [organizationId])

  const updateObjective = useCallback(async (id: string, data: Partial<CreateObjectiveForm>) => {
    setLoading(true)
    setError(null)

    try {
      const response = await ObjectivesService.updateObjective(id, data)

      if (response.error) {
        setError(response.error.message)
        return null
      }

      return response.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update objective'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteObjective = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await ObjectivesService.deleteObjective(id)

      if (response.error) {
        setError(response.error.message)
        return false
      }

      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete objective'
      setError(message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    createObjective,
    updateObjective,
    deleteObjective,
    loading,
    error,
    clearError: () => setError(null)
  }
}