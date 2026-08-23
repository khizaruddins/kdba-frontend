'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useEditorStore } from '@/stores/editor-store';
import { apiClient } from '@/lib/api/client';
import { EditorHeader } from '@/components/editor/editor-header';
import { EditorSidebar } from '@/components/editor/editor-sidebar';
import { EditorCanvas } from '@/components/editor/editor-canvas';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, Rocket, ExternalLink } from 'lucide-react';

import { Product, PricingPlan } from '@/types';

export default function WebsiteEditorPage() {
  const params = useParams();
  const router = useRouter();
  const websiteId = params?.websiteId as string;

  const { isAuthenticated, isLoading: authLoading, fetchProfile } = useAuthStore();
  const { setWebsite, website } = useEditorStore();

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [pricingPlans, setPricingPlans] = React.useState<PricingPlan[]>([]);
  const [publishSuccessOpen, setPublishSuccessOpen] = React.useState(false);

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const loadWebsiteData = React.useCallback(async () => {
    if (!websiteId) return;

    setIsLoading(true);
    setError(null);

    try {
      const [siteData, productsData, plansData]: any = await Promise.all([
        apiClient.get(`/websites/${websiteId}`),
        apiClient.get('/products').catch(() => []),
        apiClient.get('/pricing-plans').catch(() => []),
      ]);

      if (siteData) {
        setWebsite(siteData);
      } else {
        setError('Website not found');
      }

      setProducts(Array.isArray(productsData) ? productsData : []);
      setPricingPlans(Array.isArray(plansData) ? plansData : []);
    } catch (err: any) {
      console.error('Failed to load website editor data:', err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to load website. It may have been removed or access is restricted.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [websiteId, setWebsite]);

  React.useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      loadWebsiteData();
    }
  }, [authLoading, isAuthenticated, loadWebsiteData]);

  if (authLoading || isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-xs font-semibold tracking-wide">
            Loading Website Builder...
          </p>
        </div>
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
        <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Rocket className="h-7 w-7 rotate-180" />
          </div>
          <h2 className="text-xl font-bold text-white">Website Not Found</h2>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            {error || 'Unable to find or load the requested website in your workspace.'}
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <Button
              onClick={() => loadWebsiteData()}
              className="w-full"
              size="sm"
            >
              Retry Loading
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/websites')}
              className="w-full"
              size="sm"
            >
              Back to My Websites
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-950 select-none">
      {/* Top toolbar */}
      <EditorHeader
        onPublishSuccess={() => setPublishSuccessOpen(true)}
      />

      {/* Editor Body: Sidebar + Canvas */}
      <div className="flex flex-1 overflow-hidden">
        <EditorSidebar
          products={products}
          onProductCreated={(newProd) =>
            setProducts((prev) => [newProd, ...prev])
          }
        />
        <EditorCanvas products={products} pricingPlans={pricingPlans} />
      </div>

      {/* Publish Success Modal */}
      <Dialog
        isOpen={publishSuccessOpen}
        onClose={() => setPublishSuccessOpen(false)}
        title="Website Published Live!"
        description="Your changes have been deployed and are now live to the world."
      >
        <div className="py-6 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <Rocket className="h-8 w-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">
              {website?.name} is Live
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Accessible to visitors and search engines. Inbound leads will be
              routed straight to your CRM.
            </p>
          </div>

          {website?.slug && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-300">
              /site/{website.slug}
            </div>
          )}

          <div className="flex justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPublishSuccessOpen(false)}
            >
              Continue Editing
            </Button>
            {website?.slug && (
              <a
                href={`/site/${website.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-500"
              >
                <span>Visit Live Site</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
