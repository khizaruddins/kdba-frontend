'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { WebsiteNode, NodeType } from '@/types/v3-document';
import {
  X,
  Search,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Maximize2,
  Box,
  Heading,
  Pilcrow,
  SquarePlay,
  Image as ImageIcon,
  Grid,
  Columns,
  Layers,
  Sparkles,
  CreditCard,
  MessageSquareQuote,
  PanelTop,
  PanelBottom,
  Pencil,
  Lock,
  Unlock,
} from 'lucide-react';
import { canAcceptChild, isContainerType } from '@/lib/editor/nesting';

const NODE_ICONS: Record<string, React.ReactNode> = {
  section: <Maximize2 className="w-3.5 h-3.5 text-primary" />,
  container: <Box className="w-3.5 h-3.5 text-blue-400" />,
  heading: <Heading className="w-3.5 h-3.5 text-warning" />,
  paragraph: <Pilcrow className="w-3.5 h-3.5 text-muted-foreground" />,
  button: <SquarePlay className="w-3.5 h-3.5 text-emerald-400" />,
  image: <ImageIcon className="w-3.5 h-3.5 text-pink-400" />,
  grid: <Grid className="w-3.5 h-3.5 text-purple-400" />,
  row: <Columns className="w-3.5 h-3.5 text-sky-400" />,
  column: <Columns className="w-3.5 h-3.5 text-sky-400" />,
  pricing: <CreditCard className="w-3.5 h-3.5 text-warning" />,
  testimonial: <MessageSquareQuote className="w-3.5 h-3.5 text-teal-400" />,
  navbar: <PanelTop className="w-3.5 h-3.5 text-primary" />,
  footer: <PanelBottom className="w-3.5 h-3.5 text-primary" />,
};

interface TreeItemProps {
  node: WebsiteNode;
  depth?: number;
  searchFilter: string;
}

function TreeItem({ node, depth = 0, searchFilter }: TreeItemProps) {
  const {
    selectedNodeId,
    setSelectedNodeId,
    setHoveredNodeId,
    duplicateNode,
    removeNode,
    setVisibility,
    viewport,
    updateNode,
    setNodeLocked,
  } = useV3EditorStore();

  const [isExpanded, setIsExpanded] = React.useState(true);
  const [dropHint, setDropHint] = React.useState<'before' | 'after' | 'inside' | null>(null);
  const [renaming, setRenaming] = React.useState(false);
  const isSelected = selectedNodeId === node.id;
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const isHidden = node.visibility && node.visibility[viewport] === false;

  // Filter check
  const matchesSearch =
    !searchFilter ||
    (node.name && node.name.toLowerCase().includes(searchFilter.toLowerCase())) ||
    node.type.toLowerCase().includes(searchFilter.toLowerCase());

  if (!matchesSearch && !hasChildren) return null;

  return (
    <div className="flex flex-col select-none">
      <div
        onClick={() => setSelectedNodeId(node.id)}
        onMouseEnter={() => setHoveredNodeId(node.id)}
        onMouseLeave={() => setHoveredNodeId(null)}
        draggable={node.type !== 'page-root'}
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('kdba/node-id', node.id);
          e.dataTransfer.setData('kdba/node-type', node.type);
          useV3EditorStore.getState().setDragState(true, node.type, node.id);
        }}
        onDragEnd={() => useV3EditorStore.getState().setDragState(false)}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          const ratio = (e.clientY - rect.top) / Math.max(rect.height, 1);
          const movedType = useV3EditorStore.getState().draggedNodeType;
          const canNest = Boolean(movedType && canAcceptChild(node.type, movedType));
          if (node.type === 'page-root' || (isContainerType(node.type) && canNest && ratio > 0.28 && ratio < 0.72)) {
            setDropHint('inside');
          } else if (ratio < 0.5) {
            setDropHint('before');
          } else {
            setDropHint('after');
          }
        }}
        onDragLeave={() => setDropHint(null)}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const movedId = e.dataTransfer.getData('kdba/node-id');
          const movedType = (e.dataTransfer.getData('kdba/node-type') ||
            useV3EditorStore.getState().draggedNodeType) as NodeType | null;
          const hint = dropHint;
          setDropHint(null);
          if (!movedId || movedId === node.id) return;
          const state = useV3EditorStore.getState();
          if ((hint === 'inside' || node.type === 'page-root') && movedType && canAcceptChild(node.type, movedType)) {
            state.moveNode(movedId, node.id);
            return;
          }
          const parentInfo = state.findParent(node.id);
          if (parentInfo && (!movedType || canAcceptChild(parentInfo.parent.type, movedType))) {
            const index = hint === 'before' ? parentInfo.index : parentInfo.index + 1;
            state.moveNode(movedId, parentInfo.parent.id, index);
          }
        }}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
        className={`group flex items-center justify-between h-8 pr-2 rounded-lg cursor-pointer transition-colors text-xs ${
          isSelected
            ? 'bg-primary text-primary-foreground font-semibold'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        } ${isHidden ? 'opacity-40' : ''} ${
          dropHint === 'before'
            ? 'border-t-2 border-primary'
            : dropHint === 'after'
              ? 'border-b-2 border-primary'
              : dropHint === 'inside'
                ? 'ring-1 ring-primary bg-primary/10'
                : ''
        }`}
      >
        <div className="flex items-center gap-1.5 truncate flex-1">
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-0.5 rounded text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <div className="w-4" />
          )}

          <div className="shrink-0">{NODE_ICONS[node.type] || <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />}</div>

          {renaming ? (
            <input
              autoFocus
              defaultValue={node.name || node.type}
              onClick={(e) => e.stopPropagation()}
              onBlur={(e) => {
                const name = e.target.value.trim();
                if (name) updateNode(node.id, { name });
                setRenaming(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                if (e.key === 'Escape') setRenaming(false);
              }}
              className="h-5 min-w-0 flex-1 rounded bg-background px-1 text-xs text-foreground"
            />
          ) : (
            <span
              className="truncate"
              onDoubleClick={(e) => {
                e.stopPropagation();
                setRenaming(true);
              }}
            >
              {node.name || node.type}
            </span>
          )}
        </div>

        {/* Action icons on hover */}
        <div
          className={`flex items-center gap-1 transition-opacity ${
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          {/* Visibility toggle */}
          <button
            type="button"
            title={isHidden ? 'Show on current device' : 'Hide on current device'}
            onClick={(e) => {
              e.stopPropagation();
              setVisibility(node.id, { [viewport]: isHidden });
            }}
            className="p-1 hover:text-foreground"
          >
            {isHidden ? <EyeOff className="w-3 h-3 text-muted-foreground" /> : <Eye className="w-3 h-3" />}
          </button>

          <button
            type="button"
            title="Rename layer"
            onClick={(e) => {
              e.stopPropagation();
              setRenaming(true);
            }}
            className="p-1 hover:text-foreground"
          >
            <Pencil className="w-3 h-3" />
          </button>

          <button
            type="button"
            title={node.locked ? 'Unlock' : 'Lock'}
            onClick={(e) => {
              e.stopPropagation();
              setNodeLocked(node.id, !node.locked);
            }}
            className="p-1 hover:text-foreground"
          >
            {node.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          </button>

          {/* Duplicate button */}
          <button
            type="button"
            title="Duplicate node"
            onClick={(e) => {
              e.stopPropagation();
              duplicateNode(node.id);
            }}
            className="p-1 hover:text-foreground"
          >
            <Copy className="w-3 h-3" />
          </button>

          {/* Delete button (prevent deleting page-root) */}
          {node.type !== 'page-root' && (
            <button
              type="button"
              title="Delete node"
              onClick={(e) => {
                e.stopPropagation();
                removeNode(node.id);
              }}
              className="p-1 hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Render children recursively */}
      {hasChildren && isExpanded && (
        <div className="flex flex-col">
          {node.children!.map((child) => (
            <TreeItem key={child.id} node={child} depth={depth + 1} searchFilter={searchFilter} />
          ))}
        </div>
      )}
    </div>
  );
}

export function LayersPanel() {
  const { setActiveNavTab, getActivePage, document } = useV3EditorStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  const activePage = getActivePage();

  return (
    <div className="flex h-full w-full min-w-0 shrink-0 flex-col overflow-hidden border-r border-border bg-card z-20 select-none">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-sm text-foreground tracking-tight">Layers</h3>
        </div>
        <button
          type="button"
          onClick={() => setActiveNavTab(null)}
          className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-muted/50 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring"
          />
        </div>
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {document?.global?.headerNode && (
          <div>
            <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Header</p>
            <TreeItem node={document.global.headerNode} depth={0} searchFilter={searchQuery} />
          </div>
        )}
        {activePage?.root ? (
          <div>
            <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Page</p>
            <TreeItem node={activePage.root} depth={0} searchFilter={searchQuery} />
          </div>
        ) : (
          <p className="text-center text-xs text-muted-foreground py-8">No elements on page.</p>
        )}
        {document?.global?.footerNode && (
          <div>
            <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Footer</p>
            <TreeItem node={document.global.footerNode} depth={0} searchFilter={searchQuery} />
          </div>
        )}
      </div>
    </div>
  );
}
