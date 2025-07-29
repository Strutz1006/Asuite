-- Flow App Tables

-- Documents
CREATE TABLE IF NOT EXISTS flow_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR,
  department VARCHAR,
  owner_id UUID REFERENCES users(id),
  file_url VARCHAR,
  file_type VARCHAR,
  file_size_bytes BIGINT,
  version VARCHAR DEFAULT 'v1.0',
  word_count INTEGER,
  status VARCHAR DEFAULT 'draft',
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
  compliance_status VARCHAR,
  last_reviewed_at TIMESTAMPTZ,
  last_reviewed_by UUID REFERENCES users(id),
  next_review_date DATE,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Issues
CREATE TABLE IF NOT EXISTS flow_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES flow_documents(id) ON DELETE CASCADE,
  type VARCHAR,
  severity VARCHAR,
  description TEXT,
  recommendation TEXT,
  location_reference TEXT,
  status VARCHAR DEFAULT 'open',
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Compliance Frameworks
CREATE TABLE IF NOT EXISTS flow_compliance_frameworks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  version VARCHAR,
  coverage_percentage INTEGER DEFAULT 0,
  missing_requirements INTEGER DEFAULT 0,
  status VARCHAR DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance Checks
CREATE TABLE IF NOT EXISTS flow_compliance_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES flow_documents(id) ON DELETE CASCADE,
  framework_id UUID REFERENCES flow_compliance_frameworks(id),
  requirement_id VARCHAR,
  requirement_name VARCHAR,
  compliance_status VARCHAR,
  gap_description TEXT,
  recommendation TEXT,
  priority VARCHAR,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Process Maps
CREATE TABLE IF NOT EXISTS flow_process_maps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  department_id UUID REFERENCES departments(id),
  owner_id UUID REFERENCES users(id),
  version VARCHAR DEFAULT '1.0',
  status VARCHAR DEFAULT 'draft',
  complexity VARCHAR DEFAULT 'medium',
  estimated_duration VARCHAR,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Process Nodes
CREATE TABLE IF NOT EXISTS flow_process_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  process_map_id UUID REFERENCES flow_process_maps(id) ON DELETE CASCADE,
  node_type VARCHAR NOT NULL,
  label VARCHAR NOT NULL,
  description TEXT,
  position JSONB NOT NULL,
  assignee VARCHAR,
  estimated_time INTEGER,
  status VARCHAR DEFAULT 'pending',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Process Connections
CREATE TABLE IF NOT EXISTS flow_process_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  process_map_id UUID REFERENCES flow_process_maps(id) ON DELETE CASCADE,
  from_node_id UUID REFERENCES flow_process_nodes(id) ON DELETE CASCADE,
  to_node_id UUID REFERENCES flow_process_nodes(id) ON DELETE CASCADE,
  label VARCHAR,
  condition VARCHAR,
  probability NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analysis Results
CREATE TABLE IF NOT EXISTS flow_analysis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES flow_documents(id) ON DELETE CASCADE,
  analysis_type VARCHAR NOT NULL,
  quality_score INTEGER,
  compliance_score INTEGER,
  efficiency_score INTEGER,
  readability_score INTEGER,
  completeness_percentage INTEGER,
  consistency_rating INTEGER,
  issues_found INTEGER DEFAULT 0,
  suggestions_count INTEGER DEFAULT 0,
  analysis_date TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Create indexes
CREATE INDEX idx_flow_documents_organization ON flow_documents(organization_id);
CREATE INDEX idx_flow_documents_owner ON flow_documents(owner_id);
CREATE INDEX idx_flow_documents_status ON flow_documents(status);
CREATE INDEX idx_flow_issues_document ON flow_issues(document_id);
CREATE INDEX idx_flow_issues_status ON flow_issues(status);
CREATE INDEX idx_flow_compliance_frameworks_organization ON flow_compliance_frameworks(organization_id);
CREATE INDEX idx_flow_compliance_checks_document ON flow_compliance_checks(document_id);
CREATE INDEX idx_flow_compliance_checks_framework ON flow_compliance_checks(framework_id);
CREATE INDEX idx_flow_process_maps_organization ON flow_process_maps(organization_id);
CREATE INDEX idx_flow_process_nodes_map ON flow_process_nodes(process_map_id);
CREATE INDEX idx_flow_process_connections_map ON flow_process_connections(process_map_id);
CREATE INDEX idx_flow_analysis_results_document ON flow_analysis_results(document_id);

-- Apply updated_at triggers
CREATE TRIGGER update_flow_documents_updated_at BEFORE UPDATE ON flow_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flow_process_maps_updated_at BEFORE UPDATE ON flow_process_maps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();