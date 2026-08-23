'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Code2, Cpu, CheckCircle2, Zap, Layers, ShieldCheck, HeartHandshake } from 'lucide-react';
import Link from 'next/link';

export function EditorExperienceSection() {
  return (
    <section id="product" className="relative py-32 px-6 border-t border-slate-800/80 bg-slate-950/90 overflow-hidden">
      {/* Background Ambient Mesh */}
      <div className="pointer-events-none absolute inset-0 flex justify-center overflow-hidden">
        <div className="h-[600px] w-[900px] rounded-full bg-indigo-600/10 blur-[170px]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-24">
        {/* Top Feature Summary */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Studio Philosophy</span>
          </div>

          <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl leading-[1.08]">
            Simple enough for anyone.{' '}
            <span className="bg-gradient-to-r from-amber-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
              Powerful enough to build something great.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            You don&apos;t need to understand HTML, CSS, React, or JavaScript. KDBA encapsulates the technical complexity so you can focus entirely on telling your story and closing sales.
          </p>
        </div>

        {/* The Emotional Typography Moment */}
        <div className="relative mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 p-10 sm:p-16 text-center shadow-2xl backdrop-blur-2xl">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-400"
            >
              No code.
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-300"
            >
              No design degree.
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-200"
            >
              No complicated setup.
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="pt-6"
            >
              <div className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-amber-400 via-white to-indigo-300 bg-clip-text text-transparent">
                Just your business.
              </div>
            </motion.div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Full Visual Controls</span>
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Live Draft Auto-Save</span>
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>High-Speed Global CDN</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
