'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  CheckCircle2,
  Rocket,
  Palette,
  Layers,
  ArrowRight,
  Eye,
  Save,
  Globe,
  Sliders,
  Store,
  Utensils,
  Briefcase,
} from 'lucide-react';

interface TemplateOption {
  id: string;
  name: string;
  businessName: string;
  category: string;
  icon: any;
  headline: string;
  subheadline: string;
  ctaText: string;
  heroImage: string;
  accentBadge: string;
  productTitle: string;
  productPrice: string;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'agency',
    name: 'Modern Agency',
    businessName: 'Aurelia Creative Studio',
    category: 'Agency',
    icon: Sparkles,
    headline: 'Designing high-impact digital experiences for visionary brands.',
    subheadline: 'We craft bespoke digital identities, performant web platforms, and growth architectures.',
    ctaText: 'Start a Project',
    heroImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&auto=format&fit=crop&q=80',
    accentBadge: '✦ Design & Engineering Agency',
    productTitle: 'Brand Identity & Design System',
    productPrice: '$3,500',
  },
  {
    id: 'restaurant',
    name: 'Bistro Gourmand',
    businessName: "L'Atelier Artisanal",
    category: 'Restaurant',
    icon: Utensils,
    headline: 'Culinary craftsmanship rooted in heritage and seasonal terroir.',
    subheadline: 'Experience curated seasonal tasting menus and biodynamic pairings in an intimate atmosphere.',
    ctaText: 'Reserve a Table',
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=80',
    accentBadge: '✦ Michelin-Rated Artisanal Dining',
    productTitle: '7-Course Autumn Chef Tasting',
    productPrice: '$165 / guest',
  },
  {
    id: 'corporate',
    name: 'Apex Advisory',
    businessName: 'Apex Strategic Partners',
    category: 'Consulting',
    icon: Briefcase,
    headline: 'Empowering global leadership with strategic M&A intelligence.',
    subheadline: 'Cross-border financial restructuring, enterprise scale Advisory, and strategic risk capital.',
    ctaText: 'Schedule Briefing',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&auto=format&fit=crop&q=80',
    accentBadge: '✦ Global Management Advisory',
    productTitle: 'Strategic Capital Assessment',
    productPrice: '$7,500',
  },
];

const COLOR_PALETTES = [
  { name: 'Amber Gold', hex: '#f59e0b', gradient: 'from-amber-500 to-amber-600', ring: 'ring-amber-500' },
  { name: 'Electric Indigo', hex: '#6366f1', gradient: 'from-indigo-500 to-indigo-600', ring: 'ring-indigo-500' },
  { name: 'Emerald Mint', hex: '#10b981', gradient: 'from-emerald-500 to-emerald-600', ring: 'ring-emerald-500' },
  { name: 'Sunset Rose', hex: '#f43f5e', gradient: 'from-rose-500 to-rose-600', ring: 'ring-rose-500' },
];

export function HeroBuilderDemo() {
  const [selectedTemplate, setSelectedTemplate] = React.useState<TemplateOption>(TEMPLATES[0]);
  const [selectedPalette, setSelectedPalette] = React.useState(COLOR_PALETTES[0]);
  const [viewport, setViewport] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPublished, setIsPublished] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('Hero Banner');

  const handlePublish = () => {
    setIsPublished(true);
    setTimeout(() => setIsPublished(false), 3500);
  };

  return (
    <div className="relative mx-auto w-full max-w-6xl">
      {/* Outer Studio Frame with Glowing Border */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-700/80 bg-slate-900/90 shadow-2xl shadow-indigo-950/50 backdrop-blur-2xl">
        {/* Studio Top Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/90 px-4 py-3 sm:px-6">
          {/* Left: Window Controls + Site Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs text-slate-300">
              <Globe className="h-3.5 w-3.5 text-indigo-400" />
              <span className="font-mono text-[11px] text-slate-400">
                kdba.site/<span className="text-white font-semibold">{selectedTemplate.id}</span>
              </span>
            </div>
          </div>

          {/* Center: Device Viewport Controls */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/90 p-1">
            <button
              onClick={() => setViewport('desktop')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                viewport === 'desktop'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Desktop View"
            >
              <Monitor className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Desktop</span>
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                viewport === 'tablet'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tablet View"
            >
              <Tablet className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Tablet</span>
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                viewport === 'mobile'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mobile View"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Mobile</span>
            </button>
          </div>

          {/* Right: Publish Live Simulation */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePublish}
              style={{
                backgroundColor: selectedPalette.hex,
              }}
              className="flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-black text-slate-950 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Rocket className="h-3.5 w-3.5" />
              <span>{isPublished ? 'Published Live!' : 'Publish Website'}</span>
            </button>
          </div>
        </div>

        {/* Live Interactive Customizer Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 bg-slate-950/60 px-4 py-2.5 sm:px-6">
          {/* Template Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Template:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              {TEMPLATES.map((tpl) => {
                const Icon = tpl.icon;
                const isSelected = selectedTemplate.id === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl)}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`h-3 w-3 ${isSelected ? 'text-amber-400' : ''}`} />
                    <span>{tpl.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Palette Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Brand Accent:
            </span>
            <div className="flex items-center gap-1.5">
              {COLOR_PALETTES.map((palette) => (
                <button
                  key={palette.name}
                  onClick={() => setSelectedPalette(palette)}
                  style={{ backgroundColor: palette.hex }}
                  className={`h-5 w-5 rounded-full transition-transform hover:scale-110 cursor-pointer ${
                    selectedPalette.name === palette.name
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110'
                      : 'opacity-70'
                  }`}
                  title={palette.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Builder Body: Sidebar + Dynamic Preview Viewport */}
        <div className="flex min-h-[460px] bg-slate-950">
          {/* Left Studio Sidebar (Hidden on very small screens) */}
          <div className="hidden lg:flex w-56 flex-col border-r border-slate-800/80 bg-slate-900/40 p-4 space-y-5">
            {/* Pages Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <span>Pages</span>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">3 Live</span>
              </div>
              <div className="space-y-1">
                {['Home Page', 'About Story', 'Contact & Booking'].map((page, idx) => (
                  <div
                    key={page}
                    className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                      idx === 0
                        ? 'bg-slate-800/80 text-white border border-slate-700/60'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{page}</span>
                    {idx === 0 && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Sections in Page */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Sections
              </div>
              <div className="space-y-1">
                {['Header Navigation', 'Hero Banner', 'Featured Services', 'Products Catalog', 'Contact Lead Form', 'Footer'].map(
                  (section) => (
                    <button
                      key={section}
                      onClick={() => setActiveSection(section)}
                      className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1 text-xs text-left transition-colors cursor-pointer ${
                        activeSection === section
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold'
                          : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                      }`}
                    >
                      <span>{section}</span>
                      <Sliders className="h-3 w-3 opacity-60" />
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Live Status indicator */}
            <div className="mt-auto rounded-xl border border-slate-800 bg-slate-950/80 p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Auto-Saved in Real Time</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                All changes reflect instantly in your public production CDN.
              </p>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="flex-1 flex items-center justify-center p-3 sm:p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
            <motion.div
              layout
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                width:
                  viewport === 'desktop'
                    ? '100%'
                    : viewport === 'tablet'
                    ? '740px'
                    : '360px',
                maxWidth: '100%',
              }}
              className="relative overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900 shadow-2xl transition-all"
            >
              {/* Simulated Website Navbar */}
              <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/90 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div
                    style={{ backgroundColor: selectedPalette.hex }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg font-black text-slate-950 text-xs shadow-sm"
                  >
                    {selectedTemplate.businessName.charAt(0)}
                  </div>
                  <span className="font-bold text-sm text-white tracking-tight">
                    {selectedTemplate.businessName}
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-400">
                  <span className="text-white">Home</span>
                  <span>About</span>
                  <span>Offerings</span>
                  <span>Contact</span>
                </div>

                <button
                  style={{ backgroundColor: selectedPalette.hex }}
                  className="rounded-lg px-3 py-1 text-xs font-bold text-slate-950"
                >
                  {selectedTemplate.ctaText}
                </button>
              </div>

              {/* Simulated Website Hero Content */}
              <div className="relative p-6 sm:p-10 space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedTemplate.id + selectedPalette.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
                      <span
                        style={{ backgroundColor: selectedPalette.hex }}
                        className="h-2 w-2 rounded-full animate-pulse"
                      />
                      <span>{selectedTemplate.accentBadge}</span>
                    </div>

                    {/* Main Headline */}
                    <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight max-w-xl">
                      {selectedTemplate.headline}
                    </h3>

                    {/* Subheadline */}
                    <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                      {selectedTemplate.subheadline}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        style={{ backgroundColor: selectedPalette.hex }}
                        className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black text-slate-950 shadow-lg shadow-black/40 cursor-pointer"
                      >
                        <span>{selectedTemplate.ctaText}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white">
                        Learn More
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Hero Showcase Card / Product Component */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-2">
                    <img
                      src={selectedTemplate.heroImage}
                      alt="Hero Feature"
                      className="h-28 w-full object-cover rounded-lg"
                    />
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-bold text-white truncate">{selectedTemplate.productTitle}</span>
                      <span
                        style={{ color: selectedPalette.hex }}
                        className="font-mono font-black"
                      >
                        {selectedTemplate.productPrice}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Live Lead Capture Active</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Customer bookings & quotes submitted through this page trigger instant KDBA notifications.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Published Toast Alert */}
        <AnimatePresence>
          {isPublished && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-6 right-6 z-30 flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl ring-1 ring-emerald-500/20"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <Rocket className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Website Published Live!</div>
                <div className="text-xs text-slate-400 font-mono">
                  https://kdba.site/{selectedTemplate.id}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
