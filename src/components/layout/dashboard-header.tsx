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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-8 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div>
        {title && (
          <h1 className="text-lg font-bold tracking-tight text-foreground">{title}</h1>
        )}
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Workspace pill */}
        {tenant && (
          <div className="hidden sm:flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
            <Building2 className="h-3.5 w-3.5" />
            <span className="font-medium">{tenant.name}</span>
          </div>
        )}

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 rounded-full border bg-card p-1 pr-3 text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xs shadow-sm">
              {user?.firstName?.[0] || 'U'}
            </div>
            <span className="hidden md:inline">
              {user?.firstName} {user?.lastName}
            </span>
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-md border bg-popover p-1 shadow-md z-50 text-popover-foreground"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="px-3 py-2 border-b mb-1">
                <p className="text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors text-left cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
