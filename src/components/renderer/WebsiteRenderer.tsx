'use client';

import * as React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { PageRenderer } from './PageRenderer';
import { V3WebsiteRenderer } from './v3/V3WebsiteRenderer';
import { WebsiteDocument, Product, PricingPlan } from '@/types';
import { WebsiteDocumentV3 } from '@/types/v3-document';

export interface WebsiteRendererProps {
  document: WebsiteDocument | WebsiteDocumentV3 | Record<string, any>;
  activePageId?: string | null;
  activePageSlug?: string | null;
  activeSectionId?: string | null;
  products?: Product[];
  pricingPlans?: PricingPlan[];
  isEditing?: boolean;
  onNavigate?: (url: string) => void;
  onSelectSection?: (sectionId: string) => void;
  className?: string;
  style?: React.CSSProperties;
  tenantSlug?: string | null;
}

export function WebsiteRenderer({
  document,
  activePageId,
  activePageSlug,
  activeSectionId,
  products = [],
  pricingPlans = [],
  isEditing = false,
  onNavigate,
  onSelectSection,
  className = '',
  style = {},
  tenantSlug,
}: WebsiteRendererProps) {
  const [internalPageSlug, setInternalPageSlug] = React.useState<string>('/');

  if (!document) {
    return (
      <div className="flex min-h-[300px] items-center justify-center p-8 text-slate-500">
        <p className="text-xs">No website document loaded.</p>
      </div>
    );
  }

  const docAny = document as any;

  // Automatic routing for V3 visual documents
  if (docAny?.schemaVersion === '3.0') {
    return (
      <V3WebsiteRenderer
        document={document as WebsiteDocumentV3}
        activePageId={activePageId}
        activePageSlug={activePageSlug}
        isEditing={isEditing}
        className={className}
        style={style}
        tenantSlug={tenantSlug || docAny?.settings?.subdomain || docAny?.slug || null}
      />
    );
  }

  const pages = Array.isArray(document.pages) ? document.pages : [];

  // Determine active page
  let currentPage = null;
  if (activePageId) {
    currentPage = pages.find((p) => p.id === activePageId);
  } else if (activePageSlug) {
    currentPage = pages.find((p) => p.slug === activePageSlug);
  } else {
    currentPage = pages.find((p) => p.slug === internalPageSlug) || pages[0];
  }

  if (!currentPage && pages.length > 0) {
    currentPage = pages[0];
  }

  const handleNavigate = (url: string) => {
    if (onNavigate) {
      onNavigate(url);
      return;
    }

    if (url.startsWith('#')) {
      if (typeof window !== 'undefined') {
        const el = window.document.querySelector(url);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
      return;
    }

    // Switch active page
    const matched = pages.find((p) => p.slug === url);
    if (matched) {
      setInternalPageSlug(url);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <ThemeProvider theme={document.theme} className={className} style={style}>
      <main className="min-h-screen w-full flex flex-col justify-between">
        {currentPage && (
          <PageRenderer
            page={currentPage}
            theme={document.theme}
            business={document.business}
            products={products}
            pricingPlans={pricingPlans}
            isEditing={isEditing}
            tenantSlug={docAny?.slug}
            onNavigate={handleNavigate}
            activeSectionId={activeSectionId}
            onSelectSection={onSelectSection}
          />
        )}
      </main>
    </ThemeProvider>
  );
}
