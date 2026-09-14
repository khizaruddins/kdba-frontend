'use client';

import * as React from 'react';
import { StyleDefinition } from '@/types/v3-document';
import { Link2, Unlink } from 'lucide-react';
import { hexToRgba, parseCssColor } from '@/lib/editor/theme-tokens';

export interface EffectsControlProps {
  size?: StyleDefinition['size'];
  border?: StyleDefinition['border'];
  effects?: StyleDefinition['effects'];
  onChangeSize: (size: StyleDefinition['size']) => void;
  onChangeBorder: (border: StyleDefinition['border']) => void;
  onChangeEffects: (effects: StyleDefinition['effects']) => void;
  section?: 'border' | 'radius' | 'shadow' | 'all';
}

export function EffectsControl({
  border = {},
  effects = {},
  onChangeBorder,
  onChangeEffects,
  section = 'all',
}: EffectsControlProps) {
  const [radiusLinked, setRadiusLinked] = React.useState(true);

  const shadow = Array.isArray(effects.boxShadow)
    ? effects.boxShadow[0] || { x: 0, y: 4, blur: 16, spread: 0, color: 'rgba(0,0,0,0.2)' }
    : effects.boxShadow || { x: 0, y: 4, blur: 16, spread: 0, color: 'rgba(0,0,0,0.2)' };

  const handleRadiusChange = (side: 'all' | 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft', val: string) => {
    const px = val ? `${val.replace('px', '')}px` : '0px';
    if (radiusLinked) {
      onChangeBorder({ ...border, radius: { all: px } });
    } else {
      onChangeBorder({
        ...border,
        radius: {
          ...border.radius,
          [side]: px,
        },
      });
    }
  };

  const updateShadowProp = (prop: 'x' | 'y' | 'blur' | 'spread' | 'color', val: number | string) => {
    const updated = { ...shadow, [prop]: val };
    onChangeEffects({ ...effects, boxShadow: updated });
  };

  const shadowColor = parseCssColor(shadow.color);
  const showBorder = section === 'all' || section === 'border';
  const showRadius = section === 'all' || section === 'radius';
  const showShadow = section === 'all' || section === 'shadow';

  return (
    <div className="space-y-4 select-none text-xs">
      {showRadius && (
        <div className={`space-y-2 ${section === 'all' ? 'pt-2 border-t border-slate-800/80' : ''}`}>
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-slate-300">Corner radius</label>
            <button
              type="button"
              onClick={() => setRadiusLinked(!radiusLinked)}
              className="p-1 text-slate-400 hover:text-white"
              aria-label={radiusLinked ? 'Unlink radius' : 'Link radius'}
            >
              {radiusLinked ? <Link2 className="w-3.5 h-3.5 text-indigo-400" /> : <Unlink className="w-3.5 h-3.5" />}
            </button>
          </div>

          {radiusLinked ? (
            <div className="space-y-1">
              <input
                type="text"
                placeholder="8px"
                value={(border.radius?.all || '').replace('px', '')}
                onChange={(e) => handleRadiusChange('all', e.target.value)}
                className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none"
              />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-1">
              {['topLeft', 'topRight', 'bottomRight', 'bottomLeft'].map((corner) => (
                <input
                  key={corner}
                  type="text"
                  placeholder="0"
                  value={(border.radius?.[corner as keyof typeof border.radius] || '').replace('px', '')}
                  onChange={(e) =>
                    handleRadiusChange(
                      corner as 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft',
                      e.target.value,
                    )
                  }
                  className="w-full h-8 text-center rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {showBorder && (
        <div className={`grid grid-cols-3 gap-2 ${section === 'all' ? 'pt-1' : ''}`}>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500">Width</label>
            <input
              type="text"
              placeholder="1px"
              value={border.width || ''}
              onChange={(e) => onChangeBorder({ ...border, width: e.target.value })}
              className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500">Style</label>
            <select
              value={border.style || 'solid'}
              onChange={(e) =>
                onChangeBorder({
                  ...border,
                  style: e.target.value as 'solid' | 'dashed' | 'dotted' | 'double' | 'none',
                })
              }
              className="w-full h-8 px-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="none">None</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500">Color</label>
            <div className="flex items-center gap-1.5 h-8 px-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <input
                type="color"
                value={border.color?.startsWith('#') ? border.color : '#2A3042'}
                onChange={(e) => onChangeBorder({ ...border, color: e.target.value })}
                className="w-4 h-4 rounded border-0 p-0 bg-transparent cursor-pointer"
              />
              <span className="text-[10px] font-mono text-slate-300 truncate">{border.color || '#2A3042'}</span>
            </div>
          </div>
        </div>
      )}

      {showShadow && (
        <div className={`space-y-2 ${section === 'all' ? 'pt-2 border-t border-slate-800/80' : ''}`}>
          <label className="text-[11px] font-semibold text-slate-300">Box Shadow</label>
          <div className="grid grid-cols-4 gap-1.5">
            <div className="space-y-1">
              <label className="text-[9px] text-slate-500">X</label>
              <input
                type="number"
                value={shadow.x}
                onChange={(e) => updateShadowProp('x', Number(e.target.value))}
                className="w-full h-7 text-center rounded bg-slate-900 border border-slate-800 text-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-slate-500">Y</label>
              <input
                type="number"
                value={shadow.y}
                onChange={(e) => updateShadowProp('y', Number(e.target.value))}
                className="w-full h-7 text-center rounded bg-slate-900 border border-slate-800 text-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-slate-500">Blur</label>
              <input
                type="number"
                min="0"
                value={shadow.blur}
                onChange={(e) => updateShadowProp('blur', Number(e.target.value))}
                className="w-full h-7 text-center rounded bg-slate-900 border border-slate-800 text-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-slate-500">Spread</label>
              <input
                type="number"
                value={shadow.spread}
                onChange={(e) => updateShadowProp('spread', Number(e.target.value))}
                className="w-full h-7 text-center rounded bg-slate-900 border border-slate-800 text-slate-200 text-xs"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              aria-label="Shadow color"
              value={shadowColor.hex}
              onChange={(e) => updateShadowProp('color', hexToRgba(e.target.value, shadowColor.opacity))}
              className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={shadow.color || ''}
              onChange={(e) => updateShadowProp('color', e.target.value)}
              className="flex-1 h-7 px-2 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200"
              placeholder="#000000"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 w-14">Opacity</span>
            <input
              type="range"
              min={0}
              max={100}
              aria-label="Shadow opacity"
              value={Math.round(shadowColor.opacity * 100)}
              onChange={(e) =>
                updateShadowProp('color', hexToRgba(shadowColor.hex, Number(e.target.value) / 100))
              }
              className="flex-1 accent-indigo-500"
            />
            <span className="w-8 text-right font-mono text-[10px] text-indigo-300">
              {Math.round(shadowColor.opacity * 100)}%
            </span>
          </div>
        </div>
      )}

      {section === 'all' && (
        <div className="space-y-1 pt-2 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-[11px]">
            <span className="font-semibold text-slate-300">Layer opacity</span>
            <span className="font-mono text-indigo-400">
              {Math.round((effects.opacity ?? 1) * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round((effects.opacity ?? 1) * 100)}
            onChange={(e) => onChangeEffects({ ...effects, opacity: Number(e.target.value) / 100 })}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
