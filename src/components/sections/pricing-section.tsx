'use client';

import * as React from 'react';
import { SectionProps } from './section-renderer';
import { formatCurrency } from '@/lib/utils';
import { Check } from 'lucide-react';

export function PricingSection({
  config,
  theme,
  pricingPlans = [],
  onNavigate,
}: SectionProps) {
  const badge = config.badge || 'Pricing';
  const headline = config.headline || 'Simple, Transparent Pricing';
  const subheadline = config.subheadline;

  const accentColor = theme?.accentColor || '#6366f1';

  // Fallback demo plans if none configured in tenant
  const displayPlans =
    pricingPlans.length > 0
      ? pricingPlans
      : [
          {
            id: 'plan-1',
            name: 'Starter Advisory',
            description: 'For early-stage startups and boutique teams.',
            price: 2500,
            currency: 'USD',
            billingPeriod: 'month',
            features: [
              'Monthly Strategic Review',
              'Quarterly Financial Model',
              'Email Advisory Support',
            ],
            ctaText: 'Get Started',
            ctaUrl: '#contact',
            isRecommended: false,
          },
          {
            id: 'plan-2',
            name: 'Executive Partner',
            description: 'Comprehensive fractional C-suite advisory.',
            price: 6500,
            currency: 'USD',
            billingPeriod: 'month',
            features: [
              'Weekly Executive Briefing',
              'Board & Investor Pitch Decks',
              'M&A and Valuation Oversight',
              'Dedicated Partner Direct Line',
            ],
            ctaText: 'Start Partnership',
            ctaUrl: '#contact',
            isRecommended: true,
          },
        ];

  return (
    <section className="py-20 px-6 border-t border-slate-800/80 bg-slate-950/40">
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

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {displayPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-8 flex flex-col justify-between transition-all ${
                plan.isRecommended
                  ? 'bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
              style={{ borderRadius: theme?.borderRadius || '16px' }}
            >
              {plan.isRecommended && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-md"
                  style={{ backgroundColor: accentColor }}
                >
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                {plan.description && (
                  <p className="mt-2 text-xs text-slate-400 min-h-[32px]">
                    {plan.description}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {formatCurrency(plan.price, plan.currency || 'USD')}
                  </span>
                  {plan.billingPeriod && (
                    <span className="text-xs text-slate-400">
                      /{plan.billingPeriod}
                    </span>
                  )}
                </div>

                <div className="my-6 border-t border-slate-800" />

                {/* Features List */}
                <ul className="space-y-3">
                  {Array.isArray(plan.features) &&
                    plan.features.map((feat: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check
                          className="h-4 w-4 shrink-0 mt-0.5"
                          style={{ color: accentColor }}
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                </ul>
              </div>

              <a
                href={plan.ctaUrl || '/contact'}
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate(plan.ctaUrl || '/contact');
                }}
                className={`mt-8 inline-flex w-full items-center justify-center rounded-xl py-3 text-xs font-semibold transition-all cursor-pointer ${
                  plan.isRecommended
                    ? 'text-white shadow-md hover:opacity-90 active:scale-95'
                    : 'border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
                style={
                  plan.isRecommended
                    ? { backgroundColor: accentColor }
                    : undefined
                }
              >
                {plan.ctaText || 'Get Started'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
