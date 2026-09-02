'use client';

import * as React from 'react';
import { Sparkles, Eye } from 'lucide-react';
import { ThemeConfig, BusinessInfo } from '@/types';

export interface GalleryProps {
  id?: string;
  variant?: string;
  props?: Record<string, any>;
  theme?: Partial<ThemeConfig>;
  business?: Partial<BusinessInfo> | null;
  isEditing?: boolean;
}

export function GallerySection({
  variant = 'grid',
  props = {},
  theme,
}: GalleryProps) {
  const badge = props.badge || 'Visual Showcase';
  const headline = props.headline || 'Atmosphere & Visual Craft';
  const images = props.images || [];

  const accentColor = theme?.accentColor || 'var(--kdba-accent, #6366f1)';
  const headingFont = theme?.headingFont || 'var(--kdba-heading-font, inherit)';
  const borderRadius = theme?.borderRadius || 'var(--kdba-radius, 16px)';

  return (
    <section id="gallery" className="py-20 md:py-28 px-6 border-t border-slate-800/80 bg-slate-900/30">
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
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((imgUrl: string, idx: number) => (
            <div
              key={idx}
              className="group relative overflow-hidden border border-slate-800 bg-slate-950 aspect-square shadow-lg"
              style={{ borderRadius }}
            >
              <img
                src={imgUrl}
                alt={`Gallery visual ${idx + 1}`}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-950 shadow-xl"
                >
                  <Eye className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
