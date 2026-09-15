import * as React from 'react';
import type { Metadata } from 'next';
import { LandingNavbar } from '@/components/landing/landing-navbar';
import { LandingHero } from '@/components/landing/landing-hero';
import { TrustBar } from '@/components/landing/trust-bar';
import { TemplateShowcase } from '@/components/landing/template-showcase';
import { ValueProposition } from '@/components/landing/value-proposition';
import { HowItWorks } from '@/components/landing/how-it-works';
import { CustomizationBrandDemo } from '@/components/landing/customization-brand-demo';
import { ProductsShowcase } from '@/components/landing/products-showcase';
import { LeadsCrmSection } from '@/components/landing/leads-crm-section';
import { ResponsiveSection } from '@/components/landing/responsive-section';
import { EditorExperienceSection } from '@/components/landing/editor-experience-section';
import { SpeedArchitecture } from '@/components/landing/speed-architecture';
import { FeatureBentoGrid } from '@/components/landing/feature-bento-grid';
import { DashboardPreview } from '@/components/landing/dashboard-preview';
import { FutureVision } from '@/components/landing/future-vision';
import { PricingSection } from '@/components/landing/pricing-section';
import { FaqSection } from '@/components/landing/faq-section';
import { FinalCta } from '@/components/landing/final-cta';
import { LandingFooter } from '@/components/landing/landing-footer';

export const metadata: Metadata = {
  title: 'KDBA — Build Your Business Website Without Code',
  description:
    'Create a professional website with KDBA. Choose a template, add your brand, showcase your products, and publish your website without coding.',
  openGraph: {
    title: 'KDBA — Build a Website That Feels Like Your Business',
    description:
      'Create a professional business website in minutes. Choose a template, add your brand, and publish live — no coding required.',
    url: 'https://kdba.agency',
    siteName: 'KDBA Studio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KDBA — Build Your Business Website Without Code',
    description:
      'Create a professional website with KDBA. Choose a template, add your brand, and publish live with zero coding.',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#090D16] text-slate-300 selection:bg-indigo-500/30 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Sticky Navigation Bar */}
      <LandingNavbar />

      <main className="flex flex-col w-full">
        {/* 1. Hero Section + Interactive Website Builder Demo */}
        <LandingHero />

        {/* 2. Capability-Based Trust Bar */}
        <TrustBar />

        {/* 3. Template Showcase & Category Filters */}
        <TemplateShowcase />

        {/* 4. Value Proposition (4 Large Feature Cards) */}
        <ValueProposition />

        {/* 5. How It Works (5-Step Guided Workflow Timeline) */}
        <HowItWorks />

        {/* 6. Website Customization & Interactive Brand Kit Demo */}
        <CustomizationBrandDemo />

        {/* 7. Products & Digital Catalog Showcase */}
        <ProductsShowcase />

        {/* 8. Leads & Inbound Contact CRM Flow */}
        <LeadsCrmSection />

        {/* 9. Multi-Device Responsive Architecture */}
        <ResponsiveSection />

        {/* 10. Editor Experience & Emotional No-Code Statement */}
        <EditorExperienceSection />

        {/* 11. Built to Be Fast & Edge Architecture */}
        <SpeedArchitecture />

        {/* 12. Feature Bento Grid (8 Platform Capabilities) */}
        <FeatureBentoGrid />

        {/* 13. Unified Dashboard Workspace Preview */}
        <DashboardPreview />

        {/* 14. Future Vision & Roadmap ("And we're just getting started") */}
        <FutureVision />

        {/* 15. Pricing Section & 30-Day Free Trial */}
        <PricingSection />

        {/* 16. Interactive Accordion FAQ */}
        <FaqSection />

        {/* 17. Final High-Impact CTA */}
        <FinalCta />
      </main>

      {/* Complete SaaS Footer */}
      <LandingFooter />
    </div>
  );
}
