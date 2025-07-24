import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import JourneysPage from '@/features/journeys/pages/JourneysPage'
import StakeholdersPage from '@/features/stakeholders/pages/StakeholdersPage'
import AnalyticsPage from '@/features/analytics/pages/AnalyticsPage'
import JourneyBuilder from '@/features/journeys/components/JourneyBuilder'

function App() {
  return (
    <Routes>
      <Route path="/journeys/builder" element={<JourneyBuilder />} />
      <Route path="/*" element={
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/journeys" element={<JourneysPage />} />
            <Route path="/stakeholders" element={<StakeholdersPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  )
}

export default App