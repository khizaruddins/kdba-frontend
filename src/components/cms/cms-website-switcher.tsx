'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Website } from '@/types';

export function CmsWebsiteSwitcher({
  websites,
  websiteId,
  onChange,
}: {
  websites: Website[];
  websiteId: string | null;
  onChange: (id: string) => void;
}) {
  if (websites.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Create a website first to manage content.
      </p>
    );
  }

  return (
    <Select value={websiteId || undefined} onValueChange={onChange}>
      <SelectTrigger className="w-[220px]" size="sm" aria-label="Content website">
        <SelectValue placeholder="Select website" />
      </SelectTrigger>
      <SelectContent>
        {websites.map((site) => (
          <SelectItem key={site.id} value={site.id}>
            {site.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
