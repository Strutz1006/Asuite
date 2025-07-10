import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRBAC } from '../hooks/useRBAC';
import type { Resource, Action } from '@aesyros/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  resource?: Resource;
  action?: Action;
  feature?: string;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  resource,
  action,
  feature,
  fallback,
  redirectTo = '/unauthorized'
}) => {
  const { hasPermission, canAccess } = useRBAC();

  const hasAccess = (() => {
    if (feature) {
      return canAccess(feature);
    }
    if (resource && action) {
      return hasPermission(resource, action);
    }
    return true;
  })();

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-slate-200 mb-2">Access Denied</h1>
        <p className="text-slate-400 mb-6">
          You don't have permission to access this feature.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};