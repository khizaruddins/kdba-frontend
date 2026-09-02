'use client';

import * as React from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { ThemeConfig, BusinessInfo } from '@/types';

export interface PricingProps {
  id?: string;
  variant?: string;
  props?: Record<string, any>;
  theme?: Partial<ThemeConfig>;
  business?: Partial<BusinessInfo> | null;
  isEditing?: boolean;
  onNavigate?: (url: string) => void;
}

export function PricingSection({
  variant = 'tier-cards',
  props = {},
  theme,
  onNavigate,
}: PricingProps) {
  const badge = props.badge || 'Transparent Pricing';
  const headline = props.headline || 'Simple, Transparent Investment Plans';
  const subheadline =
    props.subheadline ||
    'Choose the engagement tier tailored to your operational scale and business milestones.';
  const items = props.items || [];

  const accentColor = theme?.accentColor || 'var(--kdba-accent, #6366f1)';
  const headingFont = theme?.headingFont || 'var(--kdba-heading-font, inherit)';
  const borderRadius = theme?.borderRadius || 'var(--kdba-radius, 16px)';

  const handleAction = (e: React.MouseEvent, url?: string) => {
    if (!url) return;
    if (url.startsWith('#')) return;
    e.preventDefault();
    if (onNavigate) {
      onNavigate(url);
    }
  };

  return (
    <section id="pricing" className="py-20 md:py-28 px-6 border-t border-slate-800/80 bg-slate-900/30">
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

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {items.map((plan: any, idx: number) => {
            const isFeatured = plan.isPopular || idx === 1;

            return (
              <div
                key={idx}
                className={`relative p-8 border transition-all flex flex-col justify-between ${
                  isFeatured
                    ? 'border-indigo-500 bg-slate-900 shadow-2xl shadow-indigo-500/10 scale-105 z-10'
                    : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                }`}
                style={{ borderRadius }}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow"
                      style={{ backgroundColor: accentColor }}
                    >
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-400 min-h-[32px]">
                    {plan.description}
                  </p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white font-mono">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-xs text-slate-400 font-mono">
                        {plan.period}
                      </span>
                    )}
                  </div>

                  {/* Feature list */}
                  <div className="mt-8 space-y-3 border-t border-slate-800/80 pt-6">
                    {plan.features?.map((feat: string, fIdx: number) => (
                      <div key={fIdx} className="flex items-center gap-2.5 text-xs text-slate-300">
                        <Check
                          className="h-4 w-4 shrink-0"
                          style={{ color: accentColor }}
                        />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <a
                    href={plan.ctaUrl || '/contact'}
                    onClick={(e) => handleAction(e, plan.ctaUrl || '/contact')}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 text-xs font-semibold rounded-xl shadow transition-all cursor-pointer ${
                      isFeatured
                        ? 'text-white hover:opacity-90 active:scale-95'
                        : 'border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
                    }`}
                    style={isFeatured ? { backgroundColor: accentColor } : undefined}
                  >
                    <span>{plan.ctaText || 'Get Started'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
