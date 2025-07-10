import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppNavigation, QuickActions } from '@aesyros/ui';

const Layout: React.FC = () => {
  const quickActions = [
    {
      to: "/kpis/new",
      icon: "M12 4v16m8-8H4",
      title: "Add New KPI",
      description: "Create custom metric"
    },
    {
      to: "/advanced-builder",
      icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4",
      title: "Advanced KPI Builder",
      description: "AI-guided sophisticated KPI creation"
    },
    {
      to: "/alignment",
      icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
      title: "Strategic Alignment",
      description: "Link KPIs to objectives"
    },
    {
      to: "/data-connectivity",
      icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
      title: "Data Connectivity",
      description: "Connect data sources"
    },
    {
      to: "/dashboards",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      title: "Role-Based Dashboards",
      description: "Customized views by role"
    },
    {
      to: "#",
      icon: "M15 17h5l-5 5v-5z",
      title: "Export Report",
      description: "Generate dashboard PDF",
      isButton: true,
      onClick: () => console.log("Export report")
    }
  ];

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans">
      {/* Standardized Navigation with Sidebar and Tagline */}
      <AppNavigation currentApp="pulse" />
      
      {/* Quick Actions Sidebar */}
      <QuickActions 
        currentApp="pulse"
        appTitle="Pulse"
        appDescription="KPI Management"
        appIcon="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z"
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