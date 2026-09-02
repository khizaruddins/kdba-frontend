'use client';

import * as React from 'react';
import { StyleDefinition } from '@/types/v3-document';
import {
  ArrowRight,
  ArrowDown,
} from 'lucide-react';

export interface LayoutControlProps {
  layout?: StyleDefinition['layout'];
  flex?: StyleDefinition['flex'];
  grid?: StyleDefinition['grid'];
  onChangeLayout: (layout: StyleDefinition['layout']) => void;
  onChangeFlex: (flex: StyleDefinition['flex']) => void;
  onChangeGrid: (grid: StyleDefinition['grid']) => void;
}

export function LayoutControl({
  layout = {},
  flex = {},
  grid = {},
  onChangeLayout,
  onChangeFlex,
  onChangeGrid,
}: LayoutControlProps) {
  const display = layout.display || 'block';

  return (
    <div className="space-y-3 select-none text-xs">
      {/* Display Selector */}
      <div className="space-y-1">
        <label className="text-[11px] font-medium text-slate-400">Display</label>
        <div className="grid grid-cols-4 gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
          {[
            { id: 'block', label: 'Block' },
            { id: 'flex', label: 'Flex' },
            { id: 'grid', label: 'Grid' },
            { id: 'none', label: 'None' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                onChangeLayout({
                  ...layout,
                  display: item.id as 'flex' | 'grid' | 'block' | 'none',
                })
              }
              className={`py-1 rounded font-medium transition-colors ${
                display === item.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Flexbox Specific Controls */}
      {display === 'flex' && (
        <div className="space-y-2.5 pt-1 border-t border-slate-800/60">
          {/* Direction */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400">Direction</label>
            <div className="flex gap-1 h-8 rounded-lg bg-slate-900 p-0.5 border border-slate-800">
              <button
                type="button"
                onClick={() => onChangeFlex({ ...flex, direction: 'row' })}
                className={`flex-1 flex items-center justify-center gap-1 rounded transition-colors ${
                  flex.direction !== 'column' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Horizontal</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeFlex({ ...flex, direction: 'column' })}
                className={`flex-1 flex items-center justify-center gap-1 rounded transition-colors ${
                  flex.direction === 'column' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowDown className="w-3.5 h-3.5" />
                <span>Vertical</span>
              </button>
            </div>
          </div>

          {/* Justify & Align */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400">Justify</label>
              <select
                value={flex.justifyContent || 'flex-start'}
                onChange={(e) =>
                  onChangeFlex({
                    ...flex,
                    justifyContent: e.target.value as
                      | 'flex-start'
                      | 'flex-end'
                      | 'center'
                      | 'space-between'
                      | 'space-around',
                  })
                }
                className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none"
              >
                <option value="flex-start">Start</option>
                <option value="center">Center</option>
                <option value="flex-end">End</option>
                <option value="space-between">Between</option>
                <option value="space-around">Around</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400">Align</label>
              <select
                value={flex.alignItems || 'stretch'}
                onChange={(e) =>
                  onChangeFlex({
                    ...flex,
                    alignItems: e.target.value as
                      | 'stretch'
                      | 'center'
                      | 'flex-start'
                      | 'flex-end',
                  })
                }
                className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none"
              >
                <option value="stretch">Stretch</option>
                <option value="center">Center</option>
                <option value="flex-start">Start</option>
                <option value="flex-end">End</option>
              </select>
            </div>
          </div>

          {/* Gap */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400">Gap (px)</label>
            <input
              type="text"
              placeholder="16px"
              value={flex.gap || ''}
              onChange={(e) => onChangeFlex({ ...flex, gap: e.target.value })}
              className="w-full h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Grid Specific Controls */}
      {display === 'grid' && (
        <div className="space-y-2.5 pt-1 border-t border-slate-800/60">
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span>Columns</span>
              <span className="font-mono text-indigo-400">{grid.columns || 3}</span>
            </div>
            <input
              type="range"
              min="1"
              max="6"
              value={grid.columns || 3}
              onChange={(e) => onChangeGrid({ ...grid, columns: Number(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400">Col Gap</label>
              <input
                type="text"
                placeholder="24px"
                value={grid.columnGap || ''}
                onChange={(e) => onChangeGrid({ ...grid, columnGap: e.target.value })}
                className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400">Row Gap</label>
              <input
                type="text"
                placeholder="24px"
                value={grid.rowGap || ''}
                onChange={(e) => onChangeGrid({ ...grid, rowGap: e.target.value })}
                className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
