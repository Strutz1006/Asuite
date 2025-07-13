import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Authentication middleware
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Get fresh user data from database to ensure user still exists and is active
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, full_name, role, organization_id, is_active')
        .eq('id', decoded.id)
        .eq('is_active', true)
        .single();

      if (error || !user) {
        return res.status(401).json({ 
          error: 'Invalid token or user not found' 
        });
      }

      // Attach user info to request object
      req.user = user;
      next();

    } catch (jwtError) {
      console.error('Auth middleware: JWT verification failed:', jwtError);
      return res.status(401).json({ 
        error: 'Invalid token' 
      });
    }

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      details: error.message 
    });
  }
};

// Role-based authorization middleware
export const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions' 
      });
    }

    next();
  };
};

// Organization-based authorization middleware
export const requireOrganization = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required' 
    });
  }

  if (!req.user.organization_id) {
    return res.status(403).json({ 
      error: 'Organization access required' 
    });
  }

  next();
};

// Optional authentication (for public endpoints that can benefit from user context)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, full_name, role, organization_id, is_active')
        .eq('id', decoded.id)
        .eq('is_active', true)
        .single();

      req.user = error || !user ? null : user;

    } catch (jwtError) {
      req.user = null;
    }

    next();

  } catch (error) {
    console.error('Optional auth middleware error:', error);
    req.user = null;
    next();
  }
};