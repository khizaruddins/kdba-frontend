'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Layers, Palette, Eye, Rocket, CheckCircle2, ArrowRight } from 'lucide-react';

export function ValueProposition() {
  const cards = [
    {
      number: '01',
      title: 'Choose a foundation',
      description: 'Start with a professionally designed template instead of a blank canvas. Pre-built page structures for your specific industry eliminate guesswork.',
      icon: Layers,
      accent: 'from-amber-500/20 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-500/30',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      tag: 'Curation',
    },
    {
      number: '02',
      title: 'Make it yours',
      description: 'Add your custom logo, high-resolution media, service offerings, physical & digital products, tiered pricing, and bespoke color palettes.',
      icon: Palette,
      accent: 'from-indigo-500/20 via-indigo-500/5 to-transparent',
      borderColor: 'border-indigo-500/30',
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      tag: 'Brand Studio',
    },
    {
      number: '03',
      title: 'Preview everything',
      description: 'Experience how your website looks across desktop, tablet, and mobile devices in real time before publishing a single pixel live.',
      icon: Eye,
      accent: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
      borderColor: 'border-emerald-500/30',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      tag: 'Multi-Device Simulation',
    },
    {
      number: '04',
      title: "Publish when you're ready",
      description: 'Turn your finished design into a lightning-fast live website with a single click. Deployed globally on edge infrastructure with SSL included.',
      icon: Rocket,
      accent: 'from-purple-500/20 via-purple-500/5 to-transparent',
      borderColor: 'border-purple-500/30',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      tag: '1-Click Edge CDN',
    },
  ];

  return (
    <section className="relative py-28 px-6 border-t border-slate-800/80 bg-slate-950/90 overflow-hidden">
      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-400">
            <span>Core Value Architecture</span>
          </div>

          <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl leading-[1.08]">
            Your website.{' '}
            <span className="bg-gradient-to-r from-amber-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Your brand.
            </span>{' '}
            Your way.
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Everything you need to launch a high-converting digital storefront or agency presence without touching code.
          </p>
        </div>

        {/* 4 Large Value Proposition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border ${card.borderColor} bg-slate-900/60 p-8 sm:p-10 shadow-xl backdrop-blur-xl transition-all duration-300 hover:bg-slate-900/90`}
              >
                {/* Background Accent Mesh */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.accent}`}
                />

                <div className="relative space-y-6">
                  {/* Top Bar: Number + Tag */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl sm:text-4xl font-black text-slate-600">
                      {card.number}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold border ${card.badgeColor}`}
                    >
                      {card.tag}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="space-y-3 pt-2">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/80 border border-slate-700 text-white shadow-md">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-white tracking-tight">
                      {card.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Card Bottom Indicator */}
                <div className="relative mt-8 pt-6 border-t border-slate-800/80 flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Engineered for non-technical creators & businesses</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
