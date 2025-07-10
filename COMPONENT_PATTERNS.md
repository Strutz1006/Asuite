# Component Patterns for Aesyros Suite

This document defines reusable component patterns and design standards across all applications.

## Design System

### Color Palette
```typescript
// Design tokens
export const colors = {
  // Primary colors
  sky: {
    50: '#f0f9ff',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7'
  },
  
  // Neutral colors
  slate: {
    50: '#f8fafc',
    200: '#e2e8f0',
    400: '#94a3b8',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a'
  },
  
  // Status colors
  green: { 400: '#4ade80', 500: '#22c55e' },
  yellow: { 400: '#facc15', 500: '#eab308' },
  red: { 400: '#f87171', 500: '#ef4444' },
  purple: { 400: '#a78bfa', 500: '#8b5cf6' }
}
```

### Glass Morphism Theme
```typescript
// Base glass card styles
export const glassStyles = {
  base: 'bg-slate-800/60 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-lg',
  hover: 'hover:border-sky-500/50 transition-colors',
  active: 'bg-sky-500/20 border-sky-500/50'
}
```

## Core UI Components

### GlassCard Component
```typescript
// packages/ui/src/components/GlassCard.tsx
import React from 'react'
import { cn } from '../utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'hover' | 'active'
  onClick?: () => void
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = 'default',
  onClick
}) => {
  const variants = {
    default: 'bg-slate-800/60 backdrop-blur-xl border border-slate-700/80',
    hover: 'bg-slate-800/60 backdrop-blur-xl border border-slate-700/80 hover:border-sky-500/50 transition-colors cursor-pointer',
    active: 'bg-sky-500/20 backdrop-blur-xl border border-sky-500/50'
  }

  return (
    <div
      className={cn(
        'rounded-2xl shadow-lg',
        variants[variant],
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
```

### Icon Component
```typescript
// packages/ui/src/components/Icon.tsx
import React from 'react'
import { cn } from '../utils'

interface IconProps {
  path: string
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'current' | 'sky' | 'green' | 'yellow' | 'red' | 'purple'
}

export const Icon: React.FC<IconProps> = ({
  path,
  className,
  size = 'md',
  color = 'current'
}) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  }

  const colors = {
    current: 'text-current',
    sky: 'text-sky-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    purple: 'text-purple-400'
  }

  return (
    <svg
      className={cn(sizes[size], colors[color], 'flex-shrink-0', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={path}
      />
    </svg>
  )
}
```

### Button Component
```typescript
// packages/ui/src/components/Button.tsx
import React from 'react'
import { cn } from '../utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-sky-500 to-blue-500 text-white hover:from-sky-600 hover:to-blue-600 focus:ring-sky-400/50',
    secondary: 'bg-slate-700 text-slate-200 hover:bg-slate-600 focus:ring-slate-400/50',
    ghost: 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-700/50',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400/50'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  return (
    <button
      className={cn(
        'font-medium rounded-lg shadow-md focus:outline-none focus:ring-4 transition-all',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  )
}
```

### Input Component
```typescript
// packages/ui/src/components/Input.tsx
import React from 'react'
import { cn } from '../utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2',
          'text-slate-200 placeholder-slate-400',
          'focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-slate-400">{helperText}</p>
      )}
    </div>
  )
}
```

### Select Component
```typescript
// packages/ui/src/components/Select.tsx
import React from 'react'
import { cn } from '../utils'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Array<{ value: string; label: string }>
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <select
        className={cn(
          'w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2',
          'text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}
```

### Modal Component
```typescript
// packages/ui/src/components/Modal.tsx
import React from 'react'
import { cn } from '../utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        'relative w-full mx-4 bg-slate-800 rounded-2xl shadow-xl border border-slate-700',
        sizes[size]
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Icon path="M6 18L18 6M6 6l12 12" size="sm" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
```

## Layout Patterns

### Page Layout
```typescript
// packages/ui/src/components/PageLayout.tsx
import React from 'react'

interface PageLayoutProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  children: React.ReactNode
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  actions,
  children
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">{title}</h1>
          {subtitle && (
            <p className="text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
      
      {/* Content */}
      {children}
    </div>
  )
}
```

### Metric Card Pattern
```typescript
// packages/ui/src/components/MetricCard.tsx
import React from 'react'
import { GlassCard } from './GlassCard'
import { Icon } from './Icon'

interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon?: string
  color?: 'sky' | 'green' | 'yellow' | 'red' | 'purple'
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  color = 'sky'
}) => {
  const colorClasses = {
    sky: 'text-sky-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    purple: 'text-purple-400'
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className={`text-2xl font-bold ${colorClasses[color]}`}>
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1 mt-1">
              <Icon
                path={change.type === 'increase' 
                  ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
                  : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                }
                size="xs"
                color={change.type === 'increase' ? 'green' : 'red'}
              />
              <span className={`text-xs ${
                change.type === 'increase' ? 'text-green-400' : 'text-red-400'
              }`}>
                {change.value}%
              </span>
            </div>
          )}
        </div>
        {icon && (
          <Icon path={icon} size="lg" color={color} />
        )}
      </div>
    </GlassCard>
  )
}
```

## Data Display Patterns

### Status Badge
```typescript
// packages/ui/src/components/StatusBadge.tsx
import React from 'react'
import { cn } from '../utils'

interface StatusBadgeProps {
  status: string
  variant?: 'default' | 'outline'
  size?: 'sm' | 'md'
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'default',
  size = 'md'
}) => {
  const getStatusColor = (status: string) => {
    const lower = status.toLowerCase()
    if (lower.includes('complete') || lower.includes('success') || lower.includes('active')) {
      return 'bg-green-500/20 text-green-300 border-green-500/30'
    }
    if (lower.includes('progress') || lower.includes('pending')) {
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    }
    if (lower.includes('warning') || lower.includes('review')) {
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    }
    if (lower.includes('error') || lower.includes('fail') || lower.includes('cancelled')) {
      return 'bg-red-500/20 text-red-300 border-red-500/30'
    }
    return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  }

  return (
    <span className={cn(
      'inline-flex items-center font-medium rounded-full',
      variant === 'outline' && 'border',
      sizes[size],
      getStatusColor(status)
    )}>
      {status}
    </span>
  )
}
```

### Progress Bar
```typescript
// packages/ui/src/components/ProgressBar.tsx
import React from 'react'
import { cn } from '../utils'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showValue?: boolean
  color?: 'sky' | 'green' | 'yellow' | 'red'
  size?: 'sm' | 'md' | 'lg'
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = true,
  color = 'sky',
  size = 'md'
}) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  const colors = {
    sky: 'bg-sky-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  }

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  }

  return (
    <div className="space-y-1">
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className="text-sm font-medium text-slate-300">{label}</span>
          )}
          {showValue && (
            <span className="text-sm font-mono text-slate-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-slate-700 rounded-full', sizes[size])}>
        <div
          className={cn('rounded-full transition-all duration-300', colors[color], sizes[size])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
```

## Form Patterns

### Form Wrapper
```typescript
// packages/ui/src/components/Form.tsx
import React from 'react'

interface FormProps {
  onSubmit: (e: React.FormEvent) => void
  children: React.ReactNode
  className?: string
}

export const Form: React.FC<FormProps> = ({
  onSubmit,
  children,
  className
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className={className}
      noValidate
    >
      {children}
    </form>
  )
}

// Usage example
export const CreateGoalForm = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <Form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Goal Title" required />
      <Select 
        label="Category" 
        options={[
          { value: 'objective', label: 'Objective' },
          { value: 'key_result', label: 'Key Result' }
        ]} 
      />
      <div className="flex justify-end gap-3">
        <Button variant="secondary">Cancel</Button>
        <Button type="submit">Create Goal</Button>
      </div>
    </Form>
  )
}
```