-- Align App Tables

-- Company Setup
CREATE TABLE IF NOT EXISTS align_company_setup (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  setup_completed BOOLEAN DEFAULT false,
  goal_framework VARCHAR DEFAULT 'okr',
  planning_cycle VARCHAR DEFAULT 'quarterly',
  review_frequency VARCHAR DEFAULT 'monthly',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id)
);

-- Objectives
CREATE TABLE IF NOT EXISTS align_objectives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  level VARCHAR NOT NULL,
  parent_id UUID REFERENCES align_objectives(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES users(id),
  category VARCHAR,
  framework VARCHAR DEFAULT 'smart',
  target_value VARCHAR,
  current_value VARCHAR,
  unit VARCHAR,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  status VARCHAR DEFAULT 'active',
  priority VARCHAR DEFAULT 'medium',
  impact_weight NUMERIC DEFAULT 1.0,
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  start_date DATE,
  due_date DATE,
  completion_date DATE,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  department_id UUID REFERENCES departments(id),
  team_id UUID REFERENCES teams(id)
);

-- Key Results
CREATE TABLE IF NOT EXISTS align_key_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  objective_id UUID REFERENCES align_objectives(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  target_value VARCHAR,
  current_value VARCHAR,
  unit VARCHAR,
  progress_percentage INTEGER DEFAULT 0,
  status VARCHAR DEFAULT 'active',
  due_date DATE,
  completion_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress Updates
CREATE TABLE IF NOT EXISTS align_progress_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  objective_id UUID REFERENCES align_objectives(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  value VARCHAR,
  progress_percentage INTEGER,
  comment TEXT,
  confidence_score INTEGER,
  blockers TEXT,
  achievements TEXT,
  next_steps TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_align_objectives_organization ON align_objectives(organization_id);
CREATE INDEX idx_align_objectives_owner ON align_objectives(owner_id);
CREATE INDEX idx_align_objectives_parent ON align_objectives(parent_id);
CREATE INDEX idx_align_objectives_status ON align_objectives(status);
CREATE INDEX idx_align_key_results_objective ON align_key_results(objective_id);
CREATE INDEX idx_align_progress_updates_objective ON align_progress_updates(objective_id);

-- Apply updated_at triggers
CREATE TRIGGER update_align_company_setup_updated_at BEFORE UPDATE ON align_company_setup
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_align_objectives_updated_at BEFORE UPDATE ON align_objectives
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_align_key_results_updated_at BEFORE UPDATE ON align_key_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();