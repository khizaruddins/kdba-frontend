'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { apiClient } from '@/lib/api/client';
import { DashboardOverview } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { formatPeriodRange } from '@/lib/workspace';
import {
  ArrowRight,
  ExternalLink,
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
  const { user, tenant } = useAuthStore();
  const [data, setData] = React.useState<DashboardOverview>(EMPTY_OVERVIEW);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    apiClient
      .get('/dashboard', { params: { days: 28 } })
      .then((payload) => setData(payload as unknown as DashboardOverview))
      .catch((err) => console.error('Error fetching dashboard data:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const primaryWebsite = data.websitesPreview[0];
  const isPublished = primaryWebsite?.status === 'PUBLISHED';
  const firstName = user?.firstName || 'there';
  const pipelineTotal = Math.max(data.leads.total, 1);
  const series = data.leads.series ?? [];
  const periodLeads = data.leads.periodCounts?.total ?? 0;

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
            {primaryWebsite ? (
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
            )}
          </>
        }
      />

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
                  ['New', data.leads.new, 'bg-sky-500'],
                  ['Contacted', data.leads.contacted, 'bg-amber-500'],
                  ['Qualified', data.leads.qualified, 'bg-violet-500'],
                  ['Converted', data.leads.converted, 'bg-emerald-500'],
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
    </div>
  );
}
