import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Target, BarChart3, TrendingUp, Menu, X, Grid3X3, Zap, Activity, Eye, Workflow, CheckSquare, FolderOpen, ListTodo, Calendar, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useDevAuth } from '@aesyros/auth' 
import { CrossAppNotificationBell, ConnectionStatus } from '@aesyros/shared-state'

interface LayoutProps {
  children: ReactNode
}

const suiteApps = [
  { name: 'Align', href: '#', icon: Target },
  { name: 'Drive', href: '/', icon: CheckSquare, active: true },
  { name: 'Pulse', href: '#', icon: Activity },
  { name: 'Catalyst', href: '#', icon: Zap },
  { name: 'Flow', href: '#', icon: Workflow },
  { name: 'Foresight', href: '#', icon: Eye },
]

const navItems = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Tasks', href: '/tasks', icon: ListTodo },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
]

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useDevAuth()
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top Navigation Bar - Suite Apps */}
      <header className="glass-card border-b border-slate-700/80 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Suite Brand */}
            <div className="flex items-center">
              <Grid3X3 className="h-6 w-6 text-emerald-400" />
              <span className="ml-2 text-lg font-bold text-slate-100">
                Aesyros <span className="text-emerald-400">Suite</span>
              </span>
            </div>

            {/* Suite Apps Navigation */}
            <nav data-testid="suite-nav" className="hidden md:flex space-x-6">
              {suiteApps.map((app) => {
                const Icon = app.icon
                return (
                  <Link
                    key={app.name}
                    to={app.href}
                    className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      app.active
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                        : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {app.name}
                  </Link>
                )
              })}
            </nav>

            {/* User Menu & Mobile Apps Menu Button */}
            <div className="flex items-center space-x-4">
              {/* User Info */}
              {user && (
                <div className="hidden md:flex items-center space-x-3">
                  {isDevelopment && (
                    <span className="text-xs text-yellow-400 font-medium px-2 py-1 bg-yellow-500/20 rounded">
                      DEV MODE
                    </span>
                  )}
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-300" />
                    </div>
                    <div className="hidden lg:block text-right">
                      <p className="text-sm font-medium text-slate-200">{user.full_name}</p>
                      <p className="text-xs text-slate-400">{user.role}</p>
                    </div>
                  </div>
                  <ConnectionStatus className="mr-2" />
                  <CrossAppNotificationBell />
                  <button
                    onClick={logout}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              )}
              
              {/* Mobile Apps Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-slate-300 hover:text-slate-100 p-2"
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Apps Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-700/80">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {suiteApps.map((app) => {
                  const Icon = app.icon
                  return (
                    <Link
                      key={app.name}
                      to={app.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        app.active
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                          : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {app.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Layout with Side Menu */}
      <div className="flex flex-1">
        {/* Side Menu */}
        <aside className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col h-0 flex-1 glass-card border-r border-slate-700/80">
              {/* App Logo */}
              <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-slate-700/80">
                <div className="flex items-center">
                  <CheckSquare className="h-8 w-8 text-orange-400" />
                  <span className="ml-2 text-xl font-bold text-slate-100">
                    Aesyros <span className="text-orange-400">Drive</span>
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50'
                          : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Mobile Header for App Navigation */}
          <header className="glass-card border-b border-slate-700/80 md:hidden">
            <div className="flex justify-between items-center h-16 px-4">
              {/* Logo */}
              <div className="flex items-center">
                <CheckSquare className="h-8 w-8 text-orange-400" />
                <span className="ml-2 text-xl font-bold text-slate-100">
                  Aesyros <span className="text-orange-400">Drive</span>
                </span>
              </div>

              {/* Mobile menu button */}
              <button
                data-testid="mobile-menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-300 hover:text-slate-100 p-2"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="border-t border-slate-700/80">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.href
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50'
                            : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-x-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}