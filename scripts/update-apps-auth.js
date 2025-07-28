// Script to update all apps with dev auth
// This is a helper script to quickly apply auth to all apps

const apps = [
  { name: 'Drive', path: 'drive', color: 'blue' },
  { name: 'Pulse', path: 'pulse', color: 'purple' },
  { name: 'Catalyst', path: 'catalyst', color: 'purple' },
  { name: 'Flow', path: 'flow', color: 'teal' },
  { name: 'Foresight', path: 'foresight', color: 'emerald' }
]

const authImports = `import { DevAuthProvider, useDevAuth, AuthGuard, DevLoginPage } from '@aesyros/auth'`

const appStructure = (appName, color) => `import { Routes, Route, Navigate } from 'react-router-dom'
import { DevAuthProvider, useDevAuth, AuthGuard, DevLoginPage } from '@aesyros/auth'
import Layout from '@/components/Layout'
// Import your page components here

function AppRoutes() {
  const { isAuthenticated } = useDevAuth()

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/" replace /> : 
        <DevLoginPage 
          appName="Aesyros ${appName}" 
          appColor="${color}"
          onLogin={() => window.location.href = '/'}
        />
      } />
      
      <Route path="/*" element={
        <AuthGuard>
          <Layout>
            <Routes>
              {/* Add your app routes here */}
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
      <AppRoutes />
    </DevAuthProvider>
  )
}

export default App`

console.log('Auth setup script for Aesyros Suite apps')
console.log('=====================================')
console.log('')
console.log('This script generates the auth wrapper code for each app.')
console.log('You need to manually update each app with the generated code.')
console.log('')

apps.forEach(app => {
  console.log(`\n### ${app.name} App (apps/${app.path}/src/App.tsx) ###`)
  console.log('Update package.json dependencies to include:')
  console.log('  "@aesyros/auth": "*",')
  console.log('  "@aesyros/supabase": "*",')
  console.log('')
  console.log('App.tsx structure:')
  console.log('```')
  console.log(appStructure(app.name, app.color))
  console.log('```')
})

console.log('\n\nAlso update each Layout.tsx to import and use useDevAuth for user info display.')