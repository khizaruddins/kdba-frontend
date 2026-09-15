'use client';

import * as React from 'react';
import { ColorTokensV3 } from '@/types/v3-document';
import {
  THEME_COLOR_FALLBACKS,
  THEME_COLOR_TOKEN_KEYS,
  THEME_COLOR_TOKEN_LABELS,
  ThemeColorToken,
  hexToRgba,
  isThemeColorToken,
  parseCssColor,
} from '@/lib/editor/theme-tokens';

export interface ColorControlProps {
  label: string;
  value?: string;
  onChange: (color: string) => void;
  themeColors?: Partial<ColorTokensV3>;
}

export function ColorControl({ label, value, onChange, themeColors }: ColorControlProps) {
  const token = isThemeColorToken(value) ? value : null;
  const resolvedPreview = token
    ? themeColors?.[token] || THEME_COLOR_FALLBACKS[token]
    : value;
  const parsed = parseCssColor(resolvedPreview);
  const hex = parsed.hex;
  const opacity = Math.round(parsed.opacity * 100);

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between gap-2">
        <label className="text-[11px] font-medium text-muted-foreground">{label}</label>
        {token && (
          <span className="rounded-full border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary">
            Theme · {THEME_COLOR_TOKEN_LABELS[token]}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} picker`}
          value={hex}
          onChange={(e) => onChange(hexToRgba(e.target.value, opacity / 100))}
          className="w-8 h-8 rounded border border-border bg-transparent cursor-pointer"
        />
        <input
          type="text"
          aria-label={`${label} hex`}
          value={token || (value && value.startsWith('#') ? value : hex)}
          onChange={(e) => onChange(e.target.value)}
          className={`flex-1 h-8 px-2 rounded-lg bg-muted/50 border border-border text-foreground font-mono text-xs focus:outline-none focus:border-ring ${
            token ? '' : 'uppercase'
          }`}
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground w-14">Opacity</span>
        <input
          type="range"
          min={0}
          max={100}
          aria-label={`${label} opacity`}
          value={opacity}
          onChange={(e) => onChange(hexToRgba(hex, Number(e.target.value) / 100))}
          className="flex-1 accent-primary"
        />
        <span className="w-8 text-right font-mono text-[10px] text-primary">{opacity}%</span>
      </div>
      <div className="grid grid-cols-8 gap-1">
        {THEME_COLOR_TOKEN_KEYS.map((key: ThemeColorToken) => {
          const preview = themeColors?.[key] || THEME_COLOR_FALLBACKS[key];
          const selected = token === key;
          return (
            <button
              key={key}
              type="button"
              title={`Use theme ${THEME_COLOR_TOKEN_LABELS[key]}`}
              aria-label={`Use theme ${THEME_COLOR_TOKEN_LABELS[key]}`}
              aria-pressed={selected}
              onClick={() => onChange(key)}
              className={`h-5 rounded border transition-transform hover:scale-105 ${
                selected ? 'border-primary ring-2 ring-primary/40' : 'border-border'
              }`}
              style={{ backgroundColor: preview }}
            />
          );
        })}
      </div>
    </div>
  );
}
