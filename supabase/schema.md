# Aesyros Suite Database Schema

This document outlines the complete database schema for the Aesyros Suite, consolidating the base schema and the enhanced organizational hierarchy schema.

## Base Schema (`schema.sql`)

```sql
-- Aesyros Suite Actual Database Schema
-- This reflects the current production schema structure

-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.organizations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  industry character varying,
  size_category character varying,
  website character varying,
  logo_url character varying,
  timezone character varying DEFAULT 'UTC'::character varying,
  settings jsonb DEFAULT '{}'::jsonb,
  active_products ARRAY DEFAULT '{}'::text[],
  subscription_tier character varying DEFAULT 'free'::character varying,
  ai_coach_enabled boolean DEFAULT false,
  trust_layer_enabled boolean DEFAULT false,
  vision_statement text,
  mission_statement text,
  core_values jsonb DEFAULT '[]'::jsonb,
  vision_last_updated timestamp with time zone,
  mission_last_updated timestamp with time zone,
  vision_updated_by uuid,
  mission_updated_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT organizations_pkey PRIMARY KEY (id),
  CONSTRAINT organizations_vision_updated_by_fkey FOREIGN KEY (vision_updated_by) REFERENCES public.users(id),
  CONSTRAINT organizations_mission_updated_by_fkey FOREIGN KEY (mission_updated_by) REFERENCES public.users(id)
);

CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email character varying NOT NULL UNIQUE,
  full_name character varying,
  avatar_url character varying,
  organization_id uuid,
  role character varying DEFAULT 'contributor'::character varying,
  department character varying,
  job_title character varying,
  permissions jsonb DEFAULT '{}'::jsonb,
  preferences jsonb DEFAULT '{}'::jsonb,
  last_active_at timestamp with time zone,
  department_id uuid,
  primary_team_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT users_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id),
  CONSTRAINT users_primary_team_id_fkey FOREIGN KEY (primary_team_id) REFERENCES public.teams(id)
);

-- ORGANIZATIONAL STRUCTURE
CREATE TABLE public.departments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL,
  name character varying NOT NULL,
  description text,
  code character varying,
  head_of_department_id uuid,
  parent_department_id uuid,
  budget_allocated numeric,
  employee_count integer DEFAULT 0,
  status character varying DEFAULT 'active'::character varying,
  goals_count integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT departments_pkey PRIMARY KEY (id),
  CONSTRAINT departments_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT departments_head_of_department_id_fkey FOREIGN KEY (head_of_department_id) REFERENCES public.users(id),
  CONSTRAINT departments_parent_department_id_fkey FOREIGN KEY (parent_department_id) REFERENCES public.departments(id)
);

CREATE TABLE public.teams (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL,
  department_id uuid NOT NULL,
  name character varying NOT NULL,
  description text,
  code character varying,
  team_lead_id uuid,
  team_type character varying DEFAULT 'functional'::character varying,
  member_count integer DEFAULT 0,
  status character varying DEFAULT 'active'::character varying,
  goals_count integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT teams_pkey PRIMARY KEY (id),
  CONSTRAINT teams_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT teams_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id),
  CONSTRAINT teams_team_lead_id_fkey FOREIGN KEY (team_lead_id) REFERENCES public.users(id)
);

CREATE TABLE public.team_memberships (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  team_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role character varying DEFAULT 'member'::character varying,
  joined_at timestamp with time zone DEFAULT now(),
  left_at timestamp with time zone,
  is_active boolean DEFAULT true,
  CONSTRAINT team_memberships_pkey PRIMARY KEY (id),
  CONSTRAINT team_memberships_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id),
  CONSTRAINT team_memberships_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- ALIGN: Strategic Goals & OKRs
CREATE TABLE public.align_objectives (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid,
  title character varying NOT NULL,
  description text,
  level character varying NOT NULL,
  parent_id uuid,
  owner_id uuid,
  category character varying,
  framework character varying DEFAULT 'smart'::character varying,
  target_value character varying,
  current_value character varying,
  unit character varying,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  status character varying DEFAULT 'active'::character varying,
  priority character varying DEFAULT 'medium'::character varying,
  impact_weight numeric DEFAULT 1.0,
  confidence_score integer CHECK (confidence_score >= 0 AND confidence_score <= 100),
  start_date date,
  due_date date,
  completion_date date,
  tags ARRAY,
  metadata jsonb DEFAULT '{}'::jsonb,
  department_id uuid,
  team_id uuid,
  visibility character varying DEFAULT 'public'::character varying,
  cascade_from_id uuid,
  alignment_score integer CHECK (alignment_score >= 0 AND alignment_score <= 100),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT align_objectives_pkey PRIMARY KEY (id),
  CONSTRAINT align_objectives_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT align_objectives_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.align_objectives(id),
  CONSTRAINT align_objectives_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id),
  CONSTRAINT align_objectives_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id),
  CONSTRAINT align_objectives_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id),
  CONSTRAINT align_objectives_cascade_from_id_fkey FOREIGN KEY (cascade_from_id) REFERENCES public.align_objectives(id)
);

CREATE TABLE public.align_key_results (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  objective_id uuid,
  title character varying NOT NULL,
  description text,
  target_value character varying,
  current_value character varying,
  unit character varying,
  progress_percentage integer DEFAULT 0,
  status character varying DEFAULT 'active'::character varying,
  due_date date,
  completion_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT align_key_results_pkey PRIMARY KEY (id),
  CONSTRAINT align_key_results_objective_id_fkey FOREIGN KEY (objective_id) REFERENCES public.align_objectives(id)
);

CREATE TABLE public.align_progress_updates (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  objective_id uuid,
  user_id uuid,
  value character varying,
  progress_percentage integer,
  comment text,
  confidence_score integer,
  blockers text,
  achievements text,
  next_steps text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT align_progress_updates_pkey PRIMARY KEY (id),
  CONSTRAINT align_progress_updates_objective_id_fkey FOREIGN KEY (objective_id) REFERENCES public.align_objectives(id),
  CONSTRAINT align_progress_updates_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- PULSE: KPI Design and Tracking
CREATE TABLE public.pulse_kpis (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid,
  name character varying NOT NULL,
  description text,
  category character varying,
  owner_id uuid,
  formula text,
  target_value character varying,
  current_value character varying,
  unit character varying,
  frequency character varying,
  data_source character varying,
  benchmark_value character varying,
  benchmark_source character varying,
  threshold_red character varying,
  threshold_yellow character varying,
  threshold_green character varying,
  trend_direction character varying,
  is_public boolean DEFAULT false,
  auto_update boolean DEFAULT false,
  api_endpoint character varying,
  status character varying DEFAULT 'active'::character varying,
  tags ARRAY,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pulse_kpis_pkey PRIMARY KEY (id),
  CONSTRAINT pulse_kpis_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT pulse_kpis_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id)
);

CREATE TABLE public.pulse_kpi_values (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  kpi_id uuid,
  value character varying NOT NULL,
  period_start date,
  period_end date,
  recorded_at timestamp with time zone DEFAULT now(),
  recorded_by uuid,
  notes text,
  confidence_score integer,
  metadata jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT pulse_kpi_values_pkey PRIMARY KEY (id),
  CONSTRAINT pulse_kpi_values_kpi_id_fkey FOREIGN KEY (kpi_id) REFERENCES public.pulse_kpis(id),
  CONSTRAINT pulse_kpi_values_recorded_by_fkey FOREIGN KEY (recorded_by) REFERENCES public.users(id)
);

CREATE TABLE public.pulse_anomalies (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  kpi_id uuid,
  severity character varying,
  type character varying,
  description text,
  detected_at timestamp with time zone DEFAULT now(),
  acknowledged_at timestamp with time zone,
  acknowledged_by uuid,
  resolved_at timestamp with time zone,
  metadata jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT pulse_anomalies_pkey PRIMARY KEY (id),
  CONSTRAINT pulse_anomalies_kpi_id_fkey FOREIGN KEY (kpi_id) REFERENCES public.pulse_kpis(id),
  CONSTRAINT pulse_anomalies_acknowledged_by_fkey FOREIGN KEY (acknowledged_by) REFERENCES public.users(id)
);

-- CATALYST: Change Management
CREATE TABLE public.catalyst_journeys (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid,
  name character varying NOT NULL,
  description text,
  type character varying,
  status character varying DEFAULT 'planning'::character varying,
  phase character varying,
  owner_id uuid,
  start_date date,
  target_completion_date date,
  actual_completion_date date,
  readiness_score integer CHECK (readiness_score >= 0 AND readiness_score <= 100),
  adoption_percentage integer DEFAULT 0,
  resistance_level character varying,
  budget_allocated numeric,
  budget_spent numeric,
  stakeholder_count integer DEFAULT 0,
  champion_count integer DEFAULT 0,
  risk_count integer DEFAULT 0,
  success_criteria text,
  tags ARRAY,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT catalyst_journeys_pkey PRIMARY KEY (id),
  CONSTRAINT catalyst_journeys_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT catalyst_journeys_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id)
);

CREATE TABLE public.catalyst_stakeholders (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  journey_id uuid,
  user_id uuid,
  influence_level character varying,
  engagement_level character varying,
  communication_preference character varying,
  training_completed boolean DEFAULT false,
  feedback_score integer CHECK (feedback_score >= 1 AND feedback_score <= 5),
  last_interaction timestamp with time zone,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT catalyst_stakeholders_pkey PRIMARY KEY (id),
  CONSTRAINT catalyst_stakeholders_journey_id_fkey FOREIGN KEY (journey_id) REFERENCES public.catalyst_journeys(id),
  CONSTRAINT catalyst_stakeholders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.catalyst_activities (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  journey_id uuid,
  title character varying NOT NULL,
  description text,
  type character varying,
  status character varying DEFAULT 'planned'::character varying,
  assigned_to uuid,
  due_date date,
  completion_date date,
  participants ARRAY,
  success_criteria text,
  results text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT catalyst_activities_pkey PRIMARY KEY (id),
  CONSTRAINT catalyst_activities_journey_id_fkey FOREIGN KEY (journey_id) REFERENCES public.catalyst_journeys(id),
  CONSTRAINT catalyst_activities_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id)
);

CREATE TABLE public.catalyst_surveys (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  journey_id uuid,
  title character varying NOT NULL,
  type character varying,
  questions jsonb NOT NULL,
  target_audience ARRAY,
  response_count integer DEFAULT 0,
  sent_at timestamp with time zone,
  closes_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT catalyst_surveys_pkey PRIMARY KEY (id),
  CONSTRAINT catalyst_surveys_journey_id_fkey FOREIGN KEY (journey_id) REFERENCES public.catalyst_journeys(id)
);

CREATE TABLE public.catalyst_survey_responses (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  survey_id uuid,
  user_id uuid,
  responses jsonb NOT NULL,
  sentiment_score numeric,
  completed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT catalyst_survey_responses_pkey PRIMARY KEY (id),
  CONSTRAINT catalyst_survey_responses_survey_id_fkey FOREIGN KEY (survey_id) REFERENCES public.catalyst_surveys(id),
  CONSTRAINT catalyst_survey_responses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- FLOW: Process Validation & Optimization
CREATE TABLE public.flow_documents (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid,
  name character varying NOT NULL,
  description text,
  category character varying,
  department character varying,
  owner_id uuid,
  file_url character varying,
  file_type character varying,
  file_size_bytes bigint,
  version character varying DEFAULT 'v1.0'::character varying,
  word_count integer,
  status character varying DEFAULT 'draft'::character varying,
  quality_score integer CHECK (quality_score >= 0 AND quality_score <= 100),
  compliance_status character varying,
  last_reviewed_at timestamp with time zone,
  last_reviewed_by uuid,
  next_review_date date,
  tags ARRAY,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT flow_documents_pkey PRIMARY KEY (id),
  CONSTRAINT flow_documents_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT flow_documents_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id),
  CONSTRAINT flow_documents_last_reviewed_by_fkey FOREIGN KEY (last_reviewed_by) REFERENCES public.users(id)
);

CREATE TABLE public.flow_issues (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  document_id uuid,
  type character varying,
  severity character varying,
  description text,
  recommendation text,
  location_reference text,
  status character varying DEFAULT 'open'::character varying,
  assigned_to uuid,
  created_at timestamp with time zone DEFAULT now(),
  resolved_at timestamp with time zone,
  CONSTRAINT flow_issues_pkey PRIMARY KEY (id),
  CONSTRAINT flow_issues_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.flow_documents(id),
  CONSTRAINT flow_issues_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id)
);

CREATE TABLE public.flow_compliance_frameworks (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid,
  name character varying NOT NULL,
  description text,
  version character varying,
  coverage_percentage integer DEFAULT 0,
  missing_requirements integer DEFAULT 0,
  status character varying DEFAULT 'active'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT flow_compliance_frameworks_pkey PRIMARY KEY (id),
  CONSTRAINT flow_compliance_frameworks_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);

CREATE TABLE public.flow_compliance_checks (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  document_id uuid,
  framework_id uuid,
  requirement_id character varying,
  requirement_name character varying,
  compliance_status character varying,
  gap_description text,
  recommendation text,
  priority character varying,
  checked_at timestamp with time zone DEFAULT now(),
  CONSTRAINT flow_compliance_checks_pkey PRIMARY KEY (id),
  CONSTRAINT flow_compliance_checks_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.flow_documents(id),
  CONSTRAINT flow_compliance_checks_framework_id_fkey FOREIGN KEY (framework_id) REFERENCES public.flow_compliance_frameworks(id)
);

-- FORESIGHT: Strategy Simulation & Impact Modeling
CREATE TABLE public.foresight_scenarios (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid,
  name character varying NOT NULL,
  description text,
  category character varying,
  owner_id uuid,
  status character varying DEFAULT 'draft'::character varying,
  confidence_score integer CHECK (confidence_score >= 0 AND confidence_score <= 100),
  timeline_months integer,
  investment_required numeric,
  expected_roi numeric,
  risk_level character varying,
  created_from_template boolean DEFAULT false,
  template_id uuid,
  tags ARRAY,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT foresight_scenarios_pkey PRIMARY KEY (id),
  CONSTRAINT foresight_scenarios_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT foresight_scenarios_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id)
);

CREATE TABLE public.foresight_business_levers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  scenario_id uuid,
  name character varying NOT NULL,
  current_value numeric,
  proposed_value numeric,
  min_value numeric,
  max_value numeric,
  unit character varying,
  impact_category character varying,
  lever_type character varying,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT foresight_business_levers_pkey PRIMARY KEY (id),
  CONSTRAINT foresight_business_levers_scenario_id_fkey FOREIGN KEY (scenario_id) REFERENCES public.foresight_scenarios(id)
);

CREATE TABLE public.foresight_outcomes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  scenario_id uuid,
  metric_name character varying NOT NULL,
  metric_category character varying,
  baseline_value numeric,
  projected_value numeric,
  variance_percentage numeric,
  confidence_score integer,
  timeline_months integer,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT foresight_outcomes_pkey PRIMARY KEY (id),
  CONSTRAINT foresight_outcomes_scenario_id_fkey FOREIGN KEY (scenario_id) REFERENCES public.foresight_scenarios(id)
);

CREATE TABLE public.foresight_risk_factors (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  scenario_id uuid,
  name character varying NOT NULL,
  probability integer CHECK (probability >= 0 AND probability <= 100),
  impact character varying,
  mitigation_strategy text,
  status character varying DEFAULT 'identified'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT foresight_risk_factors_pkey PRIMARY KEY (id),
  CONSTRAINT foresight_risk_factors_scenario_id_fkey FOREIGN KEY (scenario_id) REFERENCES public.foresight_scenarios(id)
);

-- Cross-App Features
CREATE TABLE public.cross_app_links (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid,
  source_app character varying NOT NULL,
  source_entity_type character varying NOT NULL,
  source_entity_id uuid NOT NULL,
  target_app character varying NOT NULL,
  target_entity_type character varying NOT NULL,
  target_entity_id uuid NOT NULL,
  link_type character varying,
  strength integer DEFAULT 1 CHECK (strength >= 1 AND strength <= 5),
  notes text,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cross_app_links_pkey PRIMARY KEY (id),
  CONSTRAINT cross_app_links_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT cross_app_links_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id)
);

CREATE TABLE public.value_impacts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid,
  source_app character varying NOT NULL,
  source_entity_id uuid NOT NULL,
  impact_category character varying,
  metric_name character varying,
  baseline_value numeric,
  current_value numeric,
  target_value numeric,
  unit character varying,
  measurement_period character varying,
  stakeholder_group character varying,
  verified boolean DEFAULT false,
  verification_source character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT value_impacts_pkey PRIMARY KEY (id),
  CONSTRAINT value_impacts_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);

-- AI Coach & Notifications
CREATE TABLE public.coach_interactions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid,
  user_id uuid,
  app character varying NOT NULL,
  context_entity_type character varying,
  context_entity_id uuid,
  query text,
  response text,
  interaction_type character varying,
  sentiment character varying,
  helpful_rating integer CHECK (helpful_rating >= 1 AND helpful_rating <= 5),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT coach_interactions_pkey PRIMARY KEY (id),
  CONSTRAINT coach_interactions_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT coach_interactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid,
  user_id uuid,
  app character varying NOT NULL,
  type character varying,
  title character varying NOT NULL,
  message text,
  entity_type character varying,
  entity_id uuid,
  priority character varying DEFAULT 'medium'::character varying,
  read_at timestamp with time zone,
  action_url character varying,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.activity_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid,
  user_id uuid,
  product character varying NOT NULL,
  action character varying NOT NULL,
  entity_type character varying,
  entity_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT activity_logs_pkey PRIMARY KEY (id),
  CONSTRAINT activity_logs_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Trust Layer
CREATE TABLE public.trust_layer_events (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid,
  event_type character varying NOT NULL,
  entity_type character varying,
  entity_id uuid,
  user_id uuid,
  before_state jsonb,
  after_state jsonb,
  change_hash character varying,
  is_verified boolean DEFAULT false,
  verified_by uuid,
  verified_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT trust_layer_events_pkey PRIMARY KEY (id),
  CONSTRAINT trust_layer_events_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT trust_layer_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT trust_layer_events_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.users(id)
);

-- Comments (Shared)
CREATE TABLE public.comments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  entity_type character varying NOT NULL,
  entity_id uuid NOT NULL,
  parent_comment_id uuid,
  content text NOT NULL,
  reactions jsonb DEFAULT '{}'::jsonb,
  is_edited boolean DEFAULT false,
  is_deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT comments_pkey PRIMARY KEY (id),
  CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.comments(id)
);

-- Indexes for performance
CREATE INDEX idx_users_organization_id ON public.users(organization_id);
CREATE INDEX idx_align_objectives_organization_id ON public.align_objectives(organization_id);
CREATE INDEX idx_align_objectives_owner_id ON public.align_objectives(owner_id);
CREATE INDEX idx_pulse_kpis_organization_id ON public.pulse_kpis(organization_id);
CREATE INDEX idx_catalyst_journeys_organization_id ON public.catalyst_journeys(organization_id);
CREATE INDEX idx_flow_documents_organization_id ON public.flow_documents(organization_id);
CREATE INDEX idx_foresight_scenarios_organization_id ON public.foresight_scenarios(organization_id);
CREATE INDEX idx_cross_app_links_source ON public.cross_app_links(source_app, source_entity_type, source_entity_id);
CREATE INDEX idx_cross_app_links_target ON public.cross_app_links(target_app, target_entity_type, target_entity_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_comments_entity ON public.comments(entity_type, entity_id);
CREATE INDEX idx_departments_organization_id ON public.departments(organization_id);
CREATE INDEX idx_teams_organization_id ON public.teams(organization_id);
CREATE INDEX idx_team_memberships_user_id ON public.team_memberships(user_id);
CREATE INDEX idx_team_memberships_team_id ON public.team_memberships(team_id);
CREATE INDEX idx_users_department_id ON public.users(department_id);
CREATE INDEX idx_users_primary_team_id ON public.users(primary_team_id);
CREATE INDEX idx_align_objectives_department_id ON public.align_objectives(department_id);
CREATE INDEX idx_align_objectives_team_id ON public.align_objectives(team_id);
CREATE INDEX idx_align_objectives_visibility ON public.align_objectives(visibility);
CREATE INDEX idx_align_objectives_level ON public.align_objectives(level);
CREATE INDEX idx_align_objectives_cascade_from_id ON public.align_objectives(cascade_from_id);
CREATE INDEX idx_departments_head_of_department_id ON public.departments(head_of_department_id);
CREATE INDEX idx_teams_team_lead_id ON public.teams(team_lead_id);
CREATE INDEX idx_team_memberships_active ON public.team_memberships(is_active);
CREATE INDEX idx_departments_parent_department_id ON public.departments(parent_department_id);
CREATE INDEX idx_teams_department_id ON public.teams(department_id);
CREATE UNIQUE INDEX departments_name_organization_unique ON public.departments(organization_id, name) WHERE status = 'active';
CREATE UNIQUE INDEX teams_name_department_unique ON public.teams(department_id, name) WHERE status = 'active';
CREATE UNIQUE INDEX team_memberships_unique_active ON public.team_memberships(team_id, user_id) WHERE is_active = true;

-- Triggers for automatic updates
CREATE OR REPLACE FUNCTION update_team_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE teams SET member_count = (SELECT COUNT(*) FROM team_memberships WHERE team_id = NEW.team_id AND is_active = true) WHERE id = NEW.team_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE teams SET member_count = (SELECT COUNT(*) FROM team_memberships WHERE team_id = OLD.team_id AND is_active = true) WHERE id = OLD.team_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_team_member_count
  AFTER INSERT OR UPDATE OR DELETE ON public.team_memberships
  FOR EACH ROW EXECUTE FUNCTION update_team_member_count();

CREATE OR REPLACE FUNCTION update_department_employee_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE departments SET employee_count = (SELECT COUNT(*) FROM users WHERE department_id = NEW.department_id) WHERE id = NEW.department_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE departments SET employee_count = (SELECT COUNT(*) FROM users WHERE department_id = OLD.department_id) WHERE id = OLD.department_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_department_employee_count
  AFTER INSERT OR UPDATE OF department_id OR DELETE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_department_employee_count();

CREATE OR REPLACE FUNCTION update_goals_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.department_id IS NOT NULL THEN
      UPDATE departments SET goals_count = (SELECT COUNT(*) FROM align_objectives WHERE department_id = NEW.department_id) WHERE id = NEW.department_id;
    END IF;
    IF NEW.team_id IS NOT NULL THEN
      UPDATE teams SET goals_count = (SELECT COUNT(*) FROM align_objectives WHERE team_id = NEW.team_id) WHERE id = NEW.team_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.department_id IS NOT NULL THEN
      UPDATE departments SET goals_count = (SELECT COUNT(*) FROM align_objectives WHERE department_id = OLD.department_id) WHERE id = OLD.department_id;
    END IF;
    IF OLD.team_id IS NOT NULL THEN
      UPDATE teams SET goals_count = (SELECT COUNT(*) FROM align_objectives WHERE team_id = OLD.team_id) WHERE id = OLD.team_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_goals_count
  AFTER INSERT OR UPDATE OF department_id, team_id OR DELETE ON public.align_objectives
  FOR EACH ROW EXECUTE FUNCTION update_goals_count();

-- Helper functions
CREATE OR REPLACE FUNCTION auth.get_user_department()
RETURNS UUID AS $$
BEGIN
    RETURN (SELECT department_id FROM users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth.get_user_primary_team()
RETURNS UUID AS $$
BEGIN
    RETURN (SELECT primary_team_id FROM users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth.is_department_head(dept_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT EXISTS(SELECT 1 FROM departments WHERE head_of_department_id = auth.uid() AND (dept_id IS NULL OR id = dept_id)));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth.is_team_lead(team_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT EXISTS(SELECT 1 FROM teams WHERE team_lead_id = auth.uid() AND (team_id IS NULL OR id = team_id)));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth.get_user_teams()
RETURNS TABLE(team_id UUID) AS $$
BEGIN
    RETURN QUERY SELECT tm.team_id FROM team_memberships tm WHERE tm.user_id = auth.uid() AND tm.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sample data function
CREATE OR REPLACE FUNCTION create_sample_org_structure(org_id UUID)
RETURNS VOID AS $$
DECLARE
    eng_dept_id UUID;
    sales_dept_id UUID;
    marketing_dept_id UUID;
    frontend_team_id UUID;
    backend_team_id UUID;
    growth_team_id UUID;
BEGIN
    INSERT INTO departments (id, organization_id, name, description, code) VALUES (uuid_generate_v4(), org_id, 'Engineering', 'Product development and technical operations', 'ENG'), (uuid_generate_v4(), org_id, 'Sales', 'Revenue generation and customer acquisition', 'SALES'), (uuid_generate_v4(), org_id, 'Marketing', 'Brand awareness and lead generation', 'MKT') RETURNING id INTO eng_dept_id;
    SELECT id INTO eng_dept_id FROM departments WHERE organization_id = org_id AND code = 'ENG';
    SELECT id INTO sales_dept_id FROM departments WHERE organization_id = org_id AND code = 'SALES';
    SELECT id INTO marketing_dept_id FROM departments WHERE organization_id = org_id AND code = 'MKT';
    INSERT INTO teams (id, organization_id, department_id, name, description, team_type) VALUES (uuid_generate_v4(), org_id, eng_dept_id, 'Frontend Team', 'User interface and experience development', 'functional'), (uuid_generate_v4(), org_id, eng_dept_id, 'Backend Team', 'Server-side development and infrastructure', 'functional'), (uuid_generate_v4(), org_id, marketing_dept_id, 'Growth Team', 'User acquisition and retention strategies', 'cross-functional');
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE public.departments IS 'Organizational departments with hierarchy support';
COMMENT ON TABLE public.teams IS 'Teams within departments for goal organization';
COMMENT ON TABLE public.team_memberships IS 'Many-to-many relationship between users and teams';
COMMENT ON COLUMN public.align_objectives.cascade_from_id IS 'Links to parent objective for OKR cascading (different from parent_id which is for grouping)';
COMMENT ON COLUMN public.align_objectives.visibility IS 'Controls who can see this objective: public, department, team, or private';
COMMENT ON COLUMN public.align_objectives.alignment_score IS 'Calculated score showing how well this objective aligns with higher-level objectives';
```

## Enhanced Schema (`enhanced_schema.sql`)

```sql
-- Enhanced Aesyros Suite Schema with Proper Organizational Hierarchy
-- This file contains the enhanced schema structure for proper org hierarchy

-- =============================================================================
-- ORGANIZATIONAL HIERARCHY ENHANCEMENTS
-- =============================================================================

-- 1. ENHANCE ORGANIZATIONS TABLE
-- Add vision, mission, and core values support
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS vision_statement text,
ADD COLUMN IF NOT EXISTS mission_statement text,
ADD COLUMN IF NOT EXISTS core_values jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS vision_last_updated timestamp with time zone,
ADD COLUMN IF NOT EXISTS mission_last_updated timestamp with time zone,
ADD COLUMN IF NOT EXISTS vision_updated_by uuid,
ADD COLUMN IF NOT EXISTS mission_updated_by uuid;

-- Add foreign key constraints for vision/mission updaters
ALTER TABLE public.organizations 
ADD CONSTRAINT IF NOT EXISTS organizations_vision_updated_by_fkey 
  FOREIGN KEY (vision_updated_by) REFERENCES public.users(id),
ADD CONSTRAINT IF NOT EXISTS organizations_mission_updated_by_fkey 
  FOREIGN KEY (mission_updated_by) REFERENCES public.users(id);

-- 2. CREATE DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.departments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL,
  name character varying NOT NULL,
  description text,
  code character varying, -- Optional department code/abbreviation
  head_of_department_id uuid,
  parent_department_id uuid, -- For sub-departments
  budget_allocated numeric,
  employee_count integer DEFAULT 0,
  status character varying DEFAULT 'active'::character varying,
  goals_count integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT departments_pkey PRIMARY KEY (id),
  CONSTRAINT departments_organization_id_fkey FOREIGN KEY (organization_id) 
    REFERENCES public.organizations(id) ON DELETE CASCADE,
  CONSTRAINT departments_head_of_department_id_fkey FOREIGN KEY (head_of_department_id) 
    REFERENCES public.users(id) ON DELETE SET NULL,
  CONSTRAINT departments_parent_department_id_fkey FOREIGN KEY (parent_department_id) 
    REFERENCES public.departments(id) ON DELETE SET NULL
);

-- Create unique constraint for department name per organization
CREATE UNIQUE INDEX IF NOT EXISTS departments_name_organization_unique 
ON public.departments(organization_id, name) WHERE status = 'active';

-- 3. CREATE TEAMS TABLE
CREATE TABLE IF NOT EXISTS public.teams (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL,
  department_id uuid NOT NULL,
  name character varying NOT NULL,
  description text,
  code character varying, -- Optional team code/abbreviation
  team_lead_id uuid,
  team_type character varying DEFAULT 'functional'::character varying, -- functional, cross-functional, project, etc.
  member_count integer DEFAULT 0,
  status character varying DEFAULT 'active'::character varying,
  goals_count integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT teams_pkey PRIMARY KEY (id),
  CONSTRAINT teams_organization_id_fkey FOREIGN KEY (organization_id) 
    REFERENCES public.organizations(id) ON DELETE CASCADE,
  CONSTRAINT teams_department_id_fkey FOREIGN KEY (department_id) 
    REFERENCES public.departments(id) ON DELETE CASCADE,
  CONSTRAINT teams_team_lead_id_fkey FOREIGN KEY (team_lead_id) 
    REFERENCES public.users(id) ON DELETE SET NULL
);

-- Create unique constraint for team name per department
CREATE UNIQUE INDEX IF NOT EXISTS teams_name_department_unique 
ON public.teams(department_id, name) WHERE status = 'active';

-- 4. CREATE TEAM MEMBERSHIPS TABLE (Many-to-Many relationship)
CREATE TABLE IF NOT EXISTS public.team_memberships (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  team_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role character varying DEFAULT 'member'::character varying, -- member, lead, coordinator, etc.
  joined_at timestamp with time zone DEFAULT now(),
  left_at timestamp with time zone,
  is_active boolean DEFAULT true,
  CONSTRAINT team_memberships_pkey PRIMARY KEY (id),
  CONSTRAINT team_memberships_team_id_fkey FOREIGN KEY (team_id) 
    REFERENCES public.teams(id) ON DELETE CASCADE,
  CONSTRAINT team_memberships_user_id_fkey FOREIGN KEY (user_id) 
    REFERENCES public.users(id) ON DELETE CASCADE
);

-- Create unique constraint for active team memberships
CREATE UNIQUE INDEX IF NOT EXISTS team_memberships_unique_active 
ON public.team_memberships(team_id, user_id) WHERE is_active = true;

-- 5. ENHANCE USERS TABLE
-- Add proper foreign key references to departments and teams
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS department_id uuid,
ADD COLUMN IF NOT EXISTS primary_team_id uuid;

-- Add foreign key constraints
ALTER TABLE public.users 
ADD CONSTRAINT IF NOT EXISTS users_department_id_fkey 
  FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL,
ADD CONSTRAINT IF NOT EXISTS users_primary_team_id_fkey 
  FOREIGN KEY (primary_team_id) REFERENCES public.teams(id) ON DELETE SET NULL;

-- 6. ENHANCE ALIGN_OBJECTIVES TABLE
-- Add explicit references to organizational entities
ALTER TABLE public.align_objectives
ADD COLUMN IF NOT EXISTS department_id uuid,
ADD COLUMN IF NOT EXISTS team_id uuid,
ADD COLUMN IF NOT EXISTS visibility character varying DEFAULT 'organization'::character varying, -- public, department, team, private
ADD COLUMN IF NOT EXISTS cascade_from_id uuid, -- Different from parent_id - this is for OKR cascading
ADD COLUMN IF NOT EXISTS alignment_score integer CHECK (alignment_score >= 0 AND alignment_score <= 100);

-- Add foreign key constraints
ALTER TABLE public.align_objectives
ADD CONSTRAINT IF NOT EXISTS align_objectives_department_id_fkey 
  FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL,
ADD CONSTRAINT IF NOT EXISTS align_objectives_team_id_fkey 
  FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE SET NULL,
ADD CONSTRAINT IF NOT EXISTS align_objectives_cascade_from_id_fkey 
  FOREIGN KEY (cascade_from_id) REFERENCES public.align_objectives(id) ON DELETE SET NULL;

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Departments indexes
CREATE INDEX IF NOT EXISTS idx_departments_organization_id ON public.departments(organization_id);
CREATE INDEX IF NOT EXISTS idx_departments_head_of_department_id ON public.departments(head_of_department_id);
CREATE INDEX IF NOT EXISTS idx_departments_parent_department_id ON public.departments(parent_department_id);

-- Teams indexes
CREATE INDEX IF NOT EXISTS idx_teams_organization_id ON public.teams(organization_id);
CREATE INDEX IF NOT EXISTS idx_teams_department_id ON public.teams(department_id);
CREATE INDEX IF NOT EXISTS idx_teams_team_lead_id ON public.teams(team_lead_id);

-- Team memberships indexes
CREATE INDEX IF NOT EXISTS idx_team_memberships_team_id ON public.team_memberships(team_id);
CREATE INDEX IF NOT EXISTS idx_team_memberships_user_id ON public.team_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_team_memberships_active ON public.team_memberships(is_active);

-- Enhanced align_objectives indexes
CREATE INDEX IF NOT EXISTS idx_align_objectives_department_id ON public.align_objectives(department_id);
CREATE INDEX IF NOT EXISTS idx_align_objectives_team_id ON public.align_objectives(team_id);
CREATE INDEX IF NOT EXISTS idx_align_objectives_cascade_from_id ON public.align_objectives(cascade_from_id);
CREATE INDEX IF NOT EXISTS idx_align_objectives_level ON public.align_objectives(level);
CREATE INDEX IF NOT EXISTS idx_align_objectives_visibility ON public.align_objectives(visibility);

-- Users enhanced indexes
CREATE INDEX IF NOT EXISTS idx_users_department_id ON public.users(department_id);
CREATE INDEX IF NOT EXISTS idx_users_primary_team_id ON public.users(primary_team_id);

-- =============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================================================

-- Function to update team member counts
CREATE OR REPLACE FUNCTION update_team_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Update the team's member count
    UPDATE teams 
    SET member_count = (
      SELECT COUNT(*) 
      FROM team_memberships 
      WHERE team_id = NEW.team_id AND is_active = true
    )
    WHERE id = NEW.team_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Update the team's member count
    UPDATE teams 
    SET member_count = (
      SELECT COUNT(*) 
      FROM team_memberships 
      WHERE team_id = OLD.team_id AND is_active = true
    )
    WHERE id = OLD.team_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for team member count updates
DROP TRIGGER IF EXISTS trigger_update_team_member_count ON public.team_memberships;
CREATE TRIGGER trigger_update_team_member_count
  AFTER INSERT OR UPDATE OR DELETE ON public.team_memberships
  FOR EACH ROW EXECUTE FUNCTION update_team_member_count();

-- Function to update department employee counts
CREATE OR REPLACE FUNCTION update_department_employee_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Update the department's employee count
    UPDATE departments 
    SET employee_count = (
      SELECT COUNT(*) 
      FROM users 
      WHERE department_id = NEW.department_id
    )
    WHERE id = NEW.department_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Update the department's employee count
    UPDATE departments 
    SET employee_count = (
      SELECT COUNT(*) 
      FROM users 
      WHERE department_id = OLD.department_id
    )
    WHERE id = OLD.department_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for department employee count updates
DROP TRIGGER IF EXISTS trigger_update_department_employee_count ON public.users;
CREATE TRIGGER trigger_update_department_employee_count
  AFTER INSERT OR UPDATE OF department_id OR DELETE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_department_employee_count();

-- Function to update goals counts
CREATE OR REPLACE FUNCTION update_goals_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Update department goals count
    IF NEW.department_id IS NOT NULL THEN
      UPDATE departments 
      SET goals_count = (
        SELECT COUNT(*) 
        FROM align_objectives 
        WHERE department_id = NEW.department_id
      )
      WHERE id = NEW.department_id;
    END IF;
    
    -- Update team goals count
    IF NEW.team_id IS NOT NULL THEN
      UPDATE teams 
      SET goals_count = (
        SELECT COUNT(*) 
        FROM align_objectives 
        WHERE team_id = NEW.team_id
      )
      WHERE id = NEW.team_id;
    END IF;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Update department goals count
    IF OLD.department_id IS NOT NULL THEN
      UPDATE departments 
      SET goals_count = (
        SELECT COUNT(*) 
        FROM align_objectives 
        WHERE department_id = OLD.department_id
      )
      WHERE id = OLD.department_id;
    END IF;
    
    -- Update team goals count
    IF OLD.team_id IS NOT NULL THEN
      UPDATE teams 
      SET goals_count = (
        SELECT COUNT(*) 
        FROM align_objectives 
        WHERE team_id = OLD.team_id
      )
      WHERE id = OLD.team_id;
    END IF;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for goals count updates
DROP TRIGGER IF EXISTS trigger_update_goals_count ON public.align_objectives;
CREATE TRIGGER trigger_update_goals_count
  AFTER INSERT OR UPDATE OF department_id, team_id OR DELETE ON public.align_objectives
  FOR EACH ROW EXECUTE FUNCTION update_goals_count();

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Function to get user's department
CREATE OR REPLACE FUNCTION auth.get_user_department()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT department_id 
        FROM users 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's primary team
CREATE OR REPLACE FUNCTION auth.get_user_primary_team()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT primary_team_id 
        FROM users 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is department head
CREATE OR REPLACE FUNCTION auth.is_department_head(dept_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT EXISTS(
            SELECT 1 
            FROM departments 
            WHERE head_of_department_id = auth.uid()
            AND (dept_id IS NULL OR id = dept_id)
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is team lead
CREATE OR REPLACE FUNCTION auth.is_team_lead(team_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT EXISTS(
            SELECT 1 
            FROM teams 
            WHERE team_lead_id = auth.uid()
            AND (team_id IS NULL OR id = team_id)
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all teams user belongs to
CREATE OR REPLACE FUNCTION auth.get_user_teams()
RETURNS TABLE(team_id UUID) AS $$
BEGIN
    RETURN QUERY
    SELECT tm.team_id
    FROM team_memberships tm
    WHERE tm.user_id = auth.uid() AND tm.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- SAMPLE DATA FUNCTIONS (for development/testing)
-- =============================================================================

-- Function to create sample organizational structure
CREATE OR REPLACE FUNCTION create_sample_org_structure(org_id UUID)
RETURNS VOID AS $$
DECLARE
    eng_dept_id UUID;
    sales_dept_id UUID;
    marketing_dept_id UUID;
    frontend_team_id UUID;
    backend_team_id UUID;
    growth_team_id UUID;
BEGIN
    -- Create departments
    INSERT INTO departments (id, organization_id, name, description, code)
    VALUES 
        (uuid_generate_v4(), org_id, 'Engineering', 'Product development and technical operations', 'ENG'),
        (uuid_generate_v4(), org_id, 'Sales', 'Revenue generation and customer acquisition', 'SALES'),
        (uuid_generate_v4(), org_id, 'Marketing', 'Brand awareness and lead generation', 'MKT')
    RETURNING id INTO eng_dept_id;
    
    -- Get department IDs for team creation
    SELECT id INTO eng_dept_id FROM departments WHERE organization_id = org_id AND code = 'ENG';
    SELECT id INTO sales_dept_id FROM departments WHERE organization_id = org_id AND code = 'SALES';
    SELECT id INTO marketing_dept_id FROM departments WHERE organization_id = org_id AND code = 'MKT';
    
    -- Create teams
    INSERT INTO teams (id, organization_id, department_id, name, description, team_type)
    VALUES 
        (uuid_generate_v4(), org_id, eng_dept_id, 'Frontend Team', 'User interface and experience development', 'functional'),
        (uuid_generate_v4(), org_id, eng_dept_id, 'Backend Team', 'Server-side development and infrastructure', 'functional'),
        (uuid_generate_v4(), org_id, marketing_dept_id, 'Growth Team', 'User acquisition and retention strategies', 'cross-functional');
        
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE public.departments IS 'Organizational departments with hierarchy support';
COMMENT ON TABLE public.teams IS 'Teams within departments for goal organization';
COMMENT ON TABLE public.team_memberships IS 'Many-to-many relationship between users and teams';
COMMENT ON COLUMN public.align_objectives.cascade_from_id IS 'Links to parent objective for OKR cascading (different from parent_id which is for grouping)';
COMMENT ON COLUMN public.align_objectives.visibility IS 'Controls who can see this objective: public, department, team, or private';
COMMENT ON COLUMN public.align_objectives.alignment_score IS 'Calculated score showing how well this objective aligns with higher-level objectives';
```
