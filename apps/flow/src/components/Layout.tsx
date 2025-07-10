import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppNavigation, QuickActions } from '@aesyros/ui';

const Layout: React.FC = () => {
  const quickActions = [
    {
      to: "/documents",
      icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      title: "Process Documents",
      description: "Manage process library"
    },
    {
      to: "/validation",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Process Validation",
      description: "Validate & optimize"
    },
    {
      to: "/compliance",
      icon: "M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m2-4v4m4-4v4m2-4V7a2 2 0 00-2-2h-2m0 0V3a2 2 0 10-4 0v2",
      title: "Compliance Center",
      description: "Regulatory compliance"
    },
    {
      to: "/analytics",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      title: "Process Analytics",
      description: "Performance insights"
    }
  ];

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans">
      {/* Standardized Navigation with Sidebar and Tagline */}
      <AppNavigation currentApp="flow" />
      
      {/* Quick Actions Sidebar */}
      <QuickActions 
        currentApp="flow"
        appTitle="Flow"
        appDescription="Process Validation"
        appIcon="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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