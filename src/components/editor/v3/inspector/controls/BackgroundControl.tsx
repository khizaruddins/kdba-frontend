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

type BackgroundMode = 'solid' | 'gradient' | 'image';

function currentMode(background: NonNullable<StyleDefinition['background']>): BackgroundMode {
  if (background.gradient?.stops?.length) return 'gradient';
  if (background.image) return 'image';
  return 'solid';
}

export function BackgroundControl({ background = {}, onChangeBackground }: BackgroundControlProps) {
  const mode = currentMode(background);
  const currentColor = background.color || 'transparent';
  const currentImage = background.image || '';
  const gradient = background.gradient || {
    type: 'linear' as const,
    angle: 135,
    stops: [
      { color: currentColor === 'transparent' ? '#0B0D13' : currentColor, offset: 0 },
      { color: '#4F46E5', offset: 100 },
    ],
  };

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
      gradient: undefined,
      image: newImage || undefined,
      size: background.size || 'cover',
      position: background.position || 'center',
      repeat: background.repeat || 'no-repeat',
    });
  };

  const setMode = (next: BackgroundMode) => {
    if (next === 'solid') {
      onChangeBackground({ ...background, gradient: undefined, image: undefined });
      return;
    }
    if (next === 'gradient') {
      onChangeBackground({
        ...background,
        image: undefined,
        gradient,
      });
      return;
    }
    onChangeBackground({
      ...background,
      gradient: undefined,
      image: currentImage || undefined,
      size: background.size || 'cover',
      position: background.position || 'center',
      repeat: background.repeat || 'no-repeat',
    });
  };

  const updateStop = (index: number, patch: { color?: string; offset?: number }) => {
    const stops = gradient.stops.map((stop, i) => (i === index ? { ...stop, ...patch } : stop));
    onChangeBackground({ ...background, image: undefined, gradient: { ...gradient, stops } });
  };

  return (
    <div className="space-y-3.5 select-none text-xs">
      <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800">
        {([
          { id: 'solid', label: 'Solid' },
          { id: 'gradient', label: 'Gradient' },
          { id: 'image', label: 'Image' },
        ] as const).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMode(item.id)}
            className={`py-1 rounded font-medium ${
              mode === item.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {mode !== 'gradient' && (
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-slate-400">Background Color</label>
          <div className="flex items-center gap-2">
            <div className="relative w-9 h-8 rounded-lg border border-slate-800 bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 shadow-sm cursor-pointer">
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
            <input
              type="text"
              value={currentColor}
              onChange={(e) => handleColorChange(e.target.value)}
              placeholder="#0F172A or transparent"
              className="flex-1 h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs font-mono uppercase focus:border-indigo-500 focus:outline-none transition-colors"
            />
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
      )}

      {mode === 'solid' && (
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
      )}

      {mode === 'gradient' && (
        <div className="space-y-2.5">
          <div
            className="h-10 rounded-lg border border-slate-800"
            style={{
              backgroundImage: `linear-gradient(${gradient.angle || 135}deg, ${gradient.stops
                .map((stop) => `${stop.color} ${stop.offset}%`)
                .join(', ')})`,
            }}
          />
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Angle</span>
              <span className="font-mono text-indigo-300">{gradient.angle || 135}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              value={gradient.angle || 135}
              onChange={(e) =>
                onChangeBackground({
                  ...background,
                  image: undefined,
                  gradient: { ...gradient, angle: Number(e.target.value) },
                })
              }
              className="w-full accent-indigo-500"
            />
          </div>
          {gradient.stops.slice(0, 2).map((stop, index) => (
            <div key={index} className="grid grid-cols-[auto_1fr_64px] gap-2 items-center">
              <input
                type="color"
                aria-label={`Gradient stop ${index + 1}`}
                value={stop.color.startsWith('#') ? stop.color.slice(0, 7) : '#4F46E5'}
                onChange={(e) => updateStop(index, { color: e.target.value })}
                className="w-8 h-8 rounded border border-slate-800 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={stop.color}
                onChange={(e) => updateStop(index, { color: e.target.value })}
                className="h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-100"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={stop.offset}
                onChange={(e) => updateStop(index, { offset: Number(e.target.value) })}
                className="h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100"
                aria-label={`Stop ${index + 1} offset`}
              />
            </div>
          ))}
        </div>
      )}

      {mode === 'image' && (
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-slate-400">Background Image URL</label>
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
      )}
    </div>
  );
}
