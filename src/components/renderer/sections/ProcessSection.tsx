'use client';

import * as React from 'react';
import { Sparkles } from 'lucide-react';
import { ThemeConfig, BusinessInfo } from '@/types';

export interface ProcessProps {
  id?: string;
  variant?: string;
  props?: Record<string, any>;
  theme?: Partial<ThemeConfig>;
  business?: Partial<BusinessInfo> | null;
  isEditing?: boolean;
}

export function ProcessSection({
  variant = 'steps-timeline',
  props = {},
  theme,
}: ProcessProps) {
  const badge = props.badge || 'Our Methodology';
  const headline = props.headline || 'A Proven, Structured Path to Results';
  const subheadline =
    props.subheadline ||
    'From initial diagnostic discovery to live market deployment, our 4-step framework guarantees precision.';
  const items = props.items || [];

  const accentColor = theme?.accentColor || 'var(--kdba-accent, #6366f1)';
  const headingFont = theme?.headingFont || 'var(--kdba-heading-font, inherit)';
  const borderRadius = theme?.borderRadius || 'var(--kdba-radius, 16px)';

  return (
    <section id="process" className="py-20 md:py-28 px-6 border-t border-slate-800/80 bg-slate-900/40">
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

        {/* Process Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item: any, idx: number) => (
            <div
              key={idx}
              className="p-8 border border-slate-800 bg-slate-900/80 shadow-md hover:border-slate-700 transition-all flex flex-col justify-between"
              style={{ borderRadius }}
            >
              <div>
                <div
                  className="text-2xl font-black font-mono mb-6 inline-block"
                  style={{ color: accentColor }}
                >
                  {item.step || `0${idx + 1}`}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
