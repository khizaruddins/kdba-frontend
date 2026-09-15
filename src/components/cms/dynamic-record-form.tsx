'use client';

import * as React from 'react';
import { CmsCollectionField } from '@/types/cms';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MediaPickerModal } from '@/components/ui/media-picker-modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Image as ImageIcon } from 'lucide-react';

export function DynamicRecordForm({
  fields,
  value,
  onChange,
  disabled,
}: {
  fields: CmsCollectionField[];
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  disabled?: boolean;
}) {
  const [mediaField, setMediaField] = React.useState<string | null>(null);
  const [previews, setPreviews] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    let cancelled = false;
    void import('@/lib/api/client').then(({ apiClient }) =>
      apiClient
        .get('/media')
        .then((data: unknown) => {
          if (cancelled || !Array.isArray(data)) return;
          const next: Record<string, string> = {};
          for (const field of fields) {
            if (field.type !== 'image' && field.type !== 'media') continue;
            const current = value[field.id];
            if (typeof current !== 'string' || !current) continue;
            if (current.startsWith('http') || current.startsWith('/')) {
              next[field.id] = current.startsWith('http')
                ? current
                : `http://localhost:4000${current}`;
              continue;
            }
            const media = data.find((item: { id?: string; url?: string }) => item.id === current);
            if (media?.url) {
              next[field.id] = media.url.startsWith('http')
                ? media.url
                : `http://localhost:4000${media.url}`;
            }
          }
          if (Object.keys(next).length) setPreviews((prev) => ({ ...prev, ...next }));
        })
        .catch(() => undefined),
    );
    return () => {
      cancelled = true;
    };
  }, [fields, value]);

  const setField = (id: string, next: unknown) => {
    onChange({ ...value, [id]: next });
  };

  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const current = value[field.id];
        const label = `${field.name}${field.required ? ' *' : ''}`;

        if (field.type === 'boolean') {
          return (
            <div key={field.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label>{field.name}</Label>
                {field.help ? <p className="text-xs text-muted-foreground">{field.help}</p> : null}
              </div>
              <Switch
                checked={Boolean(current)}
                disabled={disabled}
                onCheckedChange={(checked) => setField(field.id, checked)}
              />
            </div>
          );
        }

        if (field.type === 'rich-text' || field.type === 'text' && field.id === 'body') {
          return (
            <Textarea
              key={field.id}
              label={label}
              rows={6}
              disabled={disabled}
              value={typeof current === 'string' ? current : ''}
              onChange={(e) => setField(field.id, e.target.value)}
              helperText={field.help}
            />
          );
        }

        if (field.type === 'select' && field.options?.length) {
          return (
            <div key={field.id} className="space-y-1.5">
              <Label>{label}</Label>
              <Select
                value={typeof current === 'string' ? current : undefined}
                onValueChange={(next) => setField(field.id, next)}
                disabled={disabled}
              >
                <SelectTrigger aria-label={field.name}>
                  <SelectValue placeholder={`Select ${field.name.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }

        if (field.type === 'multi-select') {
          const selected = Array.isArray(current)
            ? current.map(String)
            : typeof current === 'string'
              ? current.split(',').map((s) => s.trim()).filter(Boolean)
              : [];
          return (
            <div key={field.id} className="space-y-2">
              <Label>{label}</Label>
              <div className="flex flex-wrap gap-2">
                {(field.options || []).map((option) => {
                  const active = selected.includes(option);
                  return (
                    <Button
                      key={option}
                      type="button"
                      size="sm"
                      variant={active ? 'default' : 'outline'}
                      disabled={disabled}
                      onClick={() => {
                        const next = active
                          ? selected.filter((item) => item !== option)
                          : [...selected, option];
                        setField(field.id, next);
                      }}
                    >
                      {option}
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        }

        if (field.type === 'image' || field.type === 'media') {
          const raw = typeof current === 'string' ? current : '';
          const url =
            previews[field.id] ||
            (raw.startsWith('http') || raw.startsWith('/')
              ? raw.startsWith('http')
                ? raw
                : `http://localhost:4000${raw}`
              : '');
          return (
            <div key={field.id} className="space-y-2">
              <Label>{label}</Label>
              <div className="flex items-center gap-3">
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt="" className="size-16 rounded-lg border object-cover" />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                    <ImageIcon className="size-5" />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={disabled}
                    onClick={() => setMediaField(field.id)}
                  >
                    Select media
                  </Button>
                  {raw ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={disabled}
                      onClick={() => {
                        setField(field.id, '');
                        setPreviews((prev) => {
                          const next = { ...prev };
                          delete next[field.id];
                          return next;
                        });
                      }}
                    >
                      Clear
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          );
        }

        if (field.type === 'number') {
          return (
            <Input
              key={field.id}
              label={label}
              type="number"
              disabled={disabled}
              value={current === undefined || current === null ? '' : String(current)}
              onChange={(e) =>
                setField(field.id, e.target.value === '' ? '' : Number(e.target.value))
              }
              helperText={field.help}
            />
          );
        }

        const inputType =
          field.type === 'email'
            ? 'email'
            : field.type === 'url'
              ? 'url'
              : field.type === 'date'
                ? 'date'
                : field.type === 'datetime'
                  ? 'datetime-local'
                  : 'text';

        return (
          <Input
            key={field.id}
            label={label}
            type={inputType}
            disabled={disabled}
            value={typeof current === 'string' || typeof current === 'number' ? String(current) : ''}
            onChange={(e) => setField(field.id, e.target.value)}
            helperText={field.help}
          />
        );
      })}

      <MediaPickerModal
        isOpen={Boolean(mediaField)}
        onClose={() => setMediaField(null)}
        onSelect={(url, media) => {
          if (!mediaField) return;
          const valueToStore = media?.id || url;
          setField(mediaField, valueToStore);
          setPreviews((prev) => ({ ...prev, [mediaField]: url }));
          setMediaField(null);
        }}
      />
    </div>
  );
}
