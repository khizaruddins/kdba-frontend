'use client';

import * as React from 'react';
import { ResponsiveVisibility } from '@/types/v3-document';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

export interface VisibilityControlProps {
  visibility?: ResponsiveVisibility;
  onChange: (visibility: ResponsiveVisibility) => void;
}

export function VisibilityControl({ visibility, onChange }: VisibilityControlProps) {
  const devices: Array<{ id: keyof ResponsiveVisibility; label: string; icon: React.ReactNode }> = [
    { id: 'desktop', label: 'Desktop', icon: <Monitor className="w-3.5 h-3.5" /> },
    { id: 'tablet', label: 'Tablet', icon: <Tablet className="w-3.5 h-3.5" /> },
    { id: 'mobile', label: 'Mobile', icon: <Smartphone className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-2 text-xs">
      <p className="text-[11px] text-muted-foreground">Show this element on:</p>
      <div className="grid grid-cols-3 gap-1">
        {devices.map((device) => {
          const visible = visibility?.[device.id] !== false;
          return (
            <button
              key={String(device.id)}
              type="button"
              aria-pressed={visible}
              onClick={() => onChange({ ...(visibility || {}), [device.id]: !visible })}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg border text-[10px] font-medium ${
                visible
                  ? 'bg-primary/10 border-primary/40 text-primary'
                  : 'bg-muted/50 border-border text-muted-foreground'
              }`}
            >
              {device.icon}
              {device.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
