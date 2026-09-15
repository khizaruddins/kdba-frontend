'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

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
    <section className="relative py-28 px-6 border-y border-white/5 bg-[#090D16]">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16 px-6 lg:px-12">
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-normal tracking-[-0.03em] text-white leading-[1.1]">
            Make every detail yours.
          </h2>
          <p className="text-[17px] text-slate-400 max-w-xl">
            One template transforms effortlessly into completely distinct brand personalities. Test changing colors, logos, and typography below.
          </p>
        </div>

        {/* Split-Screen Interactive Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-6 lg:px-12 items-start">
          {/* Left Column: Brand Controls */}
          <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-[#0f1422] p-6 sm:p-8 space-y-8 shadow-sm">
            
            {/* Presets Switcher */}
            <div className="space-y-4">
              <label className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">
                Quick Brand Presets
              </label>
              <div className="flex flex-col gap-2">
                {BRAND_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handleSelectPreset(preset)}
                    className={`flex items-center justify-between rounded-xl p-3 text-[14px] font-medium transition-colors text-left cursor-pointer border ${
                      activePreset.name === preset.name
                        ? 'border-indigo-500 bg-[#141829] text-white shadow-sm'
                        : 'border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="truncate">{preset.name}</span>
                    <span
                      style={{ backgroundColor: preset.primaryColor }}
                      className="h-3 w-3 rounded-full shrink-0"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Selector */}
            <div className="space-y-4 pt-6 border-t border-white/5">
              <label className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">
                Primary Brand Accent
              </label>
              <div className="flex items-center gap-3">
                {['#f59e0b', '#6366f1', '#10b981', '#f43f5e', '#3b82f6', '#8b5cf6'].map((hex) => (
                  <button
                    key={hex}
                    onClick={() => setCustomPrimary(hex)}
                    style={{ backgroundColor: hex }}
                    className={`h-8 w-8 rounded-full transition-transform cursor-pointer ${
                      customPrimary === hex ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0f1422] scale-110' : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Button Corner Radius Slider */}
            <div className="space-y-4 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between text-[12px] font-semibold uppercase tracking-wider text-slate-500">
                <span>Corner Radius</span>
                <span className="font-mono text-white normal-case">{customRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="28"
                value={customRadius}
                onChange={(e) => setCustomRadius(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer bg-white/10 rounded-full h-1"
              />
            </div>
          </div>

          {/* Right Column: Live Responsive Website Canvas */}
          <div className="lg:col-span-8">
            <motion.div
              layout
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#141a2a] p-8 sm:p-12 space-y-8 relative"
            >
              {/* Simulated Navigation */}
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                  <div
                    style={{
                      backgroundColor: customPrimary,
                      borderRadius: `${customRadius}px`,
                    }}
                    className="flex h-10 w-10 items-center justify-center font-bold text-white text-[15px] shadow-sm transition-all"
                  >
                    {activePreset.logoLetter}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-[17px] tracking-tight">
                      {activePreset.brandName}
                    </div>
                    <div className="text-[12px] text-slate-400">
                      {activePreset.category}
                    </div>
                  </div>
                </div>

                <button
                  style={{
                    backgroundColor: customPrimary,
                    borderRadius: `${customRadius}px`,
                  }}
                  className="px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all cursor-pointer"
                >
                  Contact Brand
                </button>
              </div>

              {/* Simulated Hero Section */}
              <div className="space-y-6 pt-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/5 px-3 py-1 text-[12px] font-medium text-slate-300">
                  <span style={{ backgroundColor: customPrimary }} className="h-2 w-2 rounded-full" />
                  <span>{activePreset.category}</span>
                </div>

                <h3
                  style={{ fontFamily: activePreset.fontFamily }}
                  className="text-3xl sm:text-5xl font-semibold text-white leading-tight tracking-tight"
                >
                  {activePreset.tagline}
                </h3>

                <p className="text-[15px] text-slate-400 max-w-lg leading-relaxed">
                  Tailored digital craftsmanship engineered to elevate enterprise conversion and build sustainable customer trust.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <button
                    style={{
                      backgroundColor: customPrimary,
                      borderRadius: `${customRadius}px`,
                    }}
                    className="flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-white shadow-sm transition-all cursor-pointer"
                  >
                    <span>Explore Offerings</span>
                  </button>

                  <button
                    style={{ borderRadius: `${customRadius}px` }}
                    className="px-6 py-3 text-[14px] font-semibold border border-white/10 bg-transparent text-slate-300 hover:bg-white/5 transition-all cursor-pointer"
                  >
                    Client Dossier
                  </button>
                </div>
              </div>

              {/* Live Badge Footer */}
              <div className="pt-8 mt-4 border-t border-white/5 flex items-center justify-between text-[12px] text-slate-500">
                <span className="font-mono">Primary Color: {customPrimary}</span>
                <span className="text-indigo-400 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Synchronized Across All Pages
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
