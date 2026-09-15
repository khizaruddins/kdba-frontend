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
