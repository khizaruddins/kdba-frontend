'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Tablet, Smartphone, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export function ResponsiveSection() {
  const [device, setDevice] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  return (
    <section className="relative py-28 px-6 border-t border-slate-800/80 bg-slate-950 overflow-hidden">
      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-400">
            <Monitor className="h-3.5 w-3.5" />
            <span>Responsive Layout Engine</span>
          </div>

          <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl leading-[1.08]">
            Beautiful everywhere.
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Every template is engineered to adapt smoothly to desktop screens, iPads, and mobile smartphones without manual breakpoint tweaking.
          </p>

          {/* Device Tabs */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setDevice('desktop')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                device === 'desktop'
                  ? 'bg-white text-slate-950 shadow-lg shadow-white/10 scale-105'
                  : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="h-4 w-4" />
              <span>Desktop (1920px)</span>
            </button>

            <button
              onClick={() => setDevice('tablet')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                device === 'tablet'
                  ? 'bg-white text-slate-950 shadow-lg shadow-white/10 scale-105'
                  : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Tablet className="h-4 w-4" />
              <span>Tablet (768px)</span>
            </button>

            <button
              onClick={() => setDevice('mobile')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                device === 'mobile'
                  ? 'bg-white text-slate-950 shadow-lg shadow-white/10 scale-105'
                  : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="h-4 w-4" />
              <span>Mobile (375px)</span>
            </button>
          </div>
        </div>

        {/* Viewport Canvas Simulation */}
        <div className="flex justify-center">
          <motion.div
            layout
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              width:
                device === 'desktop'
                  ? '1000px'
                  : device === 'tablet'
                  ? '680px'
                  : '340px',
              maxWidth: '100%',
            }}
            className="overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900 shadow-2xl p-6 sm:p-8 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white">Aurelia Studio</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Viewport: {device.toUpperCase()}
              </span>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-950 p-6 space-y-3 border border-slate-800 text-left">
                <div className="text-xs font-bold text-amber-400">Design & Engineering Studio</div>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  Crafting resilient digital brand foundations for modern scale.
                </h3>
                <p className="text-xs text-slate-400">
                  Custom web applications, design systems, and enterprise brand strategies.
                </p>
                <div className="pt-2">
                  <button className="rounded-xl bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-black">
                    Explore Studio Work &rarr;
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1">
                  <div className="text-[11px] font-bold text-white">Full-Stack Strategy</div>
                  <div className="text-[10px] text-slate-400">From $3,500/project</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1">
                  <div className="text-[11px] font-bold text-white">Continuous Retainer</div>
                  <div className="text-[10px] text-slate-400">From $1,800/month</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
