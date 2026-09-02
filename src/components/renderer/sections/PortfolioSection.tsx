'use client';

import * as React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { ThemeConfig, BusinessInfo } from '@/types';

export interface PortfolioProps {
  id?: string;
  variant?: string;
  props?: Record<string, any>;
  theme?: Partial<ThemeConfig>;
  business?: Partial<BusinessInfo> | null;
  isEditing?: boolean;
}

export function PortfolioSection({
  variant = 'grid-hover',
  props = {},
  theme,
}: PortfolioProps) {
  const badge = props.badge || 'Selected Work';
  const headline = props.headline || 'Architectural & Digital Milestones';
  const subheadline =
    props.subheadline ||
    'Explore landmark projects delivered across hospitality, finance, luxury retail, and tech.';
  const items = props.items || [];

  const accentColor = theme?.accentColor || 'var(--kdba-accent, #6366f1)';
  const headingFont = theme?.headingFont || 'var(--kdba-heading-font, inherit)';
  const borderRadius = theme?.borderRadius || 'var(--kdba-radius, 16px)';

  return (
    <section id="portfolio" className="py-20 md:py-28 px-6 border-t border-slate-800/80 bg-slate-950">
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

        {/* Portfolio Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item: any, idx: number) => (
            <div
              key={idx}
              className="group relative overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl transition-all hover:border-slate-700"
              style={{ borderRadius }}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>

              <div className="absolute bottom-0 inset-x-0 p-6 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: accentColor }}
                    >
                      {item.category || 'Project'}
                    </span>
                    {item.year && (
                      <span className="text-[11px] text-slate-400 font-mono">
                        • {item.year}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-slate-100">
                    {item.title}
                  </h3>
                </div>

                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900/90 border border-white/10 text-white shadow group-hover:scale-110 transition-transform"
                  style={{ color: accentColor }}
                >
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
