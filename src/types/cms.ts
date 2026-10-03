export const CMS_FIELD_TYPES = [
  'text',
  'rich-text',
  'number',
  'boolean',
  'date',
  'datetime',
  'url',
  'email',
  'image',
  'media',
  'select',
  'multi-select',
  'reference',
  'multi-reference',
] as const;

export type CmsFieldType = (typeof CMS_FIELD_TYPES)[number];

export const CMS_RECORD_STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;
export type CmsRecordStatus = (typeof CMS_RECORD_STATUSES)[number];

export interface CmsCollectionField {
  id: string;
  name: string;
  type: CmsFieldType;
  required?: boolean;
  unique?: boolean;
  options?: string[];
  reference?: string;
  multiple?: boolean;
  system?: boolean;
  help?: string;
}

export interface CmsCollectionSettings {
  hasSlug: boolean;
  defaultStatus: CmsRecordStatus;
  publicListLimit: number;
}

export interface CmsCollection {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  fields: CmsCollectionField[];
  settings: CmsCollectionSettings;
  presetKey?: string | null;
  isBuiltin?: boolean;
  createdAt: string;
  updatedAt: string;
  recordCount?: number;
}

export interface CmsRecord {
  id: string;
  collectionId: string;
  slug?: string | null;
  status: CmsRecordStatus;
  data: Record<string, unknown>;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CmsRecordsPage {
  data: CmsRecord[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface CmsPreset {
  key: string;
  name: string;
  slug: string;
  description: string;
  seed: boolean;
  fields: CmsCollectionField[];
  settings: CmsCollectionSettings;
}

export interface CmsCatalog {
  fieldTypes: CmsFieldType[];
  recordStatuses: CmsRecordStatus[];
  filterOps: string[];
  bindingSources: Array<'collection' | 'record' | 'business'>;
  pageKinds: Array<'static' | 'collection-index' | 'collection-item'>;
  presets: CmsPreset[];
}

export interface CmsBusinessProfile {
  id?: string;
  name?: string;
  description?: string | null;
  logoUrl?: string | null;
  favicon?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zipCode?: string | null;
  website?: string | null;
  socialMedia?: Record<string, string> | null;
  businessHours?: Record<string, unknown> | null;
  locations?: unknown[];
}

export const BUILTIN_CONTENT_LINKS = [
  { slug: 'blog-posts', label: 'Blog', href: '/content/blog-posts', singular: 'Blog Post' },
  { slug: 'services', label: 'Services', href: '/content/services', singular: 'Service' },
  { slug: 'team', label: 'Team', href: '/content/team', singular: 'Team Member' },
  { slug: 'testimonials', label: 'Testimonials', href: '/content/testimonials', singular: 'Testimonial' },
  { slug: 'faq', label: 'FAQ', href: '/content/faq', singular: 'FAQ' },
  { slug: 'projects', label: 'Projects', href: '/content/projects', singular: 'Project' },
] as const;

// ─── DEDICATED CMS PLATFORM ENTITIES (M4) ───────────────────────────────────

export type CmsPostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';

export interface CmsAuthor {
  id: string;
  websiteId: string;
  tenantId: string;
  name: string;
  slug: string;
  avatarUrl?: string | null;
  bio?: string | null;
  socialLinks?: Record<string, string> | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CmsCategory {
  id: string;
  websiteId: string;
  tenantId: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  parent?: CmsCategory | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CmsTag {
  id: string;
  websiteId: string;
  tenantId: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface CmsPost {
  id: string;
  websiteId: string;
  tenantId: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  status: CmsPostStatus;
  publishedAt?: string | null;
  scheduledAt?: string | null;
  authorId?: string | null;
  author?: CmsAuthor | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
  twitterCard?: string | null;
  views: number;
  sortOrder: number;
  categories?: Array<{ id: string; categoryId: string; category?: CmsCategory }>;
  tags?: Array<{ id: string; tagId: string; tag?: CmsTag }>;
  createdAt: string;
  updatedAt: string;
}

export interface CmsPostsPage {
  data: CmsPost[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CmsFormFieldConfig {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface CmsForm {
  id: string;
  websiteId: string;
  tenantId: string;
  name: string;
  slug: string;
  title?: string | null;
  description?: string | null;
  fields: CmsFormFieldConfig[];
  settings?: {
    submitLabel?: string;
    successMessage?: string;
    redirectUrl?: string;
    notifyEmail?: string;
    honeypotField?: string;
  } | null;
  isActive: boolean;
  submissionsCount?: number;
  _count?: {
    submissions: number;
  };
  createdAt: string;
  updatedAt: string;
}

export type CmsSubmissionStatus = 'UNREAD' | 'READ' | 'ARCHIVED' | 'SPAM';

export interface CmsFormSubmission {
  id: string;
  websiteId: string;
  tenantId: string;
  formId: string;
  data: Record<string, unknown>;
  status: CmsSubmissionStatus;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  updatedAt: string;
  form?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CmsNavigationItem {
  id: string;
  label: string;
  url: string;
  target?: '_self' | '_blank';
  order: number;
  children?: CmsNavigationItem[];
}

export interface CmsNavigation {
  id: string;
  websiteId: string;
  tenantId: string;
  name: string;
  key: string;
  items: CmsNavigationItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CmsSiteSettings {
  id: string;
  websiteId: string;
  tenantId: string;
  business?: Record<string, unknown> | null;
  social?: Record<string, unknown> | null;
  general?: Record<string, unknown> | null;
  seo?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

