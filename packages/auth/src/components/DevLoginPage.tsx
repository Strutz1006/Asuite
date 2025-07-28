import React from 'react'
import { useDevAuth } from '../DevAuthContext'
import { LogIn, User, Shield, Users } from 'lucide-react'

interface DevLoginPageProps {
  appName: string
  appColor: string
  onLogin?: () => void
}

export function DevLoginPage({ appName, appColor, onLogin }: DevLoginPageProps) {
  const { login, isDevelopment } = useDevAuth()

  const handleQuickLogin = (role: 'admin' | 'manager' | 'user') => {
    login(`${role}@aesyros.dev`)
    onLogin?.()
  }

  if (!isDevelopment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Production Login Coming Soon</h1>
          <p className="mt-2 text-gray-600">Authentication will be available in production</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md w-full space-y-8">
        {/* App Header */}
        <div className="text-center">
          <div className={`mx-auto h-16 w-16 rounded-xl bg-${appColor}-100 flex items-center justify-center`}>
            <div className={`h-10 w-10 rounded-lg bg-${appColor}-600`} />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {appName} Dev Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Quick login for development testing
          </p>
        </div>

        {/* Dev Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-yellow-600 mr-2" />
            <p className="text-sm text-yellow-800">
              <strong>Development Mode:</strong> Authentication is bypassed
            </p>
          </div>
        </div>

        {/* Quick Login Options */}
        <div className="space-y-3">
          <button
            onClick={() => handleQuickLogin('admin')}
            className={`w-full flex items-center justify-between px-4 py-3 border border-transparent rounded-lg shadow-sm text-white bg-${appColor}-600 hover:bg-${appColor}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${appColor}-500 transition-colors`}
          >
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-3" />
              <span className="font-medium">Login as Admin</span>
            </div>
            <span className="text-sm opacity-75">Full access</span>
          </button>

          <button
            onClick={() => handleQuickLogin('manager')}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-3" />
              <span className="font-medium">Login as Manager</span>
            </div>
            <span className="text-sm opacity-75">Team access</span>
          </button>

          <button
            onClick={() => handleQuickLogin('user')}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <div className="flex items-center">
              <User className="h-5 w-5 mr-3" />
              <span className="font-medium">Login as User</span>
            </div>
            <span className="text-sm opacity-75">Basic access</span>
          </button>
        </div>

        {/* Production Login Form (Placeholder) */}
        <div className="mt-8 border-t pt-6">
          <p className="text-xs text-center text-gray-500 mb-4">
            Production login form (disabled in dev)
          </p>
          <form className="space-y-4 opacity-50 pointer-events-none">
            <div>
              <input
                type="email"
                placeholder="Email address"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                disabled
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                disabled
              />
            </div>
            <button
              type="submit"
              disabled
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-400"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}