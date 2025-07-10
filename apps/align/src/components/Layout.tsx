import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppNavigation } from '@aesyros/ui';
import { Icon } from '../features/shared/components';

const Layout: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans">
      {/* Suite Navigation */}
      <AppNavigation currentApp="align" />
      
      {/* App Header */}
      <header className="bg-slate-800/90 backdrop-blur-lg border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon path="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945" className="w-8 h-8 text-sky-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Align</h1>
              <p className="text-sm text-sky-300">for ACME Corporation</p>
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

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;