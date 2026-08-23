'use client';

import * as React from 'react';
import { useEditorStore } from '@/stores/editor-store';
import { SectionRenderer } from '@/components/sections/section-renderer';
import { Product, PricingPlan } from '@/types';

export interface EditorCanvasProps {
  products?: Product[];
  pricingPlans?: PricingPlan[];
}

export function EditorCanvas({
  products = [],
  pricingPlans = [],
}: EditorCanvasProps) {
  const { website, activePageId, viewMode, setActiveSectionId } =
    useEditorStore();

  if (!website) return null;

  const activePage =
    website.pages.find((p) => p.id === activePageId) || website.pages[0];

  const enabledSections = (activePage?.sections || []).filter(
    (s) => s.enabled,
  );

  // Viewport container width based on viewMode
  const viewportWrapperStyles = {
    desktop: 'w-full max-w-full',
    tablet:
      'w-[768px] max-w-[768px] rounded-[28px] border-[6px] border-slate-800 bg-slate-950 shadow-2xl shadow-black/80 my-6 overflow-hidden flex flex-col',
    mobile:
      'w-[375px] max-w-[375px] rounded-[36px] border-[6px] border-slate-800 bg-slate-950 shadow-2xl shadow-black/80 my-6 overflow-hidden flex flex-col',
  }[viewMode];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950/90 p-4 sm:p-6 flex justify-center items-start">
      <div className={`transition-all duration-300 ${viewportWrapperStyles}`}>
        {/* Mobile / Tablet Device Top Bezel Notch */}
        {viewMode === 'mobile' && (
          <div className="h-6 w-full bg-slate-900 flex items-center justify-center border-b border-slate-800/60 shrink-0 select-none">
            <div className="h-2.5 w-24 rounded-full bg-slate-800" />
          </div>
        )}
        {viewMode === 'tablet' && (
          <div className="h-5 w-full bg-slate-900 flex items-center justify-center border-b border-slate-800/60 shrink-0 select-none">
            <div className="h-2 w-16 rounded-full bg-slate-800" />
          </div>
        )}

        {/* Scrollable Canvas Content Area */}
        <div
          data-view-mode={viewMode}
          className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-950 canvas-viewport"
          style={{
            minHeight: viewMode === 'desktop' ? '100%' : '750px',
            maxHeight: viewMode === 'desktop' ? undefined : '820px',
          }}
        >
          {enabledSections.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center p-12 text-center text-slate-500">
              <p className="text-sm font-semibold text-slate-300">
                No enabled sections on this page.
              </p>
              <p className="text-xs mt-1 text-slate-500">
                Enable sections from the sidebar to start designing.
              </p>
            </div>
          ) : (
            enabledSections.map((section) => (
              <div
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                className="relative group cursor-pointer hover:ring-2 hover:ring-indigo-500/80 transition-all"
              >
                {/* Subtle hover edit badge indicator */}
                <div className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1 rounded-md bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-md z-30 pointer-events-none">
                  Click to edit {section.type}
                </div>

                <SectionRenderer
                  type={section.type}
                  config={section.draftConfig}
                  theme={website.theme}
                  business={website.business}
                  products={products}
                  pricingPlans={pricingPlans}
                  isEditing={true}
                  tenantSlug={website.slug}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
