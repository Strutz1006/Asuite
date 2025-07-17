import { LucideIcon } from 'lucide-react'

interface IconProps {
  icon: LucideIcon
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

export function Icon({ icon: IconComponent, className = '', size = 'md' }: IconProps) {
  return (
    <IconComponent 
      className={`${sizeClasses[size]} ${className}`}
    />
  )
}