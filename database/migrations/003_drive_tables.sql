-- Drive App Tables

-- Projects
CREATE TABLE IF NOT EXISTS drive_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  status VARCHAR DEFAULT 'planning',
  health VARCHAR DEFAULT 'good',
  priority VARCHAR DEFAULT 'medium',
  owner_id UUID REFERENCES users(id),
  align_goal_id UUID REFERENCES align_objectives(id),
  department_id UUID REFERENCES departments(id),
  team_id UUID REFERENCES teams(id),
  start_date DATE,
  due_date DATE,
  completion_date DATE,
  budget_allocated NUMERIC,
  budget_spent NUMERIC,
  progress_percentage INTEGER DEFAULT 0,
  risk_level VARCHAR DEFAULT 'low',
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE IF NOT EXISTS drive_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES drive_projects(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  status VARCHAR DEFAULT 'todo',
  priority VARCHAR DEFAULT 'medium',
  assignee_id UUID REFERENCES users(id),
  align_goal_id UUID REFERENCES align_objectives(id),
  due_date DATE,
  completion_date DATE,
  estimated_hours NUMERIC,
  actual_hours NUMERIC DEFAULT 0,
  progress_percentage INTEGER DEFAULT 0,
  tags TEXT[],
  dependencies UUID[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments
CREATE TABLE IF NOT EXISTS drive_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  entity_type VARCHAR NOT NULL,
  entity_id UUID NOT NULL,
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES drive_comments(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attachments
CREATE TABLE IF NOT EXISTS drive_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  entity_type VARCHAR NOT NULL,
  entity_id UUID NOT NULL,
  file_name VARCHAR NOT NULL,
  file_url VARCHAR NOT NULL,
  file_type VARCHAR,
  file_size_bytes BIGINT,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Time Entries
CREATE TABLE IF NOT EXISTS drive_time_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  task_id UUID REFERENCES drive_tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER,
  description TEXT,
  billable BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_drive_projects_organization ON drive_projects(organization_id);
CREATE INDEX idx_drive_projects_owner ON drive_projects(owner_id);
CREATE INDEX idx_drive_projects_status ON drive_projects(status);
CREATE INDEX idx_drive_tasks_project ON drive_tasks(project_id);
CREATE INDEX idx_drive_tasks_assignee ON drive_tasks(assignee_id);
CREATE INDEX idx_drive_tasks_status ON drive_tasks(status);
CREATE INDEX idx_drive_comments_entity ON drive_comments(entity_type, entity_id);
CREATE INDEX idx_drive_attachments_entity ON drive_attachments(entity_type, entity_id);
CREATE INDEX idx_drive_time_entries_task ON drive_time_entries(task_id);
CREATE INDEX idx_drive_time_entries_user ON drive_time_entries(user_id);

-- Apply updated_at triggers
CREATE TRIGGER update_drive_projects_updated_at BEFORE UPDATE ON drive_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drive_tasks_updated_at BEFORE UPDATE ON drive_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();