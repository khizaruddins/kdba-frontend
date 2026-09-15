'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { TEMPLATES_DEFINITIONS } from '@/lib/templates/definitions';
import { TemplateDefinition } from '@/types';
import { websitesApi } from '@/lib/api/websites';
import { businessApi } from '@/lib/api/business';
import { apiClient } from '@/lib/api/client';
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
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { EmptyState } from '@/components/ui/empty-state';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { PageHeader } from '@/components/kdba/page-header';
import { WebsiteRenderer } from '@/components/renderer/WebsiteRenderer';

const BACKEND_TEMPLATE_BY_INDUSTRY: Record<string, string> = {
  RESTAURANT: 'restaurant-modern',
  CAFE: 'cafe-artisan',
  DENTAL: 'dental-clinic',
  HEALTHCARE: 'healthcare-private',
  SALON: 'salon-premium',
  SPA: 'wellness-spa',
  FITNESS: 'fitness-studio',
  REAL_ESTATE: 'real-estate-consultant',
  ARCHITECTURE: 'architecture-studio',
  INTERIOR_DESIGN: 'interior-design-luxury',
  PHOTOGRAPHER: 'photographer-pro',
  CREATIVE_AGENCY: 'agency-digital-creative',
  SOFTWARE_SAAS: 'saas-software',
  CONSULTING: 'business-consultant',
  LAW_FIRM: 'law-firm',
  EDUCATION: 'coaching-institute',
  SCHOOL: 'school-modern',
  HOTEL: 'hotel-boutique',
  TRAVEL: 'travel-agency',
  AUTOMOTIVE: 'automotive-detailing',
};

function resolveBackendTemplateId(
  template: TemplateDefinition,
  catalog: Array<{ id: string; slug: string }>,
) {
  const preferred = BACKEND_TEMPLATE_BY_INDUSTRY[template.industry];
  const match =
    catalog.find((item) => item.slug === template.slug || item.id === template.id) ||
    catalog.find((item) => item.slug === preferred || item.id === preferred) ||
    catalog[0];
  return match?.slug || match?.id || preferred || template.slug;
}

export default function TemplatesPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('ALL');
  const [previewTemplate, setPreviewTemplate] = React.useState<TemplateDefinition | null>(null);
  const [previewViewMode, setPreviewViewMode] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isCreating, setIsCreating] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const CATEGORY_GROUPS: { id: string; label: string; industries: string[] | null; featured?: boolean }[] = [
    { id: 'ALL', label: 'All', industries: null },
    { id: 'BUSINESS', label: 'Business', industries: ['CONSULTING', 'LAW_FIRM', 'REAL_ESTATE'] },
    { id: 'PORTFOLIO', label: 'Portfolio', industries: ['PHOTOGRAPHER', 'ARCHITECTURE', 'INTERIOR_DESIGN'] },
    { id: 'AGENCY', label: 'Agency', industries: ['CREATIVE_AGENCY'] },
    { id: 'RESTAURANT', label: 'Restaurant', industries: ['RESTAURANT', 'CAFE', 'HOTEL'] },
    { id: 'SAAS', label: 'SaaS', industries: ['SOFTWARE_SAAS'] },
    { id: 'PROFESSIONAL', label: 'Professional', industries: ['CONSULTING', 'LAW_FIRM', 'EDUCATION', 'HEALTHCARE', 'DENTAL'] },
    { id: 'SERVICES', label: 'Services', industries: ['SALON', 'SPA', 'FITNESS', 'AUTOMOTIVE', 'TRAVEL'] },
    { id: 'LANDING', label: 'Landing page', industries: null, featured: true },
    { id: 'BLOG', label: 'Blog', industries: ['EDUCATION', 'SCHOOL'] },
    { id: 'OTHER', label: 'Other', industries: ['HOTEL', 'TRAVEL', 'AUTOMOTIVE'] },
  ];

  const filteredTemplates = TEMPLATES_DEFINITIONS.filter((tpl) => {
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.industry.toLowerCase().includes(searchQuery.toLowerCase());

    const group = CATEGORY_GROUPS.find((item) => item.id === activeCategory) ?? CATEGORY_GROUPS[0];
    const matchesCategory =
      group.id === 'ALL' ||
      (group.featured ? Boolean(tpl.featured) : Boolean(group.industries?.includes(tpl.industry)));

    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = async (template: TemplateDefinition) => {
    setIsCreating(true);
    setErrorMsg(null);

    try {
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

      const catalog: Array<{ id: string; slug: string; name: string }> = await apiClient
        .get('/templates')
        .then((data) => (Array.isArray(data) ? data : []))
        .catch(() => []);
      const backendId = resolveBackendTemplateId(template, catalog);

      const website = await websitesApi.create({
        businessId,
        templateId: backendId,
        name: `${template.document.business.name || template.name}`,
      });

      await websitesApi.saveDraft(website.id, {
        theme: template.document.theme,
        business: template.document.business,
        pages: template.document.pages,
        seoTitle: template.document.seoTitle,
        seoDescription: template.document.seoDescription,
      });

      router.push(`/editor/${website.id}`);
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message || err?.message || 'Failed to initialize website.',
      );
      setIsCreating(false);
    }
  };

  return (
    <div className="flex-1 space-y-6">
      <PageHeader
        title="Templates"
        description="Start from an industry layout, then edit every page in the visual builder."
        actions={
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates"
              className="pl-9"
            />
          </div>
        }
      />

      {errorMsg ? (
        <Alert variant="destructive">
          <AlertTitle>Could not create website</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-3">
            <span>{errorMsg}</span>
            <Button size="icon-sm" variant="ghost" aria-label="Dismiss" onClick={() => setErrorMsg(null)}>
              <X />
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
        {CATEGORY_GROUPS.map((cat) => (
          <Button
            key={cat.id}
            size="sm"
            variant={activeCategory === cat.id ? 'default' : 'secondary'}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {filteredTemplates.length === 0 ? (
        <EmptyState
          icon={<LayoutTemplate className="size-6" />}
          title="No templates match"
          description="Try a different category or search term. You can still create a site from Websites."
          actionLabel="Clear filters"
          onAction={() => {
            setSearchQuery('');
            setActiveCategory('ALL');
          }}
        />
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className="flex flex-col justify-between group overflow-hidden"
          >
            <div>
              {/* Preview Banner */}
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                {template.previewImage ? (
                  <img
                    src={template.previewImage}
                    alt={template.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <LayoutTemplate className="h-10 w-10 opacity-50" />
                  </div>
                )}

                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="secondary">{template.industry.replace('_', ' ')}</Badge>
                  {template.featured && (
                    <Badge variant="default">Featured</Badge>
                  )}
                </div>
              </div>

              {/* Template Details */}
              <div className="p-6">
                <h3 className="text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
                  {template.name}
                </h3>
                <p className="text-xs font-medium text-muted-foreground mt-1">
                  {template.style}
                </p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {template.description}
                </p>

                {/* Theme tokens preview */}
                <div className="mt-4 flex items-center gap-2.5 border-t pt-4">
                  <div
                    className="h-4 w-4 rounded-full border shadow-sm"
                    style={{
                      backgroundColor: template.document.theme?.accentColor || '#6366f1',
                    }}
                    title="Accent Color"
                  />
                  <div
                    className="h-4 w-4 rounded-full border shadow-sm"
                    style={{
                      backgroundColor: template.document.theme?.primaryColor || '#0f172a',
                    }}
                    title="Primary Theme Color"
                  />
                  <span className="text-xs text-muted-foreground font-mono ml-2">
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
                className="flex-1"
              >
                <Eye className="mr-2 h-4 w-4" />
                Inspect
              </Button>
              <Button
                size="sm"
                onClick={() => handleUseTemplate(template)}
                isLoading={isCreating}
                className="flex-1"
              >
                Use Template
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
      )}

      {/* Inspect Template Fullscreen Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-xl select-none">
          <header className="flex h-16 w-full items-center justify-between border-b px-6 bg-card/90 z-20">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-foreground">
                {previewTemplate.name}
              </span>
              <span className="rounded-full bg-primary/20 text-primary px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase border border-primary/30">
                {previewTemplate.industry}
              </span>
            </div>

            <ToggleGroup
              type="single"
              value={previewViewMode}
              onValueChange={(value) => {
                if (value === 'desktop' || value === 'tablet' || value === 'mobile') {
                  setPreviewViewMode(value);
                }
              }}
              variant="outline"
              size="sm"
              spacing={0}
            >
              <ToggleGroupItem value="desktop" aria-label="Desktop preview">
                <Monitor className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="tablet" aria-label="Tablet preview">
                <Tablet className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="mobile" aria-label="Mobile preview">
                <Smartphone className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>

            <div className="flex items-center gap-3">
              <Button
                size="sm"
                onClick={() => {
                  const tpl = previewTemplate;
                  setPreviewTemplate(null);
                  handleUseTemplate(tpl);
                }}
                isLoading={isCreating}
              >
                Use This Template
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center items-start bg-background">
            <div
              className={`transition-all duration-300 ${
                previewViewMode === 'desktop'
                  ? 'w-full max-w-full'
                  : previewViewMode === 'tablet'
                  ? 'w-[768px] max-w-[768px] my-6 rounded-[28px] border-[8px] border-muted shadow-2xl overflow-y-auto max-h-[85vh]'
                  : 'w-[375px] max-w-[375px] my-6 rounded-[36px] border-[8px] border-muted shadow-2xl overflow-y-auto max-h-[85vh]'
              }`}
            >
              <div data-view-mode={previewViewMode} className="w-full bg-background">
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
