'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { ContentControl } from './controls/ContentControl';
import { BackgroundControl } from './controls/BackgroundControl';
import { SpacingBoxModel } from './controls/SpacingBoxModel';
import { TypographyControl } from './controls/TypographyControl';
import { LayoutControl } from './controls/LayoutControl';
import { EffectsControl } from './controls/EffectsControl';
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
} from 'lucide-react';

export function V3Inspector() {
  const {
    getSelectedNode,
    getNodePath,
    setSelectedNodeId,
    selectedNodeId,
    updateStyles,
    updateProps,
    updateResponsive,
    viewport,
  } = useV3EditorStore();

  const selectedNode = getSelectedNode();
  const path = selectedNodeId ? getNodePath(selectedNodeId) : [];

  // Collapsible accordion state
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    content: true,
    background: true,
    layout: true,
    spacing: true,
    typography: true,
    effects: true,
    responsive: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!selectedNode) {
    return (
      <aside className="w-80 shrink-0 border-l border-slate-800/80 bg-slate-950/95 flex flex-col items-center justify-center p-8 text-center text-slate-500 select-none">
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

  const resetResponsiveOverride = () => {
    if (viewport === 'desktop') return;
    updateResponsive(selectedNode.id, { [viewport]: undefined });
  };

  return (
    <aside className="w-84 shrink-0 border-l border-slate-800/80 bg-slate-950 flex flex-col h-full overflow-hidden select-none text-slate-100 z-20">
      {/* 1. Selector Breadcrumb Hierarchy */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-900/60">
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
                {item.name || item.type}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 2. Quick Alignment Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/80 bg-slate-900/30 text-slate-400">
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

      {/* 3. Scrollable Inspector Properties */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
        {/* Device Mode Notice */}
        {viewport !== 'desktop' && (
          <div className="px-4 py-2 bg-indigo-950/30 border-b border-indigo-900/40 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-indigo-300 font-medium">
              {viewport === 'tablet' ? <Tablet className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
              <span>Editing for {viewport.toUpperCase()}</span>
            </div>
            {hasResponsiveOverride && (
              <button
                type="button"
                onClick={resetResponsiveOverride}
                className="flex items-center gap-1 text-[10px] text-amber-400 hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        )}

        {/* Accordion: Content & Element Settings */}
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

        {/* Accordion: Layout */}
        <div className="p-3">
          <button
            type="button"
            onClick={() => toggleSection('layout')}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white mb-2"
          >
            <span>Layout</span>
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

        {/* Accordion: Spacing (Box Model) */}
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

        {/* Accordion: Background (Color & Image) */}
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
            {openSections.background ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {openSections.background && (
            <BackgroundControl
              background={selectedNode.styles?.background}
              onChangeBackground={(background) => updateStyles(selectedNode.id, { background })}
            />
          )}
        </div>

        {/* Accordion: Typography (Shown for text elements) */}
        {isTextElement && (
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

        {/* Accordion: Size, Border & Shadows */}
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
      </div>
    </aside>
  );
}
