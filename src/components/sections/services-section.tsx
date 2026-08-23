'use client';

import * as React from 'react';
import { SectionProps } from './section-renderer';
import {
  Code,
  Palette,
  TrendingUp,
  Briefcase,
  Compass,
  ShieldCheck,
  Zap,
  Globe,
  Layers,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Code,
  Palette,
  TrendingUp,
  Briefcase,
  Compass,
  ShieldCheck,
  Zap,
  Globe,
  Layers,
};

export function ServicesSection({ config, theme }: SectionProps) {
  const badge = config.badge || 'Services';
  const headline = config.headline || 'What We Offer';
  const subheadline = config.subheadline;
  const items = config.items || [];

  const accentColor = theme?.accentColor || '#6366f1';

  return (
    <section id="services" className="py-20 px-6 border-t border-slate-800/80 bg-slate-900/40">
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

          {subheadline && (
            <p className="mt-4 text-slate-400 text-base">{subheadline}</p>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item: any, idx: number) => {
            const IconComponent = ICON_MAP[item.icon] || Zap;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl"
                style={{ borderRadius: theme?.borderRadius || '16px' }}
              >
                <div
                  className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-colors shadow-inner"
                  style={{
                    backgroundColor: `${accentColor}15`,
                    color: accentColor,
                  }}
                >
                  <IconComponent className="h-6 w-6" />
                </div>

                <h3 className="text-xl font-semibold text-white group-hover:text-slate-100 transition-colors">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
