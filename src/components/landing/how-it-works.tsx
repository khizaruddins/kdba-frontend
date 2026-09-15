'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutTemplate, Building2, Sliders, Monitor, Rocket, CheckCircle2 } from 'lucide-react';
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
    <section id="how-it-works" className="relative py-28 px-6 bg-[#090D16]">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16 px-6 lg:px-12">
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-normal tracking-[-0.03em] text-white leading-[1.1]">
            From idea to live website.<br/>
            <span className="text-slate-500">In minutes.</span>
          </h2>

          <p className="text-[17px] text-slate-400 max-w-xl">
            A simple, intuitive workflow engineered for modern entrepreneurs and creators.
          </p>
        </div>

        {/* Step Selector Pills Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10 px-6 lg:px-12">
          {WORKFLOW_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStepIndex === idx;
            return (
              <button
                key={step.step}
                onClick={() => setActiveStepIndex(idx)}
                className={`relative flex flex-col items-start p-4 rounded-xl border transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'border-indigo-500 bg-[#141829] shadow-sm'
                    : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span
                    className={`text-[13px] font-semibold ${
                      isActive ? 'text-indigo-400' : 'text-slate-500'
                    }`}
                  >
                    {step.step}
                  </span>
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-indigo-400' : 'text-slate-500'
                    }`}
                  />
                </div>
                <div
                  className={`text-[13px] font-medium truncate w-full ${
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
        <div className="mx-6 lg:mx-12 overflow-hidden rounded-2xl border border-white/10 bg-[#0f1422] p-8 sm:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            >
              {/* Left Column: Details & Step Info */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/5 px-3 py-1 text-[12px] font-medium text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  <span>Step {activeStep.step} of 05</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-semibold text-white leading-tight">
                  {activeStep.headline}
                </h3>

                <p className="text-[15px] text-slate-400 leading-relaxed">
                  {activeStep.description}
                </p>

                <div className="flex items-center gap-2 text-[13px] font-medium text-slate-300 pt-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>{activeStep.highlight}</span>
                </div>

                <div className="pt-6 flex items-center gap-4">
                  {activeStepIndex < WORKFLOW_STEPS.length - 1 ? (
                    <button
                      onClick={() => setActiveStepIndex((prev) => prev + 1)}
                      className="flex items-center gap-2 rounded-full bg-white hover:bg-slate-200 text-black font-semibold px-6 py-3 text-[13px] transition-colors cursor-pointer"
                    >
                      <span>Next Step ({WORKFLOW_STEPS[activeStepIndex + 1].title})</span>
                    </button>
                  ) : (
                    <Link href="/register">
                      <button className="flex items-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 text-[13px] transition-colors cursor-pointer">
                        <span>Launch Your Website Now</span>
                      </button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Right Column: Simulated Visual State */}
              <div className="lg:col-span-6">
                <div className="rounded-xl border border-white/5 bg-[#141a2a] p-6 sm:p-8 space-y-5">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-[13px] font-medium text-indigo-400">
                      {activeStep.previewMockup.tag}
                    </span>
                    <span className="rounded bg-white/5 px-2 py-1 text-[11px] font-medium text-slate-400">
                      {activeStep.previewMockup.badge}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {activeStep.previewMockup.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg border border-white/5 bg-[#1a2133] p-3.5 text-[13px] font-medium text-slate-300"
                      >
                        <span>{item}</span>
                        <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                      </div>
                    ))}
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
