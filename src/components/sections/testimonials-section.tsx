'use client';

import * as React from 'react';
import { SectionProps } from './section-renderer';
import { Star, Quote } from 'lucide-react';

export function TestimonialsSection({ config, theme }: SectionProps) {
  const badge = config.badge || 'Testimonials';
  const headline = config.headline || 'What Our Clients Say';
  const items = config.items || [];

  const accentColor = theme?.accentColor || '#6366f1';

  return (
    <section className="py-20 px-6 border-t border-slate-800/80 bg-slate-900/40">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-4 border"
            style={{
              borderColor: `${accentColor}30`,
              backgroundColor: `${accentColor}10`,
              color: accentColor,
            }}
          >
            {badge}
          </div>

          <h2
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            style={{ fontFamily: theme?.headingFont || 'inherit' }}
          >
            {headline}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item: any, idx: number) => (
            <div
              key={idx}
              className="relative rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-sm"
              style={{ borderRadius: theme?.borderRadius || '16px' }}
            >
              <Quote
                className="h-8 w-8 mb-4 opacity-30"
                style={{ color: accentColor }}
              />

              <div className="flex gap-1 mb-4 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>

              <p className="text-sm text-slate-200 leading-relaxed italic">
                "{item.quote}"
              </p>

              <div className="mt-6 flex items-center gap-3">
                {item.avatar && (
                  <img
                    src={item.avatar}
                    alt={item.author}
                    className="h-10 w-10 rounded-full object-cover border border-slate-700"
                  />
                )}
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    {item.author}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {item.role} {item.company ? `• ${item.company}` : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
