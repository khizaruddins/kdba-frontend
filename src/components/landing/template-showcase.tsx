'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Eye, Sparkles, CheckCircle2, LayoutTemplate, Layers, ExternalLink, X } from 'lucide-react';
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
    <section id="templates" className="relative py-28 px-6 border-t border-slate-800/80 bg-slate-950">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 flex justify-center overflow-hidden">
        <div className="h-[500px] w-[800px] rounded-full bg-indigo-500/5 blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            <LayoutTemplate className="h-3.5 w-3.5" />
            <span>Curated Design Foundations</span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
            Start with a design you love.
          </h2>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Choose from professionally designed templates built for real businesses. Customize the content, images, colors, and branding — the structure is already taken care of.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-white text-slate-950 shadow-lg shadow-white/10 scale-105'
                    : 'border border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <motion.div
              layout
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/60 p-5 shadow-xl transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-2xl hover:shadow-indigo-500/5"
            >
              <div>
                {/* Thumbnail Frame with Hover Actions */}
                <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-slate-950">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-lg bg-slate-950/80 border border-slate-700/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                      {template.category}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 bg-slate-950/70 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 p-4">
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview</span>
                    </button>
                    <Link href="/register">
                      <Button size="sm" className="bg-amber-500 text-slate-950 font-black text-xs cursor-pointer">
                        <span>Use Template</span>
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Template Info */}
                <div className="pt-5 space-y-3">
                  <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {template.description}
                  </p>

                  {/* Included Pages Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {template.pages.map((p, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-slate-950/80 border border-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300"
                      >
                        📄 {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Inspect Details</span>
                </button>

                <Link href="/register">
                  <span className="text-xs font-black text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
                    <span>Create Website</span>
                    <ArrowRight className="h-3.5 w-3.5" />
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setPreviewTemplate(null)}
                className="absolute top-6 right-6 flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
                  {previewTemplate.category} Template
                </span>
                <span className="text-xs text-slate-400">3-Page Complete Architecture</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">{previewTemplate.name}</h3>
                <p className="text-xs sm:text-sm text-slate-300">{previewTemplate.description}</p>
              </div>

              <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
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
                    className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <div className="text-[11px] font-semibold text-slate-200">{feat}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
                <div className="text-xs text-slate-400">
                  Includes full mobile optimization & high-speed CDN hosting.
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setPreviewTemplate(null)}
                    className="flex-1 sm:flex-none rounded-xl border border-slate-800 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
                  >
                    Close
                  </button>
                  <Link href="/register" className="flex-1 sm:flex-none">
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-amber-500 to-indigo-600 font-black text-slate-950 cursor-pointer px-5 py-2.5 rounded-xl"
                    >
                      <span>Build With This Template</span>
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
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
