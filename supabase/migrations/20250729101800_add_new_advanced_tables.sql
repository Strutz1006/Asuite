-- Add only new advanced tables (skip existing core tables)

-- Analytics cache for performance optimization (NEW)
CREATE TABLE IF NOT EXISTS analytics_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  metric_key VARCHAR NOT NULL,
  metric_value JSONB NOT NULL DEFAULT '{}',
  calculation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cross-app data synchronization tracking (NEW)
CREATE TABLE IF NOT EXISTS app_data_sync (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  source_app VARCHAR NOT NULL,
  target_app VARCHAR NOT NULL,
  entity_type VARCHAR NOT NULL,
  entity_id UUID NOT NULL,
  sync_frequency VARCHAR DEFAULT 'hourly',
  last_sync_at TIMESTAMPTZ,
  sync_status VARCHAR DEFAULT 'pending',
  error_details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhanced notifications with new columns (ADD COLUMNS)
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS delivery_channels TEXT[] DEFAULT ARRAY['email'];
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS escalation_rules JSONB DEFAULT '{}';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS auto_resolve_conditions JSONB DEFAULT '{}';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ;

-- ML models support for AI features (NEW)
CREATE TABLE IF NOT EXISTS ml_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  app VARCHAR NOT NULL,
  model_type VARCHAR NOT NULL,
  model_config JSONB DEFAULT '{}',
  training_data_refs JSONB DEFAULT '[]',
  accuracy_metrics JSONB DEFAULT '{}',
  version VARCHAR DEFAULT 'v1.0',
  status VARCHAR DEFAULT 'training',
  last_trained_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Align: Milestones for objectives (NEW)
CREATE TABLE IF NOT EXISTS align_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  objective_id UUID REFERENCES align_objectives(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  target_date DATE,
  completion_date DATE,
  status VARCHAR DEFAULT 'pending',
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Align: Progress analytics and forecasting (NEW)
CREATE TABLE IF NOT EXISTS align_progress_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  objective_id UUID REFERENCES align_objectives(id) ON DELETE CASCADE,
  calculation_date DATE NOT NULL,
  velocity_score NUMERIC,
  trend_direction VARCHAR,
  projected_completion_date DATE,
  confidence_level INTEGER CHECK (confidence_level >= 0 AND confidence_level <= 100),
  risk_factors JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Align: Comments and collaboration (NEW)
CREATE TABLE IF NOT EXISTS align_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  objective_id UUID REFERENCES align_objectives(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES align_comments(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pulse: KPI validation and quality (NEW)
CREATE TABLE IF NOT EXISTS pulse_kpi_validation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kpi_id UUID REFERENCES pulse_kpis(id) ON DELETE CASCADE,
  validation_type VARCHAR NOT NULL,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  recommendations TEXT,
  data_quality_issues JSONB DEFAULT '[]',
  last_validated_at TIMESTAMPTZ DEFAULT NOW(),
  validated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drive: Enhanced time tracking (ADD COLUMNS)
ALTER TABLE drive_time_entries ADD COLUMN IF NOT EXISTS productivity_score INTEGER CHECK (productivity_score >= 1 AND productivity_score <= 10);
ALTER TABLE drive_time_entries ADD COLUMN IF NOT EXISTS focus_rating INTEGER CHECK (focus_rating >= 1 AND focus_rating <= 10);
ALTER TABLE drive_time_entries ADD COLUMN IF NOT EXISTS break_time_minutes INTEGER DEFAULT 0;
ALTER TABLE drive_time_entries ADD COLUMN IF NOT EXISTS interruption_count INTEGER DEFAULT 0;

-- Drive: Goal breakdown tracking (NEW)
CREATE TABLE IF NOT EXISTS drive_goal_breakdowns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID REFERENCES align_objectives(id) ON DELETE CASCADE,
  project_id UUID REFERENCES drive_projects(id) ON DELETE CASCADE,
  breakdown_type VARCHAR DEFAULT 'milestone',
  estimated_effort_hours NUMERIC,
  strategic_weight NUMERIC DEFAULT 1.0,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add essential indexes (CREATE IF NOT EXISTS would be nice but not available for indexes)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_analytics_cache_org_key') THEN
        CREATE INDEX idx_analytics_cache_org_key ON analytics_cache(organization_id, metric_key);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_align_milestones_objective') THEN
        CREATE INDEX idx_align_milestones_objective ON align_milestones(objective_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_align_comments_objective') THEN
        CREATE INDEX idx_align_comments_objective ON align_comments(objective_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_pulse_kpi_validation_kpi') THEN
        CREATE INDEX idx_pulse_kpi_validation_kpi ON pulse_kpi_validation(kpi_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_drive_goal_breakdowns_goal') THEN
        CREATE INDEX idx_drive_goal_breakdowns_goal ON drive_goal_breakdowns(goal_id);
    END IF;
END $$;