# Aesyros Suite - Testing Guide

This document provides comprehensive information about testing the Aesyros Suite, including cross-app integration, UI workflows, and end-to-end validation.

## 🧪 Test Suites Overview

The Aesyros Suite includes multiple test suites that validate different aspects of the system:

### 1. Cross-App Integration Tests
**File:** `scripts/test-cross-app-integration.js`

Tests the core database integration and real-time synchronization between Align and Drive apps.

**What it tests:**
- Database connectivity and schema validation
- Organization and user setup workflows
- Goal creation and management (Align app)
- Project and task management (Drive app)
- Cross-app links and relationships
- Real-time data synchronization
- Notification system
- Alignment matrix calculations
- Data integrity and constraints

### 2. UI Workflow Tests
**File:** `scripts/test-ui-workflows.js`

Tests user interface interactions and cross-app workflows using automated browser testing.

**What it tests:**
- App login and navigation
- Goal creation workflow (Align)
- Task creation with goal alignment (Drive)
- Cross-app notifications in UI
- Shared state management
- Responsive design
- Cross-app goal selector functionality

### 3. Master Test Runner
**File:** `scripts/run-all-tests.js`

Orchestrates all test suites and generates comprehensive reports.

**Features:**
- Runs all test suites in sequence
- Environment validation
- Dependency checking
- HTML and JSON report generation
- Critical test failure handling

## 🚀 Quick Start

### Prerequisites

```bash
# Ensure Node.js >= 18.0.0
node --version

# Install dependencies
npm install

# For UI tests, install Puppeteer
npm install puppeteer --save-dev
```

### Running Tests

```bash
# Run all tests (recommended)
npm run test:all

# Or manually:
node scripts/run-all-tests.js

# Run individual test suites:
node scripts/test-cross-app-integration.js
node scripts/test-ui-workflows.js
```

### Environment Variables

```bash
# Database (for integration tests)
export SUPABASE_URL="http://localhost:54321"
export SUPABASE_ANON_KEY="your_anon_key_here"

# App URLs (for UI tests)
export ALIGN_URL="http://localhost:5173"
export DRIVE_URL="http://localhost:5179"

# Test options
export HEADLESS="false"  # Show browser during UI tests
export VERBOSE="true"    # Detailed test output
```

## 📊 Test Reports

After running tests, you'll get comprehensive reports:

### JSON Report (`master-test-report.json`)
```json
{
  "timestamp": "2024-07-29T14:00:00.000Z",
  "summary": {
    "total": 15,
    "passed": 13,
    "failed": 1,
    "skipped": 1,
    "success_rate": 87,
    "duration": 45000
  },
  "tests": [...],
  "environment": {...},
  "recommendations": [...]
}
```

### HTML Report (`master-test-report.html`)
A beautiful, interactive HTML report with:
- Visual test results dashboard
- Individual test details
- Error information
- Performance metrics
- Recommendations

## 🔍 Test Details

### Cross-App Integration Test Flow

1. **Database Connectivity** - Verifies Supabase connection
2. **Organization Setup** - Creates test organization, user, and company settings
3. **Align Goal Management** - Creates strategic goals and key results
4. **Drive Project Management** - Creates projects and tasks aligned with goals
5. **Cross-App Notifications** - Tests notification system between apps
6. **Real-time Synchronization** - Validates live data updates
7. **Alignment Matrix** - Tests goal-task alignment calculations
8. **Data Integrity** - Validates database constraints and relationships
9. **Cleanup** - Removes all test data

### UI Workflow Test Flow

1. **Browser Setup** - Launches Puppeteer browser
2. **Align App Testing**:
   - Login and navigation
   - Goal creation workflow
   - Responsive design
3. **Drive App Testing**:
   - Login and navigation
   - Task creation with goal alignment
   - Cross-app goal selector
4. **Cross-App Testing**:
   - Notification system
   - Shared state management
   - Real-time updates

## 🛠️ Customizing Tests

### Adding New Test Cases

1. **Integration Tests** - Add new functions to `test-cross-app-integration.js`
2. **UI Tests** - Add new functions to `test-ui-workflows.js`
3. **Test Suites** - Add new scripts to `TEST_SCRIPTS` array in `run-all-tests.js`

### Test Configuration

```javascript
// In run-all-tests.js
const TEST_SCRIPTS = [
  {
    name: 'Your Custom Test',
    script: './scripts/your-custom-test.js',
    description: 'Description of what this tests',
    timeout: 60000,
    critical: true,
    requirements: ['dependency-name']
  }
]
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failures**
   ```bash
   # Start Supabase locally
   npm run db:start
   
   # Check connection
   curl http://localhost:54321/rest/v1/
   ```

2. **UI Test Browser Issues**
   ```bash
   # Install Puppeteer dependencies (Linux)
   sudo apt-get update
   sudo apt-get install -y gconf-service libasound2-dev
   
   # Run with visible browser for debugging
   HEADLESS=false npm run test:ui
   ```

3. **Port Conflicts**
   ```bash
   # Check if apps are running on correct ports
   lsof -i :5173  # Align app
   lsof -i :5179  # Drive app
   ```

4. **Permission Issues**
   ```bash
   # Make scripts executable
   chmod +x scripts/*.js
   ```

### Debug Mode

```bash
# Run with detailed logging
VERBOSE=true node scripts/run-all-tests.js

# Run UI tests with visible browser
HEADLESS=false node scripts/test-ui-workflows.js

# Run specific test function
node -e "
  import('./scripts/test-cross-app-integration.js')
    .then(module => module.testAlignGoalManagement())
    .then(console.log)
    .catch(console.error)
"
```

## 📈 Performance Benchmarks

Expected test performance on a typical development machine:

- **Cross-App Integration**: ~30-60 seconds
- **UI Workflow Tests**: ~2-5 minutes
- **Total Test Suite**: ~3-7 minutes

Performance factors:
- Database query speed
- Real-time subscription latency
- Browser rendering time
- Network conditions

## 🎯 Test Coverage

The test suite covers:

### ✅ Functional Testing
- [x] User authentication flows
- [x] CRUD operations (goals, tasks, projects)
- [x] Cross-app data relationships
- [x] Real-time synchronization
- [x] Notification system

### ✅ Integration Testing
- [x] Database schema validation
- [x] API endpoint functionality
- [x] Cross-app communication
- [x] State management

### ✅ UI Testing
- [x] User workflows
- [x] Responsive design
- [x] Cross-browser compatibility
- [x] Accessibility basics

### 🔄 Not Yet Covered
- [ ] Load testing (high volume)
- [ ] Security penetration testing
- [ ] Multi-user concurrent testing
- [ ] Mobile app testing
- [ ] Offline functionality

## 📚 Additional Resources

- [Supabase Testing Guide](https://supabase.com/docs/guides/testing)
- [Puppeteer Documentation](https://pptr.dev)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)

## 🤝 Contributing

When adding new features:

1. **Write tests first** (TDD approach)
2. **Update test documentation**
3. **Ensure all tests pass**
4. **Add performance benchmarks**
5. **Update this README**

---

**Happy Testing! 🎉**

The Aesyros Suite test framework ensures robust, reliable, and maintainable cross-app functionality.