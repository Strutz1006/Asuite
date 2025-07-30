-- Catalyst App Tables

-- Journeys
CREATE TABLE IF NOT EXISTS catalyst_journeys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  type VARCHAR,
  status VARCHAR DEFAULT 'planning',
  phase VARCHAR,
  owner_id UUID REFERENCES users(id),
  start_date DATE,
  target_completion_date DATE,
  actual_completion_date DATE,
  readiness_score INTEGER CHECK (readiness_score >= 0 AND readiness_score <= 100),
  adoption_percentage INTEGER DEFAULT 0,
  resistance_level VARCHAR,
  budget_allocated NUMERIC,
  budget_spent NUMERIC,
  stakeholder_count INTEGER DEFAULT 0,
  champion_count INTEGER DEFAULT 0,
  risk_count INTEGER DEFAULT 0,
  success_criteria TEXT,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities
CREATE TABLE IF NOT EXISTS catalyst_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journey_id UUID REFERENCES catalyst_journeys(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  type VARCHAR,
  status VARCHAR DEFAULT 'planned',
  assigned_to UUID REFERENCES users(id),
  due_date DATE,
  completion_date DATE,
  participants TEXT[],
  success_criteria TEXT,
  results TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stakeholders
CREATE TABLE IF NOT EXISTS catalyst_stakeholders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journey_id UUID REFERENCES catalyst_journeys(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  influence_level VARCHAR,
  engagement_level VARCHAR,
  communication_preference VARCHAR,
  training_completed BOOLEAN DEFAULT false,
  feedback_score INTEGER CHECK (feedback_score >= 1 AND feedback_score <= 5),
  last_interaction TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Surveys
CREATE TABLE IF NOT EXISTS catalyst_surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journey_id UUID REFERENCES catalyst_journeys(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  type VARCHAR,
  questions JSONB NOT NULL,
  target_audience TEXT[],
  response_count INTEGER DEFAULT 0,
  sent_at TIMESTAMPTZ,
  closes_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Survey Responses
CREATE TABLE IF NOT EXISTS catalyst_survey_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  survey_id UUID REFERENCES catalyst_surveys(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  responses JSONB NOT NULL,
  sentiment_score NUMERIC,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journey Phases
CREATE TABLE IF NOT EXISTS catalyst_journey_phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journey_id UUID REFERENCES catalyst_journeys(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  duration_weeks INTEGER,
  status VARCHAR DEFAULT 'pending',
  start_date DATE,
  end_date DATE,
  completion_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stakeholder Engagement
CREATE TABLE IF NOT EXISTS catalyst_stakeholder_engagement (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stakeholder_id UUID REFERENCES catalyst_stakeholders(id) ON DELETE CASCADE,
  engagement_type VARCHAR NOT NULL,
  engagement_date TIMESTAMPTZ NOT NULL,
  outcome VARCHAR,
  notes TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_catalyst_journeys_organization ON catalyst_journeys(organization_id);
CREATE INDEX idx_catalyst_journeys_owner ON catalyst_journeys(owner_id);
CREATE INDEX idx_catalyst_journeys_status ON catalyst_journeys(status);
CREATE INDEX idx_catalyst_activities_journey ON catalyst_activities(journey_id);
CREATE INDEX idx_catalyst_activities_assigned ON catalyst_activities(assigned_to);
CREATE INDEX idx_catalyst_stakeholders_journey ON catalyst_stakeholders(journey_id);
CREATE INDEX idx_catalyst_stakeholders_user ON catalyst_stakeholders(user_id);
CREATE INDEX idx_catalyst_surveys_journey ON catalyst_surveys(journey_id);
CREATE INDEX idx_catalyst_survey_responses_survey ON catalyst_survey_responses(survey_id);
CREATE INDEX idx_catalyst_journey_phases_journey ON catalyst_journey_phases(journey_id);

-- Apply updated_at triggers
CREATE TRIGGER update_catalyst_journeys_updated_at BEFORE UPDATE ON catalyst_journeys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();