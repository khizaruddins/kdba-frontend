'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
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
    <section className="relative py-28 px-6 border-y border-white/5 bg-[#090D16]">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16 px-6 lg:px-12">
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-normal tracking-[-0.03em] text-white leading-[1.1]">
            Show what you sell.
          </h2>
          <p className="text-[17px] text-slate-400 max-w-xl">
            Showcase your products, services, pricing, and offers with sections designed to make your business easy to understand.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 lg:px-12">
          {SAMPLE_PRODUCTS.map((prod) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0f1422] p-4 transition-all duration-300 hover:bg-[#121828]"
            >
              <div className="space-y-4">
                {/* Image Frame */}
                <div className="relative h-48 w-full overflow-hidden rounded-xl bg-black">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {prod.badge && (
                    <div className="absolute top-3 left-3">
                      <span className="rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] font-medium text-slate-200 backdrop-blur-md">
                        {prod.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2 px-1">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    {prod.category}
                  </div>
                  <h3 className="text-[15px] font-semibold text-white tracking-tight line-clamp-1">
                    {prod.name}
                  </h3>
                  <p className="text-[13px] text-slate-400 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                </div>
              </div>

              {/* Price & CTA Footer */}
              <div className="pt-5 mt-5 border-t border-white/5 flex items-center justify-between px-1">
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-500">Price</div>
                  <div className="text-[15px] font-medium text-white">
                    {prod.price}
                  </div>
                </div>

                <Link href="/register">
                  <button className="flex items-center gap-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-[12px] px-4 py-2 transition-colors cursor-pointer">
                    <span>{prod.ctaText}</span>
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature footnote */}
        <div className="mt-12 text-center text-[13px] text-slate-500">
          <span>Manage images, inventory pricing, and calls-to-action directly from your unified KDBA dashboard.</span>
        </div>
      </div>
    </section>
  );
}
