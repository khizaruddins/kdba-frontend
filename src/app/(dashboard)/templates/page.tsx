'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { Template } from '@/types';
import {
  LayoutTemplate,
  Sparkles,
  Eye,
  Check,
  ArrowRight,
  Layers,
  Palette,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = React.useState<Template[]>([]);
  const [activeCategory, setActiveCategory] = React.useState('ALL');
  const [previewTemplate, setPreviewTemplate] = React.useState<Template | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);

  React.useEffect(() => {
    apiClient.get('/templates').then((data: any) => {
      if (Array.isArray(data)) setTemplates(data);
    });
  }, []);

  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const categories = ['ALL', 'AGENCY', 'RESTAURANT', 'BUSINESS'];

  const filteredTemplates = templates.filter((tpl) => {
    if (activeCategory === 'ALL') return true;
    return tpl.category === activeCategory;
  });

  const handleUseTemplate = async (templateId: string) => {
    setIsCreating(true);
    setErrorMsg(null);
    try {
      // 1. Get or create business
      const businesses: any = await apiClient.get('/businesses');
      let businessId = businesses?.[0]?.id;

      if (!businessId) {
        const created: any = await apiClient.post('/businesses', {
          name: 'My Business',
        });
        businessId = created.id;
      }

      const selected = templates.find((t) => t.id === templateId);

      // 2. Create website
      const website: any = await apiClient.post('/websites', {
        businessId,
        templateId,
        name: `${selected?.name || 'New'} Website`,
      });

      router.push(`/editor/${website.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to create website from template';
      console.error('Failed to create website from template:', msg, err);
      setErrorMsg(typeof msg === 'string' ? msg : JSON.stringify(msg));
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          Template Library
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Handcrafted, high-conversion layouts designed for fast business deployment
        </p>
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
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            {cat === 'ALL' ? 'All Templates' : cat}
          </button>
        ))}
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className="overflow-hidden card-hover flex flex-col justify-between group"
          >
            <div>
              {/* Preview Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                {template.previewImage ? (
                  <img
                    src={template.previewImage}
                    alt={template.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-slate-900 to-indigo-950 text-indigo-400">
                    <LayoutTemplate className="h-12 w-12 opacity-50" />
                  </div>
                )}

                <div className="absolute top-3 left-3">
                  <Badge variant="default">{template.category}</Badge>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-white">
                  {template.name}
                </h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed min-h-[36px]">
                  {template.description}
                </p>

                {/* Theme tokens preview */}
                <div className="mt-4 flex items-center gap-2 border-t border-slate-800/80 pt-4">
                  <div
                    className="h-4 w-4 rounded-full border border-white/20 shadow-sm"
                    style={{
                      backgroundColor: template.theme?.accentColor || '#6366f1',
                    }}
                    title="Accent Color"
                  />
                  <div
                    className="h-4 w-4 rounded-full border border-white/20 shadow-sm"
                    style={{
                      backgroundColor: template.theme?.primaryColor || '#0f172a',
                    }}
                    title="Primary Color"
                  />
                  <span className="text-[11px] text-slate-500 ml-2">
                    {template.theme?.headingFont || 'Inter'} typography
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
                onClick={() => handleUseTemplate(template.id)}
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

      {/* Inspect Template Dialog */}
      <Dialog
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        title={previewTemplate?.name}
        description={previewTemplate?.description || ''}
      >
        {previewTemplate && (
          <div className="space-y-6 pt-2">
            {previewTemplate.previewImage && (
              <div className="overflow-hidden rounded-xl border border-slate-800 max-h-64">
                <img
                  src={previewTemplate.previewImage}
                  alt={previewTemplate.name}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Pre-configured 3-Page Structure
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950 text-center">
                  <span className="text-xs font-bold text-white block">Home</span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Hero, Services, CTA, Footer
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950 text-center">
                  <span className="text-xs font-bold text-white block">About</span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Mission, Team, Highlights
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950 text-center">
                  <span className="text-xs font-bold text-white block">Contact</span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Inquiry Form, Address, Hours
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewTemplate(null)}
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => handleUseTemplate(previewTemplate.id)}
                isLoading={isCreating}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Generate Website from this Template
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
