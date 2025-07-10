xport interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Mock auth functions for now
export const mockAuth = {
  login: async (email: string, password: string): Promise<User> => {
    // Mock implementation
    return {
      id: '1',
      name: 'John Doe',
      email,
      role: 'admin' as const
    };
  },
  logout: () => {
    // Mock implementation
  }
};

import type { User } from '@aesyros/types';
