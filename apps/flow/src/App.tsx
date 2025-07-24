import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './features/dashboard/pages/DashboardPage'
import DocumentsPage from './features/documents/pages/DocumentsPage'
import CompliancePage from './features/compliance/pages/CompliancePage'
import AnalyticsPage from './features/analytics/pages/AnalyticsPage'
import DocumentAnalyzer from './features/analysis/components/DocumentAnalyzer'
import ProcessMapper from './features/mapping/components/ProcessMapper'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/analyzer" element={<DocumentAnalyzer />} />
          <Route path="/mapper" element={<ProcessMapper />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App