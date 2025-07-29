-- Pulse App Tables

-- KPIs
CREATE TABLE IF NOT EXISTS pulse_kpis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR,
  owner_id UUID REFERENCES users(id),
  formula TEXT,
  target_value VARCHAR,
  current_value VARCHAR,
  unit VARCHAR,
  frequency VARCHAR,
  data_source VARCHAR,
  benchmark_value VARCHAR,
  benchmark_source VARCHAR,
  threshold_red VARCHAR,
  threshold_yellow VARCHAR,
  threshold_green VARCHAR,
  trend_direction VARCHAR,
  is_public BOOLEAN DEFAULT false,
  auto_update BOOLEAN DEFAULT false,
  api_endpoint VARCHAR,
  status VARCHAR DEFAULT 'active',
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- KPI Values
CREATE TABLE IF NOT EXISTS pulse_kpi_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kpi_id UUID REFERENCES pulse_kpis(id) ON DELETE CASCADE,
  value VARCHAR NOT NULL,
  period_start DATE,
  period_end DATE,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  recorded_by UUID REFERENCES users(id),
  notes TEXT,
  confidence_score INTEGER,
  metadata JSONB DEFAULT '{}'
);

-- Anomalies
CREATE TABLE IF NOT EXISTS pulse_anomalies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kpi_id UUID REFERENCES pulse_kpis(id) ON DELETE CASCADE,
  severity VARCHAR,
  type VARCHAR,
  description TEXT,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

-- Dashboards
CREATE TABLE IF NOT EXISTS pulse_dashboards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES users(id),
  is_public BOOLEAN DEFAULT false,
  layout_config JSONB DEFAULT '{}',
  refresh_interval INTEGER DEFAULT 300,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dashboard Widgets
CREATE TABLE IF NOT EXISTS pulse_dashboard_widgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dashboard_id UUID REFERENCES pulse_dashboards(id) ON DELETE CASCADE,
  widget_type VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  kpi_id UUID REFERENCES pulse_kpis(id),
  position JSONB NOT NULL,
  size JSONB NOT NULL,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_pulse_kpis_organization ON pulse_kpis(organization_id);
CREATE INDEX idx_pulse_kpis_owner ON pulse_kpis(owner_id);
CREATE INDEX idx_pulse_kpis_category ON pulse_kpis(category);
CREATE INDEX idx_pulse_kpi_values_kpi ON pulse_kpi_values(kpi_id);
CREATE INDEX idx_pulse_kpi_values_period ON pulse_kpi_values(period_start, period_end);
CREATE INDEX idx_pulse_anomalies_kpi ON pulse_anomalies(kpi_id);
CREATE INDEX idx_pulse_anomalies_severity ON pulse_anomalies(severity);
CREATE INDEX idx_pulse_dashboards_organization ON pulse_dashboards(organization_id);
CREATE INDEX idx_pulse_dashboards_owner ON pulse_dashboards(owner_id);
CREATE INDEX idx_pulse_dashboard_widgets_dashboard ON pulse_dashboard_widgets(dashboard_id);

-- Apply updated_at triggers
CREATE TRIGGER update_pulse_kpis_updated_at BEFORE UPDATE ON pulse_kpis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pulse_dashboards_updated_at BEFORE UPDATE ON pulse_dashboards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();