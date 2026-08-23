'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { PublicWebsiteResponse } from '@/types';
import { SectionRenderer } from '@/components/sections/section-renderer';
import { Loader2, Globe, AlertCircle } from 'lucide-react';

export default function PublicSiteHomePage() {
  const params = useParams();
  const router = useRouter();
  const tenantSlug = params?.tenantSlug as string;

  const [siteData, setSiteData] = React.useState<any | null>(null);
  const [activePageSlug, setActivePageSlug] = React.useState('/');
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!tenantSlug) return;

    apiClient
      .get(`/public/sites/${tenantSlug}`)
      .then((data: any) => {
        if (data) {
          setSiteData(data);
          if (data.isBlocked) {
            document.title = `Access Restricted | ${data.tenant?.name || 'Website Suspended'}`;
          } else if (data.website) {
            document.title =
              data.website.seoTitle ||
              `${data.business?.name || data.tenant?.name} | Official Website`;
          }
        } else {
          setError('Published website not found or site is still in draft mode.');
        }
      })
      .catch((err) => {
        setError(
          err?.message ||
            'Published website not found. The site may still be in draft mode.',
        );
      })
      .finally(() => setIsLoading(false));
  }, [tenantSlug]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-xs font-semibold tracking-wide">Loading website...</p>
        </div>
      </div>
    );
  }

  // ─── ADMIN BLOCKED / SUSPENDED VIEW ─────────────────────────────────────────
  if (siteData?.isBlocked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-12 text-center text-slate-100 selection:bg-rose-500 selection:text-white relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-rose-500/10 blur-[140px] rounded-full" />
        </div>

        <div className="relative w-full max-w-lg space-y-6 rounded-3xl border border-rose-500/30 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
          {/* Red Shield Alert Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-lg shadow-rose-500/10">
            <AlertCircle className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-rose-400 border border-rose-500/20">
              Access Restricted • Platform Administration
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Website Temporarily Suspended
            </h1>
            <p className="text-xs text-slate-400">
              Access to <span className="font-semibold text-slate-200">{siteData.tenant?.name || 'this website'}</span> has been restricted by the platform administrator.
            </p>
          </div>

          {/* Reason Box */}
          <div className="rounded-2xl border border-rose-500/30 bg-slate-950/80 p-4 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                Reason for Suspension
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Status: {siteData.tenantStatus || 'BLOCKED'}
              </span>
            </div>
            <div className="rounded-xl bg-rose-500/5 p-3 border border-rose-500/10 text-sm font-medium text-slate-200">
              &ldquo;{siteData.blockedReason}&rdquo;
            </div>
            {siteData.blockedAt && (
              <div className="text-[11px] text-slate-400 font-mono">
                Enforced on: {new Date(siteData.blockedAt).toLocaleString()}
              </div>
            )}
          </div>

          {/* Support / Owner Notice */}
          <div className="rounded-2xl bg-slate-950/50 p-4 border border-slate-800 text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Are you the website owner?</p>
            <p>
              Please contact KDBA Platform Support at{' '}
              <a
                href="mailto:support@kdba.agency"
                className="text-indigo-400 hover:text-indigo-300 font-bold underline"
              >
                support@kdba.agency
              </a>{' '}
              to resolve compliance, billing, or security holds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !siteData?.website) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-slate-100">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 mb-4 border border-rose-500/20">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-white">Website Not Found</h1>
        <p className="mt-2 max-w-md text-xs text-slate-400">
          {error || 'This website has not been published live yet.'}
        </p>
      </div>
    );
  }

  const { website, business, products, pricingPlans, tenant } = siteData;

  // Resolve current active page
  const currentPage =
    website?.pages?.find((p: any) => p.slug === activePageSlug) || website?.pages?.[0];

  const handleNavigate = (url: string) => {
    if (url.startsWith('#')) {
      const el = document.querySelector(url);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (url === '/' || url === '/about' || url === '/contact') {
      setActivePageSlug(url);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between"
      style={{
        backgroundColor: website?.theme?.primaryColor || '#0f172a',
        fontFamily: website?.theme?.bodyFont || 'Inter',
      }}
    >
      <main className="flex-1 flex flex-col w-full">
        {currentPage?.sections?.map((section: any) => (
          <SectionRenderer
            key={section.id}
            type={section.type}
            config={section.config}
            theme={website.theme}
            business={business}
            products={products}
            pricingPlans={pricingPlans}
            isEditing={false}
            tenantSlug={tenant.slug}
            onNavigate={handleNavigate}
          />
        ))}
      </main>
    </div>
  );
}
