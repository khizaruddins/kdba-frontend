'use client';

import * as React from 'react';
import {
  Zap,
  ShieldCheck,
  TrendingUp,
  Layers,
  Sparkles,
  CheckCircle,
  Cpu,
  BarChart3,
  Lock,
  Workflow,
} from 'lucide-react';
import { ThemeConfig, BusinessInfo } from '@/types';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap,
  ShieldCheck,
  TrendingUp,
  Layers,
  Sparkles,
  CheckCircle,
  Cpu,
  BarChart3,
  Lock,
  Workflow,
};

export interface FeaturesProps {
  id?: string;
  variant?: string;
  props?: Record<string, any>;
  theme?: Partial<ThemeConfig>;
  business?: Partial<BusinessInfo> | null;
  isEditing?: boolean;
}

export function FeaturesSection({
  variant = 'bento-grid',
  props = {},
  theme,
}: FeaturesProps) {
  const badge = props.badge || 'Core Advantages';
  const headline = props.headline || 'Engineered for Seamless Performance';
  const subheadline =
    props.subheadline ||
    'Every feature is meticulously crafted to deliver speed, reliability, and unparalleled client satisfaction.';
  const items = props.items || [];

  const accentColor = theme?.accentColor || 'var(--kdba-accent, #6366f1)';
  const headingFont = theme?.headingFont || 'var(--kdba-heading-font, inherit)';
  const borderRadius = theme?.borderRadius || 'var(--kdba-radius, 16px)';

  return (
    <section id="features" className="py-20 md:py-28 px-6 border-t border-slate-800/80 bg-slate-950">
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

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {items.map((item: any, idx: number) => {
            const IconComp = ICON_MAP[item.icon] || Zap;
            const isLarge = idx === 0 || idx === 3;
            const colSpan = isLarge ? 'lg:col-span-7' : 'lg:col-span-5';

            return (
              <div
                key={idx}
                className={`${colSpan} p-8 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all group flex flex-col justify-between`}
                style={{ borderRadius }}
              >
                <div>
                  <div
                    className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl shadow-inner"
                    style={{
                      backgroundColor: `${accentColor}15`,
                      color: accentColor,
                    }}
                  >
                    <IconComp className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-slate-100">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/40">
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: accentColor }}
                  >
                    Engineered Precision
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
