'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutTemplate,
  Palette,
  Image as ImageIcon,
  ShoppingBag,
  CreditCard,
  Users,
  Smartphone,
  Globe,
} from 'lucide-react';
import Link from 'next/link';

export function FeatureBentoGrid() {
  return (
    <section id="features" className="relative py-28 px-6 bg-[#090D16]">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16 px-6 lg:px-12">
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-normal tracking-[-0.03em] text-white leading-[1.1]">
            Everything your brand needs.<br/>
            <span className="text-slate-500">In one place.</span>
          </h2>
          <p className="text-[17px] text-slate-400 max-w-xl">
            From design templates and custom branding to digital commerce and lead management.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 lg:px-12">
          {/* Card 1: Curated Templates (Large 2-col) */}
          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-[#0f1422] p-8 space-y-8 shadow-sm transition-colors hover:bg-[#121828] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 border border-white/10">
                <LayoutTemplate className="h-5 w-5" />
              </div>
              <h3 className="text-[19px] font-semibold text-white tracking-tight">
                Curated Design Foundations
              </h3>
              <p className="text-[14px] text-slate-400 leading-relaxed">
                Start from vetted templates tailored for agencies, restaurants, corporate advisors, and creators. Every template includes Home, About, and Contact pages with section hierarchies.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-[12px] font-medium text-slate-300">
              <span className="rounded bg-black/40 border border-white/5 px-2.5 py-1">Agency Minimalist</span>
              <span className="rounded bg-black/40 border border-white/5 px-2.5 py-1">Artisanal Bistro</span>
              <span className="rounded bg-black/40 border border-white/5 px-2.5 py-1">Corporate Advisory</span>
              <span className="rounded bg-black/40 border border-white/5 px-2.5 py-1">Creator Showcase</span>
            </div>
          </div>

          {/* Card 2: Brand Kit */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1422] p-8 space-y-6 shadow-sm transition-colors hover:bg-[#121828] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 border border-white/10">
                <Palette className="h-5 w-5" />
              </div>
              <h3 className="text-[17px] font-semibold text-white tracking-tight">
                Unified Brand Kit
              </h3>
              <p className="text-[14px] text-slate-400 leading-relaxed">
                Synchronize your logo, primary palette, typography hierarchy, and button border radiuses across every page automatically.
              </p>
            </div>
          </div>

          {/* Card 3: Media Library & CDN */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1422] p-8 space-y-6 shadow-sm transition-colors hover:bg-[#121828] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 border border-white/10">
                <ImageIcon className="h-5 w-5" />
              </div>
              <h3 className="text-[17px] font-semibold text-white tracking-tight">
                High-Speed Media CDN
              </h3>
              <p className="text-[14px] text-slate-400 leading-relaxed">
                Upload brand photography, menus, and client assets with automatic high-speed CDN delivery and responsive resolution scaling.
              </p>
            </div>
          </div>

          {/* Card 4: Products & Services */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1422] p-8 space-y-6 shadow-sm transition-colors hover:bg-[#121828] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 border border-white/10">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <h3 className="text-[17px] font-semibold text-white tracking-tight">
                Products & Catalog
              </h3>
              <p className="text-[14px] text-slate-400 leading-relaxed">
                Showcase physical merchandise, culinary dishes, or consulting packages with custom price tags and direct order buttons.
              </p>
            </div>
          </div>

          {/* Card 5: Pricing Plans */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1422] p-8 space-y-6 shadow-sm transition-colors hover:bg-[#121828] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 border border-white/10">
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="text-[17px] font-semibold text-white tracking-tight">
                Tiered Pricing Tables
              </h3>
              <p className="text-[14px] text-slate-400 leading-relaxed">
                Present membership tiers, retainer options, or monthly subscriptions with recommended badges and feature checklists.
              </p>
            </div>
          </div>

          {/* Card 6: Leads & CRM Pipeline (Large 2-col) */}
          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-[#0f1422] p-8 space-y-8 shadow-sm transition-colors hover:bg-[#121828] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 border border-white/10">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-[19px] font-semibold text-white tracking-tight">
                Integrated Inbound Leads CRM
              </h3>
              <p className="text-[14px] text-slate-400 leading-relaxed">
                Every booking and consultation request submitted through your live website contact form is captured into your workspace with customer contact info, timestamps, and status pipelines.
              </p>
            </div>
          </div>

          {/* Card 7: 100% Mobile Responsive */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1422] p-8 space-y-6 shadow-sm transition-colors hover:bg-[#121828] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 border border-white/10">
                <Smartphone className="h-5 w-5" />
              </div>
              <h3 className="text-[17px] font-semibold text-white tracking-tight">
                Adaptive Responsive
              </h3>
              <p className="text-[14px] text-slate-400 leading-relaxed">
                Automatic mobile navigation drawers, touch-optimized button targets, and fluid responsive font scaling.
              </p>
            </div>
          </div>

          {/* Card 8: SEO & OpenGraph Ready */}
          <div className="md:col-span-3 lg:col-span-4 rounded-2xl border border-white/10 bg-[#0f1422] p-8 space-y-6 shadow-sm transition-colors hover:bg-[#121828] flex flex-col sm:flex-row sm:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 border border-white/10">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="text-[19px] font-semibold text-white tracking-tight">
                Built-In SEO Meta & Social OpenGraph
              </h3>
              <p className="text-[14px] text-slate-400 leading-relaxed">
                Configure your custom page SEO title, search meta descriptions, and social preview cards so your business looks immaculate when shared across Twitter, LinkedIn, and messaging apps.
              </p>
            </div>

            <Link href="/register" className="shrink-0">
              <button className="flex items-center gap-2 rounded-full bg-white text-black font-semibold text-[14px] px-8 py-3.5 transition-colors cursor-pointer hover:bg-slate-200">
                <span>Start Building Free</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
