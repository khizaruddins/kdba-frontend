'use client';

import * as React from 'react';
import { SectionProps } from './section-renderer';
import { ArrowRight, Sparkles } from 'lucide-react';

export function HeroSection({
  config,
  theme,
  isEditing,
  onNavigate,
}: SectionProps) {
  const badge = config.badge;
  const headline = config.headline || 'Build High-Impact Digital Experiences';
  const subheadline =
    config.subheadline ||
    'Grow your brand with custom strategies, enterprise engineering, and design excellence.';
  const primaryCtaText = config.primaryCtaText || 'Get Started';
  const primaryCtaUrl = config.primaryCtaUrl || '/contact';
  const secondaryCtaText = config.secondaryCtaText;
  const secondaryCtaUrl = config.secondaryCtaUrl || '#services';
  const alignment = config.alignment || 'center';
  const imageUrl = config.imageUrl;

  const accentColor = theme?.accentColor || '#6366f1';
  const primaryColor = theme?.primaryColor || '#0f172a';

  const handleCtaClick = (e: React.MouseEvent, url: string) => {
    if (url.startsWith('#')) return; // let smooth anchor scroll handle
    e.preventDefault();
    if (onNavigate) {
      onNavigate(url);
    }
  };

  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  }[alignment as 'left' | 'center' | 'right'] || 'text-center items-center mx-auto';

  return (
    <section
      className="relative overflow-hidden py-24 md:py-32 px-6"
      style={{
        background: `radial-gradient(circle at 50% 20%, ${accentColor}15 0%, ${primaryColor} 80%)`,
      }}
    >
      {/* Background glow orb */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[600px] rounded-full opacity-20 blur-[100px]"
        style={{ backgroundColor: accentColor }}
      />

      <div className="relative mx-auto max-w-5xl">
        <div className={`flex flex-col ${alignClasses} max-w-3xl`}>
          {/* Badge */}
          {badge && (
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-medium border backdrop-blur-sm"
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

          {/* Main Headline */}
          <h1
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.1]"
            style={{
              fontFamily: theme?.headingFont || 'inherit',
            }}
          >
            {headline}
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg text-slate-300 sm:text-xl max-w-2xl leading-relaxed">
            {subheadline}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {primaryCtaText && (
              <a
                href={primaryCtaUrl}
                onClick={(e) => handleCtaClick(e, primaryCtaUrl)}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: accentColor,
                  borderRadius: theme?.borderRadius || '8px',
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
                className="inline-flex items-center rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-sm transition-all hover:bg-slate-800 hover:text-white cursor-pointer"
                style={{
                  borderRadius: theme?.borderRadius || '8px',
                }}
              >
                {secondaryCtaText}
              </a>
            )}
          </div>
        </div>

        {/* Hero Image Showcase */}
        {imageUrl && (
          <div className="mt-14 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-sm">
            <img
              src={imageUrl}
              alt={headline}
              className="h-auto w-full max-h-[500px] object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
