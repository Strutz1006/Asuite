import React from 'react'
import { Navigate } from 'react-router-dom'
import { useDevAuth } from '../DevAuthContext'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  allowedRoles?: Array<'admin' | 'manager' | 'user'>
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login',
  allowedRoles
}: AuthGuardProps) {
  const { isAuthenticated, user, loading, isDevelopment } = useDevAuth()

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // In development, always allow access
  if (isDevelopment && isAuthenticated) {
    // Check role-based access if specified
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p className="mt-2 text-gray-600">
              Your role ({user.role}) doesn't have access to this area.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Required roles: {allowedRoles.join(', ')}
            </p>
          </div>
        </div>
      )
    }
    return <>{children}</>
  }

  // Production auth check
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}