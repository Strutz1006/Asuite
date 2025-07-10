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
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT organizations_pkey PRIMARY KEY (id)
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
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
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
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT align_objectives_pkey PRIMARY KEY (id),
  CONSTRAINT align_objectives_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT align_objectives_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.align_objectives(id),
  CONSTRAINT align_objectives_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id)
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