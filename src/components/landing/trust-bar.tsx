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
    <section className="relative py-12 px-6 border-y border-white/5 bg-[#090D16]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Anchor Statement */}
          <div className="text-center lg:text-left space-y-1 shrink-0 max-w-xs">
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Purpose-Built Platform
            </div>
            <p className="text-sm font-medium text-white">
              Engineered for businesses that want a premium online presence.
            </p>
          </div>

          {/* Industry Capability Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {industries.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors"
                >
                  <Icon className="h-3.5 w-3.5 text-slate-400" />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>

          {/* Core Value Pillar */}
          <div className="hidden xl:flex items-center gap-4 text-[13px] font-medium text-slate-500 shrink-0 border-l border-white/10 pl-8">
            <span className="text-white">Create once.</span>
            <span>•</span>
            <span className="text-white">Customize easily.</span>
            <span>•</span>
            <span className="text-white">Publish instantly.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
