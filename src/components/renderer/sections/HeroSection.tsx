'use client';

import * as React from 'react';
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { ThemeConfig, BusinessInfo } from '@/types';

export interface HeroProps {
  id?: string;
  variant?: string;
  props?: Record<string, any>;
  theme?: Partial<ThemeConfig>;
  business?: Partial<BusinessInfo> | null;
  isEditing?: boolean;
  onNavigate?: (url: string) => void;
}

export function HeroSection({
  variant = 'split-image',
  props = {},
  theme,
  onNavigate,
}: HeroProps) {
  const badge = props.badge;
  const headline = props.headline || 'Build High-Impact Digital Experiences';
  const subheadline =
    props.subheadline ||
    'Grow your brand with custom strategies, enterprise engineering, and design excellence.';
  const primaryCtaText = props.primaryCtaText || 'Get Started';
  const primaryCtaUrl = props.primaryCtaUrl || '/contact';
  const secondaryCtaText = props.secondaryCtaText;
  const secondaryCtaUrl = props.secondaryCtaUrl || '#services';
  const imageUrl = props.imageUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80';

  const accentColor = theme?.accentColor || 'var(--kdba-accent, #6366f1)';
  const primaryColor = theme?.primaryColor || 'var(--kdba-primary, #0f172a)';
  const headingFont = theme?.headingFont || 'var(--kdba-heading-font, inherit)';
  const borderRadius = theme?.borderRadius || 'var(--kdba-radius, 12px)';

  const handleCtaClick = (e: React.MouseEvent, url: string) => {
    if (url.startsWith('#')) return;
    e.preventDefault();
    if (onNavigate) {
      onNavigate(url);
    }
  };

  // 1. Fullscreen Variant
  if (variant === 'fullscreen') {
    return (
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 py-24 bg-slate-950">
        <div className="absolute inset-0 pointer-events-none">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={headline}
              className="w-full h-full object-cover opacity-25 filter blur-[1px]"
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, transparent 0%, ${primaryColor} 90%)`,
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl text-center mx-auto flex flex-col items-center">
          {badge && (
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider border backdrop-blur-md"
              style={{
                borderColor: `${accentColor}40`,
                backgroundColor: `${accentColor}15`,
                color: accentColor,
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{badge}</span>
            </div>
          )}

          <h1
            className="text-5xl font-black tracking-tight text-white sm:text-6xl md:text-7xl leading-[1.05]"
            style={{ fontFamily: headingFont }}
          >
            {headline}
          </h1>

          <p className="mt-6 text-lg text-slate-300 sm:text-xl max-w-2xl leading-relaxed">
            {subheadline}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {primaryCtaText && (
              <a
                href={primaryCtaUrl}
                onClick={(e) => handleCtaClick(e, primaryCtaUrl)}
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: accentColor,
                  borderRadius,
                }}
              >
                <span>{primaryCtaText}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            )}
            {secondaryCtaText && (
              <a
                href={secondaryCtaUrl}
                onClick={(e) => handleCtaClick(e, secondaryCtaUrl)}
                className="inline-flex items-center px-8 py-4 text-sm font-bold text-slate-200 border border-slate-700 bg-slate-900/80 backdrop-blur-sm transition-all hover:bg-slate-800 hover:text-white cursor-pointer"
                style={{ borderRadius }}
              >
                {secondaryCtaText}
              </a>
            )}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 animate-bounce">
          <ChevronDown className="h-6 w-6" />
        </div>
      </section>
    );
  }

  // 2. Image Background Overlay Variant
  if (variant === 'image-background') {
    return (
      <section className="relative overflow-hidden py-32 md:py-40 px-6">
        <div className="absolute inset-0 pointer-events-none">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={headline}
              className="w-full h-full object-cover"
            />
          )}
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {badge && (
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold border backdrop-blur-md"
              style={{
                borderColor: `${accentColor}50`,
                backgroundColor: `${accentColor}20`,
                color: accentColor,
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{badge}</span>
            </div>
          )}

          <h1
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.1]"
            style={{ fontFamily: headingFont }}
          >
            {headline}
          </h1>

          <p className="mt-6 text-base text-slate-200 sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {subheadline}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {primaryCtaText && (
              <a
                href={primaryCtaUrl}
                onClick={(e) => handleCtaClick(e, primaryCtaUrl)}
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white shadow-xl transition-all hover:opacity-90 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: accentColor,
                  borderRadius,
                }}
              >
                <span>{primaryCtaText}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            )}
            {secondaryCtaText && (
              <a
                href={secondaryCtaUrl}
                onClick={(e) => handleCtaClick(e, secondaryCtaUrl)}
                className="inline-flex items-center px-7 py-3.5 text-sm font-semibold text-slate-200 border border-white/20 bg-slate-900/60 backdrop-blur-md transition-all hover:bg-slate-800"
                style={{ borderRadius }}
              >
                {secondaryCtaText}
              </a>
            )}
          </div>
        </div>
      </section>
    );
  }

  // 3. Editorial Variant (Serif, Minimalist Luxury)
  if (variant === 'editorial') {
    return (
      <section className="relative overflow-hidden py-24 md:py-36 px-6 border-b border-slate-800/80">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              {badge && (
                <span
                  className="text-xs font-mono uppercase tracking-widest block font-bold"
                  style={{ color: accentColor }}
                >
                  {badge}
                </span>
              )}
              <h1
                className="text-4xl font-normal tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.08] font-serif"
                style={{ fontFamily: headingFont }}
              >
                {headline}
              </h1>
              <p className="text-base text-slate-400 sm:text-lg leading-relaxed max-w-xl">
                {subheadline}
              </p>
              <div className="pt-4 flex items-center gap-4">
                {primaryCtaText && (
                  <a
                    href={primaryCtaUrl}
                    onClick={(e) => handleCtaClick(e, primaryCtaUrl)}
                    className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow transition-all hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: accentColor,
                      borderRadius,
                    }}
                  >
                    <span>{primaryCtaText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                )}
                {secondaryCtaText && (
                  <a
                    href={secondaryCtaUrl}
                    onClick={(e) => handleCtaClick(e, secondaryCtaUrl)}
                    className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors underline underline-offset-4"
                  >
                    {secondaryCtaText}
                  </a>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              {imageUrl && (
                <div
                  className="overflow-hidden border border-slate-800 shadow-2xl relative aspect-[4/5]"
                  style={{ borderRadius }}
                >
                  <img
                    src={imageUrl}
                    alt={headline}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 4. Centered Variant
  if (variant === 'centered') {
    return (
      <section
        className="relative overflow-hidden py-24 md:py-32 px-6"
        style={{
          background: `radial-gradient(circle at 50% 20%, ${accentColor}18 0%, ${primaryColor} 80%)`,
        }}
      >
        <div className="relative mx-auto max-w-4xl text-center">
          {badge && (
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold border backdrop-blur-sm"
              style={{
                borderColor: `${accentColor}40`,
                backgroundColor: `${accentColor}15`,
                color: accentColor,
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{badge}</span>
            </div>
          )}

          <h1
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.1]"
            style={{ fontFamily: headingFont }}
          >
            {headline}
          </h1>

          <p className="mt-6 text-base text-slate-300 sm:text-xl max-w-2xl mx-auto leading-relaxed">
            {subheadline}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {primaryCtaText && (
              <a
                href={primaryCtaUrl}
                onClick={(e) => handleCtaClick(e, primaryCtaUrl)}
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white shadow-xl transition-all hover:opacity-90 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: accentColor,
                  borderRadius,
                }}
              >
                <span>{primaryCtaText}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            )}
            {secondaryCtaText && (
              <a
                href={secondaryCtaUrl}
                onClick={(e) => handleCtaClick(e, secondaryCtaUrl)}
                className="inline-flex items-center px-7 py-3.5 text-sm font-semibold text-slate-200 border border-slate-700 bg-slate-900/60 backdrop-blur-sm transition-all hover:bg-slate-800 hover:text-white cursor-pointer"
                style={{ borderRadius }}
              >
                {secondaryCtaText}
              </a>
            )}
          </div>

          {imageUrl && (
            <div
              className="mt-14 overflow-hidden border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-sm"
              style={{ borderRadius }}
            >
              <img
                src={imageUrl}
                alt={headline}
                className="h-auto w-full max-h-[520px] object-cover"
              />
            </div>
          )}
        </div>
      </section>
    );
  }

  // 5. Minimal Variant
  if (variant === 'minimal') {
    return (
      <section className="py-20 px-6 border-b border-slate-800/80">
        <div className="mx-auto max-w-4xl space-y-6">
          {badge && (
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              {badge}
            </span>
          )}
          <h1
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight"
            style={{ fontFamily: headingFont }}
          >
            {headline}
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
            {subheadline}
          </p>
          <div className="pt-2 flex items-center gap-4">
            {primaryCtaText && (
              <a
                href={primaryCtaUrl}
                onClick={(e) => handleCtaClick(e, primaryCtaUrl)}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold text-white shadow transition-all hover:opacity-90 cursor-pointer"
                style={{
                  backgroundColor: accentColor,
                  borderRadius,
                }}
              >
                <span>{primaryCtaText}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </section>
    );
  }

  // 6. Split Image (Default Standard)
  return (
    <section
      className="relative overflow-hidden py-20 md:py-28 px-6"
      style={{
        background: `radial-gradient(circle at 70% 30%, ${accentColor}12 0%, ${primaryColor} 70%)`,
      }}
    >
      <div className="relative mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {badge && (
              <div
                className="mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold border backdrop-blur-sm"
                style={{
                  borderColor: `${accentColor}40`,
                  backgroundColor: `${accentColor}15`,
                  color: accentColor,
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{badge}</span>
              </div>
            )}

            <h1
              className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.1]"
              style={{ fontFamily: headingFont }}
            >
              {headline}
            </h1>

            <p className="mt-6 text-base text-slate-300 sm:text-lg max-w-xl leading-relaxed">
              {subheadline}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {primaryCtaText && (
                <a
                  href={primaryCtaUrl}
                  onClick={(e) => handleCtaClick(e, primaryCtaUrl)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white shadow-xl transition-all hover:opacity-90 active:scale-95 cursor-pointer"
                  style={{
                    backgroundColor: accentColor,
                    borderRadius,
                  }}
                >
                  <span>{primaryCtaText}</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              )}
              {secondaryCtaText && (
                <a
                  href={secondaryCtaUrl}
                  onClick={(e) => handleCtaClick(e, secondaryCtaUrl)}
                  className="inline-flex items-center px-6 py-3.5 text-sm font-semibold text-slate-200 border border-slate-700 bg-slate-900/60 backdrop-blur-sm transition-all hover:bg-slate-800 hover:text-white cursor-pointer"
                  style={{ borderRadius }}
                >
                  {secondaryCtaText}
                </a>
              )}
            </div>
          </div>

          {/* Image Column */}
          <div className="lg:col-span-5">
            {imageUrl && (
              <div
                className="overflow-hidden border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-sm group"
                style={{ borderRadius }}
              >
                <img
                  src={imageUrl}
                  alt={headline}
                  className="h-full w-full object-cover min-h-[380px] max-h-[480px] transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
