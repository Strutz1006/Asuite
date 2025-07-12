import React from 'react';
import { GlassCard, Icon } from '../features/shared/components';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-sky-600 ${sizeClasses[size]} ${className}`} />
  );
};

interface PageLoadingProps {
  message?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-slate-400">{message}</p>
      </div>
    </div>
  );
};

interface CardLoadingProps {
  message?: string;
  height?: string;
}

export const CardLoading: React.FC<CardLoadingProps> = ({ 
  message = 'Loading...', 
  height = 'h-32' 
}) => {
  return (
    <GlassCard className={`flex items-center justify-center ${height}`}>
      <div className="text-center">
        <LoadingSpinner className="mx-auto mb-2" />
        <p className="text-sm text-slate-400">{message}</p>
      </div>
    </GlassCard>
  );
};

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'text' 
}) => {
  const baseClasses = 'animate-pulse bg-slate-700';
  
  const variantClasses = {
    text: 'h-4 rounded',
    rect: 'rounded-lg',
    circle: 'rounded-full'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
};

export const ObjectivesSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <GlassCard key={i} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Skeleton variant="circle" className="w-5 h-5" />
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-16 h-4" />
              </div>
              <Skeleton className="w-3/4 h-6 mb-2" />
              <Skeleton className="w-full h-4 mb-4" />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j}>
                    <Skeleton className="w-16 h-3 mb-1" />
                    <Skeleton className="w-20 h-4" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-right ml-4">
              <Skeleton className="w-16 h-8 mb-2" />
              <Skeleton variant="rect" className="w-24 h-2" />
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="w-64 h-8 mb-2" />
          <Skeleton className="w-32 h-4" />
        </div>
        <div className="flex gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton variant="circle" className="w-3 h-3" />
              <Skeleton className="w-16 h-4" />
            </div>
          ))}
        </div>
      </div>

      {/* Main card */}
      <GlassCard className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <Skeleton className="w-48 h-6 mb-2" />
            <Skeleton className="w-96 h-8 mb-3" />
            <div className="flex gap-6">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-20 h-4" />
            </div>
          </div>
          <div className="text-right">
            <Skeleton className="w-16 h-10 mb-2" />
            <Skeleton className="w-20 h-4" />
          </div>
        </div>
        
        <Skeleton variant="rect" className="w-full h-4 mb-8" />

        {/* Department objectives */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-800/80 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <Skeleton className="w-32 h-4 mb-1" />
                  <Skeleton className="w-20 h-3" />
                </div>
                <Skeleton variant="rect" className="w-16 h-5" />
              </div>
              <Skeleton variant="rect" className="w-full h-2 mb-3" />
              <div className="flex justify-between">
                <Skeleton className="w-8 h-3" />
                <Skeleton className="w-16 h-3" />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Stats card */}
      <GlassCard className="p-6">
        <Skeleton className="w-48 h-6 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="w-16 h-8 mb-2 mx-auto" />
              <Skeleton className="w-20 h-4 mx-auto" />
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  title,
  description,
  action
}) => {
  return (
    <GlassCard className="p-8 text-center">
      <Icon path={icon} className="w-12 h-12 mx-auto mb-4 text-slate-500" />
      <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
      <p className="text-slate-400 mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
        >
          <Icon path="M12 4v16m8-8H4" className="w-4 h-4" />
          {action.label}
        </button>
      )}
    </GlassCard>
  );
};

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showReload?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  showReload = false
}) => {
  return (
    <GlassCard className="p-8 text-center">
      <Icon 
        path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
        className="w-12 h-12 mx-auto mb-4 text-red-400" 
      />
      <h3 className="text-lg font-semibold text-red-400 mb-2">{title}</h3>
      <p className="text-slate-400 mb-6">{message}</p>
      
      <div className="flex gap-4 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
          >
            <Icon path="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" className="w-4 h-4" />
            Try Again
          </button>
        )}
        {showReload && (
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            <Icon path="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" className="w-4 h-4" />
            Reload Page
          </button>
        )}
      </div>
    </GlassCard>
  );
};