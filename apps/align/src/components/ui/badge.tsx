import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'destructive'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantClasses = {
    default: 'glass-card text-slate-200 border border-slate-600',
    outline: 'glass-card text-slate-300 border border-slate-600',
    destructive: 'bg-red-500/20 text-red-300 border border-red-500/50'
  }

  return (
    <span
      className={cn(
        'inline-block px-2 py-1 text-xs font-medium rounded-full',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}