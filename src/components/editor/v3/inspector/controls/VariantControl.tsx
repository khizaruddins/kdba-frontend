'use client';

import * as React from 'react';
import { WebsiteNode } from '@/types/v3-document';
import {
  BUTTON_VARIANTS,
  CARD_VARIANTS,
  HEADER_VARIANTS,
  HERO_VARIANTS,
} from '@/lib/editor/variants';

export function VariantControl({
  node,
  onChangeProps,
}: {
  node: WebsiteNode;
  onChangeProps: (props: Record<string, unknown>) => void;
}) {
  const options =
    node.type === 'button'
      ? BUTTON_VARIANTS
      : node.type === 'stack' || node.type === 'container'
        ? CARD_VARIANTS
        : node.type === 'section'
          ? HERO_VARIANTS
          : node.type === 'navbar'
            ? HEADER_VARIANTS
            : null;

  if (!options) return null;

  const current = String(node.props?.variant || options[0]);
  const label =
    node.type === 'button'
      ? 'Button variant'
      : node.type === 'navbar'
        ? 'Header variant'
        : node.type === 'section'
          ? 'Section variant'
          : 'Card variant';

  return (
    <div className="space-y-1">
      <label className="text-[11px] font-medium text-slate-400">{label}</label>
      <div className="grid grid-cols-2 gap-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChangeProps({ variant: option })}
            className={`h-7 rounded-lg px-2 text-[11px] capitalize ${
              current === option
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {option.replace('-', ' ')}
          </button>
        ))}
      </div>
    </div>
  );
}
