'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TemplateItem {
  id: string;
  name: string;
  category: 'Agency' | 'Restaurant' | 'Business' | 'Professional' | 'Creative' | 'Local Business';
  description: string;
  image: string;
  pages: string[];
  features: string[];
  themeColor: string;
}

const TEMPLATES: TemplateItem[] = [
  {
    id: 'agency-studio',
    name: 'Aurelia Modern Agency',
    category: 'Agency',
    description: 'High-contrast dark mode aesthetic with typography hierarchy, client case studies, and dynamic service quotes.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80',
    pages: ['Home', 'About Story', 'Contact & Briefing'],
    features: ['Service Grid', 'Case Studies', 'Inbound Briefing Form', 'Hero Video Embed'],
    themeColor: '#6366f1',
  },
  {
    id: 'culinary-craft',
    name: "L'Atelier Gourmet Bistro",
    category: 'Restaurant',
    description: 'Warm artisanal restaurant layout featuring interactive digital menus, chef specials, and direct table reservation capture.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=80',
    pages: ['Home', 'Seasonal Menu', 'Reserve Table'],
    features: ['Categorized Food Menu', 'Table Booking Form', 'Chef Specials Banner', 'Hours & Location'],
    themeColor: '#f59e0b',
  },
  {
    id: 'apex-corporate',
    name: 'Apex Strategic Advisory',
    category: 'Business',
    description: 'Clean, authoritative layout built for consultancies, financial advisors, legal partners, and B2B corporate brands.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&auto=format&fit=crop&q=80',
    pages: ['Home', 'Practice Areas', 'Executive Consultation'],
    features: ['Consultation Booking', 'Team Leadership Grid', 'Client Logos Strip', 'Insights Feed'],
    themeColor: '#10b981',
  },
  {
    id: 'lumina-creative',
    name: 'Lumina Visual Creator',
    category: 'Creative',
    description: 'Minimalist, visual-first portfolio for photographers, architects, interior designers, and multimedia creators.',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=900&auto=format&fit=crop&q=80',
    pages: ['Home', 'Selected Works', 'Contact & Collabs'],
    features: ['Full-width Visual Gallery', 'Project Case Studies', 'Client Inquiry Form', 'Light/Dark Contrast'],
    themeColor: '#ec4899',
  },
  {
    id: 'zenith-wellness',
    name: 'Zenith Health & Studio',
    category: 'Local Business',
    description: 'Soothing, conversion-focused design for fitness studios, wellness clinics, medical practices, and salons.',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=900&auto=format&fit=crop&q=80',
    pages: ['Home', 'Services & Classes', 'Book Appointment'],
    features: ['Class Schedule Matrix', 'Appointment Request Form', 'Pricing Tier Cards', 'Customer Reviews'],
    themeColor: '#06b6d4',
  },
  {
    id: 'vortex-tech',
    name: 'Vortex Software Suite',
    category: 'Professional',
    description: 'Modern developer & SaaS-inspired layout with interactive feature breakdowns, product screenshots, and tier tables.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80',
    pages: ['Home', 'Platform Specs', 'Get Started'],
    features: ['Bento Feature Cards', 'Pricing Matrix', 'Instant Signup Form', 'Speed Benchmark Bar'],
    themeColor: '#8b5cf6',
  },
];

const CATEGORIES = ['All', 'Agency', 'Restaurant', 'Business', 'Professional', 'Creative', 'Local Business'] as const;

export function TemplateShowcase() {
  const [activeCategory, setActiveCategory] = React.useState<string>('All');
  const [previewTemplate, setPreviewTemplate] = React.useState<TemplateItem | null>(null);

  const filteredTemplates =
    activeCategory === 'All'
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <section id="templates" className="relative py-28 px-6 bg-[#090D16]">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16 px-6 lg:px-12">
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-normal tracking-[-0.03em] text-white leading-[1.1]">
            Start with a design you love.
          </h2>
          <p className="text-[17px] text-slate-400 max-w-xl">
            Choose from professionally designed templates built for real businesses. Customize the content, images, colors, and branding — the structure is already taken care of.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-white text-black'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 lg:px-12">
          {filteredTemplates.map((template) => (
            <motion.div
              layout
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0f1422] p-4 transition-all duration-300 hover:bg-[#121828]"
            >
              <div>
                {/* Thumbnail Frame with Hover Actions */}
                <div className="relative h-56 w-full overflow-hidden rounded-xl bg-black">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-md bg-black/60 border border-white/10 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                      {template.category}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 p-4">
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-4 py-2.5 text-[13px] font-medium text-white hover:bg-black/70 transition-colors cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Preview</span>
                    </button>
                    <Link href="/register">
                      <Button size="sm" className="bg-white text-black font-semibold text-[13px] h-10 px-5 rounded-full cursor-pointer hover:bg-slate-200 transition-colors">
                        <span>Use Template</span>
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Template Info */}
                <div className="pt-5 space-y-2 px-1">
                  <h3 className="text-[17px] font-semibold text-white tracking-tight">
                    {template.name}
                  </h3>
                  <p className="text-[14px] text-slate-400 leading-relaxed">
                    {template.description}
                  </p>

                  {/* Included Pages Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    {template.pages.map((p, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-white/5 border border-white/5 px-1.5 py-0.5 text-[11px] text-slate-400"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-5 mt-5 border-t border-white/5 flex items-center justify-between px-1">
                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="text-[13px] font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Details</span>
                </button>

                <Link href="/register">
                  <span className="text-[13px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                    Start Building
                  </span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Modal Preview */}
      <AnimatePresence>
        {previewTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#0f1422] p-6 sm:p-8 shadow-2xl space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setPreviewTemplate(null)}
                className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3">
                <span className="rounded-md bg-white/5 px-3 py-1 text-[12px] font-medium text-slate-300 border border-white/10">
                  {previewTemplate.category} Template
                </span>
                <span className="text-[13px] text-slate-500">3-Page Foundation</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-white tracking-tight">{previewTemplate.name}</h3>
                <p className="text-[15px] text-slate-400">{previewTemplate.description}</p>
              </div>

              <div className="relative h-72 w-full overflow-hidden rounded-xl border border-white/5 bg-black">
                <img
                  src={previewTemplate.image}
                  alt={previewTemplate.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {previewTemplate.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/5 bg-[#141a2a] p-3 space-y-2"
                  >
                    <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                    <div className="text-[12px] font-medium text-slate-300">{feat}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
                <div className="text-[13px] text-slate-500">
                  Includes full mobile optimization & high-speed CDN hosting.
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setPreviewTemplate(null)}
                    className="flex-1 sm:flex-none rounded-full px-5 py-2.5 text-[13px] font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <Link href="/register" className="flex-1 sm:flex-none">
                    <Button
                      size="sm"
                      className="w-full bg-white text-black font-semibold text-[13px] h-10 px-6 rounded-full cursor-pointer hover:bg-slate-200 transition-colors shadow-none"
                    >
                      Build With This Template
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
