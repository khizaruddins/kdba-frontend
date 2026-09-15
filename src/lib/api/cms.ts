import { apiClient } from './client';
import {
  CmsBusinessProfile,
  CmsCatalog,
  CmsCollection,
  CmsCollectionField,
  CmsCollectionSettings,
  CmsRecord,
  CmsRecordStatus,
  CmsRecordsPage,
} from '@/types/cms';

function base(websiteId: string) {
  return `/websites/${websiteId}/cms`;
}

export const cmsApi = {
  catalog: async (websiteId: string): Promise<CmsCatalog> => {
    return apiClient.get(`${base(websiteId)}/catalog`);
  },

  bootstrap: async (websiteId: string): Promise<{ collections: CmsCollection[] }> => {
    return apiClient.post(`${base(websiteId)}/bootstrap`, {});
  },

  listCollections: async (websiteId: string): Promise<CmsCollection[]> => {
    const data = await apiClient.get(`${base(websiteId)}/collections`);
    return Array.isArray(data) ? data : [];
  },

  createCollection: async (
    websiteId: string,
    body: {
      name: string;
      slug?: string;
      description?: string;
      preset?: string;
      fields?: CmsCollectionField[];
      settings?: Partial<CmsCollectionSettings>;
    },
  ): Promise<CmsCollection> => {
    return apiClient.post(`${base(websiteId)}/collections`, body);
  },

  getCollection: async (websiteId: string, collectionId: string): Promise<CmsCollection> => {
    return apiClient.get(`${base(websiteId)}/collections/${collectionId}`);
  },

  updateCollection: async (
    websiteId: string,
    collectionId: string,
    body: {
      name?: string;
      slug?: string;
      description?: string;
      fields?: CmsCollectionField[];
      settings?: Partial<CmsCollectionSettings>;
    },
  ): Promise<CmsCollection> => {
    return apiClient.patch(`${base(websiteId)}/collections/${collectionId}`, body);
  },

  deleteCollection: async (websiteId: string, collectionId: string): Promise<void> => {
    await apiClient.delete(`${base(websiteId)}/collections/${collectionId}`);
  },

  listRecords: async (
    websiteId: string,
    collectionId: string,
    params?: {
      q?: string;
      status?: CmsRecordStatus;
      page?: number;
      pageSize?: number;
      sort?: string;
      order?: 'asc' | 'desc';
      filters?: string;
    },
  ): Promise<CmsRecordsPage> => {
    const result = (await apiClient.get(`${base(websiteId)}/collections/${collectionId}/records`, {
      params,
    })) as unknown;
    if (result && typeof result === 'object' && Array.isArray((result as CmsRecordsPage).data)) {
      return result as CmsRecordsPage;
    }
    return {
      data: Array.isArray(result) ? result : [],
      meta: { total: 0, page: 1, pageSize: 20, totalPages: 1 },
    };
  },

  createRecord: async (
    websiteId: string,
    collectionId: string,
    body: {
      data: Record<string, unknown>;
      slug?: string;
      status?: CmsRecordStatus;
      sortOrder?: number;
    },
  ): Promise<CmsRecord> => {
    return apiClient.post(`${base(websiteId)}/collections/${collectionId}/records`, body);
  },

  getRecord: async (
    websiteId: string,
    collectionId: string,
    recordId: string,
  ): Promise<CmsRecord> => {
    return apiClient.get(`${base(websiteId)}/collections/${collectionId}/records/${recordId}`);
  },

  updateRecord: async (
    websiteId: string,
    collectionId: string,
    recordId: string,
    body: {
      data?: Record<string, unknown>;
      slug?: string;
      status?: CmsRecordStatus;
      sortOrder?: number;
    },
  ): Promise<CmsRecord> => {
    return apiClient.patch(
      `${base(websiteId)}/collections/${collectionId}/records/${recordId}`,
      body,
    );
  },

  deleteRecord: async (
    websiteId: string,
    collectionId: string,
    recordId: string,
  ): Promise<void> => {
    await apiClient.delete(`${base(websiteId)}/collections/${collectionId}/records/${recordId}`);
  },

  getBusinessProfile: async (websiteId: string): Promise<CmsBusinessProfile> => {
    return apiClient.get(`${base(websiteId)}/business-profile`);
  },

  updateBusinessProfile: async (
    websiteId: string,
    body: Partial<CmsBusinessProfile>,
  ): Promise<CmsBusinessProfile> => {
    return apiClient.patch(`${base(websiteId)}/business-profile`, body);
  },

  listPublicRecords: async (
    siteSlug: string,
    collectionSlug: string,
    params?: { page?: number; pageSize?: number; q?: string },
  ): Promise<CmsRecordsPage> => {
    const result = (await apiClient.get(`/public/sites/${siteSlug}/cms/${collectionSlug}`, {
      params,
    })) as unknown;
    if (result && typeof result === 'object' && Array.isArray((result as CmsRecordsPage).data)) {
      return result as CmsRecordsPage;
    }
    return {
      data: Array.isArray(result) ? result : [],
      meta: { total: 0, page: 1, pageSize: 20, totalPages: 1 },
    };
  },

  getPublicRecord: async (
    siteSlug: string,
    collectionSlug: string,
    recordSlug: string,
  ): Promise<{ collection: { slug: string }; record: CmsRecord; media?: Record<string, { url: string }> }> => {
    return apiClient.get(`/public/sites/${siteSlug}/cms/${collectionSlug}/${recordSlug}`);
  },
};
