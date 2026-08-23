'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, User, Key, ArrowRight, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { useAdminStore } from '@/stores/admin-store';
import { Button } from '@/components/ui/button';

export default function AdminSignupPage() {
  const router = useRouter();
  const { setAdminAuth } = useAdminStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    adminSecretKey: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res: any = await apiClient.post('/admin/auth/register', formData);
      if (res && res.accessToken) {
        setAdminAuth(res.user, res.accessToken);
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to register Super Admin. Verify secret key.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      {/* Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-amber-500/10 blur-[130px] rounded-full" />
        <div className="absolute -bottom-40 left-10 w-[500px] h-[400px] bg-indigo-500/10 blur-[140px] rounded-full" />
      </div>

      <div className="relative w-full max-w-lg space-y-8 rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center space-y-3">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-violet-500 shadow-xl shadow-amber-500/10 ring-1 ring-white/20">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-400 border border-amber-500/20">
            👑 Super Admin Setup
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Create Super Admin Account
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Requires master setup authorization key to grant full platform-wide tenant and revenue control.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="Khizar"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Last Name
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                placeholder="Admin"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 px-4 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="superadmin@kdba.agency"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Password (Min. 8 characters)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Key className="h-3 w-3" />
                <span>Master Admin Secret Key</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                Platform Security
              </span>
            </div>
            <input
              type="text"
              required
              value={formData.adminSecretKey}
              onChange={(e) =>
                setFormData({ ...formData, adminSecretKey: e.target.value })
              }
              placeholder="Enter SUPER_ADMIN_SECRET"
              className="w-full rounded-xl border border-amber-500/40 bg-slate-950/90 py-2.5 px-4 text-xs font-mono text-amber-300 placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-slate-950 font-black py-2.5 rounded-xl shadow-lg shadow-amber-500/20"
          >
            <span>Authorize & Create Super Admin</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800/80">
          <p className="text-xs text-slate-400">
            Already registered?{' '}
            <Link
              href="/admin/login"
              className="text-amber-400 font-semibold hover:text-amber-300 transition-colors"
            >
              Sign In to Super Admin &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
