import { apiClient } from './client';
import { Website, WebsiteDocument } from '@/types';

export const websitesApi = {
  getById: async (id: string): Promise<Website> => {
    return apiClient.get(`/websites/${id}`);
  },

  getAll: async (): Promise<Website[]> => {
    return apiClient.get('/websites');
  },

  create: async (data: {
    businessId: string;
    templateId?: string;
    name: string;
    slug?: string;
  }): Promise<Website> => {
    return apiClient.post('/websites', data);
  },

  update: async (id: string, data: Partial<WebsiteDocument> | Record<string, any>): Promise<Website> => {
    const websitePayload: Record<string, any> = {};
    if (data.name) websitePayload.name = data.name;
    if (data.theme) websitePayload.theme = data.theme;
    if (data.seoTitle !== undefined) websitePayload.seoTitle = data.seoTitle;
    if (data.seoDescription !== undefined) websitePayload.seoDescription = data.seoDescription;
    if (data.favicon !== undefined) websitePayload.favicon = data.favicon;

    return apiClient.patch(`/websites/${id}`, Object.keys(websitePayload).length > 0 ? websitePayload : data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/websites/${id}`);
  },

  saveDraft: async (id: string, document: Partial<WebsiteDocument> | any): Promise<any> => {
    try {
      // 1. Update Website-level properties (theme, seo, name)
      const websitePayload: Record<string, any> = {};
      if (document.name) websitePayload.name = document.name;
      if (document.theme) websitePayload.theme = document.theme;
      if (document.seoTitle !== undefined) websitePayload.seoTitle = document.seoTitle;
      if (document.seoDescription !== undefined) websitePayload.seoDescription = document.seoDescription;
      if (document.favicon !== undefined) websitePayload.favicon = document.favicon;

      let websiteRes = null;
      if (Object.keys(websitePayload).length > 0) {
        websiteRes = await apiClient.patch(`/websites/${id}`, websitePayload).catch((err) => {
          console.warn('Website patch warning:', err?.response?.data || err?.message);
          return null;
        });
      }

      // 2. Persist sections (new or modified)
      if (Array.isArray(document.pages)) {
        for (const page of document.pages) {
          if (Array.isArray(page.sections)) {
            for (let idx = 0; idx < page.sections.length; idx++) {
              const section = page.sections[idx];
              const config = section.props || section.draftConfig || section.config || {};
              const isLocalId = section.id && (section.id.startsWith('sec_') || !section.id.includes('-'));

              if (isLocalId) {
                // Post new section to backend
                try {
                  const created: any = await apiClient.post('/sections', {
                    pageId: page.id,
                    type: (section.type || '').toUpperCase(),
                    title: section.title || section.type,
                    variant: section.variant || 'default',
                    config,
                    sortOrder: idx,
                  });
                  if (created?.id) {
                    section.id = created.id;
                  }
                } catch (e: any) {
                  // Fallback if backend /sections endpoint has different schema
                  console.warn('Section creation warning:', e?.response?.data || e?.message);
                }
              } else if (section.id) {
                // Patch existing section
                try {
                  await apiClient.patch(`/sections/${section.id}`, {
                    title: section.title,
                    variant: section.variant,
                    config,
                    sortOrder: idx,
                    enabled: section.enabled !== false,
                  });
                } catch (e: any) {
                  console.warn('Section patch warning:', e?.response?.data || e?.message);
                }
              }
            }
          }
        }
      }

      return websiteRes;
    } catch (err: any) {
      console.error('Save draft error details:', err?.response?.data || err?.message || err);
      throw err;
    }
  },

  publish: async (id: string): Promise<{ success: boolean; publishedAt: string }> => {
    return apiClient.post(`/websites/${id}/publish`, {});
  },

  unpublish: async (id: string): Promise<void> => {
    return apiClient.post(`/websites/${id}/unpublish`, {});
  },
};
