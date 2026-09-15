'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Server, Globe, Gauge } from 'lucide-react';

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
    <section className="relative py-28 px-6 bg-[#090D16]">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16 px-6 lg:px-12">
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-normal tracking-[-0.03em] text-white leading-[1.1]">
            Built to be fast.
          </h2>
          <p className="text-[17px] text-slate-400 max-w-xl">
            Engineered from first principles with modern edge caching, minimal JavaScript payloads, and responsive image pipelines.
          </p>
        </div>

        {/* 4 Architecture Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 lg:px-12">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="rounded-2xl border border-white/10 bg-[#0f1422] p-6 space-y-6 shadow-sm hover:bg-[#121828] transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 border border-white/10">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-[15px] font-semibold text-white tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-[13px] text-slate-400 leading-relaxed">
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
