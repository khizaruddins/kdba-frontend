'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  Building2,
  CreditCard,
  Eye,
  Globe,
  Heading,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutTemplate,
  Moon,
  Monitor,
  Plus,
  Rocket,
  Search,
  Settings,
  ShoppingBag,
  SquarePlay,
  Sun,
  Type,
  Users,
  Mail,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { websitesApi } from '@/lib/api/websites';
import { SECTION_PRESETS } from '@/lib/editor/section-presets';
import { Website } from '@/types';

const PAGES = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, keywords: 'home dashboard' },
  { href: '/websites', label: 'Websites', icon: Globe, keywords: 'sites builder' },
  { href: '/content', label: 'Content', icon: LayoutTemplate, keywords: 'cms collections blog services team' },
  { href: '/content/collections', label: 'Collections', icon: LayoutTemplate, keywords: 'cms schema fields' },
  { href: '/content/blog-posts', label: 'Blog', icon: LayoutTemplate, keywords: 'posts articles' },
  { href: '/content/services', label: 'Services', icon: LayoutTemplate, keywords: 'offerings' },
  { href: '/templates', label: 'Templates', icon: LayoutTemplate, keywords: 'gallery industry' },
  { href: '/media', label: 'Media library', icon: ImageIcon, keywords: 'images upload assets' },
  { href: '/leads', label: 'Forms', icon: Users, keywords: 'crm inquiries contact forms leads' },
  { href: '/analytics', label: 'Analytics', icon: BarChart3, keywords: 'stats traffic' },
  { href: '/products', label: 'Products', icon: ShoppingBag, keywords: 'catalog' },
  { href: '/pricing', label: 'Pricing plans', icon: CreditCard, keywords: 'tiers plans' },
  { href: '/settings', label: 'Business profile', icon: Settings, keywords: 'business profile account' },
];

export function CommandMenu({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [sites, setSites] = React.useState<Website[]>([]);
  const inEditor = pathname.startsWith('/editor');
  const insertNodeType = useV3EditorStore((s) => s.insertNodeType);
  const insertSectionPreset = useV3EditorStore((s) => s.insertSectionPreset);
  const setPreviewMode = useV3EditorStore((s) => s.setPreviewMode);
  const publishDocument = useV3EditorStore((s) => s.publishDocument);
  const document = useV3EditorStore((s) => s.document);

  React.useEffect(() => {
    if (!open) return;
    void websitesApi
      .getAll()
      .then((list) => setSites(Array.isArray(list) ? list : []))
      .catch(() => setSites([]));
  }, [open]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const run = React.useCallback((fn: () => void) => {
    setOpen(false);
    fn();
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <>
      {compact ? (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setOpen(true)}
          aria-label="Open command menu"
        >
          <Search />
        </Button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="hidden h-8 w-56 items-center gap-2 rounded-lg border bg-background px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted md:inline-flex"
          aria-label="Open command menu"
        >
          <Search className="size-3.5 shrink-0" />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="pointer-events-none hidden h-5 items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex">
            ⌘K
          </kbd>
        </button>
      )}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages and actions…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {PAGES.map((page) => (
              <CommandItem
                key={page.href}
                value={`${page.label} ${page.keywords}`}
                onSelect={() => run(() => router.push(page.href))}
                data-checked={pathname === page.href || undefined}
              >
                <page.icon />
                {page.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          {sites.length > 0 ? (
            <CommandGroup heading="Open website">
              {sites.slice(0, 8).map((site) => (
                <CommandItem
                  key={site.id}
                  value={`open website ${site.name} ${site.slug}`}
                  onSelect={() => run(() => router.push(`/editor/${site.id}`))}
                >
                  <Globe />
                  {site.name}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => run(() => router.push('/websites'))}>
              <Plus />
              Create website
              <CommandShortcut>N</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => run(() => router.push('/templates'))}>
              <LayoutTemplate />
              Browse templates
            </CommandItem>
            <CommandItem onSelect={() => run(() => router.push('/media'))}>
              <ImageIcon />
              Media
            </CommandItem>
            <CommandItem onSelect={() => run(() => router.push('/leads'))}>
              <Users />
              Forms
            </CommandItem>
            <CommandItem onSelect={() => run(() => router.push('/settings'))}>
              <Building2 />
              Settings
            </CommandItem>
          </CommandGroup>
          {inEditor && document ? (
            <>
              <CommandSeparator />
              <CommandGroup heading="Editor">
                <CommandItem
                  onSelect={() =>
                    run(() => {
                      const preset = SECTION_PRESETS.find((entry) => entry.id === 'hero');
                      if (preset) insertSectionPreset(preset.build());
                    })
                  }
                >
                  <LayoutTemplate />
                  Add hero
                </CommandItem>
                <CommandItem onSelect={() => run(() => window.dispatchEvent(new Event('kdba-editor-contact-picker')))}>
                  <Mail />
                  Add contact
                </CommandItem>
                <CommandItem onSelect={() => run(() => insertNodeType('section'))}>
                  <LayoutTemplate />
                  Add section
                </CommandItem>
                <CommandItem onSelect={() => run(() => insertNodeType('heading'))}>
                  <Heading />
                  Add heading
                </CommandItem>
                <CommandItem onSelect={() => run(() => insertNodeType('button'))}>
                  <SquarePlay />
                  Add button
                </CommandItem>
                <CommandItem onSelect={() => run(() => insertNodeType('image'))}>
                  <ImageIcon />
                  Add image
                </CommandItem>
                <CommandItem onSelect={() => run(() => insertNodeType('text'))}>
                  <Type />
                  Add text
                </CommandItem>
                <CommandItem onSelect={() => run(() => setPreviewMode(true))}>
                  <Eye />
                  Preview
                </CommandItem>
                <CommandItem onSelect={() => run(() => void publishDocument())}>
                  <Rocket />
                  Publish
                </CommandItem>
              </CommandGroup>
            </>
          ) : null}
          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => run(() => setTheme('light'))}>
              <Sun />
              Light
            </CommandItem>
            <CommandItem onSelect={() => run(() => setTheme('dark'))}>
              <Moon />
              Dark
            </CommandItem>
            <CommandItem onSelect={() => run(() => setTheme('system'))}>
              <Monitor />
              System
            </CommandItem>
            <CommandItem onSelect={() => run(toggleTheme)}>
              <Monitor />
              Toggle theme
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
