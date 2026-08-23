'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Utensils, Briefcase, Store, Palette, Zap, Layers, Rocket } from 'lucide-react';

export function TrustBar() {
  const industries = [
    { label: 'Agencies & Studios', icon: Sparkles },
    { label: 'Dining & Restaurants', icon: Utensils },
    { label: 'Consultants & Advisors', icon: Briefcase },
    { label: 'Local Businesses', icon: Store },
    { label: 'Creators & Portfolios', icon: Palette },
    { label: 'Emerging Startups', icon: Rocket },
  ];

  return (
    <section className="relative py-12 px-6 border-y border-slate-800/80 bg-slate-950/60 backdrop-blur-md overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Anchor Statement */}
          <div className="text-center lg:text-left space-y-1 shrink-0 max-w-xs">
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400">
              Purpose-Built Platform
            </div>
            <p className="text-sm font-bold text-white">
              Built for businesses that want to look professional online.
            </p>
          </div>

          {/* Industry Capability Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {industries.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition-all shadow-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-amber-400" />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>

          {/* Core Value Pillar */}
          <div className="hidden xl:flex items-center gap-4 text-xs font-mono text-slate-400 shrink-0 border-l border-slate-800 pl-8">
            <span className="text-slate-200 font-semibold">Create once.</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">Customize easily.</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">Publish instantly.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
