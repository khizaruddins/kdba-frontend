'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { WebsiteNode } from '@/types/v3-document';
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
  Lock,
  Unlock,
  Edit2,
  Check,
} from 'lucide-react';

const NODE_ICONS: Record<string, React.ReactNode> = {
  section: <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />,
  container: <Box className="w-3.5 h-3.5 text-blue-400" />,
  heading: <Heading className="w-3.5 h-3.5 text-amber-400" />,
  paragraph: <Pilcrow className="w-3.5 h-3.5 text-slate-400" />,
  button: <SquarePlay className="w-3.5 h-3.5 text-emerald-400" />,
  image: <ImageIcon className="w-3.5 h-3.5 text-pink-400" />,
  grid: <Grid className="w-3.5 h-3.5 text-purple-400" />,
  row: <Columns className="w-3.5 h-3.5 text-sky-400" />,
  column: <Columns className="w-3.5 h-3.5 text-sky-400" />,
  pricing: <CreditCard className="w-3.5 h-3.5 text-amber-400" />,
  testimonial: <MessageSquareQuote className="w-3.5 h-3.5 text-teal-400" />,
  navbar: <PanelTop className="w-3.5 h-3.5 text-indigo-400" />,
  footer: <PanelBottom className="w-3.5 h-3.5 text-indigo-400" />,
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
    setLock,
    setNodeLabel,
    viewport,
  } = useV3EditorStore();

  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isEditingLabel, setIsEditingLabel] = React.useState(false);
  const [tempLabel, setTempLabel] = React.useState(node.label || node.name || node.type);

  const isSelected = selectedNodeId === node.id;
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const isHidden = node.visibility && node.visibility[viewport] === false;

  const displayLabel = node.label || node.name || node.type;

  // Filter check
  const matchesSearch =
    !searchFilter ||
    (displayLabel && displayLabel.toLowerCase().includes(searchFilter.toLowerCase())) ||
    node.type.toLowerCase().includes(searchFilter.toLowerCase());

  if (!matchesSearch && !hasChildren) return null;

  const handleSaveLabel = () => {
    if (tempLabel.trim()) {
      setNodeLabel(node.id, tempLabel.trim());
    }
    setIsEditingLabel(false);
  };

  return (
    <div className="flex flex-col select-none">
      <div
        onClick={() => setSelectedNodeId(node.id)}
        onMouseEnter={() => setHoveredNodeId(node.id)}
        onMouseLeave={() => setHoveredNodeId(null)}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
        className={`group flex items-center justify-between h-8 pr-2 rounded-lg cursor-pointer transition-colors text-xs ${
          isSelected
            ? 'bg-indigo-600 text-white font-semibold'
            : 'text-slate-300 hover:bg-slate-900 hover:text-white'
        } ${isHidden ? 'opacity-40' : ''}`}
      >
        <div className="flex items-center gap-1.5 truncate flex-1 min-w-0 mr-1">
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-0.5 rounded text-slate-400 hover:text-white shrink-0"
            >
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <div className="w-4 shrink-0" />
          )}

          <div className="shrink-0">{NODE_ICONS[node.type] || <Sparkles className="w-3.5 h-3.5 text-slate-500" />}</div>

          {isEditingLabel ? (
            <div className="flex items-center gap-1 flex-1 mr-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                autoFocus
                value={tempLabel}
                onChange={(e) => setTempLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveLabel();
                  if (e.key === 'Escape') setIsEditingLabel(false);
                }}
                className="w-full px-1 py-0.5 bg-slate-900 border border-indigo-400 rounded text-xs text-white outline-none"
              />
              <button
                type="button"
                onClick={handleSaveLabel}
                className="p-0.5 rounded hover:bg-slate-800 text-emerald-400"
              >
                <Check className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <span
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditingLabel(true);
              }}
              className="truncate flex-1 font-medium"
              title="Double-click to rename"
            >
              {displayLabel}
            </span>
          )}

          {node.locked && (
            <Lock className="w-2.5 h-2.5 text-amber-400 shrink-0 opacity-80" />
          )}
        </div>

        {/* Action icons on hover */}
        <div
          className={`flex items-center gap-0.5 transition-opacity shrink-0 ${
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          {/* Rename label button */}
          {!isEditingLabel && (
            <button
              type="button"
              title="Rename layer"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingLabel(true);
              }}
              className="p-1 hover:text-white text-slate-400"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          )}

          {/* Lock / Unlock */}
          <button
            type="button"
            title={node.locked ? 'Unlock layer' : 'Lock layer'}
            onClick={(e) => {
              e.stopPropagation();
              setLock(node.id, !node.locked);
            }}
            className={`p-1 hover:text-white ${node.locked ? 'text-amber-400' : 'text-slate-400'}`}
          >
            {node.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          </button>

          {/* Visibility toggle */}
          <button
            type="button"
            title={isHidden ? 'Show on current device' : 'Hide on current device'}
            onClick={(e) => {
              e.stopPropagation();
              setVisibility(node.id, { [viewport]: isHidden });
            }}
            className="p-1 hover:text-white text-slate-400"
          >
            {isHidden ? <EyeOff className="w-3 h-3 text-slate-500" /> : <Eye className="w-3 h-3" />}
          </button>

          {/* Duplicate button */}
          <button
            type="button"
            title="Duplicate node"
            disabled={node.locked}
            onClick={(e) => {
              e.stopPropagation();
              duplicateNode(node.id);
            }}
            className={`p-1 hover:text-white ${node.locked ? 'opacity-30 cursor-not-allowed' : 'text-slate-400'}`}
          >
            <Copy className="w-3 h-3" />
          </button>

          {/* Delete button (prevent deleting page-root or locked nodes) */}
          {node.type !== 'page-root' && (
            <button
              type="button"
              title={node.locked ? 'Element is locked' : 'Delete node'}
              disabled={node.locked}
              onClick={(e) => {
                e.stopPropagation();
                removeNode(node.id);
              }}
              className={`p-1 ${node.locked ? 'opacity-30 cursor-not-allowed' : 'hover:text-rose-400 text-slate-400'}`}
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
  const { setActiveNavTab, getActivePage } = useV3EditorStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  const activePage = getActivePage();

  return (
    <div className="w-80 shrink-0 border-r border-slate-800/80 bg-slate-950/95 flex flex-col h-full overflow-hidden select-none z-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-sm text-white tracking-tight">Layers</h3>
        </div>
        <button
          type="button"
          onClick={() => setActiveNavTab(null)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-slate-800/80">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {activePage?.root ? (
          <TreeItem node={activePage.root} depth={0} searchFilter={searchQuery} />
        ) : (
          <p className="text-center text-xs text-slate-500 py-8">No elements on page.</p>
        )}
      </div>
    </div>
  );
}
