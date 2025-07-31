#!/usr/bin/env node

/**
 * Aesyros Suite - Cross-App Integration Test Script
 * 
 * This script validates the complete integration between Align and Drive apps,
 * testing real-time data synchronization, cross-app state management,
 * and end-to-end workflows.
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Test configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:54321'
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your_anon_key_here'
import { v4 as uuidv4 } from 'uuid'

const TEST_ORGANIZATION_ID = uuidv4()
const TEST_USER_ID = uuidv4()

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Test results tracking
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
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

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Test suites
async function testDatabaseConnectivity() {
  log('🔍 Testing database connectivity...')
  
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('count')
      .limit(1)
    
    assert(!error, 'Database connection established')
    log('Database connectivity test completed')
    return true
  } catch (err) {
    assert(false, `Database connection failed: ${err.message}`)
    return false
  }
}

async function testOrganizationSetup() {
  log('🏢 Testing organization setup workflow...')
  
  try {
    // Create test organization
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert({
        id: TEST_ORGANIZATION_ID,
        name: 'Test Organization',
        slug: 'test-organization',
        industry: 'Technology',
        size_category: 'medium'
      })
      .select()
      .single()
    
    if (orgError) {
      log(`Organization creation error: ${JSON.stringify(orgError)}`, 'error')
    }
    assert(!orgError, 'Organization created successfully')
    
    // Create company setup for Align app
    const { data: setupData, error: setupError } = await supabase
      .from('align_company_setup')
      .insert({
        organization_id: TEST_ORGANIZATION_ID,
        goal_framework: 'okr',
        planning_cycle: 'quarterly',
        alignment_required: true,
        progress_frequency: 'monthly'
      })
      .select()
      .single()
    
    assert(!setupError, 'Align company setup created successfully')
    
    // Create test user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: TEST_USER_ID,
        organization_id: TEST_ORGANIZATION_ID,
        full_name: 'Test User',
        email: 'test@example.com',
        role: 'manager'
      })
      .select()
      .single()
    
    assert(!userError, 'Test user created successfully')
    
    log('Organization setup test completed')
    return { orgData, setupData, userData }
  } catch (err) {
    assert(false, `Organization setup failed: ${err.message}`)
    return null
  }
}

async function testAlignGoalManagement() {
  log('🎯 Testing Align goal management...')
  
  try {
    // Create strategic goal
    const { data: goalData, error: goalError } = await supabase
      .from('align_objectives')
      .insert({
        organization_id: TEST_ORGANIZATION_ID,
        title: 'Increase Revenue by 25%',
        description: 'Strategic goal to increase company revenue',
        level: 'strategic',
        category: 'financial',
        framework: 'okr',
        target_value: '25',
        current_value: '0',
        unit: 'percentage',
        progress_percentage: 0,
        status: 'active',
        priority: 'high',
        owner_id: TEST_USER_ID,
        start_date: '2024-01-01',
        due_date: '2024-12-31'
      })
      .select()
      .single()
    
    assert(!goalError, 'Strategic goal created successfully')
    
    // Create key result
    const { data: krData, error: krError } = await supabase
      .from('align_key_results')
      .insert({
        objective_id: goalData.id,
        title: 'Achieve $2M ARR',
        description: 'Annual recurring revenue target',
        target_value: '2000000',
        current_value: '1600000',
        unit: 'dollars',
        progress_percentage: 80,
        status: 'active',
        due_date: '2024-12-31'
      })
      .select()
      .single()
    
    assert(!krError, 'Key result created successfully')
    
    // Test progress calculation
    const { data: updatedGoal, error: updateError } = await supabase
      .from('align_objectives')
      .update({ progress_percentage: 80 })
      .eq('id', goalData.id)
      .select()
      .single()
    
    assert(!updateError && updatedGoal.progress_percentage === 80, 'Goal progress updated successfully')
    
    log('Align goal management test completed')
    return { goalData, krData }
  } catch (err) {
    assert(false, `Align goal management failed: ${err.message}`)
    return null
  }
}

async function testDriveProjectManagement(goalData) {
  log('🚗 Testing Drive project management...')
  
  try {
    // Create project aligned with goal
    const { data: projectData, error: projectError } = await supabase
      .from('drive_projects')
      .insert({
        organization_id: TEST_ORGANIZATION_ID,
        name: 'Revenue Growth Initiative',
        description: 'Project to implement revenue growth strategies',
        status: 'active',
        health: 'good',
        priority: 'high',
        owner_id: TEST_USER_ID,
        align_goal_id: goalData.id,
        start_date: '2024-01-01',
        due_date: '2024-06-30',
        budget_allocated: 50000,
        budget_spent: 15000,
        progress_percentage: 35
      })
      .select()
      .single()
    
    assert(!projectError, 'Project created successfully')
    
    // Create task aligned with goal
    const { data: taskData, error: taskError } = await supabase
      .from('drive_tasks')
      .insert({
        organization_id: TEST_ORGANIZATION_ID,
        project_id: projectData.id,
        title: 'Market Analysis Research',
        description: 'Conduct comprehensive market analysis for new revenue streams',
        status: 'in-progress',
        priority: 'high',
        assignee_id: TEST_USER_ID,
        align_goal_id: goalData.id,
        due_date: '2024-03-15',
        estimated_hours: 40,
        actual_hours: 15,
        progress_percentage: 60
      })
      .select()
      .single()
    
    assert(!taskError, 'Task created successfully')
    
    // Test cross-app link creation
    const { data: linkData, error: linkError } = await supabase
      .from('cross_app_links')
      .insert({
        source_app: 'drive',
        source_entity_type: 'task',
        source_entity_id: taskData.id,
        target_app: 'align',
        target_entity_type: 'goal',
        target_entity_id: goalData.id,
        relationship_type: 'alignment',
        metadata: { alignment_strength: 'strong' }
      })
      .select()
      .single()
    
    assert(!linkError, 'Cross-app link created successfully')
    
    log('Drive project management test completed')
    return { projectData, taskData, linkData }
  } catch (err) {
    assert(false, `Drive project management failed: ${err.message}`)
    return null
  }
}

async function testCrossAppNotifications(goalData, taskData) {
  log('🔔 Testing cross-app notifications...')
  
  try {
    // Create notification from Drive to Align
    const { data: notificationData, error: notificationError } = await supabase
      .from('notifications')
      .insert({
        type: 'task_completed',
        source_app: 'drive',
        target_app: 'align',
        entity_type: 'task',
        entity_id: taskData.id,
        title: 'Task Completed',
        message: `Task "${taskData.title}" has been completed`,
        data: {
          task_id: taskData.id,
          goal_id: goalData.id,
          progress_impact: 10
        },
        read: false
      })
      .select()
      .single()
    
    assert(!notificationError, 'Cross-app notification created successfully')
    
    // Test activity logging
    const { data: activityData, error: activityError } = await supabase
      .from('activity_logs')
      .insert({
        product: 'drive',
        action: 'task_completed',
        entity_type: 'task',
        entity_id: taskData.id,
        user_id: TEST_USER_ID,
        details: {
          task_title: taskData.title,
          goal_alignment: goalData.title,
          completion_date: new Date().toISOString()
        }
      })
      .select()
      .single()
    
    assert(!activityError, 'Activity log created successfully')
    
    log('Cross-app notifications test completed')
    return { notificationData, activityData }
  } catch (err) {
    assert(false, `Cross-app notifications failed: ${err.message}`)
    return null
  }
}

async function testRealtimeSync() {
  log('⚡ Testing real-time synchronization...')
  
  try {
    let realtimeReceived = false
    
    // Set up real-time listener
    const subscription = supabase
      .channel('test_realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'align_objectives'
        },
        (payload) => {
          realtimeReceived = true
          log(`Real-time update received: ${JSON.stringify(payload.new)}`)
        }
      )
      .subscribe()
    
    // Wait for subscription to be ready
    await sleep(1000)
    
    // Update a goal to trigger real-time event
    const { error: updateError } = await supabase
      .from('align_objectives')
      .update({ progress_percentage: 85 })
      .eq('organization_id', TEST_ORGANIZATION_ID)
    
    assert(!updateError, 'Goal update executed successfully')
    
    // Wait for real-time event
    await sleep(2000)
    
    assert(realtimeReceived, 'Real-time synchronization working')
    
    // Clean up subscription
    subscription.unsubscribe()
    
    log('Real-time synchronization test completed')
    return true
  } catch (err) {
    assert(false, `Real-time synchronization failed: ${err.message}`)
    return false
  }
}

async function testAlignmentMatrix() {
  log('📊 Testing alignment matrix calculations...')
  
  try {
    // Get goals and tasks for alignment matrix
    const { data: goals, error: goalsError } = await supabase
      .from('align_objectives')
      .select('*')
      .eq('organization_id', TEST_ORGANIZATION_ID)
    
    assert(!goalsError, 'Goals fetched successfully')
    
    const { data: tasks, error: tasksError } = await supabase
      .from('drive_tasks')
      .select('*, align_goal:align_objectives(id, title)')
      .eq('organization_id', TEST_ORGANIZATION_ID)
    
    assert(!tasksError, 'Tasks with goal alignment fetched successfully')
    
    // Test alignment calculation logic
    const alignedTasks = tasks.filter(task => task.align_goal_id)
    const alignmentPercentage = Math.round((alignedTasks.length / tasks.length) * 100)
    
    assert(alignmentPercentage > 0, `Alignment percentage calculated: ${alignmentPercentage}%`)
    
    log('Alignment matrix test completed')
    return { goals, tasks, alignmentPercentage }
  } catch (err) {
    assert(false, `Alignment matrix test failed: ${err.message}`)
    return null
  }
}

async function testDataIntegrity() {
  log('🔍 Testing data integrity and constraints...')
  
  try {
    // Test foreign key constraints
    const { error: constraintError } = await supabase
      .from('drive_tasks')
      .insert({
        organization_id: TEST_ORGANIZATION_ID,
        title: 'Invalid Task',
        align_goal_id: 'non-existent-goal-id'
      })
    
    assert(constraintError, 'Foreign key constraint properly enforced')
    
    // Test cascade operations
    const { data: goalsBefore } = await supabase
      .from('align_objectives')
      .select('count')
      .eq('organization_id', TEST_ORGANIZATION_ID)
    
    const { data: tasksBefore } = await supabase
      .from('drive_tasks')
      .select('count')
      .eq('organization_id', TEST_ORGANIZATION_ID)
    
    assert(goalsBefore && tasksBefore, 'Data counts retrieved successfully')
    
    log('Data integrity test completed')
    return true
  } catch (err) {
    assert(false, `Data integrity test failed: ${err.message}`)
    return false
  }
}

async function cleanupTestData() {
  log('🧹 Cleaning up test data...')
  
  try {
    // Delete in reverse order of dependencies
    await supabase.from('notifications').delete().eq('entity_id', TEST_ORGANIZATION_ID)
    await supabase.from('activity_logs').delete().eq('user_id', TEST_USER_ID)
    await supabase.from('cross_app_links').delete().like('source_entity_id', 'test-%')
    await supabase.from('align_key_results').delete().like('objective_id', 'test-%')
    await supabase.from('drive_tasks').delete().eq('organization_id', TEST_ORGANIZATION_ID)
    await supabase.from('drive_projects').delete().eq('organization_id', TEST_ORGANIZATION_ID)
    await supabase.from('align_objectives').delete().eq('organization_id', TEST_ORGANIZATION_ID)
    await supabase.from('users').delete().eq('id', TEST_USER_ID)
    await supabase.from('align_company_setup').delete().eq('organization_id', TEST_ORGANIZATION_ID)
    await supabase.from('organizations').delete().eq('id', TEST_ORGANIZATION_ID)
    
    log('Test data cleanup completed')
    return true
  } catch (err) {
    log(`Cleanup warning: ${err.message}`, 'warn')
    return false
  }
}

async function generateTestReport() {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      success_rate: Math.round((testResults.passed / testResults.total) * 100)
    },
    errors: testResults.errors,
    environment: {
      supabase_url: SUPABASE_URL,
      node_version: process.version,
      test_duration: Date.now() - startTime
    }
  }
  
  const reportPath = path.join(process.cwd(), 'test-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  
  log(`Test report generated: ${reportPath}`)
  
  return report
}

// Main test execution
async function runTests() {
  log('🚀 Starting Aesyros Suite Cross-App Integration Tests')
  log('================================================')
  
  const startTime = Date.now()
  
  try {
    // Run test suites in sequence
    const dbConnected = await testDatabaseConnectivity()
    if (!dbConnected) {
      log('Database connectivity failed. Aborting tests.', 'error')
      return
    }
    
    const orgSetup = await testOrganizationSetup()
    if (!orgSetup) {
      log('Organization setup failed. Aborting tests.', 'error')
      return
    }
    
    const goalResult = await testAlignGoalManagement()
    if (!goalResult) {
      log('Goal management test failed. Continuing with limited tests.', 'warn')
    }
    
    const driveResult = await testDriveProjectManagement(goalResult?.goalData)
    if (!driveResult) {
      log('Drive project management test failed. Continuing with limited tests.', 'warn')
    }
    
    if (goalResult && driveResult) {
      await testCrossAppNotifications(goalResult.goalData, driveResult.taskData)
      await testAlignmentMatrix()
    }
    
    await testRealtimeSync()
    await testDataIntegrity()
    
  } catch (err) {
    log(`Test execution error: ${err.message}`, 'error')
  } finally {
    // Always cleanup, even if tests fail
    await cleanupTestData()
    
    // Generate report
    const report = await generateTestReport()
    
    // Print summary
    log('================================================')
    log('🏁 Test Execution Summary')
    log(`Total Tests: ${report.summary.total}`)
    log(`Passed: ${report.summary.passed}`)
    log(`Failed: ${report.summary.failed}`)
    log(`Success Rate: ${report.summary.success_rate}%`)
    log(`Duration: ${Math.round(report.environment.test_duration / 1000)}s`)
    
    if (testResults.errors.length > 0) {
      log('❌ Failed Tests:')
      testResults.errors.forEach(error => log(`  - ${error}`))
    }
    
    // Exit with appropriate code
    process.exit(testResults.failed > 0 ? 1 : 0)
  }
}

// Global variables
let startTime = Date.now()

// Run tests if this script is executed directly
const fileUrl = new URL(`file://${process.argv[1]}`).href
if (import.meta.url === fileUrl) {
  runTests().catch(err => {
    log(`Fatal error: ${err.message}`, 'error')
    process.exit(1)
  })
}

export {
  runTests,
  testDatabaseConnectivity,
  testOrganizationSetup,
  testAlignGoalManagement,
  testDriveProjectManagement,
  testCrossAppNotifications,
  testRealtimeSync,
  testAlignmentMatrix,
  testDataIntegrity,
  cleanupTestData
}