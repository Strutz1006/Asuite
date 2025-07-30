-- Foresight App Tables

-- Scenarios
CREATE TABLE IF NOT EXISTS foresight_scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR,
  owner_id UUID REFERENCES users(id),
  status VARCHAR DEFAULT 'draft',
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  timeline_months INTEGER,
  investment_required NUMERIC,
  expected_roi NUMERIC,
  risk_level VARCHAR,
  created_from_template BOOLEAN DEFAULT false,
  template_id UUID,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business Levers
CREATE TABLE IF NOT EXISTS foresight_business_levers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scenario_id UUID REFERENCES foresight_scenarios(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  current_value NUMERIC,
  proposed_value NUMERIC,
  min_value NUMERIC,
  max_value NUMERIC,
  unit VARCHAR,
  impact_category VARCHAR,
  lever_type VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Outcomes
CREATE TABLE IF NOT EXISTS foresight_outcomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scenario_id UUID REFERENCES foresight_scenarios(id) ON DELETE CASCADE,
  metric_name VARCHAR NOT NULL,
  metric_category VARCHAR,
  baseline_value NUMERIC,
  projected_value NUMERIC,
  variance_percentage NUMERIC,
  confidence_score INTEGER,
  timeline_months INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Risk Factors
CREATE TABLE IF NOT EXISTS foresight_risk_factors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scenario_id UUID REFERENCES foresight_scenarios(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  probability INTEGER CHECK (probability >= 0 AND probability <= 100),
  impact VARCHAR,
  mitigation_strategy TEXT,
  status VARCHAR DEFAULT 'identified',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scenario Variables
CREATE TABLE IF NOT EXISTS foresight_scenario_variables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scenario_id UUID REFERENCES foresight_scenarios(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  variable_type VARCHAR NOT NULL,
  value NUMERIC NOT NULL,
  unit VARCHAR,
  min_value NUMERIC,
  max_value NUMERIC,
  formula TEXT,
  dependencies JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Simulation Runs
CREATE TABLE IF NOT EXISTS foresight_simulation_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scenario_id UUID REFERENCES foresight_scenarios(id) ON DELETE CASCADE,
  simulation_type VARCHAR NOT NULL,
  iterations INTEGER DEFAULT 1000,
  confidence_level NUMERIC DEFAULT 95,
  status VARCHAR DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  results JSONB DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Impact Assessments
CREATE TABLE IF NOT EXISTS foresight_impact_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scenario_id UUID REFERENCES foresight_scenarios(id) ON DELETE CASCADE,
  dimension VARCHAR NOT NULL,
  impact_score NUMERIC NOT NULL,
  confidence_score NUMERIC NOT NULL,
  trend VARCHAR,
  metrics JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stakeholder Impacts
CREATE TABLE IF NOT EXISTS foresight_stakeholder_impacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scenario_id UUID REFERENCES foresight_scenarios(id) ON DELETE CASCADE,
  stakeholder_group VARCHAR NOT NULL,
  impact_score NUMERIC NOT NULL,
  confidence_score NUMERIC NOT NULL,
  description TEXT,
  priority VARCHAR DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_foresight_scenarios_organization ON foresight_scenarios(organization_id);
CREATE INDEX idx_foresight_scenarios_owner ON foresight_scenarios(owner_id);
CREATE INDEX idx_foresight_scenarios_status ON foresight_scenarios(status);
CREATE INDEX idx_foresight_business_levers_scenario ON foresight_business_levers(scenario_id);
CREATE INDEX idx_foresight_outcomes_scenario ON foresight_outcomes(scenario_id);
CREATE INDEX idx_foresight_risk_factors_scenario ON foresight_risk_factors(scenario_id);
CREATE INDEX idx_foresight_scenario_variables_scenario ON foresight_scenario_variables(scenario_id);
CREATE INDEX idx_foresight_simulation_runs_scenario ON foresight_simulation_runs(scenario_id);
CREATE INDEX idx_foresight_impact_assessments_scenario ON foresight_impact_assessments(scenario_id);
CREATE INDEX idx_foresight_stakeholder_impacts_scenario ON foresight_stakeholder_impacts(scenario_id);

-- Apply updated_at triggers
CREATE TRIGGER update_foresight_scenarios_updated_at BEFORE UPDATE ON foresight_scenarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();