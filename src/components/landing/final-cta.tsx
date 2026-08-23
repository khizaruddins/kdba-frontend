'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Rocket, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCta() {
  return (
    <section className="relative py-32 px-6 border-t border-slate-800/80 bg-slate-950 overflow-hidden text-center">
      {/* Dynamic Ambient Background Light Rays */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="h-[500px] w-[800px] rounded-full bg-gradient-to-r from-amber-500/20 via-indigo-600/20 to-purple-600/15 blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-4xl space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-400 backdrop-blur-md shadow-inner">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Launch Your Website In Minutes</span>
        </div>

        {/* Master CTA Headline */}
        <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.08]">
          Your business deserves <br />
          <span className="bg-gradient-to-r from-amber-400 via-white to-indigo-300 bg-clip-text text-transparent">
            a better website.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
          Start with a template. Make it yours. Publish when you&apos;re ready. No coding required.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/register">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-slate-950 font-black shadow-2xl shadow-amber-500/30 px-8 py-4 rounded-2xl text-sm transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <span>Start Building Free</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <a href="#templates">
            <button className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/90 px-6 py-3.5 text-sm font-bold text-slate-200 hover:bg-slate-800 hover:text-white transition-all cursor-pointer backdrop-blur-md">
              <span>Explore Templates</span>
              <span className="text-amber-400">&rarr;</span>
            </button>
          </a>
        </div>

        {/* Trust Guarantees */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>30-Day Free Trial</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>No Credit Card Required</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Instant Edge CDN Deployment</span>
          </span>
        </div>
      </div>
    </section>
  );
}
