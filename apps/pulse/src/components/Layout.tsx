import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppNavigation } from '@aesyros/ui';
import { Icon } from '../features/shared/components';

const Layout: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans">
      {/* Suite Navigation */}
      <AppNavigation currentApp="pulse" />
      
      {/* App Header */}
      <header className="bg-slate-800/90 backdrop-blur-lg border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z" className="w-8 h-8 text-sky-400" />
            <h1 className="text-2xl font-bold text-white">Aesyros Pulse</h1>
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

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;