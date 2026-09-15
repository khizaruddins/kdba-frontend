'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cmsApi } from '@/lib/api/cms';
import { useCmsWebsite } from '@/hooks/use-cms-website';
import { CmsCollectionField } from '@/types/cms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/kdba/page-header';
import { CmsWebsiteSwitcher } from '@/components/cms/cms-website-switcher';
import { FieldBuilder } from '@/components/cms/field-builder';
import { slugify } from '@/lib/cms/record-title';

export default function NewCollectionPage() {
  const router = useRouter();
  const { websites, websiteId, selectWebsite } = useCmsWebsite();
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [fields, setFields] = React.useState<CmsCollectionField[]>([
    { id: 'title', name: 'Title', type: 'text', required: true, system: true },
    { id: 'slug', name: 'Slug', type: 'text', required: true, unique: true, system: true },
  ]);
  const [saving, setSaving] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteId || !name.trim()) return;
    setSaving(true);
    try {
      const created = await cmsApi.createCollection(websiteId, {
        name: name.trim(),
        slug: slugify(name),
        description: description.trim() || undefined,
        fields,
        settings: { hasSlug: true, defaultStatus: 'DRAFT', publicListLimit: 50 },
      });
      toast.success('Collection created');
      router.push(`/content/collections/${created.id}`);
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : null;
      toast.error(message || 'Could not create collection');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="New collection"
        description="Create a custom content library with the fields your business needs."
        actions={
          <CmsWebsiteSwitcher websites={websites} websiteId={websiteId} onChange={selectWebsite} />
        }
      />
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Basics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Collection name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Case Studies"
            />
            <Textarea
              label="Description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldBuilder fields={fields} onChange={setFields} />
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" isLoading={saving} disabled={!websiteId}>
            Create collection
          </Button>
        </div>
      </form>
    </div>
  );
}
