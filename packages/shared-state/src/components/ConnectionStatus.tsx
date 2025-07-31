import React from 'react'
import { Wifi, WifiOff } from 'lucide-react'
import { useSharedState } from '../store'

interface ConnectionStatusProps {
  className?: string
}

export function ConnectionStatus({ className = '' }: ConnectionStatusProps) {
  const { connectionStatus } = useSharedState()
  
  const isConnected = connectionStatus === 'connected'
  
  return (
    <div 
      data-testid="connection-status"
      className={`flex items-center gap-1 text-xs ${className}`}
      title={`Connection: ${connectionStatus}`}
    >
      {isConnected ? (
        <>
          <Wifi className="w-3 h-3 text-green-400" />
          <span className="text-green-400 font-medium">Live</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3 text-red-400" />
          <span className="text-red-400 font-medium">Offline</span>
        </>
      )}
    </div>
  )
}