import React from 'react'
import { cn } from '@/lib/utils'

interface TooltipProviderProps {
  children: React.ReactNode
}

export function TooltipProvider({ children }: TooltipProviderProps) {
  return <>{children}</>
}

interface TooltipProps {
  children: React.ReactNode
}

export function Tooltip({ children }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <div className="relative inline-block">
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === TooltipTrigger) {
          return React.cloneElement(child as any, {
            onMouseEnter: () => setIsVisible(true),
            onMouseLeave: () => setIsVisible(false)
          })
        }
        if (React.isValidElement(child) && child.type === TooltipContent) {
          return isVisible ? child : null
        }
        return child
      })}
    </div>
  )
}

interface TooltipTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function TooltipTrigger({ children, ...props }: TooltipTriggerProps) {
  return (
    <div {...props}>
      {children}
    </div>
  )
}

interface TooltipContentProps {
  children: React.ReactNode
  className?: string
}

export function TooltipContent({ children, className }: TooltipContentProps) {
  return (
    <div
      className={cn(
        'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-slate-200 glass-card border border-slate-600 rounded whitespace-nowrap z-50',
        className
      )}
    >
      {children}
    </div>
  )
}