import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import KPIsListPage from './features/kpis/pages/KPIsListPage';
import KPIBuilderPage from './features/builder/pages/KPIBuilderPage';
import AnalyticsPage from './features/analytics/pages/AnalyticsPage';
import AdvancedKPIBuilderPage from './features/kpi-builder/pages/AdvancedKPIBuilderPage';
import StrategicAlignmentPage from './features/alignment/pages/StrategicAlignmentPage';
import DataConnectivityPage from './features/data-connectivity/pages/DataConnectivityPage';
import RoleBasedDashboardsPage from './features/dashboards/pages/RoleBasedDashboardsPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="kpis" element={<KPIsListPage />} />
          <Route path="kpis/new" element={<KPIBuilderPage />} />
          <Route path="builder" element={<KPIBuilderPage />} />
          <Route path="advanced-builder" element={<AdvancedKPIBuilderPage />} />
          <Route path="alignment" element={<StrategicAlignmentPage />} />
          <Route path="data-connectivity" element={<DataConnectivityPage />} />
          <Route path="dashboards" element={<RoleBasedDashboardsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
