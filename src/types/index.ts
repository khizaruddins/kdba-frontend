// KDBA — Global Type Definitions
export * from './document';

export type Role = 'OWNER' | 'ADMIN' | 'EDITOR' | 'MEMBER';
export type WebsiteStatus = 'DRAFT' | 'PUBLISHED';
export type PageType = 'HOME' | 'ABOUT' | 'CONTACT' | 'SERVICES' | 'CUSTOM';

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';

export type TemplateCategory =
  | 'AGENCY'
  | 'RESTAURANT'
  | 'BUSINESS'
  | 'PORTFOLIO'
  | 'ECOMMERCE'
  | 'CREATIVE'
  | 'PROFESSIONAL'
  | 'HEALTHCARE'
  | 'SALON'
  | 'FITNESS'
  | 'REAL_ESTATE'
  | 'EDUCATION'
  | 'HOSPITALITY'
  | 'TECHNOLOGY'
  | 'AUTOMOTIVE';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
}

export interface Business {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  logoUrl?: string | null;
  favicon?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zipCode?: string | null;
  website?: string | null;
  socialMedia?: Record<string, string> | null;
  businessHours?: any;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  pageId: string;
  type: string;
  variant?: string;
  title?: string | null;
  draftConfig: Record<string, any>;
  publishedConfig?: Record<string, any> | null;
  sortOrder: number;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Page {
  id: string;
  websiteId: string;
  title: string;
  slug: string;
  type?: PageType | string;
  sortOrder: number;
  isActive: boolean;
  sections: Section[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Website {
  id: string;
  tenantId?: string;
  businessId?: string;
  templateId?: string;
  name: string;
  slug: string;
  status: WebsiteStatus;
  theme: any;
  favicon?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  publishedAt?: string | null;
  pages: Page[];
  business?: Business;
  template?: Template;
  createdAt?: string;
  updatedAt?: string;
}

export interface TemplateSection {
  id: string;
  templatePageId?: string;
  type: string;
  variant?: string;
  title?: string | null;
  defaultConfig: Record<string, any>;
  sortOrder: number;
  enabled: boolean;
}

export interface TemplatePage {
  id: string;
  templateId?: string;
  title: string;
  slug: string;
  type?: PageType | string;
  sortOrder: number;
  sections: TemplateSection[];
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category: TemplateCategory | string;
  industry?: string;
  style?: string;
  previewImage?: string | null;
  theme: any;
  isActive: boolean;
  isPremium?: boolean;
  pages?: TemplatePage[];
}

export interface MediaItem {
  id: string;
  tenantId: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  altText?: string | null;
  provider: string;
  storageKey: string;
  createdAt: string;
}

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  imageUrl?: string | null;
  category?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PricingPlan {
  id: string;
  tenantId: string;
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  billingPeriod?: string | null;
  features: string[];
  ctaText?: string | null;
  ctaUrl?: string | null;
  isRecommended: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  source?: string | null;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  lost: number;
}

export interface PublicWebsiteResponse {
  tenant: {
    name: string;
    slug: string;
  };
  business: Business | null;
  website: {
    id: string;
    name: string;
    slug: string;
    theme: any;
    seoTitle?: string;
    seoDescription?: string;
    favicon?: string;
    publishedAt?: string;
    publishedDocument?: import('./v3-document').WebsiteDocumentV3;
    document?: import('./v3-document').WebsiteDocumentV3;
    pages: Array<{
      id: string;
      title: string;
      slug: string;
      type: PageType | string;
      sections: Array<{
        id: string;
        type: string;
        variant?: string;
        title?: string;
        config: Record<string, any>;
        sortOrder: number;
      }>;
    }>;
  };
  products: Product[];
  pricingPlans: PricingPlan[];
  publishedDocument?: import('./v3-document').WebsiteDocumentV3;
  document?: import('./v3-document').WebsiteDocumentV3;
  isBlocked?: boolean;
  tenantStatus?: string;
  blockedReason?: string;
  blockedAt?: string;
}
