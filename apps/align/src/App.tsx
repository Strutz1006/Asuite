import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import GoalsListPage from '@/features/goals/pages/GoalsListPage'
import GoalDetailPage from '@/features/goals/pages/GoalDetailPage'
import GoalFormPage from '@/features/goals/pages/GoalFormPage'
import ObjectivesPage from '@/features/objectives/pages/ObjectivesPage'
import AnalyticsPage from '@/features/analytics/pages/AnalyticsPage'

function App() {
  return (
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
  )
}

export default App