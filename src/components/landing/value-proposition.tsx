'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Layers, Palette, Eye, Rocket } from 'lucide-react';

export function ValueProposition() {
  const cards = [
    {
      number: '01',
      title: 'Choose a foundation',
      description: 'Start with a professionally designed template instead of a blank canvas. Pre-built page structures for your specific industry eliminate guesswork.',
      icon: Layers,
    },
    {
      number: '02',
      title: 'Make it yours',
      description: 'Add your custom logo, high-resolution media, service offerings, physical & digital products, tiered pricing, and bespoke color palettes.',
      icon: Palette,
    },
    {
      number: '03',
      title: 'Preview everything',
      description: 'Experience how your website looks across desktop, tablet, and mobile devices in real time before publishing a single pixel live.',
      icon: Eye,
    },
    {
      number: '04',
      title: "Publish when you're ready",
      description: 'Turn your finished design into a lightning-fast live website with a single click. Deployed globally on edge infrastructure with SSL included.',
      icon: Rocket,
    },
  ];

  return (
    <section className="relative py-28 px-6 bg-[#090D16]">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16 px-6 lg:px-12">
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-normal tracking-[-0.03em] text-white leading-[1.1]">
            Your website.<br/>
            <span className="text-slate-500">Your brand. Your way.</span>
          </h2>
          <p className="text-[17px] text-slate-400 max-w-xl">
            Everything you need to launch a high-converting digital storefront or agency presence without touching code.
          </p>
        </div>

        {/* 4 Large Value Proposition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 lg:px-12">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0f1422] p-8 shadow-sm transition-all duration-300 hover:bg-[#121828]"
              >
                <div className="relative space-y-6">
                  {/* Top Bar: Number */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-semibold text-slate-600">
                      {card.number}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="space-y-4 pt-2">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold text-white tracking-tight">
                      {card.title}
                    </h3>
                    <p className="text-[15px] text-slate-400 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
