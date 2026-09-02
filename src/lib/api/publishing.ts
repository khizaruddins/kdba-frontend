import { apiClient } from './client';
import { PublicWebsiteResponse } from '@/types';

export const publishingApi = {
  getPublicSite: async (tenantSlug: string): Promise<PublicWebsiteResponse | null> => {
    return apiClient.get(`/public/sites/${tenantSlug}`);
  },

  publishWebsite: async (websiteId: string): Promise<{ success: boolean; publishedAt: string }> => {
    return apiClient.post(`/websites/${websiteId}/publish`, {});
  },
};
