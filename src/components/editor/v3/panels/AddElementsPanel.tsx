'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { persistableManifestItems } from '@/lib/document/v3-wire';
import { NodeType } from '@/types/v3-document';
import { SECTION_PRESETS } from '@/lib/editor/section-presets';
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  LayoutTemplate,
  Maximize2,
  Box,
  Grid,
  Columns,
  Layers,
  Heading,
  Pilcrow,
  FileText,
  Type,
  SquarePlay,
  Link,
  Image as ImageIcon,
  Video,
  Images,
  SlidersHorizontal,
  Wallpaper,
  Sparkles,
  Shield,
  Tag,
  Minus,
  MoveVertical,
  List,
  Quote,
  ClipboardList,
  Mail,
  MapPin,
  Clock,
  CreditCard,
  ShoppingBag,
  MessageSquareQuote,
  Users,
  Briefcase,
  PanelTop,
  PanelBottom,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutTemplate: <LayoutTemplate className="w-4 h-4" />,
  Maximize2: <Maximize2 className="w-4 h-4" />,
  Box: <Box className="w-4 h-4" />,
  Grid: <Grid className="w-4 h-4" />,
  Columns: <Columns className="w-4 h-4" />,
  SplitVertical: <Columns className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  Heading: <Heading className="w-4 h-4" />,
  Pilcrow: <Pilcrow className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  Type: <Type className="w-4 h-4" />,
  SquarePlay: <SquarePlay className="w-4 h-4" />,
  Link: <Link className="w-4 h-4" />,
  Image: <ImageIcon className="w-4 h-4" />,
  Video: <Video className="w-4 h-4" />,
  Images: <Images className="w-4 h-4" />,
  SlidersHorizontal: <SlidersHorizontal className="w-4 h-4" />,
  Wallpaper: <Wallpaper className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Shield: <Shield className="w-4 h-4" />,
  Tag: <Tag className="w-4 h-4" />,
  Minus: <Minus className="w-4 h-4" />,
  MoveVertical: <MoveVertical className="w-4 h-4" />,
  List: <List className="w-4 h-4" />,
  Quote: <Quote className="w-4 h-4" />,
  ClipboardList: <ClipboardList className="w-4 h-4" />,
  Mail: <Mail className="w-4 h-4" />,
  MapPin: <MapPin className="w-4 h-4" />,
  Clock: <Clock className="w-4 h-4" />,
  CreditCard: <CreditCard className="w-4 h-4" />,
  ShoppingBag: <ShoppingBag className="w-4 h-4" />,
  MessageSquareQuote: <MessageSquareQuote className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  Briefcase: <Briefcase className="w-4 h-4" />,
  PanelTop: <PanelTop className="w-4 h-4" />,
  PanelBottom: <PanelBottom className="w-4 h-4" />,
};

const DISPLAY_CATEGORIES = [
  'Layout',
  'Typography',
  'Basic',
  'Buttons',
  'Forms',
  'Media',
  'Navigation',
  'Sections',
  'Business',
] as const;

const BUSINESS_TYPES = new Set([
  'map',
  'opening-hours',
  'pricing',
  'product',
  'testimonial',
  'team',
  'service',
]);

function displayCategory(type: string, category: string): string {
  if (BUSINESS_TYPES.has(type)) return 'Business';
  if (category === 'Text') return 'Typography';
  if (category === 'Components') return 'Basic';
  return category;
}

export function AddElementsPanel() {
  const {
    setActiveNavTab,
    insertNodeType,
    insertSectionPreset,
    selectedNodeId,
    setDragState,
  } = useV3EditorStore();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [collapsedCategories, setCollapsedCategories] = React.useState<Record<string, boolean>>({});

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const allItems = persistableManifestItems();
  const query = searchQuery.trim().toLowerCase();

  const filteredItems = query
    ? allItems.filter(
        (i) =>
          i.name.toLowerCase().includes(query) ||
          i.description.toLowerCase().includes(query) ||
          displayCategory(i.type, i.category).toLowerCase().includes(query),
      )
    : allItems;

  const filteredPresets = query
    ? SECTION_PRESETS.filter(
        (preset) =>
          preset.name.toLowerCase().includes(query) || preset.description.toLowerCase().includes(query),
      )
    : SECTION_PRESETS;

  const handleAddElement = (type: NodeType) => {
    const created = insertNodeType(type, selectedNodeId);
    if (created && ['heading', 'paragraph', 'text', 'button'].includes(type)) {
      useV3EditorStore.getState().setInlineEditingNodeId(created.id);
    }
  };

  return (
    <div className="w-80 shrink-0 border-r border-slate-800/80 bg-slate-950/95 flex flex-col h-full overflow-hidden select-none z-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
        <h3 className="font-bold text-sm text-white tracking-tight">Add Elements</h3>
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
            placeholder="Search elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Categorized Element Cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {DISPLAY_CATEGORIES.map((category) => {
          const itemsInCat =
            category === 'Sections'
              ? []
              : filteredItems.filter((item) => displayCategory(item.type, item.category) === category);
          const presets = category === 'Sections' ? filteredPresets : [];
          if (itemsInCat.length === 0 && presets.length === 0) return null;

          const isCollapsed = collapsedCategories[category];

          return (
            <div key={category} className="space-y-1.5">
              <button
                type="button"
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between px-1 py-1 text-xs font-bold text-slate-400 hover:text-white"
              >
                <span>{category}</span>
                {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>

              {!isCollapsed && (
                <div className="grid grid-cols-2 gap-1.5">
                  {presets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => insertSectionPreset(preset.build())}
                      className="group flex flex-col p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/50 text-left"
                    >
                      <span className="font-semibold text-xs text-slate-200">{preset.name}</span>
                      <p className="text-[10px] text-slate-500 line-clamp-2">{preset.description}</p>
                    </button>
                  ))}
                  {itemsInCat.map((item) => (
                    <div
                      key={item.type}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = 'copy';
                        e.dataTransfer.setData('kdba/node-type', item.type);
                        setDragState(true, item.type);
                      }}
                      onDragEnd={() => setDragState(false)}
                      onClick={() => handleAddElement(item.type)}
                      className="group flex flex-col p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/50 cursor-pointer transition-all duration-150 active:scale-95"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-400 transition-colors">
                          {ICON_MAP[item.icon] || <Box className="w-4 h-4" />}
                        </div>
                        <span className="font-semibold text-xs text-slate-200 group-hover:text-white">
                          {item.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
