'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

export function ResponsiveSection() {
  const [device, setDevice] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  return (
    <section className="relative py-28 px-6 border-y border-white/5 bg-[#090D16]">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-12 px-6 lg:px-12">
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-normal tracking-[-0.03em] text-white leading-[1.1]">
            Beautiful everywhere.
          </h2>
          <p className="text-[17px] text-slate-400 max-w-xl">
            Every template is engineered to adapt smoothly to desktop screens, iPads, and mobile smartphones without manual breakpoint tweaking.
          </p>

          {/* Device Tabs */}
          <div className="flex items-center gap-2 pt-6">
            <button
              onClick={() => setDevice('desktop')}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors cursor-pointer ${
                device === 'desktop'
                  ? 'bg-white text-black'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Monitor className="h-4 w-4" />
              <span>Desktop</span>
            </button>

            <button
              onClick={() => setDevice('tablet')}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors cursor-pointer ${
                device === 'tablet'
                  ? 'bg-white text-black'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Tablet className="h-4 w-4" />
              <span>Tablet</span>
            </button>

            <button
              onClick={() => setDevice('mobile')}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors cursor-pointer ${
                device === 'mobile'
                  ? 'bg-white text-black'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Smartphone className="h-4 w-4" />
              <span>Mobile</span>
            </button>
          </div>
        </div>

        {/* Viewport Canvas Simulation */}
        <div className="flex justify-center px-6 lg:px-12">
          <motion.div
            layout
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              width:
                device === 'desktop'
                  ? '100%'
                  : device === 'tablet'
                  ? '680px'
                  : '340px',
              maxWidth: '100%',
            }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f1422] shadow-sm p-6 sm:p-10 space-y-8 relative"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-[13px] font-semibold text-white">Aurelia Studio</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                Viewport: {device}
              </span>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-[#141a2a] p-8 space-y-4 border border-white/5 text-left">
                <div className="text-[12px] font-medium text-indigo-400 uppercase tracking-wider">Design & Engineering Studio</div>
                <h3 className="text-2xl sm:text-3xl font-semibold text-white leading-tight">
                  Crafting resilient digital brand foundations for modern scale.
                </h3>
                <p className="text-[15px] text-slate-400 max-w-lg">
                  Custom web applications, design systems, and enterprise brand strategies.
                </p>
                <div className="pt-4">
                  <button className="rounded-full bg-white text-black px-6 py-2.5 text-[13px] font-semibold transition-colors hover:bg-slate-200">
                    Explore Studio Work
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/5 bg-[#141a2a] p-5 space-y-1.5">
                  <div className="text-[13px] font-semibold text-white">Full-Stack Strategy</div>
                  <div className="text-[12px] text-slate-400">From $3,500/project</div>
                </div>
                <div className="rounded-xl border border-white/5 bg-[#141a2a] p-5 space-y-1.5">
                  <div className="text-[13px] font-semibold text-white">Continuous Retainer</div>
                  <div className="text-[12px] text-slate-400">From $1,800/month</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
