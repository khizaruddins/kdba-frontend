'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { apiClient } from '@/lib/api/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, Lock, Mail, User, Building2 } from 'lucide-react';

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
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      {/* Background glow */}
      <div className="pointer-events-none absolute h-[400px] w-[600px] rounded-full bg-purple-600/15 blur-[140px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 font-extrabold text-white text-lg shadow-lg shadow-indigo-500/20">
              K
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              KDBA
            </span>
          </Link>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
            Create Your Business Platform
          </h2>
          <p className="mt-1.5 text-xs text-slate-400">
            Launch professional business websites in minutes
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-medium text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                required
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                placeholder="Alex"
                leftIcon={<User className="h-4 w-4" />}
              />
              <Input
                label="Last Name"
                required
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                placeholder="Morgan"
              />
            </div>

            <Input
              label="Business / Company Name"
              required
              value={formData.businessName}
              onChange={(e) =>
                setFormData({ ...formData, businessName: e.target.value })
              }
              placeholder="e.g. Apex Advisory"
              leftIcon={<Building2 className="h-4 w-4" />}
            />

            <Input
              label="Work Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="alex@company.com"
              leftIcon={<Mail className="h-4 w-4" />}
            />

            <Input
              label="Password (min 8 characters)"
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Create Account & Start Builder
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
