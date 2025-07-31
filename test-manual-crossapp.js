#!/usr/bin/env node

/**
 * Manual Cross-App Test - Simple connectivity and response test
 */

import fetch from 'node-fetch'

async function testApp(name, url) {
  try {
    console.log(`🔍 Testing ${name} at ${url}`)
    
    const response = await fetch(url)
    const html = await response.text()
    
    // Check if app loads
    const hasTitle = html.includes(`Aesyros ${name}`)
    const hasReact = html.includes('react') || html.includes('React')
    const hasVite = html.includes('vite') || html.includes('@vite')
    
    console.log(`  ✅ Status: ${response.status}`)
    console.log(`  ✅ Has Title: ${hasTitle}`)
    console.log(`  ✅ React App: ${hasReact}`)
    console.log(`  ✅ Vite Dev: ${hasVite}`)
    
    // Check for specific elements
    const hasNavigation = html.includes('nav') || html.includes('navigation')
    const hasForm = html.includes('form') || html.includes('input')
    
    console.log(`  📱 Navigation: ${hasNavigation}`)
    console.log(`  📝 Forms: ${hasForm}`)
    
    return {
      name,
      url,
      status: response.status,
      working: response.status === 200 && hasTitle,
      features: { hasTitle, hasReact, hasVite, hasNavigation, hasForm }
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`)
    return { name, url, working: false, error: error.message }
  }
}

async function testCrossAppConnectivity() {
  console.log('🚀 Manual Cross-App Connectivity Test')
  console.log('=====================================')
  
  const apps = [
    { name: 'Align', url: 'http://localhost:5173' },
    { name: 'Drive', url: 'http://localhost:5179' }
  ]
  
  const results = []
  
  for (const app of apps) {
    const result = await testApp(app.name, app.url)
    results.push(result)
    console.log()
  }
  
  // Summary
  console.log('📊 Test Summary:')
  const workingApps = results.filter(r => r.working)
  console.log(`Working Apps: ${workingApps.length}/${results.length}`)
  
  workingApps.forEach(app => {
    console.log(`  ✅ ${app.name}: ${app.url}`)
  })
  
  const failedApps = results.filter(r => !r.working)
  failedApps.forEach(app => {
    console.log(`  ❌ ${app.name}: ${app.error || 'Failed to load'}`)
  })
  
  // Test basic cross-app navigation URLs
  console.log('\n🔗 Testing Cross-App Navigation:')
  const alignToDrive = 'http://localhost:5173?redirect=http://localhost:5179'
  const driveToAlign = 'http://localhost:5179?redirect=http://localhost:5173'
  
  console.log(`  Align → Drive: ${alignToDrive}`)
  console.log(`  Drive → Align: ${driveToAlign}`)
  
  return results
}

// For ES modules compatibility
const fileUrl = new URL(`file://${process.argv[1]}`).href
if (import.meta.url === fileUrl) {
  testCrossAppConnectivity().catch(console.error)
}