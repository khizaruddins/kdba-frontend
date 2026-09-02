'use client';

import * as React from 'react';
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
  Sparkles,
  ArrowUpRight,
  Activity,
  Heart,
  Scissors,
  Home,
  Building,
  Camera,
  Cpu,
  GraduationCap,
  Hotel,
  Car,
  Plane,
} from 'lucide-react';
import { ThemeConfig, BusinessInfo } from '@/types';

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
  Activity,
  Heart,
  Scissors,
  Home,
  Building,
  Camera,
  Cpu,
  GraduationCap,
  Hotel,
  Car,
  Plane,
};

export interface ServicesProps {
  id?: string;
  variant?: string;
  props?: Record<string, any>;
  theme?: Partial<ThemeConfig>;
  business?: Partial<BusinessInfo> | null;
  isEditing?: boolean;
}

export function ServicesSection({
  variant = 'grid',
  props = {},
  theme,
}: ServicesProps) {
  const badge = props.badge || 'Capabilities';
  const headline = props.headline || 'Tailored Solutions for Ambitious Clients';
  const subheadline = props.subheadline;
  const items = props.items || [];

  const accentColor = theme?.accentColor || 'var(--kdba-accent, #6366f1)';
  const headingFont = theme?.headingFont || 'var(--kdba-heading-font, inherit)';
  const borderRadius = theme?.borderRadius || 'var(--kdba-radius, 16px)';

  return (
    <section id="services" className="py-20 md:py-28 px-6 border-t border-slate-800/80 bg-slate-900/40">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
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

        {/* Services Layout based on variant */}
        {variant === 'list-detailed' ? (
          <div className="space-y-4 max-w-4xl mx-auto">
            {items.map((item: any, idx: number) => {
              const IconComp = ICON_MAP[item.icon] || Zap;
              return (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all group"
                  style={{ borderRadius }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors shadow-inner"
                      style={{
                        backgroundColor: `${accentColor}15`,
                        color: accentColor,
                      }}
                    >
                      <IconComp className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-slate-100">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight
                    className="h-5 w-5 opacity-40 group-hover:opacity-100 transition-opacity shrink-0"
                    style={{ color: accentColor }}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          /* Grid & Cards-accent (Standard Grid) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item: any, idx: number) => {
              const IconComp = ICON_MAP[item.icon] || Zap;
              return (
                <div
                  key={idx}
                  className={`group relative p-8 border border-slate-800 bg-slate-900/80 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between ${
                    variant === 'cards-accent' ? 'hover:border-indigo-500/50' : 'hover:border-slate-700'
                  }`}
                  style={{ borderRadius }}
                >
                  <div>
                    <div
                      className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-colors shadow-inner"
                      style={{
                        backgroundColor: `${accentColor}15`,
                        color: accentColor,
                      }}
                    >
                      <IconComp className="h-6 w-6" />
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-slate-100 transition-colors">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">Learn more</span>
                    <ArrowUpRight
                      className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: accentColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
