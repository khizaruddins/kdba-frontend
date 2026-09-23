'use client';

import * as React from 'react';
import { ComponentStateKey, ComponentStatesDefinition, StyleDefinition } from '@/types/v3-document';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { MousePointer, Pointer, Eye, RotateCcw } from 'lucide-react';

export type StateTabId = ComponentStateKey | 'default';

export interface StatesControlProps {
  nodeId: string;
  states?: ComponentStatesDefinition;
  onChangeState: (state: ComponentStateKey, styles: Partial<StyleDefinition>) => void;
}

const STATE_TABS: { id: StateTabId; label: string; icon: React.ReactNode }[] = [
  { id: 'default', label: 'Default', icon: <Eye className="w-3 h-3" /> },
  { id: 'hover', label: 'Hover', icon: <MousePointer className="w-3 h-3" /> },
  { id: 'active', label: 'Active', icon: <Pointer className="w-3 h-3" /> },
  { id: 'focus', label: 'Focus', icon: <Eye className="w-3 h-3" /> },
];

export function StatesControl({
  nodeId,
  states = {},
  onChangeState,
}: StatesControlProps) {
  const { activeStateMode, setActiveStateMode } = useV3EditorStore();

  const currentStateOverrides = activeStateMode !== 'default' ? states[activeStateMode as ComponentStateKey] || {} : {};
  const hasOverrides = activeStateMode !== 'default' && Object.keys(currentStateOverrides).length > 0;

  const handleUpdate = (partial: Partial<StyleDefinition>) => {
    if (activeStateMode === 'default') return;
    onChangeState(activeStateMode as ComponentStateKey, {
      ...currentStateOverrides,
      ...partial,
      background: { ...currentStateOverrides.background, ...partial.background },
      typography: { ...currentStateOverrides.typography, ...partial.typography },
      border: { ...currentStateOverrides.border, ...partial.border },
      effects: { ...currentStateOverrides.effects, ...partial.effects },
      transform: { ...currentStateOverrides.transform, ...partial.transform },
    });
  };

  const handleResetCurrentState = () => {
    if (activeStateMode === 'default') return;
    onChangeState(activeStateMode as ComponentStateKey, {});
  };

  return (
    <div className="space-y-4 select-none text-xs">
      {/* State Switcher Tabs */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-slate-300">Interaction State</label>
        <div className="grid grid-cols-4 p-0.5 bg-slate-900 border border-slate-800 rounded-lg">
          {STATE_TABS.map((tab) => {
            const isActive = activeStateMode === tab.id;
            const hasDefinedOverrides = tab.id !== 'default' && states[tab.id as ComponentStateKey] && Object.keys(states[tab.id as ComponentStateKey] || {}).length > 0;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveStateMode(tab.id)}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded text-[11px] font-medium transition-all relative ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {hasDefinedOverrides && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1 right-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {activeStateMode === 'default' ? (
        <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 text-slate-400 text-xs text-center space-y-1">
          <p>You are viewing the <strong className="text-slate-200">Default</strong> resting state.</p>
          <p className="text-[11px] text-slate-500">
            Select Hover, Active, or Focus above to customize how this element looks when interacted with.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5 p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/40">
          <div className="flex items-center justify-between pb-1 border-b border-indigo-900/30">
            <span className="text-[11px] font-semibold text-indigo-300 capitalize flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              Editing {activeStateMode} State
            </span>
            {hasOverrides && (
              <button
                type="button"
                onClick={handleResetCurrentState}
                className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-amber-300 transition-colors"
                title="Reset overrides for this state"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Reset
              </button>
            )}
          </div>

          {/* Background Color Override */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentStateOverrides.background?.color || '#000000'}
                onChange={(e) => handleUpdate({ background: { color: e.target.value } })}
                className="w-7 h-7 rounded border border-slate-700 bg-slate-800 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={currentStateOverrides.background?.color || ''}
                placeholder="Inherit (No change)"
                onChange={(e) => handleUpdate({ background: { color: e.target.value } })}
                className="flex-1 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-200 font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Text Color Override */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400">Text Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentStateOverrides.typography?.color || '#ffffff'}
                onChange={(e) => handleUpdate({ typography: { color: e.target.value } })}
                className="w-7 h-7 rounded border border-slate-700 bg-slate-800 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={currentStateOverrides.typography?.color || ''}
                placeholder="Inherit (No change)"
                onChange={(e) => handleUpdate({ typography: { color: e.target.value } })}
                className="flex-1 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-200 font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Border Color Override */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400">Border Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentStateOverrides.border?.color || '#6366f1'}
                onChange={(e) => handleUpdate({ border: { color: e.target.value, width: currentStateOverrides.border?.width || '1px', style: 'solid' } })}
                className="w-7 h-7 rounded border border-slate-700 bg-slate-800 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={currentStateOverrides.border?.color || ''}
                placeholder="Inherit (No change)"
                onChange={(e) => handleUpdate({ border: { color: e.target.value } })}
                className="flex-1 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-200 font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Scale Transform Preset */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400">Scale on Interaction</label>
            <div className="grid grid-cols-4 gap-1">
              {[
                { label: 'Normal', val: 1 },
                { label: '+2%', val: 1.02 },
                { label: '+5%', val: 1.05 },
                { label: '-2%', val: 0.98 },
              ].map((s) => {
                const isSelected = currentStateOverrides.transform?.scale === s.val || (!currentStateOverrides.transform?.scale && s.val === 1);
                return (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => handleUpdate({ transform: { scale: s.val } })}
                    className={`py-1 rounded border text-[10px] font-medium transition-colors ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-900/40 text-indigo-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shadow Preset */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400">Hover Shadow Glow</label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { label: 'None', shadow: { x: 0, y: 0, blur: 0, spread: 0, color: 'transparent' } },
                { label: 'Subtle', shadow: { x: 0, y: 4, blur: 12, spread: 0, color: 'rgba(0,0,0,0.3)' } },
                { label: 'Glow', shadow: { x: 0, y: 0, blur: 20, spread: 2, color: 'rgba(99,102,241,0.4)' } },
              ].map((sh) => (
                <button
                  key={sh.label}
                  type="button"
                  onClick={() => handleUpdate({ effects: { boxShadow: sh.shadow } })}
                  className="py-1 rounded border border-slate-800 bg-slate-900 hover:border-slate-700 text-[10px] text-slate-300 font-medium transition-colors"
                >
                  {sh.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
