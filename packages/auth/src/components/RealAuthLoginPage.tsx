import React, { useState } from 'react'
import { useAuth } from '@aesyros/supabase'
import { Mail, Lock, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react'

interface RealAuthLoginPageProps {
  onBack?: () => void
}

export function RealAuthLoginPage({ onBack }: RealAuthLoginPageProps) {
  const { signIn, signUp, loading, error } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fullName, setFullName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (mode === 'signup') {
      if (password !== confirmPassword) {
        alert('Passwords do not match')
        return
      }
      
      const { error } = await signUp(email, password, {
        full_name: fullName,
        role: 'manager' // Default role for testing
      })
      
      if (!error) {
        alert('Sign up successful! Check your email for verification.')
      }
    } else {
      const { error } = await signIn(email, password)
      if (error) {
        console.error('Sign in error:', error)
      }
    }
  }

  // Quick test users for local Supabase
  const testUsers = [
    { email: 'admin@test.com', password: 'password123', role: 'Admin' },
    { email: 'manager@test.com', password: 'password123', role: 'Manager' },
    { email: 'user@test.com', password: 'password123', role: 'User' }
  ]

  const createTestUser = async (testUser: typeof testUsers[0]) => {
    const { error } = await signUp(testUser.email, testUser.password, {
      full_name: `Test ${testUser.role}`,
      role: testUser.role.toLowerCase()
    })
    
    if (error) {
      console.error('Test user creation error:', error)
      alert(`Error creating test user: ${error.message}`)
    } else {
      alert(`Test ${testUser.role} created! Email: ${testUser.email}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            🔐 Real Authentication Test
          </h1>
          <p className="text-slate-400">
            Testing with Local Supabase
          </p>
          {onBack && (
            <button
              onClick={onBack}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300"
            >
              ← Back to Dev Auth
            </button>
          )}
        </div>

        {/* Quick Test Users */}
        <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Quick Test Users:</h3>
          <div className="space-y-2">
            {testUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {user.email} / {user.password}
                </span>
                <button
                  onClick={() => createTestUser(user)}
                  className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30"
                  disabled={loading}
                >
                  Create
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Auth Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          {/* Mode Toggle */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex bg-slate-700/50 rounded-lg p-1">
              <button
                onClick={() => setMode('signin')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'signin'
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LogIn className="w-4 h-4 inline mr-2" />
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'signup'
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserPlus className="w-4 h-4 inline mr-2" />
                Sign Up
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm">{error.message}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                  required={mode === 'signup'}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm your password"
                    required={mode === 'signup'}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              {mode === 'signin' 
                ? "Don't have an account? Click Sign Up above." 
                : "Already have an account? Click Sign In above."
              }
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Using local Supabase • Check console for detailed logs
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}