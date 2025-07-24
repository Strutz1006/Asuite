import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import KPIsPage from '@/features/kpis/pages/KPIsPage'
import BuilderPage from '@/features/builder/pages/BuilderPage'
import AnalyticsPage from '@/features/analytics/pages/AnalyticsPage'
import KPIBuilderPage from '@/features/builder/pages/KPIBuilderPage'
import DashboardBuilderPage from '@/features/builder/pages/DashboardBuilderPage'
import DataSourcesPage from '@/features/data/pages/DataSourcesPage'

function App() {
  return (
    <Routes>
      <Route path="/builder/kpi" element={<KPIBuilderPage />} />
      <Route path="/builder/dashboard" element={<DashboardBuilderPage />} />
      <Route path="/*" element={
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/kpis" element={<KPIsPage />} />
            <Route path="/builder" element={<BuilderPage />} />
            <Route path="/data-sources" element={<DataSourcesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  )
}

export default App