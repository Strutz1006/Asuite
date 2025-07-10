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