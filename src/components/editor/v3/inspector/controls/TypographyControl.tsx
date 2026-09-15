'use client';

import * as React from 'react';
import { StyleDefinition } from '@/types/v3-document';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

export interface TypographyControlProps {
  typography?: StyleDefinition['typography'];
  onChange: (typography: StyleDefinition['typography']) => void;
}

const POPULAR_FONTS = [
  'Inter',
  'Sora',
  'Urbanist',
  'Plus Jakarta Sans',
  'Outfit',
  'Roboto',
  'Playfair Display',
  'Geist',
];

const WEIGHTS = [
  { label: 'Regular (400)', value: '400' },
  { label: 'Medium (500)', value: '500' },
  { label: 'Semi Bold (600)', value: '600' },
  { label: 'Bold (700)', value: '700' },
  { label: 'Extra Bold (800)', value: '800' },
];

export function TypographyControl({ typography = {}, onChange }: TypographyControlProps) {
  const parseNum = (val?: string | number, fallback = '16') => {
    if (!val) return fallback;
    return String(val).replace('px', '').trim();
  };

  const handleChange = (key: keyof NonNullable<StyleDefinition['typography']>, val: string | number) => {
    onChange({ ...typography, [key]: val });
  };

  return (
    <div className="space-y-3 select-none text-xs">
      {/* Font Family */}
      <div className="space-y-1">
        <label className="text-[11px] font-medium text-muted-foreground">Typeface</label>
        <select
          value={typography.fontFamily || 'Inter'}
          onChange={(e) => handleChange('fontFamily', e.target.value)}
          className="w-full h-8 px-2.5 rounded-lg bg-muted/50 border border-border text-foreground text-xs focus:outline-none focus:border-ring cursor-pointer"
        >
          {POPULAR_FONTS.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
      </div>

      {/* Weight & Size in 2 Columns */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-muted-foreground">Weight</label>
          <select
            value={String(typography.fontWeight || '400')}
            onChange={(e) => handleChange('fontWeight', e.target.value)}
            className="w-full h-8 px-2 rounded-lg bg-muted/50 border border-border text-foreground text-xs focus:outline-none focus:border-ring cursor-pointer"
          >
            {WEIGHTS.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-muted-foreground">Size (px)</label>
          <div className="relative">
            <input
              type="number"
              min="10"
              max="160"
              value={parseNum(typography.fontSize, '16')}
              onChange={(e) => handleChange('fontSize', `${e.target.value}px`)}
              className="w-full h-8 pl-2.5 pr-6 rounded-lg bg-muted/50 border border-border text-foreground text-xs focus:outline-none focus:border-ring"
            />
            <span className="absolute right-2 top-2 text-[10px] text-muted-foreground">px</span>
          </div>
        </div>
      </div>

      {/* Line Height & Letter Spacing */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-muted-foreground">Line Height</label>
          <input
            type="text"
            placeholder="1.4"
            value={typography.lineHeight || ''}
            onChange={(e) => handleChange('lineHeight', e.target.value)}
            className="w-full h-8 px-2.5 rounded-lg bg-muted/50 border border-border text-foreground text-xs focus:outline-none focus:border-ring"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-muted-foreground">Letter Spacing</label>
          <input
            type="text"
            placeholder="-0.02em"
            value={typography.letterSpacing || ''}
            onChange={(e) => handleChange('letterSpacing', e.target.value)}
            className="w-full h-8 px-2.5 rounded-lg bg-muted/50 border border-border text-foreground text-xs focus:outline-none focus:border-ring"
          />
        </div>
      </div>

      {/* Alignment & Transform */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* Alignment */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-muted-foreground">Align</label>
          <div className="flex h-8 rounded-lg bg-muted/50 p-0.5 border border-border">
            {[
              { align: 'left', icon: <AlignLeft className="w-3.5 h-3.5" /> },
              { align: 'center', icon: <AlignCenter className="w-3.5 h-3.5" /> },
              { align: 'right', icon: <AlignRight className="w-3.5 h-3.5" /> },
              { align: 'justify', icon: <AlignJustify className="w-3.5 h-3.5" /> },
            ].map(({ align, icon }) => (
              <button
                key={align}
                type="button"
                onClick={() => handleChange('textAlign', align)}
                className={`flex-1 flex items-center justify-center rounded transition-colors ${
                  typography.textAlign === align
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Text Transform */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-muted-foreground">Case</label>
          <div className="flex h-8 rounded-lg bg-muted/50 p-0.5 border border-border font-bold text-[10px]">
            {[
              { val: 'uppercase', label: 'AG' },
              { val: 'capitalize', label: 'Ag' },
              { val: 'lowercase', label: 'ag' },
              { val: 'none', label: '—' },
            ].map(({ val, label }) => (
              <button
                key={val}
                type="button"
                onClick={() => handleChange('textTransform', val)}
                className={`flex-1 flex items-center justify-center rounded transition-colors ${
                  typography.textTransform === val
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Color Swatch & Hex */}
      <div className="space-y-1 pt-1">
        <label className="text-[11px] font-medium text-muted-foreground">Color</label>
        <div className="flex items-center gap-2 h-8 px-2 rounded-lg bg-muted/50 border border-border">
          <input
            type="color"
            value={typography.color || '#FFFFFF'}
            onChange={(e) => handleChange('color', e.target.value)}
            className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
          />
          <input
            type="text"
            value={typography.color || '#FFFFFF'}
            onChange={(e) => handleChange('color', e.target.value)}
            className="flex-1 bg-transparent text-foreground text-xs font-mono uppercase focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
