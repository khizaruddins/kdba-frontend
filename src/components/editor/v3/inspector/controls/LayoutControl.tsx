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
        <label className="text-[11px] font-medium text-muted-foreground">Display</label>
        <div className="grid grid-cols-4 gap-1 p-0.5 rounded-lg bg-muted/50 border border-border text-[11px]">
          {[
            { id: 'block', label: 'Block' },
            { id: 'flex', label: 'Flex' },
            { id: 'grid', label: 'Grid' },
            { id: 'stack', label: 'Stack' },
          ].map((item) => {
            const isStack = display === 'flex' && flex.direction === 'column';
            const isActive =
              item.id === 'stack' ? isStack : item.id === 'flex' ? display === 'flex' && !isStack : display === item.id;
            return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.id === 'stack') {
                  onChangeLayout({ ...layout, display: 'flex' });
                  onChangeFlex({ ...flex, direction: 'column' });
                  return;
                }
                onChangeLayout({
                  ...layout,
                  display: item.id as 'flex' | 'grid' | 'block' | 'none',
                });
                if (item.id === 'flex' && flex.direction === 'column') {
                  onChangeFlex({ ...flex, direction: 'row' });
                }
              }}
              className={`py-1 rounded font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </button>
            );
          })}
        </div>
      </div>

      {/* Flexbox Specific Controls */}
      {display === 'flex' && (
        <div className="space-y-2.5 pt-1 border-t border-border">
          {/* Direction */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-muted-foreground">Direction</label>
            <div className="flex gap-1 h-8 rounded-lg bg-muted/50 p-0.5 border border-border">
              <button
                type="button"
                onClick={() => onChangeFlex({ ...flex, direction: 'row' })}
                className={`flex-1 flex items-center justify-center gap-1 rounded transition-colors ${
                  flex.direction !== 'column' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Horizontal</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeFlex({ ...flex, direction: 'column' })}
                className={`flex-1 flex items-center justify-center gap-1 rounded transition-colors ${
                  flex.direction === 'column' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
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
              <label className="text-[11px] font-medium text-muted-foreground">Justify</label>
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
                      | 'space-around'
                      | 'space-evenly',
                  })
                }
                className="w-full h-8 px-2 rounded-lg bg-muted/50 border border-border text-foreground text-xs focus:outline-none"
              >
                <option value="flex-start">Start</option>
                <option value="center">Center</option>
                <option value="flex-end">End</option>
                <option value="space-between">Between</option>
                <option value="space-around">Around</option>
                <option value="space-evenly">Evenly</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">Align</label>
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
                className="w-full h-8 px-2 rounded-lg bg-muted/50 border border-border text-foreground text-xs focus:outline-none"
              >
                <option value="stretch">Stretch</option>
                <option value="center">Center</option>
                <option value="flex-start">Start</option>
                <option value="flex-end">End</option>
              </select>
            </div>
          </div>

          {/* Gap & Wrap */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">Gap</label>
              <input
                type="text"
                placeholder="16px"
                value={flex.gap || ''}
                onChange={(e) => onChangeFlex({ ...flex, gap: e.target.value })}
                className="w-full h-8 px-2.5 rounded-lg bg-muted/50 border border-border text-foreground text-xs focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">Wrap</label>
              <select
                value={flex.wrap || 'nowrap'}
                onChange={(e) =>
                  onChangeFlex({ ...flex, wrap: e.target.value as 'nowrap' | 'wrap' | 'wrap-reverse' })
                }
                className="w-full h-8 px-2 rounded-lg bg-muted/50 border border-border text-foreground text-xs"
              >
                <option value="nowrap">No wrap</option>
                <option value="wrap">Wrap</option>
                <option value="wrap-reverse">Wrap reverse</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Grid Specific Controls */}
      {display === 'grid' && (
        <div className="space-y-2.5 pt-1 border-t border-border">
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[11px] text-muted-foreground">
              <span>Columns</span>
              <span className="font-mono text-primary">{grid.columns || 3}</span>
            </div>
            <input
              type="range"
              min="1"
              max="6"
              value={grid.columns || 3}
              onChange={(e) => onChangeGrid({ ...grid, columns: Number(e.target.value), autoFit: false })}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          <label className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Auto-fit columns</span>
            <input
              type="checkbox"
              checked={Boolean(grid.autoFit)}
              onChange={(e) =>
                onChangeGrid({
                  ...grid,
                  autoFit: e.target.checked,
                  minColumnWidth: grid.minColumnWidth || '240px',
                })
              }
              className="accent-primary"
            />
          </label>
          {grid.autoFit && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">Min column width</label>
              <input
                type="text"
                value={grid.minColumnWidth || '240px'}
                onChange={(e) => onChangeGrid({ ...grid, minColumnWidth: e.target.value, autoFit: true })}
                className="w-full h-8 px-2 rounded-lg bg-muted/50 border border-border text-foreground text-xs"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">Col Gap</label>
              <input
                type="text"
                placeholder="24px"
                value={grid.columnGap || ''}
                onChange={(e) => onChangeGrid({ ...grid, columnGap: e.target.value })}
                className="w-full h-8 px-2 rounded-lg bg-muted/50 border border-border text-foreground text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">Row Gap</label>
              <input
                type="text"
                placeholder="24px"
                value={grid.rowGap || ''}
                onChange={(e) => onChangeGrid({ ...grid, rowGap: e.target.value })}
                className="w-full h-8 px-2 rounded-lg bg-muted/50 border border-border text-foreground text-xs"
              />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-1 pt-1 border-t border-border">
        <label className="text-[11px] font-medium text-muted-foreground">Overflow</label>
        <select
          value={layout.overflow || 'visible'}
          onChange={(e) =>
            onChangeLayout({
              ...layout,
              overflow: e.target.value as 'visible' | 'hidden' | 'scroll' | 'auto',
            })
          }
          className="w-full h-8 px-2 rounded-lg bg-muted/50 border border-border text-foreground text-xs"
        >
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
          <option value="auto">Auto</option>
          <option value="scroll">Scroll</option>
        </select>
      </div>
    </div>
  );
}
