'use client';

import * as React from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { DashboardOverview } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { formatPeriodRange } from '@/lib/workspace';
import { BarChart3, Globe, ShoppingBag, Users } from 'lucide-react';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/kdba/page-header';
import { StatCard } from '@/components/kdba/stat-card';
import { EmptyState } from '@/components/ui/empty-state';
import { LeadsAreaChart, LeadsBarChart } from '@/components/kdba/workspace-charts';

const EMPTY: DashboardOverview = {
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

export default function AnalyticsPage() {
  const [data, setData] = React.useState<DashboardOverview>(EMPTY);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    apiClient
      .get('/dashboard', { params: { days: 28 } })
      .then((payload) => setData(payload as unknown as DashboardOverview))
      .finally(() => setIsLoading(false));
  }, []);

  const series = data.leads.series ?? [];
  const conversionRate = data.leads.conversionRate ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description={`Workspace activity from live sites and inbound forms · ${formatPeriodRange(data.period.from, data.period.to)}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Live websites"
          value={data.websites.published}
          icon={<Globe />}
          loading={isLoading}
        />
        <StatCard
          title="Leads this period"
          value={data.leads.periodCounts?.total ?? 0}
          trend={data.leads.change?.total}
          icon={<Users />}
          loading={isLoading}
        />
        <StatCard
          title="Conversion"
          value={`${conversionRate}%`}
          description="Converted / all-time leads"
          loading={isLoading}
        />
        <StatCard
          title="Catalog value"
          value={formatCurrency(data.products.catalogValue)}
          icon={<ShoppingBag />}
          loading={isLoading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Leads by day</CardTitle>
            <CardDescription>Form submissions over the last {data.period.days} days</CardDescription>
            <CardAction>
              <Button variant="outline" size="sm" asChild>
                <Link href="/leads">Open leads</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-[220px] w-full" /> : <LeadsBarChart data={series} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pipeline trend</CardTitle>
            <CardDescription>Leads vs converted in the same window</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-[220px] w-full" /> : <LeadsAreaChart data={series} />}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lead pipeline</CardTitle>
            <CardDescription>All-time status mix</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            {(
              [
                ['New', data.leads.new],
                ['Contacted', data.leads.contacted],
                ['Qualified', data.leads.qualified],
                ['Converted', data.leads.converted],
                ['Lost', data.leads.lost],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="rounded-lg border p-3">
                <p className="text-muted-foreground">{label}</p>
                <p className="mt-1 text-xl font-semibold">{isLoading ? '—' : value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category mix</CardTitle>
            <CardDescription>How the catalog is distributed</CardDescription>
          </CardHeader>
          <CardContent>
            {!isLoading && data.products.byCategory.length === 0 ? (
              <EmptyState
                icon={<BarChart3 className="size-5" />}
                title="No catalog data yet"
                description="Add products to see category share here."
                className="min-h-0 border-0 bg-transparent p-4"
              />
            ) : (
              <ul className="space-y-3 text-sm">
                {data.products.byCategory.map((row) => {
                  const share =
                    data.products.total > 0 ? Math.round((row.count / data.products.total) * 100) : 0;
                  return (
                    <li key={row.category}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-medium">{row.category}</span>
                        <span className="text-muted-foreground">
                          {row.count} · {share}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted">
                        <div className="h-1.5 rounded-full bg-foreground" style={{ width: `${share}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
