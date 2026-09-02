'use client';

import * as React from 'react';
import { resolveSectionComponent } from './registry';
import { SectionDocument, ThemeConfig, BusinessInfo, Product, PricingPlan } from '@/types';
import { AlertTriangle } from 'lucide-react';

export interface SectionRendererProps {
  section: SectionDocument | Record<string, any>;
  theme?: Partial<ThemeConfig>;
  business?: Partial<BusinessInfo> | null;
  products?: Product[];
  pricingPlans?: PricingPlan[];
  isEditing?: boolean;
  tenantSlug?: string;
  onNavigate?: (url: string) => void;
}

export function SectionRenderer({
  section,
  theme,
  business,
  products,
  pricingPlans,
  isEditing = false,
  tenantSlug,
  onNavigate,
}: SectionRendererProps) {
  // Support both canonical SectionDocument (props) and legacy Section (draftConfig / config)
  const type = section.type || '';
  const variant = section.variant || 'default';
  const secAny = section as any;
  const props =
    secAny.props ||
    secAny.draftConfig ||
    secAny.publishedConfig ||
    secAny.config ||
    {};

  const Component = resolveSectionComponent(type);

  if (!Component) {
    if (isEditing) {
      return (
        <div className="my-4 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/10 p-6 text-center text-amber-300">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <p className="text-xs font-semibold">
              Unknown section type: <span className="font-mono">{type}</span>
            </p>
          </div>
          <p className="text-[11px] text-amber-400/80 mt-1">
            This section will be skipped safely on the published site.
          </p>
        </div>
      );
    }
    return null;
  }

  return (
    <Component
      id={section.id}
      variant={variant}
      props={props}
      theme={theme}
      business={business}
      products={products}
      pricingPlans={pricingPlans}
      isEditing={isEditing}
      tenantSlug={tenantSlug}
      onNavigate={onNavigate}
    />
  );
}
