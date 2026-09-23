'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { ContentControl } from './controls/ContentControl';
import { BackgroundControl } from './controls/BackgroundControl';
import { SpacingBoxModel } from './controls/SpacingBoxModel';
import { TypographyControl } from './controls/TypographyControl';
import { LayoutControl } from './controls/LayoutControl';
import { EffectsControl } from './controls/EffectsControl';
import { AnimationControl } from './controls/AnimationControl';
import { StatesControl } from './controls/StatesControl';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignHorizontalDistributeCenter,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  Palette,
  Smartphone,
  Tablet,
  RotateCcw,
  Search,
  X,
  Lock,
  Unlock,
  SlidersHorizontal,
  MousePointer,
  CheckCircle2,
} from 'lucide-react';

export function V3Inspector() {
  const {
    getSelectedNode,
    getNodePath,
    setSelectedNodeId,
    selectedNodeId,
    updateStyles,
    updateProps,
    updateAnimation,
    updateState,
    resetResponsive,
    setLock,
    viewport,
    quickMode,
    setQuickMode,
    propertySearchQuery,
    setPropertySearchQuery,
  } = useV3EditorStore();

  const selectedNode = getSelectedNode();
  const path = selectedNodeId ? getNodePath(selectedNodeId) : [];

  // Collapsible accordion state
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    content: true,
    states: false,
    animations: false,
    background: true,
    layout: true,
    spacing: true,
    typography: true,
    effects: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!selectedNode) {
    return (
      <aside className="w-84 shrink-0 border-l border-slate-800/80 bg-slate-950/95 flex flex-col items-center justify-center p-8 text-center text-slate-500 select-none">
        <Layers className="w-8 h-8 text-slate-700 mb-3" />
        <p className="text-sm font-semibold text-slate-400">No Element Selected</p>
        <p className="text-xs text-slate-500 mt-1">
          Click any element on the canvas or in the Layers panel to inspect and customize styles.
        </p>
      </aside>
    );
  }

  const isTextElement = ['heading', 'paragraph', 'rich-text', 'text', 'button', 'link', 'quote', 'badge'].includes(
    selectedNode.type,
  );

  // Responsive override check
  const hasResponsiveOverride = Boolean(
    viewport !== 'desktop' && selectedNode.responsive && selectedNode.responsive[viewport],
  );

  // Property Search filtering
  const query = propertySearchQuery.toLowerCase().trim();
  const matches = (keywords: string[]) => {
    if (!query) return true;
    return keywords.some((kw) => kw.toLowerCase().includes(query));
  };

  const showContent = matches(['content', 'text', 'image', 'url', 'settings', 'title', 'button', 'variant', 'props']);
  const showStates = matches(['states', 'hover', 'active', 'focus', 'interaction', 'color']);
  const showAnimations = matches(['animation', 'animate', 'fade', 'scale', 'slide', 'blur', 'trigger', 'motion']);
  const showLayout = matches(['layout', 'display', 'flex', 'grid', 'columns', 'align', 'gap', 'direction']);
  const showSpacing = matches(['spacing', 'margin', 'padding', 'box', 'model', 'gap']);
  const showBackground = matches(['background', 'color', 'image', 'overlay', 'gradient', 'tint']);
  const showTypography = isTextElement && matches(['typography', 'font', 'size', 'weight', 'color', 'text', 'lineheight']);
  const showEffects = matches(['effects', 'border', 'radius', 'shadow', 'opacity', 'size', 'width', 'height']);

  return (
    <aside className="w-84 shrink-0 border-l border-slate-800/80 bg-slate-950 flex flex-col h-full overflow-hidden select-none text-slate-100 z-20">
      {/* 1. Header: Node Info + Mode Toggle + Lock */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-900/60 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 shrink-0">
              {selectedNode.type}
            </span>
            <span className="text-xs font-semibold text-slate-200 truncate" title={selectedNode.name}>
              {selectedNode.label || selectedNode.name}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Quick vs Advanced Mode Switch */}
            <button
              type="button"
              onClick={() => setQuickMode(!quickMode)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                quickMode
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle between Quick Mode and Advanced Mode"
            >
              <SlidersHorizontal className="w-2.5 h-2.5" />
              <span>{quickMode ? 'Quick' : 'Advanced'}</span>
            </button>

            {/* Lock / Unlock */}
            <button
              type="button"
              onClick={() => setLock(selectedNode.id, !selectedNode.locked)}
              className={`p-1 rounded transition-colors ${
                selectedNode.locked
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
              }`}
              title={selectedNode.locked ? 'Unlock element' : 'Lock element'}
            >
              {selectedNode.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Breadcrumb Hierarchy */}
        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium overflow-x-auto scrollbar-none py-0.5">
          {path.map((item, idx) => (
            <React.Fragment key={item.id}>
              {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />}
              <button
                type="button"
                onClick={() => setSelectedNodeId(item.id)}
                className={`truncate max-w-[90px] px-1.5 py-0.5 rounded transition-colors ${
                  item.id === selectedNode.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
                title={item.name || item.type}
              >
                {item.label || item.name || item.type}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Property Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={propertySearchQuery}
            onChange={(e) => setPropertySearchQuery(e.target.value)}
            placeholder="Search properties (color, gap, anim...)"
            className="w-full h-7 pl-8 pr-7 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:border-indigo-500 focus:outline-none placeholder:text-slate-500"
          />
          {propertySearchQuery && (
            <button
              type="button"
              onClick={() => setPropertySearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Quick Alignment Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800/80 bg-slate-900/30 text-slate-400">
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Align</span>
        <div className="flex items-center gap-0.5 bg-slate-900 rounded-lg p-0.5 border border-slate-800">
          <button
            type="button"
            title="Align Left"
            onClick={() => updateStyles(selectedNode.id, { typography: { textAlign: 'left' } })}
            className="p-1 rounded hover:bg-slate-800 hover:text-white"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Align Center"
            onClick={() => updateStyles(selectedNode.id, { typography: { textAlign: 'center' } })}
            className="p-1 rounded hover:bg-slate-800 hover:text-white"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Align Right"
            onClick={() => updateStyles(selectedNode.id, { typography: { textAlign: 'right' } })}
            className="p-1 rounded hover:bg-slate-800 hover:text-white"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Distribute Center"
            onClick={() => updateStyles(selectedNode.id, { flex: { justifyContent: 'center' } })}
            className="p-1 rounded hover:bg-slate-800 hover:text-white"
          >
            <AlignHorizontalDistributeCenter className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Responsive Cascade Indicator */}
      {viewport !== 'desktop' && (
        <div className="px-3 py-2 bg-indigo-950/40 border-b border-indigo-900/50 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-indigo-300 font-medium">
            {viewport === 'tablet' ? <Tablet className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span className="capitalize">{viewport} View</span>
            {hasResponsiveOverride ? (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Overridden
              </span>
            ) : (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Inherited
              </span>
            )}
          </div>
          {hasResponsiveOverride && (
            <button
              type="button"
              onClick={() => resetResponsive(selectedNode.id, viewport)}
              className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 font-semibold transition-colors"
              title="Reset tablet/mobile styles to inherit from desktop"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      )}

      {/* 4. Scrollable Inspector Properties */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
        {/* Accordion: Content & Element Settings */}
        {showContent && (
          <div className="p-3 bg-slate-900/30">
            <button
              type="button"
              onClick={() => toggleSection('content')}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-200 hover:text-white mb-2"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Content & Settings</span>
              </div>
              {openSections.content ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>
            {openSections.content && (
              <ContentControl
                node={selectedNode}
                onChangeProps={(propsPatch) => updateProps(selectedNode.id, propsPatch)}
              />
            )}
          </div>
        )}

        {/* Accordion: Interaction States (Hover, Active, Focus) */}
        {showStates && (!quickMode || isTextElement || selectedNode.type === 'button') && (
          <div className="p-3">
            <button
              type="button"
              onClick={() => toggleSection('states')}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white mb-2"
            >
              <div className="flex items-center gap-1.5">
                <MousePointer className="w-3.5 h-3.5 text-indigo-400" />
                <span>Interaction States</span>
              </div>
              {openSections.states ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>
            {openSections.states && (
              <StatesControl
                nodeId={selectedNode.id}
                states={selectedNode.states}
                onChangeState={(stateKey, styles) => updateState(selectedNode.id, stateKey, styles)}
              />
            )}
          </div>
        )}

        {/* Accordion: Wix Animation Presets & Live Preview */}
        {showAnimations && (
          <div className="p-3">
            <button
              type="button"
              onClick={() => toggleSection('animations')}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white mb-2"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Animations & Motion</span>
              </div>
              {openSections.animations ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>
            {openSections.animations && (
              <AnimationControl
                nodeId={selectedNode.id}
                animation={selectedNode.animations}
                onChangeAnimation={(animPatch) => updateAnimation(selectedNode.id, animPatch)}
              />
            )}
          </div>
        )}

        {/* Accordion: Background (Color, Image, Overlay) */}
        {showBackground && (
          <div className="p-3">
            <button
              type="button"
              onClick={() => toggleSection('background')}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white mb-2"
            >
              <div className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-400" />
                <span>Background</span>
              </div>
              {openSections.background ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>
            {openSections.background && (
              <BackgroundControl
                background={selectedNode.styles?.background}
                onChangeBackground={(background) => updateStyles(selectedNode.id, { background })}
              />
            )}
          </div>
        )}

        {/* Accordion: Typography (Shown for text elements) */}
        {showTypography && (
          <div className="p-3">
            <button
              type="button"
              onClick={() => toggleSection('typography')}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white mb-2"
            >
              <span>Typography</span>
              {openSections.typography ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {openSections.typography && (
              <TypographyControl
                typography={selectedNode.styles?.typography}
                onChange={(typography) => updateStyles(selectedNode.id, { typography })}
              />
            )}
          </div>
        )}

        {/* Accordion: Layout */}
        {showLayout && (!quickMode || ['section', 'grid', 'column', 'row', 'container'].includes(selectedNode.type)) && (
          <div className="p-3">
            <button
              type="button"
              onClick={() => toggleSection('layout')}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white mb-2"
            >
              <span>Layout & Grid</span>
              {openSections.layout ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {openSections.layout && (
              <LayoutControl
                layout={selectedNode.styles?.layout}
                flex={selectedNode.styles?.flex}
                grid={selectedNode.styles?.grid}
                onChangeLayout={(layout) => updateStyles(selectedNode.id, { layout })}
                onChangeFlex={(flex) => updateStyles(selectedNode.id, { flex })}
                onChangeGrid={(grid) => updateStyles(selectedNode.id, { grid })}
              />
            )}
          </div>
        )}

        {/* Accordion: Spacing (Box Model) - shown in Advanced mode or when queried */}
        {showSpacing && (!quickMode || query.length > 0) && (
          <div className="p-3">
            <button
              type="button"
              onClick={() => toggleSection('spacing')}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white mb-2"
            >
              <span>Spacing</span>
              {openSections.spacing ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {openSections.spacing && (
              <SpacingBoxModel
                margin={selectedNode.styles?.spacing?.margin}
                padding={selectedNode.styles?.spacing?.padding}
                onChangeMargin={(margin) =>
                  updateStyles(selectedNode.id, {
                    spacing: { ...selectedNode.styles?.spacing, margin },
                  })
                }
                onChangePadding={(padding) =>
                  updateStyles(selectedNode.id, {
                    spacing: { ...selectedNode.styles?.spacing, padding },
                  })
                }
              />
            )}
          </div>
        )}

        {/* Accordion: Size, Border & Shadows - shown in Advanced mode or when queried */}
        {showEffects && (!quickMode || query.length > 0) && (
          <div className="p-3">
            <button
              type="button"
              onClick={() => toggleSection('effects')}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white mb-2"
            >
              <span>Size & Effects</span>
              {openSections.effects ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {openSections.effects && (
              <EffectsControl
                size={selectedNode.styles?.size}
                border={selectedNode.styles?.border}
                effects={selectedNode.styles?.effects}
                onChangeSize={(size) => updateStyles(selectedNode.id, { size })}
                onChangeBorder={(border) => updateStyles(selectedNode.id, { border })}
                onChangeEffects={(effects) => updateStyles(selectedNode.id, { effects })}
              />
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
