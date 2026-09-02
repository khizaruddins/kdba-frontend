'use client';

import * as React from 'react';
import { useEditorStore } from '@/stores/editor-store';
import { WebsiteRenderer } from '@/components/renderer/WebsiteRenderer';
import { Product, PricingPlan } from '@/types';

export interface EditorCanvasProps {
  products?: Product[];
  pricingPlans?: PricingPlan[];
}

export function EditorCanvas({
  products = [],
  pricingPlans = [],
}: EditorCanvasProps) {
  const { website, activePageId, activeSectionId, viewMode, setActiveSectionId } =
    useEditorStore();

  if (!website) return null;

  // Viewport container sizing based on viewMode
  const viewportWrapperStyles = {
    desktop: 'w-full max-w-full',
    tablet:
      'w-[768px] max-w-[768px] rounded-[28px] border-[8px] border-slate-800 bg-slate-950 shadow-2xl shadow-black/80 my-6 overflow-hidden flex flex-col',
    mobile:
      'w-[375px] max-w-[375px] rounded-[36px] border-[8px] border-slate-800 bg-slate-950 shadow-2xl shadow-black/80 my-6 overflow-hidden flex flex-col',
  }[viewMode];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950/90 p-4 sm:p-6 flex justify-center items-start">
      <div className={`transition-all duration-300 ${viewportWrapperStyles}`}>
        {/* Mobile / Tablet Device Bezel Header Notch */}
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
          <WebsiteRenderer
            document={website}
            activePageId={activePageId}
            activeSectionId={activeSectionId}
            products={products}
            pricingPlans={pricingPlans}
            isEditing={true}
            onSelectSection={(secId) => setActiveSectionId(secId)}
          />
        </div>
      </div>
    </div>
  );
}
