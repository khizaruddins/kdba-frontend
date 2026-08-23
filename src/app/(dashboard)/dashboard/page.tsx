'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { apiClient } from '@/lib/api/client';
import { Website, Lead, LeadStats, Product } from '@/types';
import { formatDate } from '@/lib/utils';
import {
  Globe,
  Users,
  ShoppingBag,
  CreditCard,
  Edit,
  Eye,
  Plus,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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
        const [websitesData, leadsData, statsData, productsData]: any =
          await Promise.all([
            apiClient.get('/websites').catch(() => []),
            apiClient.get('/leads').catch(() => []),
            apiClient.get('/leads/stats').catch(() => ({ total: 0, new: 0 })),
            apiClient.get('/products').catch(() => []),
          ]);

        setWebsites(Array.isArray(websitesData) ? websitesData : []);
        setLeads(Array.isArray(leadsData) ? leadsData : []);
        if (statsData) setLeadStats(statsData);
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const primaryWebsite = websites[0];
  const isPublished = primaryWebsite?.status === 'PUBLISHED';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 p-8 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Workspace Overview
            </span>
            <Badge variant={isPublished ? 'success' : 'secondary'}>
              {isPublished ? 'Published Live' : 'Draft Mode'}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.firstName || 'Business Owner'}
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            {tenant?.name} is ready for customer traffic and lead generation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {primaryWebsite ? (
            <>
              <Link href={`/editor/${primaryWebsite.id}`}>
                <Button
                  size="sm"
                  leftIcon={<Edit className="h-3.5 w-3.5" />}
                >
                  Edit Website
                </Button>
              </Link>
              {isPublished && (
                <Link
                  href={`/site/${tenant?.slug || primaryWebsite.slug}`}
                  target="_blank"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<ExternalLink className="h-3.5 w-3.5" />}
                  >
                    View Live Site
                  </Button>
                </Link>
              )}
            </>
          ) : (
            <Link href="/templates">
              <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                Create First Website
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inbound Leads */}
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                Total Leads
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {leadStats.total}
              </span>
              {leadStats.new > 0 && (
                <span className="text-xs font-semibold text-emerald-400">
                  +{leadStats.new} new
                </span>
              )}
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Form inquiries captured from your site
            </p>
          </CardContent>
        </Card>

        {/* Website Status */}
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                Website Status
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <Globe className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">
                {isPublished ? 'Live & Online' : 'Editing Draft'}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              {primaryWebsite
                ? `${primaryWebsite.name}`
                : 'No website created yet'}
            </p>
          </CardContent>
        </Card>

        {/* Products in Catalog */}
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                Products & Services
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                <ShoppingBag className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {products.length}
              </span>
              <span className="text-xs text-slate-400">active items</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Displayed in featured menu / catalog
            </p>
          </CardContent>
        </Card>

        {/* Website Pages */}
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                Core Pages
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {primaryWebsite?.pages?.length || 3}
              </span>
              <span className="text-xs text-slate-400">Home, About, Contact</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              V1 Architecture standard pages
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Section: Recent Leads & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Inbound Leads Table */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base">Recent Inbound Leads</CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct customer inquiries submitted through your website
                </p>
              </div>
              <Link href="/leads">
                <Button variant="ghost" size="sm" className="text-xs text-indigo-400">
                  <span>View CRM</span>
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : leads.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <Users className="mx-auto h-8 w-8 mb-2 opacity-40" />
                  <p className="text-sm font-semibold text-slate-300">
                    No leads received yet
                  </p>
                  <p className="text-xs mt-1 text-slate-500">
                    When visitors submit your website contact form, their details
                    will appear here instantly.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold">
                      <tr>
                        <th className="py-3 px-6">Name</th>
                        <th className="py-3 px-6">Email</th>
                        <th className="py-3 px-6">Status</th>
                        <th className="py-3 px-6">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {leads.slice(0, 5).map((lead) => (
                        <tr
                          key={lead.id}
                          className="hover:bg-slate-900/50 transition-colors"
                        >
                          <td className="py-3.5 px-6 font-medium text-white">
                            {lead.name}
                          </td>
                          <td className="py-3.5 px-6 text-slate-300">
                            {lead.email}
                          </td>
                          <td className="py-3.5 px-6">
                            <Badge
                              variant={
                                lead.status === 'NEW'
                                  ? 'default'
                                  : lead.status === 'QUALIFIED'
                                  ? 'success'
                                  : 'secondary'
                              }
                            >
                              {lead.status}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-6 text-slate-400">
                            {formatDate(lead.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Quick Launch Card & Navigation */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-bold text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link href="/templates" className="block">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  leftIcon={<Sparkles className="h-4 w-4 text-indigo-400" />}
                >
                  Browse Templates
                </Button>
              </Link>
              <Link href="/products" className="block">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  leftIcon={<ShoppingBag className="h-4 w-4 text-amber-400" />}
                >
                  Manage Products
                </Button>
              </Link>
              <Link href="/pricing" className="block">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  leftIcon={<CreditCard className="h-4 w-4 text-emerald-400" />}
                >
                  Configure Pricing Plans
                </Button>
              </Link>
              <Link href="/media" className="block">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  leftIcon={<Globe className="h-4 w-4 text-purple-400" />}
                >
                  Upload Media Assets
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
