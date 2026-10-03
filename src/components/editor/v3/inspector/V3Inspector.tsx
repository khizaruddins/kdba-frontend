'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { StyleDefinition } from '@/types/v3-document';
import { ContentControl } from './controls/ContentControl';
import { BackgroundControl } from './controls/BackgroundControl';
import { SpacingBoxModel } from './controls/SpacingBoxModel';
import { TypographyControl } from './controls/TypographyControl';
import { LayoutControl } from './controls/LayoutControl';
import { EffectsControl } from './controls/EffectsControl';
import { ColorControl } from './controls/ColorControl';
import { SizeControl } from './controls/SizeControl';
import { VisibilityControl } from './controls/VisibilityControl';
import { VariantControl } from './controls/VariantControl';
import { StatesControl } from './controls/StatesControl';
import { RichTextControl } from './controls/RichTextControl';
import { BindingControl, CollectionListControl } from './controls/BindingControl';
import { CmsCollectionControl } from './controls/CmsCollectionControl';
import { AnimationControl } from './controls/AnimationControl';
import { cmsApi } from '@/lib/api/cms';
import { CmsCollection } from '@/types/cms';
import { NodeBinding } from '@/types/v3-document';
import { isStyleGroupOverridden, StyleGroupKey, hasViewportOverride, isStylePathOverridden } from '@/lib/document/v3-operations';
import { INSTANCE_OF_PROP } from '@/lib/editor/rich-text';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignHorizontalDistributeCenter,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
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

function OverrideBadge({
  viewport,
  overridden,
}: {
  viewport: string;
  overridden: boolean;
}) {
  if (viewport === 'desktop') return null;
  return (
    <span
      className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide ${
        overridden
          ? 'bg-warning/15 text-warning border border-warning/30'
          : 'bg-muted text-muted-foreground border border-border'
      }`}
    >
      {overridden ? 'Overridden' : 'Inherited'}
    </span>
  );
}

function InspectorSection({
  id,
  title,
  open,
  onToggle,
  overridden,
  viewport,
  onReset,
  icon,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  overridden: boolean;
  viewport: string;
  onReset?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="p-3">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between text-xs font-bold text-muted-foreground hover:text-foreground mb-2"
        aria-expanded={open}
        aria-controls={`inspector-${id}`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {icon}
          <span>{title}</span>
          <OverrideBadge viewport={viewport} overridden={overridden} />
        </div>
        <div className="flex items-center gap-1">
          {viewport !== 'desktop' && overridden && onReset && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  onReset();
                }
              }}
              className="flex items-center gap-0.5 text-[9px] font-semibold uppercase tracking-wide text-warning hover:underline"
              title="Reset this section to the inherited desktop value"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </span>
          )}
          {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>
      {open && <div id={`inspector-${id}`}>{children}</div>}
    </div>
  );
}

export function V3Inspector() {
  const {
    getSelectedNode,
    getNodePath,
    setSelectedNodeId,
    selectedNodeId,
    updateStyles,
    updateProps,
    resetViewportStyles,
    resetViewportStyleGroup,
    resetViewportStylePath,
    setVisibility,
    viewport,
    document,
    getInspectorStyles,
    inspectorFocusKey,
    saveReusableFromSelection,
    syncReusableFromSelection,
    getActivePage,
    updateNode,
    websiteId,
    updateAnimation,
    updateState,
    resetResponsive,
    setLock,
    quickMode,
    setQuickMode,
    propertySearchQuery,
    setPropertySearchQuery,
  } = useV3EditorStore();

  const selectedNode = getSelectedNode();
  const path = selectedNodeId ? getNodePath(selectedNodeId).filter((item) => item.type !== 'page-root') : [];
  const activePage = getActivePage();
  const [cmsCollections, setCmsCollections] = React.useState<CmsCollection[]>([]);

  React.useEffect(() => {
    if (!websiteId) return;
    void cmsApi
      .bootstrap(websiteId)
      .then(() => cmsApi.listCollections(websiteId))
      .then((list) => setCmsCollections(Array.isArray(list) ? list : []))
      .catch(() => setCmsCollections([]));
  }, [websiteId]);
  const styles = selectedNodeId ? getInspectorStyles(selectedNodeId) : {};
  const themeColors = document?.theme?.colors;

  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    content: true,
    variant: true,
    states: false,
    animations: false,
    background: true,
    layout: true,
    size: true,
    spacing: true,
    typography: true,
    color: true,
    border: false,
    radius: false,
    shadow: false,
    responsive: true,
    effects: true,
  });

  React.useEffect(() => {
    if (!inspectorFocusKey) return;
    setOpenSections((prev) => ({ ...prev, [inspectorFocusKey]: true }));
  }, [inspectorFocusKey, selectedNodeId]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!selectedNode) {
    return (
      <aside className="flex h-full w-full min-w-0 shrink-0 flex-col items-center justify-center border-l border-border bg-card p-8 text-center text-muted-foreground select-none">
        <Layers className="w-8 h-8 text-muted-foreground mb-3" />
        <p className="text-sm font-semibold text-muted-foreground">No Element Selected</p>
        <p className="text-xs text-muted-foreground mt-1">
          Click any element on the canvas or in the Layers panel to inspect and customize styles.
        </p>
      </aside>
    );
  }

  const isTextElement = ['heading', 'paragraph', 'rich-text', 'text', 'button', 'link', 'quote', 'badge'].includes(
    selectedNode.type,
  );

  const hasResponsiveOverride = hasViewportOverride(selectedNode, viewport);

  const groupOverridden = (groups: StyleGroupKey[]) => isStyleGroupOverridden(selectedNode, viewport, groups);

  const resetGroup = (groups: StyleGroupKey[]) => {
    if (viewport === 'desktop') return;
    resetViewportStyleGroup(selectedNode.id, groups);
  };

  const effectsProps = {
    size: styles.size,
    border: styles.border,
    effects: styles.effects,
    onChangeSize: (size: StyleDefinition['size']) => updateStyles(selectedNode.id, { size }),
    onChangeBorder: (border: StyleDefinition['border']) => updateStyles(selectedNode.id, { border }),
    onChangeEffects: (effects: StyleDefinition['effects']) => updateStyles(selectedNode.id, { effects }),
  };

  // Property Search filtering
  const query = propertySearchQuery.toLowerCase().trim();
  const matches = (keywords: string[]) => {
    if (!query) return true;
    return keywords.some((kw) => kw.toLowerCase().includes(query));
  };

  const showContent = matches(['content', 'text', 'image', 'url', 'settings', 'title', 'button', 'props']);
  const showVariant = (!quickMode || query) && matches(['variant', 'style', 'type', 'preset']);
  const showStates = (!quickMode || query) && matches(['states', 'hover', 'active', 'focus', 'interaction']);
  const showAnimations = matches(['animation', 'animate', 'fade', 'scale', 'slide', 'blur', 'trigger', 'motion']);
  const showLayout = matches(['layout', 'display', 'flex', 'grid', 'columns', 'align', 'gap', 'direction']);
  const showSize = matches(['size', 'width', 'height', 'min', 'max', 'dimensions']);
  const showSpacing = matches(['spacing', 'margin', 'padding', 'box', 'model', 'gap']);
  const showTypography = isTextElement && matches(['typography', 'font', 'size', 'weight', 'color', 'text', 'lineheight']);
  const showColor = matches(['color', 'text color', 'background color', 'border color', 'palette']);
  const showBackground = matches(['background', 'color', 'image', 'overlay', 'gradient', 'tint']);
  const showBorder = (!quickMode || query) && matches(['border', 'stroke', 'outline', 'width', 'style']);
  const showRadius = (!quickMode || query) && matches(['radius', 'corner', 'rounded']);
  const showShadow = (!quickMode || query) && matches(['shadow', 'elevation', 'blur', 'effects']);
  const showResponsive = (!quickMode || query) && matches(['responsive', 'mobile', 'tablet', 'desktop', 'visibility', 'override']);

  return (
    <aside className="flex h-full w-full min-w-0 shrink-0 flex-col overflow-hidden border-l border-border bg-background z-20 select-none text-foreground">
      {/* Header: Node Info + Mode Toggle + Lock */}
      <div className="p-3 border-b border-border bg-muted/40 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/30 shrink-0">
              {selectedNode.type}
            </span>
            <span className="text-xs font-semibold text-foreground truncate" title={selectedNode.name}>
              {selectedNode.label || selectedNode.name}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Quick vs Advanced Mode Switch */}
            <button
              type="button"
              onClick={() => setQuickMode(!quickMode)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                quickMode ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
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
                selectedNode.locked ? 'text-warning' : 'text-muted-foreground hover:text-foreground'
              }`}
              title={selectedNode.locked ? 'Unlock element' : 'Lock element'}
            >
              {selectedNode.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Breadcrumb Hierarchy */}
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium overflow-x-auto scrollbar-none py-0.5">
          {path.map((item, idx) => (
            <React.Fragment key={item.id}>
              {idx > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />}
              <button
                type="button"
                onClick={() => setSelectedNodeId(item.id)}
                className={`truncate max-w-[90px] px-1.5 py-0.5 rounded transition-colors ${
                  item.id === selectedNode.id
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'hover:bg-muted text-muted-foreground'
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

      {/* Quick Alignment Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30 text-muted-foreground">
        <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Align</span>
        <div className="flex items-center gap-0.5 bg-muted/50 rounded-lg p-0.5 border border-border">
          <button type="button" title="Align left" aria-label="Align left" onClick={() => updateStyles(selectedNode.id, { typography: { textAlign: 'left' }, flex: { justifyContent: 'flex-start' } })} className="p-1 rounded hover:bg-muted hover:text-foreground">
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button type="button" title="Align center" aria-label="Align center" onClick={() => updateStyles(selectedNode.id, { typography: { textAlign: 'center' }, flex: { justifyContent: 'center' } })} className="p-1 rounded hover:bg-muted hover:text-foreground">
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button type="button" title="Align right" aria-label="Align right" onClick={() => updateStyles(selectedNode.id, { typography: { textAlign: 'right' }, flex: { justifyContent: 'flex-end' } })} className="p-1 rounded hover:bg-muted hover:text-foreground">
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button type="button" title="Align top" aria-label="Align top" onClick={() => updateStyles(selectedNode.id, { flex: { alignItems: 'flex-start' } })} className="p-1 rounded hover:bg-muted hover:text-foreground">
            <AlignStartVertical className="w-3.5 h-3.5" />
          </button>
          <button type="button" title="Align middle" aria-label="Align middle" onClick={() => updateStyles(selectedNode.id, { flex: { alignItems: 'center' } })} className="p-1 rounded hover:bg-muted hover:text-foreground">
            <AlignCenterVertical className="w-3.5 h-3.5" />
          </button>
          <button type="button" title="Align bottom" aria-label="Align bottom" onClick={() => updateStyles(selectedNode.id, { flex: { alignItems: 'flex-end' } })} className="p-1 rounded hover:bg-muted hover:text-foreground">
            <AlignEndVertical className="w-3.5 h-3.5" />
          </button>
          <button type="button" title="Equal spacing" aria-label="Equal spacing" onClick={() => updateStyles(selectedNode.id, { flex: { justifyContent: 'space-between' } })} className="p-1 rounded hover:bg-muted hover:text-foreground">
            <AlignHorizontalDistributeCenter className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Responsive Cascade Indicator */}
      {viewport !== 'desktop' && (
        <div className="px-4 py-2 bg-primary/10 border-b border-primary/30 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-primary font-medium">
            {viewport === 'tablet' ? <Tablet className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span>Editing {viewport}</span>
            {hasResponsiveOverride ? (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-warning/20 text-warning border border-warning/30">Overridden</span>
            ) : (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-success/20 text-success border border-success/30 flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" />Inherited</span>
            )}
          </div>
          {hasResponsiveOverride && (
            <button
              type="button"
              onClick={() => { resetViewportStyles(selectedNode.id); resetResponsive(selectedNode.id, viewport); }}
              className="flex items-center gap-1 text-[10px] text-warning hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all</span>
            </button>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {showContent && (
          <div className="p-3 bg-muted/30">
            <button
              type="button"
              onClick={() => toggleSection('content')}
              className="w-full flex items-center justify-between text-xs font-bold text-foreground hover:text-foreground mb-2"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Content &amp; Settings</span>
              </div>
              {openSections.content ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
            </button>
            {openSections.content && (
              <div className="space-y-3">
                <RichTextControl
                  node={selectedNode}
                  onChangeProps={(propsPatch) => updateProps(selectedNode.id, propsPatch)}
                  onChangeAlign={(textAlign) => updateStyles(selectedNode.id, { typography: { textAlign } })}
                />
                <ContentControl
                  node={selectedNode}
                  onChangeProps={(propsPatch) => updateProps(selectedNode.id, propsPatch)}
                />
                <BindingControl
                  node={selectedNode}
                  collections={cmsCollections}
                  onChangeBinding={(binding: NodeBinding | undefined) => updateNode(selectedNode.id, { binding })}
                />
                                {(selectedNode.type === 'section' || selectedNode.type === 'container' || selectedNode.type === 'grid') ? (
                  <CollectionListControl
                    node={selectedNode}
                    collections={cmsCollections}
                    onChangeProps={(propsPatch) => updateProps(selectedNode.id, propsPatch)}
                  />
                ) : null}
                {selectedNode.type === 'cms-collection' && (
                  <CmsCollectionControl
                    props={selectedNode.props || {}}
                    onChangeProps={(next) => updateProps(selectedNode.id, next)}
                    collections={cmsCollections}
                  />
                )}
                {selectedNode.props?.[INSTANCE_OF_PROP] ? (
                  <button type="button" onClick={() => syncReusableFromSelection()} className="w-full h-8 rounded-lg bg-primary/10 border border-primary/40 text-[11px] font-semibold text-primary">Update all instances</button>
                ) : selectedNode.type !== 'page-root' ? (
                  <button type="button" onClick={() => saveReusableFromSelection()} className="w-full h-8 rounded-lg bg-muted/50 border border-border text-[11px] font-semibold text-muted-foreground hover:text-foreground">Save as reusable</button>
                ) : null}
              </div>
            )}
          </div>
        )}

        {showVariant && (
          <InspectorSection
            id="variant"
            title="Variant"
            open={openSections.variant}
            onToggle={() => toggleSection('variant')}
            overridden={false}
            viewport={viewport}
          >
            <VariantControl
              node={selectedNode}
              onChangeProps={(propsPatch) => updateProps(selectedNode.id, propsPatch)}
            />
          </InspectorSection>
        )}

        {showStates && (
          <InspectorSection
            id="states"
            title="States (Hover / Active)"
            open={openSections.states}
            onToggle={() => toggleSection('states')}
            overridden={false}
            viewport={viewport}
          >
            <StatesControl
              nodeId={selectedNode.id}
              states={selectedNode.states}
              onChangeState={(stateKey, stylesPatch) => updateState(selectedNode.id, stateKey, stylesPatch)}
            />
          </InspectorSection>
        )}

        {showAnimations && (
          <InspectorSection
            id="animations"
            title="Animation"
            open={openSections.animations}
            onToggle={() => toggleSection('animations')}
            overridden={false}
            viewport={viewport}
          >
            <AnimationControl
              nodeId={selectedNode.id}
              animation={selectedNode.animations}
              onChangeAnimation={(animPatch) => updateAnimation(selectedNode.id, animPatch)}
            />
          </InspectorSection>
        )}

        {showLayout && (
          <InspectorSection
            id="layout"
            title="Layout"
            open={openSections.layout}
            onToggle={() => toggleSection('layout')}
            overridden={groupOverridden(['layout', 'flex', 'grid'])}
            viewport={viewport}
            onReset={() => resetGroup(['layout', 'flex', 'grid'])}
          >
            <LayoutControl
              layout={styles.layout}
              flex={styles.flex}
              grid={styles.grid}
              onChangeLayout={(layout) => updateStyles(selectedNode.id, { layout })}
              onChangeFlex={(flex) => updateStyles(selectedNode.id, { flex })}
              onChangeGrid={(grid) => updateStyles(selectedNode.id, { grid })}
            />
            {viewport !== 'desktop' && isStylePathOverridden(selectedNode, viewport, ['layout', 'overflow']) && (
              <button
                type="button"
                onClick={() => resetViewportStylePath(selectedNode.id, ['layout', 'overflow'])}
                className="mt-2 text-[10px] text-warning hover:underline"
              >
                Reset overflow to inherited
              </button>
            )}
          </InspectorSection>
        )}

        {showSize && (
          <InspectorSection
            id="size"
            title="Size"
            open={openSections.size}
            onToggle={() => toggleSection('size')}
            overridden={groupOverridden(['size'])}
            viewport={viewport}
            onReset={() => resetGroup(['size'])}
          >
            <SizeControl size={styles.size} onChangeSize={(size) => updateStyles(selectedNode.id, { size })} />
          </InspectorSection>
        )}

        {showSpacing && (
          <InspectorSection
            id="spacing"
            title="Spacing"
            open={openSections.spacing}
            onToggle={() => toggleSection('spacing')}
            overridden={groupOverridden(['spacing'])}
            viewport={viewport}
            onReset={() => resetGroup(['spacing'])}
          >
            <SpacingBoxModel
              margin={styles.spacing?.margin}
              padding={styles.spacing?.padding}
              onChangeMargin={(margin) =>
                updateStyles(selectedNode.id, {
                  spacing: { ...styles.spacing, margin },
                })
              }
              onChangePadding={(padding) =>
                updateStyles(selectedNode.id, {
                  spacing: { ...styles.spacing, padding },
                })
              }
            />
          </InspectorSection>
        )}

        {showTypography && isTextElement && (
          <InspectorSection
            id="typography"
            title="Typography"
            open={openSections.typography}
            onToggle={() => toggleSection('typography')}
            overridden={groupOverridden(['typography'])}
            viewport={viewport}
            onReset={() => resetGroup(['typography'])}
          >
            <TypographyControl
              typography={styles.typography}
              onChange={(typography) => updateStyles(selectedNode.id, { typography })}
            />
          </InspectorSection>
        )}

        {showColor && (
          <InspectorSection
            id="color"
            title="Color"
            open={openSections.color}
            onToggle={() => toggleSection('color')}
            overridden={groupOverridden(['typography', 'background', 'border'])}
            viewport={viewport}
            onReset={() => resetGroup(['typography', 'background', 'border'])}
          >
            <div className="space-y-3">
              <ColorControl
                label="Text color"
                value={styles.typography?.color}
                themeColors={themeColors}
                onChange={(color) => updateStyles(selectedNode.id, { typography: { color } })}
              />
              <ColorControl
                label="Background color"
                value={styles.background?.color}
                themeColors={themeColors}
                onChange={(color) => updateStyles(selectedNode.id, { background: { color } })}
              />
              <ColorControl
                label="Border color"
                value={styles.border?.color}
                themeColors={themeColors}
                onChange={(color) => updateStyles(selectedNode.id, { border: { color } })}
              />
            </div>
          </InspectorSection>
        )}

        {showBackground && (
          <InspectorSection
            id="background"
            title="Background"
            open={openSections.background}
            onToggle={() => toggleSection('background')}
            overridden={groupOverridden(['background'])}
            viewport={viewport}
            onReset={() => resetGroup(['background'])}
            icon={<Palette className="w-3.5 h-3.5 text-primary" />}
          >
            <BackgroundControl
              background={styles.background}
              onChangeBackground={(background) => updateStyles(selectedNode.id, { background })}
            />
          </InspectorSection>
        )}

        {showBorder && (
          <InspectorSection
            id="border"
            title="Border"
            open={openSections.border}
            onToggle={() => toggleSection('border')}
            overridden={groupOverridden(['border'])}
            viewport={viewport}
            onReset={() => resetGroup(['border'])}
          >
            <EffectsControl {...effectsProps} section="border" />
          </InspectorSection>
        )}

        {showRadius && (
          <InspectorSection
            id="radius"
            title="Radius"
            open={openSections.radius}
            onToggle={() => toggleSection('radius')}
            overridden={groupOverridden(['border'])}
            viewport={viewport}
            onReset={() => resetGroup(['border'])}
          >
            <EffectsControl {...effectsProps} section="radius" />
          </InspectorSection>
        )}

        {showShadow && (
          <InspectorSection
            id="shadow"
            title="Shadow"
            open={openSections.shadow}
            onToggle={() => toggleSection('shadow')}
            overridden={groupOverridden(['effects'])}
            viewport={viewport}
            onReset={() => resetGroup(['effects'])}
          >
            <EffectsControl {...effectsProps} section="shadow" />
          </InspectorSection>
        )}

        {showResponsive && (
          <InspectorSection
            id="responsive"
            title="Responsive"
            open={openSections.responsive}
            onToggle={() => toggleSection('responsive')}
            overridden={hasResponsiveOverride}
            viewport={viewport}
            onReset={() => resetViewportStyles(selectedNode.id)}
          >
            <div className="space-y-3">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Tablet and mobile edits are stored as overrides. Desktop values stay intact until you change them on
                desktop.
              </p>
              <VisibilityControl
                visibility={selectedNode.visibility}
                onChange={(visibility) => setVisibility(selectedNode.id, visibility)}
              />
            </div>
          </InspectorSection>
        )}
      </div>
    </aside>
  );
}
