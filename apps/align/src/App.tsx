import { Routes, Route, Navigate } from 'react-router-dom'
import { DevAuthProvider, useDevAuth, AuthGuard, DevLoginPage } from '@aesyros/auth'
import { CrossAppProvider } from '@aesyros/shared-state'
import { useSetupStatus } from '@/hooks/useSetupStatus'
import { Loader2 } from 'lucide-react'
import Layout from '@/components/Layout'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import VisionPage from '@/features/vision/pages/VisionPage'
import MissionPage from '@/features/mission/pages/MissionPage'
import GoalsListPage from '@/features/goals/pages/GoalsListPage'
import GoalDetailPage from '@/features/goals/pages/GoalDetailPage'
import GoalFormPage from '@/features/goals/pages/GoalFormPage'
import ObjectivesPage from '@/features/objectives/pages/ObjectivesPage'
import ObjectiveFormPage from '@/features/objectives/pages/ObjectiveFormPage'
import AnalyticsPage from '@/features/analytics/pages/AnalyticsPage'
import SetupPage from '@/features/setup/pages/SetupPage'
import SettingsPage from '@/features/settings/pages/SettingsPage'
import { AlignmentMatrixPage } from '@/features/alignment-matrix/pages/AlignmentMatrixPage'
import { ProgressTrackingPage } from '@/features/progress/pages/ProgressTrackingPage'

function AppRoutes() {
  const { isAuthenticated } = useDevAuth()
  const { isSetupComplete, loading: setupLoading } = useSetupStatus()
  
  // Show loading state while checking setup status
  if (setupLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
          <span className="text-slate-300 text-lg">Checking setup status...</span>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/" replace /> : 
        <DevLoginPage 
          appName="Aesyros Align" 
          appColor="indigo"
          onLogin={() => window.location.href = '/'}
        />
      } />
      
      <Route path="/setup" element={
        <AuthGuard>
          {isSetupComplete ? <Navigate to="/" replace /> : <SetupPage />}
        </AuthGuard>
      } />
      
      <Route path="/*" element={
        <AuthGuard>
          {!isSetupComplete ? <Navigate to="/setup" replace /> : (
            <Layout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/vision" element={<VisionPage />} />
                <Route path="/mission" element={<MissionPage />} />
                <Route path="/objectives" element={<ObjectivesPage />} />
                <Route path="/objectives/new" element={<ObjectiveFormPage />} />
                <Route path="/goals" element={<GoalsListPage />} />
                <Route path="/goals/new" element={<GoalFormPage />} />
                <Route path="/goals/:id" element={<GoalDetailPage />} />
                <Route path="/goals/:id/edit" element={<GoalFormPage />} />
                <Route path="/alignment-matrix" element={<AlignmentMatrixPage />} />
                <Route path="/progress" element={<ProgressTrackingPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </Layout>
          )}
        </AuthGuard>
      } />
    </Routes>
  )
}

function App() {
  return (
    <DevAuthProvider>
      <CrossAppProvider appName="align">
        <AppRoutes />
      </CrossAppProvider>
    </DevAuthProvider>
  )
}

export default App