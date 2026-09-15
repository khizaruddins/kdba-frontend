'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { apiClient } from '@/lib/api/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, Lock, Mail, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data: any = await apiClient.post('/auth/login', {
        email,
        password,
      });

      if (data && data.user && data.accessToken) {
        setAuth(data.user, data.tenant, data.accessToken, data.role || 'OWNER');
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(
        err?.message || 'Invalid email or password. Please check your credentials.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#090D16]">
      {/* Left Column: Image & Introduction */}
      <div className="hidden lg:flex w-1/2 relative bg-black border-r border-white/5 flex-col justify-between overflow-hidden p-12">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop" 
            alt="Studio background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-[#090D16]/60 to-transparent" />
        </div>

        {/* Branding Top Left */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black font-bold text-[15px]">
              K
            </div>
            <span className="text-[17px] font-semibold tracking-tight text-white">
              KDBA Studio
            </span>
          </Link>
        </div>

        {/* Content / Brief Summary Bottom Left */}
        <div className="relative z-10 max-w-md space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold text-white tracking-tight leading-tight">
              Manage your digital presence.
            </h1>
            <p className="text-[15px] text-slate-300 leading-relaxed">
              Log in to your unified workspace. Manage your live websites, custom brand assets, digital catalogs, and incoming customer leads in one place.
            </p>
          </div>
          
          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3 text-[14px] text-slate-300 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Real-time site management</span>
            </div>
            <div className="flex items-center gap-3 text-[14px] text-slate-300 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Integrated inbound CRM pipeline</span>
            </div>
            <div className="flex items-center gap-3 text-[14px] text-slate-300 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>High-performance Edge CDN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[380px] space-y-8">
          
          {/* Mobile Header (Only visible on small screens) */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black font-bold text-[15px]">
                K
              </div>
              <span className="text-[17px] font-semibold tracking-tight text-white">
                KDBA
              </span>
            </Link>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Welcome back
            </h2>
            <p className="text-[14px] text-slate-400">
              Enter your credentials to access your workspace
            </p>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="flex items-center gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 p-3.5 text-[13px] font-medium text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@business.com"
                    className="w-full rounded-xl border border-white/10 bg-[#0f1422] py-2.5 pl-10 pr-4 text-[14px] text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-medium text-slate-300">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[12px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-[#0f1422] py-2.5 pl-10 pr-4 text-[14px] text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 mt-2 rounded-xl bg-white text-black font-semibold text-[14px] hover:bg-slate-200 transition-colors cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="text-center text-[13px] text-slate-400">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-semibold text-white hover:text-slate-200 transition-colors"
              >
                Create Business Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
