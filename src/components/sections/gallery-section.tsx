'use client';

import * as React from 'react';
import { SectionProps } from './section-renderer';

export function GallerySection({ config, theme }: SectionProps) {
  const badge = config.badge || 'Gallery';
  const headline = config.headline || 'Visual Showcase';
  const images = config.images || [
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&auto=format&fit=crop&q=80',
  ];

  const accentColor = theme?.accentColor || '#6366f1';

  return (
    <section className="py-20 px-6 border-t border-slate-800/80 bg-slate-950/60">
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img: string, idx: number) => (
            <div
              key={idx}
              className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-md group"
            >
              <img
                src={img}
                alt={`Gallery image ${idx + 1}`}
                className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
