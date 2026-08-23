// KDBA V1 — Global Type Definitions

export type Role = 'OWNER' | 'ADMIN' | 'EDITOR' | 'MEMBER';
export type WebsiteStatus = 'DRAFT' | 'PUBLISHED';
export type PageType = 'HOME' | 'ABOUT' | 'CONTACT' | 'CUSTOM';
export type SectionType =
  | 'NAVBAR'
  | 'HERO'
  | 'ABOUT'
  | 'SERVICES'
  | 'PRODUCTS'
  | 'PRICING'
  | 'TESTIMONIALS'
  | 'GALLERY'
  | 'TEAM'
  | 'FAQ'
  | 'CTA'
  | 'CONTACT'
  | 'FOOTER';

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';

export type TemplateCategory =
  | 'AGENCY'
  | 'RESTAURANT'
  | 'BUSINESS'
  | 'PORTFOLIO'
  | 'ECOMMERCE'
  | 'CREATIVE'
  | 'PROFESSIONAL';

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
  businessHours?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  borderRadius: string;
}

export interface Section {
  id: string;
  pageId: string;
  type: SectionType;
  title?: string | null;
  draftConfig: Record<string, any>;
  publishedConfig?: Record<string, any> | null;
  sortOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  id: string;
  websiteId: string;
  title: string;
  slug: string;
  type: PageType;
  sortOrder: number;
  isActive: boolean;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
}

export interface Website {
  id: string;
  tenantId: string;
  businessId: string;
  templateId: string;
  name: string;
  slug: string;
  status: WebsiteStatus;
  theme: ThemeConfig;
  favicon?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  publishedAt?: string | null;
  pages: Page[];
  business?: Business;
  template?: Template;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateSection {
  id: string;
  templatePageId: string;
  type: SectionType;
  title?: string | null;
  defaultConfig: Record<string, any>;
  sortOrder: number;
  enabled: boolean;
}

export interface TemplatePage {
  id: string;
  templateId: string;
  title: string;
  slug: string;
  type: PageType;
  sortOrder: number;
  sections: TemplateSection[];
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category: TemplateCategory;
  previewImage?: string | null;
  theme: ThemeConfig;
  isActive: boolean;
  isPremium: boolean;
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
    theme: ThemeConfig;
    seoTitle?: string;
    seoDescription?: string;
    favicon?: string;
    publishedAt?: string;
    pages: Array<{
      id: string;
      title: string;
      slug: string;
      type: PageType;
      sections: Array<{
        id: string;
        type: SectionType;
        title?: string;
        config: Record<string, any>;
        sortOrder: number;
      }>;
    }>;
  };
  products: Product[];
  pricingPlans: PricingPlan[];
}
