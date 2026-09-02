import { apiClient } from './client';
import { Template } from '@/types';

export const templatesApi = {
  getAll: async (): Promise<Template[]> => {
    try {
      const data: any = await apiClient.get('/templates');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  getById: async (id: string): Promise<Template | null> => {
    try {
      return await apiClient.get(`/templates/${id}`);
    } catch {
      return null;
    }
  },
};
