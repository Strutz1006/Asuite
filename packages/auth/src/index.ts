import type { User, Role, Resource, Action, PermissionCondition } from '@aesyros/types';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (resource: Resource, action: Action, context?: any) => boolean;
  hasRole: (roleName: string) => boolean;
}

export class RBACService {
  static hasPermission(user: User | null, resource: Resource, action: Action, context?: any): boolean {
    if (!user) return false;
    
    // Check direct permissions
    const hasDirectPermission = user.permissions.some(permission => 
      permission.resource === resource && 
      permission.action === action &&
      this.evaluateConditions(permission.conditions, context)
    );
    
    if (hasDirectPermission) return true;
    
    // Check role-based permissions
    const hasRolePermission = user.role.permissions.some(permission => 
      permission.resource === resource && 
      permission.action === action &&
      this.evaluateConditions(permission.conditions, context)
    );
    
    return hasRolePermission;
  }
  
  static hasRole(user: User | null, roleName: string): boolean {
    return user?.role.name === roleName;
  }
  
  private static evaluateConditions(conditions?: PermissionCondition[], context?: any): boolean {
    if (!conditions || conditions.length === 0) return true;
    if (!context) return false;
    
    return conditions.every(condition => {
      const contextValue = context[condition.field];
      
      switch (condition.operator) {
        case 'eq': return contextValue === condition.value;
        case 'neq': return contextValue !== condition.value;
        case 'in': return Array.isArray(condition.value) && condition.value.includes(contextValue);
        case 'not_in': return Array.isArray(condition.value) && !condition.value.includes(contextValue);
        case 'gt': return contextValue > condition.value;
        case 'lt': return contextValue < condition.value;
        case 'gte': return contextValue >= condition.value;
        case 'lte': return contextValue <= condition.value;
        default: return false;
      }
    });
  }
}

// Default roles
export const DEFAULT_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access',
    isSystemRole: true,
    permissions: [
      { id: 'admin-all', resource: 'admin', action: 'admin' },
      { id: 'scenarios-all', resource: 'scenarios', action: 'create' },
      { id: 'scenarios-read', resource: 'scenarios', action: 'read' },
      { id: 'scenarios-update', resource: 'scenarios', action: 'update' },
      { id: 'scenarios-delete', resource: 'scenarios', action: 'delete' },
      { id: 'insights-all', resource: 'insights', action: 'read' },
      { id: 'natural-language-all', resource: 'natural-language', action: 'execute' },
      { id: 'recommendations-all', resource: 'recommendations', action: 'read' },
      { id: 'sensitivity-analysis-all', resource: 'sensitivity-analysis', action: 'execute' },
      { id: 'batch-runs-all', resource: 'batch-runs', action: 'execute' },
      { id: 'collaboration-all', resource: 'collaboration', action: 'share' },
      { id: 'versioning-all', resource: 'versioning', action: 'read' },
    ]
  },
  {
    id: 'analyst',
    name: 'Analyst',
    description: 'Can create and analyze scenarios',
    isSystemRole: true,
    permissions: [
      { id: 'scenarios-create', resource: 'scenarios', action: 'create' },
      { id: 'scenarios-read', resource: 'scenarios', action: 'read' },
      { id: 'scenarios-update', resource: 'scenarios', action: 'update' },
      { id: 'insights-read', resource: 'insights', action: 'read' },
      { id: 'natural-language-execute', resource: 'natural-language', action: 'execute' },
      { id: 'recommendations-read', resource: 'recommendations', action: 'read' },
      { id: 'sensitivity-analysis-execute', resource: 'sensitivity-analysis', action: 'execute' },
      { id: 'batch-runs-execute', resource: 'batch-runs', action: 'execute' },
      { id: 'versioning-read', resource: 'versioning', action: 'read' },
    ]
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access',
    isSystemRole: true,
    permissions: [
      { id: 'scenarios-read', resource: 'scenarios', action: 'read' },
      { id: 'insights-read', resource: 'insights', action: 'read' },
      { id: 'recommendations-read', resource: 'recommendations', action: 'read' },
      { id: 'versioning-read', resource: 'versioning', action: 'read' },
    ]
  }
];

// Mock auth functions
export const mockAuth = {
  login: async (email: string, _password: string): Promise<User> => {
    // Mock implementation - return admin role
    const adminRole = DEFAULT_ROLES.find(r => r.id === 'admin')!;
    return {
      id: '1',
      name: 'John Doe',
      email,
      role: adminRole,
      permissions: []
    };
  },
  logout: () => {
    // Mock implementation
  }
};
