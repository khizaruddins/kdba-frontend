'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { persistableManifestItems } from '@/lib/document/v3-wire';
import { NodeType } from '@/types/v3-document';
import {
  BLOCK_LIBRARY_CATEGORIES,
  SECTION_PRESETS,
  getPresetCategory,
} from '@/lib/editor/section-presets';
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
          preset.name.toLowerCase().includes(query) ||
          preset.description.toLowerCase().includes(query) ||
          getPresetCategory(preset).toLowerCase().includes(query) ||
          (preset.variantLabel || '').toLowerCase().includes(query),
      )
    : SECTION_PRESETS;

  const leftoverPresets = filteredPresets.filter(
    (preset) =>
      !(BLOCK_LIBRARY_CATEGORIES as readonly string[]).includes(getPresetCategory(preset)),
  );

  const handleAddElement = (type: NodeType) => {
    if (type === 'contact-form') {
      window.dispatchEvent(new Event('kdba-editor-contact-picker'));
      return;
    }
    const created = insertNodeType(type, selectedNodeId);
    if (created && ['heading', 'paragraph', 'text', 'button'].includes(type)) {
      useV3EditorStore.getState().setInlineEditingNodeId(created.id);
    }
  };

  const renderCategory = (category: string, body: React.ReactNode, empty: boolean) => {
    if (empty) return null;
    const isCollapsed = collapsedCategories[category];
    return (
      <div key={category} className="space-y-1.5">
        <button
          type="button"
          onClick={() => toggleCategory(category)}
          className="w-full flex items-center justify-between px-1 py-1 text-xs font-bold text-muted-foreground hover:text-foreground"
        >
          <span>{category}</span>
          {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
        {!isCollapsed && <div className="grid grid-cols-2 gap-1.5">{body}</div>}
      </div>
    );
  };

  return (
    <div className="flex h-full w-full min-w-0 shrink-0 flex-col overflow-hidden border-r border-border bg-card z-20 select-none">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-bold text-sm text-foreground tracking-tight">Add Elements</h3>
        <button
          type="button"
          onClick={() => setActiveNavTab(null)}
          className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-muted/50 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {DISPLAY_CATEGORIES.map((category) => {
          const itemsInCat = filteredItems.filter(
            (item) => displayCategory(item.type, item.category) === category,
          );
          return renderCategory(
            category,
            itemsInCat.map((item) => (
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
                className="group flex flex-col p-2.5 rounded-xl bg-muted/40 hover:bg-muted border border-border hover:border-primary/50 cursor-pointer transition-all duration-150 active:scale-95"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 rounded-lg bg-muted group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary transition-colors">
                    {ICON_MAP[item.icon] || <Box className="w-4 h-4" />}
                  </div>
                  <span className="font-semibold text-xs text-foreground group-hover:text-foreground">
                    {item.name}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            )),
            itemsInCat.length === 0,
          );
        })}

        {BLOCK_LIBRARY_CATEGORIES.map((category) => {
          const presets = filteredPresets.filter((preset) => getPresetCategory(preset) === category);
          return renderCategory(
            category,
            presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => insertSectionPreset(preset.build())}
                className="group flex flex-col p-2.5 rounded-xl bg-muted/40 hover:bg-muted border border-border hover:border-primary/50 text-left"
              >
                <span className="font-semibold text-xs text-foreground">{preset.name}</span>
                <p className="text-[10px] text-muted-foreground line-clamp-2">
                  {preset.variantLabel ? `${preset.variantLabel} · ${preset.description}` : preset.description}
                </p>
              </button>
            )),
            presets.length === 0,
          );
        })}

        {renderCategory(
          'Sections',
          leftoverPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => insertSectionPreset(preset.build())}
              className="group flex flex-col p-2.5 rounded-xl bg-muted/40 hover:bg-muted border border-border hover:border-primary/50 text-left"
            >
              <span className="font-semibold text-xs text-foreground">{preset.name}</span>
              <p className="text-[10px] text-muted-foreground line-clamp-2">{preset.description}</p>
            </button>
          )),
          leftoverPresets.length === 0,
        )}
      </div>
    </div>
  );
}
