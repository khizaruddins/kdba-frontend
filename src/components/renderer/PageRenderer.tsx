'use client';

import * as React from 'react';
import { SectionRenderer } from './SectionRenderer';
import { PageDocument, ThemeConfig, BusinessInfo, Product, PricingPlan } from '@/types';

export interface PageRendererProps {
  page: PageDocument | Record<string, any>;
  theme?: Partial<ThemeConfig>;
  business?: Partial<BusinessInfo> | null;
  products?: Product[];
  pricingPlans?: PricingPlan[];
  isEditing?: boolean;
  tenantSlug?: string;
  onNavigate?: (url: string) => void;
  activeSectionId?: string | null;
  onSelectSection?: (sectionId: string) => void;
}

export function PageRenderer({
  page,
  theme,
  business,
  products,
  pricingPlans,
  isEditing = false,
  tenantSlug,
  onNavigate,
  activeSectionId,
  onSelectSection,
}: PageRendererProps) {
  const sections = Array.isArray(page?.sections) ? page.sections : [];
  const visibleSections = isEditing
    ? sections
    : sections.filter((s) => s.enabled !== false);

  if (visibleSections.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-12 text-center text-slate-500">
        <p className="text-sm font-semibold text-slate-300">
          No visible sections on this page.
        </p>
        <p className="text-xs mt-1 text-slate-500">
          {isEditing
            ? 'Add or enable sections from the sidebar.'
            : 'Check back soon.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full">
      {visibleSections.map((section: any) => {
        const isSelected = isEditing && activeSectionId === section.id;
        const isDisabled = isEditing && section.enabled === false;

        if (isEditing) {
          return (
            <div
              key={section.id}
              onClick={() => onSelectSection && onSelectSection(section.id)}
              className={`relative group transition-all ${
                isSelected
                  ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-950 z-20'
                  : 'hover:ring-1 hover:ring-indigo-500/50'
              } ${isDisabled ? 'opacity-40 grayscale' : ''}`}
            >
              {/* Edit pill badge */}
              <div
                className={`absolute top-3 right-3 hidden group-hover:flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-bold text-white shadow-lg z-30 pointer-events-none transition-all ${
                  isSelected ? 'bg-indigo-600' : 'bg-slate-900/90 border border-slate-700'
                }`}
              >
                <span>{section.title || section.type}</span>
                <span className="text-indigo-300 font-normal">({section.variant || 'default'})</span>
              </div>

              <SectionRenderer
                section={section}
                theme={theme}
                business={business}
                products={products}
                pricingPlans={pricingPlans}
                isEditing={true}
                tenantSlug={tenantSlug}
                onNavigate={onNavigate}
              />
            </div>
          );
        }

        return (
          <SectionRenderer
            key={section.id}
            section={section}
            theme={theme}
            business={business}
            products={products}
            pricingPlans={pricingPlans}
            isEditing={false}
            tenantSlug={tenantSlug}
            onNavigate={onNavigate}
          />
        );
      })}
    </div>
  );
}
