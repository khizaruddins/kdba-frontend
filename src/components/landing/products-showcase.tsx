'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, CheckCircle2, Sparkles, Tag, Plus } from 'lucide-react';
import Link from 'next/link';

interface ProductCard {
  id: string;
  name: string;
  category: string;
  price: string;
  currency: string;
  description: string;
  image: string;
  badge?: string;
  ctaText: string;
}

const SAMPLE_PRODUCTS: ProductCard[] = [
  {
    id: 'prod-1',
    name: 'Brand Identity & Design System',
    category: 'Consulting Service',
    price: '$3,500',
    currency: 'USD',
    description: 'Complete visual identity guide, logo suite, typography hierarchy, and scalable vector assets.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=80',
    badge: 'Popular Service',
    ctaText: 'Book Consultation',
  },
  {
    id: 'prod-2',
    name: '7-Course Autumn Truffle Tasting',
    category: 'Dining Experience',
    price: '$165',
    currency: 'USD',
    description: 'Artisanal seasonal tasting menu with wild Alba white truffles, dry-aged beef, and wine pairing.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    badge: 'Signature',
    ctaText: 'Reserve Experience',
  },
  {
    id: 'prod-3',
    name: 'Enterprise M&A Valuation Package',
    category: 'Financial Advisory',
    price: '$7,500',
    currency: 'USD',
    description: 'Comprehensive financial modeling, DCF valuation, and strategic negotiation dossier for acquisitions.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    badge: 'Executive',
    ctaText: 'Request Retainer',
  },
  {
    id: 'prod-4',
    name: 'Handcrafted Walnut Ergonomic Chair',
    category: 'Physical Product',
    price: '$890',
    currency: 'USD',
    description: 'Kiln-dried solid American walnut with hand-stitched Italian leather upholstery and brass accents.',
    image: 'https://images.unsplash.com/photo-1580481077195-c3a82104536b?w=800&auto=format&fit=crop&q=80',
    badge: 'Limited Edition',
    ctaText: 'Order Direct',
  },
];

export function ProductsShowcase() {
  return (
    <section className="relative py-28 px-6 border-t border-slate-800/80 bg-slate-950 overflow-hidden">
      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Commerce & Catalog Engine</span>
          </div>

          <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl leading-[1.08]">
            Show what you sell.
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Showcase your products, services, pricing, and offers with sections designed to make your business easy to understand.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAMPLE_PRODUCTS.map((prod) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/90"
            >
              <div className="space-y-4">
                {/* Image Frame */}
                <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-950">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {prod.badge && (
                    <div className="absolute top-2.5 left-2.5">
                      <span className="rounded-md bg-slate-950/80 border border-slate-700 px-2 py-0.5 text-[10px] font-bold text-amber-400 backdrop-blur-md">
                        {prod.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2 px-1">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    {prod.category}
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors line-clamp-1">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                </div>
              </div>

              {/* Price & CTA Footer */}
              <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between px-1">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Price</div>
                  <div className="text-base font-black text-emerald-400 font-mono">
                    {prod.price}
                  </div>
                </div>

                <Link href="/register">
                  <button className="flex items-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3.5 py-2 transition-colors cursor-pointer">
                    <span>{prod.ctaText}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature footnote */}
        <div className="mt-12 text-center text-xs text-slate-400">
          <span>Manage images, inventory pricing, and call-to-action buttons directly from your unified KDBA dashboard.</span>
        </div>
      </div>
    </section>
  );
}
