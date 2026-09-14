import { apiClient } from './client';
import { Website, WebsiteDocument } from '@/types';
import {
  WebsiteDocumentV3,
  DocumentOperationsPayload,
  DocumentOperationsResult,
} from '@/types/v3-document';
import { toEditorDocument, toWireDocument } from '@/lib/document/v3-wire';

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

  // ─── V3 CANONICAL DOCUMENT APIS ─────────────────────────────────────────────

  getDocument: async (id: string): Promise<{
    websiteId: string;
    revision: number;
    schemaVersion: '3.0';
    documentHash: string;
    document: WebsiteDocumentV3;
    updatedAt: string;
  }> => {
    const result = (await apiClient.get(`/websites/${id}/document`)) as {
      websiteId: string;
      revision: number;
      schemaVersion: '3.0';
      documentHash: string;
      document: WebsiteDocumentV3;
      updatedAt: string;
    };
    if (result?.document) {
      return { ...result, document: toEditorDocument(result.document) };
    }
    return result;
  },

  updateDocument: async (
    id: string,
    document: WebsiteDocumentV3,
    baseRevision?: number,
  ): Promise<{
    websiteId: string;
    revision: number;
    schemaVersion: '3.0';
    documentHash: string;
    updatedAt: string;
  }> => {
    return apiClient.put(`/websites/${id}/document`, {
      document: toWireDocument(document),
      expectedRevision: baseRevision,
      baseRevision,
    });
  },

  applyOperations: async (
    id: string,
    payload: DocumentOperationsPayload,
  ): Promise<DocumentOperationsResult> => {
    return apiClient.post(`/websites/${id}/document/operations`, payload);
  },

  getComponentRegistry: async (): Promise<any> => {
    return apiClient.get('/websites/components/registry');
  },

  duplicate: async (id: string, data?: { name?: string; businessId?: string }): Promise<Website> => {
    return apiClient.post(`/websites/${id}/duplicate`, data || {});
  },

  // ─── LEGACY V2 SAVE DRAFT (PRESERVED FOR BACKWARD COMPATIBILITY) ────────────

  saveDraft: async (id: string, document: Partial<WebsiteDocument> | any): Promise<any> => {
    if (document?.schemaVersion === '3.0') {
      return apiClient.put(`/websites/${id}/document`, {
        document: toWireDocument(document),
        baseRevision: document.documentRevision,
      });
    }

    try {
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

      if (Array.isArray(document.pages)) {
        for (const page of document.pages) {
          if (Array.isArray(page.sections)) {
            for (let idx = 0; idx < page.sections.length; idx++) {
              const section = page.sections[idx];
              const config = section.props || section.draftConfig || section.config || {};
              const isLocalId = section.id && (section.id.startsWith('sec_') || !section.id.includes('-'));

              if (isLocalId) {
                try {
                  const created: any = await apiClient.post('/sections', {
                    pageId: page.id,
                    type: (section.type || '').toUpperCase(),
                    title: section.title || section.type,
                    variant: section.variant || 'default',
                    config,
                    sortOrder: idx,
                  });
                  if (created?.id) section.id = created.id;
                } catch (e: any) {
                  console.warn('Section creation warning:', e?.response?.data || e?.message);
                }
              } else if (section.id) {
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

  publish: async (id: string): Promise<{ success: boolean; publishedAt: string; versionId?: string }> => {
    return apiClient.post(`/websites/${id}/publish`, {});
  },

  unpublish: async (id: string): Promise<void> => {
    return apiClient.post(`/websites/${id}/unpublish`, {});
  },
};
