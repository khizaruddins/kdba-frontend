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

// ─── DEDICATED CMS POSTS API ────────────────────────────────────────────────

export const cmsPostsApi = {
  list: async (
    websiteId: string,
    params?: {
      q?: string;
      status?: string;
      authorId?: string;
      categoryId?: string;
      tagId?: string;
      page?: number;
      limit?: number;
      sort?: string;
      order?: 'asc' | 'desc';
    },
  ): Promise<{ data: import('@/types/cms').CmsPost[]; meta: { total: number; page: number; limit: number; totalPages: number } }> => {
    const res = await apiClient.get(`${base(websiteId)}/posts`, { params });
    if (res && Array.isArray((res as any).data)) {
      return res as any;
    }
    return {
      data: Array.isArray(res) ? (res as any) : [],
      meta: { total: Array.isArray(res) ? res.length : 0, page: 1, limit: 50, totalPages: 1 },
    };
  },

  get: async (websiteId: string, idOrSlug: string): Promise<import('@/types/cms').CmsPost> => {
    return apiClient.get(`${base(websiteId)}/posts/${idOrSlug}`);
  },

  create: async (
    websiteId: string,
    body: {
      title: string;
      slug?: string;
      excerpt?: string;
      content: string;
      featuredImage?: string;
      status?: string;
      publishedAt?: string;
      scheduledAt?: string;
      authorId?: string;
      categoryIds?: string[];
      tagIds?: string[];
      seoTitle?: string;
      seoDescription?: string;
      canonicalUrl?: string;
      ogImage?: string;
      twitterCard?: string;
    },
  ): Promise<import('@/types/cms').CmsPost> => {
    return apiClient.post(`${base(websiteId)}/posts`, body);
  },

  update: async (
    websiteId: string,
    id: string,
    body: Partial<{
      title: string;
      slug: string;
      excerpt: string;
      content: string;
      featuredImage: string;
      status: string;
      publishedAt: string;
      scheduledAt: string;
      authorId: string;
      categoryIds: string[];
      tagIds: string[];
      seoTitle: string;
      seoDescription: string;
      canonicalUrl: string;
      ogImage: string;
      twitterCard: string;
    }>,
  ): Promise<import('@/types/cms').CmsPost> => {
    return apiClient.patch(`${base(websiteId)}/posts/${id}`, body);
  },

  publish: async (websiteId: string, id: string): Promise<import('@/types/cms').CmsPost> => {
    return apiClient.post(`${base(websiteId)}/posts/${id}/publish`, {});
  },

  unpublish: async (websiteId: string, id: string): Promise<import('@/types/cms').CmsPost> => {
    return apiClient.post(`${base(websiteId)}/posts/${id}/unpublish`, {});
  },

  archive: async (websiteId: string, id: string): Promise<import('@/types/cms').CmsPost> => {
    return apiClient.post(`${base(websiteId)}/posts/${id}/archive`, {});
  },

  delete: async (websiteId: string, id: string): Promise<void> => {
    await apiClient.delete(`${base(websiteId)}/posts/${id}`);
  },
};

// ─── DEDICATED CMS AUTHORS API ──────────────────────────────────────────────

export const cmsAuthorsApi = {
  list: async (
    websiteId: string,
    params?: { q?: string; isActive?: boolean },
  ): Promise<import('@/types/cms').CmsAuthor[]> => {
    const res = await apiClient.get(`${base(websiteId)}/authors`, { params });
    return Array.isArray(res) ? res : [];
  },

  get: async (websiteId: string, idOrSlug: string): Promise<import('@/types/cms').CmsAuthor> => {
    return apiClient.get(`${base(websiteId)}/authors/${idOrSlug}`);
  },

  create: async (
    websiteId: string,
    body: {
      name: string;
      slug?: string;
      avatarUrl?: string;
      bio?: string;
      socialLinks?: Record<string, string>;
      isActive?: boolean;
    },
  ): Promise<import('@/types/cms').CmsAuthor> => {
    return apiClient.post(`${base(websiteId)}/authors`, body);
  },

  update: async (
    websiteId: string,
    id: string,
    body: Partial<{
      name: string;
      slug: string;
      avatarUrl: string;
      bio: string;
      socialLinks: Record<string, string>;
      isActive: boolean;
    }>,
  ): Promise<import('@/types/cms').CmsAuthor> => {
    return apiClient.patch(`${base(websiteId)}/authors/${id}`, body);
  },

  delete: async (websiteId: string, id: string): Promise<void> => {
    await apiClient.delete(`${base(websiteId)}/authors/${id}`);
  },
};

// ─── DEDICATED CMS CATEGORIES API ───────────────────────────────────────────

export const cmsCategoriesApi = {
  list: async (websiteId: string): Promise<import('@/types/cms').CmsCategory[]> => {
    const res = await apiClient.get(`${base(websiteId)}/categories`);
    return Array.isArray(res) ? res : [];
  },

  get: async (websiteId: string, idOrSlug: string): Promise<import('@/types/cms').CmsCategory> => {
    return apiClient.get(`${base(websiteId)}/categories/${idOrSlug}`);
  },

  create: async (
    websiteId: string,
    body: {
      name: string;
      slug?: string;
      description?: string;
      parentId?: string;
      sortOrder?: number;
    },
  ): Promise<import('@/types/cms').CmsCategory> => {
    return apiClient.post(`${base(websiteId)}/categories`, body);
  },

  update: async (
    websiteId: string,
    id: string,
    body: Partial<{
      name: string;
      slug: string;
      description: string;
      parentId: string | null;
      sortOrder: number;
    }>,
  ): Promise<import('@/types/cms').CmsCategory> => {
    return apiClient.patch(`${base(websiteId)}/categories/${id}`, body);
  },

  delete: async (websiteId: string, id: string): Promise<void> => {
    await apiClient.delete(`${base(websiteId)}/categories/${id}`);
  },
};

// ─── DEDICATED CMS TAGS API ─────────────────────────────────────────────────

export const cmsTagsApi = {
  list: async (websiteId: string): Promise<import('@/types/cms').CmsTag[]> => {
    const res = await apiClient.get(`${base(websiteId)}/tags`);
    return Array.isArray(res) ? res : [];
  },

  get: async (websiteId: string, idOrSlug: string): Promise<import('@/types/cms').CmsTag> => {
    return apiClient.get(`${base(websiteId)}/tags/${idOrSlug}`);
  },

  create: async (
    websiteId: string,
    body: { name: string; slug?: string },
  ): Promise<import('@/types/cms').CmsTag> => {
    return apiClient.post(`${base(websiteId)}/tags`, body);
  },

  update: async (
    websiteId: string,
    id: string,
    body: Partial<{ name: string; slug: string }>,
  ): Promise<import('@/types/cms').CmsTag> => {
    return apiClient.patch(`${base(websiteId)}/tags/${id}`, body);
  },

  delete: async (websiteId: string, id: string): Promise<void> => {
    await apiClient.delete(`${base(websiteId)}/tags/${id}`);
  },
};

// ─── DEDICATED CMS FORMS API ────────────────────────────────────────────────

export const cmsFormsApi = {
  list: async (websiteId: string): Promise<import('@/types/cms').CmsForm[]> => {
    const res = await apiClient.get(`${base(websiteId)}/forms`);
    return Array.isArray(res) ? res : [];
  },

  get: async (websiteId: string, idOrSlug: string): Promise<import('@/types/cms').CmsForm> => {
    return apiClient.get(`${base(websiteId)}/forms/${idOrSlug}`);
  },

  create: async (
    websiteId: string,
    body: {
      name: string;
      slug: string;
      title?: string;
      description?: string;
      fields: any[];
      settings?: Record<string, any>;
      isActive?: boolean;
    },
  ): Promise<import('@/types/cms').CmsForm> => {
    return apiClient.post(`${base(websiteId)}/forms`, body);
  },

  update: async (
    websiteId: string,
    id: string,
    body: Partial<{
      name: string;
      slug: string;
      title: string;
      description: string;
      fields: any[];
      settings: Record<string, any>;
      isActive: boolean;
    }>,
  ): Promise<import('@/types/cms').CmsForm> => {
    return apiClient.patch(`${base(websiteId)}/forms/${id}`, body);
  },

  delete: async (websiteId: string, id: string): Promise<void> => {
    await apiClient.delete(`${base(websiteId)}/forms/${id}`);
  },

  listSubmissions: async (
    websiteId: string,
    formId: string,
    params?: { status?: string; page?: number; limit?: number },
  ): Promise<{ data: import('@/types/cms').CmsFormSubmission[]; meta: { total: number; page: number; limit: number; totalPages: number } }> => {
    const res = await apiClient.get(`${base(websiteId)}/forms/${formId}/submissions`, { params });
    if (res && Array.isArray((res as any).data)) {
      return res as any;
    }
    return {
      data: Array.isArray(res) ? (res as any) : [],
      meta: { total: Array.isArray(res) ? res.length : 0, page: 1, limit: 50, totalPages: 1 },
    };
  },

  updateSubmissionStatus: async (
    websiteId: string,
    formId: string,
    submissionId: string,
    status: 'UNREAD' | 'READ' | 'ARCHIVED' | 'SPAM',
  ): Promise<import('@/types/cms').CmsFormSubmission> => {
    return apiClient.patch(
      `${base(websiteId)}/forms/${formId}/submissions/${submissionId}/status`,
      { status },
    );
  },

  deleteSubmission: async (
    websiteId: string,
    formId: string,
    submissionId: string,
  ): Promise<void> => {
    await apiClient.delete(`${base(websiteId)}/forms/${formId}/submissions/${submissionId}`);
  },
};

// ─── DEDICATED CMS NAVIGATION API ───────────────────────────────────────────

export const cmsNavigationApi = {
  list: async (websiteId: string): Promise<import('@/types/cms').CmsNavigation[]> => {
    const res = await apiClient.get(`${base(websiteId)}/navigation`);
    return Array.isArray(res) ? res : [];
  },

  get: async (websiteId: string, keyOrId: string): Promise<import('@/types/cms').CmsNavigation> => {
    return apiClient.get(`${base(websiteId)}/navigation/${keyOrId}`);
  },

  create: async (
    websiteId: string,
    body: { name: string; key: string; items: any[] },
  ): Promise<import('@/types/cms').CmsNavigation> => {
    return apiClient.post(`${base(websiteId)}/navigation`, body);
  },

  update: async (
    websiteId: string,
    keyOrId: string,
    body: { name?: string; items?: any[] },
  ): Promise<import('@/types/cms').CmsNavigation> => {
    return apiClient.patch(`${base(websiteId)}/navigation/${keyOrId}`, body);
  },

  delete: async (websiteId: string, keyOrId: string): Promise<void> => {
    await apiClient.delete(`${base(websiteId)}/navigation/${keyOrId}`);
  },
};

// ─── DEDICATED CMS SITE SETTINGS API ────────────────────────────────────────

export const cmsSiteSettingsApi = {
  get: async (websiteId: string): Promise<import('@/types/cms').CmsSiteSettings> => {
    return apiClient.get(`${base(websiteId)}/settings`);
  },

  update: async (
    websiteId: string,
    body: {
      business?: Record<string, unknown>;
      social?: Record<string, unknown>;
      general?: Record<string, unknown>;
      seo?: Record<string, unknown>;
    },
  ): Promise<import('@/types/cms').CmsSiteSettings> => {
    return apiClient.patch(`${base(websiteId)}/settings`, body);
  },
};

// ─── PUBLIC CMS API (VISITOR ENDPOINTS) ──────────────────────────────────────

export const publicCmsApi = {
  listPosts: async (
    siteSlug: string,
    params?: { q?: string; categoryId?: string; tagId?: string; page?: number; limit?: number },
  ): Promise<{ data: import('@/types/cms').CmsPost[]; meta?: any }> => {
    const res = await apiClient.get(`/public/sites/${siteSlug}/posts`, { params });
    if (res && Array.isArray((res as any).data)) return res as any;
    return { data: Array.isArray(res) ? (res as any) : [] };
  },

  getPost: async (siteSlug: string, postSlug: string): Promise<import('@/types/cms').CmsPost> => {
    return apiClient.get(`/public/sites/${siteSlug}/posts/${postSlug}`);
  },

  listAuthors: async (siteSlug: string): Promise<import('@/types/cms').CmsAuthor[]> => {
    const res = await apiClient.get(`/public/sites/${siteSlug}/authors`);
    return Array.isArray(res) ? res : [];
  },

  listCategories: async (siteSlug: string): Promise<import('@/types/cms').CmsCategory[]> => {
    const res = await apiClient.get(`/public/sites/${siteSlug}/categories`);
    return Array.isArray(res) ? res : [];
  },

  getNavigation: async (siteSlug: string, key: string): Promise<import('@/types/cms').CmsNavigation> => {
    return apiClient.get(`/public/sites/${siteSlug}/navigation/${key}`);
  },

  getSettings: async (siteSlug: string): Promise<import('@/types/cms').CmsSiteSettings> => {
    return apiClient.get(`/public/sites/${siteSlug}/settings`);
  },

  submitForm: async (
    siteSlug: string,
    formSlug: string,
    data: Record<string, unknown>,
  ): Promise<{ success: boolean; submissionId: string }> => {
    return apiClient.post(`/public/sites/${siteSlug}/forms/${formSlug}/submit`, { data });
  },
};

