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
      name: 'pulse', 
      title: 'Pulse', 
      description: 'KPI Monitoring',
      port: 5177,
      icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z',
      color: 'sky'
    },
    { 
      name: 'catalyst', 
      title: 'Catalyst', 
      description: 'Change Management',
      port: 5174,
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      color: 'sky'
    },
    { 
      name: 'flow', 
      title: 'Flow', 
      description: 'Process Validation',
      port: 5175,
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      color: 'sky'
    },
    { 
      name: 'foresight', 
      title: 'Foresight', 
      description: 'Strategy Sandbox',
      port: 5176,
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      color: 'sky'
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
    <div className="lg:ml-64">
      <div className="bg-slate-800/90 backdrop-blur-lg border-b border-slate-700 px-6 py-4 relative z-20" style={{ minHeight: '72px' }}>
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-xl font-bold text-white">Aesyros Suite</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0" style={{ minWidth: '700px' }}>
            {apps.map((app) => {
              const isActive = app.name === currentApp;
              
              return (
                <button
                  key={app.name}
                  onClick={() => handleNavigation(app)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg border transition-all min-w-[120px] max-w-[140px] justify-center flex-shrink-0
                    ${isActive 
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                      : 'bg-slate-700/50 text-slate-400 border-slate-600/50 hover:bg-slate-600/50 hover:text-slate-300'
                    }
                  `}
                  style={{ width: '130px', height: '40px' }}
                  title={app.description}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={app.icon} />
                  </svg>
                  <span className="font-medium whitespace-nowrap">{app.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Standardized Header with Tagline */}
      <header className="bg-slate-800/90 backdrop-blur-lg border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div></div>
          
          <div className="flex-1 flex justify-center">
            <div className="text-5xl font-bold text-sky-400 tracking-wide">
              Strategy to Impact, Simplified
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>All systems operational</span>
            </div>
            <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">JD</span>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default AppNavigation;