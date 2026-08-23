'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Zap, Cpu, Server, Globe, Gauge, CheckCircle2 } from 'lucide-react';

export function SpeedArchitecture() {
  const pillars = [
    {
      title: 'Static Edge Compilation',
      desc: 'Published websites are pre-rendered into static HTML and delivered directly from global edge caches with sub-50ms TTFB.',
      icon: Server,
    },
    {
      title: 'Modern React Architecture',
      desc: 'Built on Next.js Turbopack engine for optimized execution and clean component tree hydration.',
      icon: Cpu,
    },
    {
      title: 'Optimized Media & CDN',
      desc: 'Images uploaded to your media library are automatically served in modern WebP formats with responsive srcsets.',
      icon: Globe,
    },
    {
      title: 'Minimal Client Overhead',
      desc: 'No heavy bloated runtime trackers or unoptimized theme bundles. Only the clean code your site actually needs.',
      icon: Gauge,
    },
  ];

  return (
    <section className="relative py-28 px-6 border-t border-slate-800/80 bg-slate-950 overflow-hidden">
      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Zap className="h-3.5 w-3.5" />
            <span>Architecture & Performance</span>
          </div>

          <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl leading-[1.08]">
            Built to be fast.
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Engineered from first principles with modern edge caching, minimal JavaScript payloads, and responsive image pipelines.
          </p>
        </div>

        {/* 4 Architecture Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-xl hover:border-slate-700 hover:bg-slate-900/90 transition-all"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
