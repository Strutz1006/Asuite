import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

export function Button({ className, variant = 'default', size = 'default', ...props }: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50'
  
  const variantClasses = {
    default: 'glass-button text-slate-100 hover:bg-sky-500/20 border border-sky-500/50',
    outline: 'glass-card text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 border border-slate-600',
    ghost: 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50'
  }
  
  const sizeClasses = {
    default: 'px-4 py-2 text-sm',
    sm: 'px-3 py-1.5 text-xs',
    lg: 'px-6 py-3 text-base'
  }

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}