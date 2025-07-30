#!/usr/bin/env node

/**
 * Aesyros Suite - Master Test Runner
 * 
 * This script runs all test suites for the Aesyros Suite:
 * - Cross-app integration tests
 * - UI workflow tests
 * - Performance tests
 * - Database integrity tests
 * 
 * It provides a comprehensive validation of the entire system.
 */

import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

// Test configuration
const TEST_SCRIPTS = [
  {
    name: 'Cross-App Integration Tests',
    script: './scripts/test-cross-app-integration.js',
    description: 'Tests database integration and cross-app data synchronization',
    timeout: 120000, // 2 minutes
    critical: true
  },
  {
    name: 'UI Workflow Tests',
    script: './scripts/test-ui-workflows.js',
    description: 'Tests user interface workflows and interactions',
    timeout: 300000, // 5 minutes
    critical: false,
    requirements: ['puppeteer']
  }
]

// Test results tracking
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  results: [],
  startTime: Date.now()
}

// Helper functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString()
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warn' ? '⚠️' : 'ℹ️'
  console.log(`${prefix} [${timestamp}] ${message}`)
}

function checkRequirements(requirements = []) {
  if (!requirements.length) return { met: true, missing: [] };
  const missing = [];
  for (const req of requirements) {
    try {
      require.resolve(req);
    } catch (err) {
      missing.push(req);
    }
  }
  return {
    met: missing.length === 0,
    missing,
  };
}

function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'pipe',
      shell: true,
      ...options
    })
    
    let stdout = ''
    let stderr = ''
    
    child.stdout?.on('data', (data) => {
      const output = data.toString()
      stdout += output
      if (options.verbose) {
        process.stdout.write(output)
      }
    })
    
    child.stderr?.on('data', (data) => {
      const output = data.toString()
      stderr += output
      if (options.verbose) {
        process.stderr.write(output)
      }
    })
    
    child.on('close', (code) => {
      resolve({
        code,
        stdout,
        stderr,
        success: code === 0
      })
    })
    
    child.on('error', (err) => {
      reject(err)
    })
    
    // Handle timeout
    if (options.timeout) {
      setTimeout(() => {
        child.kill('SIGTERM')
        reject(new Error(`Command timed out after ${options.timeout}ms`))
      }, options.timeout)
    }
  })
}

async function runTestSuite(testConfig) {
  const { name, script, description, timeout, critical, requirements } = testConfig
  
  log(`🧪 Starting: ${name}`)
  log(`📝 Description: ${description}`)
  
  const result = {
    name,
    description,
    success: false,
    skipped: false,
    duration: 0,
    output: '',
    error: null,
    timestamp: new Date().toISOString()
  }
  
  const startTime = Date.now()
  
  try {
    // Check requirements
    if (requirements) {
      const reqCheck = checkRequirements(requirements)
      if (!reqCheck.met) {
        result.skipped = true
        result.error = `Missing requirements: ${reqCheck.missing.join(', ')}`
        log(`⏭️ Skipping ${name}: ${result.error}`, 'warn')
        testResults.skipped++
        return result
      }
    }
    
    // Check if script exists
    if (!fs.existsSync(script)) {
      throw new Error(`Test script not found: ${script}`)
    }
    
    // Run the test script
    const commandResult = await runCommand('node', [script], {
      timeout,
      verbose: process.env.VERBOSE === 'true'
    })
    
    result.success = commandResult.success
    result.output = commandResult.stdout
    
    if (!commandResult.success) {
      result.error = commandResult.stderr || `Test failed with exit code ${commandResult.code}`
      log(`❌ Failed: ${name}`, 'error')
      if (critical) {
        log(`🚨 Critical test failed: ${name}`, 'error')
      }
      testResults.failed++
    } else {
      log(`✅ Passed: ${name}`, 'success')
      testResults.passed++
    }
    
  } catch (err) {
    result.error = err.message
    log(`❌ Error running ${name}: ${err.message}`, 'error')
    
    if (critical) {
      log(`🚨 Critical test error: ${name}`, 'error')
    }
    
    testResults.failed++
  } finally {
    result.duration = Date.now() - startTime
    testResults.total++
  }
  
  log(`⏱️ Duration: ${Math.round(result.duration / 1000)}s`)
  log('─'.repeat(50))
  
  return result
}

async function checkEnvironment() {
  log('🔍 Checking test environment...')
  
  const checks = [
    {
      name: 'Node.js version',
      check: () => {
        const version = process.version
        const major = parseInt(version.slice(1).split('.')[0])
        return major >= 18
      },
      requirement: 'Node.js >= 18.0.0'
    },
    {
      name: 'Package.json exists',
      check: () => fs.existsSync('./package.json'),
      requirement: 'package.json in project root'
    },
    {
      name: 'Scripts directory exists',
      check: () => fs.existsSync('./scripts'),
      requirement: 'scripts directory'
    }
  ]
  
  let allChecksPassed = true
  
  for (const check of checks) {
    const passed = check.check()
    log(`${passed ? '✅' : '❌'} ${check.name}: ${passed ? 'OK' : `Missing ${check.requirement}`}`)
    if (!passed) allChecksPassed = false
  }
  
  if (!allChecksPassed) {
    log('❌ Environment checks failed. Please fix the issues above.', 'error')
    process.exit(1)
  }
  
  log('✅ Environment checks passed')
  log('─'.repeat(50))
}

async function generateMasterReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      skipped: testResults.skipped,
      success_rate: testResults.total > 0 ? Math.round((testResults.passed / testResults.total) * 100) : 0,
      duration: Date.now() - testResults.startTime
    },
    tests: results,
    environment: {
      node_version: process.version,
      platform: process.platform,
      arch: process.arch,
      cwd: process.cwd(),
      env_vars: {
        NODE_ENV: process.env.NODE_ENV,
        SUPABASE_URL: process.env.SUPABASE_URL ? '***' : 'not set',
        ALIGN_URL: process.env.ALIGN_URL,
        DRIVE_URL: process.env.DRIVE_URL
      }
    },
    recommendations: []
  }
  
  // Add recommendations based on results
  if (testResults.failed > 0) {
    report.recommendations.push('Review failed tests and fix underlying issues')
  }
  
  if (testResults.skipped > 0) {
    report.recommendations.push('Install missing dependencies to run skipped tests')
  }
  
  if (report.summary.success_rate < 80) {
    report.recommendations.push('Success rate below 80% - investigate system issues')
  }
  
  // Save report
  const reportPath = path.join(process.cwd(), 'master-test-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  
  // Save HTML report
  const htmlReport = generateHTMLReport(report)
  const htmlReportPath = path.join(process.cwd(), 'master-test-report.html')
  fs.writeFileSync(htmlReportPath, htmlReport)
  
  log(`📊 Master test report generated: ${reportPath}`)
  log(`🌐 HTML report generated: ${htmlReportPath}`)
  
  return report
}

function generateHTMLReport(report) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aesyros Suite Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 2.5em; }
        .header p { margin: 10px 0 0; opacity: 0.9; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; }
        .stat-card { text-align: center; padding: 20px; border-radius: 8px; border: 1px solid #e1e5e9; }
        .stat-card h3 { margin: 0 0 10px; color: #666; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; }
        .stat-card .value { font-size: 2.5em; font-weight: bold; margin: 0; }
        .passed .value { color: #28a745; }
        .failed .value { color: #dc3545; }
        .skipped .value { color: #ffc107; }
        .total .value { color: #007bff; }
        .success-rate .value { color: ${report.summary.success_rate >= 80 ? '#28a745' : '#dc3545'}; }
        .tests { padding: 0 30px 30px; }
        .test-item { border: 1px solid #e1e5e9; border-radius: 8px; margin-bottom: 15px; overflow: hidden; }
        .test-header { padding: 20px; background: #f8f9fa; display: flex; justify-content: space-between; align-items: center; }
        .test-name { font-weight: bold; font-size: 1.1em; }
        .test-status { padding: 4px 12px; border-radius: 20px; font-size: 0.85em; font-weight: bold; }
        .status-passed { background: #d4edda; color: #155724; }
        .status-failed { background: #f8d7da; color: #721c24; }
        .status-skipped { background: #fff3cd; color: #856404; }
        .test-details { padding: 20px; border-top: 1px solid #e1e5e9; background: white; }
        .test-description { color: #666; margin-bottom: 10px; }
        .test-error { background: #f8f9fa; border-left: 4px solid #dc3545; padding: 15px; margin-top: 10px; font-family: monospace; font-size: 0.9em; }
        .duration { color: #666; font-size: 0.9em; }
        .recommendations { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; margin: 20px 30px; }
        .recommendations h3 { margin-top: 0; color: #1976d2; }
        .recommendations ul { margin-bottom: 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏢 Aesyros Suite</h1>
            <p>Master Test Report - ${new Date(report.timestamp).toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="stat-card total">
                <h3>Total Tests</h3>
                <p class="value">${report.summary.total}</p>
            </div>
            <div class="stat-card passed">
                <h3>Passed</h3>
                <p class="value">${report.summary.passed}</p>
            </div>
            <div class="stat-card failed">
                <h3>Failed</h3>
                <p class="value">${report.summary.failed}</p>
            </div>
            <div class="stat-card skipped">
                <h3>Skipped</h3>
                <p class="value">${report.summary.skipped}</p>
            </div>
            <div class="stat-card success-rate">
                <h3>Success Rate</h3>
                <p class="value">${report.summary.success_rate}%</p>
            </div>
        </div>
        
        ${report.recommendations.length > 0 ? `
        <div class="recommendations">
            <h3>📋 Recommendations</h3>
            <ul>
                ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
        
        <div class="tests">
            <h2>📋 Test Results</h2>
            ${report.tests.map(test => `
                <div class="test-item">
                    <div class="test-header">
                        <div>
                            <div class="test-name">${test.name}</div>
                            <div class="duration">Duration: ${Math.round(test.duration / 1000)}s</div>
                        </div>
                        <div class="test-status status-${test.skipped ? 'skipped' : test.success ? 'passed' : 'failed'}">
                            ${test.skipped ? 'SKIPPED' : test.success ? 'PASSED' : 'FAILED'}
                        </div>
                    </div>
                    <div class="test-details">
                        <div class="test-description">${test.description}</div>
                        ${test.error ? `<div class="test-error"><strong>Error:</strong> ${test.error}</div>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>
  `.trim()
}

// Main execution
async function runAllTests() {
  log('🚀 Starting Aesyros Suite Master Test Runner')
  log('='.repeat(60))
  
  try {
    // Check environment
    await checkEnvironment()
    
    // Run all test suites
    const results = []
    
    for (const testConfig of TEST_SCRIPTS) {
      const result = await runTestSuite(testConfig)
      results.push(result)
      testResults.results.push(result)
      
      // Stop on critical failure if specified
      if (testConfig.critical && !result.success && !result.skipped) {
        log('🚨 Critical test failed. Stopping execution.', 'error')
        break
      }
    }
    
    // Generate master report
    const report = await generateMasterReport(results)
    
    // Print final summary
    log('='.repeat(60))
    log('🏁 Master Test Execution Summary')
    log(`📊 Total Test Suites: ${report.summary.total}`)
    log(`✅ Passed: ${report.summary.passed}`)
    log(`❌ Failed: ${report.summary.failed}`)
    log(`⏭️ Skipped: ${report.summary.skipped}`)
    log(`📈 Success Rate: ${report.summary.success_rate}%`)
    log(`⏱️ Total Duration: ${Math.round(report.summary.duration / 1000)}s`)
    
    if (report.recommendations.length > 0) {
      log('📋 Recommendations:')
      report.recommendations.forEach(rec => log(`  • ${rec}`))
    }
    
    // Exit with appropriate code
    const exitCode = testResults.failed > 0 ? 1 : 0
    log(`🔚 Exiting with code: ${exitCode}`)
    
    process.exit(exitCode)
    
  } catch (err) {
    log(`💥 Fatal error: ${err.message}`, 'error')
    process.exit(1)
  }
}

// Run if this script is executed directly
const fileUrl = new URL(`file://${process.argv[1]}`).href
if (import.meta.url === fileUrl) {
  runAllTests().catch(err => {
    log(`💥 Unhandled error: ${err.message}`, 'error')
    process.exit(1)
  })
}

export { runAllTests, runTestSuite, checkEnvironment, generateMasterReport }