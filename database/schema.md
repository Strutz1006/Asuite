// Organizations and Users
Table organizations {
  id uuid [pk, default: `uuid_generate_v4()`]
  name varchar [not null]
  slug varchar [not null, unique]
  industry varchar
  size_category varchar
  website varchar
  logo_url varchar
  timezone varchar [default: 'UTC']
  settings jsonb [default: '{}']
  active_products text[] [default: '{}']
  subscription_tier varchar [default: 'free']
  ai_coach_enabled boolean [default: false]
  trust_layer_enabled boolean [default: false]
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]
  vision_statement text
  mission_statement text
  core_values jsonb [default: '[]']
  vision_last_updated timestamptz
  mission_last_updated timestamptz
}

Table departments {
  id uuid [pk, default: `uuid_generate_v4()`]
  organization_id uuid [not null, ref: > organizations.id]
  name varchar [not null]
  description text
  head_of_department_id uuid [ref: > users.id]
  parent_department_id uuid [ref: > departments.id]
  created_at timestamptz [default: `now()`]
}

Table teams {
  id uuid [pk, default: `uuid_generate_v4()`]
  organization_id uuid [not null, ref: > organizations.id]
  department_id uuid [not null, ref: > departments.id]
  name varchar [not null]
  description text
  team_lead_id uuid [ref: > users.id]
  created_at timestamptz [default: `now()`]
}

Table users {
  id uuid [pk, default: `uuid_generate_v4()`]
  email varchar [not null, unique]
  full_name varchar
  avatar_url varchar
  organization_id uuid [ref: > organizations.id]
  role varchar [default: 'contributor']
  department varchar
  job_title varchar
  permissions jsonb [default: '{}']
  preferences jsonb [default: '{}']
  last_active_at timestamptz
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]
  department_id uuid [ref: > departments.id]
  team_id uuid [ref: > teams.id]
}

// Activity Logging
Table activity_logs {
  id uuid [pk, default: `uuid_generate_v4()`]
  organization_id uuid [ref: > organizations.id]
  user_id uuid [ref: > users.id]
  product varchar [not null]
  action varchar [not null]
  entity_type varchar
  entity_id uuid
  details jsonb [default: '{}']
  ip_address inet
  user_agent text
  created_at timestamptz [default: `now()`]
}

// Notifications
Table notifications {
  id uuid [pk, default: `uuid_generate_v4()`]
  organization_id uuid [ref: > organizations.id]
  user_id uuid [ref: > users.id]
  app varchar [not null]
  type varchar
  title varchar [not null]
  message text
  entity_type varchar
  entity_id uuid
  priority varchar [default: 'medium']
  read_at timestamptz
  action_url varchar
  metadata jsonb [default: '{}']
  created_at timestamptz [default: `now()`]
}

// Cross-App Links
Table cross_app_links {
  id uuid [pk, default: `uuid_generate_v4()`]
  organization_id uuid [ref: > organizations.id]
  source_app varchar [not null]
  source_entity_type varchar [not null]
  source_entity_id uuid [not null]
  target_app varchar [not null]
  target_entity_type varchar [not null]
  target_entity_id uuid [not null]
  link_type varchar
  strength integer [default: 1, note: 'CHECK (strength >= 1 AND strength <= 5)']
  notes text
  created_by uuid [ref: > users.id]
  created_at timestamptz [default: `now()`]
}

// Value Impacts
Table value_impacts {
  id uuid [pk, default: `uuid_generate_v4()`]
  organization_id uuid [ref: > organizations.id]
  source_app varchar [not null]
  source_entity_id uuid [not null]
  impact_category varchar
  metric_name varchar
  baseline_value numeric
  current_value numeric
  target_value numeric
  unit varchar
  measurement_period varchar
  stakeholder_group varchar
  verified boolean [default: false]
  verification_source varchar
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]
}

// Coach Interactions
Table coach_interactions {
  id uuid [pk, default: `uuid_generate_v4()`]
  organization_id uuid [ref: > organizations.id]
  user_id uuid [ref: > users.id]
  app varchar [not null]
  context_entity_type varchar
  context_entity_id uuid
  query text
  response text
  interaction_type varchar
  sentiment varchar
  helpful_rating integer [note: 'CHECK (helpful_rating >= 1 AND helpful_rating <= 5)']
  created_at timestamptz [default: `now()`]
}

// Align App Tables
Table align_objectives {
  id uuid [pk, default: `uuid_generate_v4()`]
  organization_id uuid [ref: > organizations.id]
  title varchar [not null]
  description text
  level varchar [not null]
  parent_id uuid [ref: > align_objectives.id]
  owner_id uuid [ref: > users.id]
  category varchar
  framework varchar [default: 'smart']
  target_value varchar
  current_value varchar
  unit varchar
  progress_percentage integer [default: 0, note: 'CHECK (progress_percentage >= 0 AND progress_percentage <= 100)']
  status varchar [default: 'active']
  priority varchar [default: 'medium']
  impact_weight numeric [default: 1.0]
  confidence_score integer [note: 'CHECK (confidence_score >= 0 AND confidence_score <= 100)']
  start_date date
  due_date date
  completion_date date
  tags text[]
  metadata jsonb [default: '{}']
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]
  department_id uuid [ref: > departments.id]
  team_id uuid [ref: > teams.id]
}

Table align_key_results {
  id uuid [pk, default: `uuid_generate_v4()`]
  objective_id uuid [ref: > align_objectives.id]
  title varchar [not null]
  description text
  target_value varchar
  current_value varchar
  unit varchar
  progress_percentage integer [default: 0]
  status varchar [default: 'active']
  due_date date
  completion_date date
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]
}

Table align_progress_updates {
  id uuid [pk, default: `uuid_generate_v4()`]
  objective_id uuid [ref: > align_objectives.id]
  user_id uuid [ref: > users.id]
  value varchar
  progress_percentage integer
  comment text
  confidence_score integer
  blockers text
  achievements text
  next_steps text
  created_at timestamptz [default: `now()`]
}

// Pulse App Tables
Table pulse_kpis {
  id uuid [pk, default: `uuid_generate_v4()`]
  organization_id uuid [ref: > organizations.id]
  name varchar [not null]
  description text
  category varchar
  owner_id uuid [ref: > users.id]
  formula text
  target_value varchar
  current_value varchar
  unit varchar
  frequency varchar
  data_source varchar
  benchmark_value varchar
  benchmark_source varchar
  threshold_red varchar
  threshold_yellow varchar
  threshold_green varchar
  trend_direction varchar
  is_public boolean [default: false]
  auto_update boolean [default: false]
  api_endpoint varchar
  status varchar [default: 'active']
  tags text[]
  metadata jsonb [default: '{}']
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]
}

Table pulse_kpi_values {
  id uuid [pk, default: `uuid_generate_v4()`]
  kpi_id uuid [ref: > pulse_kpis.id]
  value varchar [not null]
  period_start date
  period_end date
  recorded_at timestamptz [default: `now()`]
  recorded_by uuid [ref: > users.id]
  notes text
  confidence_score integer
  metadata jsonb [default: '{}']
}

Table pulse_anomalies {
  id uuid [pk, default: `uuid_generate_v4()`]
  kpi_id uuid [ref: > pulse_kpis.id]
  severity varchar
  type varchar
  description text
  detected_at timestamptz [default: `now()`]
  acknowledged_at timestamptz
  acknowledged_by uuid [ref: > users.id]
  resolved_at timestamptz
  metadata jsonb [default: '{}']
}

// Flow App Tables
Table flow_documents {
  id uuid [pk, default: `uuid_generate_v4()`]
  organization_id uuid [ref: > organizations.id]
  name varchar [not null]
  description text
  category varchar
  department varchar
  owner_id uuid [ref: > users.id]
  file_url varchar
  file_type varchar
  file_size_bytes bigint
  version varchar [default: 'v1.0']
  word_count integer
  status varchar [default: 'draft']
  quality_score integer [note: 'CHECK (quality_score >= 0 AND quality_score <= 100)']
  compliance_status varchar
  last_reviewed_at timestamptz
  last_reviewed_by uuid [ref: > users.id]
  next_review_date date
  tags text[]
  metadata jsonb [default: '{}']
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]
}

Table flow_issues {
  id uuid [pk, default: `uuid_generate_v4()`]
  document_id uuid [ref: > flow_documents.id]
  type varchar
  severity varchar
  description text
  recommendation text
  location_reference text
  status varchar [default: 'open']
  assigned_to uuid [ref: > users.id]
  created_at timestamptz [default: `now()`]
  resolved_at timestamptz
}

Table flow_compliance_frameworks {
  id uuid [pk, default: `uuid_generate_v4()`]
  organization_id uuid [ref: > organizations.id]
  name varchar [not null]
  description text
  version varchar
  coverage_percentage integer [default: 0]
  missing_requirements integer [default: 0]
  status varchar [default: 'active']
  created_at timestamptz [default: `now()`]
}

Table flow_compliance_checks {
  id uuid [pk, default: `uuid_generate_v4()`]
  document_id uuid [ref: > flow_documents.id]
  framework_id uuid [ref: > flow_compliance_frameworks.id]
  requirement_id varchar
  requirement_name varchar
  compliance_status varchar
  gap_description text
  recommendation text
  priority varchar
  checked_at timestamptz [default: `now()`]
}

// Catalyst App Tables
Table catalyst_journeys {
  id uuid [pk, default: `uuid_generate_v4()`]
  organization_id uuid [ref: > organizations.id]
  name varchar [not null]
  description text
  type varchar
  status varchar [default: 'planning']
  phase varchar
  owner_id uuid [ref: > users.id]
  start_date date
  target_completion_date date
  actual_completion_date date
  readiness_score integer [note: 'CHECK (readiness_score >= 0 AND readiness_score <= 100)']
  adoption_percentage integer [default: 0]
  resistance_level varchar
  budget_allocated numeric
  budget_spent numeric
  stakeholder_count integer [default: 0]
  champion_count integer [default: 0]
  risk_count integer [default: 0]
  success_criteria text
  tags text[]
  metadata jsonb [default: '{}']
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]
}

Table catalyst_activities {
  id uuid [pk, default: `uuid_generate_v4()`]
  journey_id uuid [ref: > catalyst_journeys.id]
  title varchar [not null]
  description text
  type varchar
  status varchar [default: 'planned']
  assigned_to uuid [ref: > users.id]
  due_date date
  completion_date date
  participants text[]
  success_criteria text
  results text
  created_at timestamptz [default: `now()`]
}

Table catalyst_stakeholders {
  id uuid [pk, default: `uuid_generate_v4()`]
  journey_id uuid [ref: > catalyst_journeys.id]
  user_id uuid [ref: > users.id]
  influence_level varchar
  engagement_level varchar
  communication_preference varchar
  training_completed boolean [default: false]
  feedback_score integer [note: 'CHECK (feedback_score >= 1 AND feedback_score <= 5)']
  last_interaction timestamptz
  notes text
  created_at timestamptz [default: `now()`]
}

Table catalyst_surveys {
  id uuid [pk, default: `uuid_generate_v4()`]
  journey_id uuid [ref: > catalyst_journeys.id]
  title varchar [not null]
  type varchar
  questions jsonb [not null]
  target_audience text[]
  response_count integer [default: 0]
  sent_at timestamptz
  closes_at timestamptz
  created_at timestamptz [default: `now()`]
}

Table catalyst_survey_responses {
  id uuid [pk, default: `uuid_generate_v4()`]
  survey_id uuid [ref: > catalyst_surveys.id]
  user_id uuid [ref: > users.id]
  responses jsonb [not null]
  sentiment_score numeric
  completed_at timestamptz [default: `now()`]
}

// Foresight App Tables
Table foresight_scenarios {
  id uuid [pk, default: `uuid_generate_v4()`]
  organization_id uuid [ref: > organizations.id]
  name varchar [not null]
  description text
  category varchar
  owner_id uuid [ref: > users.id]
  status varchar [default: 'draft']
  confidence_score integer [note: 'CHECK (confidence_score >= 0 AND confidence_score <= 100)']
  timeline_months integer
  investment_required numeric
  expected_roi numeric
  risk_level varchar
  created_from_template boolean [default: false]
  template_id uuid
  tags text[]
  metadata jsonb [default: '{}']
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]
}

Table foresight_business_levers {
  id uuid [pk, default: `uuid_generate_v4()`]
  scenario_id uuid [ref: > foresight_scenarios.id]
  name varchar [not null]
  current_value numeric
  proposed_value numeric
  min_value numeric
  max_value numeric
  unit varchar
  impact_category varchar
  lever_type varchar
  created_at timestamptz [default: `now()`]
}

Table foresight_outcomes {
  id uuid [pk, default: `uuid_generate_v4()`]
  scenario_id uuid [ref: > foresight_scenarios.id]
  metric_name varchar [not null]
  metric_category varchar
  baseline_value numeric
  projected_value numeric
  variance_percentage numeric
  confidence_score integer
  timeline_months integer
  created_at timestamptz [default: `now()`]
}

Table foresight_risk_factors {
  id uuid [pk, default: `uuid_generate_v4()`]
  scenario_id uuid [ref: > foresight_scenarios.id]
  name varchar [not null]
  probability integer [note: 'CHECK (probability >= 0 AND probability <= 100)']
  impact varchar
  mitigation_strategy text
  status varchar [default: 'identified']
  created_at timestamptz [default: `now()`]
}

// Drive App Tables
Table drive_projects {
  id uuid [pk, default: `uuid_generate_v4()`]
  organization_id uuid [ref: > organizations.id]
  name varchar [not null]
  description text
  status varchar [default: 'planning']
  health varchar [default: 'good']
  priority varchar [default: 'medium']
  owner_id uuid [ref: > users.id]
  align_goal_id uuid [ref: > align_objectives.id]
  department_id uuid [ref: > departments.id]
  team_id uuid [ref: > teams.id]
  start_date date
  due_date date
  completion_date date
  budget_allocated numeric
  budget_spent numeric
  progress_percentage integer [default: 0]
  risk_level varchar [default: 'low']
  tags text[]
  metadata jsonb [default: '{}']
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]
}

Table drive_tasks {
  id uuid [pk, default: `uuid_generate_v4()`]
  organization_id uuid [ref: > organizations.id]
  project_id uuid [ref: > drive_projects.id]
  title varchar [not null]
  description text
  status varchar [default: 'todo']
  priority varchar [default: 'medium']
  assignee_id uuid [ref: > users.id]
  align_goal_id uuid [ref: > align_objectives.id]
  due_date date
  completion_date date
  estimated_hours numeric
  actual_hours numeric [default: 0]
  progress_percentage integer [default: 0]
  tags text[]
  dependencies uuid[] [default: '{}']
  metadata jsonb [default: '{}']
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]
}

Table drive_comments {
  id uuid [pk, default: `uuid_generate_v4()`]
  organization_id uuid [ref: > organizations.id]
  entity_type varchar [not null]
  entity_id uuid [not null]
  user_id uuid [ref: > users.id]
  content text [not null]
  parent_comment_id uuid [ref: > drive_comments.id]
  created_at timestamptz [default: `now()`]
}

Table drive_attachments {
  id uuid [pk, default: `uuid_generate_v4()`]
  organization_id uuid [ref: > organizations.id]
  entity_type varchar [not null]
  entity_id uuid [not null]
  file_name varchar [not null]
  file_url varchar [not null]
  file_type varchar
  file_size_bytes bigint
  uploaded_by uuid [ref: > users.id]
  created_at timestamptz [default: `now()`]
}

Table drive_time_entries {
  id uuid [pk, default: `uuid_generate_v4()`]
  organization_id uuid [ref: > organizations.id]
  task_id uuid [ref: > drive_tasks.id]
  user_id uuid [ref: > users.id]
  start_time timestamptz [not null]
  end_time timestamptz
  duration_minutes integer
  description text
  billable boolean [default: false]
  created_at timestamptz [default: `now()`]
}

// Additional tables for enhanced features

// Align - Company Setup and Goals
Table align_company_setup {
  id uuid [pk, default: `uuid_generate_v4()`]
  organization_id uuid [ref: > organizations.id]
  setup_completed boolean [default: false]
  goal_framework varchar [default: 'okr']
  planning_cycle varchar [default: 'quarterly']
  review_frequency varchar [default: 'monthly']
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]
}

// Pulse - Dashboards
Table pulse_dashboards {
  id uuid [pk, default: `uuid_generate_v4()`]
  organization_id uuid [ref: > organizations.id]
  name varchar [not null]
  description text
  owner_id uuid [ref: > users.id]
  is_public boolean [default: false]
  layout_config jsonb [default: '{}']
  refresh_interval integer [default: 300]
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]
}

Table pulse_dashboard_widgets {
  id uuid [pk, default: `uuid_generate_v4()`]
  dashboard_id uuid [ref: > pulse_dashboards.id]
  widget_type varchar [not null]
  title varchar [not null]
  kpi_id uuid [ref: > pulse_kpis.id]
  position jsonb [not null]
  size jsonb [not null]
  config jsonb [default: '{}']
  created_at timestamptz [default: `now()`]
}

// Catalyst - Journey Phases
Table catalyst_journey_phases {
  id uuid [pk, default: `uuid_generate_v4()`]
  journey_id uuid [ref: > catalyst_journeys.id]
  name varchar [not null]
  description text
  order_index integer [not null]
  duration_weeks integer
  status varchar [default: 'pending']
  start_date date
  end_date date
  completion_percentage integer [default: 0]
  created_at timestamptz [default: `now()`]
}

Table catalyst_stakeholder_engagement {
  id uuid [pk, default: `uuid_generate_v4()`]
  stakeholder_id uuid [ref: > catalyst_stakeholders.id]
  engagement_type varchar [not null]
  engagement_date timestamptz [not null]
  outcome varchar
  notes text
  follow_up_required boolean [default: false]
  follow_up_date date
  created_by uuid [ref: > users.id]
  created_at timestamptz [default: `now()`]
}

// Flow - Process Maps
Table flow_process_maps {
  id uuid [pk, default: `uuid_generate_v4()`]
  organization_id uuid [ref: > organizations.id]
  name varchar [not null]
  description text
  department_id uuid [ref: > departments.id]
  owner_id uuid [ref: > users.id]
  version varchar [default: '1.0']
  status varchar [default: 'draft']
  complexity varchar [default: 'medium']
  estimated_duration varchar
  metadata jsonb [default: '{}']
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]
}

Table flow_process_nodes {
  id uuid [pk, default: `uuid_generate_v4()`]
  process_map_id uuid [ref: > flow_process_maps.id]
  node_type varchar [not null]
  label varchar [not null]
  description text
  position jsonb [not null]
  assignee varchar
  estimated_time integer
  status varchar [default: 'pending']
  metadata jsonb [default: '{}']
  created_at timestamptz [default: `now()`]
}

Table flow_process_connections {
  id uuid [pk, default: `uuid_generate_v4()`]
  process_map_id uuid [ref: > flow_process_maps.id]
  from_node_id uuid [ref: > flow_process_nodes.id]
  to_node_id uuid [ref: > flow_process_nodes.id]
  label varchar
  condition varchar
  probability numeric
  created_at timestamptz [default: `now()`]
}

Table flow_analysis_results {
  id uuid [pk, default: `uuid_generate_v4()`]
  document_id uuid [ref: > flow_documents.id]
  analysis_type varchar [not null]
  quality_score integer
  compliance_score integer
  efficiency_score integer
  readability_score integer
  completeness_percentage integer
  consistency_rating integer
  issues_found integer [default: 0]
  suggestions_count integer [default: 0]
  analysis_date timestamptz [default: `now()`]
  metadata jsonb [default: '{}']
}

// Foresight - Enhanced Scenario Modeling
Table foresight_scenario_variables {
  id uuid [pk, default: `uuid_generate_v4()`]
  scenario_id uuid [ref: > foresight_scenarios.id]
  name varchar [not null]
  category varchar [not null]
  variable_type varchar [not null]
  value numeric [not null]
  unit varchar
  min_value numeric
  max_value numeric
  formula text
  dependencies jsonb [default: '[]']
  created_at timestamptz [default: `now()`]
}

Table foresight_simulation_runs {
  id uuid [pk, default: `uuid_generate_v4()`]
  scenario_id uuid [ref: > foresight_scenarios.id]
  simulation_type varchar [not null]
  iterations integer [default: 1000]
  confidence_level numeric [default: 95]
  status varchar [default: 'pending']
  started_at timestamptz
  completed_at timestamptz
  results jsonb [default: '{}']
  created_by uuid [ref: > users.id]
  created_at timestamptz [default: `now()`]
}

Table foresight_impact_assessments {
  id uuid [pk, default: `uuid_generate_v4()`]
  scenario_id uuid [ref: > foresight_scenarios.id]
  dimension varchar [not null]
  impact_score numeric [not null]
  confidence_score numeric [not null]
  trend varchar
  metrics jsonb [default: '[]']
  created_at timestamptz [default: `now()`]
}

Table foresight_stakeholder_impacts {
  id uuid [pk, default: `uuid_generate_v4()`]
  scenario_id uuid [ref: > foresight_scenarios.id]
  stakeholder_group varchar [not null]
  impact_score numeric [not null]
  confidence_score numeric [not null]
  description text
  priority varchar [default: 'medium']
  created_at timestamptz [default: `now()`]
}