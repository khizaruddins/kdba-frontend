import { create } from 'zustand';
import { User, Tenant } from '@/types';
import { apiClient } from '@/lib/api/client';

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, tenant: Tenant, token: string, role?: string) => void;
  clearAuth: () => void;
  fetchProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tenant: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, tenant, token, role = 'OWNER') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kdba_access_token', token);
    }
    set({
      user,
      tenant,
      role,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kdba_access_token');
    }
    set({
      user: null,
      tenant: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  fetchProfile: async () => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('kdba_access_token')
        : null;
    if (!token) {
      set({
        user: null,
        tenant: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    try {
      const data: any = await apiClient.get('/auth/me');
      if (data && data.user) {
        set({
          user: data.user,
          tenant: data.tenant,
          role: data.role,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          tenant: null,
          role: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch {
      set({
        user: null,
        tenant: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore errors on logout
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('kdba_access_token');
      }
      set({
        user: null,
        tenant: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
