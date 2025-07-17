import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface GlassCardProps {
  children: ReactNode
  className?: string
  animated?: boolean
  hover?: boolean
}

export function GlassCard({ 
  children, 
  className = '', 
  animated = false, 
  hover = false 
}: GlassCardProps) {
  const baseClasses = "bg-slate-800/60 backdrop-blur-xl border border-slate-700/80 rounded-2xl"
  const hoverClasses = hover ? "hover:bg-slate-800/80 hover:border-slate-600/80 transition-all duration-200" : ""
  
  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`${baseClasses} ${hoverClasses} ${className}`}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  )
}