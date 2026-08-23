'use client';

import * as React from 'react';
import { SectionProps } from './section-renderer';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export function ProductsSection({
  config,
  theme,
  products = [],
  onNavigate,
}: SectionProps) {
  const badge = config.badge || 'Products';
  const headline = config.headline || 'Featured Products';
  const subheadline = config.subheadline;

  const accentColor = theme?.accentColor || '#6366f1';

  // Determine which products to display
  let displayProducts: any[] = [];

  if (products && products.length > 0) {
    if (
      Array.isArray(config.selectedProductIds) &&
      config.selectedProductIds.length > 0
    ) {
      // Map in user-defined order
      displayProducts = config.selectedProductIds
        .map((id: string) => products.find((p) => p.id === id))
        .filter(Boolean);
      // Fallback if none matched
      if (displayProducts.length === 0) displayProducts = products;
    } else {
      displayProducts = products;
    }
  } else if (Array.isArray(config.customProducts) && config.customProducts.length > 0) {
    displayProducts = config.customProducts;
  } else {
    displayProducts = [
      {
        id: 'sample-1',
        name: 'Artisan Wood-Fired Sourdough',
        description: 'Handcrafted daily using organic heirloom flour and stone milling.',
        price: 14.0,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        category: 'Bakery',
        ctaText: 'Order Now',
        ctaUrl: '#contact',
      },
      {
        id: 'sample-2',
        name: 'Prime Truffle Risotto',
        description: 'Acquerello carnaroli rice with shaved winter black truffles.',
        price: 36.0,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=600&auto=format&fit=crop&q=80',
        category: 'Entrees',
        ctaText: 'Order Now',
        ctaUrl: '#contact',
      },
      {
        id: 'sample-3',
        name: 'Valrhona Dark Chocolate Ganache',
        description: 'Warm chocolate sphere served with hazelnut crunch gelato.',
        price: 18.0,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80',
        category: 'Desserts',
        ctaText: 'Order Now',
        ctaUrl: '#contact',
      },
    ];
  }

  return (
    <section id="products" className="py-20 px-6 border-t border-slate-800/80 bg-slate-950/60">
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

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg transition-all hover:-translate-y-1 hover:border-slate-700 flex flex-col"
              style={{ borderRadius: theme?.borderRadius || '16px' }}
            >
              {/* Product Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-600">
                    <ShoppingBag className="h-10 w-10" />
                  </div>
                )}
                {product.category && (
                  <span className="absolute top-3 left-3 rounded-full bg-slate-950/80 px-2.5 py-1 text-[11px] font-semibold text-slate-200 backdrop-blur-sm">
                    {product.category}
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold text-white">
                      {product.name}
                    </h3>
                    <span
                      className="text-lg font-bold"
                      style={{ color: accentColor }}
                    >
                      {formatCurrency(product.price, product.currency || 'USD')}
                    </span>
                  </div>

                  {product.description && (
                    <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>

                <a
                  href={product.ctaUrl || '/contact'}
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate(product.ctaUrl || '/contact');
                  }}
                  className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-700 active:scale-95 cursor-pointer"
                >
                  <span>{product.ctaText || 'Inquire Now'}</span>
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
