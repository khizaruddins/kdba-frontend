'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  Building2,
  CreditCard,
  Globe,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutTemplate,
  Moon,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Sun,
  Users,
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

const PAGES = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, keywords: 'home dashboard' },
  { href: '/websites', label: 'Websites', icon: Globe, keywords: 'sites builder' },
  { href: '/templates', label: 'Templates', icon: LayoutTemplate, keywords: 'gallery industry' },
  { href: '/media', label: 'Media library', icon: ImageIcon, keywords: 'images upload assets' },
  { href: '/leads', label: 'Forms & leads', icon: Users, keywords: 'crm inquiries contact' },
  { href: '/analytics', label: 'Analytics', icon: BarChart3, keywords: 'stats traffic' },
  { href: '/products', label: 'Products', icon: ShoppingBag, keywords: 'catalog' },
  { href: '/pricing', label: 'Pricing plans', icon: CreditCard, keywords: 'tiers plans' },
  { href: '/settings', label: 'Settings', icon: Settings, keywords: 'business profile account' },
];

export function CommandMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);

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

  const run = React.useCallback(
    (fn: () => void) => {
      setOpen(false);
      fn();
    },
    [],
  );

  return (
    <>
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
            <CommandItem onSelect={() => run(() => router.push('/settings'))}>
              <Building2 />
              Business profile
            </CommandItem>
          </CommandGroup>
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
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
