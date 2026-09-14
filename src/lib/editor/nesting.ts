import { NodeType, WebsiteNode } from '@/types/v3-document';
import { COMPONENT_MANIFEST } from '@/lib/editor/component-manifest';
import { findNode, findParent } from '@/lib/document/v3-operations';

const CONTAINER_TYPES: NodeType[] = [
  'page-root',
  'section',
  'container',
  'row',
  'column',
  'grid',
  'stack',
];

export function isContainerType(type: NodeType): boolean {
  return CONTAINER_TYPES.includes(type);
}

export function canAcceptChild(parentType: NodeType, childType: NodeType): boolean {
  const child = COMPONENT_MANIFEST[childType];
  if (!child) return false;
  if (!child.allowedParents || child.allowedParents.length === 0) return false;
  return child.allowedParents.includes(parentType);
}

export function isLeafType(type: NodeType): boolean {
  return Boolean(COMPONENT_MANIFEST[type]?.isLeaf);
}

export interface InsertTarget {
  parentId: string;
  index?: number;
}

/**
 * Resolve the nearest valid parent for inserting `childType`.
 * Prefers the selected node, then its ancestors, then the first valid container.
 */
export function resolveInsertTarget(
  root: WebsiteNode,
  preferredId: string | null,
  childType: NodeType,
): InsertTarget | null {
  const startId = preferredId || root.id;
  const start = findNode(root, startId) || root;

  if (canAcceptChild(start.type, childType)) {
    return { parentId: start.id };
  }

  const parentInfo = findParent(root, start.id);
  if (parentInfo && canAcceptChild(parentInfo.parent.type, childType)) {
    return { parentId: parentInfo.parent.id, index: parentInfo.index + 1 };
  }

  let cursor = parentInfo?.parent ?? null;
  while (cursor) {
    if (canAcceptChild(cursor.type, childType)) {
      return { parentId: cursor.id };
    }
    const next = findParent(root, cursor.id);
    cursor = next?.parent ?? null;
  }

  return findFirstAcceptingParent(root, childType);
}

function findFirstAcceptingParent(node: WebsiteNode, childType: NodeType): InsertTarget | null {
  if (canAcceptChild(node.type, childType)) return { parentId: node.id };
  if (!node.children) return null;
  for (const child of node.children) {
    const found = findFirstAcceptingParent(child, childType);
    if (found) return found;
  }
  return null;
}

export type DropPosition = 'before' | 'after' | 'inside';

export interface ResolvedDrop {
  parentId: string;
  index: number;
  position: DropPosition;
  highlightId: string;
  valid: boolean;
}

export function resolveDrop(
  root: WebsiteNode,
  targetId: string,
  childType: NodeType,
  positionHint: DropPosition,
): ResolvedDrop | null {
  const target = findNode(root, targetId);
  if (!target) return null;

  if (positionHint === 'inside' || (isContainerType(target.type) && !isLeafType(target.type))) {
    if (canAcceptChild(target.type, childType)) {
      return {
        parentId: target.id,
        index: target.children?.length ?? 0,
        position: 'inside',
        highlightId: target.id,
        valid: true,
      };
    }
  }

  const parentInfo = findParent(root, targetId);
  if (parentInfo && canAcceptChild(parentInfo.parent.type, childType)) {
    const index = positionHint === 'before' ? parentInfo.index : parentInfo.index + 1;
    return {
      parentId: parentInfo.parent.id,
      index,
      position: positionHint === 'before' ? 'before' : 'after',
      highlightId: target.id,
      valid: true,
    };
  }

  let ancestor = parentInfo?.parent ?? null;
  while (ancestor) {
    if (canAcceptChild(ancestor.type, childType)) {
      return {
        parentId: ancestor.id,
        index: ancestor.children?.length ?? 0,
        position: 'inside',
        highlightId: ancestor.id,
        valid: true,
      };
    }
    const next = findParent(root, ancestor.id);
    ancestor = next?.parent ?? null;
  }

  return {
    parentId: target.id,
    index: 0,
    position: 'inside',
    highlightId: target.id,
    valid: false,
  };
}

export const TEXT_EDITABLE_TYPES: NodeType[] = [
  'heading',
  'paragraph',
  'text',
  'button',
  'badge',
  'quote',
];
