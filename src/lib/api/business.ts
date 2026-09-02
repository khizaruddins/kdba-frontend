import { apiClient } from './client';
import { Business } from '@/types';

export const businessApi = {
  getAll: async (): Promise<Business[]> => {
    try {
      const data: any = await apiClient.get('/businesses');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  getById: async (id: string): Promise<Business> => {
    return apiClient.get(`/businesses/${id}`);
  },

  create: async (data: Partial<Business>): Promise<Business> => {
    return apiClient.post('/businesses', data);
  },

  update: async (id: string, data: Partial<Business>): Promise<Business> => {
    return apiClient.patch(`/businesses/${id}`, data);
  },
};
