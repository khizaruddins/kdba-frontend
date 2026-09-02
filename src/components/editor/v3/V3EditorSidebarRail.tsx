'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import {
  Plus,
  Layers,
  FileText,
  Palette,
  FolderOpen,
  Settings,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export function V3EditorSidebarRail() {
  const { activeNavTab, setActiveNavTab } = useV3EditorStore();

  const navItems = [
    { id: 'add' as const, label: 'Add Elements', icon: <Plus className="w-5 h-5" /> },
    { id: 'layers' as const, label: 'Layers Tree', icon: <Layers className="w-5 h-5" /> },
    { id: 'pages' as const, label: 'Pages', icon: <FileText className="w-5 h-5" /> },
    { id: 'theme' as const, label: 'Site Design', icon: <Palette className="w-5 h-5" /> },
    { id: 'assets' as const, label: 'Media Assets', icon: <FolderOpen className="w-5 h-5" /> },
  ];

  const handleTabClick = (tabId: typeof activeNavTab) => {
    setActiveNavTab(activeNavTab === tabId ? null : tabId);
  };

  return (
    <aside className="w-14 shrink-0 border-r border-slate-800/80 bg-slate-950 flex flex-col justify-between items-center py-3 select-none z-30">
      {/* Top Brand & Navigation Icons */}
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Brand Icon */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white font-black text-base">
          <Sparkles className="w-5 h-5 text-white" />
        </div>

        {/* Primary Tool Rail Buttons */}
        <div className="flex flex-col items-center gap-1.5 w-full px-2">
          {navItems.map((item) => {
            const isActive = activeNavTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                title={item.label}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 ring-2 ring-indigo-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {item.icon}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Utility Icons */}
      <div className="flex flex-col items-center gap-2 px-2">
        <button
          type="button"
          title="Help & Shortcuts"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Settings"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
