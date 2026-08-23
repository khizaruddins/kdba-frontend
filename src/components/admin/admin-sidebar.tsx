'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Receipt,
  CreditCard,
  Layers,
  ShieldCheck,
  ExternalLink,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAdminStore } from '@/stores/admin-store';

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout, adminUser } = useAdminStore();

  const navItems = [
    {
      label: 'Financial Overview',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Tenants Governance',
      href: '/admin/tenants',
      icon: Building2,
    },
    {
      label: 'Billing & Invoices',
      href: '/admin/billing',
      icon: Receipt,
    },
    {
      label: 'Platform Plans',
      href: '/admin/plans',
      icon: CreditCard,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 px-4 py-6">
      {/* Brand Header */}
      <div className="mb-8 flex items-center justify-between px-2">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-white">
                KDBA
              </span>
              <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-400 border border-amber-500/20">
                SUPER ADMIN
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">
              Platform Control Center
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Governance & Finance
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20 font-bold'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
              }`}
            >
              <Icon
                className={`h-4 w-4 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Quick Switches
        </div>
        <Link
          href="/dashboard"
          className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-colors"
        >
          <span className="flex items-center gap-3">
            <Layers className="h-4 w-4 text-slate-400" />
            <span>Tenant App View</span>
          </span>
          <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
        </Link>
      </nav>

      {/* Super Admin User Footer */}
      <div className="mt-auto border-t border-slate-800/80 pt-4">
        <div className="flex items-center justify-between rounded-xl bg-slate-900/60 p-3 border border-slate-800/60">
          <div className="flex items-center gap-3 truncate">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 text-xs font-bold text-slate-950 shadow">
              👑
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">
                {adminUser ? `${adminUser.firstName} ${adminUser.lastName}` : 'Super Administrator'}
              </div>
              <div className="text-[11px] text-amber-400/90 font-mono truncate">
                {adminUser?.email || 'admin@kdba.agency'}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out of Super Admin"
            className="ml-2 rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
