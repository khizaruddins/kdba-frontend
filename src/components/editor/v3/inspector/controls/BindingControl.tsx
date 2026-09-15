'use client';

import * as React from 'react';
import { NodeBinding, WebsiteNode } from '@/types/v3-document';
import { CmsCollection } from '@/types/cms';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const BUSINESS_FIELDS = [
  'name',
  'description',
  'email',
  'phone',
  'address',
  'city',
  'state',
  'country',
  'zipCode',
  'website',
  'logoUrl',
];

export function BindingControl({
  node,
  collections,
  onChangeBinding,
}: {
  node: WebsiteNode;
  collections: CmsCollection[];
  onChangeBinding: (binding: NodeBinding | undefined) => void;
}) {
  const binding = node.binding;
  const source = binding?.source || 'none';

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label>Bind content from</Label>
        <Select
          value={source}
          onValueChange={(value) => {
            if (value === 'none') {
              onChangeBinding(undefined);
              return;
            }
            onChangeBinding({
              source: value as NodeBinding['source'],
              collection: binding?.collection || collections[0]?.slug,
              field: binding?.field || 'title',
              fallback: binding?.fallback,
            });
          }}
        >
          <SelectTrigger aria-label="Binding source">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Static text / media</SelectItem>
            <SelectItem value="business">Business profile</SelectItem>
            <SelectItem value="collection">Collection field</SelectItem>
            <SelectItem value="record">Specific record</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {binding?.source === 'business' ? (
        <div className="space-y-1.5">
          <Label>Business field</Label>
          <Select
            value={binding.field || 'name'}
            onValueChange={(field) => onChangeBinding({ ...binding, field })}
          >
            <SelectTrigger aria-label="Business field">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_FIELDS.map((field) => (
                <SelectItem key={field} value={field}>
                  {field}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {binding?.source === 'collection' || binding?.source === 'record' ? (
        <>
          <div className="space-y-1.5">
            <Label>Collection</Label>
            <Select
              value={binding.collection || undefined}
              onValueChange={(collection) => onChangeBinding({ ...binding, collection })}
            >
              <SelectTrigger aria-label="Bound collection">
                <SelectValue placeholder="Choose collection" />
              </SelectTrigger>
              <SelectContent>
                {collections.map((collection) => (
                  <SelectItem key={collection.id} value={collection.slug}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Field</Label>
            <Select
              value={binding.field || undefined}
              onValueChange={(field) => onChangeBinding({ ...binding, field })}
            >
              <SelectTrigger aria-label="Bound field">
                <SelectValue placeholder="Choose field" />
              </SelectTrigger>
              <SelectContent>
                {(
                  collections.find((item) => item.slug === binding.collection)?.fields || []
                ).map((field) => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      ) : null}

      {binding?.source === 'record' ? (
        <Input
          label="Record slug"
          value={binding.recordSlug || ''}
          onChange={(e) => onChangeBinding({ ...binding, recordSlug: e.target.value })}
          placeholder="e.g. consulting"
        />
      ) : null}

      {binding ? (
        <>
          <Input
            label="Fallback text"
            value={binding.fallback || ''}
            onChange={(e) => onChangeBinding({ ...binding, fallback: e.target.value })}
            placeholder="Shown if content is missing"
          />
          <Button type="button" size="sm" variant="ghost" onClick={() => onChangeBinding(undefined)}>
            Clear binding
          </Button>
        </>
      ) : null}
    </div>
  );
}

export function CollectionListControl({
  node,
  collections,
  onChangeProps,
}: {
  node: WebsiteNode;
  collections: CmsCollection[];
  onChangeProps: (props: Record<string, unknown>) => void;
}) {
  const props = node.props || {};
  const enabled = Boolean(props.cmsList);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Dynamic collection list</Label>
        <Button
          type="button"
          size="sm"
          variant={enabled ? 'default' : 'outline'}
          onClick={() =>
            onChangeProps({
              cmsList: !enabled,
              collectionSlug: props.collectionSlug || collections[0]?.slug || 'services',
              limit: props.limit || 6,
              layout: props.layout || 'cards',
            })
          }
        >
          {enabled ? 'On' : 'Off'}
        </Button>
      </div>
      {enabled ? (
        <>
          <div className="space-y-1.5">
            <Label>Collection</Label>
            <Select
              value={String(props.collectionSlug || '')}
              onValueChange={(collectionSlug) => onChangeProps({ collectionSlug })}
            >
              <SelectTrigger aria-label="List collection">
                <SelectValue placeholder="Choose collection" />
              </SelectTrigger>
              <SelectContent>
                {collections.map((collection) => (
                  <SelectItem key={collection.id} value={collection.slug}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            label="Number of records"
            type="number"
            value={String(props.limit ?? 6)}
            onChange={(e) => onChangeProps({ limit: Number(e.target.value) || 6 })}
          />
          <div className="space-y-1.5">
            <Label>Layout</Label>
            <Select
              value={String(props.layout || 'cards')}
              onValueChange={(layout) => onChangeProps({ layout })}
            >
              <SelectTrigger aria-label="List layout">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cards">Cards</SelectItem>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="list">List</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      ) : null}
    </div>
  );
}
