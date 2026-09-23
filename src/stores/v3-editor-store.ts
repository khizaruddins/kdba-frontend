/**
 * KDBA V3 — Visual Builder State Store (Zustand)
 *
 * Persistent document state is separate from transient UI state.
 * All document writes go through applyDocumentOperation().
 */

import { create } from 'zustand';
import {
  WebsiteDocumentV3,
  WebsiteNode,
  NodeType,
  StyleDefinition,
  ResponsiveStyleDefinition,
  ResponsiveVisibility,
  ThemeSystemV3,
  PageDocumentV3,
  DocumentOperation,
  GlobalComponentsV3,
  NavigationConfig,
  ComponentStateKey,
  AnimationDefinition,
} from '@/types/v3-document';
import { websitesApi } from '@/lib/api/websites';
import {
  applyDocumentOperation,
  applyStylesForViewport,
  clearResponsiveStyleGroup,
  clearResponsiveStylePath,
  clearResponsiveViewport,
  cloneNodeWithFreshIds,
  createDefaultNode,
  deepClone,
  duplicatePageDocument,
  findNodeLocation,
  findParent as findParentInTree,
  generateNodeId,
  getAncestry,
  getStylesForViewport,
  sanitizePastedNode,
  syncReusableInstances,
} from '@/lib/document/v3-operations';
import { canAcceptChild, resolveInsertTarget } from '@/lib/editor/nesting';
import { COMPONENT_MANIFEST } from '@/lib/editor/component-manifest';
import { toEditorDocument } from '@/lib/document/v3-wire';
import {
  ensureGlobalChrome,
  navItemsFromPages,
} from '@/lib/editor/global-chrome';
import { INSTANCE_OF_PROP, REUSABLE_ID_PROP } from '@/lib/editor/rich-text';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'unsaved' | 'error';
export type EditorNavTab = 'add' | 'pages' | 'layers' | 'assets' | 'theme' | 'site' | null;

const HISTORY_COALESCE_MS = 700;

function searchNode(root: WebsiteNode, id: string): WebsiteNode | null {
  if (root.id === id) return root;
  if (!root.children) return null;
  for (const child of root.children) {
    const found = searchNode(child, id);
    if (found) return found;
  }
  return null;
}

const recursivelyCloneWithFreshIds = cloneNodeWithFreshIds;

export interface V3EditorState {
  websiteId: string | null;
  document: WebsiteDocumentV3 | null;
  revision: number;
  documentHash: string;
  isDirty: boolean;
  saveStatus: SaveStatus;
  lastSavedAt: Date | null;
  errorMessage: string | null;
  hasConflict: boolean;

  activePageId: string;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  activeNavTab: EditorNavTab;
  inspectorFocusKey: string | null;
  previewMode: boolean;

  viewport: ViewportMode;
  zoom: number;
  isInlineEditing: boolean;
  inlineEditingNodeId: string | null;

  // Precision UX States
  activeStateMode: ComponentStateKey | 'default';
  activeAnimationPreviewId: string | null;
  quickMode: boolean;
  propertySearchQuery: string;

  // Drag & Drop State
  isDragging: boolean;
  draggedNodeType: NodeType | null;
  draggedNodeId: string | null;
  dropTargetId: string | null;
  dropPosition: 'before' | 'after' | 'inside' | null;

  clipboardNode: WebsiteNode | null;

  undoStack: WebsiteDocumentV3[];
  redoStack: WebsiteDocumentV3[];

  setDocumentData: (websiteId: string, doc: WebsiteDocumentV3, revision?: number, hash?: string) => void;
  setActivePageId: (pageId: string) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  setHoveredNodeId: (nodeId: string | null) => void;
  setActiveNavTab: (tab: EditorNavTab) => void;
  focusInspectorSection: (key: string | null) => void;
  setViewport: (viewport: ViewportMode) => void;
  setZoom: (zoom: number) => void;
  setPreviewMode: (preview: boolean) => void;
  setIsInlineEditing: (editing: boolean) => void;
  setInlineEditingNodeId: (id: string | null) => void;
  setQuickMode: (quick: boolean) => void;
  setPropertySearchQuery: (query: string) => void;
  setActiveStateMode: (mode: ComponentStateKey | 'default') => void;
  setAnimationPreview: (nodeId: string | null) => void;
  setDragState: (isDragging: boolean, type?: NodeType | null, id?: string | null) => void;
  setDropTarget: (targetId: string | null, position?: 'before' | 'after' | 'inside' | null) => void;

  // Clipboard & Node Precision
  copyNode: (nodeId: string) => void;
  pasteNode: (targetParentId?: string, targetIndex?: number) => WebsiteNode | null;
  setLock: (nodeId: string, locked: boolean) => void;
  setNodeLabel: (nodeId: string, label: string) => void;

  // Tree Queries
  getActivePage: () => PageDocumentV3 | null;
  getSelectedNode: () => WebsiteNode | null;
  getNodePath: (nodeId: string) => WebsiteNode[];
  findNode: (nodeId: string) => WebsiteNode | null;
  findParent: (nodeId: string) => { parent: WebsiteNode; index: number } | null;
  getInspectorStyles: (nodeId: string) => StyleDefinition;

  executeOperation: (op: DocumentOperation, options?: { coalesceKey?: string; selectId?: string | null }) => void;

  addNode: (parentId: string, node: Partial<WebsiteNode> & { type: NodeType }, index?: number) => WebsiteNode | null;
  insertNodeType: (type: NodeType, preferredParentId?: string | null) => WebsiteNode | null;
  removeNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => WebsiteNode | null;
  moveNode: (nodeId: string, targetParentId: string, targetIndex?: number) => void;
  updateNode: (nodeId: string, patch: Partial<WebsiteNode>) => void;
  updateProps: (nodeId: string, propsPatch: Record<string, unknown>) => void;
  updateStyles: (nodeId: string, stylesPatch: Partial<StyleDefinition>) => void;
  updateResponsive: (nodeId: string, responsivePatch: Partial<ResponsiveStyleDefinition>) => void;
  resetViewportStyles: (nodeId: string) => void;
  resetViewportStyleGroup: (nodeId: string, groups: Array<keyof StyleDefinition>) => void;
  resetViewportStylePath: (nodeId: string, path: string[]) => void;
  updateState: (nodeId: string, stateKey: ComponentStateKey, stylesPatch: Partial<StyleDefinition>) => void;
  updateAnimation: (nodeId: string, animationPatch: AnimationDefinition) => void;
  resetResponsive: (nodeId: string, breakpoint: 'tablet' | 'mobile', category?: string, property?: string) => void;
  changeLayout: (sectionId: string, newLayout: string) => void;
  setVisibility: (nodeId: string, visibilityPatch: Partial<ResponsiveVisibility>) => void;
  setNodeLocked: (nodeId: string, locked: boolean) => void;
  reorderChildren: (parentId: string, childIds: string[]) => void;
  updateTheme: (themePatch: Partial<ThemeSystemV3>) => void;
  addPage: (title: string, slug: string) => PageDocumentV3;
  updatePage: (pageId: string, patch: Partial<PageDocumentV3>) => void;
  removePage: (pageId: string) => void;
  duplicatePage: (pageId: string) => PageDocumentV3 | null;
  setHomePage: (pageId: string) => void;
  reorderPages: (pageIds: string[]) => void;
  insertSectionPreset: (presetNode: WebsiteNode, afterNodeId?: string | null) => WebsiteNode | null;
  setSectionVariant: (sectionId: string, newVariant: string) => void;
  replaceSection: (sectionId: string, presetOrVariant: WebsiteNode | string) => WebsiteNode | null;
  updateNavigation: (navigation: Partial<NavigationConfig>) => void;
  updateGlobal: (global: Partial<GlobalComponentsV3>) => void;
  saveReusableFromSelection: (name?: string) => string | null;
  insertReusable: (libraryId: string) => WebsiteNode | null;
  syncReusableFromSelection: () => void;

  copySelectedNode: () => void;
  pasteClipboard: () => WebsiteNode | null;

  undo: () => void;
  redo: () => void;

  saveDocument: () => Promise<boolean>;
  publishDocument: () => Promise<{ success: boolean; versionId?: string }>;
  reloadFromServer: () => Promise<boolean>;
}

let lastCoalesceKey: string | null = null;
let lastCoalesceAt = 0;

export const useV3EditorStore = create<V3EditorState>((set, get) => ({
  websiteId: null,
  document: null,
  revision: 1,
  documentHash: '',
  isDirty: false,
  saveStatus: 'idle',
  lastSavedAt: null,
  errorMessage: null,
  hasConflict: false,

  activePageId: '',
  selectedNodeId: null,
  hoveredNodeId: null,
  activeNavTab: 'add',
  inspectorFocusKey: null,
  previewMode: false,

  viewport: 'desktop',
  zoom: 100,
  isInlineEditing: false,
  inlineEditingNodeId: null,

  isDragging: false,
  draggedNodeType: null,
  draggedNodeId: null,
  dropTargetId: null,
  dropPosition: null,

  clipboardNode: null,
  activeStateMode: 'default',
  activeAnimationPreviewId: null,
  quickMode: true,
  propertySearchQuery: '',

  undoStack: [],
  redoStack: [],

  setDocumentData: (websiteId, doc, revision = 1, hash = '') => {
    let normalized = ensureGlobalChrome(toEditorDocument(doc));
    if (!normalized.navigation?.header?.length) {
      normalized = {
        ...normalized,
        navigation: {
          ...(normalized.navigation || { header: [], footer: [] }),
          header: navItemsFromPages(normalized),
          footer: normalized.navigation?.footer || [],
        },
      };
    }
    const home = normalized.pages.find((page) => page.type === 'home' || page.slug === '/') || normalized.pages[0];
    lastCoalesceKey = null;
    set({
      websiteId,
      document: deepClone(normalized),
      revision,
      documentHash: hash,
      activePageId: home?.id || '',
      selectedNodeId: null,
      inlineEditingNodeId: null,
      hoveredNodeId: null,
      isDirty: false,
      saveStatus: 'saved',
      errorMessage: null,
      hasConflict: false,
      undoStack: [],
      redoStack: [],
    });
  },

  setActivePageId: (activePageId) => set({ activePageId, selectedNodeId: null, inlineEditingNodeId: null }),
  setSelectedNodeId: (selectedNodeId) =>
    set((s) => ({
      selectedNodeId,
      inlineEditingNodeId: s.inlineEditingNodeId === selectedNodeId ? s.inlineEditingNodeId : null,
    })),
  setHoveredNodeId: (hoveredNodeId) => set({ hoveredNodeId }),
  setActiveNavTab: (activeNavTab) => set({ activeNavTab }),
  focusInspectorSection: (inspectorFocusKey) => set({ inspectorFocusKey }),
  setViewport: (viewport) => set({ viewport }),
  setZoom: (zoom) => set({ zoom }),
  setPreviewMode: (previewMode) =>
    set({ previewMode, selectedNodeId: null, inlineEditingNodeId: null, hoveredNodeId: null }),
  setIsInlineEditing: (isInlineEditing) => set({ isInlineEditing }),
  setInlineEditingNodeId: (inlineEditingNodeId) =>
    set({ inlineEditingNodeId, isInlineEditing: Boolean(inlineEditingNodeId) }),
  setQuickMode: (quickMode) => set({ quickMode }),
  setPropertySearchQuery: (propertySearchQuery) => set({ propertySearchQuery }),
  setActiveStateMode: (activeStateMode) => set({ activeStateMode }),
  setAnimationPreview: (activeAnimationPreviewId) => set({ activeAnimationPreviewId }),

  setDragState: (isDragging, draggedNodeType = null, draggedNodeId = null) => {
    set({
      isDragging,
      draggedNodeType,
      draggedNodeId,
      ...(isDragging ? {} : { dropTargetId: null, dropPosition: null }),
    });
  },

  setDropTarget: (dropTargetId, dropPosition = null) => set({ dropTargetId, dropPosition }),

  getActivePage: () => {
    const { document, activePageId } = get();
    if (!document) return null;
    return document.pages.find((p) => p.id === activePageId) || document.pages[0] || null;
  },

  getSelectedNode: () => {
    const { selectedNodeId } = get();
    if (!selectedNodeId) return null;
    return get().findNode(selectedNodeId);
  },

  findNode: (nodeId) => {
    const { document } = get();
    if (!document) return null;
    return findNodeLocation(document, nodeId)?.node || null;
  },

  findParent: (nodeId) => {
    const { document } = get();
    if (!document) return null;
    const loc = findNodeLocation(document, nodeId);
    if (!loc) return null;
    return findParentInTree(loc.root, nodeId);
  },

  getNodePath: (nodeId) => {
    const { document } = get();
    if (!document) return [];
    const loc = findNodeLocation(document, nodeId);
    if (!loc) return [];
    return getAncestry(loc.root, nodeId) || [];
  },

  getInspectorStyles: (nodeId) => {
    const node = get().findNode(nodeId);
    if (!node) return {};
    return getStylesForViewport(node, get().viewport);
  },

  executeOperation: (op, options) => {
    const { document, undoStack } = get();
    if (!document) return;

    const now = Date.now();
    const coalesceKey = options?.coalesceKey;
    const canCoalesce =
      Boolean(coalesceKey) &&
      lastCoalesceKey === coalesceKey &&
      now - lastCoalesceAt < HISTORY_COALESCE_MS &&
      undoStack.length > 0;

    const nextDoc = applyDocumentOperation(document, op);
    if (nextDoc === document) return;

    lastCoalesceKey = coalesceKey || null;
    lastCoalesceAt = now;

    set({
      document: nextDoc,
      isDirty: true,
      saveStatus: 'unsaved',
      errorMessage: null,
      ...(typeof options?.selectId !== 'undefined' ? { selectedNodeId: options.selectId } : {}),
      ...(canCoalesce
        ? {}
        : {
            undoStack: [document, ...undoStack.slice(0, 49)],
            redoStack: [],
          }),
    });
  },

  addNode: (parentId, nodeInput, index) => {
    const { document } = get();
    if (!document) return null;
    const loc = findNodeLocation(document, parentId);
    if (!loc) return null;
    if (!canAcceptChild(loc.node.type, nodeInput.type)) return null;

    const newNode = createDefaultNode(nodeInput.type, {
      id: nodeInput.id,
      name: nodeInput.name,
      children: nodeInput.children,
      props: nodeInput.props,
      styles: nodeInput.styles,
      responsive: nodeInput.responsive,
      visibility: nodeInput.visibility,
    });

    get().executeOperation(
      { type: 'addNode', pageId: loc.pageId, parentId, node: newNode, index },
      { selectId: newNode.id },
    );
    return newNode;
  },

  insertNodeType: (type, preferredParentId) => {
    const { document } = get();
    if (!document) return null;
    const manifest = COMPONENT_MANIFEST[type];
    if (!manifest) return null;

    const preferred = preferredParentId || get().selectedNodeId;
    const preferredLoc = preferred ? findNodeLocation(document, preferred) : null;
    const page = get().getActivePage();
    const root = preferredLoc?.root || page?.root;
    if (!root) return null;

    let target = resolveInsertTarget(root, preferred, type);

    if (!target && type !== 'section' && type !== 'navbar' && type !== 'footer' && page?.root) {
      const sectionManifest = COMPONENT_MANIFEST.section;
      const containerManifest = COMPONENT_MANIFEST.container;
      const section = get().addNode(page.root.id, {
        type: 'section',
        name: sectionManifest.name,
        props: sectionManifest.defaultProps,
        styles: sectionManifest.defaultStyles,
      });
      if (section) {
        const box = get().addNode(section.id, {
          type: 'container',
          name: containerManifest.name,
          props: containerManifest.defaultProps,
          styles: containerManifest.defaultStyles,
        });
        if (box) {
          target = { parentId: box.id };
        }
      }
    }

    if (!target) return null;

    return get().addNode(
      target.parentId,
      {
        type,
        name: manifest.name,
        props: manifest.defaultProps,
        styles: manifest.defaultStyles,
      },
      target.index,
    );
  },

  removeNode: (nodeId) => {
    const { document } = get();
    if (!document) return;
    const loc = findNodeLocation(document, nodeId);
    if (!loc || loc.root.id === nodeId || loc.node.locked) return;
    const parentInfo = findParentInTree(loc.root, nodeId);
    get().executeOperation(
      { type: 'removeNode', pageId: loc.pageId, nodeId },
      { selectId: parentInfo?.parent.id ?? null },
    );
  },

  duplicateNode: (nodeId) => {
    const { document } = get();
    if (!document) return null;
    const loc = findNodeLocation(document, nodeId);
    if (!loc || loc.root.id === nodeId) return null;
    const parentInfo = findParentInTree(loc.root, nodeId);
    if (!parentInfo) return null;

    const duplicated = cloneNodeWithFreshIds(loc.node);
    duplicated.name = `${loc.node.name || loc.node.type} (Copy)`;

    get().executeOperation(
      {
        type: 'addNode',
        pageId: loc.pageId,
        parentId: parentInfo.parent.id,
        node: duplicated,
        index: parentInfo.index + 1,
      },
      { selectId: duplicated.id },
    );
    return duplicated;
  },

  moveNode: (nodeId, targetParentId, targetIndex) => {
    const { document } = get();
    if (!document) return;
    const source = findNodeLocation(document, nodeId);
    const target = findNodeLocation(document, targetParentId);
    if (!source || !target || source.pageId !== target.pageId || source.node.locked) return;
    if (!canAcceptChild(target.node.type, source.node.type)) return;

    get().executeOperation(
      {
        type: 'moveNode',
        pageId: source.pageId,
        nodeId,
        targetParentId,
        targetIndex: typeof targetIndex === 'number' ? targetIndex : target.node.children?.length || 0,
      },
      { selectId: nodeId },
    );
  },

  updateNode: (nodeId, patch) => {
    const { document } = get();
    if (!document) return;
    const loc = findNodeLocation(document, nodeId);
    if (!loc) return;
    get().executeOperation(
      { type: 'updateNode', pageId: loc.pageId, nodeId, patch },
      { coalesceKey: `updateNode:${nodeId}` },
    );
  },

  updateProps: (nodeId, propsPatch) => {
    const { document } = get();
    if (!document) return;
    const loc = findNodeLocation(document, nodeId);
    if (!loc) return;
    get().executeOperation(
      { type: 'updateProps', pageId: loc.pageId, nodeId, props: propsPatch },
      { coalesceKey: `updateProps:${nodeId}` },
    );
  },

  updateStyles: (nodeId, stylesPatch) => {
    const { document, viewport } = get();
    if (!document) return;
    const loc = findNodeLocation(document, nodeId);
    if (!loc) return;
    const { undoStack } = get();
    const now = Date.now();
    const coalesceKey = `updateStyles:${nodeId}:${viewport}`;
    const canCoalesce =
      lastCoalesceKey === coalesceKey && now - lastCoalesceAt < HISTORY_COALESCE_MS && undoStack.length > 0;

    const nextDoc = applyStylesForViewport(document, loc.pageId, nodeId, viewport, stylesPatch);
    if (nextDoc === document) return;

    lastCoalesceKey = coalesceKey;
    lastCoalesceAt = now;

    set({
      document: nextDoc,
      isDirty: true,
      saveStatus: 'unsaved',
      errorMessage: null,
      ...(canCoalesce ? {} : { undoStack: [document, ...undoStack.slice(0, 49)], redoStack: [] }),
    });
  },

  updateResponsive: (nodeId, responsivePatch) => {
    const { document } = get();
    if (!document) return;
    const loc = findNodeLocation(document, nodeId);
    if (!loc) return;
    get().executeOperation(
      { type: 'updateResponsive', pageId: loc.pageId, nodeId, responsive: responsivePatch },
      { coalesceKey: `updateResponsive:${nodeId}` },
    );
  },

  resetViewportStyles: (nodeId) => {
    const { document, viewport, undoStack } = get();
    if (!document || viewport === 'desktop') return;
    const loc = findNodeLocation(document, nodeId);
    if (!loc) return;
    const nextDoc = clearResponsiveViewport(document, loc.pageId, nodeId, viewport);
    set({
      document: nextDoc,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [document, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  resetViewportStyleGroup: (nodeId, groups) => {
    const { document, viewport, undoStack } = get();
    if (!document || viewport === 'desktop') return;
    const loc = findNodeLocation(document, nodeId);
    if (!loc) return;
    const nextDoc = clearResponsiveStyleGroup(document, loc.pageId, nodeId, viewport, groups);
    set({
      document: nextDoc,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [document, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  resetViewportStylePath: (nodeId, path) => {
    const { document, viewport, undoStack } = get();
    if (!document || viewport === 'desktop') return;
    const loc = findNodeLocation(document, nodeId);
    if (!loc) return;
    const nextDoc = clearResponsiveStylePath(document, loc.pageId, nodeId, viewport, path);
    set({
      document: nextDoc,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [document, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  setVisibility: (nodeId, visibilityPatch) => {
    const { document } = get();
    if (!document) return;
    const loc = findNodeLocation(document, nodeId);
    if (!loc) return;
    get().executeOperation({
      type: 'setVisibility',
      pageId: loc.pageId,
      nodeId,
      visibility: visibilityPatch,
    });
  },

  setNodeLocked: (nodeId, locked) => {
    get().updateNode(nodeId, { locked });
  },

  reorderChildren: (parentId, childIds) => {
    const { document } = get();
    if (!document) return;
    const loc = findNodeLocation(document, parentId);
    if (!loc) return;
    get().executeOperation({ type: 'reorderChildren', pageId: loc.pageId, parentId, childIds });
  },

  copyNode: (nodeId) => {
    const node = get().findNode(nodeId);
    if (!node) return;
    const copied = recursivelyCloneWithFreshIds(node);
    set({ clipboardNode: copied });
  },

  pasteNode: (targetParentId, targetIndex) => {
    const { clipboardNode, activePageId, document, undoStack, selectedNodeId, findParent, findNode } = get();
    if (!clipboardNode || !document) return null;

    const prevDoc = deepClone(document);
    const docClone = deepClone(document);
    const page = docClone.pages.find((p) => p.id === activePageId);
    if (!page) return null;

    const nodeToPaste = recursivelyCloneWithFreshIds(clipboardNode);
    nodeToPaste.name = `${clipboardNode.name || clipboardNode.type} (Copy)`;

    let pId = targetParentId;
    let idx = targetIndex;

    if (!pId && selectedNodeId) {
      const selected = findNode(selectedNodeId);
      if (selected && ['container', 'section', 'column', 'grid', 'stack', 'row', 'page-root'].includes(selected.type)) {
        pId = selected.id;
      } else {
        const pInfo = findParent(selectedNodeId);
        if (pInfo) {
          pId = pInfo.parent.id;
          idx = pInfo.index + 1;
        }
      }
    }

    if (!pId) pId = page.root.id;

    const parent = searchNode(page.root, pId);
    if (!parent) return null;
    if (!parent.children) parent.children = [];

    if (typeof idx === 'number' && idx >= 0 && idx <= parent.children.length) {
      parent.children.splice(idx, 0, nodeToPaste);
    } else {
      parent.children.push(nodeToPaste);
    }

    set({
      document: docClone,
      selectedNodeId: nodeToPaste.id,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [prevDoc, ...undoStack.slice(0, 49)],
      redoStack: [],
    });

    return nodeToPaste;
  },

  setLock: (nodeId, locked) => {
    const { document, activePageId, undoStack } = get();
    if (!document) return;
    const prevDoc = deepClone(document);
    const docClone = deepClone(document);
    const page = docClone.pages.find((p) => p.id === activePageId);
    if (!page) return;
    const node = searchNode(page.root, nodeId);
    if (!node) return;
    node.locked = locked;
    set({
      document: docClone,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [prevDoc, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  setNodeLabel: (nodeId, label) => {
    const { document, activePageId, undoStack } = get();
    if (!document) return;
    const prevDoc = deepClone(document);
    const docClone = deepClone(document);
    const page = docClone.pages.find((p) => p.id === activePageId);
    if (!page) return;
    const node = searchNode(page.root, nodeId);
    if (!node) return;
    node.label = label;
    if (label) node.name = label;
    set({
      document: docClone,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [prevDoc, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  updateState: (nodeId, stateKey, stylesPatch) => {
    const { document, activePageId, undoStack } = get();
    if (!document) return;
    const prevDoc = deepClone(document);
    const docClone = deepClone(document);
    const page = docClone.pages.find((p) => p.id === activePageId);
    if (!page) return;
    const node = searchNode(page.root, nodeId);
    if (!node) return;
    if (!node.states) node.states = {};
    node.states[stateKey] = {
      ...(node.states[stateKey] || {}),
      ...stylesPatch,
    };
    set({
      document: docClone,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [prevDoc, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  updateAnimation: (nodeId, animationPatch) => {
    const { document, activePageId, undoStack } = get();
    if (!document) return;
    const prevDoc = deepClone(document);
    const docClone = deepClone(document);
    const page = docClone.pages.find((p) => p.id === activePageId);
    if (!page) return;
    const node = searchNode(page.root, nodeId);
    if (!node) return;
    node.animations = {
      ...(node.animations || {}),
      ...animationPatch,
    };
    set({
      document: docClone,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [prevDoc, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  resetResponsive: (nodeId, breakpoint, category, property) => {
    const { document, activePageId, undoStack } = get();
    if (!document) return;
    const prevDoc = deepClone(document);
    const docClone = deepClone(document);
    const page = docClone.pages.find((p) => p.id === activePageId);
    if (!page) return;
    const node = searchNode(page.root, nodeId);
    if (!node || !node.responsive || !node.responsive[breakpoint]) return;

    if (!category) {
      delete node.responsive[breakpoint];
    } else {
      const bpObj = node.responsive[breakpoint] as unknown as Record<string, Record<string, unknown>>;
      if (bpObj && bpObj[category]) {
        if (!property) {
          delete bpObj[category];
        } else if (typeof bpObj[category] === 'object') {
          delete bpObj[category][property];
        }
      }
    }

    set({
      document: docClone,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [prevDoc, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  changeLayout: (sectionId, newLayout) => {
    const { document, activePageId, undoStack } = get();
    if (!document) return;
    const prevDoc = deepClone(document);
    const docClone = deepClone(document);
    const page = docClone.pages.find((p) => p.id === activePageId);
    if (!page) return;

    const section = searchNode(page.root, sectionId);
    if (!section) return;

    section.props = {
      ...(section.props || {}),
      layoutVariant: newLayout,
    };

    // Find first container inside section to adapt its layout
    const container = section.children?.find((c: WebsiteNode) => c.type === 'container' || c.type === 'grid' || c.type === 'row') || section;

    if (newLayout === 'centered') {
      container.styles = {
        ...container.styles,
        layout: { ...(container.styles?.layout || {}), display: 'flex' },
        flex: { ...(container.styles?.flex || {}), direction: 'column', alignItems: 'center' },
        typography: { ...(container.styles?.typography || {}), textAlign: 'center' },
      };
    } else if (newLayout === 'split' || newLayout === 'image-left' || newLayout === 'image-right') {
      container.styles = {
        ...container.styles,
        layout: { ...(container.styles?.layout || {}), display: 'grid' },
        grid: { ...(container.styles?.grid || {}), columns: 2, columnGap: '32px', rowGap: '32px' },
      };
    } else if (newLayout === 'bento') {
      container.styles = {
        ...container.styles,
        layout: { ...(container.styles?.layout || {}), display: 'grid' },
        grid: { ...(container.styles?.grid || {}), columns: 3, columnGap: '20px', rowGap: '20px' },
      };
    } else if (newLayout === 'grid') {
      container.styles = {
        ...container.styles,
        layout: { ...(container.styles?.layout || {}), display: 'grid' },
        grid: { ...(container.styles?.grid || {}), columns: 3, columnGap: '24px', rowGap: '24px' },
      };
    } else if (newLayout === 'minimal') {
      container.styles = {
        ...container.styles,
        layout: { ...(container.styles?.layout || {}), display: 'flex', maxWidth: '800px' },
        flex: { ...(container.styles?.flex || {}), direction: 'column', gap: '24px' },
      };
    }

    set({
      document: docClone,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [prevDoc, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  setSectionVariant: (sectionId, newVariant) => {
    const { document, activePageId, undoStack } = get();
    if (!document) return;
    const prevDoc = deepClone(document);
    const docClone = deepClone(document);
    const page = docClone.pages.find((p) => p.id === activePageId);
    if (!page) return;

    const section = searchNode(page.root, sectionId);
    if (!section) return;

    section.props = {
      ...(section.props || {}),
      variant: newVariant,
    };

    const container = section.children?.find((c: WebsiteNode) => c.type === 'container' || c.type === 'grid') || section;
    if (newVariant.includes('bento')) {
      container.styles = {
        ...container.styles,
        layout: { ...(container.styles?.layout || {}), display: 'grid' },
        grid: { ...(container.styles?.grid || {}), columns: 3, columnGap: '20px', rowGap: '20px' },
      };
    } else if (newVariant.includes('grid-3col') || newVariant.includes('three-column')) {
      container.styles = {
        ...container.styles,
        layout: { ...(container.styles?.layout || {}), display: 'grid' },
        grid: { ...(container.styles?.grid || {}), columns: 3, columnGap: '24px', rowGap: '24px' },
      };
    } else if (newVariant.includes('grid-4col') || newVariant.includes('four-column')) {
      container.styles = {
        ...container.styles,
        layout: { ...(container.styles?.layout || {}), display: 'grid' },
        grid: { ...(container.styles?.grid || {}), columns: 4, columnGap: '20px', rowGap: '20px' },
      };
    }

    set({
      document: docClone,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [prevDoc, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  updateTheme: (themePatch) => {
    get().executeOperation(
      { type: 'updateTheme', theme: themePatch },
      { coalesceKey: 'updateTheme' },
    );
  },

  addPage: (title, slug) => {
    const { document } = get();
    if (!document) throw new Error('No document loaded');

    const newPage: PageDocumentV3 = {
      id: generateNodeId('page'),
      title,
      slug: slug.startsWith('/') ? slug : `/${slug}`,
      type: 'custom',
      sortOrder: document.pages.length,
      enabled: true,
      root: createDefaultNode('page-root', {
        name: 'Page Root',
        styles: {
          layout: { display: 'flex', position: 'relative', width: '100%' },
          flex: { direction: 'column' },
        },
      }),
    };

    get().executeOperation({ type: 'addPage', page: newPage });
    set({ activePageId: newPage.id, selectedNodeId: null });
    return newPage;
  },

  updatePage: (pageId, patch) => {
    get().executeOperation({ type: 'updatePage', pageId, patch });
  },

  removePage: (pageId) => {
    const { document, activePageId } = get();
    if (!document || document.pages.length <= 1) return;
    get().executeOperation({ type: 'removePage', pageId });
    const remaining = get().document?.pages || [];
    set({
      activePageId: activePageId === pageId ? remaining[0]?.id || '' : get().activePageId,
      selectedNodeId: null,
    });
  },

  duplicatePage: (pageId) => {
    const { document, undoStack } = get();
    if (!document) return null;
    const result = duplicatePageDocument(document, pageId);
    if (!result) return null;
    lastCoalesceKey = null;
    set({
      document: result.document,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [document, ...undoStack.slice(0, 49)],
      redoStack: [],
      activePageId: result.page.id,
      selectedNodeId: null,
    });
    return result.page;
  },

  setHomePage: (pageId) => {
    const { document, undoStack } = get();
    if (!document) return;
    let next = document;
    for (const page of document.pages) {
      if (page.type === 'home' && page.id !== pageId) {
        next = applyDocumentOperation(next, {
          type: 'updatePage',
          pageId: page.id,
          patch: { type: 'custom' },
        });
      }
    }
    next = applyDocumentOperation(next, {
      type: 'updatePage',
      pageId,
      patch: { type: 'home' },
    });
    if (next === document) return;
    lastCoalesceKey = null;
    set({
      document: next,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [document, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  reorderPages: (pageIds) => {
    get().executeOperation({ type: 'reorderPages', pageIds });
  },

  insertSectionPreset: (presetNode, afterNodeId) => {
    const { activePageId } = get();
    const page = get().getActivePage();
    if (!page?.root) return null;

    let index: number | undefined;
    if (afterNodeId) {
      const parentInfo = findParentInTree(page.root, afterNodeId);
      if (parentInfo) index = parentInfo.index + 1;
    }

    const parentId = page.root.id;
    if (!canAcceptChild(page.root.type, presetNode.type)) return null;

    get().executeOperation(
      { type: 'addNode', pageId: activePageId, parentId, node: presetNode, index },
      { selectId: presetNode.id },
    );
    return presetNode;
  },

  replaceSection: (sectionId, presetOrVariant) => {
    if (typeof presetOrVariant === 'string') {
      get().setSectionVariant(sectionId, presetOrVariant);
      return null;
    }
    const presetNode = presetOrVariant;
    const { document, undoStack } = get();
    if (!document) return null;
    const loc = findNodeLocation(document, sectionId);
    if (!loc || loc.node.type !== 'section') return null;
    const parentInfo = findParentInTree(loc.root, sectionId);
    if (!parentInfo) return null;

    let next = applyDocumentOperation(document, {
      type: 'removeNode',
      pageId: loc.pageId,
      nodeId: sectionId,
    });
    next = applyDocumentOperation(next, {
      type: 'addNode',
      pageId: loc.pageId,
      parentId: parentInfo.parent.id,
      node: presetNode,
      index: parentInfo.index,
    });
    lastCoalesceKey = null;
    set({
      document: next,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [document, ...undoStack.slice(0, 49)],
      redoStack: [],
      selectedNodeId: presetNode.id,
    });
    return presetNode;
  },

  updateNavigation: (navigation) => {
    get().executeOperation(
      { type: 'updateNavigation', navigation },
      { coalesceKey: 'updateNavigation' },
    );
  },

  updateGlobal: (global) => {
    get().executeOperation({ type: 'updateGlobal', global });
  },

  saveReusableFromSelection: (name) => {
    const { document } = get();
    const node = get().getSelectedNode();
    if (!document || !node || node.type === 'page-root') return null;
    const libraryId = generateNodeId('lib');
    const definition = cloneNodeWithFreshIds(node);
    definition.name = name || node.name || node.type;
    definition.props = {
      ...(definition.props || {}),
      [REUSABLE_ID_PROP]: libraryId,
    };
    get().executeOperation({
      type: 'updateGlobal',
      global: { reusableNodes: { [libraryId]: definition } },
    });
    get().updateProps(node.id, { [INSTANCE_OF_PROP]: libraryId, [REUSABLE_ID_PROP]: libraryId });
    return libraryId;
  },

  insertReusable: (libraryId) => {
    const { document } = get();
    if (!document) return null;
    const definition = document.global?.reusableNodes?.[libraryId];
    if (!definition) return null;
    const cloned = cloneNodeWithFreshIds(definition);
    cloned.props = { ...(cloned.props || {}), [INSTANCE_OF_PROP]: libraryId };
    const page = get().getActivePage();
    if (!page?.root) return null;
    const target = resolveInsertTarget(page.root, get().selectedNodeId, cloned.type);
    if (!target) return null;
    return get().addNode(target.parentId, cloned, target.index);
  },

  syncReusableFromSelection: () => {
    const { document, undoStack } = get();
    const node = get().getSelectedNode();
    if (!document || !node) return;
    const libraryId = String(node.props?.[INSTANCE_OF_PROP] || node.props?.[REUSABLE_ID_PROP] || '');
    if (!libraryId) return;
    const definition = cloneNodeWithFreshIds(node);
    definition.props = { ...(definition.props || {}), [REUSABLE_ID_PROP]: libraryId };
    let next = applyDocumentOperation(document, {
      type: 'updateGlobal',
      global: { reusableNodes: { [libraryId]: definition } },
    });
    next = syncReusableInstances(next, libraryId);
    lastCoalesceKey = null;
    set({
      document: next,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [document, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  copySelectedNode: () => {
    const node = get().getSelectedNode();
    if (!node || node.type === 'page-root') return;
    set({ clipboardNode: deepClone(node) });
  },

  pasteClipboard: () => {
    const { clipboardNode, selectedNodeId, document } = get();
    if (!clipboardNode || !document) return null;

    const cloned = sanitizePastedNode(cloneNodeWithFreshIds(clipboardNode));
    if (!cloned) return null;

    const selectedLoc = selectedNodeId ? findNodeLocation(document, selectedNodeId) : null;
    const page = get().getActivePage();
    const root = selectedLoc?.root || page?.root;
    const pageId = selectedLoc?.pageId || get().activePageId;
    if (!root) return null;

    const target = resolveInsertTarget(root, selectedNodeId, cloned.type);
    if (!target) return null;

    get().executeOperation(
      {
        type: 'addNode',
        pageId,
        parentId: target.parentId,
        node: cloned,
        index: target.index,
      },
      { selectId: cloned.id },
    );
    return cloned;
  },

  undo: () => {
    const { undoStack, redoStack, document } = get();
    if (!undoStack.length || !document) return;
    lastCoalesceKey = null;
    const previousDoc = undoStack[0];
    set({
      document: previousDoc,
      undoStack: undoStack.slice(1),
      redoStack: [document, ...redoStack.slice(0, 49)],
      isDirty: true,
      saveStatus: 'unsaved',
    });
  },

  redo: () => {
    const { undoStack, redoStack, document } = get();
    if (!redoStack.length || !document) return;
    lastCoalesceKey = null;
    const nextDoc = redoStack[0];
    set({
      document: nextDoc,
      undoStack: [document, ...undoStack.slice(0, 49)],
      redoStack: redoStack.slice(1),
      isDirty: true,
      saveStatus: 'unsaved',
    });
  },

  saveDocument: async () => {
    const { websiteId, document, revision } = get();
    if (!websiteId || !document) return false;

    set({ saveStatus: 'saving', errorMessage: null });

    try {
      const result = await websitesApi.updateDocument(websiteId, document, revision);
      set({
        revision: result.revision || revision + 1,
        documentHash: result.documentHash || '',
        saveStatus: 'saved',
        isDirty: false,
        lastSavedAt: new Date(),
        hasConflict: false,
        errorMessage: null,
      });
      return true;
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { status?: number; data?: { message?: string | string[]; error?: string; errors?: Array<{ path: string; message: string }>; } };
        status?: number;
        statusCode?: number;
        message?: string;
      };
      console.error('Failed to save document error details:', (axiosErr as {response?: unknown}).response || axiosErr?.message || err);
      const resMsg = axiosErr?.response?.data?.message || axiosErr?.message;
      const status = axiosErr?.response?.status || axiosErr?.status || axiosErr?.statusCode;
      const validationErrors = axiosErr?.response?.data?.errors;
      const details = Array.isArray(validationErrors) && validationErrors.length > 0
        ? ` (${validationErrors.map((e: {path: string; message: string}) => `${e.path}: ${e.message}`).join('; ')})`
        : '';
      const isConflict = status === 409 || /revision|conflict|modified in another/i.test(String(resMsg || ''));
      const msg = isConflict
        ? 'This website was modified in another session. Reload the latest version, or keep editing and retry — retry may fail until you reload.'
        : Array.isArray(resMsg)
          ? `${Array.isArray(resMsg) ? resMsg.join(', ') : resMsg || axiosErr?.message || 'Failed to save changes.'}${details}`
          : `${resMsg || axiosErr?.message || 'Failed to save changes.'}${details}`;
      set({ saveStatus: 'error', errorMessage: msg, hasConflict: isConflict });
      return false;
    }
  },

  publishDocument: async () => {
    const { websiteId, saveDocument } = get();
    if (!websiteId) throw new Error('No website selected');

    const saved = await saveDocument();
    if (!saved) {
      const err = get().errorMessage || 'Failed to save latest changes before publishing';
      throw new Error(err);
    }

    const result = await websitesApi.publish(websiteId);
    return { success: true, versionId: result.versionId };
  },

  reloadFromServer: async () => {
    const { websiteId } = get();
    if (!websiteId) return false;
    try {
      const docRes = await websitesApi.getDocument(websiteId);
      if (docRes?.document) {
        get().setDocumentData(websiteId, docRes.document, docRes.revision || 1, docRes.documentHash || '');
        return true;
      }
    } catch {
      // Fall through to the website record, which is not schema-validated on read.
    }

    try {
      const siteData = await websitesApi.getById(websiteId);
      const raw =
        (siteData as unknown as { draftDocument?: unknown; publishedDocument?: unknown }).draftDocument ||
        (siteData as unknown as { publishedDocument?: unknown }).publishedDocument;
      if (!raw) {
        set({ errorMessage: 'Could not reload the latest document from the server.' });
        return false;
      }
      const revision = (siteData as unknown as { documentRevision?: number }).documentRevision || 1;
      get().setDocumentData(websiteId, toEditorDocument(raw), revision);
      return true;
    } catch {
      set({ errorMessage: 'Could not reload the latest document from the server.' });
      return false;
    }
  },
}));
