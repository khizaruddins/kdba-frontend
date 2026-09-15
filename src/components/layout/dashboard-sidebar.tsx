'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import {
  LayoutDashboard,
  Globe,
  LayoutTemplate,
  Image,
  ShoppingBag,
  CreditCard,
  Users,
  Building2,
  Settings,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { tenant } = useAuthStore();

  const navigation = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Websites',
      href: '/websites',
      icon: Globe,
    },
    {
      name: 'Templates',
      href: '/templates',
      icon: LayoutTemplate,
    },
    {
      name: 'Media Library',
      href: '/media',
      icon: Image,
    },
    {
      name: 'Products',
      href: '/products',
      icon: ShoppingBag,
    },
    {
      name: 'Pricing Plans',
      href: '/pricing',
      icon: CreditCard,
    },
    {
      name: 'Leads & Inquiries',
      href: '/leads',
      icon: Users,
    },
    {
      name: 'Business Profile',
      href: '/business',
      icon: Building2,
    },
  ];

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
          K
        </div>
        <div>
          <span className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
            KDBA <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded border">SaaS</span>
          </span>
          <p className="text-[11px] text-muted-foreground truncate max-w-[130px]">
            {tenant?.name || 'My Workspace'}
          </p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navigation.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all select-none',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon
                className={cn(
                  'h-4 w-4 shrink-0 transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground group-hover:text-foreground',
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Public Site Quick Link if published */}
      {tenant?.slug && (
        <div className="p-4 border-t">
          <Link
            href={`/site/${tenant.slug}`}
            target="_blank"
            className="flex items-center justify-between rounded-md bg-muted/50 p-3 border border-transparent text-sm text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground transition-all group"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">Live Website</span>
            </div>
            <ExternalLink className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
          </Link>
        </div>
      )}
    </aside>
  );
}
