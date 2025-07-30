import React, { useState } from 'react'
import { Bell, X, CheckCircle, AlertCircle, Target, Clock } from 'lucide-react'
import { useNotifications, useSharedState } from '../store'

interface CrossAppNotificationBellProps {
  className?: string
}

export function CrossAppNotificationBell({ className = '' }: CrossAppNotificationBellProps) {
  const notifications = useNotifications()
  const { markNotificationRead, clearNotifications } = useSharedState()
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'goal_updated':
        return <Target className="w-4 h-4 text-blue-400" />
      case 'task_completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'project_milestone':
        return <AlertCircle className="w-4 h-4 text-orange-400" />
      case 'alignment_changed':
        return <Target className="w-4 h-4 text-purple-400" />
      default:
        return <Bell className="w-4 h-4 text-slate-400" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'goal_updated':
        return 'bg-blue-500/10 border-blue-500/30'
      case 'task_completed':
        return 'bg-green-500/10 border-green-500/30'
      case 'project_milestone':
        return 'bg-orange-500/10 border-orange-500/30'
      case 'alignment_changed':
        return 'bg-purple-500/10 border-purple-500/30'
      default:
        return 'bg-slate-500/10 border-slate-500/30'
    }
  }

  const handleNotificationClick = (notificationId: string) => {
    markNotificationRead(notificationId)
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative p-2 rounded-lg transition-colors duration-200
          ${isOpen 
            ? 'bg-orange-500/20 text-orange-300' 
            : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/40'
          }
        `}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 max-h-96 overflow-y-auto bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg shadow-xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h3 className="text-sm font-medium text-slate-200">
              Cross-App Notifications
            </h3>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="text-xs text-slate-400 hover:text-slate-300"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No notifications</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`
                      p-3 border-l-4 cursor-pointer transition-colors
                      ${notification.read 
                        ? 'bg-slate-800/30 opacity-75' 
                        : 'bg-slate-800/60 hover:bg-slate-800/80'
                      }
                      ${getNotificationColor(notification.type)}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-slate-200 truncate">
                            {notification.title}
                          </p>
                          <span className="text-xs text-slate-500 capitalize">
                            {notification.source_app}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500 capitalize">
                            {notification.entity_type}
                          </span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span className="text-xs text-slate-500">
                              {formatTimeAgo(notification.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-1"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}