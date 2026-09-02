'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { TEMPLATES_DEFINITIONS } from '@/lib/templates/definitions';
import { TemplateDefinition } from '@/types';
import { websitesApi } from '@/lib/api/websites';
import { businessApi } from '@/lib/api/business';
import {
  Sparkles,
  Eye,
  ArrowRight,
  Search,
  LayoutTemplate,
  Monitor,
  Tablet,
  Smartphone,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { WebsiteRenderer } from '@/components/renderer/WebsiteRenderer';

export default function TemplatesPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('ALL');
  const [previewTemplate, setPreviewTemplate] = React.useState<TemplateDefinition | null>(null);
  const [previewViewMode, setPreviewViewMode] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isCreating, setIsCreating] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const categories = [
    { id: 'ALL', label: 'All Industries' },
    { id: 'RESTAURANT', label: 'Restaurants & Dining' },
    { id: 'CAFE', label: 'Cafes & Roasteries' },
    { id: 'DENTAL', label: 'Dental & Medical' },
    { id: 'HEALTHCARE', label: 'Healthcare' },
    { id: 'SALON', label: 'Salons & Spas' },
    { id: 'FITNESS', label: 'Fitness & Gyms' },
    { id: 'REAL_ESTATE', label: 'Real Estate' },
    { id: 'ARCHITECTURE', label: 'Architecture' },
    { id: 'CREATIVE_AGENCY', label: 'Creative Agencies' },
    { id: 'SOFTWARE_SAAS', label: 'SaaS & Tech' },
    { id: 'CONSULTING', label: 'Consulting & Legal' },
    { id: 'HOTEL', label: 'Hotels & Travel' },
    { id: 'AUTOMOTIVE', label: 'Automotive' },
  ];

  const filteredTemplates = TEMPLATES_DEFINITIONS.filter((tpl) => {
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.style.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === 'ALL' ||
      tpl.industry === activeCategory ||
      (activeCategory === 'DENTAL' && tpl.industry === 'HEALTHCARE') ||
      (activeCategory === 'SALON' && tpl.industry === 'SPA') ||
      (activeCategory === 'HOTEL' && tpl.industry === 'TRAVEL') ||
      (activeCategory === 'CONSULTING' && (tpl.industry === 'LAW_FIRM' || tpl.industry === 'EDUCATION'));

    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = async (template: TemplateDefinition) => {
    setIsCreating(true);
    setErrorMsg(null);

    try {
      // 1. Ensure a business profile exists or create one
      const businesses = await businessApi.getAll();
      let businessId = businesses?.[0]?.id;

      if (!businessId) {
        const created = await businessApi.create({
          name: template.document.business.name || 'My Business',
          email: template.document.business.email || '',
          phone: template.document.business.phone || '',
          address: template.document.business.address || '',
        });
        businessId = created.id;
      }

      // 2. Create the website with canonical document settings
      const website = await websitesApi.create({
        businessId,
        templateId: template.id,
        name: `${template.document.business.name || template.name}`,
      });

      // 3. Update the website with the template's canonical document structure
      await websitesApi.saveDraft(website.id, {
        theme: template.document.theme,
        business: template.document.business,
        pages: template.document.pages,
        seoTitle: template.document.seoTitle,
        seoDescription: template.document.seoDescription,
      });

      router.push(`/editor/${website.id}`);
    } catch (err: any) {
      console.error('Failed to create website from template:', err);
      setErrorMsg(
        err?.response?.data?.message || err?.message || 'Failed to initialize website.',
      );
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Curated Website Templates
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            20 bespoke, industry-specific website architectures built for instant conversion
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates & styles..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-hidden shadow-inner"
          />
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-semibold text-rose-400 flex items-center justify-between">
          <span>{errorMsg}</span>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-rose-400 hover:text-white ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className="overflow-hidden card-hover flex flex-col justify-between group border-slate-800 bg-slate-900/70"
          >
            <div>
              {/* Preview Banner */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                {template.previewImage ? (
                  <img
                    src={template.previewImage}
                    alt={template.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-slate-900 to-indigo-950 text-indigo-400">
                    <LayoutTemplate className="h-12 w-12 opacity-50" />
                  </div>
                )}

                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="default">{template.industry.replace('_', ' ')}</Badge>
                  {template.featured && (
                    <Badge variant="success">Featured</Badge>
                  )}
                </div>
              </div>

              {/* Template Details */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {template.name}
                </h3>

                <p className="text-[11px] font-mono text-indigo-400 mt-0.5">
                  {template.style}
                </p>

                <p className="mt-2.5 text-xs text-slate-400 leading-relaxed min-h-[38px] line-clamp-2">
                  {template.description}
                </p>

                {/* Theme tokens preview */}
                <div className="mt-4 flex items-center gap-2.5 border-t border-slate-800/80 pt-4">
                  <div
                    className="h-4 w-4 rounded-full border border-white/20 shadow-sm"
                    style={{
                      backgroundColor: template.document.theme?.accentColor || '#6366f1',
                    }}
                    title="Accent Color"
                  />
                  <div
                    className="h-4 w-4 rounded-full border border-white/20 shadow-sm"
                    style={{
                      backgroundColor: template.document.theme?.primaryColor || '#0f172a',
                    }}
                    title="Primary Theme Color"
                  />
                  <span className="text-[11px] text-slate-400 font-mono ml-2">
                    {template.document.theme?.headingFont.split(',')[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewTemplate(template)}
                leftIcon={<Eye className="h-3.5 w-3.5" />}
                className="flex-1"
              >
                Inspect
              </Button>
              <Button
                size="sm"
                onClick={() => handleUseTemplate(template)}
                isLoading={isCreating}
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                className="flex-1"
              >
                Use Template
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Inspect Template Fullscreen Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-xl select-none">
          <header className="flex h-16 w-full items-center justify-between border-b border-slate-800 px-6 bg-slate-900/90 z-20">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-white">
                {previewTemplate.name}
              </span>
              <span className="rounded-full bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase border border-indigo-500/30">
                {previewTemplate.industry}
              </span>
            </div>

            {/* Viewport switcher */}
            <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 p-1">
              <button
                type="button"
                onClick={() => setPreviewViewMode('desktop')}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  previewViewMode === 'desktop'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Desktop"
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewViewMode('tablet')}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  previewViewMode === 'tablet'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Tablet"
              >
                <Tablet className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewViewMode('mobile')}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  previewViewMode === 'mobile'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile"
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="sm"
                onClick={() => {
                  const tpl = previewTemplate;
                  setPreviewTemplate(null);
                  handleUseTemplate(tpl);
                }}
                isLoading={isCreating}
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              >
                Use This Template
              </Button>
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center items-start bg-slate-950">
            <div
              className={`transition-all duration-300 ${
                previewViewMode === 'desktop'
                  ? 'w-full max-w-full'
                  : previewViewMode === 'tablet'
                  ? 'w-[768px] max-w-[768px] my-6 rounded-[28px] border-[8px] border-slate-800 shadow-2xl overflow-y-auto max-h-[85vh]'
                  : 'w-[375px] max-w-[375px] my-6 rounded-[36px] border-[8px] border-slate-800 shadow-2xl overflow-y-auto max-h-[85vh]'
              }`}
            >
              <div data-view-mode={previewViewMode} className="w-full bg-slate-950">
                <WebsiteRenderer
                  document={previewTemplate.document}
                  isEditing={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
