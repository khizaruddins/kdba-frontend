'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { websitesApi } from '@/lib/api/websites';
import { cmsApi } from '@/lib/api/cms';
import { useCmsWebsite } from '@/hooks/use-cms-website';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Globe, Search, Image as ImageIcon, ExternalLink, FileText, FileCode } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

export function SeoForm() {
  const { websites, website, selectWebsite, isLoading: sitesLoading } = useCmsWebsite();
  
  const [globalSeo, setGlobalSeo] = React.useState({ title: '', description: '', ogImage: '' });
  const [pages, setPages] = React.useState<any[]>([]);
  const [document, setDocument] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const [editingPage, setEditingPage] = React.useState<any | null>(null);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!website?.id) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    
    Promise.all([
      websitesApi.getDocument(website.id),
      cmsApi.getBusinessProfile(website.id).catch(() => null)
    ]).then(([docRes, profile]) => {
      setDocument(docRes.document);
      const siteSeo = docRes.document.seo || {};
      
      setGlobalSeo({
        title: siteSeo.metaTitle || website.seoTitle || '',
        description: siteSeo.metaDescription || website.seoDescription || '',
        ogImage: siteSeo.ogImage || profile?.logoUrl || '',
      });
      setPages(docRes.document.pages || []);
    }).catch(console.error).finally(() => setIsLoading(false));

  }, [website?.id]);

  const handleSaveGlobal = async () => {
    if (!website?.id || !document) return;
    setIsSaving(true);
    try {
      const updatedDoc = {
        ...document,
        seo: {
          ...document.seo,
          metaTitle: globalSeo.title,
          metaDescription: globalSeo.description,
          ogImage: globalSeo.ogImage,
        }
      };
      await websitesApi.updateDocument(website.id, updatedDoc);
      await websitesApi.update(website.id, { seoTitle: globalSeo.title, seoDescription: globalSeo.description }).catch(() => {});
      toast.success('Global SEO saved');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save SEO');
    } finally {
      setIsSaving(false);
    }
  };

  const savePageSeo = async () => {
    if (!website?.id || !document || editingIndex === null || !editingPage) return;
    
    const newPages = [...pages];
    newPages[editingIndex] = editingPage;
    
    try {
      const updatedDoc = { ...document, pages: newPages };
      await websitesApi.updateDocument(website.id, updatedDoc);
      setPages(newPages);
      setDocument(updatedDoc);
      toast.success(`Saved SEO for ${editingPage.title}`);
      setEditingPage(null);
      setEditingIndex(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save page SEO');
    }
  };

  if (sitesLoading || isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const sitemapUrl = website?.slug ? `${apiBase}/public/sites/${website.slug}/sitemap.xml` : null;
  const robotsUrl = website?.slug ? `${apiBase}/public/sites/${website.slug}/robots.txt` : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

        {website?.slug && (
          <div className="flex items-center gap-2">
            {sitemapUrl && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => window.open(sitemapUrl, '_blank')}
              >
                <FileText className="size-3.5 text-blue-500" />
                sitemap.xml
                <ExternalLink className="size-3 opacity-60 ml-0.5" />
              </Button>
            )}
            {robotsUrl && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => window.open(robotsUrl, '_blank')}
              >
                <FileCode className="size-3.5 text-purple-500" />
                robots.txt
                <ExternalLink className="size-3 opacity-60 ml-0.5" />
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Global SEO</CardTitle>
            <CardDescription>Default meta tags for your website.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>SEO Title ({globalSeo.title.length}/60)</Label>
              <Input 
                value={globalSeo.title} 
                onChange={(e) => setGlobalSeo({ ...globalSeo, title: e.target.value })}
                maxLength={60}
              />
            </div>
            <div className="space-y-2">
              <Label>SEO Description ({globalSeo.description.length}/160)</Label>
              <Textarea 
                value={globalSeo.description} 
                onChange={(e) => setGlobalSeo({ ...globalSeo, description: e.target.value })}
                rows={3}
                maxLength={160}
              />
            </div>
            <div className="space-y-2">
              <Label>OG Image URL</Label>
              <Input 
                value={globalSeo.ogImage} 
                onChange={(e) => setGlobalSeo({ ...globalSeo, ogImage: e.target.value })}
              />
            </div>
            <Button onClick={handleSaveGlobal} isLoading={isSaving}>Save Global SEO</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Search Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-background border rounded-lg p-4 max-w-[600px] font-sans">
              <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                <Search className="size-4" />
                {website?.slug}.kdba.com
              </div>
              <div className="text-blue-600 dark:text-blue-400 text-xl cursor-pointer hover:underline truncate">
                {globalSeo.title || website?.name || 'Your Website Title'}
              </div>
              <div className="text-sm mt-1 text-muted-foreground line-clamp-2">
                {globalSeo.description || 'Provide a description to help search engines understand your site.'}
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Social Preview</h4>
              <div className="border rounded-lg overflow-hidden max-w-[400px]">
                {globalSeo.ogImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={globalSeo.ogImage} alt="OG" className="w-full h-[200px] object-cover" />
                ) : (
                  <div className="w-full h-[200px] bg-muted flex items-center justify-center">
                    <ImageIcon className="size-8 text-muted-foreground/50" />
                  </div>
                )}
                <div className="p-4 bg-muted/50">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{website?.slug}.kdba.com</div>
                  <div className="font-semibold truncate">{globalSeo.title || website?.name}</div>
                  <div className="text-sm text-muted-foreground truncate mt-1">{globalSeo.description}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Per-Page SEO</CardTitle>
          <CardDescription>Override global settings for specific pages.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>SEO Title</TableHead>
                <TableHead>Indexed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((p, idx) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell className="text-muted-foreground">/{p.slug}</TableCell>
                  <TableCell className="truncate max-w-[200px]">
                    {p.seo?.metaTitle || <span className="text-muted-foreground italic">Using global</span>}
                  </TableCell>
                  <TableCell>
                    {p.seo?.noIndex ? (
                      <span className="text-destructive text-sm font-medium">No</span>
                    ) : (
                      <span className="text-green-600 dark:text-green-400 text-sm font-medium">Yes</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => {
                      setEditingPage(JSON.parse(JSON.stringify(p))); // deep copy
                      setEditingIndex(idx);
                    }}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {pages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No pages found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={editingPage !== null} onOpenChange={(open) => !open && setEditingPage(null)}>
        <SheetContent className="sm:max-w-[540px] overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Edit SEO for &quot;{editingPage?.title}&quot;</SheetTitle>
            <SheetDescription>Update meta tags for search engines and social media.</SheetDescription>
          </SheetHeader>
          
          {editingPage && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>SEO Title</Label>
                <Input 
                  value={editingPage.seo?.metaTitle || ''} 
                  onChange={(e) => setEditingPage({
                    ...editingPage, 
                    seo: { ...editingPage.seo, metaTitle: e.target.value }
                  })}
                  placeholder={globalSeo.title}
                />
              </div>
              <div className="space-y-2">
                <Label>SEO Description</Label>
                <Textarea 
                  value={editingPage.seo?.metaDescription || ''} 
                  onChange={(e) => setEditingPage({
                    ...editingPage, 
                    seo: { ...editingPage.seo, metaDescription: e.target.value }
                  })}
                  rows={3}
                  placeholder={globalSeo.description}
                />
              </div>
              <div className="space-y-2">
                <Label>Canonical URL</Label>
                <Input 
                  value={editingPage.seo?.canonicalUrl || ''} 
                  onChange={(e) => setEditingPage({
                    ...editingPage, 
                    seo: { ...editingPage.seo, canonicalUrl: e.target.value }
                  })}
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label>Hide from search engines (noindex)</Label>
                  <p className="text-sm text-muted-foreground">Prevent this page from appearing in search results.</p>
                </div>
                <Switch 
                  checked={!!editingPage.seo?.noIndex}
                  onCheckedChange={(c) => setEditingPage({
                    ...editingPage,
                    seo: { ...editingPage.seo, noIndex: c }
                  })}
                />
              </div>
              
              <div className="pt-4 border-t space-y-4">
                <h4 className="font-semibold text-sm">Social Media (Open Graph)</h4>
                <div className="space-y-2">
                  <Label>OG Title</Label>
                  <Input 
                    value={editingPage.seo?.ogTitle || ''} 
                    onChange={(e) => setEditingPage({
                      ...editingPage, 
                      seo: { ...editingPage.seo, ogTitle: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>OG Description</Label>
                  <Textarea 
                    value={editingPage.seo?.ogDescription || ''} 
                    onChange={(e) => setEditingPage({
                      ...editingPage, 
                      seo: { ...editingPage.seo, ogDescription: e.target.value }
                    })}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>OG Image URL</Label>
                  <Input 
                    value={editingPage.seo?.ogImage || ''} 
                    onChange={(e) => setEditingPage({
                      ...editingPage, 
                      seo: { ...editingPage.seo, ogImage: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>
          )}
          
          <SheetFooter className="mt-6 pt-6 border-t">
            <Button variant="outline" onClick={() => setEditingPage(null)}>Cancel</Button>
            <Button onClick={savePageSeo}>Save Changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
