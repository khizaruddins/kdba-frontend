'use client';

import * as React from 'react';
import { StyleDefinition } from '@/types/v3-document';

export interface SizeControlProps {
  size?: StyleDefinition['size'];
  layout?: StyleDefinition['layout'];
  onChangeSize: (size: StyleDefinition['size']) => void;
}

type CssUnit = 'px' | '%' | 'auto';

function parseSize(value?: string | number): { amount: string; unit: CssUnit } {
  if (value === undefined || value === null || value === '') return { amount: '', unit: 'auto' };
  if (typeof value === 'number' && Number.isFinite(value)) return { amount: String(value), unit: 'px' };
  const text = String(value);
  if (text === 'auto') return { amount: '', unit: 'auto' };
  if (text.endsWith('%')) return { amount: text.replace('%', ''), unit: '%' };
  if (text.endsWith('px')) return { amount: text.replace('px', ''), unit: 'px' };
  return { amount: text, unit: 'px' };
}

function formatSize(amount: string, unit: CssUnit): string | undefined {
  if (unit === 'auto') return 'auto';
  if (!amount.trim()) return undefined;
  return `${amount}${unit}`;
}

function SizeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (next?: string) => void;
}) {
  const parsed = parseSize(value);
  return (
    <div className="space-y-1">
      <label className="text-[10px] text-slate-500">{label}</label>
      <div className="flex gap-1">
        <input
          type="text"
          inputMode="decimal"
          disabled={parsed.unit === 'auto'}
          value={parsed.unit === 'auto' ? '' : parsed.amount}
          onChange={(e) => onChange(formatSize(e.target.value, parsed.unit))}
          placeholder={parsed.unit === 'auto' ? 'auto' : '0'}
          className="flex-1 h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none disabled:opacity-50"
        />
        <select
          aria-label={`${label} unit`}
          value={parsed.unit}
          onChange={(e) => {
            const unit = e.target.value as CssUnit;
            onChange(formatSize(parsed.amount || '100', unit));
          }}
          className="w-16 h-8 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
        >
          <option value="px">px</option>
          <option value="%">%</option>
          <option value="auto">auto</option>
        </select>
      </div>
    </div>
  );
}

export function SizeControl({ size = {}, onChangeSize }: SizeControlProps) {
  return (
    <div className="space-y-2 text-xs">
      <div className="grid grid-cols-2 gap-2">
        <SizeField label="Width" value={size.width} onChange={(width) => onChangeSize({ ...size, width })} />
        <SizeField label="Height" value={size.height} onChange={(height) => onChangeSize({ ...size, height })} />
        <SizeField
          label="Min Width"
          value={size.minWidth}
          onChange={(minWidth) => onChangeSize({ ...size, minWidth })}
        />
        <SizeField
          label="Max Width"
          value={size.maxWidth}
          onChange={(maxWidth) => onChangeSize({ ...size, maxWidth })}
        />
        <SizeField
          label="Min Height"
          value={size.minHeight}
          onChange={(minHeight) => onChangeSize({ ...size, minHeight })}
        />
      </div>
    </div>
  );
}
