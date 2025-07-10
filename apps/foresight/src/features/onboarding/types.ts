export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode | string;
  action?: {
    label: string;
    onClick: () => void;
  };
  completed: boolean;
  skippable: boolean;
}

export interface OnboardingFlow {
  id: string;
  name: string;
  description: string;
  steps: OnboardingStep[];
  currentStep: number;
  completed: boolean;
}

export interface ScenarioTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  tags: string[];
  data: {
    name: string;
    description: string;
    businessLevers: BusinessLever[];
    outcomes: Outcome[];
    riskFactors: RiskFactor[];
    assumptions: string[];
  };
  preview?: {
    image?: string;
    metrics?: Record<string, any>;
  };
}

export type TemplateCategory = 
  | 'financial-planning'
  | 'market-expansion'
  | 'product-launch'
  | 'operational-efficiency'
  | 'risk-assessment'
  | 'strategic-planning'
  | 'digital-transformation';

export interface BusinessLever {
  id: string;
  name: string;
  type: 'revenue' | 'cost' | 'efficiency' | 'market';
  baseValue: number;
  unit: string;
  range: {
    min: number;
    max: number;
  };
  impact: 'high' | 'medium' | 'low';
}

export interface Outcome {
  id: string;
  name: string;
  metric: string;
  targetValue: number;
  unit: string;
  priority: 'high' | 'medium' | 'low';
}

export interface RiskFactor {
  id: string;
  name: string;
  probability: number; // 0-1
  impact: number; // 0-1
  mitigation?: string;
}

export interface TemplateLibrary {
  templates: ScenarioTemplate[];
  categories: TemplateCategory[];
  searchQuery: string;
  selectedCategory?: TemplateCategory;
  selectedDifficulty?: ScenarioTemplate['difficulty'];
}

export interface UserProgress {
  completedOnboarding: boolean;
  completedSteps: string[];
  templatesUsed: string[];
  lastActiveStep?: string;
}