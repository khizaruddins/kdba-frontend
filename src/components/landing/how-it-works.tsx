'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutTemplate, Building2, Sliders, Monitor, Rocket, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface WorkflowStep {
  step: string;
  title: string;
  headline: string;
  description: string;
  icon: any;
  highlight: string;
  previewMockup: {
    tag: string;
    items: string[];
    badge: string;
  };
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: '01',
    title: 'Choose a Template',
    headline: 'Start with an industry-crafted foundation.',
    description: 'Browse agency, restaurant, corporate, or creator templates designed with pre-configured 3-page architectures (Home, About, Contact).',
    icon: LayoutTemplate,
    highlight: 'Zero blank canvas paralysis',
    previewMockup: {
      tag: 'Step 1: Selection',
      items: ['Agency Minimalist', 'Artisanal Bistro', 'Apex Advisory', 'Creator Portfolio'],
      badge: '3 Curated Pages Included',
    },
  },
  {
    step: '02',
    title: 'Add Your Business',
    headline: 'Inject your authentic brand identity.',
    description: 'Set your company name, upload your custom logo, configure WhatsApp & direct phone numbers, and specify your business hours.',
    icon: Building2,
    highlight: 'Centralized Business Profile',
    previewMockup: {
      tag: 'Step 2: Brand Profile',
      items: ['Brand Name: Aurelia Studio', 'Logo: Uploaded SVG/PNG', 'Contact: info@aurelia.studio', 'Phone: +1 (555) 234-8900'],
      badge: 'Global Auto-Sync',
    },
  },
  {
    step: '03',
    title: 'Customize Your Website',
    headline: 'Tailor sections, media, products, and prices.',
    description: 'Use the live studio editor to reorder sections, edit text in place, upload media to the high-speed CDN, and add items to your digital catalog.',
    icon: Sliders,
    highlight: 'Real-Time Visual Studio',
    previewMockup: {
      tag: 'Step 3: Studio Customizer',
      items: ['Navbar Configurator', 'Hero Banner & Tagline', 'Services & Product Catalog', 'Lead Inbound Form'],
      badge: 'Real-Time Auto-Save',
    },
  },
  {
    step: '04',
    title: 'Preview Multi-Device',
    headline: 'Ensure pixel-perfect rendering everywhere.',
    description: 'Test your website on simulated desktop, tablet, and smartphone viewports to guarantee optimal user experience before going public.',
    icon: Monitor,
    highlight: '100% Responsive Testing',
    previewMockup: {
      tag: 'Step 4: Device Simulation',
      items: ['Desktop 1920px Wide', 'Tablet 768px Touch', 'Mobile 375px Portrait', 'Fast Image Loading'],
      badge: 'Retina Ready',
    },
  },
  {
    step: '05',
    title: 'Publish Instantly',
    headline: 'Go live on global edge CDN with 1 click.',
    description: 'Publishing copies your draft state into production immediately with free SSL, high-speed edge distribution, and active lead forms.',
    icon: Rocket,
    highlight: '1-Click Zero-Downtime Deploy',
    previewMockup: {
      tag: 'Step 5: Live Production',
      items: ['Domain: kdba.site/your-brand', 'SSL Certificate: Active', 'CDN Cache: Globally Primed', 'Leads Inbox: Connected'],
      badge: 'Live to the World',
    },
  },
];

export function HowItWorks() {
  const [activeStepIndex, setActiveStepIndex] = React.useState(0);
  const activeStep = WORKFLOW_STEPS[activeStepIndex];

  return (
    <section id="how-it-works" className="relative py-28 px-6 border-t border-slate-800/80 bg-slate-950 overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 flex justify-center overflow-hidden">
        <div className="h-[400px] w-[700px] rounded-full bg-amber-500/5 blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <span>5-Step Guided Journey</span>
          </div>

          <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl leading-[1.08]">
            From idea to live website.{' '}
            <span className="bg-gradient-to-r from-amber-400 to-indigo-400 bg-clip-text text-transparent">
              In minutes.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            A simple, intuitive workflow engineered for modern entrepreneurs and creators.
          </p>
        </div>

        {/* Step Selector Pills Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-12">
          {WORKFLOW_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStepIndex === idx;
            return (
              <button
                key={step.step}
                onClick={() => setActiveStepIndex(idx)}
                className={`relative flex flex-col items-start p-4 rounded-2xl border transition-all text-left cursor-pointer ${
                  isActive
                    ? 'border-amber-500/40 bg-slate-900 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/30'
                    : 'border-slate-800 bg-slate-950/60 hover:bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span
                    className={`font-mono text-xs font-black ${
                      isActive ? 'text-amber-400' : 'text-slate-500'
                    }`}
                  >
                    {step.step}
                  </span>
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-amber-400' : 'text-slate-500'
                    }`}
                  />
                </div>
                <div
                  className={`text-xs font-bold truncate w-full ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {step.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Step Display Visual */}
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
            >
              {/* Left Column: Details & Step Info */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 border border-slate-700 px-3 py-1 text-xs font-bold text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span>Step {activeStep.step} of 05</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {activeStep.headline}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {activeStep.description}
                </p>

                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{activeStep.highlight}</span>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  {activeStepIndex < WORKFLOW_STEPS.length - 1 ? (
                    <button
                      onClick={() => setActiveStepIndex((prev) => prev + 1)}
                      className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2.5 text-xs transition-colors cursor-pointer shadow-lg shadow-amber-500/20"
                    >
                      <span>Next Step ({WORKFLOW_STEPS[activeStepIndex + 1].title})</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <Link href="/register">
                      <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 text-slate-950 font-black px-6 py-2.5 text-xs transition-transform hover:scale-105 cursor-pointer shadow-lg shadow-amber-500/20">
                        <span>Launch Your Website Now</span>
                        <Rocket className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Right Column: Simulated Visual State */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-slate-700/80 bg-slate-950 p-6 sm:p-8 space-y-5 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      {activeStep.previewMockup.tag}
                    </span>
                    <span className="rounded-md bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                      {activeStep.previewMockup.badge}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {activeStep.previewMockup.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 text-xs font-semibold text-slate-200"
                      >
                        <span>{item}</span>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>KDBA Architecture Engine</span>
                    <span>State: Complete</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
