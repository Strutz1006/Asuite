import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppNavigation } from '@aesyros/ui';
import { Icon } from '../features/shared/components';

const Layout: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans">
      {/* Suite Navigation */}
      <AppNavigation currentApp="flow" />
      
      {/* App Header */}
      <header className="bg-slate-800/90 backdrop-blur-lg border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon path="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-8 h-8 text-sky-400" />
            <h1 className="text-2xl font-bold text-white">Aesyros Flow</h1>
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