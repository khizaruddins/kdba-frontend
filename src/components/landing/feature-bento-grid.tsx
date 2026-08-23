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
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export function FeatureBentoGrid() {
  return (
    <section id="features" className="relative py-28 px-6 border-t border-slate-800/80 bg-slate-950/90 overflow-hidden">
      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Platform Capabilities</span>
          </div>

          <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl leading-[1.08]">
            Everything your brand needs.{' '}
            <span className="bg-gradient-to-r from-amber-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              In one place.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            From design templates and custom branding to digital commerce and lead management.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Card 1: Curated Templates (Large 2-col) */}
          <div className="md:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-6 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <LayoutTemplate className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Curated Design Foundations
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Start from vetted templates tailored for agencies, restaurants, corporate advisors, and creators. Every template includes Home, About, and Contact pages with section hierarchies.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 flex flex-wrap gap-2 text-[11px] font-mono text-slate-300">
              <span className="rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1">Agency Minimalist</span>
              <span className="rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1">Artisanal Bistro</span>
              <span className="rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1">Corporate Advisory</span>
              <span className="rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1">Creator Showcase</span>
            </div>
          </div>

          {/* Card 2: Brand Kit */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-4 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Palette className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Unified Brand Kit
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Synchronize your logo, primary palette, typography hierarchy, and button border radiuses across every page automatically.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <span className="h-4 w-4 rounded-full bg-amber-500 ring-2 ring-white/20" />
              <span className="h-4 w-4 rounded-full bg-indigo-500 ring-2 ring-white/20" />
              <span className="h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white/20" />
              <span className="h-4 w-4 rounded-full bg-rose-500 ring-2 ring-white/20" />
            </div>
          </div>

          {/* Card 3: Media Library & CDN */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-4 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ImageIcon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                High-Speed Media CDN
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload brand photography, menus, and client assets with automatic high-speed CDN delivery and responsive resolution scaling.
              </p>
            </div>

            <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Optimized WebP Delivery</span>
            </div>
          </div>

          {/* Card 4: Products & Services */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-4 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Products & Catalog
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Showcase physical merchandise, culinary dishes, or consulting packages with custom price tags and direct order buttons.
              </p>
            </div>

            <div className="text-[11px] font-mono text-purple-400">
              Instant Grid & Card Layouts
            </div>
          </div>

          {/* Card 5: Pricing Plans */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-4 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Tiered Pricing Tables
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Present membership tiers, retainer options, or monthly subscriptions with recommended badges and feature checklists.
              </p>
            </div>

            <div className="text-[11px] font-mono text-cyan-400">
              Clear Value Matrices
            </div>
          </div>

          {/* Card 6: Leads & CRM Pipeline (Large 2-col) */}
          <div className="md:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-6 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Integrated Inbound Leads CRM
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Every booking and consultation request submitted through your live website contact form is captured into your workspace with customer contact info, timestamps, and status pipelines.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" /> Direct Email Alerts
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-indigo-400 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" /> Pipeline Status Tracking
              </span>
            </div>
          </div>

          {/* Card 7: 100% Mobile Responsive */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-4 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Smartphone className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Adaptive Responsive
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatic mobile navigation drawers, touch-optimized button targets, and fluid responsive font scaling.
              </p>
            </div>

            <div className="text-[11px] font-mono text-rose-400">
              Desktop • Tablet • Mobile
            </div>
          </div>

          {/* Card 8: SEO & OpenGraph Ready */}
          <div className="md:col-span-3 lg:col-span-3 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-4 shadow-xl hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Built-In SEO Meta & Social OpenGraph
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Configure your custom page SEO title, search meta descriptions, and social preview cards so your business looks immaculate when shared across Twitter, LinkedIn, and messaging apps.
              </p>
            </div>

            <Link href="/register" className="shrink-0">
              <button className="flex items-center gap-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-6 py-3 transition-colors cursor-pointer border border-slate-700">
                <span>Start Building Free</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
