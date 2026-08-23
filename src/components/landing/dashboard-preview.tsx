'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Globe, Users, ShoppingBag, Image as ImageIcon, CheckCircle2, ArrowUpRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function DashboardPreview() {
  return (
    <section className="relative py-28 px-6 border-t border-slate-800/80 bg-slate-950 overflow-hidden">
      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Unified Control Center</span>
          </div>

          <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl leading-[1.08]">
            Everything your website needs.{' '}
            <span className="bg-gradient-to-r from-white via-slate-200 to-amber-300 bg-clip-text text-transparent">
              In one place.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Manage your live websites, custom brand assets, digital catalog, and incoming customer leads from a unified, modern dashboard.
          </p>
        </div>

        {/* Studio Dashboard Visual Representation */}
        <div className="overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900/90 shadow-2xl p-6 sm:p-10 space-y-8 backdrop-blur-2xl">
          {/* Top Bar Status */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 font-black text-slate-950 text-base">
                K
              </div>
              <div>
                <div className="text-base font-extrabold text-white">Aurelia Studio Workspace</div>
                <div className="text-xs text-slate-400">Production SaaS Environment • Starter Tier</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Production Live</span>
              </div>

              <Link href="/register">
                <button className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer border border-slate-700">
                  <span>Enter Studio</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            </div>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Live Website</span>
                <Globe className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white">1 Active</div>
              <div className="text-[11px] text-emerald-400 font-semibold">kdba.site/aurelia</div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Customer Inquiries</span>
                <Users className="h-4 w-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">18 Inbound</div>
              <div className="text-[11px] text-slate-400">3 new inquiries today</div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Catalog Items</span>
                <ShoppingBag className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">8 Products</div>
              <div className="text-[11px] text-slate-400">Services & Tier Packages</div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>CDN Media Assets</span>
                <ImageIcon className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-white">24 Assets</div>
              <div className="text-[11px] text-slate-400">High-Speed Edge Storage</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
