'use client';

import * as React from 'react';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { ThemeConfig, BusinessInfo } from '@/types';

export interface ProductsProps {
  id?: string;
  variant?: string;
  props?: Record<string, any>;
  theme?: Partial<ThemeConfig>;
  business?: Partial<BusinessInfo> | null;
  isEditing?: boolean;
  onNavigate?: (url: string) => void;
}

export function ProductsSection({
  variant = 'grid',
  props = {},
  theme,
  onNavigate,
}: ProductsProps) {
  const badge = props.badge || 'Catalog & Menu';
  const headline = props.headline || 'Curated Selections & Offerings';
  const subheadline =
    props.subheadline ||
    'Explore our latest items, crafted with premium materials and exacting standards.';
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

  // Restaurant Menu List Variant
  if (variant === 'menu-list') {
    return (
      <section id="menu" className="py-20 md:py-28 px-6 border-t border-slate-800/80 bg-slate-900/40">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            {badge && (
              <span
                className="text-xs font-bold uppercase tracking-widest block mb-3"
                style={{ color: accentColor }}
              >
                {badge}
              </span>
            )}
            <h2
              className="text-3xl font-bold tracking-tight text-white sm:text-5xl font-serif"
              style={{ fontFamily: headingFont }}
            >
              {headline}
            </h2>
            {subheadline && (
              <p className="mt-3 text-slate-400 text-sm sm:text-base">{subheadline}</p>
            )}
          </div>

          <div className="space-y-6">
            {items.map((item: any, idx: number) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-6 pb-6 border-b border-slate-800/80 group"
              >
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-slate-200">
                      {item.name}
                    </h3>
                    <span
                      className="text-base font-bold font-mono shrink-0"
                      style={{ color: accentColor }}
                    >
                      {item.price}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Standard Product Cards Grid
  return (
    <section id="products" className="py-20 md:py-28 px-6 border-t border-slate-800/80 bg-slate-900/30">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((prod: any, idx: number) => (
            <div
              key={idx}
              className="group overflow-hidden border border-slate-800 bg-slate-900/80 shadow-md hover:border-slate-700 hover:shadow-2xl transition-all flex flex-col justify-between"
              style={{ borderRadius }}
            >
              <div>
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                  {prod.imageUrl ? (
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-600">
                      <ShoppingBag className="h-12 w-12" />
                    </div>
                  )}

                  {prod.price && (
                    <div className="absolute top-3 right-3 rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold text-white border border-white/10">
                      {prod.price}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white group-hover:text-slate-200">
                    {prod.name}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {prod.description}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 pt-0">
                <a
                  href={prod.ctaUrl || '/contact'}
                  onClick={(e) => handleAction(e, prod.ctaUrl || '/contact')}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold text-white shadow transition-all hover:opacity-90 active:scale-95 cursor-pointer"
                  style={{ backgroundColor: accentColor }}
                >
                  <span>{prod.ctaText || 'Order Now'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
