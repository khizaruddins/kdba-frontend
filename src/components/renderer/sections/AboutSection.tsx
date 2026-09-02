'use client';

import * as React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { ThemeConfig, BusinessInfo } from '@/types';

export interface AboutProps {
  id?: string;
  variant?: string;
  props?: Record<string, any>;
  theme?: Partial<ThemeConfig>;
  business?: Partial<BusinessInfo> | null;
  isEditing?: boolean;
}

export function AboutSection({
  variant = 'split',
  props = {},
  theme,
}: AboutProps) {
  const badge = props.badge || 'About Us';
  const headline = props.headline || 'Built with Precision & Purpose';
  const description =
    props.description ||
    'We deliver uncompromised quality, blending human expertise, deep strategic clarity, and modern execution to propel our clients forward.';
  const imageUrl =
    props.imageUrl ||
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80';
  const features = props.features || [
    'Unmatched track record',
    'Dedicated client advisory',
    'Strategic clarity',
  ];

  const accentColor = theme?.accentColor || 'var(--kdba-accent, #6366f1)';
  const headingFont = theme?.headingFont || 'var(--kdba-heading-font, inherit)';
  const borderRadius = theme?.borderRadius || 'var(--kdba-radius, 16px)';

  if (variant === 'story') {
    return (
      <section id="about" className="py-24 px-6 border-t border-slate-800/80 bg-slate-950">
        <div className="mx-auto max-w-4xl text-center">
          {badge && (
            <span
              className="text-xs font-bold uppercase tracking-widest block mb-4"
              style={{ color: accentColor }}
            >
              {badge}
            </span>
          )}
          <h2
            className="text-3xl font-bold tracking-tight text-white sm:text-5xl leading-tight font-serif"
            style={{ fontFamily: headingFont }}
          >
            {headline}
          </h2>
          <p className="mt-8 text-lg text-slate-300 sm:text-xl leading-relaxed max-w-3xl mx-auto">
            {description}
          </p>
          {imageUrl && (
            <div
              className="mt-12 overflow-hidden border border-slate-800 shadow-2xl"
              style={{ borderRadius }}
            >
              <img src={imageUrl} alt={headline} className="w-full h-auto max-h-[460px] object-cover" />
            </div>
          )}
        </div>
      </section>
    );
  }

  // Split / Stats-grid / Minimal (Default Split Layout)
  return (
    <section id="about" className="py-20 md:py-28 px-6 border-t border-slate-800/80 bg-slate-900/30">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Column */}
          <div className="lg:col-span-6">
            {imageUrl && (
              <div
                className="overflow-hidden border border-slate-800 bg-slate-900/80 shadow-2xl relative"
                style={{ borderRadius }}
              >
                <img
                  src={imageUrl}
                  alt={headline}
                  className="h-full w-full object-cover min-h-[360px] max-h-[480px]"
                />
              </div>
            )}
          </div>

          {/* Content Column */}
          <div className="lg:col-span-6 space-y-6">
            {badge && (
              <div
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold border"
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

            <p className="text-base text-slate-300 sm:text-lg leading-relaxed">
              {description}
            </p>

            {/* Feature List */}
            {Array.isArray(features) && features.length > 0 && (
              <div className="pt-2 space-y-3">
                {features.map((feat: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2
                      className="h-5 w-5 shrink-0"
                      style={{ color: accentColor }}
                    />
                    <span className="text-sm font-medium text-slate-200">{feat}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
