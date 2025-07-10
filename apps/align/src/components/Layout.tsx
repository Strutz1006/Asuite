import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppNavigation, QuickActions } from '@aesyros/ui';

const Layout: React.FC = () => {
  const quickActions = [
    {
      to: "/objectives/new",
      icon: "M12 4v16m8-8H4",
      title: "Add Objective",
      description: "Create strategic goal"
    },
    {
      to: "/objectives",
      icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945",
      title: "View Objectives",
      description: "Manage strategic goals"
    },
    {
      to: "/initiatives",
      icon: "M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m2-4v4m4-4v4m2-4V7a2 2 0 00-2-2h-2m0 0V3a2 2 0 10-4 0v2",
      title: "Initiatives",
      description: "Strategic initiatives"
    },
    {
      to: "/reporting",
      icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      title: "Progress Reports",
      description: "Track alignment progress"
    }
  ];

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans">
      {/* Standardized Navigation with Sidebar and Tagline */}
      <AppNavigation currentApp="align" />
      
      {/* Quick Actions Sidebar */}
      <QuickActions 
        currentApp="align"
        appTitle="Align"
        appDescription="Strategic Goals & OKRs"
        appIcon="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945"
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