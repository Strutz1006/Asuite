import React, { useState } from 'react'
import { useDevAuth } from '../DevAuthContext'
import { RealAuthLoginPage } from './RealAuthLoginPage'
import { AuthModeToggle } from './AuthModeToggle'
import { Shield, User, Building2, Mail } from 'lucide-react'

export function AuthTestPage() {
  const { user, isAuthenticated, isDevelopment, login, logout, loading } = useDevAuth()
  const [showRealAuth, setShowRealAuth] = useState(false)
  const [forceRealAuth, setForceRealAuth] = useState(
    import.meta.env.VITE_FORCE_REAL_AUTH === 'true'
  )

  if (showRealAuth) {
    return <RealAuthLoginPage onBack={() => setShowRealAuth(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            🔐 Authentication Test Page
          </h1>
          <p className="text-slate-400">
            Test both development and real authentication flows
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="mb-6 flex justify-center">
          <AuthModeToggle
            useRealAuth={forceRealAuth}
            onToggle={(useReal) => {
              setForceRealAuth(useReal)
              if (useReal) {
                alert('Real auth mode enabled! Refresh the page to apply changes.')
              }
            }}
          />
        </div>

        {/* Current User Status */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Current Authentication Status</h2>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-slate-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
              <span>Loading...</span>
            </div>
          ) : isAuthenticated && user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 font-medium">Authenticated</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">
                  {isDevelopment ? 'Development Mode' : 'Production Mode'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <User className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-sm text-slate-300">Name</div>
                    <div className="text-white font-medium">{user.full_name}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-sm text-slate-300">Email</div>
                    <div className="text-white font-medium">{user.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-sm text-slate-300">Role</div>
                    <div className="text-white font-medium capitalize">{user.role}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-sm text-slate-300">Company</div>
                    <div className="text-white font-medium">{user.company_name}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-400">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Not authenticated</span>
            </div>
          )}
        </div>

        {/* Development Auth Controls */}
        {isDevelopment && !forceRealAuth && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Development Authentication</h3>
            
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Logout
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-slate-400 text-sm mb-4">
                  Quick login as different user types:
                </p>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => login('admin@aesyros.dev')}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                  >
                    Login as Admin
                  </button>
                  <button
                    onClick={() => login('manager@aesyros.dev')}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Login as Manager
                  </button>
                  <button
                    onClick={() => login('user@aesyros.dev')}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    Login as User
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Real Auth Testing */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Real Authentication Testing</h3>
          
          <div className="space-y-4">
            <button
              onClick={() => setShowRealAuth(true)}
              className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Test Real Supabase Authentication
            </button>
            
            <div className="text-sm text-slate-400 space-y-2">
              <p>• Test sign up with new users</p>
              <p>• Test sign in with existing users</p>
              <p>• Verify JWT tokens and session management</p>
              <p>• Test logout and session cleanup</p>
            </div>
          </div>
        </div>

        {/* App Links */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Test Apps</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg hover:border-purple-400/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  🎯
                </div>
                <div>
                  <div className="text-white font-medium">Align App</div>
                  <div className="text-slate-400 text-sm">Strategic goals and OKRs</div>
                </div>
              </div>
            </a>
            
            <a
              href="http://localhost:5179"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg hover:border-blue-400/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  🚗
                </div>
                <div>
                  <div className="text-white font-medium">Drive App</div>
                  <div className="text-slate-400 text-sm">Task and project management</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}