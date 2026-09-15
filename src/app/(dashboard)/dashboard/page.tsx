'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';
import { apiClient } from '@/lib/api/client';
import { websitesApi } from '@/lib/api/websites';
import { businessApi } from '@/lib/api/business';
import { DashboardOverview } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { formatPeriodRange } from '@/lib/workspace';
import {
  ArrowRight,
  Globe,
  Pencil,
  Plus,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/kdba/page-header';
import { StatCard } from '@/components/kdba/stat-card';
import { WebsiteActionsMenu } from '@/components/kdba/website-actions-menu';
import { EmptyState } from '@/components/ui/empty-state';
import { LeadsBarChart } from '@/components/kdba/workspace-charts';
import { leadStatusVariant, LEAD_STATUS_LABEL, shortRef } from '@/lib/workspace';

const EMPTY_OVERVIEW: DashboardOverview = {
  period: { days: 28, from: '', to: '' },
  websites: { total: 0, published: 0, draft: 0 },
  products: {
    total: 0,
    active: 0,
    inactive: 0,
    catalogValue: 0,
    discounted: 0,
    outOfStock: 0,
    byCategory: [],
  },
  leads: {
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    lost: 0,
    series: [],
    change: { total: 0, new: 0, converted: 0 },
  },
  recentLeads: [],
  topProducts: [],
  websitesPreview: [],
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, tenant } = useAuthStore();
  const [data, setData] = React.useState<DashboardOverview>(EMPTY_OVERVIEW);
  const [isLoading, setIsLoading] = React.useState(true);

  const [isCreatingBlank, setIsCreatingBlank] = React.useState(false);

  const loadDashboard = React.useCallback(() => {
    return apiClient
      .get('/dashboard', { params: { days: 28 } })
      .then((payload) => setData(payload as unknown as DashboardOverview))
      .catch(() => {
        toast.error('Could not load dashboard metrics');
      });
  }, []);

  React.useEffect(() => {
    loadDashboard().finally(() => setIsLoading(false));
  }, [loadDashboard]);

  const primaryWebsite = data.websitesPreview[0];
  const firstName = user?.firstName || 'there';
  const pipelineTotal = Math.max(data.leads.total, 1);
  const series = data.leads.series ?? [];
  const periodLeads = data.leads.periodCounts?.total ?? 0;

  const activity = React.useMemo(() => {
    const items = [
      ...data.websitesPreview.map((site) => ({
        id: `site-${site.id}`,
        title: site.status === 'PUBLISHED' ? 'Website published' : 'Page edited',
        detail: site.name,
        at: site.updatedAt,
      })),
      ...data.recentLeads.map((lead) => ({
        id: `lead-${lead.id}`,
        title: 'Form submission received',
        detail: lead.name,
        at: lead.createdAt,
      })),
    ];
    return items
      .filter((item) => item.at)
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
      .slice(0, 8);
  }, [data.websitesPreview, data.recentLeads]);

  const handleCreateBlank = async () => {
    setIsCreatingBlank(true);
    try {
      const businesses = await businessApi.getAll();
      let businessId = businesses[0]?.id;
      if (!businessId) {
        const created = await businessApi.create({ name: tenant?.name || 'My business' });
        businessId = created.id;
      }
      const templates = (await apiClient.get('/templates').catch(() => [])) as Array<{
        id?: string;
        slug?: string;
      }>;
      const starter = Array.isArray(templates) ? templates[0] : null;
      if (!starter?.id && !starter?.slug) {
        toast.error('No starter templates are available yet. Seed templates, then try again.');
        setIsCreatingBlank(false);
        return;
      }
      const site = await websitesApi.create({
        businessId,
        templateId: starter.slug || starter.id,
        name: 'Untitled website',
      });
      toast.success('Website created');
      router.push(`/editor/${site.id}`);
    } catch {
      toast.error('Could not create a blank website');
      setIsCreatingBlank(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Workspace dashboard"
        description={`${tenant?.name || 'Your workspace'} · welcome back, ${firstName}.`}
        actions={
          <>
            <div className="hidden items-center rounded-lg border bg-background px-3 py-1.5 text-xs text-muted-foreground sm:flex">
              {formatPeriodRange(data.period.from, data.period.to)}
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link href="/templates">Start from template</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={primaryWebsite ? `/editor/${primaryWebsite.id}` : '/templates'}>
                {primaryWebsite ? <Pencil /> : <Plus />}
                {primaryWebsite ? 'Open recent website' : 'Create website'}
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { href: '/templates', title: 'Create website', body: 'Start from an industry template.' },
          { href: '/templates', title: 'Start from template', body: 'Browse the template library.' },
          {
            href: primaryWebsite ? `/editor/${primaryWebsite.id}` : '/websites',
            title: 'Open recent website',
            body: primaryWebsite ? primaryWebsite.name : 'No sites yet — create one first.',
          },
        ].map((action) => (
          <Link key={action.title} href={action.href}>
            <Card className="h-full transition-colors hover:bg-muted/40">
              <CardHeader>
                <CardTitle className="text-sm">{action.title}</CardTitle>
                <CardDescription>{action.body}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
        <button type="button" className="text-left" onClick={() => void handleCreateBlank()} disabled={isCreatingBlank}>
          <Card className="h-full transition-colors hover:bg-muted/40">
            <CardHeader>
              <CardTitle className="text-sm">Create blank website</CardTitle>
              <CardDescription>
                {isCreatingBlank ? 'Creating…' : 'Start empty and add blocks in the editor.'}
              </CardDescription>
            </CardHeader>
          </Card>
        </button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Websites</CardTitle>
            <CardDescription>Open a site, publish it, or start another from a template.</CardDescription>
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
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : data.websitesPreview.length === 0 ? (
            <EmptyState
              icon={<Globe className="size-5" />}
              title="No websites yet"
              description="Choose a template to create your first site. You can publish it when it is ready."
              actionLabel="Create website"
              onAction={() => router.push('/templates')}
              className="min-h-0 border-0 bg-transparent"
            />
          ) : (
            <ul className="divide-y">
              {data.websitesPreview.map((site) => (
                <li key={site.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="flex size-9 items-center justify-center rounded-md border bg-muted">
                    <Globe className="size-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{site.name}</p>
                    <p className="truncate text-xs text-muted-foreground">/{site.slug}</p>
                  </div>
                  <Badge variant={site.status === 'PUBLISHED' ? 'success' : 'secondary'}>
                    {site.status === 'PUBLISHED' ? 'Live' : 'Draft'}
                  </Badge>
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    {formatDate(site.updatedAt)}
                  </span>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/editor/${site.id}`}>Open</Link>
                  </Button>
                  <WebsiteActionsMenu
                    website={site}
                    tenantSlug={tenant?.slug}
                    onChanged={() => void loadDashboard()}
                  />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="border-b">
            <CardTitle>Lead activity</CardTitle>
            <CardDescription>Inbound form submissions · last {data.period.days} days</CardDescription>
            <CardAction className="text-right text-xs text-muted-foreground">
              <p>This period</p>
              <p className="text-lg font-semibold text-foreground">{isLoading ? '—' : periodLeads}</p>
            </CardAction>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? <Skeleton className="h-[220px] w-full" /> : <LeadsBarChart data={series} />}
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-1 xl:grid-cols-2">
          <StatCard
            title="New inquiries"
            value={data.leads.new}
            trend={data.leads.change?.new}
            icon={<Users />}
            loading={isLoading}
          />
          <StatCard
            title="Converted"
            value={data.leads.converted}
            trend={data.leads.change?.converted}
            description={`${data.leads.conversionRate ?? 0}% of all leads`}
            loading={isLoading}
          />
          <StatCard
            title="Catalog value"
            value={formatCurrency(data.products.catalogValue)}
            description={`${data.products.active} active products`}
            icon={<ShoppingBag />}
            loading={isLoading}
          />
          <StatCard
            title="Live websites"
            value={data.websites.published}
            description={
              data.websites.draft > 0 ? `${data.websites.draft} still in draft` : 'All published'
            }
            icon={<Globe />}
            loading={isLoading}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Best catalog products</CardTitle>
              <CardDescription>Active items ready for published sites</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/products">
                View all
                <ArrowRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : data.topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Add products to show them here and on live sites.</p>
            ) : (
              <ul className="space-y-3">
                {data.topProducts.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.id}`}
                      className="flex items-center gap-3 rounded-lg py-1 hover:bg-muted/50"
                    >
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt=""
                          className="size-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                          <ShoppingBag className="size-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{product.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {product.category || 'Uncategorized'}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        {formatCurrency(product.price, product.currency)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Lead pipeline</CardTitle>
            <CardDescription>Where inbound inquiries sit right now</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {(
                [
                  ['New', data.leads.new, 'bg-chart-2'],
                  ['Contacted', data.leads.contacted, 'bg-chart-4'],
                  ['Qualified', data.leads.qualified, 'bg-chart-1'],
                  ['Converted', data.leads.converted, 'bg-chart-3'],
                ] as const
              ).map(([label, value, bar]) => (
                <div key={label}>
                  <p className="text-2xl font-semibold">{isLoading ? '—' : value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <div className="mt-2 h-1 rounded-full bg-muted">
                    <div
                      className={`h-1 rounded-full ${bar}`}
                      style={{ width: `${Math.min(100, (value / pipelineTotal) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto">
              {isLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : data.recentLeads.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Inquiries will appear here after a visitor submits a contact form.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="pb-2 font-medium">Lead</th>
                      <th className="pb-2 font-medium">Source</th>
                      <th className="pb-2 font-medium">Received</th>
                      <th className="pb-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data.recentLeads.map((lead) => (
                      <tr key={lead.id}>
                        <td className="py-2.5">
                          <Link href={`/leads/${lead.id}`} className="font-medium hover:underline">
                            {lead.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">{shortRef(lead.id)}</p>
                        </td>
                        <td className="py-2.5 text-muted-foreground">{lead.source || 'website'}</td>
                        <td className="py-2.5 text-muted-foreground">{formatDate(lead.createdAt)}</td>
                        <td className="py-2.5">
                          <Badge variant={leadStatusVariant(lead.status)}>
                            {LEAD_STATUS_LABEL[lead.status]}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Website edits and inbound form submissions from this workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : activity.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Activity appears here after you edit a website or receive a form submission.
            </p>
          ) : (
            <ul className="divide-y">
              {activity.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatDate(item.at)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
