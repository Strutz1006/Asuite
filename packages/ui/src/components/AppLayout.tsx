import React from 'react';
import { Link } from 'react-router-dom';
import AppNavigation from './AppNavigation';

interface AppLayoutProps {
  currentApp: 'align' | 'drive' | 'pulse' | 'catalyst' | 'flow' | 'foresight';
  appTitle: string;
  appDescription: string;
  appIcon: string;
  sidebarActions: Array<{
    to: string;
    icon: string;
    title: string;
    description: string;
  }>;
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  currentApp,
  appTitle,
  appDescription,
  appIcon,
  sidebarActions,
  children
}) => {
  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans" style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>
      <AppNavigation currentApp={currentApp} />
      
      {/* Main Layout: Sidebar + Content */}
      <div className="flex">
        {/* Fixed Sidebar */}
        <div className="w-64 bg-slate-800/90 backdrop-blur-xl border-r border-slate-700/80 min-h-[calc(100vh-160px)]" style={{ backgroundColor: 'rgba(30, 41, 59, 0.9)' }}>
          {/* App Branding */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={appIcon} />
              </svg>
              <div>
                <h1 className="text-xl font-bold text-white">{appTitle}</h1>
                <p className="text-xs text-sky-300">{appDescription}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="p-4">
            <div className="space-y-2">
              {sidebarActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.to}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 transition-colors group block"
                >
                  <svg className="w-5 h-5 text-sky-400 group-hover:text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm text-white group-hover:text-slate-100">{action.title}</div>
                    <div className="text-xs text-slate-400 group-hover:text-slate-300">{action.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;