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
} from '@/types/v3-document';
import { websitesApi } from '@/lib/api/websites';
import {
  applyDocumentOperation,
  applyStylesForViewport,
  clearResponsiveStyleGroup,
  clearResponsiveViewport,
  cloneNodeWithFreshIds,
  createDefaultNode,
  deepClone,
  findNode as findNodeInTree,
  findParent as findParentInTree,
  generateNodeId,
  getAncestry,
  getStylesForViewport,
} from '@/lib/document/v3-operations';
import { canAcceptChild, resolveInsertTarget } from '@/lib/editor/nesting';
import { COMPONENT_MANIFEST } from '@/lib/editor/component-manifest';
import { toEditorDocument } from '@/lib/document/v3-wire';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'unsaved' | 'error';

const HISTORY_COALESCE_MS = 700;

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
  activeNavTab: 'add' | 'pages' | 'layers' | 'assets' | 'theme' | null;
  inspectorFocusKey: string | null;
  previewMode: boolean;

  viewport: ViewportMode;
  zoom: number;
  isInlineEditing: boolean;
  inlineEditingNodeId: string | null;

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
  setActiveNavTab: (tab: 'add' | 'pages' | 'layers' | 'assets' | 'theme' | null) => void;
  focusInspectorSection: (key: string | null) => void;
  setViewport: (viewport: ViewportMode) => void;
  setZoom: (zoom: number) => void;
  setPreviewMode: (preview: boolean) => void;
  setIsInlineEditing: (editing: boolean) => void;
  setInlineEditingNodeId: (id: string | null) => void;
  setDragState: (isDragging: boolean, type?: NodeType | null, id?: string | null) => void;
  setDropTarget: (targetId: string | null, position?: 'before' | 'after' | 'inside' | null) => void;

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
  setVisibility: (nodeId: string, visibilityPatch: Partial<ResponsiveVisibility>) => void;
  reorderChildren: (parentId: string, childIds: string[]) => void;
  updateTheme: (themePatch: Partial<ThemeSystemV3>) => void;
  addPage: (title: string, slug: string) => PageDocumentV3;
  updatePage: (pageId: string, patch: Partial<PageDocumentV3>) => void;
  removePage: (pageId: string) => void;
  insertSectionPreset: (presetNode: WebsiteNode, afterNodeId?: string | null) => WebsiteNode | null;

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

  undoStack: [],
  redoStack: [],

  setDocumentData: (websiteId, doc, revision = 1, hash = '') => {
    const normalized = toEditorDocument(doc);
    const firstPageId = normalized.pages?.[0]?.id || '';
    lastCoalesceKey = null;
    set({
      websiteId,
      document: deepClone(normalized),
      revision,
      documentHash: hash,
      activePageId: firstPageId,
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
    const page = get().getActivePage();
    if (!page?.root) return null;
    return findNodeInTree(page.root, nodeId);
  },

  findParent: (nodeId) => {
    const page = get().getActivePage();
    if (!page?.root) return null;
    return findParentInTree(page.root, nodeId);
  },

  getNodePath: (nodeId) => {
    const page = get().getActivePage();
    if (!page?.root) return [];
    return getAncestry(page.root, nodeId) || [];
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
    const { document, activePageId } = get();
    if (!document) return null;
    const page = get().getActivePage();
    if (!page) return null;

    const parent = findNodeInTree(page.root, parentId);
    if (!parent) return null;
    if (!canAcceptChild(parent.type, nodeInput.type)) return null;

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
      { type: 'addNode', pageId: activePageId, parentId, node: newNode, index },
      { selectId: newNode.id },
    );
    return newNode;
  },

  insertNodeType: (type, preferredParentId) => {
    const page = get().getActivePage();
    if (!page?.root) return null;
    const manifest = COMPONENT_MANIFEST[type];
    if (!manifest) return null;

    let target = resolveInsertTarget(
      page.root,
      preferredParentId || get().selectedNodeId,
      type,
    );

    if (!target && type !== 'section' && type !== 'navbar' && type !== 'footer') {
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
    const { activePageId } = get();
    const page = get().getActivePage();
    if (!page || page.root.id === nodeId) return;
    const parentInfo = findParentInTree(page.root, nodeId);
    get().executeOperation(
      { type: 'removeNode', pageId: activePageId, nodeId },
      { selectId: parentInfo?.parent.id ?? null },
    );
  },

  duplicateNode: (nodeId) => {
    const { document, activePageId } = get();
    if (!document) return null;
    const page = get().getActivePage();
    if (!page || page.root.id === nodeId) return null;

    const source = findNodeInTree(page.root, nodeId);
    if (!source) return null;
    const duplicated = cloneNodeWithFreshIds(source);
    duplicated.name = `${source.name || source.type} (Copy)`;

    const parentInfo = findParentInTree(page.root, nodeId);
    if (!parentInfo) return null;

    get().executeOperation(
      {
        type: 'addNode',
        pageId: activePageId,
        parentId: parentInfo.parent.id,
        node: duplicated,
        index: parentInfo.index + 1,
      },
      { selectId: duplicated.id },
    );
    return duplicated;
  },

  moveNode: (nodeId, targetParentId, targetIndex) => {
    const { activePageId } = get();
    const page = get().getActivePage();
    if (!page) return;
    const node = findNodeInTree(page.root, nodeId);
    const target = findNodeInTree(page.root, targetParentId);
    if (!node || !target) return;
    if (!canAcceptChild(target.type, node.type)) return;

    get().executeOperation(
      {
        type: 'moveNode',
        pageId: activePageId,
        nodeId,
        targetParentId,
        targetIndex: typeof targetIndex === 'number' ? targetIndex : target.children?.length || 0,
      },
      { selectId: nodeId },
    );
  },

  updateNode: (nodeId, patch) => {
    const { activePageId } = get();
    get().executeOperation(
      { type: 'updateNode', pageId: activePageId, nodeId, patch },
      { coalesceKey: `updateNode:${nodeId}` },
    );
  },

  updateProps: (nodeId, propsPatch) => {
    const { activePageId } = get();
    get().executeOperation(
      { type: 'updateProps', pageId: activePageId, nodeId, props: propsPatch },
      { coalesceKey: `updateProps:${nodeId}` },
    );
  },

  updateStyles: (nodeId, stylesPatch) => {
    const { document, activePageId, viewport } = get();
    if (!document) return;
    const { undoStack } = get();
    const now = Date.now();
    const coalesceKey = `updateStyles:${nodeId}:${viewport}`;
    const canCoalesce =
      lastCoalesceKey === coalesceKey && now - lastCoalesceAt < HISTORY_COALESCE_MS && undoStack.length > 0;

    const nextDoc = applyStylesForViewport(document, activePageId, nodeId, viewport, stylesPatch);
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
    const { activePageId } = get();
    get().executeOperation(
      { type: 'updateResponsive', pageId: activePageId, nodeId, responsive: responsivePatch },
      { coalesceKey: `updateResponsive:${nodeId}` },
    );
  },

  resetViewportStyles: (nodeId) => {
    const { document, activePageId, viewport, undoStack } = get();
    if (!document || viewport === 'desktop') return;
    const nextDoc = clearResponsiveViewport(document, activePageId, nodeId, viewport);
    set({
      document: nextDoc,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [document, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  resetViewportStyleGroup: (nodeId, groups) => {
    const { document, activePageId, viewport, undoStack } = get();
    if (!document || viewport === 'desktop') return;
    const nextDoc = clearResponsiveStyleGroup(document, activePageId, nodeId, viewport, groups);
    set({
      document: nextDoc,
      isDirty: true,
      saveStatus: 'unsaved',
      undoStack: [document, ...undoStack.slice(0, 49)],
      redoStack: [],
    });
  },

  setVisibility: (nodeId, visibilityPatch) => {
    const { activePageId } = get();
    get().executeOperation({
      type: 'setVisibility',
      pageId: activePageId,
      nodeId,
      visibility: visibilityPatch,
    });
  },

  reorderChildren: (parentId, childIds) => {
    const { activePageId } = get();
    get().executeOperation({ type: 'reorderChildren', pageId: activePageId, parentId, childIds });
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

  copySelectedNode: () => {
    const node = get().getSelectedNode();
    if (!node || node.type === 'page-root') return;
    set({ clipboardNode: deepClone(node) });
  },

  pasteClipboard: () => {
    const { clipboardNode, selectedNodeId } = get();
    const page = get().getActivePage();
    if (!clipboardNode || !page?.root) return null;

    const cloned = cloneNodeWithFreshIds(clipboardNode);
    const target = resolveInsertTarget(page.root, selectedNodeId, cloned.type);
    if (!target) return null;

    get().executeOperation(
      {
        type: 'addNode',
        pageId: get().activePageId,
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
        response?: { status?: number; data?: { message?: string | string[]; error?: string } };
        status?: number;
        statusCode?: number;
        message?: string;
      };
      const resMsg = axiosErr?.response?.data?.message || axiosErr?.message;
      const status = axiosErr?.response?.status || axiosErr?.status || axiosErr?.statusCode;
      const isConflict =
        status === 409 || /revision|conflict|modified in another/i.test(String(resMsg || ''));
      const msg = isConflict
        ? 'This website was modified in another session. Reload the latest version, or keep editing and retry — retry may fail until you reload.'
        : Array.isArray(resMsg)
          ? resMsg.join(', ')
          : typeof resMsg === 'string'
            ? resMsg
            : 'Failed to save changes.';
      set({ saveStatus: 'error', errorMessage: msg, hasConflict: isConflict });
      return false;
    }
  },

  publishDocument: async () => {
    const { websiteId, saveDocument } = get();
    if (!websiteId) throw new Error('No website selected');

    const saved = await saveDocument();
    if (!saved) throw new Error('Failed to save latest changes before publishing');

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
