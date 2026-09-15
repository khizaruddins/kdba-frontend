'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { generateNodeId } from '@/lib/document/v3-operations';
import { navItemsFromPages } from '@/lib/editor/global-chrome';
import {
  Plus,
  X,
  FileText,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Home,
  ChevronUp,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';

export function PagesPanel() {
  const document = useV3EditorStore((s) => s.document);
  const activePageId = useV3EditorStore((s) => s.activePageId);
  const websiteId = useV3EditorStore((s) => s.websiteId);
  const setActivePageId = useV3EditorStore((s) => s.setActivePageId);
  const setActiveNavTab = useV3EditorStore((s) => s.setActiveNavTab);
  const addPage = useV3EditorStore((s) => s.addPage);
  const removePage = useV3EditorStore((s) => s.removePage);
  const updatePage = useV3EditorStore((s) => s.updatePage);
  const duplicatePage = useV3EditorStore((s) => s.duplicatePage);
  const setHomePage = useV3EditorStore((s) => s.setHomePage);
  const reorderPages = useV3EditorStore((s) => s.reorderPages);
  const setPreviewMode = useV3EditorStore((s) => s.setPreviewMode);
  const updateNavigation = useV3EditorStore((s) => s.updateNavigation);

  const [newPageTitle, setNewPageTitle] = React.useState('');
  const [newPageSlug, setNewPageSlug] = React.useState('');
  const [isAdding, setIsAdding] = React.useState(false);
  const [renamingId, setRenamingId] = React.useState<string | null>(null);
  const [configuringId, setConfiguringId] = React.useState<string | null>(null);
  const [cmsCollections, setCmsCollections] = React.useState<Array<{ slug: string; name: string }>>(
    [],
  );

  React.useEffect(() => {
    if (!websiteId) return;
    void import('@/lib/api/cms').then(({ cmsApi }) =>
      cmsApi
        .bootstrap(websiteId)
        .then(() => cmsApi.listCollections(websiteId))
        .then((list) => setCmsCollections(list.map((item) => ({ slug: item.slug, name: item.name }))))
        .catch(() => setCmsCollections([])),
    );
  }, [websiteId]);

  if (!document) return null;

  const pages = [...document.pages].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const liveSlug = document.settings?.subdomain || document.site?.id || websiteId;
  const explicitNav = Array.isArray(document.navigation?.header);
  const navItems = explicitNav ? document.navigation!.header : navItemsFromPages(document);

  const isHiddenFromNav = (pageId: string) => !navItems.some((item) => item.pageId === pageId);

  const toggleHideFromNav = (pageId: string, title: string, slug: string) => {
    const current = explicitNav ? [...document.navigation!.header] : navItemsFromPages(document);
    const hidden = !current.some((item) => item.pageId === pageId);
    if (hidden) {
      updateNavigation({
        header: [
          ...current,
          {
            id: generateNodeId('nav'),
            label: title,
            href: slug || '/',
            pageId,
            target: '_self',
          },
        ],
      });
      return;
    }
    updateNavigation({ header: current.filter((item) => item.pageId !== pageId) });
  };

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;
    const slug = newPageSlug.trim() || newPageTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    addPage(newPageTitle.trim(), slug);
    setNewPageTitle('');
    setNewPageSlug('');
    setIsAdding(false);
  };

  const movePage = (index: number, direction: -1 | 1) => {
    const next = [...pages];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    reorderPages(next.map((page) => page.id));
  };

  return (
    <div className="flex h-full w-full min-w-0 shrink-0 flex-col overflow-hidden border-r border-border bg-card z-20 select-none">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-sm text-foreground tracking-tight">Pages</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            title="Add Page"
            aria-label="Add page"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setActiveNavTab(null)}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Close pages panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleCreatePage} className="p-3 bg-muted/50 border-b border-border space-y-2">
          <input
            type="text"
            placeholder="Page Title (e.g. Services)"
            value={newPageTitle}
            onChange={(e) => setNewPageTitle(e.target.value)}
            className="w-full h-8 px-2.5 rounded-lg bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring"
            autoFocus
          />
          <input
            type="text"
            placeholder="Slug (e.g. /services)"
            value={newPageSlug}
            onChange={(e) => setNewPageSlug(e.target.value)}
            className="w-full h-8 px-2.5 rounded-lg bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring"
          />
          <div className="flex gap-2 justify-end pt-1">
            <button type="button" onClick={() => setIsAdding(false)} className="px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1 text-xs font-semibold rounded-md bg-primary hover:bg-primary/90 text-primary-foreground">
              Create Page
            </button>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {pages.map((page, index) => {
          const isActive = activePageId === page.id;
          const isHome = page.type === 'home';
          return (
            <div
              key={page.id}
              className={`group rounded-xl border px-2 py-1.5 ${
                isActive ? 'bg-primary/10 border-primary/40' : 'border-transparent hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActivePageId(page.id)}
                  className="flex-1 min-w-0 text-left"
                >
                  {renamingId === page.id ? (
                    <input
                      autoFocus
                      defaultValue={page.title}
                      onClick={(e) => e.stopPropagation()}
                      onBlur={(e) => {
                        const title = e.target.value.trim();
                        if (title) updatePage(page.id, { title });
                        setRenamingId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                      }}
                      className="w-full h-6 px-1 rounded bg-background border border-border text-xs text-foreground"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5 truncate text-xs text-foreground">
                      {isHome && <Home className="w-3 h-3 text-warning shrink-0" />}
                      <span className="truncate font-medium">{page.title}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{page.slug}</span>
                    </div>
                  )}
                </button>
                {isHiddenFromNav(page.id) && <EyeOff className="w-3 h-3 text-muted-foreground" />}
              </div>
              <div className="flex items-center gap-0.5 mt-1 opacity-0 group-hover:opacity-100">
                <button type="button" title="Rename" onClick={() => setRenamingId(page.id)} className="p-1 text-muted-foreground hover:text-foreground text-[10px]">
                  Rename
                </button>
                <button
                  type="button"
                  title="Content settings"
                  onClick={() => setConfiguringId(configuringId === page.id ? null : page.id)}
                  className="p-1 text-muted-foreground hover:text-foreground text-[10px]"
                >
                  Content
                </button>
                <button type="button" title="Duplicate page" aria-label="Duplicate page" onClick={() => duplicatePage(page.id)} className="p-1 text-muted-foreground hover:text-foreground">
                  <Copy className="w-3 h-3" />
                </button>
                <button type="button" title="Set homepage" aria-label="Set homepage" onClick={() => setHomePage(page.id)} className="p-1 text-muted-foreground hover:text-warning">
                  <Home className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  title={isHiddenFromNav(page.id) ? 'Show in navigation' : 'Hide from navigation'}
                  aria-label={isHiddenFromNav(page.id) ? 'Show in navigation' : 'Hide from navigation'}
                  onClick={() => toggleHideFromNav(page.id, page.title, page.slug)}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  {isHiddenFromNav(page.id) ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
                <button type="button" title="Move up" aria-label="Move page up" onClick={() => movePage(index, -1)} className="p-1 text-muted-foreground hover:text-foreground">
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button type="button" title="Move down" aria-label="Move page down" onClick={() => movePage(index, 1)} className="p-1 text-muted-foreground hover:text-foreground">
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  title="Preview page"
                  aria-label="Preview page"
                  onClick={() => {
                    setActivePageId(page.id);
                    setPreviewMode(true);
                  }}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <Eye className="w-3 h-3" />
                </button>
                <a
                  href={`/site/${liveSlug}${page.slug === '/' ? '' : page.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Open published page"
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
                {pages.length > 1 && (
                  <button
                    type="button"
                    title="Delete page"
                    aria-label="Delete page"
                    onClick={() => removePage(page.id)}
                    className="p-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
              {configuringId === page.id ? (
                <div className="mt-2 space-y-2 rounded-lg border border-border bg-background p-2">
                  <label className="block space-y-1">
                    <span className="text-[10px] font-medium text-muted-foreground">Page type</span>
                    <select
                      className="h-7 w-full rounded-md border border-border bg-background px-2 text-xs"
                      value={page.kind || 'static'}
                      onChange={(e) => {
                        const kind = e.target.value as 'static' | 'collection-index' | 'collection-item';
                        if (kind === 'static') {
                          updatePage(page.id, { kind: 'static', collection: undefined });
                          return;
                        }
                        const collectionSlug = page.collection?.slug || cmsCollections[0]?.slug || 'services';
                        updatePage(page.id, {
                          kind,
                          collection: { slug: collectionSlug, itemParam: 'slug' },
                          slug:
                            kind === 'collection-item'
                              ? page.slug.includes(':slug')
                                ? page.slug
                                : `${page.slug === '/' ? '/item' : page.slug.replace(/\/$/, '')}/:slug`
                              : page.slug.replace(/\/:slug$/, '') || page.slug,
                        });
                      }}
                    >
                      <option value="static">Static page</option>
                      <option value="collection-index">Collection list page</option>
                      <option value="collection-item">Collection detail page</option>
                    </select>
                  </label>
                  {(page.kind === 'collection-index' || page.kind === 'collection-item') && (
                    <label className="block space-y-1">
                      <span className="text-[10px] font-medium text-muted-foreground">
                        Linked collection
                      </span>
                      <select
                        className="h-7 w-full rounded-md border border-border bg-background px-2 text-xs"
                        value={page.collection?.slug || ''}
                        onChange={(e) =>
                          updatePage(page.id, {
                            collection: { slug: e.target.value, itemParam: 'slug' },
                          })
                        }
                      >
                        <option value="" disabled>
                          Choose collection
                        </option>
                        {cmsCollections.map((collection) => (
                          <option key={collection.slug} value={collection.slug}>
                            {collection.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  {page.kind === 'collection-item' ? (
                    <p className="text-[10px] text-muted-foreground">
                      Detail pages use a path like <code>/services/:slug</code> and bind fields to the
                      current record.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
