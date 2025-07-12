# Aesyros Suite Permissions

This document outlines the complete set of Row Level Security (RLS) policies for the Aesyros Suite, consolidating the base permissions and the enhanced permissions for the organizational hierarchy.

## Base Permissions (`permissions.sql`)

```sql
-- Aesyros Suite Row Level Security (RLS) Policies
-- This file defines comprehensive permissions for all applications

-- Helper function to get user's organization
CREATE OR REPLACE FUNCTION auth.get_user_organization()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT organization_id 
        FROM users 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT role = 'admin' 
        FROM users 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is manager or admin
CREATE OR REPLACE FUNCTION auth.is_manager_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT role IN ('admin', 'manager') 
        FROM users 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ORGANIZATIONS
-- Only admins can manage organizations
CREATE POLICY "Admins can manage organizations" ON organizations
    FOR ALL USING (auth.is_admin());

CREATE POLICY "Users can view their organization" ON organizations
    FOR SELECT USING (id = auth.get_user_organization());

-- USERS
-- Users can view others in their organization
CREATE POLICY "Users can view organization members" ON users
    FOR SELECT USING (organization_id = auth.get_user_organization());

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (id = auth.uid());

-- Admins can manage all users in their organization
CREATE POLICY "Admins can manage organization users" ON users
    FOR ALL USING (
        auth.is_admin() AND organization_id = auth.get_user_organization()
    );

-- GOALS (Align App)
-- Users can view all goals in their organization
CREATE POLICY "Users can view organization goals" ON goals
    FOR SELECT USING (organization_id = auth.get_user_organization());

-- Users can create goals in their organization
CREATE POLICY "Users can create goals" ON goals
    FOR INSERT WITH CHECK (organization_id = auth.get_user_organization());

-- Goal owners and managers can update their goals
CREATE POLICY "Goal owners can update goals" ON goals
    FOR UPDATE USING (
        organization_id = auth.get_user_organization() AND
        (owner_id = auth.uid() OR auth.is_manager_or_admin())
    );

-- Only admins can delete goals
CREATE POLICY "Admins can delete goals" ON goals
    FOR DELETE USING (
        organization_id = auth.get_user_organization() AND auth.is_admin()
    );

-- GOAL UPDATES
CREATE POLICY "Users can view goal updates" ON goal_updates
    FOR SELECT USING (
        goal_id IN (
            SELECT id FROM goals WHERE organization_id = auth.get_user_organization()
        )
    );

CREATE POLICY "Users can create goal updates" ON goal_updates
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        goal_id IN (
            SELECT id FROM goals WHERE organization_id = auth.get_user_organization()
        )
    );

-- KPIS (Pulse App)
-- Users can view all KPIs in their organization
CREATE POLICY "Users can view organization KPIs" ON kpis
    FOR SELECT USING (organization_id = auth.get_user_organization());

-- Managers can create KPIs
CREATE POLICY "Managers can create KPIs" ON kpis
    FOR INSERT WITH CHECK (
        organization_id = auth.get_user_organization() AND
        auth.is_manager_or_admin()
    );

-- KPI owners and managers can update KPIs
CREATE POLICY "KPI owners can update KPIs" ON kpis
    FOR UPDATE USING (
        organization_id = auth.get_user_organization() AND
        (owner_id = auth.uid() OR auth.is_manager_or_admin())
    );

-- Only admins can delete KPIs
CREATE POLICY "Admins can delete KPIs" ON kpis
    FOR DELETE USING (
        organization_id = auth.get_user_organization() AND auth.is_admin()
    );

-- KPI VALUES
CREATE POLICY "Users can view KPI values" ON kpi_values
    FOR SELECT USING (
        kpi_id IN (
            SELECT id FROM kpis WHERE organization_id = auth.get_user_organization()
        )
    );

CREATE POLICY "Users can record KPI values" ON kpi_values
    FOR INSERT WITH CHECK (
        recorded_by = auth.uid() AND
        kpi_id IN (
            SELECT id FROM kpis WHERE organization_id = auth.get_user_organization()
        )
    );

-- CHANGE JOURNEYS (Catalyst App)
-- Users can view all change journeys in their organization
CREATE POLICY "Users can view organization journeys" ON change_journeys
    FOR SELECT USING (organization_id = auth.get_user_organization());

-- Managers can create change journeys
CREATE POLICY "Managers can create journeys" ON change_journeys
    FOR INSERT WITH CHECK (
        organization_id = auth.get_user_organization() AND
        auth.is_manager_or_admin()
    );

-- Journey owners and managers can update journeys
CREATE POLICY "Journey owners can update journeys" ON change_journeys
    FOR UPDATE USING (
        organization_id = auth.get_user_organization() AND
        (owner_id = auth.uid() OR auth.is_manager_or_admin())
    );

-- Only admins can delete journeys
CREATE POLICY "Admins can delete journeys" ON change_journeys
    FOR DELETE USING (
        organization_id = auth.get_user_organization() AND auth.is_admin()
    );

-- STAKEHOLDERS
CREATE POLICY "Users can view organization stakeholders" ON stakeholders
    FOR SELECT USING (organization_id = auth.get_user_organization());

CREATE POLICY "Managers can manage stakeholders" ON stakeholders
    FOR ALL USING (
        organization_id = auth.get_user_organization() AND
        auth.is_manager_or_admin()
    );

-- JOURNEY STAKEHOLDERS (junction table)
CREATE POLICY "Users can view journey stakeholders" ON journey_stakeholders
    FOR SELECT USING (
        journey_id IN (
            SELECT id FROM change_journeys WHERE organization_id = auth.get_user_organization()
        )
    );

CREATE POLICY "Managers can manage journey stakeholders" ON journey_stakeholders
    FOR ALL USING (
        journey_id IN (
            SELECT id FROM change_journeys 
            WHERE organization_id = auth.get_user_organization()
        ) AND auth.is_manager_or_admin()
    );

-- PROCESSES (Flow App)
-- Users can view all processes in their organization
CREATE POLICY "Users can view organization processes" ON processes
    FOR SELECT USING (organization_id = auth.get_user_organization());

-- Users can create processes
CREATE POLICY "Users can create processes" ON processes
    FOR INSERT WITH CHECK (organization_id = auth.get_user_organization());

-- Process owners and managers can update processes
CREATE POLICY "Process owners can update processes" ON processes
    FOR UPDATE USING (
        organization_id = auth.get_user_organization() AND
        (owner_id = auth.uid() OR auth.is_manager_or_admin())
    );

-- Only admins can delete processes
CREATE POLICY "Admins can delete processes" ON processes
    FOR DELETE USING (
        organization_id = auth.get_user_organization() AND auth.is_admin()
    );

-- PROCESS STEPS
CREATE POLICY "Users can view process steps" ON process_steps
    FOR SELECT USING (
        process_id IN (
            SELECT id FROM processes WHERE organization_id = auth.get_user_organization()
        )
    );

CREATE POLICY "Process owners can manage steps" ON process_steps
    FOR ALL USING (
        process_id IN (
            SELECT id FROM processes 
            WHERE organization_id = auth.get_user_organization() AND
            (owner_id = auth.uid() OR auth.is_manager_or_admin())
        )
    );

-- DOCUMENTS
CREATE POLICY "Users can view organization documents" ON documents
    FOR SELECT USING (organization_id = auth.get_user_organization());

CREATE POLICY "Users can create documents" ON documents
    FOR INSERT WITH CHECK (organization_id = auth.get_user_organization());

CREATE POLICY "Document owners can update documents" ON documents
    FOR UPDATE USING (
        organization_id = auth.get_user_organization() AND
        (owner_id = auth.uid() OR auth.is_manager_or_admin())
    );

-- VALIDATION ISSUES
CREATE POLICY "Users can view validation issues" ON validation_issues
    FOR SELECT USING (
        document_id IN (
            SELECT id FROM documents WHERE organization_id = auth.get_user_organization()
        )
    );

CREATE POLICY "Users can manage validation issues" ON validation_issues
    FOR ALL USING (
        document_id IN (
            SELECT id FROM documents WHERE organization_id = auth.get_user_organization()
        )
    );

-- SCENARIOS (Foresight App)
-- Users can view all scenarios in their organization
CREATE POLICY "Users can view organization scenarios" ON scenarios
    FOR SELECT USING (organization_id = auth.get_user_organization());

-- Managers can create scenarios
CREATE POLICY "Managers can create scenarios" ON scenarios
    FOR INSERT WITH CHECK (
        organization_id = auth.get_user_organization() AND
        auth.is_manager_or_admin()
    );

-- Scenario creators and managers can update scenarios
CREATE POLICY "Scenario creators can update scenarios" ON scenarios
    FOR UPDATE USING (
        organization_id = auth.get_user_organization() AND
        (created_by = auth.uid() OR auth.is_manager_or_admin())
    );

-- BUSINESS LEVERS
CREATE POLICY "Users can view business levers" ON business_levers
    FOR SELECT USING (organization_id = auth.get_user_organization());

CREATE POLICY "Managers can manage business levers" ON business_levers
    FOR ALL USING (
        organization_id = auth.get_user_organization() AND
        auth.is_manager_or_admin()
    );

-- SCENARIO SIMULATIONS
CREATE POLICY "Users can view scenario simulations" ON scenario_simulations
    FOR SELECT USING (
        scenario_id IN (
            SELECT id FROM scenarios WHERE organization_id = auth.get_user_organization()
        )
    );

CREATE POLICY "Users can create simulations" ON scenario_simulations
    FOR INSERT WITH CHECK (
        scenario_id IN (
            SELECT id FROM scenarios WHERE organization_id = auth.get_user_organization()
        )
    );

-- COMMENTS (Shared across all apps)
-- Users can view comments on resources in their organization
CREATE POLICY "Users can view comments" ON comments
    FOR SELECT USING (
        -- This would need more complex logic to check if the resource belongs to the org
        user_id IN (
            SELECT id FROM users WHERE organization_id = auth.get_user_organization()
        )
    );

-- Users can create comments
CREATE POLICY "Users can create comments" ON comments
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own comments
CREATE POLICY "Users can update own comments" ON comments
    FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own comments, managers can delete any
CREATE POLICY "Users can delete own comments" ON comments
    FOR DELETE USING (
        user_id = auth.uid() OR auth.is_manager_or_admin()
    );
```

## Enhanced Permissions (`enhanced_permissions.sql`)

```sql
-- Enhanced Row Level Security (RLS) Policies for Organizational Hierarchy
-- This file defines comprehensive permissions for the enhanced organizational structure

-- =============================================================================
-- ENABLE RLS ON NEW TABLES
-- =============================================================================

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_memberships ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- ORGANIZATIONS POLICIES (Enhanced)
-- =============================================================================

-- Enhanced organization policies with vision/mission access
DROP POLICY IF EXISTS "Users can view their organization" ON organizations;
CREATE POLICY "Users can view their organization" ON organizations
    FOR SELECT USING (id = auth.get_user_organization());

DROP POLICY IF EXISTS "Admins can manage organizations" ON organizations;
CREATE POLICY "Admins can manage organizations" ON organizations
    FOR ALL USING (
        id = auth.get_user_organization() AND auth.is_admin()
    );

-- Managers can update vision/mission
CREATE POLICY "Managers can update vision mission" ON organizations
    FOR UPDATE USING (
        id = auth.get_user_organization() AND 
        auth.is_manager_or_admin()
    ) WITH CHECK (
        id = auth.get_user_organization() AND 
        auth.is_manager_or_admin()
    );

-- =============================================================================
-- DEPARTMENTS POLICIES
-- =============================================================================

-- Users can view all departments in their organization
CREATE POLICY "Users can view organization departments" ON departments
    FOR SELECT USING (organization_id = auth.get_user_organization());

-- Admins can create departments
CREATE POLICY "Admins can create departments" ON departments
    FOR INSERT WITH CHECK (
        organization_id = auth.get_user_organization() AND
        auth.is_admin()
    );

-- Admins and department heads can update their departments
CREATE POLICY "Department heads can update departments" ON departments
    FOR UPDATE USING (
        organization_id = auth.get_user_organization() AND
        (auth.is_admin() OR head_of_department_id = auth.uid())
    ) WITH CHECK (
        organization_id = auth.get_user_organization() AND
        (auth.is_admin() OR head_of_department_id = auth.uid())
    );

-- Only admins can delete departments
CREATE POLICY "Admins can delete departments" ON departments
    FOR DELETE USING (
        organization_id = auth.get_user_organization() AND
        auth.is_admin()
    );

-- =============================================================================
-- TEAMS POLICIES
-- =============================================================================

-- Users can view teams in their organization
CREATE POLICY "Users can view organization teams" ON teams
    FOR SELECT USING (organization_id = auth.get_user_organization());

-- Admins and department heads can create teams in their departments
CREATE POLICY "Department heads can create teams" ON teams
    FOR INSERT WITH CHECK (
        organization_id = auth.get_user_organization() AND
        (
            auth.is_admin() OR 
            auth.is_department_head(department_id)
        )
    );

-- Admins, department heads, and team leads can update teams
CREATE POLICY "Team leads can update teams" ON teams
    FOR UPDATE USING (
        organization_id = auth.get_user_organization() AND
        (
            auth.is_admin() OR 
            auth.is_department_head(department_id) OR
            team_lead_id = auth.uid()
        )
    ) WITH CHECK (
        organization_id = auth.get_user_organization() AND
        (
            auth.is_admin() OR 
            auth.is_department_head(department_id) OR
            team_lead_id = auth.uid()
        )
    );

-- Only admins and department heads can delete teams
CREATE POLICY "Department heads can delete teams" ON teams
    FOR DELETE USING (
        organization_id = auth.get_user_organization() AND
        (
            auth.is_admin() OR 
            auth.is_department_head(department_id)
        )
    );

-- =============================================================================
-- TEAM MEMBERSHIPS POLICIES
-- =============================================================================

-- Users can view team memberships for teams in their organization
CREATE POLICY "Users can view team memberships" ON team_memberships
    FOR SELECT USING (
        team_id IN (
            SELECT id FROM teams WHERE organization_id = auth.get_user_organization()
        )
    );

-- Team leads, department heads, and admins can add team members
CREATE POLICY "Team leads can manage memberships" ON team_memberships
    FOR INSERT WITH CHECK (
        team_id IN (
            SELECT t.id FROM teams t
            WHERE t.organization_id = auth.get_user_organization()
            AND (
                auth.is_admin() OR
                auth.is_department_head(t.department_id) OR
                t.team_lead_id = auth.uid()
            )
        )
    );

-- Team leads, department heads, and admins can update team memberships
CREATE POLICY "Team leads can update memberships" ON team_memberships
    FOR UPDATE USING (
        team_id IN (
            SELECT t.id FROM teams t
            WHERE t.organization_id = auth.get_user_organization()
            AND (
                auth.is_admin() OR
                auth.is_department_head(t.department_id) OR
                t.team_lead_id = auth.uid()
            )
        )
    ) WITH CHECK (
        team_id IN (
            SELECT t.id FROM teams t
            WHERE t.organization_id = auth.get_user_organization()
            AND (
                auth.is_admin() OR
                auth.is_department_head(t.department_id) OR
                t.team_lead_id = auth.uid()
            )
        )
    );

-- Users can remove themselves from teams, or team leads/dept heads can remove others
CREATE POLICY "Users can leave teams" ON team_memberships
    FOR DELETE USING (
        user_id = auth.uid() OR
        team_id IN (
            SELECT t.id FROM teams t
            WHERE t.organization_id = auth.get_user_organization()
            AND (
                auth.is_admin() OR
                auth.is_department_head(t.department_id) OR
                t.team_lead_id = auth.uid()
            )
        )
    );

-- =============================================================================
-- ENHANCED USERS POLICIES
-- =============================================================================

-- Update existing user policies to include department/team context
DROP POLICY IF EXISTS "Users can view organization members" ON users;
CREATE POLICY "Users can view organization members" ON users
    FOR SELECT USING (organization_id = auth.get_user_organization());

-- Users can update their own profile (including department/team changes with restrictions)
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (id = auth.uid())
    WITH CHECK (
        id = auth.uid() AND
        organization_id = auth.get_user_organization() AND
        -- Prevent users from changing their department/team directly unless they're admin
        (
            auth.is_admin() OR 
            (department_id IS NOT DISTINCT FROM (SELECT department_id FROM users WHERE id = auth.uid())) AND
            (primary_team_id IS NOT DISTINCT FROM (SELECT primary_team_id FROM users WHERE id = auth.uid()))
        )
    );

-- Enhanced admin policy for user management
DROP POLICY IF EXISTS "Admins can manage organization users" ON users;
CREATE POLICY "Admins can manage organization users" ON users
    FOR ALL USING (
        organization_id = auth.get_user_organization() AND
        auth.is_admin()
    ) WITH CHECK (
        organization_id = auth.get_user_organization() AND
        auth.is_admin()
    );

-- Department heads can update users in their department
CREATE POLICY "Department heads can manage department users" ON users
    FOR UPDATE USING (
        organization_id = auth.get_user_organization() AND
        auth.is_department_head(department_id)
    ) WITH CHECK (
        organization_id = auth.get_user_organization() AND
        auth.is_department_head(department_id)
    );

-- =============================================================================
-- ENHANCED ALIGN_OBJECTIVES POLICIES
-- =============================================================================

-- Enhanced policy for viewing objectives based on visibility and hierarchy
DROP POLICY IF EXISTS "Users can view organization goals" ON align_objectives;
CREATE POLICY "Users can view objectives based on visibility" ON align_objectives
    FOR SELECT USING (
        organization_id = auth.get_user_organization() AND
        (
            visibility = 'public' OR
            (visibility = 'department' AND department_id = auth.get_user_department()) OR
            (visibility = 'team' AND team_id IN (SELECT team_id FROM auth.get_user_teams())) OR
            (visibility = 'private' AND owner_id = auth.uid()) OR
            auth.is_manager_or_admin()
        )
    );

-- Enhanced policy for creating objectives
DROP POLICY IF EXISTS "Users can create goals" ON align_objectives;
CREATE POLICY "Users can create objectives" ON align_objectives
    FOR INSERT WITH CHECK (
        organization_id = auth.get_user_organization() AND
        (
            -- Users can create individual objectives
            (level = 'individual' AND owner_id = auth.uid()) OR
            -- Team leads can create team objectives for their teams
            (level = 'team' AND team_id IN (
                SELECT t.id FROM teams t 
                WHERE t.team_lead_id = auth.uid() OR auth.is_admin()
            )) OR
            -- Department heads can create department objectives
            (level = 'department' AND auth.is_department_head(department_id)) OR
            -- Only admins can create corporate objectives
            (level = 'corporate' AND auth.is_admin())
        )
    );

-- Enhanced policy for updating objectives
DROP POLICY IF EXISTS "Goal owners can update goals" ON align_objectives;
CREATE POLICY "Objective owners can update objectives" ON align_objectives
    FOR UPDATE USING (
        organization_id = auth.get_user_organization() AND
        (
            owner_id = auth.uid() OR
            auth.is_admin() OR
            (level = 'team' AND team_id IN (
                SELECT t.id FROM teams t 
                WHERE t.team_lead_id = auth.uid()
            )) OR
            (level = 'department' AND auth.is_department_head(department_id))
        )
    ) WITH CHECK (
        organization_id = auth.get_user_organization() AND
        (
            owner_id = auth.uid() OR
            auth.is_admin() OR
            (level = 'team' AND team_id IN (
                SELECT t.id FROM teams t 
                WHERE t.team_lead_id = auth.uid()
            )) OR
            (level = 'department' AND auth.is_department_head(department_id))
        )
    );

-- Enhanced policy for deleting objectives
DROP POLICY IF EXISTS "Admins can delete goals" ON align_objectives;
CREATE POLICY "Authorized users can delete objectives" ON align_objectives
    FOR DELETE USING (
        organization_id = auth.get_user_organization() AND
        (
            auth.is_admin() OR
            (level = 'individual' AND owner_id = auth.uid()) OR
            (level = 'team' AND team_id IN (
                SELECT t.id FROM teams t 
                WHERE t.team_lead_id = auth.uid()
            )) OR
            (level = 'department' AND auth.is_department_head(department_id))
        )
    );

-- =============================================================================
-- ALIGN_KEY_RESULTS POLICIES (Enhanced)
-- =============================================================================

-- Users can view key results based on objective visibility
CREATE POLICY "Users can view key results" ON align_key_results
    FOR SELECT USING (
        objective_id IN (
            SELECT id FROM align_objectives 
            WHERE organization_id = auth.get_user_organization()
            -- This will automatically apply the objective visibility rules
        )
    );

-- Key result creation follows objective ownership rules
CREATE POLICY "Objective owners can create key results" ON align_key_results
    FOR INSERT WITH CHECK (
        objective_id IN (
            SELECT id FROM align_objectives
            WHERE organization_id = auth.get_user_organization()
            AND (
                owner_id = auth.uid() OR
                auth.is_admin() OR
                (level = 'team' AND team_id IN (
                    SELECT t.id FROM teams t 
                    WHERE t.team_lead_id = auth.uid()
                )) OR
                (level = 'department' AND auth.is_department_head(department_id))
            )
        )
    );

-- Key result updates follow objective ownership rules
CREATE POLICY "Objective owners can update key results" ON align_key_results
    FOR UPDATE USING (
        objective_id IN (
            SELECT id FROM align_objectives
            WHERE organization_id = auth.get_user_organization()
            AND (
                owner_id = auth.uid() OR
                auth.is_admin() OR
                (level = 'team' AND team_id IN (
                    SELECT t.id FROM teams t 
                    WHERE t.team_lead_id = auth.uid()
                )) OR
                (level = 'department' AND auth.is_department_head(department_id))
            )
        )
    ) WITH CHECK (
        objective_id IN (
            SELECT id FROM align_objectives
            WHERE organization_id = auth.get_user_organization()
            AND (
                owner_id = auth.uid() OR
                auth.is_admin() OR
                (level = 'team' AND team_id IN (
                    SELECT t.id FROM teams t 
                    WHERE t.team_lead_id = auth.uid()
                )) OR
                (level = 'department' AND auth.is_department_head(department_id))
            )
        )
    );

-- Key result deletion follows objective ownership rules
CREATE POLICY "Objective owners can delete key results" ON align_key_results
    FOR DELETE USING (
        objective_id IN (
            SELECT id FROM align_objectives
            WHERE organization_id = auth.get_user_organization()
            AND (
                owner_id = auth.uid() OR
                auth.is_admin() OR
                (level = 'team' AND team_id IN (
                    SELECT t.id FROM teams t 
                    WHERE t.team_lead_id = auth.uid()
                )) OR
                (level = 'department' AND auth.is_department_head(department_id))
            )
        )
    );

-- =============================================================================
-- ALIGN_PROGRESS_UPDATES POLICIES (Enhanced)
-- =============================================================================

-- Users can view progress updates for objectives they can see
CREATE POLICY "Users can view progress updates" ON align_progress_updates
    FOR SELECT USING (
        objective_id IN (
            SELECT id FROM align_objectives 
            WHERE organization_id = auth.get_user_organization()
            -- This will automatically apply the objective visibility rules
        )
    );

-- Users can create progress updates for objectives they own or contribute to
CREATE POLICY "Contributors can create progress updates" ON align_progress_updates
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        objective_id IN (
            SELECT id FROM align_objectives
            WHERE organization_id = auth.get_user_organization()
            AND (
                owner_id = auth.uid() OR
                -- Team members can update team objectives
                (level = 'team' AND team_id IN (SELECT team_id FROM auth.get_user_teams())) OR
                -- Department members can update department objectives
                (level = 'department' AND department_id = auth.get_user_department()) OR
                -- Anyone can update public corporate objectives
                (level = 'corporate' AND visibility = 'public')
            )
        )
    );

-- Users can update their own progress updates
CREATE POLICY "Users can update own progress updates" ON align_progress_updates
    FOR UPDATE USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Users can delete their own progress updates, managers can delete any
CREATE POLICY "Users can delete own progress updates" ON align_progress_updates
    FOR DELETE USING (
        user_id = auth.uid() OR
        auth.is_manager_or_admin()
    );

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON POLICY "Users can view objectives based on visibility" ON align_objectives IS 
'Users can view objectives based on visibility level: public (all), department (dept members), team (team members), private (owner only)';

COMMENT ON POLICY "Objective owners can update objectives" ON align_objectives IS 
'Objective owners, team leads (for team objectives), department heads (for dept objectives), and admins can update objectives';

COMMENT ON FUNCTION auth.get_user_department() IS 
'Returns the department ID of the current authenticated user';

COMMENT ON FUNCTION auth.get_user_primary_team() IS 
'Returns the primary team ID of the current authenticated user';

COMMENT ON FUNCTION auth.is_department_head(UUID) IS 
'Checks if the current user is head of the specified department (or any department if NULL)';

COMMENT ON FUNCTION auth.is_team_lead(UUID) IS 
'Checks if the current user is lead of the specified team (or any team if NULL)';
```
