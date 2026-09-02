'use client';

import * as React from 'react';
import { WebsiteRenderer } from '@/components/renderer/WebsiteRenderer';
import { WebsiteDocument, Product, PricingPlan } from '@/types';
import {
  Monitor,
  Tablet,
  Smartphone,
  X,
  ExternalLink,
} from 'lucide-react';

export interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: WebsiteDocument | any;
  products?: Product[];
  pricingPlans?: PricingPlan[];
}

export function PreviewModal({
  isOpen,
  onClose,
  document,
  products = [],
  pricingPlans = [],
}: PreviewModalProps) {
  const [viewMode, setViewMode] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!isOpen || !document) return null;

  const containerStyles = {
    desktop: 'w-full max-w-full min-h-screen',
    tablet: 'w-[768px] max-w-[768px] my-6 rounded-[28px] border-[8px] border-slate-800 shadow-2xl overflow-y-auto max-h-[85vh]',
    mobile: 'w-[375px] max-w-[375px] my-6 rounded-[36px] border-[8px] border-slate-800 shadow-2xl overflow-y-auto max-h-[85vh]',
  }[viewMode];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-xl select-none">
      {/* Top Preview Bar */}
      <header className="flex h-16 w-full items-center justify-between border-b border-slate-800 px-6 bg-slate-900/90 z-20">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white">
            {document.name || 'Website Live Preview'}
          </span>
          <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase border border-emerald-500/30">
            Interactive Preview
          </span>
        </div>

        {/* Viewport Toggles */}
        <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 p-1">
          <button
            type="button"
            onClick={() => setViewMode('desktop')}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
              viewMode === 'desktop'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop"
          >
            <Monitor className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('tablet')}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
              viewMode === 'tablet'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet"
          >
            <Tablet className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('mobile')}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
              viewMode === 'mobile'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile"
          >
            <Smartphone className="h-4 w-4" />
          </button>
        </div>

        {/* Close */}
        <div className="flex items-center gap-3">
          {document.slug && (
            <a
              href={`/site/${document.slug}`}
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
            >
              <span>Visit Production URL</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Preview Viewport Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center items-start bg-slate-950">
        <div className={`transition-all duration-300 ${containerStyles}`}>
          <div data-view-mode={viewMode} className="w-full bg-slate-950">
            <WebsiteRenderer
              document={document}
              products={products}
              pricingPlans={pricingPlans}
              isEditing={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
