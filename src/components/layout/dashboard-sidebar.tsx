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
    <aside className="flex h-full w-64 flex-col border-r border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-800/80 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 font-black text-white shadow-lg shadow-indigo-500/20">
          K
        </div>
        <div>
          <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
            KDBA <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">SaaS</span>
          </span>
          <p className="text-[11px] text-slate-400 truncate max-w-[130px]">
            {tenant?.name || 'My Workspace'}
          </p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
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
                'group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all select-none',
                isActive
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200',
              )}
            >
              <item.icon
                className={cn(
                  'h-4 w-4 shrink-0 transition-colors',
                  isActive
                    ? 'text-indigo-400'
                    : 'text-slate-400 group-hover:text-slate-300',
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Public Site Quick Link if published */}
      {tenant?.slug && (
        <div className="p-4 border-t border-slate-800/80">
          <Link
            href={`/site/${tenant.slug}`}
            target="_blank"
            className="flex items-center justify-between rounded-xl bg-slate-900/60 p-3 border border-slate-800 text-xs text-slate-300 hover:border-slate-700 hover:text-white transition-all group"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="font-medium">Live Website</span>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-white" />
          </Link>
        </div>
      )}
    </aside>
  );
}
