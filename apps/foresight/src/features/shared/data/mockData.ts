export const mockScenarios = [
  { 
    id: '1',
    name: "Aggressive Market Expansion", 
    confidence: 68, 
    impact: { revenue: "+18%", cost: "+25%", risk: "High", timeline: "18 months" },
    description: "Enter 3 new markets with dedicated teams and local partnerships",
    factors: ["Market penetration rate", "Competition response", "Regulatory barriers"],
    outcomes: {
      financial: { revenue: 118, profit: 95, cashflow: 85 },
      operational: { headcount: 135, efficiency: 88, satisfaction: 78 },
      strategic: { marketShare: 125, innovation: 110, sustainability: 92 }
    }
  },
  { 
    id: '2',
    name: "AI-Driven Optimization", 
    confidence: 85, 
    impact: { revenue: "+12%", cost: "-15%", risk: "Medium", timeline: "12 months" },
    description: "Implement AI across operations, customer service, and product development",
    factors: ["Technology adoption rate", "Employee training success", "ROI timeline"],
    outcomes: {
      financial: { revenue: 112, profit: 128, cashflow: 115 },
      operational: { headcount: 98, efficiency: 142, satisfaction: 85 },
      strategic: { marketShare: 108, innovation: 135, sustainability: 105 }
    }
  },
  { 
    id: '3',
    name: "Sustainability Focus", 
    confidence: 92, 
    impact: { revenue: "+8%", cost: "+5%", risk: "Low", timeline: "24 months" },
    description: "Comprehensive ESG transformation with carbon neutrality by 2026",
    factors: ["Consumer response", "Regulatory support", "Supply chain adaptation"],
    outcomes: {
      financial: { revenue: 108, profit: 103, cashflow: 102 },
      operational: { headcount: 105, efficiency: 115, satisfaction: 128 },
      strategic: { marketShare: 115, innovation: 120, sustainability: 165 }
    }
  },
];

export const mockBusinessLevers = [
  { name: "Marketing Spend", current: 65, min: 0, max: 100, unit: "% of revenue" },
  { name: "R&D Investment", current: 45, min: 0, max: 80, unit: "% allocation" },
  { name: "Headcount Growth", current: 20, min: -10, max: 50, unit: "% change" },
  { name: "Pricing Strategy", current: 75, min: 50, max: 120, unit: "index" },
  { name: "Geographic Expansion", current: 30, min: 0, max: 100, unit: "% coverage" },
  { name: "Automation Level", current: 40, min: 0, max: 90, unit: "% automated" }
];

export const mockRiskFactors = [
  { name: "Market Volatility", probability: 35, impact: "Medium", mitigation: "Diversification strategy" },
  { name: "Competitive Response", probability: 68, impact: "High", mitigation: "IP protection & innovation" },
  { name: "Regulatory Changes", probability: 42, impact: "Medium", mitigation: "Compliance monitoring" },
  { name: "Technology Disruption", probability: 55, impact: "High", mitigation: "Continuous R&D investment" },
  { name: "Economic Downturn", probability: 28, impact: "High", mitigation: "Financial reserves & flexibility" }
];

export const mockMarketInsights = [
  { 
    title: "Industry Growth Forecast", 
    value: "+12.5%", 
    trend: "up" as const, 
    description: "Sector expected to grow significantly over next 3 years",
    confidence: 88
  },
  { 
    title: "Competitive Pressure", 
    value: "Increasing", 
    trend: "down" as const, 
    description: "3 new entrants in key markets, pricing pressure expected",
    confidence: 75
  },
  { 
    title: "Technology Adoption", 
    value: "+45%", 
    trend: "up" as const, 
    description: "Customer demand for digital solutions accelerating",
    confidence: 92
  },
  { 
    title: "Regulatory Environment", 
    value: "Stable", 
    trend: "neutral" as const, 
    description: "No major policy changes expected in next 18 months",
    confidence: 82
  }
];

export const mockSimulationMetrics = {
  activeSimulations: 3,
  totalScenarios: 12,
  averageConfidence: 82,
  predictedROI: 14.2,
  riskLevel: "Medium" as const
};