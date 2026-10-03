'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { websitesApi } from '@/lib/api/websites';
import { cmsNavigationApi } from '@/lib/api/cms';
import { useCmsWebsite } from '@/hooks/use-cms-website';
import { NavItem } from '@/types/v3-document';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown, ChevronUp, Plus, Trash2, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function NavigationBuilder() {
  const { websites, website, selectWebsite, isLoading: sitesLoading } = useCmsWebsite();
  const [items, setItems] = React.useState<NavItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [document, setDocument] = React.useState<any>(null);

  React.useEffect(() => {
    if (!website?.id) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    websitesApi
      .getDocument(website.id)
      .then(async (res) => {
        setDocument(res.document);
        const nav = res.document.navigation;
        let loadedItems: NavItem[] = [];
        if (Array.isArray(nav)) {
          loadedItems = nav;
        } else if (nav?.header) {
          loadedItems = nav.header;
        }

        // If no items in document, check dedicated navigation API
        if (loadedItems.length === 0) {
          try {
            const navList = await cmsNavigationApi.list(website.id);
            const headerNav = navList.find((n) => n.key === 'header' || n.name.toLowerCase().includes('header'));
            if (headerNav && Array.isArray(headerNav.items) && headerNav.items.length > 0) {
              loadedItems = headerNav.items.map((it) => ({
                id: it.id,
                label: it.label,
                href: it.url,
              }));
            }
          } catch {
            // fallback
          }
        }

        setItems(loadedItems);
      })
      .catch((err) => {
        console.error(err);
        setItems([]);
      })
      .finally(() => setIsLoading(false));
  }, [website?.id]);

  const handleSave = async () => {
    if (!website?.id || !document) return;
    setIsSaving(true);
    try {
      // Update document structure
      const updatedDoc = {
        ...document,
        navigation: Array.isArray(document.navigation) ? items : { ...document.navigation, header: items },
      };
      
      await websitesApi.updateDocument(website.id, updatedDoc);
      await websitesApi.update(website.id, { navigation: items }).catch(() => {});
      
      // Sync to dedicated CMS navigation table
      await cmsNavigationApi.create(website.id, {
        name: 'Main Navigation',
        key: 'header',
        items: items.map((it, idx) => ({
          id: it.id,
          label: it.label,
          url: it.href,
          order: idx,
        })),
      }).catch(() => {});
      
      toast.success('Navigation saved successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save navigation');
    } finally {
      setIsSaving(false);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: `nav_${Date.now()}`, label: 'New Item', href: '/' },
    ]);
  };

  const updateItem = (index: number, updates: Partial<NavItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === items.length - 1)
    ) return;
    
    const newItems = [...items];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
    setItems(newItems);
  };

  const addChild = (parentIndex: number) => {
    const newItems = [...items];
    const parent = newItems[parentIndex];
    if (!parent.children) parent.children = [];
    parent.children.push({ id: `child_${Date.now()}`, label: 'New Link', href: '/' });
    setItems(newItems);
  };

  const updateChild = (parentIndex: number, childIndex: number, updates: any) => {
    const newItems = [...items];
    const children = newItems[parentIndex].children;
    if (children) {
      children[childIndex] = { ...children[childIndex], ...updates };
    }
    setItems(newItems);
  };

  const removeChild = (parentIndex: number, childIndex: number) => {
    const newItems = [...items];
    const children = newItems[parentIndex].children;
    if (children) {
      children.splice(childIndex, 1);
    }
    setItems(newItems);
  };

  if (sitesLoading || isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {websites.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Globe className="size-4" />
                  {website?.name || 'Select Website'}
                  <ChevronDown className="size-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Website</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {websites.map((w) => (
                  <DropdownMenuItem key={w.id} onClick={() => selectWebsite(w.id)}>
                    {w.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <Button onClick={handleSave} isLoading={isSaving}>
          {isSaving ? 'Saving...' : 'Save Navigation'}
        </Button>
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground border-dashed">
            <p>No navigation items yet.</p>
          </Card>
        ) : (
          items.map((item, index) => (
            <Card key={item.id} className="p-4 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <Button variant="ghost" size="icon" className="size-6 h-6 w-6" onClick={() => moveItem(index, 'up')} disabled={index === 0}>
                    <ChevronUp className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-6 h-6 w-6" onClick={() => moveItem(index, 'down')} disabled={index === items.length - 1}>
                    <ChevronDown className="size-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <Input 
                    value={item.label} 
                    onChange={(e) => updateItem(index, { label: e.target.value })}
                    placeholder="Label"
                  />
                  <Input 
                    value={item.href} 
                    onChange={(e) => updateItem(index, { href: e.target.value })}
                    placeholder="URL (/about)"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => addChild(index)}>
                    <Plus className="size-4 mr-2" />
                    Add Sublink
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(index)} className="text-destructive">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              {item.children && item.children.length > 0 && (
                <div className="ml-12 pl-4 border-l-2 border-border space-y-3">
                  {item.children.map((child, childIndex) => (
                    <div key={child.id} className="flex items-center gap-4">
                       <div className="grid grid-cols-2 gap-4 flex-1">
                        <Input 
                          value={child.label} 
                          onChange={(e) => updateChild(index, childIndex, { label: e.target.value })}
                          placeholder="Sublink Label"
                          className="h-8"
                        />
                        <Input 
                          value={child.href} 
                          onChange={(e) => updateChild(index, childIndex, { href: e.target.value })}
                          placeholder="Sublink URL"
                          className="h-8"
                        />
                      </div>
                      <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => removeChild(index, childIndex)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))
        )}
        
        <Button variant="outline" className="w-full border-dashed" onClick={addItem}>
          <Plus className="size-4 mr-2" />
          Add Navigation Item
        </Button>
      </div>
    </div>
  );
}
