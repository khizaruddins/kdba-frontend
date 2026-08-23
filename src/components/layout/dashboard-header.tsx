'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { LogOut, User as UserIcon, Building2, Bell } from 'lucide-react';

export interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const router = useRouter();
  const { user, tenant, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/60 px-8 backdrop-blur-md">
      <div>
        {title && (
          <h1 className="text-lg font-bold tracking-tight text-white">{title}</h1>
        )}
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Workspace pill */}
        {tenant && (
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs text-slate-300">
            <Building2 className="h-3.5 w-3.5 text-indigo-400" />
            <span className="font-medium">{tenant.name}</span>
          </div>
        )}

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 rounded-full border border-slate-800 bg-slate-900 p-1 pr-3 text-xs font-semibold text-slate-200 hover:border-slate-700 transition-colors cursor-pointer"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 font-bold text-white text-xs shadow">
              {user?.firstName?.[0] || 'U'}
            </div>
            <span className="hidden md:inline font-medium">
              {user?.firstName} {user?.lastName}
            </span>
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50 text-slate-200"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-semibold text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
