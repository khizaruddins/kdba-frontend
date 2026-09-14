'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { publishingApi } from '@/lib/api/publishing';
import { WebsiteRenderer } from '@/components/renderer/WebsiteRenderer';
import { PublicWebsiteResponse } from '@/types';
import { WebsiteDocumentV3 } from '@/types/v3-document';
import { toEditorDocument } from '@/lib/document/v3-wire';
import { Loader2, AlertCircle } from 'lucide-react';

export default function PublicSiteHomePage() {
  const params = useParams();
  const tenantSlug = params?.tenantSlug as string;

  const [siteData, setSiteData] = React.useState<PublicWebsiteResponse | null>(null);
  const [activePageSlug, setActivePageSlug] = React.useState('/');
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!tenantSlug) return;

    publishingApi
      .getPublicSite(tenantSlug)
      .then((data: PublicWebsiteResponse | null) => {
        if (data) {
          setSiteData(data);
          if (data.isBlocked) {
            document.title = `Access Restricted | ${data.tenant?.name || 'Website Suspended'}`;
          } else if (data.website) {
            document.title =
              data.website.seoTitle ||
              `${data.business?.name || data.tenant?.name} | Official Website`;

            if (data.website.favicon) {
              let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
              if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
              }
              link.href = data.website.favicon;
            }
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-12 text-center text-slate-100 relative overflow-hidden">
        <div className="relative w-full max-w-lg space-y-6 rounded-3xl border border-rose-500/30 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
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
          </div>

          <div className="rounded-2xl bg-slate-950/50 p-4 border border-slate-800 text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Are you the website owner?</p>
            <p>
              Please contact KDBA Platform Support at{' '}
              <a
                href="mailto:support@kdba.agency"
                className="text-indigo-400 hover:text-indigo-300 font-bold underline"
              >
                support@kdba.agency
              </a>
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

  const v3Candidates: Array<WebsiteDocumentV3 | undefined> = [
    siteData.publishedDocument,
    siteData.document,
    website.publishedDocument,
    website.document,
  ];
  const v3DocumentRaw =
    v3Candidates.find((doc) => doc?.schemaVersion === '3.0' || Boolean(doc?.pages?.[0]?.root)) || null;
  const v3Document = v3DocumentRaw ? toEditorDocument(v3DocumentRaw) : null;

  if (v3Document) {
    return (
      <WebsiteRenderer
        document={v3Document}
        activePageSlug={activePageSlug}
        products={products}
        pricingPlans={pricingPlans}
        isEditing={false}
        onNavigate={(url) => {
          if (url.startsWith('#')) {
            const el = document.querySelector(url);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            return;
          }
          setActivePageSlug(url);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  const websiteDocument = {
    id: website.id,
    name: website.name,
    slug: website.slug || tenant?.slug,
    status: 'PUBLISHED',
    theme: website.theme,
    business: business || { name: tenant?.name || website.name },
    pages: website.pages || [],
    seoTitle: website.seoTitle,
    seoDescription: website.seoDescription,
    favicon: website.favicon,
  };

  return (
    <WebsiteRenderer
      document={websiteDocument}
      activePageSlug={activePageSlug}
      products={products}
      pricingPlans={pricingPlans}
      isEditing={false}
      onNavigate={(url) => {
        if (url.startsWith('#')) {
          const el = document.querySelector(url);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
        setActivePageSlug(url);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    />
  );
}
