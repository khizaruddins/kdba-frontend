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
  Globe,
} from 'lucide-react';

export function V3EditorSidebarRail() {
  const { activeNavTab, setActiveNavTab } = useV3EditorStore();

  const navItems = [
    { id: 'add' as const, label: 'Add Elements', icon: <Plus className="w-5 h-5" /> },
    { id: 'layers' as const, label: 'Layers Tree', icon: <Layers className="w-5 h-5" /> },
    { id: 'pages' as const, label: 'Pages', icon: <FileText className="w-5 h-5" /> },
    { id: 'site' as const, label: 'Site structure', icon: <Globe className="w-5 h-5" /> },
    { id: 'theme' as const, label: 'Site Design', icon: <Palette className="w-5 h-5" /> },
    { id: 'assets' as const, label: 'Media Assets', icon: <FolderOpen className="w-5 h-5" /> },
  ];

  const handleTabClick = (tabId: typeof activeNavTab) => {
    setActiveNavTab(activeNavTab === tabId ? null : tabId);
  };

  return (
    <aside className="z-30 flex w-14 shrink-0 flex-col items-center justify-between border-r bg-sidebar py-3 text-sidebar-foreground select-none">
      {/* Top Brand & Navigation Icons */}
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Brand Icon */}
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
          K
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
                className={`flex size-10 items-center justify-center rounded-lg transition-all ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground'
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
          onClick={() => window.dispatchEvent(new Event('kdba-editor-help'))}
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Settings"
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
