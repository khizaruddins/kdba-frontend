'use client';

import * as React from 'react';
import { Sparkles } from 'lucide-react';
import { ThemeConfig, BusinessInfo } from '@/types';

export interface StatsProps {
  id?: string;
  variant?: string;
  props?: Record<string, any>;
  theme?: Partial<ThemeConfig>;
  business?: Partial<BusinessInfo> | null;
  isEditing?: boolean;
}

export function StatsSection({
  variant = 'counter-grid',
  props = {},
  theme,
}: StatsProps) {
  const badge = props.badge || 'Track Record';
  const headline = props.headline || 'Proven Impact Across Every Engagement';
  const items = props.items || [];

  const accentColor = theme?.accentColor || 'var(--kdba-accent, #6366f1)';
  const headingFont = theme?.headingFont || 'var(--kdba-heading-font, inherit)';
  const borderRadius = theme?.borderRadius || 'var(--kdba-radius, 16px)';

  return (
    <section id="stats" className="py-20 px-6 border-t border-slate-800/80 bg-slate-950">
      <div className="mx-auto max-w-6xl">
        {headline && (
          <div className="text-center max-w-2xl mx-auto mb-14">
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
              className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
              style={{ fontFamily: headingFont }}
            >
              {headline}
            </h2>
          </div>
        )}

        {/* Counter Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((stat: any, idx: number) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 text-center hover:border-slate-700 transition-all flex flex-col justify-center"
              style={{ borderRadius }}
            >
              <div
                className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-2 font-mono"
                style={{ color: accentColor }}
              >
                {stat.value}
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-300">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
