'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { WebsiteNode, AnimationPreset } from '@/types/v3-document';
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
  AlignJustify,
  Eye,
  EyeOff,
  MoreHorizontal,
  LayoutTemplate,
  Check,
  Play,
  Maximize2,
  Crop,
  Layers,
} from 'lucide-react';

export interface ContextualToolbarProps {
  node: WebsiteNode;
}

const POPULAR_FONTS = [
  'Inter',
  'Plus Jakarta Sans',
  'Sora',
  'Urbanist',
  'Outfit',
  'Roboto',
  'Playfair Display',
  'Geist',
];

const ANIMATION_PRESETS: { id: AnimationPreset; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'fade', label: 'Fade' },
  { id: 'fade-up', label: 'Fade Up' },
  { id: 'fade-down', label: 'Fade Down' },
  { id: 'fade-left', label: 'Fade Left' },
  { id: 'fade-right', label: 'Fade Right' },
  { id: 'scale', label: 'Scale Up' },
  { id: 'slide', label: 'Slide' },
  { id: 'blur-in', label: 'Blur In' },
];

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
    updateAnimation,
    setAnimationPreview,
    focusInspectorSection,
    addSectionAbove,
    addSectionBelow,
  } = useV3EditorStore();

  const [mediaPickerOpen, setMediaPickerOpen] = React.useState(false);
  const [bgMediaPickerOpen, setBgMediaPickerOpen] = React.useState(false);
  const [changeLayoutOpen, setChangeLayoutOpen] = React.useState(false);
  const [replaceSectionOpen, setReplaceSectionOpen] = React.useState(false);

  // Menus
  const [fontMenuOpen, setFontMenuOpen] = React.useState(false);
  const [weightMenuOpen, setWeightMenuOpen] = React.useState(false);
  const [lineHeightMenuOpen, setLineHeightMenuOpen] = React.useState(false);
  const [animMenuOpen, setAnimMenuOpen] = React.useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = React.useState(false);
  const [cropMenuOpen, setCropMenuOpen] = React.useState(false);
  const [styleMenuOpen, setStyleMenuOpen] = React.useState(false);

  const parentInfo = findParent(node.id);
  const isHidden = Boolean(node.visibility && node.visibility[viewport] === false);
  const isLocked = Boolean(node.locked);

  const isHeadingNode = node.type === 'heading';
  const isParagraphNode = ['paragraph', 'text', 'rich-text', 'quote'].includes(node.type);
  const isImageNode = node.type === 'image';
  const isButtonNode = node.type === 'button';
  const isGridNode = node.type === 'grid';
  const isSectionNode = node.type === 'section';

  const triggerAnimationPreview = (preset: AnimationPreset) => {
    updateAnimation(node.id, { preset, duration: node.animations?.duration ?? 600 });
    setAnimationPreview(node.id);
    setTimeout(() => {
      setAnimationPreview(null);
    }, (node.animations?.duration ?? 600) + 300);
  };

  const closeAllMenus = () => {
    setFontMenuOpen(false);
    setWeightMenuOpen(false);
    setLineHeightMenuOpen(false);
    setAnimMenuOpen(false);
    setMoreMenuOpen(false);
    setCropMenuOpen(false);
    setStyleMenuOpen(false);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. HEADING TOOLBAR
  // Edit, Font, Size, Weight, Color, Alignment, Animation, More
  // ─────────────────────────────────────────────────────────────────────────────
  if (isHeadingNode) {
    const currentFont = node.styles?.typography?.fontFamily || 'Inter';
    const currentSize = parseInt(String(node.styles?.typography?.fontSize || '36'), 10);
    const currentWeight = String(node.styles?.typography?.fontWeight || '700');
    const currentColor = node.styles?.typography?.color || '#FFFFFF';
    const currentAnim = node.animations?.preset || 'none';

    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-1 p-1 rounded-xl bg-card/95 border border-border shadow-2xl backdrop-blur-md text-foreground text-xs select-none"
      >
        {/* Edit */}
        <button
          type="button"
          onClick={() => setInlineEditingNodeId(node.id)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm transition-colors"
          title="Edit text inline"
        >
          <Edit3 className="w-3 h-3" />
          <span>Edit</span>
        </button>

        <div className="h-4 w-[1px] bg-border mx-0.5" />

        {/* Font Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setFontMenuOpen(!fontMenuOpen);
              setWeightMenuOpen(false);
              setAnimMenuOpen(false);
              setMoreMenuOpen(false);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-muted text-foreground text-xs font-medium border border-transparent hover:border-border"
            title="Change font family"
          >
            <span className="truncate max-w-[80px]">{currentFont}</span>
          </button>
          {fontMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-40 rounded-xl bg-popover border border-border shadow-2xl p-1 z-50 flex flex-col gap-0.5">
              {POPULAR_FONTS.map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => {
                    updateStyles(node.id, { typography: { fontFamily: font } });
                    setFontMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors ${
                    currentFont === font ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted text-foreground'
                  }`}
                  style={{ fontFamily: font }}
                >
                  <span className="truncate">{font}</span>
                  {currentFont === font && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Size +/- */}
        <div className="flex items-center gap-0.5 bg-muted/60 rounded-lg p-0.5 border border-border">
          <button
            type="button"
            onClick={() => updateStyles(node.id, { typography: { fontSize: `${Math.max(14, currentSize - 2)}px` } })}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-bold"
            title="Decrease size"
          >
            -
          </button>
          <span className="text-[11px] font-mono px-1 min-w-[28px] text-center text-foreground font-semibold">
            {currentSize}px
          </span>
          <button
            type="button"
            onClick={() => updateStyles(node.id, { typography: { fontSize: `${Math.min(120, currentSize + 2)}px` } })}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-bold"
            title="Increase size"
          >
            +
          </button>
        </div>

        {/* Weight Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setWeightMenuOpen(!weightMenuOpen);
              setFontMenuOpen(false);
              setAnimMenuOpen(false);
              setMoreMenuOpen(false);
            }}
            className="px-2 py-1 rounded-lg bg-muted/60 border border-border hover:bg-muted text-foreground text-xs font-medium"
            title="Font weight"
          >
            {currentWeight === '400' ? 'Regular' : currentWeight === '500' ? 'Medium' : currentWeight === '600' ? 'Semi' : currentWeight === '800' ? 'Black' : 'Bold'}
          </button>
          {weightMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-28 rounded-xl bg-popover border border-border shadow-2xl p-1 z-50 flex flex-col gap-0.5">
              {[
                { label: 'Regular', val: '400' },
                { label: 'Medium', val: '500' },
                { label: 'Semi Bold', val: '600' },
                { label: 'Bold', val: '700' },
                { label: 'Extra Bold', val: '800' },
              ].map((w) => (
                <button
                  key={w.val}
                  type="button"
                  onClick={() => {
                    updateStyles(node.id, { typography: { fontWeight: w.val } });
                    setWeightMenuOpen(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs text-left ${
                    currentWeight === w.val ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted text-foreground'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color */}
        <div className="relative flex items-center">
          <input
            type="color"
            value={currentColor.startsWith('#') && currentColor.length === 7 ? currentColor : '#FFFFFF'}
            onChange={(e) => updateStyles(node.id, { typography: { color: e.target.value } })}
            className="w-6 h-6 rounded-md cursor-pointer border border-border bg-transparent p-0"
            title="Text color"
          />
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-0.5 bg-muted/60 rounded-lg p-0.5 border border-border">
          <button
            type="button"
            onClick={() => updateStyles(node.id, { typography: { textAlign: 'left' } })}
            className={`p-1 rounded ${node.styles?.typography?.textAlign === 'left' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => updateStyles(node.id, { typography: { textAlign: 'center' } })}
            className={`p-1 rounded ${node.styles?.typography?.textAlign === 'center' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => updateStyles(node.id, { typography: { textAlign: 'right' } })}
            className={`p-1 rounded ${node.styles?.typography?.textAlign === 'right' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Animation */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setAnimMenuOpen(!animMenuOpen);
              setFontMenuOpen(false);
              setWeightMenuOpen(false);
              setMoreMenuOpen(false);
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-medium transition-colors ${
              currentAnim !== 'none'
                ? 'bg-primary/20 text-primary border-primary/40'
                : 'bg-muted/60 border-border hover:bg-muted text-foreground'
            }`}
            title="Animation"
          >
            <Sparkles className="w-3 h-3 text-primary" />
            <span>{currentAnim !== 'none' ? currentAnim : 'Anim'}</span>
          </button>
          {animMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-36 rounded-xl bg-popover border border-border shadow-2xl p-1 z-50 flex flex-col gap-0.5">
              {ANIMATION_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    triggerAnimationPreview(preset.id);
                    setAnimMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left ${
                    currentAnim === preset.id ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <span>{preset.label}</span>
                  {currentAnim === preset.id && <Play className="w-2.5 h-2.5 fill-current" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-4 w-[1px] bg-border mx-0.5" />

        {/* More */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setMoreMenuOpen(!moreMenuOpen);
              setFontMenuOpen(false);
              setWeightMenuOpen(false);
              setAnimMenuOpen(false);
            }}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="More actions"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
          {moreMenuOpen && (
            <div className="absolute top-full right-0 mt-1 w-44 rounded-xl bg-popover border border-border shadow-2xl p-1.5 z-50 flex flex-col gap-1 text-xs">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                Heading Tag
              </div>
              <div className="grid grid-cols-4 gap-1 p-1">
                {[1, 2, 3, 4].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      updateProps(node.id, { level: lvl });
                      setMoreMenuOpen(false);
                    }}
                    className={`py-1 rounded font-bold text-center text-xs ${
                      Number(node.props?.level || 2) === lvl ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    H{lvl}
                  </button>
                ))}
              </div>
              <div className="h-[1px] bg-border my-0.5" />
              <button
                type="button"
                onClick={() => {
                  duplicateNode(node.id);
                  setMoreMenuOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-left"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Duplicate</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLock(node.id, !isLocked);
                  setMoreMenuOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-left"
              >
                {isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{isLocked ? 'Unlock' : 'Lock'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  focusInspectorSection('typography');
                  setMoreMenuOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted text-primary text-left"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Advanced Inspector</span>
              </button>
              {!isLocked && (
                <button
                  type="button"
                  onClick={() => {
                    removeNode(node.id);
                    setMoreMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-destructive/20 text-destructive text-left"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. PARAGRAPH TOOLBAR
  // Edit, Font, Size, Line Height, Color, Alignment, Animation, More
  // ─────────────────────────────────────────────────────────────────────────────
  if (isParagraphNode) {
    const currentFont = node.styles?.typography?.fontFamily || 'Inter';
    const currentSize = parseInt(String(node.styles?.typography?.fontSize || '16'), 10);
    const currentLineHeight = String(node.styles?.typography?.lineHeight || '1.6');
    const currentColor = node.styles?.typography?.color || '#94A3B8';
    const currentAnim = node.animations?.preset || 'none';

    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-1 p-1 rounded-xl bg-card/95 border border-border shadow-2xl backdrop-blur-md text-foreground text-xs select-none"
      >
        {/* Edit */}
        <button
          type="button"
          onClick={() => setInlineEditingNodeId(node.id)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm transition-colors"
          title="Edit text inline"
        >
          <Edit3 className="w-3 h-3" />
          <span>Edit</span>
        </button>

        <div className="h-4 w-[1px] bg-border mx-0.5" />

        {/* Font Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setFontMenuOpen(!fontMenuOpen);
              setLineHeightMenuOpen(false);
              setAnimMenuOpen(false);
              setMoreMenuOpen(false);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-muted text-foreground text-xs font-medium border border-transparent hover:border-border"
            title="Change font family"
          >
            <span className="truncate max-w-[80px]">{currentFont}</span>
          </button>
          {fontMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-40 rounded-xl bg-popover border border-border shadow-2xl p-1 z-50 flex flex-col gap-0.5">
              {POPULAR_FONTS.map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => {
                    updateStyles(node.id, { typography: { fontFamily: font } });
                    setFontMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left ${
                    currentFont === font ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted text-foreground'
                  }`}
                  style={{ fontFamily: font }}
                >
                  <span className="truncate">{font}</span>
                  {currentFont === font && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Size +/- */}
        <div className="flex items-center gap-0.5 bg-muted/60 rounded-lg p-0.5 border border-border">
          <button
            type="button"
            onClick={() => updateStyles(node.id, { typography: { fontSize: `${Math.max(12, currentSize - 1)}px` } })}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-bold"
            title="Decrease size"
          >
            -
          </button>
          <span className="text-[11px] font-mono px-1 min-w-[28px] text-center text-foreground font-semibold">
            {currentSize}px
          </span>
          <button
            type="button"
            onClick={() => updateStyles(node.id, { typography: { fontSize: `${Math.min(64, currentSize + 1)}px` } })}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-bold"
            title="Increase size"
          >
            +
          </button>
        </div>

        {/* Line Height */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setLineHeightMenuOpen(!lineHeightMenuOpen);
              setFontMenuOpen(false);
              setAnimMenuOpen(false);
              setMoreMenuOpen(false);
            }}
            className="px-2 py-1 rounded-lg bg-muted/60 border border-border hover:bg-muted text-foreground text-xs font-medium"
            title="Line height"
          >
            LH: {currentLineHeight}
          </button>
          {lineHeightMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-28 rounded-xl bg-popover border border-border shadow-2xl p-1 z-50 flex flex-col gap-0.5">
              {[
                { label: 'Tight (1.2)', val: '1.2' },
                { label: 'Normal (1.4)', val: '1.4' },
                { label: 'Relaxed (1.6)', val: '1.6' },
                { label: 'Loose (2.0)', val: '2.0' },
              ].map((lh) => (
                <button
                  key={lh.val}
                  type="button"
                  onClick={() => {
                    updateStyles(node.id, { typography: { lineHeight: lh.val } });
                    setLineHeightMenuOpen(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs text-left ${
                    currentLineHeight === lh.val ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted text-foreground'
                  }`}
                >
                  {lh.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color */}
        <div className="relative flex items-center">
          <input
            type="color"
            value={currentColor.startsWith('#') && currentColor.length === 7 ? currentColor : '#94A3B8'}
            onChange={(e) => updateStyles(node.id, { typography: { color: e.target.value } })}
            className="w-6 h-6 rounded-md cursor-pointer border border-border bg-transparent p-0"
            title="Text color"
          />
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-0.5 bg-muted/60 rounded-lg p-0.5 border border-border">
          <button
            type="button"
            onClick={() => updateStyles(node.id, { typography: { textAlign: 'left' } })}
            className={`p-1 rounded ${node.styles?.typography?.textAlign === 'left' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => updateStyles(node.id, { typography: { textAlign: 'center' } })}
            className={`p-1 rounded ${node.styles?.typography?.textAlign === 'center' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => updateStyles(node.id, { typography: { textAlign: 'right' } })}
            className={`p-1 rounded ${node.styles?.typography?.textAlign === 'right' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Animation */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setAnimMenuOpen(!animMenuOpen);
              setFontMenuOpen(false);
              setLineHeightMenuOpen(false);
              setMoreMenuOpen(false);
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-medium transition-colors ${
              currentAnim !== 'none'
                ? 'bg-primary/20 text-primary border-primary/40'
                : 'bg-muted/60 border-border hover:bg-muted text-foreground'
            }`}
            title="Animation"
          >
            <Sparkles className="w-3 h-3 text-primary" />
            <span>{currentAnim !== 'none' ? currentAnim : 'Anim'}</span>
          </button>
          {animMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-36 rounded-xl bg-popover border border-border shadow-2xl p-1 z-50 flex flex-col gap-0.5">
              {ANIMATION_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    triggerAnimationPreview(preset.id);
                    setAnimMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left ${
                    currentAnim === preset.id ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <span>{preset.label}</span>
                  {currentAnim === preset.id && <Play className="w-2.5 h-2.5 fill-current" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-4 w-[1px] bg-border mx-0.5" />

        {/* More */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setMoreMenuOpen(!moreMenuOpen);
              setFontMenuOpen(false);
              setLineHeightMenuOpen(false);
              setAnimMenuOpen(false);
            }}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="More actions"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
          {moreMenuOpen && (
            <div className="absolute top-full right-0 mt-1 w-44 rounded-xl bg-popover border border-border shadow-2xl p-1.5 z-50 flex flex-col gap-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  duplicateNode(node.id);
                  setMoreMenuOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-left"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Duplicate</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLock(node.id, !isLocked);
                  setMoreMenuOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-left"
              >
                {isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{isLocked ? 'Unlock' : 'Lock'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  focusInspectorSection('typography');
                  setMoreMenuOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted text-primary text-left"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Advanced Inspector</span>
              </button>
              {!isLocked && (
                <button
                  type="button"
                  onClick={() => {
                    removeNode(node.id);
                    setMoreMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-destructive/20 text-destructive text-left"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. IMAGE TOOLBAR
  // Replace, Crop, Position, Fit, Opacity, Radius, Animation, More
  // ─────────────────────────────────────────────────────────────────────────────
  if (isImageNode) {
    const objectFit = (node.props?.objectFit as string) || 'cover';
    const objectPosition = (node.props?.objectPosition as string) || 'center';
    const currentRadius = parseInt(String(node.styles?.border?.radius?.all || '0'), 10);
    const currentOpacity = node.styles?.effects?.opacity ?? 1;
    const currentCrop = (node.styles?.size?.aspectRatio as string) || 'auto';
    const currentAnim = node.animations?.preset || 'none';

    return (
      <>
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 p-1 rounded-xl bg-card/95 border border-border shadow-2xl backdrop-blur-md text-foreground text-xs select-none"
        >
          {/* Replace */}
          <button
            type="button"
            onClick={() => setMediaPickerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm transition-colors"
            title="Replace image from Media Library"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Replace</span>
          </button>

          <div className="h-4 w-[1px] bg-border mx-0.5" />

          {/* Crop (Aspect Ratio) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setCropMenuOpen(!cropMenuOpen);
                setAnimMenuOpen(false);
                setMoreMenuOpen(false);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/60 border border-border hover:bg-muted text-foreground text-xs font-medium"
              title="Crop / Aspect ratio"
            >
              <Crop className="w-3 h-3 text-muted-foreground" />
              <span>{currentCrop === 'auto' ? 'Crop' : currentCrop}</span>
            </button>
            {cropMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-32 rounded-xl bg-popover border border-border shadow-2xl p-1 z-50 flex flex-col gap-0.5">
                {[
                  { label: 'Free (Auto)', val: 'auto' },
                  { label: '1:1 Square', val: '1/1' },
                  { label: '16:9 Cinema', val: '16/9' },
                  { label: '4:3 Classic', val: '4/3' },
                  { label: '9:16 Story', val: '9/16' },
                ].map((c) => (
                  <button
                    key={c.val}
                    type="button"
                    onClick={() => {
                      updateStyles(node.id, { size: { ...node.styles?.size, aspectRatio: c.val === 'auto' ? undefined : c.val } });
                      setCropMenuOpen(false);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs text-left ${
                      currentCrop === c.val ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Position */}
          <button
            type="button"
            onClick={() => {
              const nextPos = objectPosition === 'center' ? 'top' : objectPosition === 'top' ? 'bottom' : 'center';
              updateProps(node.id, { objectPosition: nextPos });
            }}
            className="px-2 py-1 rounded-lg bg-muted/60 border border-border hover:bg-muted text-foreground text-xs font-medium"
            title="Image focal position"
          >
            Pos: {objectPosition}
          </button>

          {/* Fit Toggle */}
          <button
            type="button"
            onClick={() => updateProps(node.id, { objectFit: objectFit === 'cover' ? 'contain' : 'cover' })}
            className="px-2 py-1 rounded-lg bg-muted/60 border border-border hover:bg-muted text-foreground text-xs font-medium"
            title="Toggle Image Fit"
          >
            Fit: {objectFit}
          </button>

          {/* Opacity */}
          <button
            type="button"
            onClick={() => {
              const nextOpacity = currentOpacity === 1 ? 0.8 : currentOpacity === 0.8 ? 0.5 : 1;
              updateStyles(node.id, { effects: { ...node.styles?.effects, opacity: nextOpacity } });
            }}
            className="px-2 py-1 rounded-lg bg-muted/60 border border-border hover:bg-muted text-foreground text-xs font-medium"
            title="Image opacity"
          >
            {Math.round(currentOpacity * 100)}%
          </button>

          {/* Corner Radius */}
          <button
            type="button"
            onClick={() => {
              const nextRadius = currentRadius === 0 ? '8px' : currentRadius === 8 ? '16px' : currentRadius === 16 ? '9999px' : '0px';
              updateStyles(node.id, { border: { radius: { all: nextRadius } } });
            }}
            className="px-2 py-1 rounded-lg bg-muted/60 border border-border hover:bg-muted text-foreground text-xs font-medium"
            title="Corner radius"
          >
            Radius: {currentRadius === 9999 ? 'Circle' : `${currentRadius}px`}
          </button>

          {/* Animation */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setAnimMenuOpen(!animMenuOpen);
                setCropMenuOpen(false);
                setMoreMenuOpen(false);
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-medium transition-colors ${
                currentAnim !== 'none'
                  ? 'bg-primary/20 text-primary border-primary/40'
                  : 'bg-muted/60 border-border hover:bg-muted text-foreground'
              }`}
              title="Animation"
            >
              <Sparkles className="w-3 h-3 text-primary" />
              <span>{currentAnim !== 'none' ? currentAnim : 'Anim'}</span>
            </button>
            {animMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-36 rounded-xl bg-popover border border-border shadow-2xl p-1 z-50 flex flex-col gap-0.5">
                {ANIMATION_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      triggerAnimationPreview(preset.id);
                      setAnimMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left ${
                      currentAnim === preset.id ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <span>{preset.label}</span>
                    {currentAnim === preset.id && <Play className="w-2.5 h-2.5 fill-current" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-4 w-[1px] bg-border mx-0.5" />

          {/* More */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setMoreMenuOpen(!moreMenuOpen);
                setCropMenuOpen(false);
                setAnimMenuOpen(false);
              }}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="More actions"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
            {moreMenuOpen && (
              <div className="absolute top-full right-0 mt-1 w-44 rounded-xl bg-popover border border-border shadow-2xl p-1.5 z-50 flex flex-col gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    const alt = prompt('Enter image alt text (SEO & Accessibility):', String(node.props?.alt || ''));
                    if (alt !== null) updateProps(node.id, { alt });
                    setMoreMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-left"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Alt Text (SEO)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    duplicateNode(node.id);
                    setMoreMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-left"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicate</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLock(node.id, !isLocked);
                    setMoreMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-left"
                >
                  {isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{isLocked ? 'Unlock' : 'Lock'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    focusInspectorSection('content');
                    setMoreMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted text-primary text-left"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Advanced Inspector</span>
                </button>
                {!isLocked && (
                  <button
                    type="button"
                    onClick={() => {
                      removeNode(node.id);
                      setMoreMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-destructive/20 text-destructive text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

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

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. BUTTON TOOLBAR
  // Edit, Link, Style, Hover, Animation, More
  // ─────────────────────────────────────────────────────────────────────────────
  if (isButtonNode) {
    const currentVariant = (node.props?.variant as string) || 'default';
    const currentAnim = node.animations?.preset || 'none';

    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-1 p-1 rounded-xl bg-card/95 border border-border shadow-2xl backdrop-blur-md text-foreground text-xs select-none"
      >
        {/* Edit Button Text */}
        <button
          type="button"
          onClick={() => setInlineEditingNodeId(node.id)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm transition-colors"
          title="Edit button text inline"
        >
          <Edit3 className="w-3 h-3" />
          <span>Edit</span>
        </button>

        {/* Link / URL */}
        <button
          type="button"
          onClick={() => {
            const newHref = prompt('Enter link URL (e.g. #pricing, /contact, or https://...):', String(node.props?.href || '#'));
            if (newHref !== null) {
              updateProps(node.id, { href: newHref });
            }
          }}
          className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-muted text-foreground transition-colors"
          title="Change button link target"
        >
          <Link2 className="w-3.5 h-3.5 text-primary" />
          <span>Link</span>
        </button>

        {/* Style Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setStyleMenuOpen(!styleMenuOpen);
              setAnimMenuOpen(false);
              setMoreMenuOpen(false);
            }}
            className="px-2 py-1 rounded-lg bg-muted/60 border border-border hover:bg-muted text-foreground text-xs font-medium capitalize"
            title="Button visual style"
          >
            Style: {currentVariant}
          </button>
          {styleMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-32 rounded-xl bg-popover border border-border shadow-2xl p-1 z-50 flex flex-col gap-0.5">
              {[
                { id: 'default', label: 'Primary' },
                { id: 'secondary', label: 'Secondary' },
                { id: 'outline', label: 'Outline' },
                { id: 'ghost', label: 'Ghost' },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => {
                    updateProps(node.id, { variant: style.id });
                    setStyleMenuOpen(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs text-left ${
                    currentVariant === style.id ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted text-foreground'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-4 w-[1px] bg-border mx-0.5" />

        {/* State Toggle: Default vs Hover */}
        <div className="flex items-center gap-0.5 bg-muted/60 rounded-lg p-0.5 border border-border text-[11px]">
          {(['default', 'hover'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setActiveStateMode(mode)}
              className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                activeStateMode === mode ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {mode === 'default' ? 'Default' : 'Hover'}
            </button>
          ))}
        </div>

        {/* Animation */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setAnimMenuOpen(!animMenuOpen);
              setStyleMenuOpen(false);
              setMoreMenuOpen(false);
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-medium transition-colors ${
              currentAnim !== 'none'
                ? 'bg-primary/20 text-primary border-primary/40'
                : 'bg-muted/60 border-border hover:bg-muted text-foreground'
            }`}
            title="Animation"
          >
            <Sparkles className="w-3 h-3 text-primary" />
            <span>{currentAnim !== 'none' ? currentAnim : 'Anim'}</span>
          </button>
          {animMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-36 rounded-xl bg-popover border border-border shadow-2xl p-1 z-50 flex flex-col gap-0.5">
              {ANIMATION_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    triggerAnimationPreview(preset.id);
                    setAnimMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left ${
                    currentAnim === preset.id ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <span>{preset.label}</span>
                  {currentAnim === preset.id && <Play className="w-2.5 h-2.5 fill-current" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-4 w-[1px] bg-border mx-0.5" />

        {/* More */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setMoreMenuOpen(!moreMenuOpen);
              setStyleMenuOpen(false);
              setAnimMenuOpen(false);
            }}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="More actions"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
          {moreMenuOpen && (
            <div className="absolute top-full right-0 mt-1 w-44 rounded-xl bg-popover border border-border shadow-2xl p-1.5 z-50 flex flex-col gap-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  duplicateNode(node.id);
                  setMoreMenuOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-left"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Duplicate</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLock(node.id, !isLocked);
                  setMoreMenuOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-left"
              >
                {isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{isLocked ? 'Unlock' : 'Lock'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  focusInspectorSection('states');
                  setMoreMenuOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted text-primary text-left"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Advanced States</span>
              </button>
              {!isLocked && (
                <button
                  type="button"
                  onClick={() => {
                    removeNode(node.id);
                    setMoreMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-destructive/20 text-destructive text-left"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. SECTION TOOLBAR
  // Layout, Background, Spacing, Responsive, Animation, Replace, Duplicate, More
  // ─────────────────────────────────────────────────────────────────────────────
  if (isSectionNode) {
    const currentPadding = node.styles?.spacing?.padding?.top || '80px';
    const currentAnim = node.animations?.preset || 'none';

    return (
      <>
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 p-1 rounded-xl bg-card/95 border border-border shadow-2xl backdrop-blur-md text-foreground text-xs select-none"
        >
          {/* Section Type Label */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-wide mr-0.5 shadow-sm">
            <Maximize2 className="w-3 h-3" />
            <span>{node.label || node.name || 'Section'}</span>
          </div>

          {/* Change Layout */}
          <button
            type="button"
            onClick={() => setChangeLayoutOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-muted border border-border text-foreground transition-colors font-medium text-xs"
            title="Change section layout architecture (1 Col, 50/50, 40/60, Bento, Grid)"
          >
            <Columns className="w-3.5 h-3.5 text-primary" />
            <span>Layout</span>
          </button>

          {/* Background Quick Trigger */}
          <button
            type="button"
            onClick={() => setBgMediaPickerOpen(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/60 hover:bg-muted border border-border text-foreground transition-colors text-xs font-medium"
            title="Set section background image / color"
          >
            <Palette className="w-3.5 h-3.5 text-primary" />
            <span>Background</span>
          </button>

          {/* Spacing (Padding Quick Toggle) */}
          <button
            type="button"
            onClick={() => {
              const nextPad = currentPadding === '40px' ? '80px' : currentPadding === '80px' ? '120px' : '40px';
              updateStyles(node.id, { spacing: { ...node.styles?.spacing, padding: { top: nextPad, bottom: nextPad, left: '24px', right: '24px' } } });
            }}
            className="px-2 py-1 rounded-lg bg-muted/60 border border-border hover:bg-muted text-foreground text-xs font-medium"
            title="Cycle section vertical padding (Compact 40px, Standard 80px, Spacious 120px)"
          >
            Padding: {currentPadding}
          </button>

          {/* Responsive (Device Visibility) */}
          <button
            type="button"
            onClick={() => setVisibility(node.id, { [viewport]: isHidden })}
            title={isHidden ? `Show on ${viewport}` : `Hide on ${viewport}`}
            className={`p-1.5 rounded-lg border transition-colors ${
              isHidden ? 'bg-destructive/20 border-destructive/40 text-destructive' : 'bg-muted/60 border-border text-foreground hover:bg-muted'
            }`}
          >
            {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>

          {/* Animation */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setAnimMenuOpen(!animMenuOpen);
                setMoreMenuOpen(false);
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-medium transition-colors ${
                currentAnim !== 'none'
                  ? 'bg-primary/20 text-primary border-primary/40'
                  : 'bg-muted/60 border-border hover:bg-muted text-foreground'
              }`}
              title="Animation"
            >
              <Sparkles className="w-3 h-3 text-primary" />
              <span>{currentAnim !== 'none' ? currentAnim : 'Anim'}</span>
            </button>
            {animMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-36 rounded-xl bg-popover border border-border shadow-2xl p-1 z-50 flex flex-col gap-0.5">
                {ANIMATION_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      triggerAnimationPreview(preset.id);
                      setAnimMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left ${
                      currentAnim === preset.id ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <span>{preset.label}</span>
                    {currentAnim === preset.id && <Play className="w-2.5 h-2.5 fill-current" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Replace Section */}
          <button
            type="button"
            onClick={() => setReplaceSectionOpen(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/60 hover:bg-muted border border-border text-foreground transition-colors text-xs font-medium"
            title="Replace with compatible section variant"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-primary" />
            <span>Replace</span>
          </button>

          {/* Duplicate Section */}
          <button
            type="button"
            onClick={() => duplicateNode(node.id)}
            title="Duplicate Section"
            className="p-1.5 rounded-lg hover:bg-muted text-foreground transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-border mx-0.5" />

          {/* More Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setMoreMenuOpen(!moreMenuOpen);
                setAnimMenuOpen(false);
              }}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="More section options"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
            {moreMenuOpen && (
              <div className="absolute top-full right-0 mt-1 w-48 rounded-xl bg-popover border border-border shadow-2xl p-1.5 z-50 flex flex-col gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    addSectionAbove(node.id);
                    setMoreMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-left"
                >
                  <Plus className="w-3.5 h-3.5 text-primary" />
                  <span>Add Section Above</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addSectionBelow(node.id);
                    setMoreMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-left"
                >
                  <Plus className="w-3.5 h-3.5 text-primary" />
                  <span>Add Section Below</span>
                </button>
                <div className="h-[1px] bg-border my-0.5" />
                {parentInfo && parentInfo.index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      moveNode(node.id, parentInfo.parent.id, parentInfo.index - 1);
                      setMoreMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-left"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>Move Up</span>
                  </button>
                )}
                {parentInfo && parentInfo.parent.children && parentInfo.index < parentInfo.parent.children.length - 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      moveNode(node.id, parentInfo.parent.id, parentInfo.index + 1);
                      setMoreMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-left"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>Move Down</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setLock(node.id, !isLocked);
                    setMoreMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-left"
                >
                  {isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{isLocked ? 'Unlock Section' : 'Lock Section'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    focusInspectorSection('background');
                    setMoreMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted text-primary text-left"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Full Inspector</span>
                </button>
                {!isLocked && (
                  <button
                    type="button"
                    onClick={() => {
                      removeNode(node.id);
                      setMoreMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-destructive/20 text-destructive text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Section</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Change Layout Modal */}
        <ChangeLayoutModal
          isOpen={changeLayoutOpen}
          onClose={() => setChangeLayoutOpen(false)}
          sectionId={node.id}
        />

        {/* Replace Section Modal */}
        <ReplaceSectionModal
          isOpen={replaceSectionOpen}
          onClose={() => setReplaceSectionOpen(false)}
          sectionId={node.id}
        />

        {/* Background Media Picker */}
        <MediaPickerModal
          isOpen={bgMediaPickerOpen}
          onClose={() => setBgMediaPickerOpen(false)}
          onSelect={(url) => {
            updateStyles(node.id, {
              background: {
                ...node.styles?.background,
                image: url,
                size: 'cover',
                position: 'center',
              },
            });
          }}
        />
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. GRID TOOLBAR
  // ─────────────────────────────────────────────────────────────────────────────
  if (isGridNode) {
    const currentCols = Number(node.styles?.grid?.columns) || 3;

    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-1 p-1 rounded-xl bg-card/95 border border-border shadow-2xl backdrop-blur-md text-foreground text-xs select-none"
      >
        <span className="text-[10px] uppercase font-bold text-muted-foreground px-1.5">Cols:</span>
        <div className="flex items-center gap-0.5 bg-muted/60 rounded-lg p-0.5 border border-border">
          {[1, 2, 3, 4, 6].map((cols) => (
            <button
              key={cols}
              type="button"
              onClick={() => updateStyles(node.id, { grid: { ...node.styles?.grid, columns: cols } })}
              className={`w-5 h-5 flex items-center justify-center rounded text-xs font-semibold transition-colors ${
                currentCols === cols ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {cols}
            </button>
          ))}
        </div>

        <div className="h-4 w-[1px] bg-border mx-0.5" />

        <button
          type="button"
          onClick={() => duplicateNode(node.id)}
          title="Duplicate grid"
          className="p-1.5 rounded-lg hover:bg-muted text-foreground transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        {!isLocked && (
          <button
            type="button"
            onClick={() => removeNode(node.id)}
            title="Delete grid"
            className="p-1.5 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. GENERIC ELEMENT TOOLBAR (Container, Row, Column, Primitives)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex items-center gap-0.5 p-1 rounded-xl bg-card/95 border border-border shadow-2xl backdrop-blur-md text-foreground text-xs select-none"
    >
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-wide mr-1 shadow-sm">
        <span>{node.label || node.name || node.type}</span>
      </div>

      {parentInfo && parentInfo.index > 0 && (
        <button
          type="button"
          onClick={() => moveNode(node.id, parentInfo.parent.id, parentInfo.index - 1)}
          title="Move Up"
          className="p-1.5 rounded-lg hover:bg-muted text-foreground transition-colors"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      )}

      {parentInfo && parentInfo.parent.children && parentInfo.index < parentInfo.parent.children.length - 1 && (
        <button
          type="button"
          onClick={() => moveNode(node.id, parentInfo.parent.id, parentInfo.index + 1)}
          title="Move Down"
          className="p-1.5 rounded-lg hover:bg-muted text-foreground transition-colors"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      )}

      <button
        type="button"
        onClick={() => duplicateNode(node.id)}
        title="Duplicate element"
        className="p-1.5 rounded-lg hover:bg-muted text-foreground transition-colors"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => setLock(node.id, !isLocked)}
        title={isLocked ? 'Unlock Element' : 'Lock Element'}
        className={`p-1.5 rounded-lg transition-colors ${
          isLocked ? 'bg-warning/20 text-warning' : 'hover:bg-muted text-foreground'
        }`}
      >
        {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
      </button>

      {!isLocked && (
        <button
          type="button"
          onClick={() => removeNode(node.id)}
          title="Delete element"
          className="p-1.5 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
