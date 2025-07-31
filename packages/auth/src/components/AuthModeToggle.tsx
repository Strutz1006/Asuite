import React from 'react'
import { Shield, ShieldCheck } from 'lucide-react'

interface AuthModeToggleProps {
  useRealAuth: boolean
  onToggle: (useReal: boolean) => void
  className?: string
}

export function AuthModeToggle({ useRealAuth, onToggle, className = '' }: AuthModeToggleProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        onClick={() => onToggle(!useRealAuth)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
          ${useRealAuth 
            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50' 
            : 'bg-gray-500/20 text-gray-400 border border-gray-500/50 hover:bg-gray-500/30'
          }
        `}
        title={useRealAuth ? 'Using Real Authentication' : 'Using Dev Authentication - Click to enable real auth'}
      >
        {useRealAuth ? (
          <>
            <ShieldCheck className="w-4 h-4" />
            <span>Real Auth</span>
          </>
        ) : (
          <>
            <Shield className="w-4 h-4" />
            <span>Dev Auth</span>
          </>
        )}
      </button>
      
      <div className="text-xs text-gray-500">
        {useRealAuth ? (
          <span>🔐 Testing with Supabase Auth</span>
        ) : (
          <span>🛠️ Using mock development auth</span>
        )}
      </div>
    </div>
  )
}