import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import ProcessesListPage from './features/processes/pages/ProcessesListPage';
import ValidatorPage from './features/validator/pages/ValidatorPage';
import ProcessMiningPage from './features/process-mining/pages/ProcessMiningPage';
import OrchestrationPage from './features/orchestration/pages/OrchestrationPage';
import CompliancePage from './features/compliance/pages/CompliancePage';
import AnalyticsPage from './features/analytics/pages/AnalyticsPage';
import VisualIntelligencePage from './features/visual/pages/VisualIntelligencePage';
import OptimizationPage from './features/optimization/pages/OptimizationPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="processes" element={<ProcessesListPage />} />
          <Route path="processes/new" element={<ProcessesListPage />} />
          <Route path="processes/:id" element={<ProcessesListPage />} />
          <Route path="processes/:id/edit" element={<ProcessesListPage />} />
          <Route path="documents" element={<DashboardPage />} />
          <Route path="documents/:id" element={<DashboardPage />} />
          <Route path="validator" element={<ValidatorPage />} />
          <Route path="mining" element={<ProcessMiningPage />} />
          <Route path="orchestration" element={<OrchestrationPage />} />
          <Route path="compliance" element={<CompliancePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="visual" element={<VisualIntelligencePage />} />
          <Route path="optimization" element={<OptimizationPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;