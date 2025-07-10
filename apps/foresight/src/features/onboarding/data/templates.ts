import type { ScenarioTemplate } from '../types';

export const scenarioTemplates: ScenarioTemplate[] = [
  {
    id: 'market-expansion-eu',
    name: 'European Market Expansion',
    description: 'Evaluate the impact of expanding business operations into European markets',
    category: 'market-expansion',
    difficulty: 'intermediate',
    estimatedTime: 45,
    tags: ['international', 'expansion', 'revenue-growth', 'market-analysis'],
    data: {
      name: 'European Market Expansion Analysis',
      description: 'Strategic analysis of expanding operations to key European markets including Germany, France, and the UK.',
      businessLevers: [
        {
          id: 'bl-1',
          name: 'Marketing Investment',
          type: 'cost',
          baseValue: 500000,
          unit: 'USD',
          range: { min: 200000, max: 1000000 },
          impact: 'high'
        },
        {
          id: 'bl-2',
          name: 'Local Hiring',
          type: 'cost',
          baseValue: 150000,
          unit: 'USD per employee',
          range: { min: 100000, max: 200000 },
          impact: 'medium'
        },
        {
          id: 'bl-3',
          name: 'Market Penetration Rate',
          type: 'market',
          baseValue: 5,
          unit: 'percentage',
          range: { min: 2, max: 15 },
          impact: 'high'
        }
      ],
      outcomes: [
        {
          id: 'oc-1',
          name: 'Annual Revenue Increase',
          metric: 'revenue_growth',
          targetValue: 2500000,
          unit: 'USD',
          priority: 'high'
        },
        {
          id: 'oc-2',
          name: 'Customer Acquisition',
          metric: 'new_customers',
          targetValue: 10000,
          unit: 'customers',
          priority: 'high'
        },
        {
          id: 'oc-3',
          name: 'Break-even Timeline',
          metric: 'break_even_months',
          targetValue: 18,
          unit: 'months',
          priority: 'medium'
        }
      ],
      riskFactors: [
        {
          id: 'rf-1',
          name: 'Regulatory Compliance Delays',
          probability: 0.3,
          impact: 0.7,
          mitigation: 'Engage local legal counsel early in the process'
        },
        {
          id: 'rf-2',
          name: 'Currency Exchange Rate Volatility',
          probability: 0.6,
          impact: 0.4,
          mitigation: 'Implement currency hedging strategies'
        },
        {
          id: 'rf-3',
          name: 'Competition from Local Players',
          probability: 0.8,
          impact: 0.6,
          mitigation: 'Develop unique value propositions for local markets'
        }
      ],
      assumptions: [
        'GDPR compliance costs are included in marketing investment',
        'Exchange rates remain within 10% of current levels',
        'No major economic downturn in target markets',
        'Local talent acquisition within 6 months'
      ]
    },
    preview: {
      metrics: {
        'Potential Revenue': '$2.5M+',
        'Investment Required': '$650K-$1.2M',
        'Risk Level': 'Medium-High',
        'Timeline': '12-24 months'
      }
    }
  },
  {
    id: 'product-launch-saas',
    name: 'SaaS Product Launch',
    description: 'Model the financial impact and market dynamics of launching a new SaaS product',
    category: 'product-launch',
    difficulty: 'beginner',
    estimatedTime: 30,
    tags: ['saas', 'product-launch', 'subscription', 'revenue-model'],
    data: {
      name: 'New SaaS Product Launch',
      description: 'Financial modeling and market impact analysis for launching a new Software-as-a-Service product.',
      businessLevers: [
        {
          id: 'bl-1',
          name: 'Monthly Subscription Price',
          type: 'revenue',
          baseValue: 49,
          unit: 'USD per month',
          range: { min: 29, max: 99 },
          impact: 'high'
        },
        {
          id: 'bl-2',
          name: 'Customer Acquisition Cost',
          type: 'cost',
          baseValue: 150,
          unit: 'USD per customer',
          range: { min: 75, max: 300 },
          impact: 'high'
        },
        {
          id: 'bl-3',
          name: 'Monthly Churn Rate',
          type: 'efficiency',
          baseValue: 5,
          unit: 'percentage',
          range: { min: 2, max: 10 },
          impact: 'high'
        }
      ],
      outcomes: [
        {
          id: 'oc-1',
          name: 'Monthly Recurring Revenue',
          metric: 'mrr',
          targetValue: 100000,
          unit: 'USD',
          priority: 'high'
        },
        {
          id: 'oc-2',
          name: 'Customer Lifetime Value',
          metric: 'clv',
          targetValue: 1200,
          unit: 'USD',
          priority: 'high'
        },
        {
          id: 'oc-3',
          name: 'Payback Period',
          metric: 'payback_months',
          targetValue: 6,
          unit: 'months',
          priority: 'medium'
        }
      ],
      riskFactors: [
        {
          id: 'rf-1',
          name: 'Higher Than Expected Churn',
          probability: 0.4,
          impact: 0.8,
          mitigation: 'Implement robust onboarding and customer success programs'
        },
        {
          id: 'rf-2',
          name: 'Increased Competition',
          probability: 0.7,
          impact: 0.6,
          mitigation: 'Focus on unique features and superior customer experience'
        },
        {
          id: 'rf-3',
          name: 'Technical Scaling Issues',
          probability: 0.3,
          impact: 0.7,
          mitigation: 'Invest in scalable infrastructure from the start'
        }
      ],
      assumptions: [
        'Market size supports target customer acquisition goals',
        'Product-market fit achieved before full launch',
        'Customer acquisition channels are scalable',
        'Pricing elasticity within modeled ranges'
      ]
    },
    preview: {
      metrics: {
        'Target MRR': '$100K',
        'Customer LTV': '$1,200',
        'Break-even': '6 months',
        'Risk Level': 'Medium'
      }
    }
  },
  {
    id: 'cost-optimization',
    name: 'Operational Cost Optimization',
    description: 'Analyze potential savings from operational efficiency improvements',
    category: 'operational-efficiency',
    difficulty: 'beginner',
    estimatedTime: 25,
    tags: ['cost-reduction', 'efficiency', 'operations', 'automation'],
    data: {
      name: 'Operational Cost Optimization Initiative',
      description: 'Comprehensive analysis of operational cost reduction opportunities through process improvement and automation.',
      businessLevers: [
        {
          id: 'bl-1',
          name: 'Process Automation Level',
          type: 'efficiency',
          baseValue: 30,
          unit: 'percentage',
          range: { min: 10, max: 80 },
          impact: 'high'
        },
        {
          id: 'bl-2',
          name: 'Automation Investment',
          type: 'cost',
          baseValue: 250000,
          unit: 'USD',
          range: { min: 100000, max: 500000 },
          impact: 'medium'
        },
        {
          id: 'bl-3',
          name: 'Staff Reallocation',
          type: 'efficiency',
          baseValue: 20,
          unit: 'percentage',
          range: { min: 5, max: 40 },
          impact: 'medium'
        }
      ],
      outcomes: [
        {
          id: 'oc-1',
          name: 'Annual Cost Savings',
          metric: 'cost_savings',
          targetValue: 500000,
          unit: 'USD',
          priority: 'high'
        },
        {
          id: 'oc-2',
          name: 'Productivity Improvement',
          metric: 'productivity_gain',
          targetValue: 25,
          unit: 'percentage',
          priority: 'high'
        },
        {
          id: 'oc-3',
          name: 'ROI Timeline',
          metric: 'roi_months',
          targetValue: 12,
          unit: 'months',
          priority: 'medium'
        }
      ],
      riskFactors: [
        {
          id: 'rf-1',
          name: 'Employee Resistance to Change',
          probability: 0.5,
          impact: 0.6,
          mitigation: 'Implement comprehensive change management and training programs'
        },
        {
          id: 'rf-2',
          name: 'Technology Integration Issues',
          probability: 0.3,
          impact: 0.7,
          mitigation: 'Conduct thorough technical assessment and pilot programs'
        },
        {
          id: 'rf-3',
          name: 'Overestimated Savings',
          probability: 0.4,
          impact: 0.5,
          mitigation: 'Use conservative estimates and regular progress monitoring'
        }
      ],
      assumptions: [
        'Current operational processes have identifiable inefficiencies',
        'Technology solutions are available and proven',
        'Staff can be retrained for higher-value activities',
        'No major business disruption during implementation'
      ]
    },
    preview: {
      metrics: {
        'Annual Savings': '$500K',
        'Productivity Gain': '25%',
        'Investment': '$250K',
        'ROI': '12 months'
      }
    }
  },
  {
    id: 'digital-transformation',
    name: 'Enterprise Digital Transformation',
    description: 'Model the comprehensive impact of digital transformation initiatives',
    category: 'digital-transformation',
    difficulty: 'advanced',
    estimatedTime: 60,
    tags: ['digital', 'transformation', 'technology', 'strategy', 'change-management'],
    data: {
      name: 'Enterprise Digital Transformation Program',
      description: 'Strategic analysis of enterprise-wide digital transformation including technology modernization, process digitization, and cultural change.',
      businessLevers: [
        {
          id: 'bl-1',
          name: 'Technology Investment',
          type: 'cost',
          baseValue: 2000000,
          unit: 'USD',
          range: { min: 1000000, max: 5000000 },
          impact: 'high'
        },
        {
          id: 'bl-2',
          name: 'Training and Change Management',
          type: 'cost',
          baseValue: 500000,
          unit: 'USD',
          range: { min: 200000, max: 1000000 },
          impact: 'high'
        },
        {
          id: 'bl-3',
          name: 'Process Digitization Rate',
          type: 'efficiency',
          baseValue: 60,
          unit: 'percentage',
          range: { min: 30, max: 90 },
          impact: 'high'
        },
        {
          id: 'bl-4',
          name: 'Employee Adoption Rate',
          type: 'efficiency',
          baseValue: 75,
          unit: 'percentage',
          range: { min: 50, max: 95 },
          impact: 'high'
        }
      ],
      outcomes: [
        {
          id: 'oc-1',
          name: 'Operational Efficiency Gain',
          metric: 'efficiency_improvement',
          targetValue: 35,
          unit: 'percentage',
          priority: 'high'
        },
        {
          id: 'oc-2',
          name: 'Customer Experience Score',
          metric: 'cx_score',
          targetValue: 8.5,
          unit: 'out of 10',
          priority: 'high'
        },
        {
          id: 'oc-3',
          name: 'Annual Cost Reduction',
          metric: 'cost_reduction',
          targetValue: 1500000,
          unit: 'USD',
          priority: 'high'
        },
        {
          id: 'oc-4',
          name: 'Revenue Growth from New Capabilities',
          metric: 'new_revenue',
          targetValue: 3000000,
          unit: 'USD',
          priority: 'medium'
        }
      ],
      riskFactors: [
        {
          id: 'rf-1',
          name: 'Organizational Change Resistance',
          probability: 0.7,
          impact: 0.8,
          mitigation: 'Strong executive sponsorship and comprehensive change management'
        },
        {
          id: 'rf-2',
          name: 'Technology Integration Complexity',
          probability: 0.6,
          impact: 0.7,
          mitigation: 'Phased implementation approach with experienced integration partners'
        },
        {
          id: 'rf-3',
          name: 'Skills Gap in Digital Capabilities',
          probability: 0.8,
          impact: 0.6,
          mitigation: 'Extensive training programs and strategic hiring initiatives'
        },
        {
          id: 'rf-4',
          name: 'Cybersecurity Vulnerabilities',
          probability: 0.4,
          impact: 0.9,
          mitigation: 'Comprehensive security framework and regular audits'
        }
      ],
      assumptions: [
        'Executive leadership is committed to transformation',
        'Adequate budget and resources are available',
        'Technology vendors can deliver on promises',
        'Market conditions remain stable during transformation',
        'Key talent can be retained during change'
      ]
    },
    preview: {
      metrics: {
        'Efficiency Gain': '35%',
        'Cost Reduction': '$1.5M',
        'New Revenue': '$3M',
        'Investment': '$2.5M'
      }
    }
  },
  {
    id: 'financial-planning',
    name: 'Annual Financial Planning',
    description: 'Comprehensive financial planning and budgeting scenario analysis',
    category: 'financial-planning',
    difficulty: 'intermediate',
    estimatedTime: 40,
    tags: ['budget', 'planning', 'finance', 'forecasting'],
    data: {
      name: 'Annual Financial Planning & Budgeting',
      description: 'Strategic financial planning analysis for annual budgeting and resource allocation decisions.',
      businessLevers: [
        {
          id: 'bl-1',
          name: 'Revenue Growth Target',
          type: 'revenue',
          baseValue: 15,
          unit: 'percentage',
          range: { min: 5, max: 30 },
          impact: 'high'
        },
        {
          id: 'bl-2',
          name: 'Operating Expense Budget',
          type: 'cost',
          baseValue: 5000000,
          unit: 'USD',
          range: { min: 4000000, max: 6500000 },
          impact: 'high'
        },
        {
          id: 'bl-3',
          name: 'Capital Investment',
          type: 'cost',
          baseValue: 1000000,
          unit: 'USD',
          range: { min: 500000, max: 2000000 },
          impact: 'medium'
        }
      ],
      outcomes: [
        {
          id: 'oc-1',
          name: 'Net Profit Margin',
          metric: 'profit_margin',
          targetValue: 12,
          unit: 'percentage',
          priority: 'high'
        },
        {
          id: 'oc-2',
          name: 'Cash Flow',
          metric: 'cash_flow',
          targetValue: 2000000,
          unit: 'USD',
          priority: 'high'
        },
        {
          id: 'oc-3',
          name: 'Return on Investment',
          metric: 'roi',
          targetValue: 18,
          unit: 'percentage',
          priority: 'medium'
        }
      ],
      riskFactors: [
        {
          id: 'rf-1',
          name: 'Economic Downturn',
          probability: 0.3,
          impact: 0.8,
          mitigation: 'Maintain conservative cash reserves and flexible cost structure'
        },
        {
          id: 'rf-2',
          name: 'Market Competition Intensifies',
          probability: 0.6,
          impact: 0.5,
          mitigation: 'Invest in differentiation and customer retention'
        },
        {
          id: 'rf-3',
          name: 'Supply Chain Disruptions',
          probability: 0.4,
          impact: 0.6,
          mitigation: 'Diversify suppliers and build inventory buffers'
        }
      ],
      assumptions: [
        'Historical growth trends continue with adjustments',
        'No major regulatory changes affecting operations',
        'Key personnel retention at current levels',
        'Technology investments yield expected productivity gains'
      ]
    },
    preview: {
      metrics: {
        'Target Growth': '15%',
        'OpEx Budget': '$5M',
        'Profit Margin': '12%',
        'ROI': '18%'
      }
    }
  }
];