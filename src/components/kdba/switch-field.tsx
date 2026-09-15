'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export interface SwitchFieldProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function SwitchField({ checked, onCheckedChange, label, description, disabled, className, id }: SwitchFieldProps) {
  const autoId = React.useId();
  const switchId = id ?? autoId;
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      {label || description ? (
        <div className="grid gap-0.5">
          {label ? (
            <Label htmlFor={switchId} className="text-[13px]">
              {label}
            </Label>
          ) : null}
          {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
        </div>
      ) : null}
      <Switch id={switchId} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} className="mt-0.5" />
    </div>
  );
}
