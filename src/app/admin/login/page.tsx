'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { useAdminStore } from '@/stores/admin-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAdminAuth } = useAdminStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res: any = await apiClient.post('/admin/auth/login', {
        email,
        password,
      });

      if (res && res.accessToken) {
        setAdminAuth(res.user, res.accessToken);
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Invalid Super Admin credentials',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      {/* Background ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-amber-500/10 blur-[130px] rounded-full" />
        <div className="absolute -bottom-40 right-10 w-[500px] h-[400px] bg-indigo-500/10 blur-[140px] rounded-full" />
      </div>

      <div className="relative w-full max-w-md space-y-8 rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-violet-500 shadow-xl shadow-amber-500/10 ring-1 ring-white/20">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-400 border border-amber-500/20">
            👑 Super Admin Portal
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            KDBA Master Governance
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Authorized platform administrators only. Access all tenants, subscriptions, billing, and revenue analytics.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kdba.agency"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-slate-950 font-black py-2.5 rounded-xl shadow-lg shadow-amber-500/20"
          >
            <span>Sign In to Platform Admin</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        {/* Demo Super Admin Info & Signup Link */}
        <div className="pt-2 border-t border-slate-800/80 space-y-3 text-center">
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/60 text-left space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400">
              <KeyRound className="h-3.5 w-3.5" />
              <span>Default Super Admin Credentials:</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Email: <span className="text-slate-200">superadmin@kdba.agency</span>
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              Pass: <span className="text-slate-200">Admin@123456</span>
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <Link
              href="/admin/signup"
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              Register New Super Admin &rarr;
            </Link>
            <Link
              href="/login"
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              Tenant App Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
