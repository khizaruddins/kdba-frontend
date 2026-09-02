import { apiClient } from './client';
import { MediaItem } from '@/types';

export const mediaApi = {
  getAll: async (): Promise<MediaItem[]> => {
    try {
      const data: any = await apiClient.get('/media');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  upload: async (file: File): Promise<MediaItem> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/media/${id}`);
  },
};
