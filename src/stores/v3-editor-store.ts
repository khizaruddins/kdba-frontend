/**
 * KDBA V3 — Visual Builder State Store (Zustand)
 *
 * Implements centralized tree manipulation, transactional undo/redo,
 * selection, hover state, responsive viewport management, and debounced autosave.
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
} from '@/types/v3-document';
import { websitesApi } from '@/lib/api/websites';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export interface V3EditorState {
  websiteId: string | null;
  document: WebsiteDocumentV3 | null;
  revision: number;
  documentHash: string;
  isDirty: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'unsaved' | 'error';
  lastSavedAt: Date | null;
  errorMessage: string | null;

  // Selection & Navigation
  activePageId: string;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  activeNavTab: 'add' | 'pages' | 'layers' | 'assets' | 'theme' | null;
  previewMode: boolean;

  // Viewport & Zoom
  viewport: ViewportMode;
  zoom: number; // 25 to 150 (percentage)
  isInlineEditing: boolean;
  inlineEditingNodeId: string | null;

  // Drag & Drop State
  isDragging: boolean;
  draggedNodeType: NodeType | null;
  draggedNodeId: string | null;
  dropTargetId: string | null;
  dropPosition: 'before' | 'after' | 'inside' | null;

  // History Stacks
  undoStack: WebsiteDocumentV3[];
  redoStack: WebsiteDocumentV3[];

  // Initialization & Store Setters
  setDocumentData: (websiteId: string, doc: WebsiteDocumentV3, revision?: number, hash?: string) => void;
  setActivePageId: (pageId: string) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  setHoveredNodeId: (nodeId: string | null) => void;
  setActiveNavTab: (tab: 'add' | 'pages' | 'layers' | 'assets' | 'theme' | null) => void;
  setViewport: (viewport: ViewportMode) => void;
  setZoom: (zoom: number) => void;
  setPreviewMode: (preview: boolean) => void;
  setIsInlineEditing: (editing: boolean) => void;
  setInlineEditingNodeId: (id: string | null) => void;
  setDragState: (isDragging: boolean, type?: NodeType | null, id?: string | null) => void;
  setDropTarget: (targetId: string | null, position?: 'before' | 'after' | 'inside' | null) => void;

  // Tree Queries
  getActivePage: () => PageDocumentV3 | null;
  getSelectedNode: () => WebsiteNode | null;
  getNodePath: (nodeId: string) => WebsiteNode[];
  findNode: (nodeId: string) => WebsiteNode | null;
  findParent: (nodeId: string) => { parent: WebsiteNode; index: number } | null;

  // Document Operations (Mutations)
  addNode: (parentId: string, node: Partial<WebsiteNode> & { type: NodeType }, index?: number) => WebsiteNode;
  removeNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => WebsiteNode | null;
  moveNode: (nodeId: string, targetParentId: string, targetIndex?: number) => void;
  updateProps: (nodeId: string, propsPatch: Record<string, unknown>) => void;
  updateStyles: (nodeId: string, stylesPatch: Partial<StyleDefinition>) => void;
  updateResponsive: (nodeId: string, responsivePatch: Partial<ResponsiveStyleDefinition>) => void;
  setVisibility: (nodeId: string, visibilityPatch: Partial<ResponsiveVisibility>) => void;
  reorderChildren: (parentId: string, childIds: string[]) => void;
  updateTheme: (themePatch: Partial<ThemeSystemV3>) => void;
  addPage: (title: string, slug: string) => PageDocumentV3;
  updatePage: (pageId: string, patch: Partial<PageDocumentV3>) => void;
  removePage: (pageId: string) => void;

  // Undo / Redo / History
  undo: () => void;
  redo: () => void;

  // Persistence
  saveDocument: () => Promise<boolean>;
  publishDocument: () => Promise<{ success: boolean; versionId?: string }>;
}

function deepClone<T>(val: T): T {
  return JSON.parse(JSON.stringify(val));
}

function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

function recursivelyCloneWithFreshIds(node: WebsiteNode): WebsiteNode {
  const cloned: WebsiteNode = {
    ...deepClone(node),
    id: generateId(node.type),
  };
  if (Array.isArray(cloned.children)) {
    cloned.children = cloned.children.map((c) => recursivelyCloneWithFreshIds(c));
  }
  return cloned;
}

function searchNode(root: WebsiteNode, id: string): WebsiteNode | null {
  if (root.id === id) return root;
  if (!root.children) return null;
  for (const child of root.children) {
    const found = searchNode(child, id);
    if (found) return found;
  }
  return null;
}

function searchParent(
  root: WebsiteNode,
  id: string,
): { parent: WebsiteNode; index: number } | null {
  if (!root.children) return null;
  const idx = root.children.findIndex((c) => c.id === id);
  if (idx !== -1) {
    return { parent: root, index: idx };
  }
  for (const child of root.children) {
    const found = searchParent(child, id);
    if (found) return found;
  }
  return null;
}

function getAncestry(root: WebsiteNode, id: string, path: WebsiteNode[] = []): WebsiteNode[] | null {
  const currentPath = [...path, root];
  if (root.id === id) return currentPath;
  if (!root.children) return null;
  for (const child of root.children) {
    const found = getAncestry(child, id, currentPath);
    if (found) return found;
  }
  return null;
}

export const useV3EditorStore = create<V3EditorState>((set, get) => ({
  websiteId: null,
  document: null,
  revision: 1,
  documentHash: '',
  isDirty: false,
  saveStatus: 'idle',
  lastSavedAt: null,
  errorMessage: null,

  activePageId: '',
  selectedNodeId: null,
  hoveredNodeId: null,
  activeNavTab: 'add',
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

  undoStack: [],
  redoStack: [],

  // ─── SETTERS ────────────────────────────────────────────────────────────────

  setDocumentData: (websiteId, doc, revision = 1, hash = '') => {
    const firstPageId = doc.pages?.[0]?.id || '';
    set({
      websiteId,
      document: deepClone(doc),
      revision,
      documentHash: hash,
      activePageId: firstPageId,
      selectedNodeId: null,
      inlineEditingNodeId: null,
      hoveredNodeId: null,
      isDirty: false,
      saveStatus: 'saved',
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
  setViewport: (viewport) => set({ viewport }),
  setZoom: (zoom) => set({ zoom }),
  setPreviewMode: (previewMode) =>
    set({ previewMode, selectedNodeId: null, inlineEditingNodeId: null, hoveredNodeId: null }),
  setIsInlineEditing: (isInlineEditing) => set({ isInlineEditing }),
  setInlineEditingNodeId: (inlineEditingNodeId) => set({ inlineEditingNodeId }),

  setDragState: (isDragging, draggedNodeType = null, draggedNodeId = null) => {
    set({
      isDragging,
      draggedNodeType,
      draggedNodeId,
      ...(isDragging ? {} : { dropTargetId: null, dropPosition: null }),
    });
  },

  setDropTarget: (dropTargetId, dropPosition = null) => set({ dropTargetId, dropPosition }),

  // ─── TREE QUERIES ───────────────────────────────────────────────────────────

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
    const page = get().getActivePage();
    if (!page || !page.root) return null;
    return searchNode(page.root, nodeId);
  },

  findParent: (nodeId) => {
    const page = get().getActivePage();
    if (!page || !page.root) return null;
    return searchParent(page.root, nodeId);
  },

  getNodePath: (nodeId) => {
    const page = get().getActivePage();
    if (!page || !page.root) return [];
    return getAncestry(page.root, nodeId) || [];
  },

  // ─── TREE MUTATIONS ─────────────────────────────────────────────────────────

  addNode: (parentId, nodeInput, index) => {
    const { document, activePageId, undoStack } = get();
    if (!document) throw new Error('No document loaded');

    // Save history snapshot
    const prevDoc = deepClone(document);

    const docClone = deepClone(document);
    const page = docClone.pages.find((p) => p.id === activePageId);
    if (!page) throw new Error('Active page not found');

    const parent = searchNode(page.root, parentId);
    if (!parent) throw new Error(`Parent node "${parentId}" not found`);

    const newNode: WebsiteNode = {
      id: nodeInput.id || generateId(nodeInput.type),
      type: nodeInput.type,
      name: nodeInput.name || nodeInput.type.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      children: nodeInput.children || [],
      props: nodeInput.props || {},
      styles: nodeInput.styles || {},
      responsive: nodeInput.responsive || {},
      visibility: nodeInput.visibility || { desktop: true, tablet: true, mobile: true },
    };

    if (!parent.children) parent.children = [];
    if (typeof index === 'number' && index >= 0 && index <= parent.children.length) {
      parent.children.splice(index, 0, newNode);
    } else {
      parent.children.push(newNode);
    }

    set({
      document: docClone,
      selectedNodeId: newNode.id,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [prevDoc, ...undoStack.slice(0, 49)],
      redoStack: [],
    });

    return newNode;
  },

  removeNode: (nodeId) => {
    const { document, activePageId, undoStack, selectedNodeId } = get();
    if (!document) return;

    const prevDoc = deepClone(document);
    const docClone = deepClone(document);
    const page = docClone.pages.find((p) => p.id === activePageId);
    if (!page || page.root.id === nodeId) return; // Prevent deleting root

    const parentInfo = searchParent(page.root, nodeId);
    if (!parentInfo) return;

    parentInfo.parent.children?.splice(parentInfo.index, 1);

    set({
      document: docClone,
      selectedNodeId: selectedNodeId === nodeId ? parentInfo.parent.id : selectedNodeId,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [prevDoc, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  duplicateNode: (nodeId) => {
    const { document, activePageId, undoStack } = get();
    if (!document) return null;

    const prevDoc = deepClone(document);
    const docClone = deepClone(document);
    const page = docClone.pages.find((p) => p.id === activePageId);
    if (!page || page.root.id === nodeId) return null;

    const parentInfo = searchParent(page.root, nodeId);
    if (!parentInfo || !parentInfo.parent.children) return null;

    const source = parentInfo.parent.children[parentInfo.index];
    const duplicated = recursivelyCloneWithFreshIds(source);
    duplicated.name = `${source.name || source.type} (Copy)`;

    parentInfo.parent.children.splice(parentInfo.index + 1, 0, duplicated);

    set({
      document: docClone,
      selectedNodeId: duplicated.id,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [prevDoc, ...undoStack.slice(0, 49)],
      redoStack: [],
    });

    return duplicated;
  },

  moveNode: (nodeId, targetParentId, targetIndex) => {
    const { document, activePageId, undoStack } = get();
    if (!document) return;

    const prevDoc = deepClone(document);
    const docClone = deepClone(document);
    const page = docClone.pages.find((p) => p.id === activePageId);
    if (!page || nodeId === targetParentId) return;

    // Check circular move
    const node = searchNode(page.root, nodeId);
    if (!node) return;
    if (searchNode(node, targetParentId)) return; // targetParentId is inside node

    // Remove from current parent
    const sourceParentInfo = searchParent(page.root, nodeId);
    if (!sourceParentInfo || !sourceParentInfo.parent.children) return;

    const [removedNode] = sourceParentInfo.parent.children.splice(sourceParentInfo.index, 1);

    // Insert into target parent
    const targetParent = searchNode(page.root, targetParentId);
    if (!targetParent) return;
    if (!targetParent.children) targetParent.children = [];

    const insertIdx =
      typeof targetIndex === 'number' && targetIndex >= 0
        ? Math.min(targetIndex, targetParent.children.length)
        : targetParent.children.length;

    targetParent.children.splice(insertIdx, 0, removedNode);

    set({
      document: docClone,
      selectedNodeId: nodeId,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [prevDoc, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  updateProps: (nodeId, propsPatch) => {
    const { document, activePageId, undoStack } = get();
    if (!document) return;

    const prevDoc = deepClone(document);
    const docClone = deepClone(document);
    const page = docClone.pages.find((p) => p.id === activePageId);
    if (!page) return;

    const node = searchNode(page.root, nodeId);
    if (!node) return;

    node.props = { ...(node.props || {}), ...propsPatch };

    set({
      document: docClone,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [prevDoc, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  updateStyles: (nodeId, stylesPatch) => {
    const { document, activePageId, undoStack } = get();
    if (!document) return;

    const prevDoc = deepClone(document);
    const docClone = deepClone(document);
    const page = docClone.pages.find((p) => p.id === activePageId);
    if (!page) return;

    const node = searchNode(page.root, nodeId);
    if (!node) return;

    node.styles = {
      ...node.styles,
      ...stylesPatch,
      layout: { ...(node.styles?.layout || {}), ...(stylesPatch.layout || {}) },
      flex: { ...(node.styles?.flex || {}), ...(stylesPatch.flex || {}) },
      grid: { ...(node.styles?.grid || {}), ...(stylesPatch.grid || {}) },
      size: { ...(node.styles?.size || {}), ...(stylesPatch.size || {}) },
      spacing: {
        ...(node.styles?.spacing || {}),
        ...(stylesPatch.spacing || {}),
        margin: { ...(node.styles?.spacing?.margin || {}), ...(stylesPatch.spacing?.margin || {}) },
        padding: { ...(node.styles?.spacing?.padding || {}), ...(stylesPatch.spacing?.padding || {}) },
      },
      typography: { ...(node.styles?.typography || {}), ...(stylesPatch.typography || {}) },
      background: { ...(node.styles?.background || {}), ...(stylesPatch.background || {}) },
      border: { ...(node.styles?.border || {}), ...(stylesPatch.border || {}) },
      effects: { ...(node.styles?.effects || {}), ...(stylesPatch.effects || {}) },
      transform: { ...(node.styles?.transform || {}), ...(stylesPatch.transform || {}) },
    };

    set({
      document: docClone,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [prevDoc, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  updateResponsive: (nodeId, responsivePatch) => {
    const { document, activePageId, undoStack } = get();
    if (!document) return;

    const prevDoc = deepClone(document);
    const docClone = deepClone(document);
    const page = docClone.pages.find((p) => p.id === activePageId);
    if (!page) return;

    const node = searchNode(page.root, nodeId);
    if (!node) return;

    node.responsive = {
      ...node.responsive,
      ...responsivePatch,
    };

    set({
      document: docClone,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [prevDoc, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  setVisibility: (nodeId, visibilityPatch) => {
    const { document, activePageId, undoStack } = get();
    if (!document) return;

    const prevDoc = deepClone(document);
    const docClone = deepClone(document);
    const page = docClone.pages.find((p) => p.id === activePageId);
    if (!page) return;

    const node = searchNode(page.root, nodeId);
    if (!node) return;

    node.visibility = {
      ...node.visibility,
      ...visibilityPatch,
    };

    set({
      document: docClone,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [prevDoc, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  reorderChildren: (parentId, childIds) => {
    const { document, activePageId, undoStack } = get();
    if (!document) return;

    const prevDoc = deepClone(document);
    const docClone = deepClone(document);
    const page = docClone.pages.find((p) => p.id === activePageId);
    if (!page) return;

    const parent = searchNode(page.root, parentId);
    if (!parent || !parent.children) return;

    const childMap = new Map(parent.children.map((c) => [c.id, c]));
    parent.children = childIds.map((id) => childMap.get(id)).filter(Boolean) as WebsiteNode[];

    set({
      document: docClone,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [prevDoc, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  updateTheme: (themePatch) => {
    const { document, undoStack } = get();
    if (!document) return;

    const prevDoc = deepClone(document);
    const docClone = deepClone(document);

    docClone.theme = {
      ...docClone.theme,
      ...themePatch,
      colors: { ...(docClone.theme.colors || {}), ...(themePatch.colors || {}) },
      typography: { ...(docClone.theme.typography || {}), ...(themePatch.typography || {}) },
    };

    set({
      document: docClone,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [prevDoc, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  addPage: (title, slug) => {
    const { document, undoStack } = get();
    if (!document) throw new Error('No document loaded');

    const prevDoc = deepClone(document);
    const docClone = deepClone(document);

    const newPage: PageDocumentV3 = {
      id: generateId('page'),
      title,
      slug: slug.startsWith('/') ? slug : `/${slug}`,
      type: 'custom',
      sortOrder: docClone.pages.length,
      enabled: true,
      root: {
        id: generateId('root'),
        type: 'page-root',
        name: 'Page Root',
        children: [],
        props: {},
        styles: { layout: { display: 'flex', position: 'relative', width: '100%' }, flex: { direction: 'column' } },
      },
    };

    docClone.pages.push(newPage);

    set({
      document: docClone,
      activePageId: newPage.id,
      selectedNodeId: null,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [prevDoc, ...undoStack.slice(0, 49)],
      redoStack: [],
    });

    return newPage;
  },

  updatePage: (pageId, patch) => {
    const { document, undoStack } = get();
    if (!document) return;

    const prevDoc = deepClone(document);
    const docClone = deepClone(document);
    const pageIdx = docClone.pages.findIndex((p) => p.id === pageId);
    if (pageIdx === -1) return;

    docClone.pages[pageIdx] = {
      ...docClone.pages[pageIdx],
      ...patch,
    };

    set({
      document: docClone,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [prevDoc, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  removePage: (pageId) => {
    const { document, undoStack, activePageId } = get();
    if (!document || document.pages.length <= 1) return; // Keep at least one page

    const prevDoc = deepClone(document);
    const docClone = deepClone(document);
    docClone.pages = docClone.pages.filter((p) => p.id !== pageId);

    set({
      document: docClone,
      activePageId: activePageId === pageId ? docClone.pages[0].id : activePageId,
      selectedNodeId: null,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [prevDoc, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  // ─── UNDO / REDO ────────────────────────────────────────────────────────────

  undo: () => {
    const { undoStack, redoStack, document } = get();
    if (!undoStack.length || !document) return;

    const previousDoc = undoStack[0];
    const newUndoStack = undoStack.slice(1);

    set({
      document: deepClone(previousDoc),
      undoStack: newUndoStack,
      redoStack: [deepClone(document), ...redoStack.slice(0, 49)],
      isDirty: true,
      saveStatus: 'unsaved',
    });
  },

  redo: () => {
    const { undoStack, redoStack, document } = get();
    if (!redoStack.length || !document) return;

    const nextDoc = redoStack[0];
    const newRedoStack = redoStack.slice(1);

    set({
      document: deepClone(nextDoc),
      undoStack: [deepClone(document), ...undoStack.slice(0, 49)],
      redoStack: newRedoStack,
      isDirty: true,
      saveStatus: 'unsaved',
    });
  },

  // ─── PERSISTENCE ────────────────────────────────────────────────────────────

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
      });
      return true;
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { status?: number; data?: { message?: string | string[]; error?: string } };
        message?: string;
      };
      console.error('Failed to save document error details:', axiosErr.response?.data || axiosErr.message || err);
      const isConflict = axiosErr?.response?.status === 409;
      const resMsg = axiosErr?.response?.data?.message;
      const msg = isConflict
        ? 'Document modified in another session. Please reload to sync changes.'
        : Array.isArray(resMsg)
        ? resMsg.join(', ')
        : (typeof resMsg === 'string' ? resMsg : axiosErr?.message) || 'Failed to save changes.';
      set({ saveStatus: 'error', errorMessage: msg });
      return false;
    }
  },

  publishDocument: async () => {
    const { websiteId, saveDocument } = get();
    if (!websiteId) throw new Error('No website selected');

    // Save first to guarantee latest draft is validated and pushed
    const saved = await saveDocument();
    if (!saved) throw new Error('Failed to save latest changes before publishing');

    const result = await websitesApi.publish(websiteId);
    return { success: true, versionId: result.versionId };
  },
}));
