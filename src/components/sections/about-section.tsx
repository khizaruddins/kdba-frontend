'use client';

import * as React from 'react';
import { SectionProps } from './section-renderer';
import { CheckCircle2 } from 'lucide-react';

export function AboutSection({ config, theme, business }: SectionProps) {
  const badge = config.badge || 'About Us';
  const headline = config.headline || `About ${business?.name || 'Our Company'}`;
  const description =
    config.description ||
    business?.description ||
    'We are dedicated to delivering excellence, innovative solutions, and exceptional service to clients worldwide.';
  const imageUrl =
    config.imageUrl ||
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80';
  const features = config.features || [
    'Proven industry track record',
    'Customer-first philosophy',
    'Agile & transparent execution',
    'Dedicated support advisors',
  ];

  const accentColor = theme?.accentColor || '#6366f1';

  return (
    <section className="py-20 px-6 border-t border-slate-800/80 bg-slate-950/40">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left / Text side */}
          <div>
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
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl leading-tight"
              style={{ fontFamily: theme?.headingFont || 'inherit' }}
            >
              {headline}
            </h2>

            <p className="mt-5 text-base text-slate-300 leading-relaxed">
              {description}
            </p>

            {features && features.length > 0 && (
              <ul className="mt-8 space-y-3.5">
                {features.map((feat: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-200">
                    <CheckCircle2
                      className="h-5 w-5 shrink-0 mt-0.5"
                      style={{ color: accentColor }}
                    />
                    <span className="text-sm font-medium">{feat}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right / Image side */}
          <div className="relative">
            <div
              className="absolute -inset-2 rounded-3xl opacity-20 blur-xl"
              style={{ backgroundColor: accentColor }}
            />
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
              <img
                src={imageUrl}
                alt={headline}
                className="h-full w-full object-cover max-h-[420px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
