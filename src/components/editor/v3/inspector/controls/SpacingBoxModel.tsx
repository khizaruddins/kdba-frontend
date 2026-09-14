'use client';

import * as React from 'react';
import { BoxSpacing } from '@/types/v3-document';
import { Link2, Unlink } from 'lucide-react';

export interface SpacingBoxModelProps {
  margin?: BoxSpacing;
  padding?: BoxSpacing;
  onChangeMargin: (margin: BoxSpacing) => void;
  onChangePadding: (padding: BoxSpacing) => void;
}

export function SpacingBoxModel({
  margin = {},
  padding = {},
  onChangeMargin,
  onChangePadding,
}: SpacingBoxModelProps) {
  const [isLinked, setIsLinked] = React.useState(false);

  const parseVal = (val?: string | number) => {
    if (val === undefined || val === null || val === '') return '0';
    return String(val).replace('px', '').trim();
  };

  const handleMarginChange = (side: keyof BoxSpacing, val: string) => {
    const num = val.trim() === '' ? '0' : val;
    const px = `${num}px`;
    if (isLinked) {
      onChangeMargin({ top: px, right: px, bottom: px, left: px });
    } else {
      onChangeMargin({ ...margin, [side]: px });
    }
  };

  const handlePaddingChange = (side: keyof BoxSpacing, val: string) => {
    const num = val.trim() === '' ? '0' : val;
    const px = `${num}px`;
    if (isLinked) {
      onChangePadding({ top: px, right: px, bottom: px, left: px });
    } else {
      onChangePadding({ ...padding, [side]: px });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-semibold text-slate-300">Box Model</span>
        <button
          type="button"
          onClick={() => setIsLinked(!isLinked)}
          title={isLinked ? 'Unlink sides' : 'Link all sides'}
          className={`p-1 rounded-md transition-colors ${
            isLinked
              ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40'
              : 'hover:bg-slate-800 text-slate-500'
          }`}
        >
          {isLinked ? <Link2 className="w-3.5 h-3.5" /> : <Unlink className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 3D Visual Box Model */}
      <div className="relative w-full rounded-xl bg-slate-900/90 border border-slate-800/80 p-3 select-none text-[10px] text-slate-400 font-mono">
        {/* Margin Label */}
        <div className="absolute top-1.5 left-2 text-[9px] uppercase tracking-wider text-slate-500 font-sans font-bold">
          Margin
        </div>

        {/* Outer Box (Margin) */}
        <div className="flex flex-col items-center gap-1.5 py-1">
          {/* Margin Top */}
          <input
            type="text"
            value={parseVal(margin.top)}
            onChange={(e) => handleMarginChange('top', e.target.value)}
            className="w-10 text-center bg-slate-950/80 border border-slate-800 rounded px-1 py-0.5 text-slate-200 focus:outline-none focus:border-indigo-500 hover:border-slate-700"
          />

          <div className="w-full flex items-center justify-between px-1">
            {/* Margin Left */}
            <input
              type="text"
              value={parseVal(margin.left)}
              onChange={(e) => handleMarginChange('left', e.target.value)}
              className="w-10 text-center bg-slate-950/80 border border-slate-800 rounded px-1 py-0.5 text-slate-200 focus:outline-none focus:border-indigo-500 hover:border-slate-700"
            />

            {/* Inner Box (Padding) */}
            <div className="relative flex-1 mx-2 rounded-lg bg-slate-950/70 border border-slate-800/90 p-2.5 flex flex-col items-center gap-1">
              <div className="absolute top-1 left-1.5 text-[8px] uppercase tracking-wider text-slate-500 font-sans font-bold">
                Padding
              </div>

              {/* Padding Top */}
              <input
                type="text"
                value={parseVal(padding.top)}
                onChange={(e) => handlePaddingChange('top', e.target.value)}
                className="w-9 text-center bg-slate-900 border border-slate-800/90 rounded px-1 py-0.5 text-slate-200 focus:outline-none focus:border-indigo-500 hover:border-slate-700"
              />

              <div className="w-full flex items-center justify-between px-1">
                {/* Padding Left */}
                <input
                  type="text"
                  value={parseVal(padding.left)}
                  onChange={(e) => handlePaddingChange('left', e.target.value)}
                  className="w-9 text-center bg-slate-900 border border-slate-800/90 rounded px-1 py-0.5 text-slate-200 focus:outline-none focus:border-indigo-500 hover:border-slate-700"
                />

                {/* Content Center */}
                <div className="px-3 py-1 rounded bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-sans font-semibold text-[9px]">
                  Content
                </div>

                {/* Padding Right */}
                <input
                  type="text"
                  value={parseVal(padding.right)}
                  onChange={(e) => handlePaddingChange('right', e.target.value)}
                  className="w-9 text-center bg-slate-900 border border-slate-800/90 rounded px-1 py-0.5 text-slate-200 focus:outline-none focus:border-indigo-500 hover:border-slate-700"
                />
              </div>

              {/* Padding Bottom */}
              <input
                type="text"
                value={parseVal(padding.bottom)}
                onChange={(e) => handlePaddingChange('bottom', e.target.value)}
                className="w-9 text-center bg-slate-900 border border-slate-800/90 rounded px-1 py-0.5 text-slate-200 focus:outline-none focus:border-indigo-500 hover:border-slate-700"
              />
            </div>

            {/* Margin Right */}
            <input
              type="text"
              value={parseVal(margin.right)}
              onChange={(e) => handleMarginChange('right', e.target.value)}
              className="w-10 text-center bg-slate-950/80 border border-slate-800 rounded px-1 py-0.5 text-slate-200 focus:outline-none focus:border-indigo-500 hover:border-slate-700"
            />
          </div>

          {/* Margin Bottom */}
          <input
            type="text"
            value={parseVal(margin.bottom)}
            onChange={(e) => handleMarginChange('bottom', e.target.value)}
            className="w-10 text-center bg-slate-950/80 border border-slate-800 rounded px-1 py-0.5 text-slate-200 focus:outline-none focus:border-indigo-500 hover:border-slate-700"
          />
        </div>
      </div>
    </div>
  );
}
