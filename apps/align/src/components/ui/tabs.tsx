import React from 'react'
import { cn } from '@/lib/utils'

interface TabsProps {
  value: string
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode
}

export function Tabs({ value, onValueChange, className, children }: TabsProps) {
  return (
    <div className={cn(className)}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, { value, onValueChange })
        }
        return child
      })}
    </div>
  )
}

interface TabsListProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

export function TabsList({ value, onValueChange, children }: TabsListProps) {
  return (
    <div className="glass-card inline-flex p-1 rounded-lg border border-slate-600">
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === TabsTrigger) {
          return React.cloneElement(child as any, { 
            isActive: child.props.value === value,
            onClick: () => onValueChange?.(child.props.value)
          })
        }
        return child
      })}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  isActive?: boolean
  onClick?: () => void
  children: React.ReactNode
}

export function TabsTrigger({ value, isActive, onClick, children }: TabsTriggerProps) {
  return (
    <button
      className={cn(
        'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
        isActive 
          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50' 
          : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50'
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  currentValue?: string
  children: React.ReactNode
  className?: string
}

export function TabsContent({ value, currentValue, children, className }: TabsContentProps) {
  if (value !== currentValue) return null
  
  return <div className={className}>{children}</div>
}