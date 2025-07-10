import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import GoalsListPage from './features/goals/pages/GoalsListPage';
import GoalDetailPage from './features/goals/pages/GoalDetailPage';
import GoalFormPage from './features/goals/pages/GoalFormPage';
import AnalyticsPage from './features/analytics/pages/AnalyticsPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="goals" element={<GoalsListPage />} />
          <Route path="goals/new" element={<GoalFormPage />} />
          <Route path="goals/:id" element={<GoalDetailPage />} />
          <Route path="goals/:id/edit" element={<GoalFormPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;