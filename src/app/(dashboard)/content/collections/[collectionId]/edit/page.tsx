'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cmsApi } from '@/lib/api/cms';
import { useCmsWebsite } from '@/hooks/use-cms-website';
import { CmsCollectionField } from '@/types/cms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/kdba/page-header';
import { FieldBuilder } from '@/components/cms/field-builder';

export default function EditCollectionPage() {
  const params = useParams();
  const router = useRouter();
  const collectionId = String(params?.collectionId || '');
  const { websiteId } = useCmsWebsite();
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [fields, setFields] = React.useState<CmsCollectionField[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!websiteId || !collectionId) return;
    void cmsApi
      .getCollection(websiteId, collectionId)
      .then((collection) => {
        setName(collection.name);
        setDescription(collection.description || '');
        setFields(collection.fields || []);
      })
      .catch(() => toast.error('Could not load collection'))
      .finally(() => setLoading(false));
  }, [websiteId, collectionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteId) return;
    setSaving(true);
    try {
      await cmsApi.updateCollection(websiteId, collectionId, {
        name: name.trim(),
        description: description.trim() || undefined,
        fields,
      });
      toast.success('Collection updated');
      router.push(`/content/collections/${collectionId}`);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : null;
      toast.error(message || 'Could not update collection');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Edit collection fields"
        description="Change the structure of records in this collection."
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
          <Button type="submit" isLoading={saving}>
            Save fields
          </Button>
        </div>
      </form>
    </div>
  );
}
