'use client';

import * as React from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { ThemeConfig, BusinessInfo } from '@/types';

export interface FAQProps {
  id?: string;
  variant?: string;
  props?: Record<string, any>;
  theme?: Partial<ThemeConfig>;
  business?: Partial<BusinessInfo> | null;
  isEditing?: boolean;
}

export function FAQSection({
  variant = 'accordion',
  props = {},
  theme,
}: FAQProps) {
  const badge = props.badge || 'FAQ';
  const headline = props.headline || 'Frequently Asked Questions';
  const subheadline =
    props.subheadline ||
    'Everything you need to know about our engagement model, timelines, and deliverables.';
  const items = props.items || [];

  const [openIndexes, setOpenIndexes] = React.useState<number[]>([0]);

  const toggleAccordion = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const accentColor = theme?.accentColor || 'var(--kdba-accent, #6366f1)';
  const headingFont = theme?.headingFont || 'var(--kdba-heading-font, inherit)';
  const borderRadius = theme?.borderRadius || 'var(--kdba-radius, 16px)';

  return (
    <section id="faq" className="py-20 md:py-28 px-6 border-t border-slate-800/80 bg-slate-950">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
          {badge && (
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider mb-4 border"
              style={{
                borderColor: `${accentColor}30`,
                backgroundColor: `${accentColor}10`,
                color: accentColor,
              }}
            >
              <Sparkles className="h-3 w-3" />
              <span>{badge}</span>
            </div>
          )}

          <h2
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl leading-tight"
            style={{ fontFamily: headingFont }}
          >
            {headline}
          </h2>

          {subheadline && (
            <p className="mt-4 text-slate-400 text-base sm:text-lg leading-relaxed">
              {subheadline}
            </p>
          )}
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {items.map((item: any, idx: number) => {
            const isOpen = openIndexes.includes(idx);
            return (
              <div
                key={idx}
                className="overflow-hidden border border-slate-800 bg-slate-900/60 transition-all"
                style={{ borderRadius }}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer hover:bg-slate-900/90 transition-colors"
                >
                  <span className="text-base font-bold text-white pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-slate-800/40 pt-4">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
