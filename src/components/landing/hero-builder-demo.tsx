'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  CheckCircle2,
  Rocket,
  Palette,
  Layers,
  Plus,
  Type,
  SquarePlay,
  CreditCard,
  MessageSquareQuote,
  Trash2,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

let demoCounter = 100;
function getNextDemoId() {
  return `elem-${++demoCounter}`;
}

interface CanvasElement {
  id: string;
  type: 'heading' | 'paragraph' | 'button' | 'pricing' | 'quote' | 'image';
  name: string;
  props: Record<string, string | number | boolean>;
  styles: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
    marginTop?: string;
    padding?: string;
  };
}

const INITIAL_ELEMENTS: CanvasElement[] = [
  {
    id: 'elem-h1',
    type: 'heading',
    name: 'Hero Title',
    props: { text: 'Next-Gen Visual Website Studio' },
    styles: { fontSize: '36px', fontWeight: '800', color: '#FFFFFF', textAlign: 'left', marginTop: '0px' },
  },
  {
    id: 'elem-p1',
    type: 'paragraph',
    name: 'Body Subtitle',
    props: { text: 'Drag, drop, and customize with pixel-perfect precision. Built for creators and growing businesses.' },
    styles: { fontSize: '15px', fontWeight: '400', color: '#94A3B8', textAlign: 'left', marginTop: '12px' },
  },
  {
    id: 'elem-btn1',
    type: 'button',
    name: 'CTA Button',
    props: { label: 'Start Building Free →' },
    styles: { fontSize: '14px', fontWeight: '700', color: '#0F172A', textAlign: 'center', marginTop: '20px' },
  },
];

const ADDABLE_ELEMENTS = [
  { type: 'heading', name: 'Heading', icon: Type, desc: 'Large title or section header' },
  { type: 'button', name: 'Button', icon: SquarePlay, desc: 'Interactive call-to-action button' },
  { type: 'pricing', name: 'Pricing Card', icon: CreditCard, desc: 'Pro pricing tier with features' },
  { type: 'quote', name: 'Quote Card', icon: MessageSquareQuote, desc: 'Customer testimonial showcase' },
];

export function HeroBuilderDemo() {
  const [elements, setElements] = React.useState<CanvasElement[]>(INITIAL_ELEMENTS);
  const [selectedId, setSelectedId] = React.useState<string>('elem-h1');
  const [viewport, setViewport] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [accentColor, setAccentColor] = React.useState('#4F46E5');
  const [isPublished, setIsPublished] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'add' | 'layers' | 'design'>('add');
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  const selectedElement = elements.find((e) => e.id === selectedId) || elements[0];

  const handlePublish = () => {
    setIsPublished(true);
    setTimeout(() => setIsPublished(false), 3500);
  };

  const handleAddElement = (type: string) => {
    const newId = getNextDemoId();
    let newElement: CanvasElement;

    switch (type) {
      case 'heading':
        newElement = {
          id: newId,
          type: 'heading',
          name: 'Section Heading',
          props: { text: 'Engineered for Conversion' },
          styles: { fontSize: '28px', fontWeight: '700', color: '#FFFFFF', textAlign: 'left', marginTop: '16px' },
        };
        break;
      case 'button':
        newElement = {
          id: newId,
          type: 'button',
          name: 'Action Button',
          props: { label: 'Learn More' },
          styles: { fontSize: '14px', fontWeight: '600', color: '#FFFFFF', textAlign: 'center', marginTop: '16px' },
        };
        break;
      case 'pricing':
        newElement = {
          id: newId,
          type: 'pricing',
          name: 'Pricing Tier',
          props: { plan: 'Pro Studio', price: '$49/mo', feature: 'Unlimited Pages & Custom Domain' },
          styles: { fontSize: '14px', marginTop: '20px' },
        };
        break;
      case 'quote':
        newElement = {
          id: newId,
          type: 'quote',
          name: 'Customer Quote',
          props: { quote: 'KDBA gives us total creative freedom without touching code.', author: 'Elena Rostova, Studio Lead' },
          styles: { fontSize: '14px', marginTop: '20px' },
        };
        break;
      default:
        return;
    }

    setElements([...elements, newElement]);
    setSelectedId(newId);
  };

  const handleDuplicate = (id: string) => {
    const el = elements.find((e) => e.id === id);
    if (!el) return;
    const copy: CanvasElement = { ...el, id: getNextDemoId(), name: `${el.name} (Copy)` };
    setElements([...elements, copy]);
    setSelectedId(copy.id);
  };

  const handleDelete = (id: string) => {
    if (elements.length <= 1) return;
    setElements(elements.filter((e) => e.id !== id));
    setSelectedId(elements[0].id);
  };

  const updateStyle = (key: string, val: string) => {
    setElements(
      elements.map((el) => {
        if (el.id === selectedId) {
          return {
            ...el,
            styles: { ...el.styles, [key]: val },
          };
        }
        return el;
      }),
    );
  };

  return (
    <div className="relative mx-auto w-full max-w-6xl select-none">
      {/* Outer Studio Window */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B0D13] shadow-sm">
        {/* 1. Studio Top Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 bg-[#0f1422] px-4 py-2.5 sm:px-6">
          {/* Left: Window Controls + Site Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs text-slate-300">
              <span className="font-bold text-white tracking-tight">KDBA Studio</span>
              <span className="text-slate-500">/</span>
              <span className="font-mono text-[11px] text-indigo-400">visual-drag-drop</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              <span>Saved, just now</span>
            </div>
          </div>

          {/* Center: Device Viewport Switcher */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1">
            {[
              { id: 'desktop' as const, label: 'Desktop', icon: Monitor },
              { id: 'tablet' as const, label: 'Tablet', icon: Tablet },
              { id: 'mobile' as const, label: 'Mobile', icon: Smartphone },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setViewport(id)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  viewport === id
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Right: Publish Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePublish}
              style={{ backgroundColor: accentColor }}
              className="flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-black text-white shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Rocket className="h-3.5 w-3.5" />
              <span>{isPublished ? 'Published Live!' : 'Publish'}</span>
            </button>
          </div>
        </div>

        {/* 2. Builder Workspace (3-Pane Layout) */}
        <div className="flex min-h-[520px] bg-[#0B0D13]">
          {/* Left Rail */}
          <div className="w-12 shrink-0 border-r border-white/5 bg-[#090D16] flex flex-col items-center py-3 gap-2">
            {[
              { id: 'add' as const, icon: Plus, title: 'Add Elements' },
              { id: 'layers' as const, icon: Layers, title: 'Layers' },
              { id: 'design' as const, icon: Palette, title: 'Theme Tokens' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  title={tab.title}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>

          {/* Left Flyout Drawer */}
          <div className="w-56 shrink-0 border-r border-white/5 bg-[#0f1422] p-3 flex flex-col gap-3">
            {activeTab === 'add' && (
              <>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Drag & Drop Elements
                </div>
                <div className="space-y-1.5 flex-1 overflow-y-auto">
                  {ADDABLE_ELEMENTS.map((elem) => {
                    const Icon = elem.icon;
                    return (
                      <div
                        key={elem.type}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', elem.type)}
                        onClick={() => handleAddElement(elem.type)}
                        className="group flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 cursor-pointer transition-all active:scale-95"
                      >
                        <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-colors">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-200 group-hover:text-white">
                            {elem.name}
                          </div>
                          <div className="text-[9px] text-slate-500 truncate max-w-[120px]">
                            {elem.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-900/30 text-[10px] text-indigo-300 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Click or drag element to insert into page.</span>
                </div>
              </>
            )}

            {activeTab === 'layers' && (
              <>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Page Layers
                </div>
                <div className="space-y-1">
                  {elements.map((el) => (
                    <div
                      key={el.id}
                      onClick={() => setSelectedId(el.id)}
                      className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        selectedId === el.id
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{el.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(el.id);
                        }}
                        className="opacity-60 hover:opacity-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'design' && (
              <>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Theme Accent
                </div>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {['#4F46E5', '#F97316', '#10B981', '#EC4899', '#06B6D4', '#8B5CF6', '#F59E0B', '#3B82F6'].map(
                    (color) => (
                      <button
                        key={color}
                        onClick={() => setAccentColor(color)}
                        style={{ backgroundColor: color }}
                        className={`h-7 w-7 rounded-lg transition-transform hover:scale-110 cursor-pointer ${
                          accentColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-105' : ''
                        }`}
                      />
                    ),
                  )}
                </div>
              </>
            )}
          </div>

          {/* Central Interactive Drag & Drop Canvas */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverIndex(elements.length);
            }}
            onDragLeave={() => setDragOverIndex(null)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOverIndex(null);
              const type = e.dataTransfer.getData('text/plain');
              if (type) handleAddElement(type);
            }}
            className="flex-1 flex justify-center items-start p-4 sm:p-8 overflow-y-auto bg-[#0B0D13] relative"
          >
            <motion.div
              layout
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                width: viewport === 'desktop' ? '100%' : viewport === 'tablet' ? '560px' : '320px',
                maxWidth: '100%',
              }}
              className="relative rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl p-6 sm:p-8 space-y-4"
            >
              {/* Device Header Tag */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-[11px] text-slate-500">
                <div className="flex items-center gap-2 font-mono">
                  <span>SECTION // HERO_CONTAINER</span>
                </div>
                <span className="uppercase text-[9px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                  {viewport}
                </span>
              </div>

              {/* Editable Elements List */}
              <div className="space-y-3 relative">
                {elements.map((el) => {
                  const isSelected = el.id === selectedId;

                  return (
                    <div
                      key={el.id}
                      onClick={() => setSelectedId(el.id)}
                      className={`relative group rounded-xl p-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'outline outline-2 outline-indigo-500 bg-slate-900/40'
                          : 'hover:outline hover:outline-1 hover:outline-slate-700 hover:bg-slate-900/20'
                      }`}
                    >
                      {/* Floating Context Toolbar when Selected */}
                      {isSelected && (
                        <div className="absolute -top-8 right-2 flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 shadow-xl text-slate-300 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicate(el.id);
                            }}
                            title="Duplicate"
                            className="p-1 hover:text-white rounded"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(el.id);
                            }}
                            title="Delete"
                            className="p-1 hover:text-rose-400 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* Element Type Pill */}
                      {isSelected && (
                        <div className="absolute -top-3 left-2 px-1.5 py-0.2 rounded bg-indigo-600 text-white font-bold text-[8px] uppercase tracking-wider shadow">
                          {el.name}
                        </div>
                      )}

                      {/* Element Rendering */}
                      {el.type === 'heading' && (
                        <h2
                          style={{
                            fontSize: viewport === 'mobile' ? '24px' : el.styles.fontSize,
                            fontWeight: el.styles.fontWeight,
                            color: el.styles.color,
                            textAlign: el.styles.textAlign,
                          }}
                          className="tracking-tight leading-tight"
                        >
                          {el.props.text}
                        </h2>
                      )}

                      {el.type === 'paragraph' && (
                        <p
                          style={{
                            fontSize: el.styles.fontSize,
                            color: el.styles.color,
                            textAlign: el.styles.textAlign,
                          }}
                          className="leading-relaxed"
                        >
                          {el.props.text}
                        </p>
                      )}

                      {el.type === 'button' && (
                        <div style={{ textAlign: el.styles.textAlign }}>
                          <button
                            style={{ backgroundColor: accentColor }}
                            className="px-5 py-2.5 rounded-xl font-bold text-white text-xs shadow-lg transition-transform active:scale-95"
                          >
                            {el.props.label}
                          </button>
                        </div>
                      )}

                      {el.type === 'pricing' && (
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <div className="flex justify-between items-center text-xs font-bold text-white">
                            <span>{el.props.plan}</span>
                            <span style={{ color: accentColor }}>{el.props.price}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">{el.props.feature}</p>
                        </div>
                      )}

                      {el.type === 'quote' && (
                        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                          <p className="text-xs italic text-slate-300 leading-relaxed">&ldquo;{el.props.quote}&rdquo;</p>
                          <p className="text-[10px] font-bold text-slate-400">{el.props.author}</p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Drop indicator if active */}
                {dragOverIndex !== null && (
                  <div className="h-1 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Minimalist Inspector */}
          <div className="w-60 shrink-0 border-l border-white/5 bg-[#090D16] p-3 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
              <span>Inspector</span>
              <span className="text-indigo-400 font-mono">{selectedElement.name}</span>
            </div>

            {/* Visual Box Model */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold text-slate-400">Spacing Box Model</span>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono text-center space-y-1">
                <div className="text-[8px] text-slate-500 uppercase">Margin: 0px</div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
                  Padding: 16px
                </div>
              </div>
            </div>

            {/* Typography Controls */}
            {['heading', 'paragraph'].includes(selectedElement.type) && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-semibold text-slate-400">Typography</span>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Font Size</span>
                    <span className="font-mono text-indigo-400">{selectedElement.styles.fontSize}</span>
                  </div>
                  <input
                    type="range"
                    min="14"
                    max="64"
                    value={parseInt(selectedElement.styles.fontSize || '24')}
                    onChange={(e) => updateStyle('fontSize', `${e.target.value}px`)}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400">Align</span>
                  <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-800">
                    {['left', 'center', 'right'].map((align) => (
                      <button
                        key={align}
                        onClick={() => updateStyle('textAlign', align)}
                        className={`flex-1 py-1 rounded text-center transition-colors ${
                          selectedElement.styles.textAlign === align
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {align === 'left' && <AlignLeft className="w-3.5 h-3.5 mx-auto" />}
                        {align === 'center' && <AlignCenter className="w-3.5 h-3.5 mx-auto" />}
                        {align === 'right' && <AlignRight className="w-3.5 h-3.5 mx-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Published Toast Alert */}
        <AnimatePresence>
          {isPublished && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-6 right-6 z-30 flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl ring-1 ring-emerald-500/20"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <Rocket className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Website Published Live!</div>
                <div className="text-xs text-slate-400 font-mono">
                  https://kdba.site/my-business
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
