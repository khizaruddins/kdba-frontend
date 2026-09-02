'use client';

import * as React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { PageRenderer } from './PageRenderer';
import { WebsiteDocument, Product, PricingPlan } from '@/types';

export interface WebsiteRendererProps {
  document: WebsiteDocument | Record<string, any>;
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
}: WebsiteRendererProps) {
  const [internalPageSlug, setInternalPageSlug] = React.useState<string>('/');

  if (!document) {
    return (
      <div className="flex min-h-[300px] items-center justify-center p-8 text-slate-500">
        <p className="text-xs">No website document loaded.</p>
      </div>
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
            tenantSlug={document.slug}
            onNavigate={handleNavigate}
            activeSectionId={activeSectionId}
            onSelectSection={onSelectSection}
          />
        )}
      </main>
    </ThemeProvider>
  );
}
