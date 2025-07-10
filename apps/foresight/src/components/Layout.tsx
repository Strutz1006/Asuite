import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppNavigation } from '@aesyros/ui';
import { Icon } from '../features/shared/components';

const Layout: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans">
      {/* Suite Navigation */}
      <AppNavigation currentApp="foresight" />
      
      {/* App Header */}
      <header className="bg-slate-800/90 backdrop-blur-lg border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon path="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" className="w-8 h-8 text-sky-400" />
            <h1 className="text-2xl font-bold text-white">Aesyros Foresight</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Simulation engine active</span>
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