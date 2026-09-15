'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { AlertCircle, Lock, Mail, User, Building2, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    businessName: '',
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.businessName
    ) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data: any = await apiClient.post('/auth/register', formData);

      if (data && data.user && data.accessToken) {
        setAuth(data.user, data.tenant, data.accessToken, 'OWNER');
        // Route to guided onboarding flow
        router.push('/onboarding');
      }
    } catch (err: any) {
      setError(
        err?.message || 'Registration failed. Please check your information.',
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
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2000&auto=format&fit=crop" 
            alt="Workspace background" 
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
              Start building for free.
            </h1>
            <p className="text-[15px] text-slate-300 leading-relaxed">
              Join thousands of creators and businesses managing their online presence with KDBA. Setup takes less than a minute.
            </p>
          </div>
          
          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3 text-[14px] text-slate-300 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>30-day free trial on all plans</span>
            </div>
            <div className="flex items-center gap-3 text-[14px] text-slate-300 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>No credit card required to start</span>
            </div>
            <div className="flex items-center gap-3 text-[14px] text-slate-300 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Cancel anytime, no questions asked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[420px] space-y-8">
          
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
              Create an account
            </h2>
            <p className="text-[14px] text-slate-400">
              Enter your details to launch your business workspace
            </p>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="flex items-center gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 p-3.5 text-[13px] font-medium text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-300">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      placeholder="Alex"
                      className="w-full rounded-xl border border-white/10 bg-[#0f1422] py-2.5 pl-10 pr-4 text-[14px] text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-300">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="Morgan"
                    className="w-full rounded-xl border border-white/10 bg-[#0f1422] py-2.5 px-4 text-[14px] text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-slate-300">
                  Business / Company Name
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData({ ...formData, businessName: e.target.value })
                    }
                    placeholder="e.g. Apex Advisory"
                    className="w-full rounded-xl border border-white/10 bg-[#0f1422] py-2.5 pl-10 pr-4 text-[14px] text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-slate-300">
                  Work Email
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="alex@company.com"
                    className="w-full rounded-xl border border-white/10 bg-[#0f1422] py-2.5 pl-10 pr-4 text-[14px] text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-slate-300">
                  Password <span className="text-slate-500 text-[11px] font-normal normal-case">(min 8 chars)</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
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
                {isLoading ? 'Creating Account...' : 'Create Account & Start Builder'}
              </Button>
            </form>

            <div className="text-center text-[13px] text-slate-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-white hover:text-slate-200 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
