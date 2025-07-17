import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import JourneysPage from '@/features/journeys/pages/JourneysPage'
import StakeholdersPage from '@/features/stakeholders/pages/StakeholdersPage'
import AnalyticsPage from '@/features/analytics/pages/AnalyticsPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/journeys" element={<JourneysPage />} />
        <Route path="/stakeholders" element={<StakeholdersPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </Layout>
  )
}

export default App