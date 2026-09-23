'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { WebsiteNode, ComponentStateKey } from '@/types/v3-document';
import { MediaPickerModal } from '@/components/ui/media-picker-modal';
import { ChangeLayoutModal } from '../modals/ChangeLayoutModal';
import { ReplaceSectionModal } from '../modals/ReplaceSectionModal';
import {
  ArrowUp,
  ArrowDown,
  Plus,
  Copy,
  Trash2,
  Lock,
  Unlock,
  Edit3,
  Image as ImageIcon,
  Sparkles,
  Palette,
  Columns,
  Link2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eye,
  EyeOff,
  MoreHorizontal,
  LayoutTemplate,
  Sliders,
  Maximize2,
  Check,
} from 'lucide-react';

export interface ContextualToolbarProps {
  node: WebsiteNode;
}

const POPULAR_FONTS = ['Inter', 'Sora', 'Urbanist', 'Outfit', 'Roboto', 'Playfair Display'];

export function ContextualToolbar({ node }: ContextualToolbarProps) {
  const {
    findParent,
    moveNode,
    duplicateNode,
    removeNode,
    setLock,
    updateStyles,
    updateProps,
    setVisibility,
    setInlineEditingNodeId,
    setActiveStateMode,
    activeStateMode,
    viewport,
  } = useV3EditorStore();

  const [mediaPickerOpen, setMediaPickerOpen] = React.useState(false);
  const [changeLayoutOpen, setChangeLayoutOpen] = React.useState(false);
  const [replaceSectionOpen, setReplaceSectionOpen] = React.useState(false);
  const [fontMenuOpen, setFontMenuOpen] = React.useState(false);
  const [alignMenuOpen, setAlignMenuOpen] = React.useState(false);

  const parentInfo = findParent(node.id);
  const isHidden = Boolean(node.visibility && node.visibility[viewport] === false);
  const isLocked = Boolean(node.locked);

  const isTextNode = ['heading', 'paragraph', 'text', 'quote', 'badge'].includes(node.type);
  const isImageNode = node.type === 'image';
  const isButtonNode = node.type === 'button';
  const isGridNode = node.type === 'grid';
  const isSectionNode = node.type === 'section';

  // ─── SECTION TOOLBAR ────────────────────────────────────────────────────────
  if (isSectionNode) {
    return (
      <>
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-0.5 p-1 rounded-xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-md text-slate-300 text-xs"
        >
          {/* Section Type Label */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wide mr-1 shadow-sm">
            <Maximize2 className="w-3 h-3" />
            <span>{node.label || node.name || 'Section'}</span>
          </div>

          {/* Move Up/Down */}
          {parentInfo && parentInfo.index > 0 && (
            <button
              type="button"
              onClick={() => moveNode(node.id, parentInfo.parent.id, parentInfo.index - 1)}
              title="Move Section Up"
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          )}

          {parentInfo && parentInfo.parent.children && parentInfo.index < parentInfo.parent.children.length - 1 && (
            <button
              type="button"
              onClick={() => moveNode(node.id, parentInfo.parent.id, parentInfo.index + 1)}
              title="Move Section Down"
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />

          {/* Change Layout */}
          <button
            type="button"
            onClick={() => setChangeLayoutOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-medium"
            title="Change section layout architecture"
          >
            <Columns className="w-3.5 h-3.5 text-indigo-400" />
            <span>Change Layout</span>
          </button>

          {/* Replace Section Variant */}
          <button
            type="button"
            onClick={() => setReplaceSectionOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-medium"
            title="Replace with compatible section variant"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-indigo-400" />
            <span>Replace</span>
          </button>

          {/* Background Quick Trigger */}
          <button
            type="button"
            onClick={() => {
              const bgSection = window.document.querySelector('[data-inspector-section="background"]') as HTMLElement;
              if (bgSection) bgSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs"
            title="Edit section background"
          >
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            <span>Background</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />

          {/* Duplicate */}
          <button
            type="button"
            onClick={() => duplicateNode(node.id)}
            title="Duplicate Section"
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {/* Lock / Unlock */}
          <button
            type="button"
            onClick={() => setLock(node.id, !isLocked)}
            title={isLocked ? 'Unlock Section' : 'Lock Section'}
            className={`p-1.5 rounded-lg transition-colors ${
              isLocked ? 'bg-amber-500/20 text-amber-300' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>

          {/* Hide/Show on Device */}
          <button
            type="button"
            onClick={() => setVisibility(node.id, { [viewport]: isHidden })}
            title={isHidden ? 'Show on current device' : 'Hide on current device'}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            {isHidden ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5" />}
          </button>

          {/* Delete */}
          {!isLocked && (
            <button
              type="button"
              onClick={() => removeNode(node.id)}
              title="Delete Section"
              className="p-1.5 rounded-lg hover:bg-rose-950/60 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Modals for Section */}
        <ChangeLayoutModal
          isOpen={changeLayoutOpen}
          onClose={() => setChangeLayoutOpen(false)}
          sectionId={node.id}
        />

        <ReplaceSectionModal
          isOpen={replaceSectionOpen}
          onClose={() => setReplaceSectionOpen(false)}
          sectionId={node.id}
        />
      </>
    );
  }

  // ─── TEXT TOOLBAR ───────────────────────────────────────────────────────────
  if (isTextNode) {
    const currentFont = node.styles?.typography?.fontFamily || 'Inter';
    const currentSize = parseInt(String(node.styles?.typography?.fontSize || '16'), 10);
    const currentColor = node.styles?.typography?.color || '#FFFFFF';

    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-md text-slate-300 text-xs"
      >
        {/* Edit Button */}
        <button
          type="button"
          onClick={() => setInlineEditingNodeId(node.id)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm transition-colors"
          title="Edit text inline"
        >
          <Edit3 className="w-3 h-3" />
          <span>Edit</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />

        {/* Font Family Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setFontMenuOpen(!fontMenuOpen)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-900 text-slate-200 text-xs border border-transparent hover:border-slate-800"
            title="Change font family"
          >
            <span>{currentFont}</span>
          </button>

          {fontMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-36 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl p-1 z-50 flex flex-col gap-0.5">
              {POPULAR_FONTS.map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => {
                    updateStyles(node.id, { typography: { fontFamily: font } });
                    setFontMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors ${
                    currentFont === font ? 'bg-indigo-600 text-white font-semibold' : 'hover:bg-slate-900 text-slate-300'
                  }`}
                  style={{ fontFamily: font }}
                >
                  <span>{font}</span>
                  {currentFont === font && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font Size Quick Increments */}
        <div className="flex items-center gap-0.5 bg-slate-900 rounded-lg p-0.5 border border-slate-800">
          <button
            type="button"
            onClick={() => updateStyles(node.id, { typography: { fontSize: `${Math.max(12, currentSize - 2)}px` } })}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold"
            title="Decrease size"
          >
            -
          </button>
          <span className="text-[11px] font-mono px-1 min-w-[28px] text-center text-slate-200">
            {currentSize}px
          </span>
          <button
            type="button"
            onClick={() => updateStyles(node.id, { typography: { fontSize: `${Math.min(96, currentSize + 2)}px` } })}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold"
            title="Increase size"
          >
            +
          </button>
        </div>

        {/* Color Swatch Trigger */}
        <div className="relative flex items-center">
          <input
            type="color"
            value={currentColor.startsWith('#') && currentColor.length === 7 ? currentColor : '#FFFFFF'}
            onChange={(e) => updateStyles(node.id, { typography: { color: e.target.value } })}
            className="w-6 h-6 rounded-md cursor-pointer border border-slate-800 bg-transparent p-0"
            title="Change text color"
          />
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-0.5 bg-slate-900 rounded-lg p-0.5 border border-slate-800">
          <button
            type="button"
            onClick={() => updateStyles(node.id, { typography: { textAlign: 'left' } })}
            className={`p-1 rounded ${node.styles?.typography?.textAlign === 'left' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => updateStyles(node.id, { typography: { textAlign: 'center' } })}
            className={`p-1 rounded ${node.styles?.typography?.textAlign === 'center' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => updateStyles(node.id, { typography: { textAlign: 'right' } })}
            className={`p-1 rounded ${node.styles?.typography?.textAlign === 'right' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />

        {/* Duplicate & Delete */}
        <button
          type="button"
          onClick={() => duplicateNode(node.id)}
          title="Duplicate text"
          className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        {!isLocked && (
          <button
            type="button"
            onClick={() => removeNode(node.id)}
            title="Delete text"
            className="p-1.5 rounded-lg hover:bg-rose-950/60 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  // ─── IMAGE TOOLBAR ──────────────────────────────────────────────────────────
  if (isImageNode) {
    const objectFit = (node.props?.objectFit as string) || 'cover';
    const currentRadius = parseInt(String(node.styles?.border?.radius?.all || '0'), 10);

    return (
      <>
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-md text-slate-300 text-xs"
        >
          {/* 1-Click Replace Button */}
          <button
            type="button"
            onClick={() => setMediaPickerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm transition-colors"
            title="Replace image from Media Library"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Replace</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />

          {/* Fit Toggle (Cover vs Contain) */}
          <button
            type="button"
            onClick={() => updateProps(node.id, { objectFit: objectFit === 'cover' ? 'contain' : 'cover' })}
            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-medium"
            title="Toggle Image Fit"
          >
            Fit: {objectFit}
          </button>

          {/* Corner Radius Toggle */}
          <button
            type="button"
            onClick={() => {
              const nextRadius = currentRadius === 0 ? '12px' : currentRadius === 12 ? '24px' : currentRadius === 24 ? '9999px' : '0px';
              updateStyles(node.id, { border: { radius: { all: nextRadius } } });
            }}
            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs"
            title="Cycle corner radius"
          >
            Radius: {currentRadius === 9999 ? 'Circle' : `${currentRadius}px`}
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />

          {/* Duplicate & Delete */}
          <button
            type="button"
            onClick={() => duplicateNode(node.id)}
            title="Duplicate image"
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {!isLocked && (
            <button
              type="button"
              onClick={() => removeNode(node.id)}
              title="Delete image"
              className="p-1.5 rounded-lg hover:bg-rose-950/60 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Media Picker Modal */}
        <MediaPickerModal
          isOpen={mediaPickerOpen}
          onClose={() => setMediaPickerOpen(false)}
          onSelect={(url) => {
            updateProps(node.id, { src: url, url });
          }}
        />
      </>
    );
  }

  // ─── BUTTON TOOLBAR ─────────────────────────────────────────────────────────
  if (isButtonNode) {
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-md text-slate-300 text-xs"
      >
        {/* Edit Button Label */}
        <button
          type="button"
          onClick={() => setInlineEditingNodeId(node.id)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm transition-colors"
          title="Edit button text"
        >
          <Edit3 className="w-3 h-3" />
          <span>Edit</span>
        </button>

        {/* Link / URL input trigger */}
        <button
          type="button"
          onClick={() => {
            const newHref = prompt('Enter link URL (e.g. /contact or https://...):', String(node.props?.href || '#'));
            if (newHref !== null) {
              updateProps(node.id, { href: newHref });
            }
          }}
          className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Change button link"
        >
          <Link2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Link</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />

        {/* State Toggle: Default vs Hover */}
        <div className="flex items-center gap-0.5 bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-[11px]">
          {(['default', 'hover'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setActiveStateMode(mode)}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                activeStateMode === mode ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />

        {/* Duplicate & Delete */}
        <button
          type="button"
          onClick={() => duplicateNode(node.id)}
          title="Duplicate button"
          className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        {!isLocked && (
          <button
            type="button"
            onClick={() => removeNode(node.id)}
            title="Delete button"
            className="p-1.5 rounded-lg hover:bg-rose-950/60 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  // ─── GRID TOOLBAR ───────────────────────────────────────────────────────────
  if (isGridNode) {
    const currentCols = Number(node.styles?.grid?.columns) || 3;

    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-md text-slate-300 text-xs"
      >
        <span className="text-[10px] uppercase font-bold text-slate-500 px-1.5">Cols:</span>
        <div className="flex items-center gap-0.5 bg-slate-900 rounded-lg p-0.5 border border-slate-800">
          {[1, 2, 3, 4, 6].map((cols) => (
            <button
              key={cols}
              type="button"
              onClick={() => updateStyles(node.id, { grid: { columns: cols } })}
              className={`w-5 h-5 flex items-center justify-center rounded text-xs font-semibold transition-colors ${
                currentCols === cols ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {cols}
            </button>
          ))}
        </div>

        <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />

        {/* Duplicate & Delete */}
        <button
          type="button"
          onClick={() => duplicateNode(node.id)}
          title="Duplicate grid"
          className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        {!isLocked && (
          <button
            type="button"
            onClick={() => removeNode(node.id)}
            title="Delete grid"
            className="p-1.5 rounded-lg hover:bg-rose-950/60 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  // ─── GENERIC TOOLBAR (CONTAINER, ROW, COLUMN, STACK, BUSINESS) ──────────────
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex items-center gap-0.5 p-1 rounded-xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-md text-slate-300 text-xs"
    >
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wide mr-1 shadow-sm">
        <span>{node.label || node.name || node.type}</span>
      </div>

      {parentInfo && parentInfo.index > 0 && (
        <button
          type="button"
          onClick={() => moveNode(node.id, parentInfo.parent.id, parentInfo.index - 1)}
          title="Move Up"
          className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      )}

      {parentInfo && parentInfo.parent.children && parentInfo.index < parentInfo.parent.children.length - 1 && (
        <button
          type="button"
          onClick={() => moveNode(node.id, parentInfo.parent.id, parentInfo.index + 1)}
          title="Move Down"
          className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      )}

      <button
        type="button"
        onClick={() => duplicateNode(node.id)}
        title="Duplicate element"
        className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => setLock(node.id, !isLocked)}
        title={isLocked ? 'Unlock Element' : 'Lock Element'}
        className={`p-1.5 rounded-lg transition-colors ${
          isLocked ? 'bg-amber-500/20 text-amber-300' : 'hover:bg-slate-800 hover:text-white'
        }`}
      >
        {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
      </button>

      {!isLocked && (
        <button
          type="button"
          onClick={() => removeNode(node.id)}
          title="Delete element"
          className="p-1.5 rounded-lg hover:bg-rose-950/60 hover:text-rose-400 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
