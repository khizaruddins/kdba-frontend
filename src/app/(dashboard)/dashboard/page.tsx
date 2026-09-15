'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { apiClient } from '@/lib/api/client';
import { Website, Lead, LeadStats, Product } from '@/types';
import { formatDate } from '@/lib/utils';
import {
  ArrowRight,
  ExternalLink,
  Globe,
  LayoutTemplate,
  Pencil,
  Plus,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/kdba/page-header';
import { StatCard } from '@/components/kdba/stat-card';

export default function DashboardPage() {
  const { user, tenant } = useAuthStore();
  const [websites, setWebsites] = React.useState<Website[]>([]);
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [leadStats, setLeadStats] = React.useState<LeadStats>({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    lost: 0,
  });
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadDashboardData() {
      try {
        const [websitesData, leadsData, statsData, productsData]: unknown[] = await Promise.all([
          apiClient.get('/websites').catch(() => []),
          apiClient.get('/leads').catch(() => []),
          apiClient.get('/leads/stats').catch(() => ({ total: 0, new: 0 })),
          apiClient.get('/products').catch(() => []),
        ]);

        setWebsites(Array.isArray(websitesData) ? websitesData : []);
        setLeads(Array.isArray(leadsData) ? leadsData : []);
        if (statsData && typeof statsData === 'object') setLeadStats(statsData as LeadStats);
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    void loadDashboardData();
  }, []);

  const primaryWebsite = websites[0];
  const isPublished = primaryWebsite?.status === 'PUBLISHED';
  const firstName = user?.firstName || 'there';

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description={
          tenant?.name
            ? `${tenant.name} · pick up where you left off.`
            : 'Pick up where you left off.'
        }
        actions={
          primaryWebsite ? (
            <>
              <Button size="sm" asChild>
                <Link href={`/editor/${primaryWebsite.id}`}>
                  <Pencil />
                  Edit website
                </Link>
              </Button>
              {isPublished ? (
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/site/${tenant?.slug || primaryWebsite.slug}`} target="_blank">
                    <ExternalLink />
                    View live site
                  </Link>
                </Button>
              ) : null}
            </>
          ) : (
            <Button size="sm" asChild>
              <Link href="/templates">
                <Plus />
                Create website
              </Link>
            </Button>
          )
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Websites"
          value={websites.length}
          description={primaryWebsite ? (isPublished ? 'At least one site is live' : 'Draft in progress') : 'No sites yet'}
          icon={<Globe />}
          loading={isLoading}
        />
        <StatCard
          title="Leads"
          value={leadStats.total}
          description={leadStats.new > 0 ? `${leadStats.new} new inquiries` : 'No new inquiries'}
          icon={<Users />}
          loading={isLoading}
        />
        <StatCard
          title="Products"
          value={products.length}
          description="Catalog items"
          icon={<ShoppingBag />}
          loading={isLoading}
        />
        <StatCard
          title="Pages"
          value={primaryWebsite?.pages?.length || 0}
          description={primaryWebsite?.name || 'Create a site to add pages'}
          icon={<LayoutTemplate />}
          loading={isLoading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>Your websites</CardTitle>
              <CardDescription>Open the builder or start from a template.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/websites">
                View all
                <ArrowRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : websites.length === 0 ? (
              <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed p-6">
                <p className="text-sm font-medium">No websites yet</p>
                <p className="text-sm text-muted-foreground">
                  Choose a template and you can publish in minutes.
                </p>
                <Button size="sm" asChild>
                  <Link href="/templates">Browse templates</Link>
                </Button>
              </div>
            ) : (
              <ul className="divide-y">
                {websites.slice(0, 4).map((website) => (
                  <li key={website.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="flex size-9 items-center justify-center rounded-md border bg-muted">
                      <Globe className="size-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{website.name}</p>
                      <p className="truncate text-xs text-muted-foreground">/{website.slug}</p>
                    </div>
                    <Badge variant={website.status === 'PUBLISHED' ? 'success' : 'secondary'}>
                      {website.status === 'PUBLISHED' ? 'Live' : 'Draft'}
                    </Badge>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/editor/${website.id}`}>Edit</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>Latest form inquiries from your sites.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/leads">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="size-9 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : leads.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Inquiries will appear here after a visitor submits a contact form.
              </p>
            ) : (
              <ul className="space-y-4">
                {leads.slice(0, 5).map((lead) => (
                  <li key={lead.id} className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full border bg-muted text-xs font-medium">
                      {lead.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{lead.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {lead.email} · {formatDate(lead.createdAt)}
                      </p>
                    </div>
                    <Badge variant={lead.status === 'NEW' ? 'default' : 'secondary'}>{lead.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
