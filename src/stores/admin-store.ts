import { create } from 'zustand';
import { apiClient } from '@/lib/api/client';

export interface SuperAdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isSuperAdmin: boolean;
  role: string;
}

export interface PlatformOverview {
  financials: {
    totalGrossRevenue: number;
    mrr: number;
    arr: number;
    totalInvoicesAmount: number;
    paidInvoicesAmount: number;
    pendingInvoicesAmount: number;
    overdueInvoicesAmount: number;
  };
  tenants: {
    total: number;
    active: number;
    blocked: number;
    suspended: number;
  };
  websites: {
    totalLive: number;
  };
  planDistribution: Array<{
    id: string;
    name: string;
    slug: string;
    monthlyPrice: number;
    activeSubscribers: number;
    mrrContribution: number;
  }>;
  revenueTrend: Array<{
    month: string;
    revenue: number;
    transactions: number;
  }>;
  recentTransactions: Array<{
    id: string;
    transactionNumber: string;
    tenantName: string;
    tenantSlug: string;
    amount: number;
    currency: string;
    status: string;
    gateway: string;
    paymentMethod: string;
    createdAt: string;
  }>;
}

export interface AdminTenantItem {
  id: string;
  name: string;
  slug: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'BLOCKED';
  blockedReason?: string | null;
  blockedAt?: string | null;
  createdAt: string;
  owner: { name: string; email: string } | null;
  plan: {
    name: string;
    amount: number;
    billingCycle?: string;
    status: string;
  };
  websitesCount: number;
  liveWebsitesCount: number;
  businessesCount: number;
  totalRevenueContributed: number;
}

interface AdminState {
  adminUser: SuperAdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  overview: PlatformOverview | null;
  tenants: AdminTenantItem[];
  tenantsMeta: { total: number; page: number; limit: number; totalPages: number };
  setAdminAuth: (user: SuperAdminUser, token: string) => void;
  clearAdminAuth: () => void;
  fetchAdminProfile: () => Promise<boolean>;
  fetchOverview: () => Promise<void>;
  fetchTenants: (params?: { search?: string; status?: string; page?: number }) => Promise<void>;
  updateTenantStatus: (tenantId: string, status: 'ACTIVE' | 'SUSPENDED' | 'BLOCKED', reason?: string) => Promise<void>;
  logout: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  adminUser: null,
  isAuthenticated: false,
  isLoading: true,
  overview: null,
  tenants: [],
  tenantsMeta: { total: 0, page: 1, limit: 20, totalPages: 1 },

  setAdminAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kdba_admin_token', token);
      localStorage.setItem('kdba_access_token', token);
    }
    set({
      adminUser: user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  clearAdminAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kdba_admin_token');
    }
    set({
      adminUser: null,
      isAuthenticated: false,
      isLoading: false,
      overview: null,
      tenants: [],
    });
  },

  fetchAdminProfile: async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('kdba_admin_token') : null;
      if (!token) {
        set({ adminUser: null, isAuthenticated: false, isLoading: false });
        return false;
      }
      const data: any = await apiClient.get('/admin/auth/me');
      if (data && data.isSuperAdmin) {
        set({
          adminUser: data,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      }
      set({ adminUser: null, isAuthenticated: false, isLoading: false });
      return false;
    } catch {
      set({ adminUser: null, isAuthenticated: false, isLoading: false });
      return false;
    }
  },

  fetchOverview: async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('kdba_admin_token') : null;
      if (!token) return;
      const data: any = await apiClient.get('/admin/overview');
      set({ overview: data });
    } catch (err: any) {
      console.error('Failed to load admin overview:', err?.response?.data || err?.message || err);
    }
  },

  fetchTenants: async (params) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('kdba_admin_token') : null;
      if (!token) return;
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.status) query.append('status', params.status);
      if (params?.page) query.append('page', String(params.page));

      const data: any = await apiClient.get(`/admin/tenants?${query.toString()}`);
      if (data) {
        set({
          tenants: data.items || [],
          tenantsMeta: data.meta || { total: 0, page: 1, limit: 20, totalPages: 1 },
        });
      }
    } catch (err: any) {
      console.error('Failed to load tenants:', err?.response?.data || err?.message || err);
    }
  },

  updateTenantStatus: async (tenantId, status, reason) => {
    await apiClient.patch(`/admin/tenants/${tenantId}/status`, { status, reason });
    // Update local tenant state
    const tenants = get().tenants.map((t) =>
      t.id === tenantId
        ? {
            ...t,
            status,
            blockedReason: reason || null,
            blockedAt: status !== 'ACTIVE' ? new Date().toISOString() : null,
          }
        : t,
    );
    set({ tenants });
    // Refresh overview
    get().fetchOverview();
  },

  logout: () => {
    get().clearAdminAuth();
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
  },
}));
