'use client';

import * as React from 'react';
import { ColorTokensV3, StyleDefinition, WebsiteNode } from '@/types/v3-document';
import { ColorControl } from './ColorControl';

const STATE_KEYS = ['hover', 'active', 'focus', 'disabled'] as const;

export function StatesControl({
  node,
  themeColors,
  onChangeStyles,
  onChangeProps,
}: {
  node: WebsiteNode;
  themeColors?: Partial<ColorTokensV3>;
  onChangeStyles: (styles: Partial<StyleDefinition>) => void;
  onChangeProps: (props: Record<string, unknown>) => void;
}) {
  if (!['button', 'link', 'form', 'contact-form'].includes(node.type)) return null;

  const states = node.styles?.states || {};
  const [active, setActive] = React.useState<(typeof STATE_KEYS)[number]>('hover');
  const slice = states[active] || {};

  const updateSlice = (patch: StyleDefinition) => {
    onChangeStyles({
      states: {
        ...states,
        [active]: {
          ...slice,
          ...patch,
          typography: { ...(slice.typography || {}), ...(patch.typography || {}) },
          background: { ...(slice.background || {}), ...(patch.background || {}) },
          effects: { ...(slice.effects || {}), ...(patch.effects || {}) },
        },
      },
    });
  };

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-slate-500">Structured interaction states. No custom CSS or scripts.</p>
      <div className="grid grid-cols-4 gap-1">
        {STATE_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={`h-7 rounded-lg text-[10px] capitalize ${
              active === key ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {key}
          </button>
        ))}
      </div>
      <ColorControl
        label={`${active} text`}
        value={slice.typography?.color}
        themeColors={themeColors}
        onChange={(color) => updateSlice({ typography: { color } })}
      />
      <ColorControl
        label={`${active} background`}
        value={slice.background?.color}
        themeColors={themeColors}
        onChange={(color) => updateSlice({ background: { color } })}
      />
      {node.type === 'button' && (
        <label className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>Disabled</span>
          <input
            type="checkbox"
            checked={Boolean(node.props?.disabled)}
            onChange={(e) => onChangeProps({ disabled: e.target.checked })}
            className="accent-indigo-500"
          />
        </label>
      )}
    </div>
  );
}
