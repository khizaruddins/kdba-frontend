'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HeroBuilderDemo } from './hero-builder-demo';

export function LandingHero() {
  return (
    <section className="relative pt-40 pb-24 px-6">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Hero Copy & Headlines */}
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[13px] font-medium text-slate-300">
            KDBA V3 — Advanced Visual Builder
          </div>

          <h1 className="text-[clamp(3rem,6vw,5.5rem)] font-normal tracking-[-0.03em] text-white leading-[1.05]">
            Build your <span className="text-slate-500">digital home.</span>
          </h1>

          <p className="text-[17px] text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A professional visual website builder with real-time drag-and-drop, modern layouts, precision typography, and instant publishing.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button
                size="lg"
                className="h-12 px-8 rounded-full bg-white text-black font-semibold text-[14px] hover:bg-slate-200 transition-colors cursor-pointer shadow-none"
              >
                Start Building Free
              </Button>
            </Link>

            <a href="#templates">
              <Button 
                variant="outline"
                size="lg"
                className="h-12 px-8 rounded-full bg-transparent border-white/20 text-white font-medium text-[14px] hover:bg-white/5 transition-colors cursor-pointer"
              >
                Explore Templates
              </Button>
            </a>
          </div>

          <div className="text-[13px] text-slate-500 pt-2">
            No coding required. Free 30-day trial.
          </div>
        </div>

        {/* Hero Interactive Visual Canvas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-20 max-w-[1100px] mx-auto"
        >
          <HeroBuilderDemo />
        </motion.div>
      </div>
    </section>
  );
}
