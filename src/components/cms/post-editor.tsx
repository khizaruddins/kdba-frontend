'use client';

import * as React from 'react';
import { RichContentEditor } from './rich-content-editor';
import { ContentBlock, countWords, estimateReadTime, createBlock } from '@/lib/cms/content-blocks';
import { CmsRecordStatus, CmsAuthor, CmsCategory } from '@/types/cms';
import { cmsApi, cmsPostsApi, cmsAuthorsApi, cmsCategoriesApi } from '@/lib/api/cms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Image as ImageIcon, Settings, Save, Check, Globe, Lock } from 'lucide-react';
import { MediaPickerModal } from '@/components/ui/media-picker-modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function parseBlocks(content: unknown): ContentBlock[] {
  if (Array.isArray(content)) return content as ContentBlock[];
  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed as ContentBlock[];
    } catch {
      // not json, create a default paragraph block if non-empty
      if (content.trim()) {
        const p = createBlock('paragraph');
        if ('html' in p) p.html = content;
        return [p];
      }
    }
  }
  return [];
}

export interface PostEditorProps {
  websiteId: string;
  collectionId: string;
  recordId?: string;
  onBack: () => void;
}

export function PostEditor({ websiteId, collectionId, recordId, onBack }: PostEditorProps) {
  const [currentId, setCurrentId] = React.useState<string | undefined>(recordId);
  const [title, setTitle] = React.useState('');
  const [excerpt, setExcerpt] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [status, setStatus] = React.useState<CmsRecordStatus>('DRAFT');
  const [blocks, setBlocks] = React.useState<ContentBlock[]>([]);
  const [authorId, setAuthorId] = React.useState<string>('');
  const [authorName, setAuthorName] = React.useState('');
  const [categories, setCategories] = React.useState<string[]>([]);
  const [featuredImageUrl, setFeaturedImageUrl] = React.useState('');
  const [seoTitle, setSeoTitle] = React.useState('');
  const [seoDescription, setSeoDescription] = React.useState('');
  
  const [availableAuthors, setAvailableAuthors] = React.useState<CmsAuthor[]>([]);
  const [availableCategories, setAvailableCategories] = React.useState<CmsCategory[]>([]);

  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [mediaPickerOpen, setMediaPickerOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  // Load available authors & categories
  React.useEffect(() => {
    void cmsAuthorsApi.list(websiteId).then((res) => {
      const list = Array.isArray(res) ? res : (res as any)?.data || [];
      setAvailableAuthors(list);
    }).catch(() => {});

    void cmsCategoriesApi.list(websiteId).then((res) => {
      const list = Array.isArray(res) ? res : (res as any)?.data || [];
      setAvailableCategories(list);
    }).catch(() => {});
  }, [websiteId]);

  // Initial load of post
  React.useEffect(() => {
    if (!recordId) return;

    let loaded = false;
    // Try dedicated posts API first
    void cmsPostsApi.get(websiteId, recordId).then((post) => {
      if (post && post.id) {
        loaded = true;
        setTitle(post.title || '');
        setExcerpt(post.excerpt || '');
        setSlug(post.slug || '');
        setStatus((post.status as CmsRecordStatus) || 'DRAFT');
        setBlocks(parseBlocks(post.content));
        setAuthorId(post.authorId || '');
        setAuthorName(post.author?.name || '');
        setCategories(post.categories ? post.categories.map((c) => c.category?.name || c.id) : []);
        setFeaturedImageUrl(post.featuredImage || '');
        setSeoTitle(post.seoTitle || '');
        setSeoDescription(post.seoDescription || '');
      }
    }).catch(() => {
      // Ignore error and fall back to collection
    }).finally(() => {
      if (!loaded && collectionId) {
        // Fallback to generic collection record
        void cmsApi.getRecord(websiteId, collectionId, recordId).then((rec) => {
          setTitle((rec.data.title as string) || '');
          setExcerpt((rec.data.excerpt as string) || '');
          setSlug(rec.slug || '');
          setStatus(rec.status || 'DRAFT');
          setBlocks(parseBlocks(rec.data.content));
          setAuthorName((rec.data.authorName as string) || '');
          setCategories(Array.isArray(rec.data.categories) ? (rec.data.categories as string[]) : []);
          setFeaturedImageUrl((rec.data.featuredImageUrl as string) || '');
        }).catch(console.error);
      }
    });
  }, [websiteId, collectionId, recordId]);

  const savePost = React.useCallback(async () => {
    setSaveStatus('saving');
    try {
      const selectedAuthor = availableAuthors.find((a) => a.id === authorId);
      const effectiveAuthorName = selectedAuthor ? selectedAuthor.name : authorName;
      const contentJson = JSON.stringify(blocks);

      // Save via dedicated cmsPostsApi
      let savedPostId = currentId;
      try {
        if (currentId) {
          const updated = await cmsPostsApi.update(websiteId, currentId, {
            title,
            slug: slug || slugify(title),
            excerpt,
            content: contentJson,
            featuredImage: featuredImageUrl,
            status,
            authorId: authorId || undefined,
            seoTitle,
            seoDescription,
          });
          if (updated?.id) savedPostId = updated.id;
        } else {
          const created = await cmsPostsApi.create(websiteId, {
            title,
            slug: slug || slugify(title),
            excerpt,
            content: contentJson,
            featuredImage: featuredImageUrl,
            status,
            authorId: authorId || undefined,
            seoTitle,
            seoDescription,
          });
          if (created?.id) {
            savedPostId = created.id;
            setCurrentId(created.id);
          }
        }
      } catch (postErr) {
        console.warn('Dedicated post save error, proceeding with dual-collection update', postErr);
      }

      // Dual-sync to collection record for builder canvas compatibility
      if (collectionId) {
        const collectionData = {
          title,
          excerpt,
          content: blocks,
          authorName: effectiveAuthorName,
          categories,
          featuredImageUrl,
        };

        if (savedPostId) {
          await cmsApi.updateRecord(websiteId, collectionId, savedPostId, {
            data: collectionData,
            slug: slug || slugify(title),
            status,
          }).catch(() => {});
        } else {
          const rec = await cmsApi.createRecord(websiteId, collectionId, {
            data: collectionData,
            slug: slug || slugify(title),
            status,
          }).catch(() => null);
          if (rec?.id && !savedPostId) {
            setCurrentId(rec.id);
          }
        }
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    }
  }, [websiteId, collectionId, currentId, title, excerpt, blocks, authorId, authorName, availableAuthors, categories, featuredImageUrl, slug, status, seoTitle, seoDescription]);

  // Debounced autosave
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (title || blocks.length > 0) {
        void savePost();
      }
    }, 5000);
    return () => clearTimeout(handler);
  }, [savePost, title, blocks]);

  const wordCount = countWords(blocks);
  const readTime = estimateReadTime(blocks);

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
          <span className="text-sm text-muted-foreground">
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'saved' && 'Saved just now'}
            {saveStatus === 'error' && 'Save failed'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatus('DRAFT')}
            className={status === 'DRAFT' ? 'bg-muted' : ''}
          >
            Draft
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => setStatus('PUBLISHED')}
            className={status === 'PUBLISHED' ? 'bg-primary' : ''}
          >
            Publish
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Settings className="size-4" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor Area */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="mx-auto max-w-3xl space-y-8">
            {/* Cover Image */}
            <div
              className="relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/50 hover:bg-muted"
              onClick={() => setMediaPickerOpen(true)}
            >
              {featuredImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={featuredImageUrl} alt="Cover" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                  <ImageIcon className="mb-2 size-8" />
                  <p>Add featured image</p>
                </div>
              )}
            </div>

            {/* Title & Excerpt */}
            <div>
              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slug && e.target.value) setSlug(slugify(e.target.value));
                }}
                placeholder="Post title..."
                className="border-none text-5xl font-bold px-0 focus-visible:ring-0 shadow-none"
              />
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Write a short excerpt..."
                className="mt-4 resize-none border-none text-xl text-muted-foreground px-0 focus-visible:ring-0 shadow-none"
                rows={2}
              />
            </div>

            <hr className="border-border" />

            <RichContentEditor
              value={blocks}
              onChange={setBlocks}
            />

            <hr className="border-border" />
            <div className="text-sm text-muted-foreground pb-20">
              {wordCount} words &middot; {readTime} min read
            </div>
          </div>
        </main>

        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-80 border-l overflow-y-auto p-4 space-y-6">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Post Settings</Label>
              <div className="space-y-4">
                <div>
                  <Label>Slug</Label>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
                </div>
                <div>
                  <Label>Author</Label>
                  {availableAuthors.length > 0 ? (
                    <Select
                      value={authorId}
                      onValueChange={(val) => {
                        setAuthorId(val);
                        const match = availableAuthors.find((a) => a.id === val);
                        if (match) setAuthorName(match.name);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select author" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableAuthors.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Author name"
                    />
                  )}
                </div>
                <div>
                  <Label>Categories (comma separated)</Label>
                  <Input
                    value={categories.join(', ')}
                    onChange={(e) => setCategories(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                    placeholder="Tech, Design"
                  />
                  {availableCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {availableCategories.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            if (!categories.includes(c.name)) {
                              setCategories([...categories, c.name]);
                            }
                          }}
                          className="text-xs px-2 py-0.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground"
                        >
                          + {c.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">SEO</Label>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs">SEO Title</Label>
                  <Input
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Custom meta title"
                  />
                </div>
                <div>
                  <Label className="text-xs">SEO Description</Label>
                  <Textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Custom meta description"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(media) => {
          setFeaturedImageUrl(typeof media === 'string' ? media : (media as any).url);
          setMediaPickerOpen(false);
        }}
      />
    </div>
  );
}
