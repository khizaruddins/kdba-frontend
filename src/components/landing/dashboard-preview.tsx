'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Globe, Users, ShoppingBag, Image as ImageIcon, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function DashboardPreview() {
  return (
    <section className="relative py-28 px-6 bg-[#090D16]">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16 px-6 lg:px-12">
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-normal tracking-[-0.03em] text-white leading-[1.1]">
            Everything your website needs.<br/>
            <span className="text-slate-500">In one place.</span>
          </h2>
          <p className="text-[17px] text-slate-400 max-w-xl">
            Manage your live websites, custom brand assets, digital catalog, and incoming customer leads from a unified, modern dashboard.
          </p>
        </div>

        {/* Studio Dashboard Visual Representation */}
        <div className="mx-6 lg:mx-12 overflow-hidden rounded-2xl border border-white/10 bg-[#0f1422] p-6 sm:p-10 space-y-8 shadow-sm">
          {/* Top Bar Status */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 font-bold text-white text-[15px] border border-white/10">
                K
              </div>
              <div>
                <div className="text-[15px] font-semibold text-white">Aurelia Studio Workspace</div>
                <div className="text-[12px] text-slate-400 mt-0.5">Production SaaS Environment • Starter Tier</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[12px] font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Production Live</span>
              </div>

              <Link href="/register">
                <button className="flex items-center gap-1.5 rounded-full bg-white text-black px-5 py-2 text-[12px] font-semibold transition-colors hover:bg-slate-200 cursor-pointer">
                  <span>Enter Studio</span>
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </Link>
            </div>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-white/5 bg-[#141a2a] p-6 space-y-2 transition-colors hover:bg-[#182033]">
              <div className="flex items-center justify-between text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                <span>Live Website</span>
                <Globe className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-semibold text-white tracking-tight">1 Active</div>
              <div className="text-[12px] text-indigo-400 font-medium">kdba.site/aurelia</div>
            </div>

            <div className="rounded-xl border border-white/5 bg-[#141a2a] p-6 space-y-2 transition-colors hover:bg-[#182033]">
              <div className="flex items-center justify-between text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                <span>Customer Inquiries</span>
                <Users className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-semibold text-white tracking-tight">18 Inbound</div>
              <div className="text-[12px] text-slate-400">3 new inquiries today</div>
            </div>

            <div className="rounded-xl border border-white/5 bg-[#141a2a] p-6 space-y-2 transition-colors hover:bg-[#182033]">
              <div className="flex items-center justify-between text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                <span>Catalog Items</span>
                <ShoppingBag className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-semibold text-white tracking-tight">8 Products</div>
              <div className="text-[12px] text-slate-400">Services & Tier Packages</div>
            </div>

            <div className="rounded-xl border border-white/5 bg-[#141a2a] p-6 space-y-2 transition-colors hover:bg-[#182033]">
              <div className="flex items-center justify-between text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                <span>CDN Media Assets</span>
                <ImageIcon className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-semibold text-white tracking-tight">24 Assets</div>
              <div className="text-[12px] text-slate-400">High-Speed Edge Storage</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
