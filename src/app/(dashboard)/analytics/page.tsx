'use client';

import * as React from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { Lead, LeadStats, Website } from '@/types';
import { BarChart3, Globe, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/kdba/page-header';
import { StatCard } from '@/components/kdba/stat-card';
import { EmptyState } from '@/components/ui/empty-state';

export default function AnalyticsPage() {
  const [websites, setWebsites] = React.useState<Website[]>([]);
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [stats, setStats] = React.useState<LeadStats>({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    lost: 0,
  });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      apiClient.get('/websites').catch(() => []),
      apiClient.get('/leads').catch(() => []),
      apiClient.get('/leads/stats').catch(() => null),
    ])
      .then(([websitesData, leadsData, statsData]) => {
        setWebsites(Array.isArray(websitesData) ? websitesData : []);
        setLeads(Array.isArray(leadsData) ? leadsData : []);
        if (statsData && typeof statsData === 'object') setStats(statsData as unknown as LeadStats);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const publishedCount = websites.filter((site) => site.status === 'PUBLISHED').length;
  const conversionRate =
    stats.total > 0 ? Math.round((stats.converted / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Workspace activity from live sites and inbound forms. Traffic tracking will layer onto this view later."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Live websites" value={publishedCount} icon={<Globe />} loading={isLoading} />
        <StatCard title="Total leads" value={stats.total} icon={<Users />} loading={isLoading} />
        <StatCard title="New inquiries" value={stats.new} loading={isLoading} />
        <StatCard title="Conversion" value={`${conversionRate}%`} description="Converted / total leads" loading={isLoading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lead pipeline</CardTitle>
            <CardDescription>Counts from the CRM, not estimated traffic.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            {(
              [
                ['New', stats.new],
                ['Contacted', stats.contacted],
                ['Qualified', stats.qualified],
                ['Converted', stats.converted],
                ['Lost', stats.lost],
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
            <CardTitle>Recent inquiries</CardTitle>
            <CardDescription>Last five form submissions.</CardDescription>
          </CardHeader>
          <CardContent>
            {!isLoading && leads.length === 0 ? (
              <EmptyState
                icon={<BarChart3 className="size-5" />}
                title="No form activity yet"
                description="Publish a site with a contact form to start collecting inquiries."
                className="min-h-0 border-0 bg-transparent p-4"
              />
            ) : (
              <ul className="space-y-3 text-sm">
                {leads.slice(0, 5).map((lead) => (
                  <li key={lead.id} className="flex items-center justify-between gap-3">
                    <span className="truncate font-medium">{lead.name}</span>
                    <span className="text-muted-foreground">{lead.status}</span>
                  </li>
                ))}
              </ul>
            )}
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="/leads">Open forms & leads</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
