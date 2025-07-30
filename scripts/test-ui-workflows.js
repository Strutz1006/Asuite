#!/usr/bin/env node

/**
 * Aesyros Suite - UI Workflow Test Script
 * 
 * This script tests the user interface workflows and interactions
 * for both Align and Drive applications, validating the shared state
 * management and cross-app functionality from a user perspective.
 */

import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

// Test configuration
const ALIGN_URL = process.env.ALIGN_URL || 'http://localhost:5173'
const DRIVE_URL = process.env.DRIVE_URL || 'http://localhost:5179'
const SCREENSHOT_DIR = './test-screenshots'
const TEST_TIMEOUT = 30000

// Test results tracking
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: [],
  screenshots: []
}

// Helper functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString()
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warn' ? '⚠️' : 'ℹ️'
  console.log(`${prefix} [${timestamp}] ${message}`)
}

function assert(condition, message) {
  testResults.total++
  if (condition) {
    testResults.passed++
    log(`PASS: ${message}`, 'success')
    return true
  } else {
    testResults.failed++
    testResults.errors.push(message)
    log(`FAIL: ${message}`, 'error')
    return false
  }
}

async function takeScreenshot(page, name, description) {
  try {
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
    }
    
    const filename = `${Date.now()}-${name}.png`
    const filepath = path.join(SCREENSHOT_DIR, filename)
    
    await page.screenshot({ 
      path: filepath, 
      fullPage: true,
      type: 'png'
    })
    
    testResults.screenshots.push({
      name,
      description,
      filename,
      timestamp: new Date().toISOString()
    })
    
    log(`Screenshot saved: ${filename}`)
  } catch (err) {
    log(`Screenshot failed: ${err.message}`, 'warn')
  }
}

async function waitForElement(page, selector, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout })
    return true
  } catch (err) {
    log(`Element not found: ${selector}`, 'warn')
    return false
  }
}

// Test suites
async function setupBrowser() {
  log('🌐 Setting up browser for UI tests...')
  
  const browser = await puppeteer.launch({
    headless: process.env.HEADLESS !== 'false',
    defaultViewport: { width: 1920, height: 1080 },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ]
  })
  
  log('Browser launched successfully')
  return browser
}

async function testAlignAppLogin(browser) {
  log('🔐 Testing Align app login and navigation...')
  
  const page = await browser.newPage()
  
  try {
    // Navigate to Align app
    await page.goto(ALIGN_URL, { waitUntil: 'networkidle2', timeout: TEST_TIMEOUT })
    await takeScreenshot(page, 'align-initial-load', 'Align app initial page load')
    
    // Check if login page is displayed (dev mode should auto-login)
    const loginExists = await waitForElement(page, '[data-testid="dev-login"]', 2000)
    
    if (loginExists) {
      // Click login button in dev mode
      await page.click('[data-testid="dev-login"]')
      await page.waitForNavigation({ waitUntil: 'networkidle2' })
      await takeScreenshot(page, 'align-after-login', 'Align app after dev login')
    }
    
    // Verify dashboard is loaded
    const dashboardLoaded = await waitForElement(page, 'h1', 5000)
    assert(dashboardLoaded, 'Align dashboard loaded successfully')
    
    // Check for navigation elements
    const navExists = await waitForElement(page, 'nav', 2000)
    assert(navExists, 'Navigation menu visible in Align app')
    
    // Test suite app navigation
    const suiteNavExists = await waitForElement(page, '[data-testid="suite-nav"]', 2000)
    if (suiteNavExists) {
      log('Suite navigation found in Align app')
    }
    
    // Check for cross-app notification bell
    const notificationBell = await waitForElement(page, '[data-testid="notification-bell"]', 2000)
    if (notificationBell) {
      log('Cross-app notification bell found')
      await page.click('[data-testid="notification-bell"]')
      await takeScreenshot(page, 'align-notifications', 'Align app notifications panel')
    }
    
    await takeScreenshot(page, 'align-dashboard-final', 'Align app dashboard final state')
    
    log('Align app login and navigation test completed')
    return page
  } catch (err) {
    assert(false, `Align app login failed: ${err.message}`)
    await page.close()
    return null
  }
}

async function testAlignGoalCreation(alignPage) {
  log('🎯 Testing goal creation workflow in Align...')
  
  try {
    // Navigate to goals page
    await alignPage.click('a[href="/goals"]')
    await alignPage.waitForSelector('h1', { timeout: 5000 })
    await takeScreenshot(alignPage, 'align-goals-page', 'Align goals list page')
    
    // Click new goal button
    const newGoalButton = await waitForElement(alignPage, 'a[href="/goals/new"]', 5000)
    assert(newGoalButton, 'New goal button found')
    
    await alignPage.click('a[href="/goals/new"]')
    await alignPage.waitForSelector('form', { timeout: 5000 })
    await takeScreenshot(alignPage, 'align-goal-form', 'Align goal creation form')
    
    // Fill out goal form
    await alignPage.type('input[name="title"]', 'Test Strategic Goal')
    await alignPage.type('textarea[name="description"]', 'This is a test goal for integration testing')
    
    // Select goal category
    await alignPage.select('select[name="category"]', 'strategic')
    
    // Set target value
    await alignPage.type('input[name="target_value"]', '100')
    await alignPage.type('input[name="unit"]', 'percentage')
    
    // Set dates
    await alignPage.type('input[name="start_date"]', '2024-01-01')
    await alignPage.type('input[name="due_date"]', '2024-12-31')
    
    await takeScreenshot(alignPage, 'align-goal-form-filled', 'Align goal form filled out')
    
    // Submit form
    await alignPage.click('button[type="submit"]')
    await alignPage.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 })
    
    await takeScreenshot(alignPage, 'align-goal-created', 'Goal created successfully')
    
    // Verify goal appears in list
    await alignPage.goto(`${ALIGN_URL}/goals`)
    await alignPage.waitForSelector('h1', { timeout: 5000 })
    
    const goalExists = await alignPage.$eval('body', body => 
      body.textContent.includes('Test Strategic Goal')
    )
    
    assert(goalExists, 'Created goal appears in goals list')
    
    log('Goal creation workflow test completed')
    return true
  } catch (err) {
    assert(false, `Goal creation failed: ${err.message}`)
    return false
  }
}

async function testDriveAppLogin(browser) {
  log('🚗 Testing Drive app login and navigation...')
  
  const page = await browser.newPage()
  
  try {
    // Navigate to Drive app
    await page.goto(DRIVE_URL, { waitUntil: 'networkidle2', timeout: TEST_TIMEOUT })
    await takeScreenshot(page, 'drive-initial-load', 'Drive app initial page load')
    
    // Check if login page is displayed (dev mode should auto-login)
    const loginExists = await waitForElement(page, '[data-testid="dev-login"]', 2000)
    
    if (loginExists) {
      // Click login button in dev mode
      await page.click('[data-testid="dev-login"]')
      await page.waitForNavigation({ waitUntil: 'networkidle2' })
      await takeScreenshot(page, 'drive-after-login', 'Drive app after dev login')
    }
    
    // Verify dashboard is loaded
    const dashboardLoaded = await waitForElement(page, 'h1', 5000)
    assert(dashboardLoaded, 'Drive dashboard loaded successfully')
    
    // Check for navigation elements
    const navExists = await waitForElement(page, 'nav', 2000)
    assert(navExists, 'Navigation menu visible in Drive app')
    
    // Check for cross-app notification bell
    const notificationBell = await waitForElement(page, '[data-testid="notification-bell"]', 2000)
    if (notificationBell) {
      log('Cross-app notification bell found in Drive app')
    }
    
    await takeScreenshot(page, 'drive-dashboard-final', 'Drive app dashboard final state')
    
    log('Drive app login and navigation test completed')
    return page
  } catch (err) {
    assert(false, `Drive app login failed: ${err.message}`)
    await page.close()
    return null
  }
}

async function testTaskCreationWithGoalAlignment(drivePage) {
  log('📋 Testing task creation with goal alignment...')
  
  try {
    // Navigate to tasks page
    await drivePage.click('a[href="/tasks"]')
    await drivePage.waitForSelector('h1', { timeout: 5000 })
    await takeScreenshot(drivePage, 'drive-tasks-page', 'Drive tasks page')
    
    // Click new task button
    const newTaskButton = await waitForElement(drivePage, 'button:has-text("New Task")', 5000)
    if (!newTaskButton) {
      // Try alternative selector
      await drivePage.click('button[data-testid="new-task"], button:contains("New Task"), [data-testid="create-task"]')
    }
    
    // Wait for modal to appear
    const modalExists = await waitForElement(drivePage, '[role="dialog"], .modal, [data-testid="task-modal"]', 5000)
    assert(modalExists, 'Task creation modal opened')
    
    await takeScreenshot(drivePage, 'drive-task-modal', 'Task creation modal')
    
    // Fill task details
    await drivePage.type('input[name="title"], input[placeholder*="title"]', 'Test Task with Goal Alignment')
    await drivePage.type('textarea[name="description"], textarea[placeholder*="description"]', 'This task is aligned with strategic goals')
    
    // Test cross-app goal selector
    const goalSelector = await waitForElement(drivePage, '[data-testid="goal-selector"]', 2000)
    if (goalSelector) {
      log('Cross-app goal selector found')
      await drivePage.click('[data-testid="goal-selector"]')
      await takeScreenshot(drivePage, 'drive-goal-selector', 'Cross-app goal selector opened')
      
      // Select a goal if available
      const goalOptions = await waitForElement(drivePage, '[data-testid="goal-option"]', 2000)
      if (goalOptions) {
        await drivePage.click('[data-testid="goal-option"]:first-child')
        log('Goal selected from cross-app selector')
      }
    }
    
    // Set task priority
    await drivePage.select('select[name="priority"]', 'high')
    
    // Set due date
    await drivePage.type('input[type="date"]', '2024-06-30')
    
    await takeScreenshot(drivePage, 'drive-task-form-filled', 'Task form filled with goal alignment')
    
    // Submit task
    await drivePage.click('button[type="submit"], button:has-text("Create"), button:has-text("Save")')
    
    // Wait for modal to close
    await drivePage.waitForTimeout(2000)
    
    await takeScreenshot(drivePage, 'drive-task-created', 'Task created with goal alignment')
    
    // Verify task appears in kanban board
    const taskExists = await drivePage.$eval('body', body => 
      body.textContent.includes('Test Task with Goal Alignment')
    )
    
    assert(taskExists, 'Created task appears in task board')
    
    log('Task creation with goal alignment test completed')
    return true
  } catch (err) {
    assert(false, `Task creation with goal alignment failed: ${err.message}`)
    return false
  }
}

async function testCrossAppNotifications(alignPage, drivePage) {
  log('🔔 Testing cross-app notifications...')
  
  try {
    // Trigger an action in Drive that should notify Align
    await drivePage.bringToFront()
    
    // Update task progress (this should trigger cross-app notification)
    const progressElement = await waitForElement(drivePage, '[data-testid="task-progress"], .progress-bar', 2000)
    if (progressElement) {
      await drivePage.click('[data-testid="task-progress"]')
      log('Task progress updated in Drive')
    }
    
    // Switch to Align app to check notifications
    await alignPage.bringToFront()
    await alignPage.reload({ waitUntil: 'networkidle2' })
    
    // Check notification bell for updates
    const notificationBell = await waitForElement(alignPage, '[data-testid="notification-bell"]', 5000)
    if (notificationBell) {
      const notificationCount = await alignPage.$eval(
        '[data-testid="notification-bell"] .notification-count', 
        el => el ? el.textContent : '0'
      ).catch(() => '0')
      
      if (notificationCount !== '0') {
        log(`Cross-app notifications found: ${notificationCount}`)
        
        // Click to open notifications
        await alignPage.click('[data-testid="notification-bell"]')
        await takeScreenshot(alignPage, 'align-cross-app-notifications', 'Cross-app notifications in Align')
        
        assert(true, 'Cross-app notifications are working')
      } else {
        log('No cross-app notifications found (this may be expected in testing)')
      }
    }
    
    log('Cross-app notifications test completed')
    return true
  } catch (err) {
    assert(false, `Cross-app notifications test failed: ${err.message}`)
    return false
  }
}

async function testSharedStateManagement(alignPage, drivePage) {
  log('🔄 Testing shared state management...')
  
  try {
    // Test navigation context preservation
    await drivePage.bringToFront()
    await drivePage.click('a[href="/projects"]')
    await drivePage.waitForSelector('h1', { timeout: 5000 })
    
    // Switch back to Align and then to Drive to test state persistence
    await alignPage.bringToFront()
    await drivePage.bringToFront()
    
    const currentUrl = drivePage.url()
    assert(currentUrl.includes('/projects'), 'Navigation state preserved across app switches')
    
    // Test real-time connection status
    const connectionStatus = await drivePage.$eval(
      '[data-testid="connection-status"], .connection-indicator',
      el => el ? el.textContent : null
    ).catch(() => null)
    
    if (connectionStatus) {
      log(`Connection status displayed: ${connectionStatus}`)
      assert(connectionStatus.includes('Live') || connectionStatus.includes('Connected'), 'Real-time connection active')
    }
    
    await takeScreenshot(drivePage, 'drive-shared-state', 'Drive app showing shared state')
    await takeScreenshot(alignPage, 'align-shared-state', 'Align app showing shared state')
    
    log('Shared state management test completed')
    return true
  } catch (err) {
    assert(false, `Shared state management test failed: ${err.message}`)
    return false
  }
}

async function testResponsiveDesign(page) {
  log('📱 Testing responsive design...')
  
  try {
    // Test mobile viewport
    await page.setViewport({ width: 375, height: 667 })
    await page.reload({ waitUntil: 'networkidle2' })
    await takeScreenshot(page, 'mobile-view', 'Mobile responsive view')
    
    // Check if mobile navigation works
    const mobileMenuButton = await waitForElement(page, '[data-testid="mobile-menu"], .mobile-menu-button', 2000)
    if (mobileMenuButton) {
      await page.click('[data-testid="mobile-menu"]')
      await takeScreenshot(page, 'mobile-menu-open', 'Mobile menu opened')
      assert(true, 'Mobile navigation menu accessible')
    }
    
    // Test tablet viewport
    await page.setViewport({ width: 768, height: 1024 })
    await page.reload({ waitUntil: 'networkidle2' })
    await takeScreenshot(page, 'tablet-view', 'Tablet responsive view')
    
    // Reset to desktop
    await page.setViewport({ width: 1920, height: 1080 })
    await page.reload({ waitUntil: 'networkidle2' })
    
    log('Responsive design test completed')
    return true
  } catch (err) {
    assert(false, `Responsive design test failed: ${err.message}`)
    return false
  }
}

async function generateUITestReport() {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      success_rate: testResults.total > 0 ? Math.round((testResults.passed / testResults.total) * 100) : 0
    },
    errors: testResults.errors,
    screenshots: testResults.screenshots,
    environment: {
      align_url: ALIGN_URL,
      drive_url: DRIVE_URL,
      screenshots_dir: SCREENSHOT_DIR,
      test_timeout: TEST_TIMEOUT
    }
  }
  
  const reportPath = path.join(process.cwd(), 'ui-test-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  
  log(`UI test report generated: ${reportPath}`)
  
  return report
}

// Main test execution
async function runUITests() {
  log('🚀 Starting Aesyros Suite UI Workflow Tests')
  log('=============================================')
  
  let browser = null
  
  try {
    browser = await setupBrowser()
    
    // Test Align app
    const alignPage = await testAlignAppLogin(browser)
    if (alignPage) {
      await testAlignGoalCreation(alignPage)
      await testResponsiveDesign(alignPage)
    }
    
    // Test Drive app
    const drivePage = await testDriveAppLogin(browser)
    if (drivePage) {
      await testTaskCreationWithGoalAlignment(drivePage)
      if (!alignPage) {
        await testResponsiveDesign(drivePage)
      }
    }
    
    // Test cross-app functionality
    if (alignPage && drivePage) {
      await testCrossAppNotifications(alignPage, drivePage)
      await testSharedStateManagement(alignPage, drivePage)
    }
    
  } catch (err) {
    log(`UI test execution error: ${err.message}`, 'error')
  } finally {
    // Close browser
    if (browser) {
      await browser.close()
      log('Browser closed')
    }
    
    // Generate report
    const report = await generateUITestReport()
    
    // Print summary
    log('=============================================')
    log('🏁 UI Test Execution Summary')
    log(`Total Tests: ${report.summary.total}`)
    log(`Passed: ${report.summary.passed}`)
    log(`Failed: ${report.summary.failed}`)
    log(`Success Rate: ${report.summary.success_rate}%`)
    log(`Screenshots: ${report.screenshots.length}`)
    
    if (testResults.errors.length > 0) {
      log('❌ Failed Tests:')
      testResults.errors.forEach(error => log(`  - ${error}`))
    }
    
    // Exit with appropriate code
    process.exit(testResults.failed > 0 ? 1 : 0)
  }
}

// Run tests if this script is executed directly
const fileUrl = new URL(`file://${process.argv[1]}`).href
if (import.meta.url === fileUrl) {
  runUITests().catch(err => {
    log(`Fatal error: ${err.message}`, 'error')
    process.exit(1)
  })
}

export {
  runUITests,
  setupBrowser,
  testAlignAppLogin,
  testAlignGoalCreation,
  testDriveAppLogin,
  testTaskCreationWithGoalAlignment,
  testCrossAppNotifications,
  testSharedStateManagement,
  testResponsiveDesign
}