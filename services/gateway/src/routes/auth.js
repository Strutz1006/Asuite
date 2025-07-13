import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for backend operations
);

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      organizationId: user.organization_id 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Input validation helper
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    console.log('Auth: Attempting login for:', email);

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('Auth: Supabase auth error:', authError);
      return res.status(401).json({ 
        error: 'Invalid credentials'
        // Note: Don't expose internal Supabase error details to client for security
      });
    }

    if (!authData.user) {
      return res.status(401).json({ 
        error: 'Authentication failed' 
      });
    }

    console.log('Auth: Supabase auth successful for:', authData.user.email);

    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select(`
        *,
        organization:organizations(*),
        department_info:departments(*),
        primary_team:teams(*)
      `)
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.warn('Auth: Profile not found, creating basic profile:', profileError);
      // Create basic profile if none exists
      const basicProfile = {
        id: authData.user.id,
        email: authData.user.email,
        full_name: authData.user.user_metadata?.full_name || 'User',
        role: 'user',
        organization_id: 'default-org',
        department_id: null,
        job_title: null,
        is_active: true,
        preferences: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Try to insert basic profile
      const { error: insertError } = await supabase
        .from('users')
        .insert(basicProfile);

      if (insertError) {
        console.error('Auth: Failed to create basic profile:', insertError);
      }

      const token = generateToken(basicProfile);

      res.json({
        success: true,
        user: {
          id: basicProfile.id,
          email: basicProfile.email,
          full_name: basicProfile.full_name,
          role: basicProfile.role,
          organization_id: basicProfile.organization_id
        },
        profile: basicProfile,
        token
      });
    } else {
      console.log('Auth: Profile found for user');
      
      const token = generateToken(profile);

      res.json({
        success: true,
        user: {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: profile.role,
          organization_id: profile.organization_id
        },
        profile,
        token
      });
    }

  } catch (error) {
    console.error('Auth: Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// GET /api/auth/test - Simple test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Auth service is working',
    timestamp: new Date().toISOString()
  });
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  try {
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Auth: Logout error:', error);
    }

    res.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Auth: Logout error:', error);
    res.status(500).json({ 
      error: 'Logout failed',
      details: error.message 
    });
  }
});

// GET /api/auth/session
router.get('/session', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided' 
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Get fresh user data from database
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select(`
          *,
          organization:organizations(*),
          department_info:departments(*),
          primary_team:teams(*)
        `)
        .eq('id', decoded.id)
        .single();

      if (profileError || !profile) {
        return res.status(401).json({ 
          error: 'User not found' 
        });
      }

      res.json({
        success: true,
        user: {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: profile.role,
          organization_id: profile.organization_id
        },
        profile
      });

    } catch (jwtError) {
      console.error('Auth: JWT verification failed:', jwtError);
      return res.status(401).json({ 
        error: 'Invalid token' 
      });
    }

  } catch (error) {
    console.error('Auth: Session check error:', error);
    res.status(500).json({ 
      error: 'Session check failed',
      details: error.message 
    });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided' 
      });
    }

    const token = authHeader.substring(7);

    try {
      // SECURITY FIX: Remove ignoreExpiration - expired tokens should NOT be refreshed
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Check if token is close to expiration (within 1 hour)
      const now = Math.floor(Date.now() / 1000);
      const tokenExp = decoded.exp;
      const refreshWindow = 3600; // 1 hour in seconds
      
      if (tokenExp - now > refreshWindow) {
        return res.status(400).json({ 
          error: 'Token refresh not needed yet' 
        });
      }
      
      // Get fresh user data to ensure user still exists and is active
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.id)
        .eq('is_active', true)
        .single();

      if (profileError || !profile) {
        return res.status(401).json({ 
          error: 'User not found or inactive' 
        });
      }

      const newToken = generateToken(profile);

      res.json({
        success: true,
        token: newToken
      });

    } catch (jwtError) {
      console.error('Auth: JWT verification failed:', jwtError.message);
      return res.status(401).json({ 
        error: 'Invalid or expired token' 
      });
    }

  } catch (error) {
    console.error('Auth: Token refresh error:', error);
    res.status(500).json({ 
      error: 'Token refresh failed' 
    });
  }
});

export default router;