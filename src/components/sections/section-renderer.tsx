'use client';

import * as React from 'react';
import { SectionType, ThemeConfig, Product, PricingPlan, Business } from '@/types';
import { NavbarSection } from './navbar-section';
import { HeroSection } from './hero-section';
import { AboutSection } from './about-section';
import { ServicesSection } from './services-section';
import { ProductsSection } from './products-section';
import { PricingSection } from './pricing-section';
import { TestimonialsSection } from './testimonials-section';
import { GallerySection } from './gallery-section';
import { TeamSection } from './team-section';
import { CTASection } from './cta-section';
import { ContactSection } from './contact-section';
import { FooterSection } from './footer-section';

export interface SectionProps {
  id?: string;
  config: Record<string, any>;
  theme?: Partial<ThemeConfig>;
  business?: Partial<Business> | null;
  products?: Product[];
  pricingPlans?: PricingPlan[];
  isEditing?: boolean;
  tenantSlug?: string;
  onNavigate?: (url: string) => void;
}

const SECTION_COMPONENTS: Record<SectionType, React.ComponentType<SectionProps>> = {
  NAVBAR: NavbarSection,
  HERO: HeroSection,
  ABOUT: AboutSection,
  SERVICES: ServicesSection,
  PRODUCTS: ProductsSection,
  PRICING: PricingSection,
  TESTIMONIALS: TestimonialsSection,
  GALLERY: GallerySection,
  TEAM: TeamSection,
  FAQ: ServicesSection, // fallback to services or custom FAQ
  CTA: CTASection,
  CONTACT: ContactSection,
  FOOTER: FooterSection,
};

export interface SectionRendererProps extends SectionProps {
  type: SectionType;
}

export function SectionRenderer({ type, ...props }: SectionRendererProps) {
  const Component = SECTION_COMPONENTS[type];

  if (!Component) {
    return (
      <div className="my-4 rounded-lg border border-dashed border-amber-500/40 bg-amber-500/10 p-6 text-center text-amber-300">
        <p className="font-medium">Unknown section type: {type}</p>
      </div>
    );
  }

  return <Component {...props} />;
}
