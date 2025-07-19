import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import GoalsListPage from '@/features/goals/pages/GoalsListPage'
import GoalDetailPage from '@/features/goals/pages/GoalDetailPage'
import GoalFormPage from '@/features/goals/pages/GoalFormPage'
import ObjectivesPage from '@/features/objectives/pages/ObjectivesPage'
import AnalyticsPage from '@/features/analytics/pages/AnalyticsPage'
import SetupPage from '@/features/setup/pages/SetupPage'

function App() {
  // TODO: Check if user has completed setup and redirect accordingly
  const isSetupComplete = false // This will come from Supabase later

  return (
    <Routes>
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/*" element={
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/goals" element={<GoalsListPage />} />
            <Route path="/goals/new" element={<GoalFormPage />} />
            <Route path="/goals/:id" element={<GoalDetailPage />} />
            <Route path="/goals/:id/edit" element={<GoalFormPage />} />
            <Route path="/objectives" element={<ObjectivesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  )
}

export default App