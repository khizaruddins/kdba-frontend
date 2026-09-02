'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  MousePointerClick,
  SlidersHorizontal,
  Layers,
  Smartphone,
  CheckCircle2,
  Maximize2,
  Type,
} from 'lucide-react';

const BUILDER_FEATURES = [
  {
    icon: MousePointerClick,
    title: 'Intuitive Drag & Drop',
    desc: 'Grab structural containers, grids, text, buttons, and media directly from the left rail and drop them onto the live canvas.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Visual 3D Box Model',
    desc: 'Fine-tune outer margin and inner padding with an interactive trapezoid box model and linked-side controls.',
  },
  {
    icon: Type,
    title: 'Precision Typography',
    desc: 'Select from curated typefaces, adjust weights, letter-spacing, line-height, text transforms, and color palettes.',
  },
  {
    icon: Smartphone,
    title: 'Responsive Overrides',
    desc: 'Switch between Desktop (1440px), Tablet (768px), and Mobile (390px) to craft bespoke per-device layouts.',
  },
];

export function EditorExperienceSection() {
  return (
    <section id="product" className="relative py-32 px-6 border-t border-slate-800/80 bg-slate-950/90 overflow-hidden">
      {/* Background Ambient Mesh */}
      <div className="pointer-events-none absolute inset-0 flex justify-center overflow-hidden">
        <div className="h-[600px] w-[900px] rounded-full bg-indigo-600/10 blur-[170px]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-20">
        {/* Top Feature Summary */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Wix Studio-Grade Experience</span>
          </div>

          <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl leading-[1.08]">
            Visual freedom meets{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-white to-amber-300 bg-clip-text text-transparent">
              production performance.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Build your brand online without code bottlenecks. KDBA delivers visual drag-and-drop website creation with the precision of a professional design studio.
          </p>
        </div>

        {/* 4 Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BUILDER_FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all hover:bg-slate-900 group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-white mb-2">{feature.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
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
              No raw code.
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-300"
            >
              No design limitations.
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-200"
            >
              No complicated deployments.
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="pt-6"
            >
              <div className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-indigo-400 via-white to-amber-300 bg-clip-text text-transparent">
                Pure visual creation.
              </div>
            </motion.div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Full Visual Drag & Drop Controls</span>
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Real-Time Undo / Redo & Autosave</span>
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>One-Click Global Edge Publishing</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
