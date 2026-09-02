// =============================================================================
// KDBA V2 — Canonical WebsiteDocument Schema & Core Types
// =============================================================================

export type SectionType =
  | 'navbar'
  | 'hero'
  | 'about'
  | 'services'
  | 'features'
  | 'products'
  | 'portfolio'
  | 'gallery'
  | 'team'
  | 'testimonials'
  | 'stats'
  | 'pricing'
  | 'faq'
  | 'process'
  | 'contact'
  | 'map'
  | 'opening-hours'
  | 'cta'
  | 'footer';

// Variant types per section
export type HeroVariant =
  | 'split-image'
  | 'centered'
  | 'fullscreen'
  | 'image-background'
  | 'editorial'
  | 'minimal';

export type NavbarVariant =
  | 'standard'
  | 'centered'
  | 'minimal'
  | 'floating'
  | 'split';

export type AboutVariant =
  | 'split'
  | 'story'
  | 'stats-grid'
  | 'timeline'
  | 'minimal';

export type ServicesVariant =
  | 'grid'
  | 'cards-accent'
  | 'list-detailed'
  | 'minimal-icons'
  | 'carousel';

export type FeaturesVariant =
  | 'grid-3col'
  | 'alternating'
  | 'bento-grid'
  | 'cards';

export type ProductsVariant =
  | 'grid'
  | 'catalog'
  | 'menu-list'
  | 'featured-card';

export type PortfolioVariant =
  | 'masonry'
  | 'grid-hover'
  | 'carousel'
  | 'minimal-list';

export type GalleryVariant =
  | 'grid'
  | 'masonry'
  | 'carousel'
  | 'fullwidth-strip';

export type TeamVariant =
  | 'grid-cards'
  | 'editorial-list'
  | 'minimal-round';

export type TestimonialsVariant =
  | 'cards-grid'
  | 'quote-slider'
  | 'single-featured'
  | 'compact-marquee';

export type StatsVariant =
  | 'counter-grid'
  | 'banner-strip'
  | 'cards'
  | 'minimal';

export type PricingVariant =
  | 'cards-comparison'
  | 'tier-cards'
  | 'simple-list'
  | 'minimal';

export type FAQVariant =
  | 'accordion'
  | 'two-column'
  | 'cards'
  | 'minimal';

export type ProcessVariant =
  | 'steps-timeline'
  | 'numbered-cards'
  | 'horizontal-flow';

export type ContactVariant =
  | 'split-form'
  | 'card-centered'
  | 'minimal-details';

export type MapVariant =
  | 'embed-card'
  | 'fullwidth-banner'
  | 'split-info';

export type OpeningHoursVariant =
  | 'card-table'
  | 'badge-list'
  | 'split-schedule';

export type CTAVariant =
  | 'banner-split'
  | 'centered-card'
  | 'minimal-bar'
  | 'glow-card';

export type FooterVariant =
  | 'multi-column'
  | 'minimal-centered'
  | 'brand-rich'
  | 'compact';

export type SectionVariant = string;

// Section styles
export interface SectionStyles {
  paddingTop?: string;
  paddingBottom?: string;
  backgroundColor?: string;
  textColor?: string;
  customClass?: string;
}

// Section Document Contract
export interface SectionDocument {
  id: string;
  type: SectionType | string;
  variant?: SectionVariant;
  enabled: boolean;
  sortOrder?: number;
  props: Record<string, any>;
  styles?: SectionStyles;
}

// Page Document Contract
export interface PageDocument {
  id: string;
  title: string;
  slug: string;
  type?: 'HOME' | 'ABOUT' | 'CONTACT' | 'SERVICES' | 'CUSTOM' | string;
  sortOrder?: number;
  isActive?: boolean;
  sections: SectionDocument[];
  seoTitle?: string;
  seoDescription?: string;
}

// Theme Configuration Contract
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor?: string;
  accentColor: string;
  backgroundColor?: string;
  surfaceColor?: string;
  textColor?: string;
  mutedTextColor?: string;
  headingFont: string;
  bodyFont: string;
  borderRadius: string;
  buttonStyle?: 'solid' | 'outline' | 'pill' | 'glow';
}

// Business Information Contract
export interface BusinessInfo {
  name: string;
  tagline?: string;
  description?: string;
  category?: string;
  logoUrl?: string | null;
  favicon?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zipCode?: string | null;
  whatsapp?: string | null;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
    github?: string;
  };
  businessHours?: Array<{
    days: string;
    hours: string;
    isClosed?: boolean;
  }>;
}

// Canonical WebsiteDocument Contract
export interface WebsiteDocument {
  id: string;
  name: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED';
  templateId?: string;
  theme: ThemeConfig;
  business: BusinessInfo;
  pages: PageDocument[];
  seoTitle?: string;
  seoDescription?: string;
  favicon?: string | null;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Template Category & Definition Contract
export type TemplateIndustry =
  | 'RESTAURANT'
  | 'CAFE'
  | 'DENTAL'
  | 'HEALTHCARE'
  | 'SALON'
  | 'SPA'
  | 'FITNESS'
  | 'REAL_ESTATE'
  | 'ARCHITECTURE'
  | 'INTERIOR_DESIGN'
  | 'PHOTOGRAPHER'
  | 'CREATIVE_AGENCY'
  | 'SOFTWARE_SAAS'
  | 'CONSULTING'
  | 'LAW_FIRM'
  | 'EDUCATION'
  | 'SCHOOL'
  | 'HOTEL'
  | 'TRAVEL'
  | 'AUTOMOTIVE';

export interface TemplateDefinition {
  id: string;
  name: string;
  slug: string;
  industry: TemplateIndustry;
  style: string;
  description: string;
  previewImage?: string;
  featured?: boolean;
  document: WebsiteDocument;
}

// Editable Field Schema definition for V2 and V3 compatibility
export type FieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'image'
  | 'link'
  | 'color'
  | 'select'
  | 'switch'
  | 'number'
  | 'array';

export interface EditableFieldDef {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  options?: Array<{ label: string; value: string }>;
  itemSchema?: EditableFieldDef[];
}

export interface SectionMetadata {
  type: SectionType | string;
  name: string;
  description: string;
  variants: Array<{ id: string; label: string; description?: string }>;
  defaultVariant: string;
  editableFields: EditableFieldDef[];
  defaultProps: Record<string, any>;
}
