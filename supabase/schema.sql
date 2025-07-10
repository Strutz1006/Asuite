-- Aesyros Suite Database Schema
-- This schema supports all 5 applications: Align, Pulse, Catalyst, Flow, Foresight

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users and Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user', -- admin, manager, user
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ALIGN: Goals and OKRs
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- 'objective', 'key_result', 'goal'
    parent_id UUID REFERENCES goals(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES users(id),
    target_value NUMERIC,
    current_value NUMERIC DEFAULT 0,
    unit TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'active', -- active, completed, paused, cancelled
    progress NUMERIC DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE goal_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    value NUMERIC NOT NULL,
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PULSE: KPIs and Metrics
CREATE TABLE kpis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- financial, operational, customer, growth
    formula TEXT,
    target_value NUMERIC,
    unit TEXT,
    frequency TEXT NOT NULL, -- daily, weekly, monthly, quarterly
    owner_id UUID REFERENCES users(id),
    data_source TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE kpi_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kpi_id UUID NOT NULL REFERENCES kpis(id) ON DELETE CASCADE,
    value NUMERIC NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    recorded_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CATALYST: Change Management
CREATE TABLE change_journeys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'planning', -- planning, in_progress, completed, paused
    phase TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    completion_percentage NUMERIC DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    readiness_score NUMERIC DEFAULT 0 CHECK (readiness_score >= 0 AND readiness_score <= 100),
    resistance_level TEXT DEFAULT 'low', -- low, medium, high
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE stakeholders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    name TEXT NOT NULL,
    role TEXT,
    department TEXT,
    influence_level TEXT NOT NULL, -- low, medium, high
    engagement_level TEXT DEFAULT 'neutral', -- champion, supporter, neutral, skeptic, resistor
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE journey_stakeholders (
    journey_id UUID REFERENCES change_journeys(id) ON DELETE CASCADE,
    stakeholder_id UUID REFERENCES stakeholders(id) ON DELETE CASCADE,
    PRIMARY KEY (journey_id, stakeholder_id)
);

-- FLOW: Process Management
CREATE TABLE processes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    version TEXT DEFAULT '1.0',
    owner_id UUID REFERENCES users(id),
    category TEXT,
    status TEXT DEFAULT 'active', -- active, draft, archived
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE process_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    process_id UUID NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_number INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT false,
    estimated_time_minutes INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    process_id UUID REFERENCES processes(id),
    name TEXT NOT NULL,
    content TEXT,
    file_url TEXT,
    version TEXT DEFAULT '1.0',
    quality_score NUMERIC CHECK (quality_score >= 0 AND quality_score <= 100),
    compliance_status TEXT DEFAULT 'pending', -- pass, review, fail, pending
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE validation_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    severity TEXT NOT NULL, -- low, medium, high
    type TEXT NOT NULL, -- compliance, clarity, completeness, efficiency
    line_number INTEGER,
    suggestion TEXT,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FORESIGHT: Strategy Simulation
CREATE TABLE scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    confidence_score NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 100),
    created_by UUID REFERENCES users(id),
    parameters JSONB DEFAULT '{}',
    outcomes JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE business_levers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    current_value NUMERIC NOT NULL,
    min_value NUMERIC NOT NULL,
    max_value NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    category TEXT, -- marketing, operations, finance, hr
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE scenario_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scenario_id UUID NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
    lever_values JSONB NOT NULL,
    projected_outcomes JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shared: Comments and Collaboration
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    resource_type TEXT NOT NULL, -- goal, kpi, journey, process, scenario
    resource_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

-- Create policies for organization-based access
CREATE POLICY "Users can access their organization's data" ON goals
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM users WHERE id = auth.uid()
    ));

-- Add similar policies for other tables...

-- Indexes for performance
CREATE INDEX idx_goals_organization_id ON goals(organization_id);
CREATE INDEX idx_goals_parent_id ON goals(parent_id);
CREATE INDEX idx_goals_owner_id ON goals(owner_id);
CREATE INDEX idx_kpis_organization_id ON kpis(organization_id);
CREATE INDEX idx_change_journeys_organization_id ON change_journeys(organization_id);
CREATE INDEX idx_processes_organization_id ON processes(organization_id);
CREATE INDEX idx_scenarios_organization_id ON scenarios(organization_id);

-- Functions and triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_kpis_updated_at BEFORE UPDATE ON kpis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_change_journeys_updated_at BEFORE UPDATE ON change_journeys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_processes_updated_at BEFORE UPDATE ON processes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scenarios_updated_at BEFORE UPDATE ON scenarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();