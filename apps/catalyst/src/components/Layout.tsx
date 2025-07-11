import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppLayout } from '@aesyros/ui';

const Layout: React.FC = () => {
  const sidebarActions = [
    {
      to: "/journeys/new",
      icon: "M12 4v16m8-8H4",
      title: "New Journey",
      description: "Start change journey"
    },
    {
      to: "/journeys",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      title: "Active Journeys",
      description: "Manage initiatives"
    },
    {
      to: "/stakeholders",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
      title: "Stakeholders",
      description: "Engagement planning"
    },
    {
      to: "/surveys",
      icon: "M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m2-4v4m4-4v4m2-4V7a2 2 0 00-2-2h-2m0 0V3a2 2 0 10-4 0v2",
      title: "Surveys",
      description: "Collect feedback"
    },
    {
      to: "/pulse",
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534a3.374 3.374 0 00-.547-1.962l-.548-.547z",
      title: "Change Pulse",
      description: "Track readiness"
    }
  ];

  return (
    <AppLayout
      currentApp="catalyst"
      appTitle="Catalyst"
      appDescription="Change Management"
      appIcon="M13 10V3L4 14h7v7l9-11h-7z"
      sidebarActions={sidebarActions}
    >
      <Outlet />
    </AppLayout>
  );
};

export default Layout;