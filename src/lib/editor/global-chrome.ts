import { GlobalComponentsV3, NavItem, WebsiteDocumentV3, WebsiteNode } from '@/types/v3-document';
import { createDefaultNode } from '@/lib/document/v3-operations';
import { COMPONENT_MANIFEST } from '@/lib/editor/component-manifest';

export const GLOBAL_HEADER_PAGE_ID = '__kdba_header__';
export const GLOBAL_FOOTER_PAGE_ID = '__kdba_footer__';

export function isGlobalPageId(pageId: string): boolean {
  return pageId === GLOBAL_HEADER_PAGE_ID || pageId === GLOBAL_FOOTER_PAGE_ID;
}

export function buildDefaultHeader(siteName = 'Studio'): WebsiteNode {
  return createDefaultNode('navbar', {
    name: 'Site Header',
    props: {
      brandName: siteName,
      variant: 'standard',
      sticky: true,
      useSiteNavigation: true,
      ctaText: 'Get Started',
      ctaHref: '#contact',
    },
    styles: {
      layout: { position: 'sticky', width: '100%', zIndex: 30 },
      spacing: { padding: { top: '16px', bottom: '16px', left: '24px', right: '24px' } },
      background: { color: 'background' },
    },
  });
}

export function buildDefaultFooter(siteName = 'Studio'): WebsiteNode {
  return createDefaultNode('footer', {
    name: 'Site Footer',
    props: {
      copyright: `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`,
      useSiteNavigation: true,
    },
    styles: {
      layout: { width: '100%' },
      background: { color: 'background' },
    },
  });
}

function cloneChromeNode(node: WebsiteNode, id: string): WebsiteNode {
  const cloned = JSON.parse(JSON.stringify(node)) as WebsiteNode;
  cloned.id = id;
  cloned.props = { ...(cloned.props || {}), useSiteNavigation: true };
  return cloned;
}

function firstPageChildOfType(doc: WebsiteDocumentV3, type: WebsiteNode['type']): WebsiteNode | undefined {
  for (const page of doc.pages) {
    const found = page.root?.children?.find((child) => child.type === type);
    if (found) return found;
  }
  return undefined;
}

export function ensureGlobalChrome(doc: WebsiteDocumentV3): WebsiteDocumentV3 {
  const siteName = doc.site?.name || doc.business?.name;
  const headerDisabled = Boolean(doc.global?.headerDisabled);
  const footerDisabled = Boolean(doc.global?.footerDisabled);
  const navbar = firstPageChildOfType(doc, 'navbar');
  const pageFooter = firstPageChildOfType(doc, 'footer');
  const headerNode = headerDisabled
    ? undefined
    : doc.global?.headerNode || (navbar ? cloneChromeNode(navbar, 'global_header') : buildDefaultHeader(siteName));
  const footerNode = footerDisabled
    ? undefined
    : doc.global?.footerNode ||
      (pageFooter ? cloneChromeNode(pageFooter, 'global_footer') : buildDefaultFooter(siteName));
  const reusableNodes = doc.global?.reusableNodes || {};
  if (
    doc.global?.headerNode === headerNode &&
    doc.global?.footerNode === footerNode &&
    doc.global?.reusableNodes &&
    headerDisabled === Boolean(doc.global.headerDisabled) &&
    footerDisabled === Boolean(doc.global.footerDisabled)
  ) {
    return doc;
  }
  return {
    ...doc,
    global: {
      ...(doc.global || {}),
      headerDisabled,
      footerDisabled,
      headerNode,
      footerNode,
      reusableNodes,
    },
  };
}

export function navItemsFromPages(doc: WebsiteDocumentV3): NavItem[] {
  return doc.pages
    .filter((page) => page.enabled !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((page) => ({
      id: `nav_${page.id}`,
      label: page.title,
      href: page.slug || '/',
      pageId: page.id,
      target: '_self' as const,
    }));
}

export function mergeGlobalPatch(
  current: GlobalComponentsV3 | undefined,
  patch: Partial<GlobalComponentsV3>,
): GlobalComponentsV3 {
  return {
    ...(current || {}),
    ...patch,
    reusableNodes: {
      ...((current || {}).reusableNodes || {}),
      ...(patch.reusableNodes || {}),
    },
  };
}

export function reusableLibraryItem(
  name: string,
  node: WebsiteNode,
): WebsiteNode {
  const item = COMPONENT_MANIFEST[node.type];
  return {
    ...node,
    name: name || node.name || item?.name || node.type,
  };
}
