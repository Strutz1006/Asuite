import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import KPIsPage from '@/features/kpis/pages/KPIsPage'
import BuilderPage from '@/features/builder/pages/BuilderPage'
import AnalyticsPage from '@/features/analytics/pages/AnalyticsPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/kpis" element={<KPIsPage />} />
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </Layout>
  )
}

export default App