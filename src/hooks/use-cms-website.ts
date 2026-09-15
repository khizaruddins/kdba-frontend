'use client';

import * as React from 'react';
import { websitesApi } from '@/lib/api/websites';
import { Website } from '@/types';

const STORAGE_KEY = 'kdba_cms_website_id';

export function useCmsWebsite() {
  const [websites, setWebsites] = React.useState<Website[]>([]);
  const [websiteId, setWebsiteId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    void websitesApi
      .getAll()
      .then((list) => {
        if (cancelled) return;
        const sites = Array.isArray(list) ? list : [];
        setWebsites(sites);
        const stored =
          typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
        const preferred =
          sites.find((site) => site.id === stored)?.id ||
          sites[0]?.id ||
          null;
        setWebsiteId(preferred);
      })
      .catch(() => {
        if (!cancelled) {
          setWebsites([]);
          setWebsiteId(null);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectWebsite = React.useCallback((id: string) => {
    setWebsiteId(id);
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const website = websites.find((site) => site.id === websiteId) || null;

  return { websites, website, websiteId, selectWebsite, isLoading };
}
