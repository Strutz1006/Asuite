import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './features/dashboard/pages/DashboardPage'
import ScenariosPage from './features/scenarios/pages/ScenariosPage'
import InsightsPage from './features/insights/pages/InsightsPage'
import AnalyticsPage from './features/analytics/pages/AnalyticsPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/scenarios" element={<ScenariosPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App