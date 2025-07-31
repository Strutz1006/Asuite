// Edge Function entry point
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

console.log("Strategic Performance Calculator loaded!")

interface PerformanceRequest {
  goals: Array<{
    id: string
    title: string
    progress_percentage: number
    due_date: string
    status: string
    priority: string
    parent_id?: string
    linkedObjective?: string
  }>
  objectives: Array<{
    id: string
    title: string
    progress_percentage: number
  }>
  timeframe: string
}

interface PerformanceResponse {
  strategicLikelihood: number
  riskFactors: string[]
  confidenceInterval: [number, number]
  recommendations: string[]
  breakdown: {
    onTrack: number
    atRisk: number
    behind: number
    total: number
  }
  objectiveAlignment: {
    aligned: number
    total: number
    score: number
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { goals, objectives, timeframe }: PerformanceRequest = await req.json()
    
    console.log(`Processing ${goals.length} goals and ${objectives.length} objectives`)
    
    // Call our Python analysis function
    const analysis = await calculateStrategicPerformance(goals, objectives, timeframe)
    
    return new Response(
      JSON.stringify(analysis),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error in strategic performance calculation:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

async function calculateStrategicPerformance(
  goals: any[], 
  objectives: any[], 
  timeframe: string
): Promise<PerformanceResponse> {
  
  // Python-like data processing logic in TypeScript for now
  // We'll enhance this with actual Python processing in the next step
  
  const currentYear = new Date().getFullYear()
  const yearEndGoals = goals.filter(g => {
    if (!g.due_date) return false
    return new Date(g.due_date).getFullYear() === currentYear
  })

  // Advanced categorization with confidence weighting
  const onTrackGoals = yearEndGoals.filter(g => g.progress_percentage >= 70)
  const atRiskGoals = yearEndGoals.filter(g => g.progress_percentage >= 40 && g.progress_percentage < 70)
  const behindGoals = yearEndGoals.filter(g => g.progress_percentage < 40)
  
  // Enhanced likelihood calculation with risk factors
  let baseScore = 0
  let confidenceModifier = 1.0
  const riskFactors: string[] = []
  
  if (yearEndGoals.length === 0) {
    return {
      strategicLikelihood: 0,
      riskFactors: ['No strategic targets set for current year'],
      confidenceInterval: [0, 0],
      recommendations: ['Set strategic goals with clear deadlines'],
      breakdown: { onTrack: 0, atRisk: 0, behind: 0, total: 0 },
      objectiveAlignment: { aligned: 0, total: goals.length, score: 0 }
    }
  }
  
  // Weighted scoring based on priority and progress trends
  const priorityWeights = { 'high': 1.2, 'medium': 1.0, 'low': 0.8 }
  let weightedScore = 0
  let totalWeight = 0
  
  yearEndGoals.forEach(goal => {
    const weight = priorityWeights[goal.priority as keyof typeof priorityWeights] || 1.0
    let goalScore = 0
    
    if (goal.progress_percentage >= 70) goalScore = 1.0
    else if (goal.progress_percentage >= 40) goalScore = 0.6
    else goalScore = 0.2
    
    weightedScore += goalScore * weight
    totalWeight += weight
  })
  
  baseScore = totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0
  
  // Risk factor analysis
  const behindRatio = behindGoals.length / yearEndGoals.length
  const atRiskRatio = atRiskGoals.length / yearEndGoals.length
  
  if (behindRatio > 0.3) {
    riskFactors.push(`${Math.round(behindRatio * 100)}% of goals are significantly behind`)
    confidenceModifier *= 0.85
  }
  
  if (atRiskRatio > 0.4) {
    riskFactors.push(`${Math.round(atRiskRatio * 100)}% of goals are at risk`)
    confidenceModifier *= 0.9
  }
  
  // Check for objective alignment
  const alignedGoals = goals.filter(g => g.parent_id || g.linkedObjective).length
  const alignmentScore = goals.length > 0 ? Math.round((alignedGoals / goals.length) * 100) : 100
  
  if (alignmentScore < 60) {
    riskFactors.push('Low strategic alignment - many goals not linked to objectives')
    confidenceModifier *= 0.9
  }
  
  // Calculate final score with confidence
  const finalScore = Math.round(baseScore * confidenceModifier)
  const confidenceRange = Math.round(10 / confidenceModifier)
  
  // Generate recommendations
  const recommendations: string[] = []
  if (behindGoals.length > 0) {
    recommendations.push(`Focus on ${behindGoals.length} behind goals - consider resource reallocation`)
  }
  if (alignmentScore < 70) {
    recommendations.push('Improve goal-objective alignment through the alignment matrix')
  }
  if (atRiskGoals.length > onTrackGoals.length) {
    recommendations.push('High-priority review needed - more goals at risk than on track')
  }
  
  return {
    strategicLikelihood: finalScore,
    riskFactors,
    confidenceInterval: [
      Math.max(0, finalScore - confidenceRange),
      Math.min(100, finalScore + confidenceRange)
    ],
    recommendations: recommendations.length > 0 ? recommendations : ['Strategic targets appear well-positioned'],
    breakdown: {
      onTrack: onTrackGoals.length,
      atRisk: atRiskGoals.length,
      behind: behindGoals.length,
      total: yearEndGoals.length
    },
    objectiveAlignment: {
      aligned: alignedGoals,
      total: goals.length,
      score: alignmentScore
    }
  }
}