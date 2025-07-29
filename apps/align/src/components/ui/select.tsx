import React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(value)

  React.useEffect(() => {
    setSelectedValue(value)
  }, [value])

  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === SelectTrigger) {
          return React.cloneElement(child as any, {
            onClick: () => setIsOpen(!isOpen),
            isOpen,
            selectedValue
          })
        }
        if (React.isValidElement(child) && child.type === SelectContent) {
          return isOpen ? React.cloneElement(child as any, {
            onSelect: (itemValue: string) => {
              onValueChange(itemValue)
              setSelectedValue(itemValue)
              setIsOpen(false)
            }
          }) : null
        }
        return child
      })}
    </div>
  )
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen?: boolean
  selectedValue?: string
  children?: React.ReactNode
}

export function SelectTrigger({ 
  className, 
  isOpen, 
  selectedValue, 
  children, 
  ...props 
}: SelectTriggerProps) {
  return (
    <button
      className={cn(
        'glass-card flex items-center justify-between w-full px-3 py-2 text-sm text-slate-200 border border-slate-600 rounded-lg hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-sky-500/50',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
    </button>
  )
}

interface SelectValueProps {
  placeholder?: string
}

export function SelectValue({ placeholder }: SelectValueProps) {
  return <span>{placeholder}</span>
}

interface SelectContentProps {
  children: React.ReactNode
  onSelect?: (value: string) => void
}

export function SelectContent({ children, onSelect }: SelectContentProps) {
  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-1 glass-card border border-slate-600 rounded-lg shadow-lg">
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === SelectItem) {
          return React.cloneElement(child as any, { onSelect })
        }
        return child
      })}
    </div>
  )
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  onSelect?: (value: string) => void
}

export function SelectItem({ value, children, onSelect }: SelectItemProps) {
  return (
    <button
      className="w-full px-3 py-2 text-sm text-left text-slate-200 hover:bg-slate-800/50 first:rounded-t-lg last:rounded-b-lg"
      onClick={() => onSelect?.(value)}
    >
      {children}
    </button>
  )
}