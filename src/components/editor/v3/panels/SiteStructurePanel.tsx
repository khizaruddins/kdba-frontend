'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { NavItem } from '@/types/v3-document';
import { generateNodeId } from '@/lib/document/v3-operations';
import { buildDefaultFooter, buildDefaultHeader, navItemsFromPages } from '@/lib/editor/global-chrome';
import { HEADER_VARIANTS } from '@/lib/editor/variants';
import {
  X,
  Globe,
  PanelTop,
  PanelBottom,
  Plus,
  Trash2,
  Library,
} from 'lucide-react';

export function SiteStructurePanel() {
  const document = useV3EditorStore((s) => s.document);
  const setActiveNavTab = useV3EditorStore((s) => s.setActiveNavTab);
  const setSelectedNodeId = useV3EditorStore((s) => s.setSelectedNodeId);
  const updateGlobal = useV3EditorStore((s) => s.updateGlobal);
  const updateNavigation = useV3EditorStore((s) => s.updateNavigation);
  const updateProps = useV3EditorStore((s) => s.updateProps);
  const insertReusable = useV3EditorStore((s) => s.insertReusable);

  if (!document) return null;

  const header = document.global?.headerNode;
  const footer = document.global?.footerNode;
  const navItems = document.navigation?.header?.length
    ? document.navigation.header
    : navItemsFromPages(document);
  const cta = document.navigation?.ctaButton || { label: 'Get Started', href: '#contact' };
  const library = Object.entries(document.global?.reusableNodes || {});

  const setNavItems = (items: NavItem[]) => {
    updateNavigation({ header: items });
  };

  return (
    <div className="w-80 shrink-0 border-r border-slate-800/80 bg-slate-950/95 flex flex-col h-full overflow-hidden select-none z-20">
      <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-sm text-white tracking-tight">Site</h3>
        </div>
        <button
          type="button"
          onClick={() => setActiveNavTab(null)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Close site panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-5 text-xs">
        <section className="space-y-2">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Global chrome</h4>
          <button
            type="button"
            onClick={() => header && setSelectedNodeId(header.id)}
            className="w-full flex items-center gap-2 h-9 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:border-indigo-500/50"
          >
            <PanelTop className="w-3.5 h-3.5 text-indigo-400" />
            Edit header
          </button>
          <button
            type="button"
            onClick={() => footer && setSelectedNodeId(footer.id)}
            className="w-full flex items-center gap-2 h-9 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:border-indigo-500/50"
          >
            <PanelBottom className="w-3.5 h-3.5 text-indigo-400" />
            Edit footer
          </button>
          <label className="flex items-center justify-between text-slate-400">
            <span>Show header</span>
            <input
              type="checkbox"
              checked={Boolean(header)}
              onChange={(e) =>
                updateGlobal({
                  headerDisabled: !e.target.checked,
                  headerNode: e.target.checked
                    ? header || buildDefaultHeader(document.site?.name)
                    : undefined,
                })
              }
              className="accent-indigo-500"
            />
          </label>
          <label className="flex items-center justify-between text-slate-400">
            <span>Show footer</span>
            <input
              type="checkbox"
              checked={Boolean(footer)}
              onChange={(e) =>
                updateGlobal({
                  footerDisabled: !e.target.checked,
                  footerNode: e.target.checked
                    ? footer || buildDefaultFooter(document.site?.name)
                    : undefined,
                })
              }
              className="accent-indigo-500"
            />
          </label>
          {header && (
            <div className="space-y-1">
              <label className="text-slate-400">Header variant</label>
              <select
                value={String(header.props?.variant || 'standard')}
                onChange={(e) => updateProps(header.id, { variant: e.target.value })}
                className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
              >
                {HEADER_VARIANTS.map((variant) => (
                  <option key={variant} value={variant}>
                    {variant}
                  </option>
                ))}
              </select>
            </div>
          )}
        </section>

        <section className="space-y-2 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Navigation</h4>
            <button
              type="button"
              onClick={() =>
                setNavItems([
                  ...navItems,
                  {
                    id: generateNodeId('nav'),
                    label: 'New link',
                    href: '/',
                    target: '_self',
                  },
                ])
              }
              className="p-1 rounded text-slate-400 hover:text-white"
              aria-label="Add navigation item"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            {navItems.map((item, index) => (
              <div key={item.id} className="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex gap-1">
                  <input
                    aria-label="Navigation label"
                    value={item.label}
                    onChange={(e) => {
                      const next = [...navItems];
                      next[index] = { ...item, label: e.target.value };
                      setNavItems(next);
                    }}
                    className="flex-1 h-7 px-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                  />
                  <button
                    type="button"
                    aria-label="Remove navigation item"
                    onClick={() => setNavItems(navItems.filter((entry) => entry.id !== item.id))}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <select
                  aria-label="Link type"
                  value={item.pageId ? 'page' : item.href.startsWith('#') ? 'anchor' : item.href.startsWith('http') ? 'external' : 'page'}
                  onChange={(e) => {
                    const kind = e.target.value;
                    const next = [...navItems];
                    if (kind === 'page' && document.pages[0]) {
                      next[index] = {
                        ...item,
                        pageId: document.pages[0].id,
                        href: document.pages[0].slug,
                        target: '_self',
                      };
                    } else if (kind === 'anchor') {
                      next[index] = { ...item, pageId: undefined, href: '#section', target: '_self' };
                    } else {
                      next[index] = { ...item, pageId: undefined, href: 'https://', target: '_blank' };
                    }
                    setNavItems(next);
                  }}
                  className="w-full h-7 px-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300"
                >
                  <option value="page">Internal page</option>
                  <option value="external">External URL</option>
                  <option value="anchor">Anchor</option>
                </select>
                {item.pageId ? (
                  <select
                    aria-label="Target page"
                    value={item.pageId}
                    onChange={(e) => {
                      const page = document.pages.find((entry) => entry.id === e.target.value);
                      if (!page) return;
                      const next = [...navItems];
                      next[index] = { ...item, pageId: page.id, href: page.slug, label: item.label };
                      setNavItems(next);
                    }}
                    className="w-full h-7 px-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300"
                  >
                    {document.pages.map((page) => (
                      <option key={page.id} value={page.id}>
                        {page.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    aria-label="Link href"
                    value={item.href}
                    onChange={(e) => {
                      const next = [...navItems];
                      next[index] = { ...item, href: e.target.value };
                      setNavItems(next);
                    }}
                    className="w-full h-7 px-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300"
                  />
                )}
                <label className="flex items-center justify-between text-slate-500">
                  <span>Open in new tab</span>
                  <input
                    type="checkbox"
                    checked={item.target === '_blank'}
                    onChange={(e) => {
                      const next = [...navItems];
                      next[index] = { ...item, target: e.target.checked ? '_blank' : '_self' };
                      setNavItems(next);
                    }}
                    className="accent-indigo-500"
                  />
                </label>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              aria-label="CTA label"
              value={cta.label}
              onChange={(e) => updateNavigation({ ctaButton: { ...cta, label: e.target.value } })}
              className="h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
              placeholder="CTA label"
            />
            <input
              aria-label="CTA href"
              value={cta.href}
              onChange={(e) => updateNavigation({ ctaButton: { ...cta, href: e.target.value } })}
              className="h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
              placeholder="CTA href"
            />
          </div>
        </section>

        <section className="space-y-2 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-slate-400">
            <Library className="w-3.5 h-3.5" />
            <h4 className="text-[11px] font-bold uppercase tracking-wider">Reusable library</h4>
          </div>
          {library.length === 0 ? (
            <p className="text-slate-500">Select an element and save it as reusable from the inspector.</p>
          ) : (
            library.map(([id, node]) => (
              <button
                key={id}
                type="button"
                onClick={() => insertReusable(id)}
                className="w-full text-left h-8 px-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:border-indigo-500/40"
              >
                {node.name || node.type}
              </button>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
