import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppNavigation, QuickActions } from '@aesyros/ui';

const Layout: React.FC = () => {
  const quickActions = [
    {
      to: "/scenarios/new",
      icon: "M12 4v16m8-8H4",
      title: "New Scenario",
      description: "Create simulation"
    },
    {
      to: "/scenarios",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      title: "Active Scenarios",
      description: "Manage simulations"
    },
    {
      to: "/sandbox",
      icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
      title: "Strategy Sandbox",
      description: "Experiment & model"
    },
    {
      to: "/insights",
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z",
      title: "Strategic Insights",
      description: "Impact analysis"
    }
  ];

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans">
      {/* Standardized Navigation with Sidebar and Tagline */}
      <AppNavigation currentApp="foresight" />
      
      {/* Quick Actions Sidebar */}
      <QuickActions 
        currentApp="foresight"
        appTitle="Foresight"
        appDescription="Strategy Sandbox"
        appIcon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        actions={quickActions}
      />

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8 lg:ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;