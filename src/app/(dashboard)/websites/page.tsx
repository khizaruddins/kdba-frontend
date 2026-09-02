'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { Website, Template } from '@/types';
import { formatDate } from '@/lib/utils';
import {
  Globe,
  Plus,
  Edit,
  Eye,
  Rocket,
  ExternalLink,
  Sparkles,
  Calendar,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';

export default function WebsitesPage() {
  const router = useRouter();
  const [websites, setWebsites] = React.useState<Website[]>([]);
  const [templates, setTemplates] = React.useState<Template[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Create Modal state
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [newSiteName, setNewSiteName] = React.useState('');
  const [selectedTemplateId, setSelectedTemplateId] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const loadWebsites = async () => {
    try {
      const [websitesData, templatesData]: any = await Promise.all([
        apiClient.get('/websites').catch(() => []),
        apiClient.get('/templates').catch(() => []),
      ]);
      setWebsites(Array.isArray(websitesData) ? websitesData : []);
      if (Array.isArray(templatesData)) {
        setTemplates(templatesData);
        if (templatesData.length > 0) setSelectedTemplateId(templatesData[0].id);
      }
    } catch (err) {
      console.error('Failed to load websites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadWebsites();
  }, []);

  const handleCreateWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName || !selectedTemplateId) return;

    setIsSubmitting(true);
    try {
      // Fetch businesses
      const businesses: any = await apiClient.get('/businesses');
      let businessId = businesses?.[0]?.id;

      if (!businessId) {
        // Create business on the fly
        const created: any = await apiClient.post('/businesses', {
          name: newSiteName,
        });
        businessId = created.id;
      }

      const createdSite: any = await apiClient.post('/websites', {
        businessId,
        templateId: selectedTemplateId,
        name: newSiteName,
      });

      setIsCreateOpen(false);
      router.push(`/editor/${createdSite.id}`);
    } catch (err) {
      console.error('Failed to create website:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Websites
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage, edit, and publish your business website properties
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Create New Website
        </Button>
      </div>

      {/* Websites Grid */}
      {websites.length === 0 && !isLoading ? (
        <EmptyState
          icon={<Globe className="h-6 w-6 text-indigo-400" />}
          title="No websites created yet"
          description="Create your first website from our curated business templates."
          actionLabel="Choose a Template"
          onAction={() => router.push('/templates')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.map((website) => {
            const isPublished = website.status === 'PUBLISHED';
            return (
              <Card
                key={website.id}
                className="overflow-hidden card-hover flex flex-col justify-between"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <Badge variant={isPublished ? 'success' : 'secondary'}>
                      {isPublished ? 'Live' : 'Draft'}
                    </Badge>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(website.createdAt || '')}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mt-4">
                    {website.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Slug: <span className="font-mono text-slate-300">/site/{website.slug}</span>
                  </p>

                  <div className="mt-6 flex items-center gap-4 text-xs text-slate-400 border-t border-slate-800 pt-4">
                    <div className="flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{website.pages?.length || 3} pages</span>
                    </div>
                    {website.template && (
                      <span className="text-slate-500 truncate max-w-[150px]">
                        • {website.template.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-950/60 p-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  <Link href={`/editor/${website.id}`} className="flex-1">
                    <Button
                      size="sm"
                      className="w-full"
                      leftIcon={<Edit className="h-3.5 w-3.5" />}
                    >
                      Open Builder
                    </Button>
                  </Link>

                  {isPublished && (
                    <Link
                      href={`/site/${website.slug}`}
                      target="_blank"
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                      title="View live website"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Website Dialog */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Website"
        description="Select a template and give your website a name."
      >
        <form onSubmit={handleCreateWebsite} className="space-y-4 pt-2">
          <Input
            label="Website Name"
            required
            value={newSiteName}
            onChange={(e) => setNewSiteName(e.target.value)}
            placeholder="e.g. Apex Advisory Global"
          />

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Choose Base Template
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`p-3 rounded-xl border cursor-pointer text-left transition-all ${
                    selectedTemplateId === tpl.id
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase text-indigo-400 block">
                    {tpl.category}
                  </span>
                  <span className="text-xs font-bold text-white block mt-0.5">
                    {tpl.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={isSubmitting}
            >
              Create & Launch Editor
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
