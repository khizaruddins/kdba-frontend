'use client';

import * as React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ThemeConfig, BusinessInfo } from '@/types';

export interface CTAProps {
  id?: string;
  variant?: string;
  props?: Record<string, any>;
  theme?: Partial<ThemeConfig>;
  business?: Partial<BusinessInfo> | null;
  isEditing?: boolean;
  onNavigate?: (url: string) => void;
}

export function CTASection({
  variant = 'centered-card',
  props = {},
  theme,
  onNavigate,
}: CTAProps) {
  const headline = props.headline || 'Ready to Transform Your Brand Presence?';
  const subheadline =
    props.subheadline ||
    'Schedule an executive discovery consultation today and unlock your market potential.';
  const primaryCtaText = props.primaryCtaText || 'Schedule Consultation';
  const primaryCtaUrl = props.primaryCtaUrl || '/contact';
  const secondaryCtaText = props.secondaryCtaText;
  const secondaryCtaUrl = props.secondaryCtaUrl || '#services';

  const accentColor = theme?.accentColor || 'var(--kdba-accent, #6366f1)';
  const primaryColor = theme?.primaryColor || 'var(--kdba-primary, #0f172a)';
  const headingFont = theme?.headingFont || 'var(--kdba-heading-font, inherit)';
  const borderRadius = theme?.borderRadius || 'var(--kdba-radius, 20px)';

  const handleAction = (e: React.MouseEvent, url?: string) => {
    if (!url) return;
    if (url.startsWith('#')) return;
    e.preventDefault();
    if (onNavigate) {
      onNavigate(url);
    }
  };

  return (
    <section className="py-20 md:py-28 px-6 border-t border-slate-800/80 bg-slate-900/30">
      <div className="mx-auto max-w-5xl">
        <div
          className="relative overflow-hidden p-10 md:p-16 border border-slate-800 text-center shadow-2xl backdrop-blur-xl"
          style={{
            borderRadius,
            background: `radial-gradient(circle at 50% 0%, ${accentColor}25 0%, ${primaryColor} 90%)`,
          }}
        >
          {/* Ambient Glow */}
          <div
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[240px] w-[400px] rounded-full opacity-30 blur-[100px]"
            style={{ backgroundColor: accentColor }}
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2
              className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl leading-tight"
              style={{ fontFamily: headingFont }}
            >
              {headline}
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {subheadline}
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              {primaryCtaText && (
                <a
                  href={primaryCtaUrl}
                  onClick={(e) => handleAction(e, primaryCtaUrl)}
                  className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  style={{
                    backgroundColor: accentColor,
                    borderRadius: theme?.borderRadius || '12px',
                  }}
                >
                  <span>{primaryCtaText}</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              )}

              {secondaryCtaText && (
                <a
                  href={secondaryCtaUrl}
                  onClick={(e) => handleAction(e, secondaryCtaUrl)}
                  className="inline-flex items-center px-8 py-4 text-sm font-semibold text-slate-200 border border-slate-700 bg-slate-900/80 hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
                  style={{ borderRadius: theme?.borderRadius || '12px' }}
                >
                  {secondaryCtaText}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
