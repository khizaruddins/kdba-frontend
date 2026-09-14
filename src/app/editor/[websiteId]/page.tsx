'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { websitesApi } from '@/lib/api/websites';
import { extractWebsiteDocument, toEditorDocument } from '@/lib/document/v3-wire';
import { V3VisualBuilder } from '@/components/editor/v3/V3VisualBuilder';
import { Button } from '@/components/ui/button';
import { Loader2, Rocket } from 'lucide-react';

export default function WebsiteEditorPage() {
  const params = useParams();
  const router = useRouter();
  const websiteId = params?.websiteId as string;

  const { isAuthenticated, isLoading: authLoading, fetchProfile } = useAuthStore();
  const { setDocumentData, document } = useV3EditorStore();

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

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

    const applyDocument = (raw: unknown, revision?: number, hash?: string) => {
      const doc = toEditorDocument(raw);
      if (!doc.pages?.length) {
        throw new Error('Website document is missing pages');
      }
      setDocumentData(websiteId, doc, revision || 1, hash || '');
    };

    try {
      const docRes = await websitesApi.getDocument(websiteId);

      if (docRes && docRes.document) {
        applyDocument(docRes.document, docRes.revision || 1, docRes.documentHash || '');
      } else {
        const siteData = await websitesApi.getById(websiteId);
        const raw = extractWebsiteDocument(siteData);
        if (raw) {
          const revision = (siteData as unknown as { documentRevision?: number }).documentRevision || 1;
          applyDocument(raw, revision);
        } else {
          setError('Website document not found');
        }
      }
    } catch (err: unknown) {
      console.error('Failed to load website builder document:', err);
      try {
        const siteData = await websitesApi.getById(websiteId);
        const raw = extractWebsiteDocument(siteData);
        if (raw) {
          const revision = (siteData as unknown as { documentRevision?: number }).documentRevision || 1;
          applyDocument(raw, revision);
          return;
        }
      } catch {
        // ignore secondary error
      }

      const errorObj = err as {
        response?: { data?: { message?: string; errors?: Array<{ path?: string; message?: string }> } };
        message?: string;
        errors?: Array<{ path?: string; message?: string }>;
      };
      const details = errorObj?.response?.data?.errors || errorObj?.errors;
      const detailText = Array.isArray(details)
        ? details
            .slice(0, 3)
            .map((item) => item.message)
            .filter(Boolean)
            .join(' ')
        : '';
      setError(
        errorObj?.response?.data?.message ||
          errorObj?.message ||
          (detailText ? `Document schema mismatch: ${detailText}` : null) ||
          'Failed to load website. It may have been removed or access is restricted.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [websiteId, setDocumentData]);

  React.useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      void Promise.resolve().then(() => loadWebsiteData());
    }
  }, [authLoading, isAuthenticated, loadWebsiteData]);

  if (authLoading || isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0B0D13] text-slate-400 select-none">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-xs font-semibold tracking-wide text-slate-300">
            Loading Visual Website Builder...
          </p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0B0D13] p-6 text-slate-100 select-none">
        <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Rocket className="h-7 w-7 rotate-180" />
          </div>
          <h2 className="text-xl font-bold text-white">Website Not Found</h2>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            {error || 'Unable to find or load the requested website in your workspace.'}
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <Button onClick={() => loadWebsiteData()} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white" size="sm">
              Retry Loading
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/websites')}
              className="w-full border-slate-800 text-slate-300"
              size="sm"
            >
              Back to My Websites
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <V3VisualBuilder />;
}
