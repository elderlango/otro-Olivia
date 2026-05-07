import { create } from 'zustand';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

// Mock user for development
const MOCK_USER: User = {
  id: '1',
  email: 'admin@tienda.com',
  name: 'Administrador',
  role: 'admin',
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation - in production this would call Supabase
    if (email && password) {
      set({ user: MOCK_USER, isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false });
      throw new Error('Credenciales invalidas');
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },
}));
