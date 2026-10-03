'use client';

import * as React from 'react';
import { CmsRecord } from '@/types/cms';
import { cmsApi, cmsAuthorsApi } from '@/lib/api/cms';
import { Button } from '@/components/ui/button';
import { MediaPickerModal } from '@/components/ui/media-picker-modal';
import { ImageIcon, X } from 'lucide-react';
import { slugify } from '@/lib/cms/record-title';

interface AuthorFormProps {
  websiteId: string;
  initialRecord: CmsRecord | null;
  onClose: () => void;
  onSave: () => void;
}

export function AuthorForm({ websiteId, initialRecord, onClose, onSave }: AuthorFormProps) {
  const [data, setData] = React.useState<Record<string, unknown>>(
    initialRecord ? { ...initialRecord.data } : {}
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name) return;
    setIsSaving(true);
    try {
      const authorPayload = {
        name: String(data.name || ''),
        slug: slugify(String(data.name || '')),
        bio: data.bio ? String(data.bio) : undefined,
        avatar: data.avatar ? String(data.avatar) : undefined,
        email: data.email ? String(data.email) : undefined,
        website: data.website ? String(data.website) : undefined,
        socialLinks: {
          twitter: String(data.twitter || ''),
          instagram: String(data.instagram || ''),
          linkedin: String(data.linkedin || ''),
        },
      };

      if (initialRecord) {
        await cmsAuthorsApi.update(websiteId, initialRecord.id, authorPayload).catch(() => {});
        await cmsApi.updateRecord(websiteId, 'authors', initialRecord.id, { data }).catch(() => {});
      } else {
        await cmsAuthorsApi.create(websiteId, authorPayload).catch(() => {});
        await cmsApi.createRecord(websiteId, 'authors', { data }).catch(() => {});
      }
      onSave();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const updateData = (key: string, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">
          {initialRecord ? 'Edit Author' : 'New Author'}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Avatar</label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full border border-border bg-muted overflow-hidden flex items-center justify-center">
              {data.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={String(data.avatar)} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-muted-foreground opacity-50" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsMediaPickerOpen(true)}>
                Choose Image
              </Button>
              {(data.avatar as string) && (
                <button type="button" onClick={() => updateData('avatar', '')} className="text-xs text-destructive hover:underline text-left">
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Name *</label>
          <input
            type="text"
            required
            value={String(data.name || '')}
            onChange={(e) => updateData('name', e.target.value)}
            className="w-full h-10 px-3 rounded-md bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            placeholder="e.g. Jane Doe"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Bio</label>
          <textarea
            value={String(data.bio || '')}
            onChange={(e) => updateData('bio', e.target.value)}
            className="w-full min-h-[120px] p-3 rounded-md bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-y"
            placeholder="A short biography..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Email</label>
          <input
            type="email"
            value={String(data.email || '')}
            onChange={(e) => updateData('email', e.target.value)}
            className="w-full h-10 px-3 rounded-md bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Website</label>
          <input
            type="url"
            value={String(data.website || '')}
            onChange={(e) => updateData('website', e.target.value)}
            className="w-full h-10 px-3 rounded-md bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary"
            placeholder="https://"
          />
        </div>
        
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-sm font-bold text-foreground">Social Links</h3>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Twitter / X</label>
            <input type="text" value={String(data.twitter || '')} onChange={(e) => updateData('twitter', e.target.value)} className="w-full h-9 px-3 rounded-md bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary" placeholder="@username" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Instagram</label>
            <input type="text" value={String(data.instagram || '')} onChange={(e) => updateData('instagram', e.target.value)} className="w-full h-9 px-3 rounded-md bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary" placeholder="@username" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">LinkedIn</label>
            <input type="url" value={String(data.linkedin || '')} onChange={(e) => updateData('linkedin', e.target.value)} className="w-full h-9 px-3 rounded-md bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary" placeholder="https://linkedin.com/in/..." />
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/20">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSaving || !data.name}>
          {isSaving ? 'Saving...' : 'Save Author'}
        </Button>
      </div>

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(media: any) => {
          updateData('avatar', media.url);
          setIsMediaPickerOpen(false);
        }}
        
      />
    </div>
  );
}
