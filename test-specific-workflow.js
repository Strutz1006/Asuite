#!/usr/bin/env node

/**
 * Specific Cross-App Workflow Test - Goal to Task Alignment
 */

import puppeteer from 'puppeteer'

async function testGoalTaskAlignment() {
  console.log('🔗 Testing Goal-to-Task Alignment Workflow')
  console.log('==========================================')
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  })
  
  try {
    // Step 1: Open Align app and check for goals
    const alignPage = await browser.newPage()
    await alignPage.goto('http://localhost:5173', { waitUntil: 'networkidle2' })
    
    console.log('✅ Align app loaded')
    
    // Check if we can find our test identifiers
    const suiteNav = await alignPage.$('[data-testid="suite-nav"]')
    const notificationBell = await alignPage.$('[data-testid="notification-bell"]')
    const connectionStatus = await alignPage.$('[data-testid="connection-status"]')
    
    console.log(`📊 Component Status:`)
    console.log(`  Suite Navigation: ${suiteNav ? '✅ Found' : '❌ Missing'}`)
    console.log(`  Notification Bell: ${notificationBell ? '✅ Found' : '❌ Missing'}`)
    console.log(`  Connection Status: ${connectionStatus ? '✅ Found' : '❌ Missing'}`)
    
    // Step 2: Open Drive app and check cross-app components
    const drivePage = await browser.newPage()
    await drivePage.goto('http://localhost:5179', { waitUntil: 'networkidle2' })
    
    console.log('✅ Drive app loaded')
    
    // Check for cross-app goal selector in task creation
    const taskButtons = await drivePage.$$('button')
    console.log(`📝 Found ${taskButtons.length} buttons in Drive app`)
    
    // Look for any elements that might contain "goal" text
    const goalElements = await drivePage.$$eval('*', elements => 
      elements.filter(el => el.textContent?.toLowerCase().includes('goal')).length
    )
    console.log(`🎯 Found ${goalElements} elements containing 'goal' text`)
    
    // Step 3: Test navigation between apps
    console.log('\n🚀 Testing Cross-App Navigation:')
    
    // Try clicking suite navigation in Align to go to Drive
    await alignPage.bringToFront()
    const driveLink = await alignPage.$('a[href*="5179"], a[href*="drive"]')
    
    if (driveLink) {
      console.log('✅ Found Drive link in Align app')
      // Note: Won't actually click due to different ports in development
    } else {
      console.log('⚠️ Drive link not found (expected in development)')
    }
    
    // Step 4: Test real-time components
    console.log('\n⚡ Testing Real-time Components:')
    
    if (connectionStatus) {
      const statusText = await alignPage.$eval('[data-testid="connection-status"]', 
        el => el.textContent
      )
      console.log(`📡 Connection Status: ${statusText}`)
    }
    
    if (notificationBell) {
      const bellVisible = await alignPage.$eval('[data-testid="notification-bell"]', 
        el => el.offsetParent !== null
      )
      console.log(`🔔 Notification Bell Visible: ${bellVisible}`)
    }
    
    console.log('\n🎉 Cross-App Workflow Test Complete!')
    
  } catch (error) {
    console.error('❌ Test Error:', error.message)
  } finally {
    await browser.close()
  }
}

// For ES modules compatibility
const fileUrl = new URL(`file://${process.argv[1]}`).href
if (import.meta.url === fileUrl) {
  testGoalTaskAlignment().catch(console.error)
}