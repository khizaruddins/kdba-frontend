'use client';

import * as React from 'react';
import { StyleDefinition } from '@/types/v3-document';
import { Image as ImageIcon, Trash2, Check } from 'lucide-react';

export interface BackgroundControlProps {
  background?: StyleDefinition['background'];
  onChangeBackground: (background: StyleDefinition['background']) => void;
}

const PRESET_SWATCHES = [
  { label: 'Transparent', value: 'transparent' },
  { label: 'Deep Dark', value: '#0B0D13' },
  { label: 'Surface Dark', value: '#131620' },
  { label: 'Slate Navy', value: '#0F172A' },
  { label: 'Charcoal', value: '#1E293B' },
  { label: 'Brand Indigo', value: '#4F46E5' },
  { label: 'Brand Accent', value: '#06B6D4' },
  { label: 'Emerald Green', value: '#10B981' },
  { label: 'Amber Warm', value: '#F59E0B' },
  { label: 'Crimson', value: '#EF4444' },
  { label: 'Pure White', value: '#FFFFFF' },
  { label: 'Pure Black', value: '#000000' },
];

export function BackgroundControl({ background = {}, onChangeBackground }: BackgroundControlProps) {
  const currentColor = background.color || 'transparent';
  const currentImage = background.image || '';

  // Hex color for HTML color picker (defaults to #000000 if transparent)
  const hexPickerValue = currentColor.startsWith('#')
    ? currentColor.length === 4
      ? `#${currentColor[1]}${currentColor[1]}${currentColor[2]}${currentColor[2]}${currentColor[3]}${currentColor[3]}`
      : currentColor.slice(0, 7)
    : '#0F172A';

  const handleColorChange = (newColor: string) => {
    onChangeBackground({
      ...background,
      color: newColor,
    });
  };

  const handleImageChange = (newImage: string) => {
    onChangeBackground({
      ...background,
      image: newImage || undefined,
      size: background.size || 'cover',
      position: background.position || 'center',
      repeat: background.repeat || 'no-repeat',
    });
  };

  return (
    <div className="space-y-3.5 select-none text-xs">
      {/* 1. Background Color Picker & Hex Input */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-slate-400">Background Color</label>
        <div className="flex items-center gap-2">
          {/* Visual Swatch with Native Color Picker Trigger */}
          <div className="relative w-9 h-8 rounded-lg border border-slate-800 bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 shadow-sm cursor-pointer group">
            <div
              className="w-full h-full"
              style={{
                backgroundColor: currentColor === 'transparent' ? 'transparent' : currentColor,
                backgroundImage:
                  currentColor === 'transparent'
                    ? 'linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%)'
                    : undefined,
                backgroundSize: '8px 8px',
                backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
              }}
            />
            <input
              type="color"
              value={hexPickerValue}
              onChange={(e) => handleColorChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              title="Click to choose background color"
            />
          </div>

          {/* Hex Value Input */}
          <input
            type="text"
            value={currentColor}
            onChange={(e) => handleColorChange(e.target.value)}
            placeholder="#0F172A or transparent"
            className="flex-1 h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs font-mono uppercase focus:border-indigo-500 focus:outline-none transition-colors"
          />

          {/* Clear / Transparent Quick Button */}
          {currentColor !== 'transparent' && (
            <button
              type="button"
              onClick={() => handleColorChange('transparent')}
              title="Set to transparent"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Preset Swatches Palette */}
      <div className="space-y-1">
        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Preset Swatches</label>
        <div className="grid grid-cols-6 gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
          {PRESET_SWATCHES.map((swatch) => (
            <button
              key={swatch.value}
              type="button"
              onClick={() => handleColorChange(swatch.value)}
              title={swatch.label}
              className={`group relative h-6 rounded-md border flex items-center justify-center transition-transform hover:scale-105 ${
                currentColor.toLowerCase() === swatch.value.toLowerCase()
                  ? 'border-indigo-500 ring-2 ring-indigo-500/40'
                  : 'border-slate-800 hover:border-slate-600'
              }`}
              style={{
                backgroundColor: swatch.value === 'transparent' ? 'transparent' : swatch.value,
                backgroundImage:
                  swatch.value === 'transparent'
                    ? 'linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%)'
                    : undefined,
                backgroundSize: '6px 6px',
              }}
            >
              {currentColor.toLowerCase() === swatch.value.toLowerCase() && (
                <Check
                  className={`w-3 h-3 ${
                    swatch.value === '#FFFFFF' || swatch.value === 'transparent' ? 'text-black' : 'text-white'
                  }`}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Optional Background Image */}
      <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
        <label className="text-[11px] font-medium text-slate-400">Background Image URL (Optional)</label>
        <div className="flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <input
            type="text"
            value={currentImage}
            onChange={(e) => handleImageChange(e.target.value)}
            placeholder="https://... image pattern or photo"
            className="flex-1 h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
          />
          {currentImage && (
            <button
              type="button"
              onClick={() => handleImageChange('')}
              title="Clear background image"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
