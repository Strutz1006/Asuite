// import { useContext } from 'react'; // TODO: Implement when AuthContext is ready
import { RBACService } from '@aesyros/auth';
import type { Resource, Action, User } from '@aesyros/types';

// Mock context for now - in a real app this would come from AuthContext
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access',
    isSystemRole: true,
    permissions: [
      { id: 'admin-all', resource: 'admin', action: 'admin' },
      { id: 'scenarios-create', resource: 'scenarios', action: 'create' },
      { id: 'scenarios-read', resource: 'scenarios', action: 'read' },
      { id: 'scenarios-update', resource: 'scenarios', action: 'update' },
      { id: 'scenarios-delete', resource: 'scenarios', action: 'delete' },
      { id: 'insights-read', resource: 'insights', action: 'read' },
      { id: 'natural-language-execute', resource: 'natural-language', action: 'execute' },
      { id: 'recommendations-read', resource: 'recommendations', action: 'read' },
      { id: 'sensitivity-analysis-execute', resource: 'sensitivity-analysis', action: 'execute' },
      { id: 'batch-runs-execute', resource: 'batch-runs', action: 'execute' },
      { id: 'collaboration-share', resource: 'collaboration', action: 'share' },
      { id: 'versioning-read', resource: 'versioning', action: 'read' },
    ]
  },
  permissions: []
};

export const useRBAC = () => {
  // In a real app, this would come from AuthContext
  const user = mockUser;

  const hasPermission = (resource: Resource, action: Action, context?: any): boolean => {
    return RBACService.hasPermission(user, resource, action, context);
  };

  const hasRole = (roleName: string): boolean => {
    return RBACService.hasRole(user, roleName);
  };

  const canAccess = (feature: string): boolean => {
    switch (feature) {
      case 'scenarios':
        return hasPermission('scenarios', 'read');
      case 'create-scenario':
        return hasPermission('scenarios', 'create');
      case 'edit-scenario':
        return hasPermission('scenarios', 'update');
      case 'delete-scenario':
        return hasPermission('scenarios', 'delete');
      case 'insights':
        return hasPermission('insights', 'read');
      case 'natural-language':
        return hasPermission('natural-language', 'execute');
      case 'recommendations':
        return hasPermission('recommendations', 'read');
      case 'sensitivity-analysis':
        return hasPermission('sensitivity-analysis', 'execute');
      case 'batch-runs':
        return hasPermission('batch-runs', 'execute');
      case 'collaboration':
        return hasPermission('collaboration', 'share');
      case 'versioning':
        return hasPermission('versioning', 'read');
      case 'admin':
        return hasPermission('admin', 'admin');
      default:
        return false;
    }
  };

  return {
    user,
    hasPermission,
    hasRole,
    canAccess,
    isAdmin: hasRole('Administrator'),
    isAnalyst: hasRole('Analyst'),
    isViewer: hasRole('Viewer')
  };
};