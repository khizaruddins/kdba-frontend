'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

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
    <section id="faq" className="relative py-28 px-6 border-t border-white/5 bg-[#090D16]">
      <div className="relative mx-auto max-w-3xl">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-[clamp(2.5rem,5vw,3.5rem)] font-normal tracking-[-0.03em] text-white leading-[1.1]">
            Everything you need to know.
          </h2>
          <p className="text-[17px] text-slate-400 max-w-md mx-auto">
            Honest, transparent answers about KDBA capabilities, workflow, and platform roadmap.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  isOpen
                    ? 'border-indigo-500/50 bg-[#141a2a]'
                    : 'border-white/5 bg-[#0f1422] hover:bg-[#121828]'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer transition-colors"
                >
                  <span className="text-[16px] font-semibold text-white pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-white bg-white/10' : 'bg-white/5 hover:bg-white/10'
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
                      <div className="p-6 pt-0 text-[15px] text-slate-400 leading-relaxed">
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
