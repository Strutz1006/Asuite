import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import ScenariosPage from './features/scenarios/pages/ScenariosPage';
import InsightsPage from './features/insights/pages/InsightsPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="scenarios" element={<ScenariosPage />} />
          <Route path="scenarios/:id" element={<ScenariosPage />} />
          <Route path="scenarios/:id/edit" element={<ScenariosPage />} />
          <Route path="scenarios/new" element={<ScenariosPage />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;