'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { CMS_FIELD_TYPES, CmsCollectionField, CmsFieldType } from '@/types/cms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function FieldBuilder({
  fields,
  onChange,
}: {
  fields: CmsCollectionField[];
  onChange: (fields: CmsCollectionField[]) => void;
}) {
  const addField = () => {
    const id = `field_${Date.now().toString(36)}`;
    onChange([...fields, { id, name: 'New field', type: 'text' }]);
  };

  const update = (index: number, patch: Partial<CmsCollectionField>) => {
    onChange(fields.map((field, i) => (i === index ? { ...field, ...patch } : field)));
  };

  const remove = (index: number) => {
    onChange(fields.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div
          key={`${field.id}-${index}`}
          className="grid gap-2 rounded-xl border p-3 sm:grid-cols-[1fr_1fr_140px_auto]"
        >
          <Input
            label="Field name"
            value={field.name}
            disabled={field.system}
            onChange={(e) => update(index, { name: e.target.value })}
          />
          <Input
            label="Field id"
            value={field.id}
            disabled={field.system}
            onChange={(e) =>
              update(index, { id: e.target.value.replace(/[^a-zA-Z0-9_-]/g, '') })
            }
          />
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select
              value={field.type}
              disabled={field.system}
              onValueChange={(value) => update(index, { type: value as CmsFieldType })}
            >
              <SelectTrigger aria-label="Field type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CMS_FIELD_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={field.system}
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={addField}>
        <Plus />
        Add field
      </Button>
    </div>
  );
}
