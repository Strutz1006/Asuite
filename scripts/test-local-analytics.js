#!/usr/bin/env node
/**
 * Test script for local analytics Edge Function
 * Ensures local development environment is working correctly
 */

const testLocalAnalytics = async () => {
  console.log('🧪 Testing Local Analytics Edge Function\n')
  
  // Test data representing typical goal scenarios
  const testScenarios = [
    {
      name: '✅ High Performance Team',
      data: {
        goals: [
          {
            id: '1', title: 'Launch Product V2', progress_percentage: 85,
            due_date: '2025-12-31', status: 'active', priority: 'high',
            linkedObjective: 'obj1'
          },
          {
            id: '2', title: 'Improve Customer NPS', progress_percentage: 75,
            due_date: '2025-09-30', status: 'active', priority: 'medium',
            parent_id: 'obj2'
          }
        ],
        objectives: [
          { id: 'obj1', title: 'Market Leadership', progress_percentage: 70 },
          { id: 'obj2', title: 'Customer Excellence', progress_percentage: 65 }
        ]
      }
    },
    {
      name: '⚠️ At-Risk Scenario',
      data: {
        goals: [
          {
            id: '3', title: 'Revenue Growth 25%', progress_percentage: 45,
            due_date: '2025-12-31', status: 'active', priority: 'high'
          },
          {
            id: '4', title: 'Team Expansion', progress_percentage: 25,
            due_date: '2025-06-30', status: 'active', priority: 'medium'
          }
        ],
        objectives: [
          { id: 'obj3', title: 'Business Growth', progress_percentage: 40 }
        ]
      }
    }
  ]

  for (const scenario of testScenarios) {
    console.log(`📊 Testing: ${scenario.name}`)
    
    try {
      const response = await fetch('http://127.0.0.1:54321/functions/v1/calculate-strategic-performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
        },
        body: JSON.stringify({
          ...scenario.data,
          timeframe: 'current_year'
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      console.log(`   Strategic Likelihood: ${result.strategicLikelihood}%`)
      console.log(`   Confidence Range: ${result.confidenceInterval[0]}%-${result.confidenceInterval[1]}%`)
      console.log(`   Risk Factors: ${result.riskFactors.length}`)
      console.log(`   Recommendations: ${result.recommendations.length}`)
      console.log(`   ✅ SUCCESS\n`)

    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}\n`)
    }
  }

  // Test database connectivity (if needed)
  console.log('🔌 Testing Database Connectivity...')
  try {
    const dbResponse = await fetch('http://127.0.0.1:54321/rest/v1/', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
      }
    })
    
    if (dbResponse.ok) {
      console.log('   ✅ Database connection working')
    } else {
      console.log('   ⚠️ Database connection issues')
    }
  } catch (error) {
    console.log(`   ❌ Database error: ${error.message}`)
  }

  console.log('\n🎯 Local testing complete!')
}

// Run the test
testLocalAnalytics().catch(console.error)