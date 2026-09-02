'use client';

import * as React from 'react';
import { Star, Sparkles, Quote } from 'lucide-react';
import { ThemeConfig, BusinessInfo } from '@/types';

export interface TestimonialsProps {
  id?: string;
  variant?: string;
  props?: Record<string, any>;
  theme?: Partial<ThemeConfig>;
  business?: Partial<BusinessInfo> | null;
  isEditing?: boolean;
}

export function TestimonialsSection({
  variant = 'cards-grid',
  props = {},
  theme,
}: TestimonialsProps) {
  const badge = props.badge || 'Client Endorsements';
  const headline = props.headline || 'Trusted by Leaders Worldwide';
  const subheadline =
    props.subheadline ||
    'Discover how our partnership transforms organizations and creates lasting value.';
  const items = props.items || [];

  const accentColor = theme?.accentColor || 'var(--kdba-accent, #6366f1)';
  const headingFont = theme?.headingFont || 'var(--kdba-heading-font, inherit)';
  const borderRadius = theme?.borderRadius || 'var(--kdba-radius, 16px)';

  return (
    <section id="testimonials" className="py-20 md:py-28 px-6 border-t border-slate-800/80 bg-slate-900/40">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
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

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item: any, idx: number) => (
            <div
              key={idx}
              className="p-8 border border-slate-800 bg-slate-900/80 shadow-md hover:border-slate-700 transition-all flex flex-col justify-between"
              style={{ borderRadius }}
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-6">
                  {Array.from({ length: item.rating || 5 }).map((_, starIdx) => (
                    <Star
                      key={starIdx}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-slate-200 leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-white text-xs shadow-inner"
                  style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
                >
                  {item.author?.slice(0, 2).toUpperCase() || 'CL'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {item.author}
                  </h4>
                  <p className="text-xs text-slate-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
