'use client';

import * as React from 'react';
import { SectionProps } from './section-renderer';
import { ArrowRight } from 'lucide-react';

export function CTASection({
  config,
  theme,
  onNavigate,
}: SectionProps) {
  const headline = config.headline || 'Ready to Elevate Your Business?';
  const subheadline =
    config.subheadline ||
    'Let’s collaborate to build something remarkable. Reach out today for a consultation.';
  const primaryCtaText = config.primaryCtaText || 'Get in Touch';
  const primaryCtaUrl = config.primaryCtaUrl || '/contact';

  const accentColor = theme?.accentColor || '#6366f1';

  return (
    <section className="py-20 px-6 border-t border-slate-800">
      <div className="mx-auto max-w-5xl">
        <div
          className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center border border-indigo-500/30 shadow-2xl"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor}25 0%, #0f172a 90%)`,
          }}
        >
          <h2
            className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl"
            style={{ fontFamily: theme?.headingFont || 'inherit' }}
          >
            {headline}
          </h2>

          <p className="mt-4 max-w-xl mx-auto text-base text-slate-300">
            {subheadline}
          </p>

          <div className="mt-8 flex justify-center">
            <a
              href={primaryCtaUrl}
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate(primaryCtaUrl);
              }}
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white shadow-xl transition-all hover:opacity-90 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: accentColor,
                borderRadius: theme?.borderRadius || '8px',
              }}
            >
              <span>{primaryCtaText}</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
