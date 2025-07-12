import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import GoalsListPage from './features/goals/pages/GoalsListPage';
import GoalDetailPage from './features/goals/pages/GoalDetailPage';
import GoalFormPage from './features/goals/pages/GoalFormPage';
import AnalyticsPage from './features/analytics/pages/AnalyticsPage';
import VisionMissionPage from './features/vision-mission/pages/VisionMissionPage';
import ObjectivesPage from './features/objectives/pages/ObjectivesPage';
import UsersPage from './features/users/pages/UsersPage';
import ReportingPage from './features/reporting/pages/ReportingPage';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="vision-mission" element={<VisionMissionPage />} />
              <Route path="objectives" element={<ObjectivesPage />} />
              <Route path="objectives/new" element={<GoalFormPage />} />
              <Route path="objectives/:id" element={<GoalDetailPage />} />
              <Route path="objectives/:id/edit" element={<GoalFormPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="reporting" element={<ReportingPage />} />
              <Route path="goals" element={<GoalsListPage />} />
              <Route path="goals/new" element={<GoalFormPage />} />
              <Route path="goals/:id" element={<GoalDetailPage />} />
              <Route path="goals/:id/edit" element={<GoalFormPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;