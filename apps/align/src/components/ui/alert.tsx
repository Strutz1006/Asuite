import React from 'react'
import { cn } from '@/lib/utils'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Alert({ className, ...props }: AlertProps) {
  return (
    <div
      className={cn(
        'glass-card border border-slate-600 p-4 rounded-lg',
        className
      )}
      {...props}
    />
  )
}

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  return (
    <p
      className={cn('text-sm text-slate-300', className)}
      {...props}
    />
  )
}