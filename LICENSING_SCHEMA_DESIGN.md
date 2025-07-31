# Aesyros Suite Licensing System Design

## Overview
A flexible, suite-wide licensing system that supports multiple licensing models and package bundles.

## Database Schema

### 1. License Plans Table
```sql
CREATE TABLE license_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- e.g., "Align Pro", "Drive + Align Bundle", "Enterprise Suite"
  slug TEXT UNIQUE NOT NULL, -- e.g., "align-pro", "drive-align-bundle"
  description TEXT,
  pricing_model TEXT NOT NULL CHECK (pricing_model IN ('per_user', 'organization', 'usage_based')),
  price_per_unit DECIMAL(10,2), -- Price per user/month or org/month
  currency TEXT DEFAULT 'USD',
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'yearly', 'one_time')),
  max_users INTEGER, -- NULL for unlimited
  included_apps TEXT[] NOT NULL, -- ['align', 'drive', 'pulse', 'catalyst', 'flow', 'foresight']
  features JSONB, -- Feature flags and limits
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Organization Licenses Table
```sql
CREATE TABLE organization_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  license_plan_id UUID NOT NULL REFERENCES license_plans(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'suspended', 'trial')),
  trial_ends_at TIMESTAMPTZ,
  subscription_starts_at TIMESTAMPTZ,
  subscription_ends_at TIMESTAMPTZ,
  current_user_count INTEGER DEFAULT 0,
  max_users INTEGER, -- Can override plan default
  billing_contact_email TEXT,
  payment_provider TEXT, -- 'stripe', 'manual', etc.
  external_subscription_id TEXT, -- Stripe subscription ID, etc.
  metadata JSONB, -- Additional billing/payment data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(organization_id) -- One license per organization
);
```

### 3. App Access Control Table
```sql
CREATE TABLE organization_app_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL CHECK (app_name IN ('align', 'drive', 'pulse', 'catalyst', 'flow', 'foresight')),
  is_enabled BOOLEAN DEFAULT true,
  feature_limits JSONB, -- App-specific feature limits
  usage_stats JSONB, -- Track usage for reporting
  enabled_at TIMESTAMPTZ DEFAULT NOW(),
  disabled_at TIMESTAMPTZ,
  
  UNIQUE(organization_id, app_name)
);
```

### 4. User License Assignments (for per-user licenses)
```sql
CREATE TABLE user_license_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_apps TEXT[] NOT NULL, -- Which apps this user can access
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id),
  
  UNIQUE(organization_id, user_id)
);
```

## Licensing Models Supported

### 1. Per-User Licensing
- **Example**: Align Pro - $15/user/month
- **Logic**: Track active users, enforce user limits
- **Apps**: Single app or bundle

### 2. Organization-Wide Licensing  
- **Example**: Enterprise Suite - $500/org/month (unlimited users)
- **Logic**: Unlimited users, all apps enabled
- **Apps**: Usually full suite

### 3. Bundle Licensing
- **Example**: Drive + Align Bundle - $25/user/month for both apps
- **Logic**: Specific app combinations at discounted rates
- **Apps**: Multiple specific apps

### 4. Trial Licensing
- **Example**: 14-day free trial of any plan
- **Logic**: Time-limited access with full features
- **Apps**: Based on trial plan

## Implementation Strategy

### Phase 1: Core Infrastructure
1. Create database tables and types
2. Create licensing validation hooks
3. Add license checks to user creation
4. Basic license status display

### Phase 2: Enforcement
1. App-level access control
2. Feature-level limitations
3. Usage tracking and reporting
4. License upgrade/downgrade flows

### Phase 3: Management
1. Admin license management UI
2. Self-service license upgrades
3. Billing integration (Stripe)
4. Usage analytics and alerts

## Key Benefits

1. **Flexible Pricing**: Support any pricing model
2. **Bundle Support**: Easy to create app bundles
3. **Scalable**: Works from startup to enterprise
4. **Suite-Wide**: Consistent licensing across all apps
5. **Future-Proof**: Easy to add new apps and pricing models

## Example License Plans

```javascript
// Align Only - Per User
{
  name: "Align Professional",
  pricing_model: "per_user",
  price_per_unit: 15.00,
  max_users: null, // unlimited
  included_apps: ["align"],
  features: {
    goals_per_user: 50,
    objectives_per_org: 20,
    integrations: ["slack", "teams"]
  }
}

// Drive + Align Bundle
{
  name: "Productivity Bundle", 
  pricing_model: "per_user",
  price_per_unit: 25.00,
  included_apps: ["drive", "align"],
  features: {
    storage_gb: 100,
    goals_per_user: 100,
    projects_per_user: 25
  }
}

// Enterprise Suite
{
  name: "Enterprise Suite",
  pricing_model: "organization", 
  price_per_unit: 500.00,
  included_apps: ["align", "drive", "pulse", "catalyst", "flow", "foresight"],
  features: {
    unlimited: true,
    sso: true,
    advanced_analytics: true
  }
}
```