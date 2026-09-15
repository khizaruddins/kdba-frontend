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
    <section id="product" className="relative py-32 px-6 border-y border-white/5 bg-[#090D16]">
      <div className="relative mx-auto max-w-[1440px] space-y-20 px-6 lg:px-12">
        {/* Top Feature Summary */}
        <div className="max-w-3xl space-y-4">
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-normal tracking-[-0.03em] text-white leading-[1.1]">
            Visual freedom meets<br/>
            <span className="text-slate-500">production performance.</span>
          </h2>

          <p className="text-[17px] text-slate-400 max-w-xl">
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
                className="p-8 rounded-2xl bg-[#0f1422] border border-white/10 transition-colors hover:bg-[#121828] group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 text-slate-300 flex items-center justify-center mb-6 group-hover:text-white transition-colors border border-white/10">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-[17px] text-white mb-2">{feature.title}</h3>
                <p className="text-[14px] text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* The Emotional Typography Moment */}
        <div className="relative mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#0f1422] p-10 sm:p-16 text-center shadow-sm">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[clamp(1.5rem,3vw,2.5rem)] font-semibold tracking-[-0.02em] text-slate-500"
            >
              No raw code.
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-[clamp(1.5rem,3vw,2.5rem)] font-semibold tracking-[-0.02em] text-slate-400"
            >
              No design limitations.
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-[clamp(1.5rem,3vw,2.5rem)] font-semibold tracking-[-0.02em] text-slate-300"
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
              <div className="text-[clamp(2.5rem,6vw,4.5rem)] font-semibold tracking-[-0.03em] text-white">
                Pure visual creation.
              </div>
            </motion.div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap items-center justify-center gap-8 text-[13px] text-slate-400">
            <span className="flex items-center gap-2 font-medium text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-indigo-400" />
              <span>Full Visual Drag & Drop Controls</span>
            </span>
            <span className="flex items-center gap-2 font-medium text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-indigo-400" />
              <span>Real-Time Undo / Redo & Autosave</span>
            </span>
            <span className="flex items-center gap-2 font-medium text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-indigo-400" />
              <span>One-Click Global Edge Publishing</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
