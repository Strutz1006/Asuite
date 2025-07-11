import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppLayout } from '@aesyros/ui';

const Layout: React.FC = () => {
  const sidebarActions = [
    {
      to: "/kpis/new",
      icon: "M12 4v16m8-8H4",
      title: "Add New KPI",
      description: "Create custom metric"
    },
    {
      to: "/kpis",
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z",
      title: "View KPIs",
      description: "Manage all KPIs"
    },
    {
      to: "/advanced-builder",
      icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4",
      title: "Advanced Builder",
      description: "AI-guided KPI creation"
    },
    {
      to: "/data-connectivity",
      icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
      title: "Data Sources",
      description: "Connect data sources"
    },
    {
      to: "/dashboards",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      title: "Dashboards",
      description: "Role-based views"
    }
  ];

  return (
    <AppLayout
      currentApp="pulse"
      appTitle="Pulse"
      appDescription="KPI Design and Tracking"
      appIcon="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z"
      sidebarActions={sidebarActions}
    >
      <Outlet />
    </AppLayout>
  );
};

export default Layout;