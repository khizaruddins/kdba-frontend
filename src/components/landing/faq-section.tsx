'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'Do I need coding experience?',
    answer: 'No. KDBA is designed from the ground up for non-technical business owners and creators. Everything from layout configuration, typography, image uploads, and color palettes is handled through an intuitive visual studio.',
  },
  {
    question: 'How many pages can I create?',
    answer: 'Every KDBA website comes pre-architected with 3 complete, high-converting pages: Home, About, and Contact & Booking. Each page supports unlimited re-orderable and customizable section blocks.',
  },
  {
    question: 'Can I use my own logo?',
    answer: 'Yes. You can upload your own SVG, PNG, or high-resolution JPEG logos in the brand settings. KDBA automatically scales and positions your logo seamlessly across your header and footer navigation.',
  },
  {
    question: 'Can I upload my own images?',
    answer: 'Yes. The built-in Media Library allows you to upload photography, promotional banners, and product imagery. All assets are automatically distributed across our global CDN in lightweight WebP format for rapid loading.',
  },
  {
    question: 'Can I add products and services?',
    answer: 'Yes. KDBA features a dedicated Commerce & Catalog manager where you can add physical merchandise, culinary tasting menus, design retainers, or consulting services with custom price tags and direct order buttons.',
  },
  {
    question: 'Can I add pricing tiers?',
    answer: 'Yes. You can create tiered pricing tables with monthly/annual billing toggles, feature checklists, and highlighted recommended badges to make your service packages easy for customers to evaluate.',
  },
  {
    question: 'Can visitors contact me through the website?',
    answer: 'Yes. Every template includes built-in contact forms. Inquiries submitted by visitors are captured immediately into your unified KDBA Leads CRM dashboard with customer contact info, timestamps, and status pipelines.',
  },
  {
    question: 'Can I connect my own custom domain?',
    answer: 'Custom root domains (yourbrand.com) with automated Cloudflare SSL certificates are actively in development for the upcoming V2 release. Right now, every website receives an instant, secure live URL (kdba.site/your-brand) upon clicking Publish.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-28 px-6 border-t border-slate-800/80 bg-slate-950/90 overflow-hidden">
      <div className="relative mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Frequently Asked Questions</span>
          </div>

          <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Everything you need to know.
          </h2>

          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Honest, transparent answers about KDBA capabilities, workflow, and platform roadmap.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`overflow-hidden rounded-2xl border transition-all ${
                  isOpen
                    ? 'border-amber-500/40 bg-slate-900/90 shadow-xl shadow-amber-500/5'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-white pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-slate-300 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-amber-500 text-slate-950 font-bold' : ''
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="p-5 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 mt-1">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
