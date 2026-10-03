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

export function isNavbarNode(node: WebsiteNode): boolean {
  if (!node) return false;
  if (node.type === 'navbar') return true;
  const name = String(node.name || '').toLowerCase();
  if (
    name === 'navbar' ||
    name === 'site header' ||
    name === 'navbar section' ||
    name === 'header' ||
    name.startsWith('navbar') ||
    name.endsWith('navbar')
  ) {
    return true;
  }
  const variant = String(node.props?.variant || '').toLowerCase();
  if (variant === 'navbar' || variant === 'transparent' || variant === 'centered') {
    if (node.props?.brandName !== undefined || node.props?.links !== undefined) return true;
  }
  if (
    node.props?.brandName !== undefined &&
    (node.props?.links !== undefined || node.props?.ctaText !== undefined || node.props?.useSiteNavigation !== undefined || node.props?.ctaUrl !== undefined)
  ) {
    return true;
  }
  return false;
}

export function isFooterNode(node: WebsiteNode): boolean {
  if (!node) return false;
  if (node.type === 'footer') return true;
  const name = String(node.name || '').toLowerCase();
  if (
    name === 'footer' ||
    name === 'site footer' ||
    name === 'footer section' ||
    name.startsWith('footer') ||
    name.endsWith('footer')
  ) {
    return true;
  }
  const variant = String(node.props?.variant || '').toLowerCase();
  if (variant === 'footer' || variant === 'multi-column-detailed' || variant === 'columns') {
    if (node.props?.copyright !== undefined || node.props?.links !== undefined) return true;
  }
  if (node.props?.copyright !== undefined) return true;
  return false;
}

function cloneChromeNode(node: WebsiteNode, id: string): WebsiteNode {
  const cloned = JSON.parse(JSON.stringify(node)) as WebsiteNode;
  cloned.id = id;
  if (id === 'global_header') {
    cloned.type = 'navbar';
    cloned.name = cloned.name || 'Site Header';
  } else if (id === 'global_footer') {
    cloned.type = 'footer';
    cloned.name = cloned.name || 'Site Footer';
  }
  cloned.props = { ...(cloned.props || {}), useSiteNavigation: true };
  return cloned;
}

function firstPageChildMatching(doc: WebsiteDocumentV3, predicate: (node: WebsiteNode) => boolean): WebsiteNode | undefined {
  for (const page of doc.pages) {
    const found = page.root?.children?.find(predicate);
    if (found) return found;
  }
  return undefined;
}

export function ensureGlobalChrome(doc: WebsiteDocumentV3): WebsiteDocumentV3 {
  const siteName = doc.site?.name || doc.business?.name;
  const headerDisabled = Boolean(doc.global?.headerDisabled);
  const footerDisabled = Boolean(doc.global?.footerDisabled);

  const pageNavbar = firstPageChildMatching(doc, isNavbarNode);
  const pageFooter = firstPageChildMatching(doc, isFooterNode);

  let headerNode = headerDisabled ? undefined : doc.global?.headerNode;
  if (!headerDisabled) {
    if (!headerNode) {
      headerNode = pageNavbar ? cloneChromeNode(pageNavbar, 'global_header') : buildDefaultHeader(siteName);
    } else if (
      pageNavbar &&
      headerNode.id === 'global_header' &&
      (!headerNode.props?.brandName || headerNode.props.brandName === 'Studio' || headerNode.props.brandName === siteName)
    ) {
      if (pageNavbar.props?.brandName && pageNavbar.props.brandName !== headerNode.props?.brandName) {
        headerNode = cloneChromeNode(pageNavbar, 'global_header');
      }
    }
  }

  let footerNode = footerDisabled ? undefined : doc.global?.footerNode;
  if (!footerDisabled) {
    if (!footerNode) {
      footerNode = pageFooter ? cloneChromeNode(pageFooter, 'global_footer') : buildDefaultFooter(siteName);
    } else if (
      pageFooter &&
      footerNode.id === 'global_footer' &&
      pageFooter.props?.copyright &&
      pageFooter.props.copyright !== footerNode.props?.copyright
    ) {
      footerNode = cloneChromeNode(pageFooter, 'global_footer');
    }
  }

  // Strip page-level navbars & footers from page.root.children so there are NEVER duplicate navbars or footers
  let pagesChanged = false;
  const cleanedPages = doc.pages.map((page) => {
    if (!page.root?.children) return page;
    const originalCount = page.root.children.length;
    const filteredChildren = page.root.children.filter((child) => {
      if (headerNode && isNavbarNode(child)) return false;
      if (footerNode && isFooterNode(child)) return false;
      return true;
    });
    if (filteredChildren.length !== originalCount) {
      pagesChanged = true;
      return {
        ...page,
        root: {
          ...page.root,
          children: filteredChildren,
        },
      };
    }
    return page;
  });

  const reusableNodes = doc.global?.reusableNodes || {};
  if (
    !pagesChanged &&
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
    pages: cleanedPages,
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
