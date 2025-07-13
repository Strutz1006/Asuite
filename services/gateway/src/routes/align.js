import express from 'express';
import axios from 'axios';
import { supabase } from '../config/supabase.js';

const router = express.Router();
const ALIGN_SERVICE_URL = process.env.ALIGN_SERVICE_URL || 'http://localhost:8001';

// Strategic Goals & OKRs Analytics
router.post('/objectives/analyze', async (req, res) => {
  try {
    const response = await axios.post(`${ALIGN_SERVICE_URL}/analyze-objectives`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Align service error:', error.message);
    res.status(500).json({ error: 'Failed to analyze objectives', details: error.message });
  }
});

router.post('/alignment/calculate', async (req, res) => {
  try {
    const response = await axios.post(`${ALIGN_SERVICE_URL}/calculate-alignment`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Align service error:', error.message);
    res.status(500).json({ error: 'Failed to calculate alignment', details: error.message });
  }
});

router.post('/progress/predict', async (req, res) => {
  try {
    const response = await axios.post(`${ALIGN_SERVICE_URL}/predict-progress`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Align service error:', error.message);
    res.status(500).json({ error: 'Failed to predict progress', details: error.message });
  }
});

router.post('/okrs/optimize', async (req, res) => {
  try {
    const response = await axios.post(`${ALIGN_SERVICE_URL}/optimize-okrs`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Align service error:', error.message);
    res.status(500).json({ error: 'Failed to optimize OKRs', details: error.message });
  }
});

// =============================================================================
// USER MANAGEMENT ROUTES
// =============================================================================

// Get all users in organization
router.get('/users', async (req, res) => {
  try {
    const { organizationId } = req.query;
    const orgId = organizationId || req.user?.organizationId;

    if (!orgId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    const { data: users, error } = await supabase
      .from('users')
      .select(`
        *,
        department_info:departments(id, name),
        primary_team:teams(id, name)
      `)
      .eq('organization_id', orgId);

    if (error) {
      console.error('Supabase error fetching users:', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    res.json({ users: users || [] });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        department_info:departments(id, name),
        primary_team:teams(id, name),
        team_memberships(
          id,
          role,
          team:teams(id, name)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error fetching user:', error);
      return res.status(500).json({ error: 'Failed to fetch user' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove read-only fields
    delete updates.id;
    delete updates.created_at;
    delete updates.updated_at;

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating user:', error);
      return res.status(500).json({ error: 'Failed to update user' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create user
router.post('/users', async (req, res) => {
  try {
    const userData = req.body;
    userData.organization_id = userData.organization_id || req.user?.organizationId;

    const { data: user, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating user:', error);
      return res.status(500).json({ error: 'Failed to create user' });
    }

    res.status(201).json({ user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error deleting user:', error);
      return res.status(500).json({ error: 'Failed to delete user' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =============================================================================
// DEPARTMENT MANAGEMENT ROUTES
// =============================================================================

// Get all departments in organization
router.get('/departments', async (req, res) => {
  try {
    const { organizationId } = req.query;
    const orgId = organizationId || req.user?.organizationId;

    if (!orgId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    const { data: departments, error } = await supabase
      .from('departments')
      .select(`
        *,
        head_of_department:users(id, full_name, email),
        parent_department:departments(id, name)
      `)
      .eq('organization_id', orgId);

    if (error) {
      console.error('Supabase error fetching departments:', error);
      return res.status(500).json({ error: 'Failed to fetch departments' });
    }

    res.json({ departments: departments || [] });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get department by ID
router.get('/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: department, error } = await supabase
      .from('departments')
      .select(`
        *,
        head_of_department:users(id, full_name, email),
        parent_department:departments(id, name),
        teams(*),
        employees:users(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error fetching department:', error);
      return res.status(500).json({ error: 'Failed to fetch department' });
    }

    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json({ department });
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create department
router.post('/departments', async (req, res) => {
  try {
    const departmentData = req.body;
    departmentData.organization_id = departmentData.organization_id || req.user?.organizationId;

    const { data: department, error } = await supabase
      .from('departments')
      .insert(departmentData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating department:', error);
      return res.status(500).json({ error: 'Failed to create department' });
    }

    res.status(201).json({ department });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update department
router.put('/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove read-only fields
    delete updates.id;
    delete updates.created_at;
    delete updates.updated_at;
    delete updates.employee_count;
    delete updates.goals_count;

    const { data: department, error } = await supabase
      .from('departments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating department:', error);
      return res.status(500).json({ error: 'Failed to update department' });
    }

    res.json({ department });
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete department
router.delete('/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error deleting department:', error);
      return res.status(500).json({ error: 'Failed to delete department' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =============================================================================
// TEAM MANAGEMENT ROUTES
// =============================================================================

// Get all teams in organization
router.get('/teams', async (req, res) => {
  try {
    const { organizationId, departmentId } = req.query;
    const orgId = organizationId || req.user?.organizationId;

    if (!orgId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    let query = supabase
      .from('teams')
      .select(`
        *,
        department:departments(id, name),
        team_lead:users(id, full_name, email)
      `)
      .eq('organization_id', orgId);

    if (departmentId) {
      query = query.eq('department_id', departmentId);
    }

    const { data: teams, error } = await query;

    if (error) {
      console.error('Supabase error fetching teams:', error);
      return res.status(500).json({ error: 'Failed to fetch teams' });
    }

    res.json({ teams: teams || [] });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get team by ID
router.get('/teams/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: team, error } = await supabase
      .from('teams')
      .select(`
        *,
        department:departments(id, name),
        team_lead:users(id, full_name, email),
        members:team_memberships(
          id,
          role,
          is_active,
          user:users(id, full_name, email)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error fetching team:', error);
      return res.status(500).json({ error: 'Failed to fetch team' });
    }

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json({ team });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create team
router.post('/teams', async (req, res) => {
  try {
    const teamData = req.body;
    teamData.organization_id = teamData.organization_id || req.user?.organizationId;

    const { data: team, error } = await supabase
      .from('teams')
      .insert(teamData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating team:', error);
      return res.status(500).json({ error: 'Failed to create team' });
    }

    res.status(201).json({ team });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update team
router.put('/teams/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove read-only fields
    delete updates.id;
    delete updates.created_at;
    delete updates.updated_at;
    delete updates.member_count;
    delete updates.goals_count;

    const { data: team, error } = await supabase
      .from('teams')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating team:', error);
      return res.status(500).json({ error: 'Failed to update team' });
    }

    res.json({ team });
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete team
router.delete('/teams/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error deleting team:', error);
      return res.status(500).json({ error: 'Failed to delete team' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;