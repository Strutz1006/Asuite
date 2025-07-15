import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import JourneysPage from './features/journeys/pages/JourneysPage';
import StakeholdersPage from './features/stakeholders/pages/StakeholdersPage';
import InsightsPage from './features/insights/pages/InsightsPage';
import PulsePage from './features/pulse/pages/PulsePage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="journeys" element={<JourneysPage />} />
          <Route path="journeys/:id" element={<JourneysPage />} />
          <Route path="journeys/:id/edit" element={<JourneysPage />} />
          <Route path="journeys/new" element={<JourneysPage />} />
          <Route path="stakeholders" element={<StakeholdersPage />} />
          <Route path="surveys" element={<DashboardPage />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="pulse" element={<PulsePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;