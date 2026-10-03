'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, Bookmark } from 'lucide-react';
import { CmsRecord } from '@/types/cms';
import { CmsRenderPayload, resolveCmsMediaValue } from '@/lib/cms/bindings';
import { RichContentRenderer } from '@/components/cms/rich-content-renderer';
import { ContentBlock } from '@/lib/cms/content-blocks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export interface PublicPostViewProps {
  record: CmsRecord;
  cms?: CmsRenderPayload | null;
  tenantSlug: string;
  onNavigate?: (url: string) => void;
}

export function PublicPostView({
  record,
  cms,
  tenantSlug,
  onNavigate,
}: PublicPostViewProps) {
  const data = record.data || {};
  const title = String(data.title || data.name || 'Untitled Post');
  const excerpt = data.excerpt ? String(data.excerpt) : null;
  const imageValue = data.featuredImage || data.image;
  const imageUrl = resolveCmsMediaValue(imageValue, cms, 'blog-posts');

  const contentRaw = data.content;
  const blocks: ContentBlock[] = Array.isArray(contentRaw)
    ? contentRaw
    : typeof contentRaw === 'string'
      ? [{ id: 'p1', type: 'paragraph', html: contentRaw }]
      : [];

  const rawDate = data.publishedAt || record.createdAt;
  const formattedDate = rawDate
    ? new Date(String(rawDate)).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  // Author details
  const authorName = String(data.authorName || data.author || 'Editorial Team');
  const authorAvatar = data.authorAvatar || data.avatar;
  const authorAvatarUrl = resolveCmsMediaValue(authorAvatar, cms, 'authors');
  const authorBio = data.authorBio ? String(data.authorBio) : null;

  // Categories and tags
  const categories: string[] = Array.isArray(data.categories)
    ? data.categories.map(String)
    : data.category
      ? [String(data.category)]
      : [];

  const tags: string[] = Array.isArray(data.tags)
    ? data.tags.map(String)
    : [];

  // Related posts
  const blogCollection = cms?.collections?.find((c) => c.slug === 'blog-posts');
  const relatedPosts = (blogCollection?.records || [])
    .filter((r) => r.id !== record.id)
    .slice(0, 3);

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('/');
    }
  };

  return (
    <article className="min-h-screen bg-[var(--kdba-background,#0B0D13)] text-[var(--kdba-text,#FFFFFF)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors py-1 cursor-pointer"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Website
          </button>
        </div>

        {/* Categories Bar */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant="outline"
                className="rounded-full px-3 py-1 text-xs border-primary/40 bg-primary/10 text-primary uppercase font-bold tracking-wider"
              >
                {cat}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-foreground font-[family-name:var(--kdba-font-heading)]">
          {title}
        </h1>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-lg sm:text-xl text-muted-foreground font-light leading-relaxed">
            {excerpt}
          </p>
        )}

        {/* Author & Meta Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border/60 py-4">
          <div className="flex items-center gap-3">
            {authorAvatarUrl ? (
              <img
                src={authorAvatarUrl}
                alt={String(authorName)}
                className="h-11 w-11 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="h-11 w-11 rounded-full bg-muted flex items-center justify-center font-bold text-sm text-foreground">
                {String(authorName).charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-sm text-foreground">{authorName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {formattedDate && <span>{formattedDate}</span>}
                <span>•</span>
                <span>Blog Post</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {imageUrl && (
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/50 max-h-[500px]">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover max-h-[500px]"
            />
          </div>
        )}

        {/* Content Body */}
        <div className="py-6 font-[family-name:var(--kdba-font-body)] text-foreground">
          {blocks.length > 0 ? (
            <RichContentRenderer blocks={blocks} />
          ) : (
            <div className="text-muted-foreground py-8">
              No written content available for this post.
            </div>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="space-y-2 pt-6 border-t border-border/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-muted/60 px-2.5 py-1 text-xs text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio Box */}
        {authorBio && (
          <div className="rounded-2xl border border-border bg-card/60 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {authorAvatarUrl && (
              <img
                src={authorAvatarUrl}
                alt={String(authorName)}
                className="h-16 w-16 rounded-full object-cover shrink-0"
              />
            )}
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-foreground">Written by {authorName}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{authorBio}</p>
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="space-y-4 pt-10 border-t border-border/60">
            <h3 className="text-xl font-bold tracking-tight text-foreground font-[family-name:var(--kdba-font-heading)]">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((rel) => {
                const relTitle = String(rel.data.title || 'Untitled');
                const relImage = resolveCmsMediaValue(rel.data.featuredImage || rel.data.image, cms, 'blog-posts');
                const relSlug = rel.slug || rel.id;
                return (
                  <div
                    key={rel.id}
                    onClick={() => onNavigate && onNavigate(`/blog/${relSlug}`)}
                    className="cursor-pointer rounded-xl border border-border bg-card/60 overflow-hidden hover:border-primary/50 transition-colors flex flex-col"
                  >
                    {relImage && (
                      <div className="aspect-video w-full overflow-hidden">
                        <img src={relImage} alt={relTitle} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
                      <h4 className="text-xs font-semibold text-foreground line-clamp-2">{relTitle}</h4>
                      <span className="text-[11px] text-muted-foreground">Read article →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
