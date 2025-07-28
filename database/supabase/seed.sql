-- Seed data for Aesyros Suite development
-- This file contains sample data for testing and development

-- Insert sample company
INSERT INTO align_companies (id, name, description, vision, mission, industry, size) VALUES 
(
  'b8f7a8e0-4e3a-4c2b-9f1d-6a5c3b9d2e1f',
  'Acme Corporation',
  'A leading technology company focused on innovation and customer satisfaction.',
  'To be the worlds most trusted technology partner, empowering businesses to achieve their full potential.',
  'We create innovative technology solutions that simplify complex challenges and drive meaningful progress for our customers and communities.',
  'Technology',
  'medium'
);

-- Insert sample users (these would typically be created through auth signup)
INSERT INTO users (id, email, full_name) VALUES 
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'john.doe@acme.com',
  'John Doe'
),
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d480',
  'jane.smith@acme.com',
  'Jane Smith'
),
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d481',
  'mike.johnson@acme.com',
  'Mike Johnson'
);

-- Insert sample goals
INSERT INTO align_goals (id, company_id, title, description, type, status, priority, target_value, current_value, unit, target_date, owner_id) VALUES 
(
  'a1b2c3d4-e5f6-4a5b-9c8d-1e2f3a4b5c6d',
  'b8f7a8e0-4e3a-4c2b-9f1d-6a5c3b9d2e1f',
  'Increase Annual Revenue',
  'Achieve 25% growth in annual recurring revenue through new customer acquisition and expansion.',
  'okr',
  'in_progress',
  'high',
  1250000,
  950000,
  'USD',
  '2024-12-31',
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'
),
(
  'a1b2c3d4-e5f6-4a5b-9c8d-1e2f3a4b5c6e',
  'b8f7a8e0-4e3a-4c2b-9f1d-6a5c3b9d2e1f',
  'Improve Customer Satisfaction',
  'Achieve and maintain a customer satisfaction score above 90%.',
  'smart',
  'in_progress',
  'high',
  90,
  87,
  'percentage',
  '2024-12-31',
  'f47ac10b-58cc-4372-a567-0e02b2c3d480'
),
(
  'a1b2c3d4-e5f6-4a5b-9c8d-1e2f3a4b5c6f',
  'b8f7a8e0-4e3a-4c2b-9f1d-6a5c3b9d2e1f',
  'Launch New Product Line',
  'Successfully launch and market our AI-powered analytics platform.',
  'objective',
  'planning',
  'medium',
  1,
  0,
  'milestone',
  '2024-06-30',
  'f47ac10b-58cc-4372-a567-0e02b2c3d481'
);

-- Insert sample projects
INSERT INTO drive_projects (id, company_id, name, description, status, priority, health, budget, spent, start_date, end_date, owner_id) VALUES 
(
  'p1a2b3c4-d5e6-4f5a-8b7c-9d8e7f6a5b4c',
  'b8f7a8e0-4e3a-4c2b-9f1d-6a5c3b9d2e1f',
  'Customer Portal Redesign',
  'Complete overhaul of the customer portal interface with improved UX and new features.',
  'active',
  'high',
  'good',
  150000,
  45000,
  '2024-01-15',
  '2024-06-15',
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'
),
(
  'p1a2b3c4-d5e6-4f5a-8b7c-9d8e7f6a5b4d',
  'b8f7a8e0-4e3a-4c2b-9f1d-6a5c3b9d2e1f',
  'Mobile App Development',
  'Develop native mobile applications for iOS and Android platforms.',
  'active',
  'high',
  'at-risk',
  200000,
  120000,
  '2024-02-01',
  '2024-08-01',
  'f47ac10b-58cc-4372-a567-0e02b2c3d480'
),
(
  'p1a2b3c4-d5e6-4f5a-8b7c-9d8e7f6a5b4e',
  'b8f7a8e0-4e3a-4c2b-9f1d-6a5c3b9d2e1f',
  'Data Migration Project',
  'Migrate legacy data systems to new cloud-based infrastructure.',
  'planning',
  'medium',
  'good',
  80000,
  5000,
  '2024-05-01',
  '2024-09-01',
  'f47ac10b-58cc-4372-a567-0e02b2c3d481'
);

-- Insert sample tasks
INSERT INTO drive_tasks (id, company_id, project_id, title, description, status, priority, type, estimated_hours, actual_hours, assignee_id, due_date) VALUES 
(
  't1a2b3c4-d5e6-4f5a-8b7c-9d8e7f6a5b4c',
  'b8f7a8e0-4e3a-4c2b-9f1d-6a5c3b9d2e1f',
  'p1a2b3c4-d5e6-4f5a-8b7c-9d8e7f6a5b4c',
  'Design new homepage layout',
  'Create wireframes and mockups for the redesigned homepage with improved navigation.',
  'completed',
  'high',
  'design',
  20,
  18,
  'f47ac10b-58cc-4372-a567-0e02b2c3d480',
  '2024-02-15'
),
(
  't1a2b3c4-d5e6-4f5a-8b7c-9d8e7f6a5b4d',
  'b8f7a8e0-4e3a-4c2b-9f1d-6a5c3b9d2e1f',
  'p1a2b3c4-d5e6-4f5a-8b7c-9d8e7f6a5b4c',
  'Implement user authentication',
  'Develop secure user login and registration functionality with multi-factor authentication.',
  'in_progress',
  'high',
  'development',
  40,
  25,
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  '2024-03-01'
),
(
  't1a2b3c4-d5e6-4f5a-8b7c-9d8e7f6a5b4e',
  'b8f7a8e0-4e3a-4c2b-9f1d-6a5c3b9d2e1f',
  'p1a2b3c4-d5e6-4f5a-8b7c-9d8e7f6a5b4d',
  'iOS app store submission',
  'Prepare and submit the iOS application to the App Store for review.',
  'pending',
  'medium',
  'deployment',
  8,
  0,
  'f47ac10b-58cc-4372-a567-0e02b2c3d481',
  '2024-07-15'
);

-- Insert sample KPIs
INSERT INTO pulse_kpis (id, company_id, name, description, category, measurement_type, target_value, current_value, unit, frequency, owner_id, status) VALUES 
(
  'k1a2b3c4-d5e6-4f5a-8b7c-9d8e7f6a5b4c',
  'b8f7a8e0-4e3a-4c2b-9f1d-6a5c3b9d2e1f',
  'Monthly Recurring Revenue',
  'Total monthly recurring revenue from subscription customers.',
  'financial',
  'currency',
  100000,
  85000,
  'USD',
  'monthly',
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'active'
),
(
  'k1a2b3c4-d5e6-4f5a-8b7c-9d8e7f6a5b4d',
  'b8f7a8e0-4e3a-4c2b-9f1d-6a5c3b9d2e1f',
  'Customer Acquisition Cost',
  'Average cost to acquire a new customer including marketing and sales expenses.',
  'customer',
  'currency',
  500,
  650,
  'USD',
  'monthly',
  'f47ac10b-58cc-4372-a567-0e02b2c3d480',
  'active'
),
(
  'k1a2b3c4-d5e6-4f5a-8b7c-9d8e7f6a5b4e',
  'b8f7a8e0-4e3a-4c2b-9f1d-6a5c3b9d2e1f',
  'Employee Net Promoter Score',
  'Measure of employee satisfaction and likelihood to recommend the company as a workplace.',
  'employee',
  'score',
  70,
  68,
  'points',
  'quarterly',
  'f47ac10b-58cc-4372-a567-0e02b2c3d481',
  'active'
);