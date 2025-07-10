import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { ProtectedRoute, UnauthorizedPage } from './components/ProtectedRoute';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import ScenariosPage from './features/scenarios/pages/ScenariosPage';
import InsightsPage from './features/insights/pages/InsightsPage';
import NaturalLanguageScenarioPage from './features/natural-language/pages/NaturalLanguageScenarioPage';
import ScenarioRecommendationPage from './features/recommendations/pages/ScenarioRecommendationPage';
import SensitivityAnalysisPage from './features/sensitivity-analysis/pages/SensitivityAnalysisPage';
import BatchRunsPage from './features/batch-runs/pages/BatchRunsPage';
import CollaborationPage from './features/collaboration/pages/CollaborationPage';
import VersioningPage from './features/versioning/pages/VersioningPage';
import DataSyncPage from './features/data-sync/pages/DataSyncPage';
import AlertsPage from './features/alerts/pages/AlertsPage';
import OnboardingPage from './features/onboarding/pages/OnboardingPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="scenarios" element={
            <ProtectedRoute feature="scenarios">
              <ScenariosPage />
            </ProtectedRoute>
          } />
          <Route path="scenarios/:id" element={
            <ProtectedRoute feature="scenarios">
              <ScenariosPage />
            </ProtectedRoute>
          } />
          <Route path="scenarios/:id/edit" element={
            <ProtectedRoute feature="edit-scenario">
              <ScenariosPage />
            </ProtectedRoute>
          } />
          <Route path="scenarios/new" element={
            <ProtectedRoute feature="create-scenario">
              <ScenariosPage />
            </ProtectedRoute>
          } />
          <Route path="insights" element={
            <ProtectedRoute feature="insights">
              <InsightsPage />
            </ProtectedRoute>
          } />
          <Route path="natural-language" element={
            <ProtectedRoute feature="natural-language">
              <NaturalLanguageScenarioPage />
            </ProtectedRoute>
          } />
          <Route path="recommendations" element={
            <ProtectedRoute feature="recommendations">
              <ScenarioRecommendationPage />
            </ProtectedRoute>
          } />
          <Route path="sensitivity-analysis" element={
            <ProtectedRoute feature="sensitivity-analysis">
              <SensitivityAnalysisPage />
            </ProtectedRoute>
          } />
          <Route path="batch-runs" element={
            <ProtectedRoute feature="batch-runs">
              <BatchRunsPage />
            </ProtectedRoute>
          } />
          <Route path="collaboration" element={
            <ProtectedRoute feature="collaboration">
              <CollaborationPage />
            </ProtectedRoute>
          } />
          <Route path="versioning" element={
            <ProtectedRoute feature="versioning">
              <VersioningPage />
            </ProtectedRoute>
          } />
          <Route path="data-sync" element={
            <ProtectedRoute feature="admin">
              <DataSyncPage />
            </ProtectedRoute>
          } />
          <Route path="alerts" element={
            <ProtectedRoute feature="admin">
              <AlertsPage />
            </ProtectedRoute>
          } />
          <Route path="onboarding" element={<OnboardingPage />} />
          <Route path="unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;