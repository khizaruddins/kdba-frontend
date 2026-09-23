'use client';

import * as React from 'react';
import { AnimationDefinition, AnimationPreset, AnimationTrigger } from '@/types/v3-document';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { Play, Sparkles } from 'lucide-react';

export interface AnimationControlProps {
  nodeId: string;
  animation?: AnimationDefinition;
  onChangeAnimation: (animation: Partial<AnimationDefinition>) => void;
}

const PRESET_OPTIONS: { id: AnimationPreset; label: string; icon: string }[] = [
  { id: 'none', label: 'None', icon: '∅' },
  { id: 'fade', label: 'Fade', icon: '✨' },
  { id: 'fade-up', label: 'Fade Up', icon: '↑' },
  { id: 'fade-down', label: 'Fade Down', icon: '↓' },
  { id: 'fade-left', label: 'Fade Left', icon: '←' },
  { id: 'fade-right', label: 'Fade Right', icon: '→' },
  { id: 'scale', label: 'Scale Up', icon: '⤢' },
  { id: 'slide', label: 'Slide In', icon: '⇥' },
  { id: 'blur-in', label: 'Blur In', icon: '🌫️' },
];

const TRIGGER_OPTIONS: { id: AnimationTrigger; label: string; desc: string }[] = [
  { id: 'on-load', label: 'On Load', desc: 'When page loads' },
  { id: 'on-scroll', label: 'On Scroll', desc: 'When scrolled into view' },
  { id: 'on-hover', label: 'On Hover', desc: 'When cursor hovers' },
];

export function AnimationControl({
  nodeId,
  animation = {},
  onChangeAnimation,
}: AnimationControlProps) {
  const { setAnimationPreview, activeAnimationPreviewId } = useV3EditorStore();
  const isPreviewing = activeAnimationPreviewId === nodeId;

  const currentPreset = animation.preset || 'none';
  const currentTrigger = animation.trigger || 'on-load';
  const duration = animation.duration ?? 600;
  const delay = animation.delay ?? 0;
  const easing = animation.easing || 'cubic-bezier(0.16, 1, 0.3, 1)';

  const triggerPreview = () => {
    setAnimationPreview(nodeId);
    setTimeout(() => {
      setAnimationPreview(null);
    }, Math.max(duration + delay + 200, 1000));
  };

  const handlePresetSelect = (preset: AnimationPreset) => {
    onChangeAnimation({
      preset,
      duration: duration || 600,
      trigger: currentTrigger,
      easing,
    });
    if (preset !== 'none') {
      triggerPreview();
    }
  };

  const handleTriggerSelect = (trigger: AnimationTrigger) => {
    onChangeAnimation({ trigger });
  };

  return (
    <div className="space-y-4 select-none text-xs">
      {/* Preset Selector Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Animation Preset
          </label>
          {currentPreset !== 'none' && (
            <button
              type="button"
              onClick={triggerPreview}
              disabled={isPreviewing}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                isPreviewing
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              {isPreviewing ? 'Playing...' : 'Preview'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {PRESET_OPTIONS.map((opt) => {
            const isActive = currentPreset === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handlePresetSelect(opt.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-950/40 text-indigo-300 shadow-sm'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-sm mb-1">{opt.icon}</span>
                <span className="text-[11px] font-medium truncate w-full">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {currentPreset !== 'none' && (
        <>
          {/* Trigger Options */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 font-medium">Trigger</label>
            <div className="grid grid-cols-3 gap-1.5">
              {TRIGGER_OPTIONS.map((t) => {
                const isActive = currentTrigger === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTriggerSelect(t.id)}
                    className={`py-1.5 px-2 rounded-lg border text-center text-[10px] font-medium transition-colors ${
                      isActive
                        ? 'border-indigo-500 bg-indigo-950/40 text-indigo-300'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration Slider & Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-slate-400 font-medium">Duration</label>
              <span className="text-[11px] font-mono text-slate-300">{duration}ms</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="100"
                max="2500"
                step="50"
                value={duration}
                onChange={(e) => onChangeAnimation({ duration: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <input
                type="number"
                min="100"
                max="3000"
                step="50"
                value={duration}
                onChange={(e) => onChangeAnimation({ duration: Number(e.target.value) })}
                className="w-14 px-1.5 py-1 bg-slate-900 border border-slate-800 rounded text-center text-[10px] text-slate-200 font-mono"
              />
            </div>
          </div>

          {/* Delay Slider & Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-slate-400 font-medium">Delay</label>
              <span className="text-[11px] font-mono text-slate-300">{delay}ms</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={delay}
                onChange={(e) => onChangeAnimation({ delay: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <input
                type="number"
                min="0"
                max="3000"
                step="50"
                value={delay}
                onChange={(e) => onChangeAnimation({ delay: Number(e.target.value) })}
                className="w-14 px-1.5 py-1 bg-slate-900 border border-slate-800 rounded text-center text-[10px] text-slate-200 font-mono"
              />
            </div>
          </div>

          {/* Easing Preset */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 font-medium">Easing Curve</label>
            <select
              value={easing}
              onChange={(e) => onChangeAnimation({ easing: e.target.value })}
              className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:border-indigo-500 focus:outline-none"
            >
              <option value="cubic-bezier(0.16, 1, 0.3, 1)">Smooth Spring (Default)</option>
              <option value="ease-out">Standard Ease Out</option>
              <option value="ease-in-out">Ease In Out</option>
              <option value="cubic-bezier(0.34, 1.56, 0.64, 1)">Bouncy Pop</option>
              <option value="linear">Linear</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
}
