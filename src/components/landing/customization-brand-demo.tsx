'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Palette, Type, Sliders, Sparkles, CheckCircle2, ArrowRight, Image as ImageIcon } from 'lucide-react';

interface BrandPreset {
  name: string;
  brandName: string;
  category: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: string;
  tagline: string;
  logoLetter: string;
}

const BRAND_PRESETS: BrandPreset[] = [
  {
    name: 'Noir Luxury',
    brandName: 'Maison Noir Studio',
    category: 'Haute Horlogerie & Design',
    primaryColor: '#f59e0b',
    secondaryColor: '#1e1b4b',
    fontFamily: 'serif',
    borderRadius: '8px',
    tagline: 'Timeless Swiss watchmaking and artisanal haute horlogerie.',
    logoLetter: 'M',
  },
  {
    name: 'Cyber Indigo',
    brandName: 'Vortex AI Systems',
    category: 'Enterprise Neural Cloud',
    primaryColor: '#6366f1',
    secondaryColor: '#0f172a',
    fontFamily: 'sans-serif',
    borderRadius: '16px',
    tagline: 'Autonomous AI infrastructure built for real-time edge computing.',
    logoLetter: 'V',
  },
  {
    name: 'Botanical Emerald',
    brandName: 'Solaria Organic Living',
    category: 'Sustainable Eco Design',
    primaryColor: '#10b981',
    secondaryColor: '#064e3b',
    fontFamily: 'sans-serif',
    borderRadius: '24px',
    tagline: 'Regenerative architecture for biophilic modern residences.',
    logoLetter: 'S',
  },
  {
    name: 'Crimson Bold',
    brandName: 'Ignite Performance Lab',
    category: 'High-Impact Athletic Training',
    primaryColor: '#f43f5e',
    secondaryColor: '#4c0519',
    fontFamily: 'sans-serif',
    borderRadius: '12px',
    tagline: 'Elite athletic conditioning backed by physiological telemetry.',
    logoLetter: 'I',
  },
];

export function CustomizationBrandDemo() {
  const [activePreset, setActivePreset] = React.useState<BrandPreset>(BRAND_PRESETS[0]);
  const [customPrimary, setCustomPrimary] = React.useState(BRAND_PRESETS[0].primaryColor);
  const [customRadius, setCustomRadius] = React.useState(12);

  const handleSelectPreset = (preset: BrandPreset) => {
    setActivePreset(preset);
    setCustomPrimary(preset.primaryColor);
  };

  return (
    <section className="relative py-28 px-6 border-t border-slate-800/80 bg-slate-950/90 overflow-hidden">
      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Palette className="h-3.5 w-3.5" />
            <span>Interactive Brand Kit</span>
          </div>

          <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl leading-[1.08]">
            Make every detail yours.
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            One template transforms effortlessly into completely distinct brand personalities. Test changing colors, logos, and typography below.
          </p>
        </div>

        {/* Split-Screen Interactive Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Brand Controls */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-amber-400" />
                <span>Brand Customizer</span>
              </span>
              <span className="rounded-md bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-[10px] font-bold border border-emerald-500/20">
                Live Studio Engine
              </span>
            </div>

            {/* Presets Switcher */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Quick Brand Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {BRAND_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handleSelectPreset(preset)}
                    className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-bold transition-all text-left cursor-pointer border ${
                      activePreset.name === preset.name
                        ? 'border-white/40 bg-slate-800 text-white shadow-md'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span
                      style={{ backgroundColor: preset.primaryColor }}
                      className="h-3.5 w-3.5 rounded-full shrink-0"
                    />
                    <span className="truncate">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Primary Brand Accent
              </label>
              <div className="flex items-center gap-3">
                {['#f59e0b', '#6366f1', '#10b981', '#f43f5e', '#3b82f6', '#8b5cf6'].map((hex) => (
                  <button
                    key={hex}
                    onClick={() => setCustomPrimary(hex)}
                    style={{ backgroundColor: hex }}
                    className={`h-7 w-7 rounded-full transition-transform hover:scale-110 cursor-pointer ${
                      customPrimary === hex ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110' : 'opacity-70'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Button Corner Radius Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Button Corner Radius</span>
                <span className="font-mono text-white">{customRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="28"
                value={customRadius}
                onChange={(e) => setCustomRadius(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer bg-slate-800 rounded-lg h-2"
              />
            </div>

            <div className="rounded-2xl bg-slate-950/80 p-4 border border-slate-800 space-y-1 text-xs text-slate-400">
              <div className="font-bold text-slate-200">Zero CSS editing required</div>
              <p>All styling tokens cascade across buttons, badges, typography, and cards automatically.</p>
            </div>
          </div>

          {/* Right Column: Live Responsive Website Canvas */}
          <div className="lg:col-span-7">
            <motion.div
              layout
              className="overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-950 shadow-2xl p-6 sm:p-10 space-y-8 relative"
            >
              {/* Simulated Navigation */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      backgroundColor: customPrimary,
                      borderRadius: `${customRadius}px`,
                    }}
                    className="flex h-9 w-9 items-center justify-center font-black text-slate-950 text-sm shadow-md transition-all"
                  >
                    {activePreset.logoLetter}
                  </div>
                  <div>
                    <div className="font-bold text-white text-base tracking-tight">
                      {activePreset.brandName}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {activePreset.category}
                    </div>
                  </div>
                </div>

                <button
                  style={{
                    backgroundColor: customPrimary,
                    borderRadius: `${customRadius}px`,
                  }}
                  className="px-4 py-1.5 text-xs font-bold text-slate-950 shadow-sm transition-all"
                >
                  Contact Brand
                </button>
              </div>

              {/* Simulated Hero Section */}
              <div className="space-y-4 pt-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs text-slate-300">
                  <span style={{ backgroundColor: customPrimary }} className="h-2 w-2 rounded-full" />
                  <span>{activePreset.category}</span>
                </div>

                <h3
                  style={{ fontFamily: activePreset.fontFamily }}
                  className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight"
                >
                  {activePreset.tagline}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                  Tailored digital craftsmanship engineered to elevate enterprise conversion and build sustainable customer trust.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    style={{
                      backgroundColor: customPrimary,
                      borderRadius: `${customRadius}px`,
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 text-xs font-black text-slate-950 shadow-lg transition-all cursor-pointer"
                  >
                    <span>Explore Offerings</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    style={{ borderRadius: `${customRadius}px` }}
                    className="px-5 py-2.5 text-xs font-bold border border-slate-700 bg-slate-900 text-slate-300 hover:text-white transition-all"
                  >
                    Client Dossier
                  </button>
                </div>
              </div>

              {/* Live Badge Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono">Primary Color: {customPrimary}</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Synchronized Across 3 Pages
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
