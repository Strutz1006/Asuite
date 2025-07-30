-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  industry VARCHAR,
  size_category VARCHAR,
  website VARCHAR,
  logo_url VARCHAR,
  timezone VARCHAR DEFAULT 'UTC',
  settings JSONB DEFAULT '{}',
  active_products TEXT[] DEFAULT '{}',
  subscription_tier VARCHAR DEFAULT 'free',
  ai_coach_enabled BOOLEAN DEFAULT false,
  trust_layer_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  vision_statement TEXT,
  mission_statement TEXT,
  core_values JSONB DEFAULT '[]',
  vision_last_updated TIMESTAMPTZ,
  mission_last_updated TIMESTAMPTZ
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  head_of_department_id UUID,
  parent_department_id UUID REFERENCES departments(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  team_lead_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR NOT NULL UNIQUE,
  full_name VARCHAR,
  avatar_url VARCHAR,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role VARCHAR DEFAULT 'contributor',
  department VARCHAR,
  job_title VARCHAR,
  permissions JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  department_id UUID REFERENCES departments(id),
  team_id UUID REFERENCES teams(id)
);

-- Add foreign key constraints for department and team leads
ALTER TABLE departments ADD CONSTRAINT fk_department_head 
  FOREIGN KEY (head_of_department_id) REFERENCES users(id);
ALTER TABLE teams ADD CONSTRAINT fk_team_lead 
  FOREIGN KEY (team_lead_id) REFERENCES users(id);

-- Activity Logging
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product VARCHAR NOT NULL,
  action VARCHAR NOT NULL,
  entity_type VARCHAR,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  app VARCHAR NOT NULL,
  type VARCHAR,
  title VARCHAR NOT NULL,
  message TEXT,
  entity_type VARCHAR,
  entity_id UUID,
  priority VARCHAR DEFAULT 'medium',
  read_at TIMESTAMPTZ,
  action_url VARCHAR,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cross-App Links
CREATE TABLE IF NOT EXISTS cross_app_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  source_app VARCHAR NOT NULL,
  source_entity_type VARCHAR NOT NULL,
  source_entity_id UUID NOT NULL,
  target_app VARCHAR NOT NULL,
  target_entity_type VARCHAR NOT NULL,
  target_entity_id UUID NOT NULL,
  link_type VARCHAR,
  strength INTEGER DEFAULT 1 CHECK (strength >= 1 AND strength <= 5),
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Value Impacts
CREATE TABLE IF NOT EXISTS value_impacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  source_app VARCHAR NOT NULL,
  source_entity_id UUID NOT NULL,
  impact_category VARCHAR,
  metric_name VARCHAR,
  baseline_value NUMERIC,
  current_value NUMERIC,
  target_value NUMERIC,
  unit VARCHAR,
  measurement_period VARCHAR,
  stakeholder_group VARCHAR,
  verified BOOLEAN DEFAULT false,
  verification_source VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coach Interactions
CREATE TABLE IF NOT EXISTS coach_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  app VARCHAR NOT NULL,
  context_entity_type VARCHAR,
  context_entity_id UUID,
  query TEXT,
  response TEXT,
  interaction_type VARCHAR,
  sentiment VARCHAR,
  helpful_rating INTEGER CHECK (helpful_rating >= 1 AND helpful_rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_activity_logs_organization ON activity_logs(organization_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read_at);
CREATE INDEX idx_cross_app_links_source ON cross_app_links(source_app, source_entity_id);
CREATE INDEX idx_cross_app_links_target ON cross_app_links(target_app, target_entity_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_value_impacts_updated_at BEFORE UPDATE ON value_impacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();