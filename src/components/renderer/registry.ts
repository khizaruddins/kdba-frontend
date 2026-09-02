// =============================================================================
// KDBA V2 — Component Registry
// =============================================================================

import * as React from 'react';
import { SectionType } from '@/types';
import { NavbarSection } from './sections/NavbarSection';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { ServicesSection } from './sections/ServicesSection';
import { FeaturesSection } from './sections/FeaturesSection';
import { ProductsSection } from './sections/ProductsSection';
import { PortfolioSection } from './sections/PortfolioSection';
import { GallerySection } from './sections/GallerySection';
import { TeamSection } from './sections/TeamSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { StatsSection } from './sections/StatsSection';
import { PricingSection } from './sections/PricingSection';
import { FAQSection } from './sections/FAQSection';
import { ProcessSection } from './sections/ProcessSection';
import { ContactSection } from './sections/ContactSection';
import { MapSection } from './sections/MapSection';
import { OpeningHoursSection } from './sections/OpeningHoursSection';
import { CTASection } from './sections/CTASection';
import { FooterSection } from './sections/FooterSection';

export interface SectionComponentProps {
  id?: string;
  variant?: string;
  props?: Record<string, any>;
  theme?: any;
  business?: any;
  products?: any[];
  pricingPlans?: any[];
  isEditing?: boolean;
  tenantSlug?: string;
  onNavigate?: (url: string) => void;
}

export const SECTION_REGISTRY: Record<
  string,
  React.ComponentType<SectionComponentProps>
> = {
  navbar: NavbarSection,
  hero: HeroSection,
  about: AboutSection,
  services: ServicesSection,
  features: FeaturesSection,
  products: ProductsSection,
  portfolio: PortfolioSection,
  gallery: GallerySection,
  team: TeamSection,
  testimonials: TestimonialsSection,
  stats: StatsSection,
  pricing: PricingSection,
  faq: FAQSection,
  process: ProcessSection,
  contact: ContactSection,
  map: MapSection,
  'opening-hours': OpeningHoursSection,
  cta: CTASection,
  footer: FooterSection,

  // Legacy uppercase aliases
  NAVBAR: NavbarSection,
  HERO: HeroSection,
  ABOUT: AboutSection,
  SERVICES: ServicesSection,
  FEATURES: FeaturesSection,
  PRODUCTS: ProductsSection,
  PORTFOLIO: PortfolioSection,
  GALLERY: GallerySection,
  TEAM: TeamSection,
  TESTIMONIALS: TestimonialsSection,
  STATS: StatsSection,
  PRICING: PricingSection,
  FAQ: FAQSection,
  PROCESS: ProcessSection,
  CONTACT: ContactSection,
  MAP: MapSection,
  OPENING_HOURS: OpeningHoursSection,
  CTA: CTASection,
  FOOTER: FooterSection,
};

/**
 * Resolves a section component from registry with lowercase normalization.
 */
export function resolveSectionComponent(
  type: string,
): React.ComponentType<SectionComponentProps> | null {
  if (!type) return null;
  const normalized = type.toLowerCase();
  return SECTION_REGISTRY[normalized] || SECTION_REGISTRY[type] || null;
}
