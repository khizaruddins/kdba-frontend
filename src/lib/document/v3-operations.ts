/**
 * KDBA V3 — Pure WebsiteDocument operations.
 *
 * All editor mutations go through this module. The store is a thin wrapper
 * that records history, selection, and persistence. Structural sharing keeps
 * unchanged subtrees referentially stable for renderer memoization.
 */

import {
  WebsiteDocumentV3,
  WebsiteNode,
  NodeType,
  StyleDefinition,
  ResponsiveVisibility,
  DocumentOperation,
  PageDocumentV3,
  ThemeSystemV3,
} from '@/types/v3-document';

export function generateNodeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

export function deepClone<T>(val: T): T {
  return JSON.parse(JSON.stringify(val));
}

export function cloneNodeWithFreshIds(node: WebsiteNode): WebsiteNode {
  const cloned: WebsiteNode = {
    ...deepClone(node),
    id: generateNodeId(node.type),
  };
  if (Array.isArray(cloned.children)) {
    cloned.children = cloned.children.map((child) => cloneNodeWithFreshIds(child));
  }
  return cloned;
}

export function findNode(root: WebsiteNode, id: string): WebsiteNode | null {
  if (root.id === id) return root;
  if (!root.children) return null;
  for (const child of root.children) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

export function findParent(
  root: WebsiteNode,
  id: string,
): { parent: WebsiteNode; index: number } | null {
  if (!root.children) return null;
  const idx = root.children.findIndex((c) => c.id === id);
  if (idx !== -1) return { parent: root, index: idx };
  for (const child of root.children) {
    const found = findParent(child, id);
    if (found) return found;
  }
  return null;
}

export function getAncestry(
  root: WebsiteNode,
  id: string,
  path: WebsiteNode[] = [],
): WebsiteNode[] | null {
  const currentPath = [...path, root];
  if (root.id === id) return currentPath;
  if (!root.children) return null;
  for (const child of root.children) {
    const found = getAncestry(child, id, currentPath);
    if (found) return found;
  }
  return null;
}

export function isDescendant(root: WebsiteNode, ancestorId: string, maybeChildId: string): boolean {
  const ancestor = findNode(root, ancestorId);
  if (!ancestor) return false;
  return Boolean(findNode(ancestor, maybeChildId));
}

export function mergeStyleDefinition(
  base: StyleDefinition = {},
  patch: StyleDefinition = {},
): StyleDefinition {
  return {
    ...base,
    ...patch,
    layout: { ...(base.layout || {}), ...(patch.layout || {}) },
    flex: { ...(base.flex || {}), ...(patch.flex || {}) },
    grid: { ...(base.grid || {}), ...(patch.grid || {}) },
    size: { ...(base.size || {}), ...(patch.size || {}) },
    spacing: {
      ...(base.spacing || {}),
      ...(patch.spacing || {}),
      margin: { ...(base.spacing?.margin || {}), ...(patch.spacing?.margin || {}) },
      padding: { ...(base.spacing?.padding || {}), ...(patch.spacing?.padding || {}) },
    },
    typography: { ...(base.typography || {}), ...(patch.typography || {}) },
    background: { ...(base.background || {}), ...(patch.background || {}) },
    border: {
      ...(base.border || {}),
      ...(patch.border || {}),
      radius: { ...(base.border?.radius || {}), ...(patch.border?.radius || {}) },
    },
    effects: { ...(base.effects || {}), ...(patch.effects || {}) },
    transform: { ...(base.transform || {}), ...(patch.transform || {}) },
  };
}

export function getStylesForViewport(
  node: WebsiteNode,
  viewport: 'desktop' | 'tablet' | 'mobile',
): StyleDefinition {
  const base = node.styles || {};
  if (viewport === 'desktop') return base;
  const tablet = node.responsive?.tablet || {};
  if (viewport === 'tablet') return mergeStyleDefinition(base, tablet);
  return mergeStyleDefinition(mergeStyleDefinition(base, tablet), node.responsive?.mobile || {});
}

function mapNode(
  root: WebsiteNode,
  nodeId: string,
  mapper: (node: WebsiteNode) => WebsiteNode,
): WebsiteNode {
  if (root.id === nodeId) return mapper(root);
  if (!root.children) return root;
  let changed = false;
  const children = root.children.map((child) => {
    const next = mapNode(child, nodeId, mapper);
    if (next !== child) changed = true;
    return next;
  });
  return changed ? { ...root, children } : root;
}

function updateActivePage(
  doc: WebsiteDocumentV3,
  pageId: string,
  updater: (page: PageDocumentV3) => PageDocumentV3,
): WebsiteDocumentV3 {
  let changed = false;
  const pages = doc.pages.map((page) => {
    if (page.id !== pageId) return page;
    changed = true;
    return updater(page);
  });
  return changed ? { ...doc, pages } : doc;
}

function updatePageRoot(
  doc: WebsiteDocumentV3,
  pageId: string,
  updater: (root: WebsiteNode) => WebsiteNode,
): WebsiteDocumentV3 {
  return updateActivePage(doc, pageId, (page) => {
    const nextRoot = updater(page.root);
    return nextRoot === page.root ? page : { ...page, root: nextRoot };
  });
}

export function addNodeToTree(
  root: WebsiteNode,
  parentId: string,
  node: WebsiteNode,
  index?: number,
): WebsiteNode {
  return mapNode(root, parentId, (parent) => {
    const children = [...(parent.children || [])];
    if (typeof index === 'number' && index >= 0 && index <= children.length) {
      children.splice(index, 0, node);
    } else {
      children.push(node);
    }
    return { ...parent, children };
  });
}

export function removeNodeFromTree(root: WebsiteNode, nodeId: string): WebsiteNode {
  if (root.id === nodeId) return root;
  if (!root.children) return root;
  const idx = root.children.findIndex((c) => c.id === nodeId);
  if (idx !== -1) {
    return { ...root, children: root.children.filter((c) => c.id !== nodeId) };
  }
  let changed = false;
  const children = root.children.map((child) => {
    const next = removeNodeFromTree(child, nodeId);
    if (next !== child) changed = true;
    return next;
  });
  return changed ? { ...root, children } : root;
}

export function duplicateNodeInTree(
  root: WebsiteNode,
  nodeId: string,
): { root: WebsiteNode; duplicated: WebsiteNode | null } {
  const parentInfo = findParent(root, nodeId);
  if (!parentInfo || !parentInfo.parent.children) return { root, duplicated: null };
  const source = parentInfo.parent.children[parentInfo.index];
  const duplicated = cloneNodeWithFreshIds(source);
  duplicated.name = `${source.name || source.type} (Copy)`;
  return {
    root: addNodeToTree(root, parentInfo.parent.id, duplicated, parentInfo.index + 1),
    duplicated,
  };
}

export function moveNodeInTree(
  root: WebsiteNode,
  nodeId: string,
  targetParentId: string,
  targetIndex?: number,
): WebsiteNode {
  if (nodeId === targetParentId) return root;
  const node = findNode(root, nodeId);
  if (!node) return root;
  if (findNode(node, targetParentId)) return root;

  const sourceParent = findParent(root, nodeId);
  if (!sourceParent) return root;

  let insertIndex = targetIndex;
  if (
    sourceParent.parent.id === targetParentId &&
    typeof targetIndex === 'number' &&
    targetIndex > sourceParent.index
  ) {
    insertIndex = targetIndex - 1;
  }

  const without = removeNodeFromTree(root, nodeId);
  return addNodeToTree(without, targetParentId, node, insertIndex);
}

export function reorderChildrenInTree(
  root: WebsiteNode,
  parentId: string,
  childIds: string[],
): WebsiteNode {
  return mapNode(root, parentId, (parent) => {
    if (!parent.children) return parent;
    const childMap = new Map(parent.children.map((c) => [c.id, c]));
    const next = childIds.map((id) => childMap.get(id)).filter(Boolean) as WebsiteNode[];
    const leftover = parent.children.filter((c) => !childIds.includes(c.id));
    return { ...parent, children: [...next, ...leftover] };
  });
}

export function createDefaultNode(
  type: NodeType,
  partial?: Partial<WebsiteNode>,
): WebsiteNode {
  return {
    id: partial?.id || generateNodeId(type),
    type,
    name: partial?.name || type.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    children: partial?.children || [],
    props: partial?.props || {},
    styles: partial?.styles || {},
    responsive: partial?.responsive || {},
    visibility: partial?.visibility || { desktop: true, tablet: true, mobile: true },
  };
}

export function applyDocumentOperation(
  doc: WebsiteDocumentV3,
  op: DocumentOperation,
): WebsiteDocumentV3 {
  switch (op.type) {
    case 'addNode':
      return updatePageRoot(doc, op.pageId, (root) =>
        addNodeToTree(root, op.parentId, op.node, op.index),
      );
    case 'removeNode':
      return updatePageRoot(doc, op.pageId, (root) => removeNodeFromTree(root, op.nodeId));
    case 'duplicateNode': {
      return updatePageRoot(doc, op.pageId, (root) => {
        const result = duplicateNodeInTree(root, op.nodeId);
        if (!result.duplicated) return root;
        if (op.targetParentId) {
          const without = removeNodeFromTree(result.root, result.duplicated.id);
          return addNodeToTree(without, op.targetParentId, result.duplicated, op.index);
        }
        return result.root;
      });
    }
    case 'moveNode':
      return updatePageRoot(doc, op.pageId, (root) =>
        moveNodeInTree(root, op.nodeId, op.targetParentId, op.targetIndex),
      );
    case 'updateNode':
      return updatePageRoot(doc, op.pageId, (root) =>
        mapNode(root, op.nodeId, (node) => {
          const patch = { ...op.patch };
          delete patch.id;
          delete patch.children;
          delete patch.type;
          return { ...node, ...patch };
        }),
      );
    case 'updateProps':
      return updatePageRoot(doc, op.pageId, (root) =>
        mapNode(root, op.nodeId, (node) => ({
          ...node,
          props: { ...(node.props || {}), ...op.props },
        })),
      );
    case 'updateStyles':
      return updatePageRoot(doc, op.pageId, (root) =>
        mapNode(root, op.nodeId, (node) => ({
          ...node,
          styles: mergeStyleDefinition(node.styles, op.styles),
        })),
      );
    case 'updateResponsive':
      return updatePageRoot(doc, op.pageId, (root) =>
        mapNode(root, op.nodeId, (node) => ({
          ...node,
          responsive: {
            ...node.responsive,
            tablet:
              op.responsive.tablet === undefined
                ? node.responsive?.tablet
                : mergeStyleDefinition(node.responsive?.tablet, op.responsive.tablet),
            mobile:
              op.responsive.mobile === undefined
                ? node.responsive?.mobile
                : mergeStyleDefinition(node.responsive?.mobile, op.responsive.mobile),
            custom: { ...(node.responsive?.custom || {}), ...(op.responsive.custom || {}) },
          },
        })),
      );
    case 'setVisibility':
      return updatePageRoot(doc, op.pageId, (root) =>
        mapNode(root, op.nodeId, (node) => ({
          ...node,
          visibility: { ...(node.visibility || {}), ...op.visibility },
        })),
      );
    case 'changeParent':
      return updatePageRoot(doc, op.pageId, (root) =>
        moveNodeInTree(root, op.nodeId, op.newParentId, op.index),
      );
    case 'reorderChildren':
      return updatePageRoot(doc, op.pageId, (root) =>
        reorderChildrenInTree(root, op.parentId, op.childIds),
      );
    case 'addPage':
      return { ...doc, pages: [...doc.pages, op.page] };
    case 'updatePage':
      return updateActivePage(doc, op.pageId, (page) => ({ ...page, ...op.patch }));
    case 'removePage':
      if (doc.pages.length <= 1) return doc;
      return { ...doc, pages: doc.pages.filter((p) => p.id !== op.pageId) };
    case 'reorderPages': {
      const map = new Map(doc.pages.map((p) => [p.id, p]));
      const next = op.pageIds.map((id) => map.get(id)).filter(Boolean) as PageDocumentV3[];
      const leftover = doc.pages.filter((p) => !op.pageIds.includes(p.id));
      return { ...doc, pages: [...next, ...leftover] };
    }
    case 'updateTheme': {
      const theme: ThemeSystemV3 = {
        ...doc.theme,
        ...op.theme,
        colors: { ...(doc.theme.colors || {}), ...(op.theme.colors || {}) },
        typography: { ...(doc.theme.typography || {}), ...(op.theme.typography || {}) },
        breakpoints: { ...(doc.theme.breakpoints || {}), ...(op.theme.breakpoints || {}) },
        tokens: { ...(doc.theme.tokens || {}), ...(op.theme.tokens || {}) },
      };
      return { ...doc, theme };
    }
    case 'updateBusiness':
      return { ...doc, business: { ...doc.business, ...op.business } };
    case 'updateNavigation':
      return { ...doc, navigation: { ...doc.navigation, ...op.navigation } };
    case 'updateSeo':
      return { ...doc, seo: { ...doc.seo, ...op.seo } };
    case 'updateSettings':
      return { ...doc, settings: { ...doc.settings, ...op.settings } };
    default:
      return doc;
  }
}

export function clearResponsiveViewport(
  doc: WebsiteDocumentV3,
  pageId: string,
  nodeId: string,
  viewport: 'tablet' | 'mobile',
): WebsiteDocumentV3 {
  return updatePageRoot(doc, pageId, (root) =>
    mapNode(root, nodeId, (node) => ({
      ...node,
      responsive: {
        ...node.responsive,
        [viewport]: undefined,
      },
    })),
  );
}

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export function applyStylesForViewport(
  doc: WebsiteDocumentV3,
  pageId: string,
  nodeId: string,
  viewport: ViewportMode,
  styles: Partial<StyleDefinition>,
): WebsiteDocumentV3 {
  if (viewport === 'desktop') {
    return applyDocumentOperation(doc, { type: 'updateStyles', pageId, nodeId, styles });
  }
  return applyDocumentOperation(doc, {
    type: 'updateResponsive',
    pageId,
    nodeId,
    responsive: { [viewport]: styles },
  });
}

export function setNodeVisibility(
  visibility: ResponsiveVisibility | undefined,
  patch: Partial<ResponsiveVisibility>,
): ResponsiveVisibility {
  return { ...(visibility || {}), ...patch };
}

export type StyleGroupKey = keyof StyleDefinition;

export function isStyleGroupOverridden(
  node: WebsiteNode,
  viewport: ViewportMode,
  groups: StyleGroupKey[],
): boolean {
  if (viewport === 'desktop') return false;
  const override = node.responsive?.[viewport];
  if (!override) return false;
  return groups.some((group) => styleValuePresent(override[group]));
}

function styleValuePresent(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value !== 'object') return true;
  return Object.keys(value as object).some((key) => styleValuePresent((value as Record<string, unknown>)[key]));
}

export function hasViewportOverride(node: WebsiteNode, viewport: ViewportMode): boolean {
  return isStyleGroupOverridden(node, viewport, [
    'layout',
    'flex',
    'grid',
    'size',
    'spacing',
    'typography',
    'background',
    'border',
    'effects',
    'transform',
  ]);
}

export function clearResponsiveStyleGroup(
  doc: WebsiteDocumentV3,
  pageId: string,
  nodeId: string,
  viewport: 'tablet' | 'mobile',
  groups: StyleGroupKey[],
): WebsiteDocumentV3 {
  return updatePageRoot(doc, pageId, (root) =>
    mapNode(root, nodeId, (node) => {
      const current = { ...(node.responsive?.[viewport] || {}) } as StyleDefinition;
      for (const group of groups) {
        delete current[group];
      }
      const remaining = Object.entries(current).filter(([, value]) => {
        if (value === undefined || value === null) return false;
        if (typeof value !== 'object') return true;
        return Object.keys(value as object).length > 0;
      });
      return {
        ...node,
        responsive: {
          ...node.responsive,
          [viewport]: remaining.length ? (Object.fromEntries(remaining) as StyleDefinition) : undefined,
        },
      };
    }),
  );
}
