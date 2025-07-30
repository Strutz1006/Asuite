import { Routes, Route, Navigate } from 'react-router-dom'
import { DevAuthProvider, useDevAuth, AuthGuard, DevLoginPage } from '@aesyros/auth'
import { CrossAppProvider } from '@aesyros/shared-state'
import Layout from '@/components/Layout'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import ProjectsPage from '@/features/projects/pages/ProjectsPage'
import TasksPage from '@/features/tasks/pages/TasksPage'
import AnalyticsPage from '@/features/analytics/pages/AnalyticsPage'
import CardsDemo from '@/features/demo/pages/CardsDemo'

function AppRoutes() {
  const { isAuthenticated } = useDevAuth()

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/" replace /> : 
        <DevLoginPage 
          appName="Aesyros Drive" 
          appColor="blue"
          onLogin={() => window.location.href = '/'}
        />
      } />
      
      <Route path="/*" element={
        <AuthGuard>
          <Layout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/demo/cards" element={<CardsDemo />} />
            </Routes>
          </Layout>
        </AuthGuard>
      } />
    </Routes>
  )
}

function App() {
  return (
    <DevAuthProvider>
      <CrossAppProvider appName="drive">
        <AppRoutes />
      </CrossAppProvider>
    </DevAuthProvider>
  )
}

export default App