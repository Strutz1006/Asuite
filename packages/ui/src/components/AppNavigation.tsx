// packages/ui/src/components/AppNavigation.tsx
import React from 'react';

interface AppNavigationProps {
  currentApp: 'align' | 'catalyst' | 'flow' | 'foresight' | 'pulse';
  baseUrl?: string;
}

const AppNavigation: React.FC<AppNavigationProps> = ({ 
  currentApp, 
  baseUrl = 'http://localhost' 
}) => {
  const apps = [
    { 
      name: 'align', 
      title: 'Align', 
      description: 'Strategic Goals & OKRs',
      port: 5173,
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945',
      color: 'sky'
    },
    { 
      name: 'catalyst', 
      title: 'Catalyst', 
      description: 'Change Management',
      port: 5174,
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      color: 'blue'
    },
    { 
      name: 'flow', 
      title: 'Flow', 
      description: 'Process Validation',
      port: 5175,
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      color: 'green'
    },
    { 
      name: 'foresight', 
      title: 'Foresight', 
      description: 'Strategy Sandbox',
      port: 5176,
      icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      color: 'purple'
    },
    { 
      name: 'pulse', 
      title: 'Pulse', 
      description: 'KPI Monitoring',
      port: 5177,
      icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z',
      color: 'amber'
    }
  ];

  const handleNavigation = (app: any) => {
    if (app.name === currentApp) return;
    
    // In development, navigate to different ports
    if (baseUrl.includes('localhost')) {
      window.location.href = `${baseUrl}:${app.port}`;
    } else {
      // In production, you'd navigate to different subdomains/paths
      window.location.href = `${baseUrl}/${app.name}`;
    }
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-lg border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xl font-bold text-white">Aesyros Suite</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {apps.map((app) => {
            const isActive = app.name === currentApp;
            const colorClasses = {
              sky: 'bg-sky-500/20 text-sky-300 border-sky-500/50',
              blue: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
              green: 'bg-green-500/20 text-green-300 border-green-500/50',
              purple: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
              amber: 'bg-amber-500/20 text-amber-300 border-amber-500/50'
            };
            
            return (
              <button
                key={app.name}
                onClick={() => handleNavigation(app)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
                  ${isActive 
                    ? colorClasses[app.color as keyof typeof colorClasses]
                    : 'bg-slate-700/50 text-slate-400 border-slate-600/50 hover:bg-slate-600/50 hover:text-slate-300'
                  }
                `}
                title={app.description}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={app.icon} />
                </svg>
                <span className="font-medium">{app.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AppNavigation;