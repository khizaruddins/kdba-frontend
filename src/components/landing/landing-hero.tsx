'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroBuilderDemo } from './hero-builder-demo';

export function LandingHero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Dynamic Background Mesh Gradients */}
      <div className="pointer-events-none absolute inset-0 flex justify-center overflow-hidden">
        <div className="absolute -top-40 h-[650px] w-[1000px] rounded-full bg-gradient-to-tr from-amber-500/15 via-indigo-600/15 to-purple-600/10 blur-[150px]" />
        <div className="absolute top-1/2 left-1/4 h-[400px] w-[500px] rounded-full bg-indigo-500/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Hero Copy & Headlines */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold text-indigo-400 backdrop-blur-md shadow-inner"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>KDBA V3 — Wix-Grade Visual Drag-and-Drop Website Builder</span>
          </motion.div>

          {/* Master Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.06]"
          >
            Drag. Drop. Design. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-white via-indigo-200 to-amber-300 bg-clip-text text-transparent">
              Visual building at the caliber of Wix.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            A studio-grade visual website builder with real-time drag-and-drop, 3D box model spacing, precision typography, device overrides, and instant one-click publishing.
          </motion.p>

          {/* Dual Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-slate-950 font-black shadow-xl shadow-amber-500/25 px-7 py-3.5 rounded-2xl text-sm transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <span>Start Building Free</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <a href="#templates">
              <button className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-3 text-sm font-bold text-slate-200 hover:bg-slate-800 hover:text-white transition-all cursor-pointer backdrop-blur-md">
                <span>Explore Templates</span>
                <span className="text-amber-400">&rarr;</span>
              </button>
            </a>
          </motion.div>

          {/* Trust Footnote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xs text-slate-400 font-medium"
          >
            No coding. No design experience required. 30-day free trial included.
          </motion.div>
        </div>

        {/* Hero Interactive Visual Canvas */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-14"
        >
          <HeroBuilderDemo />
        </motion.div>
      </div>
    </section>
  );
}
