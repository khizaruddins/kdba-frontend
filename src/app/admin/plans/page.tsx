'use client';

import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  Plus,
  Check,
  Globe,
  ShoppingBag,
  HardDrive,
  Users,
  Sparkles,
  X,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New plan form
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    monthlyPrice: 49.0,
    yearlyPrice: 490.0,
    maxWebsites: 3,
    maxProducts: 50,
    maxMediaStorageMb: 5000,
    features: 'Up to 3 Websites, Full Analytics, Custom Domain',
    isPopular: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPlans = async () => {
    setIsLoading(true);
    try {
      const data: any = await apiClient.get('/admin/plans');
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load plans:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/admin/plans', {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        monthlyPrice: Number(formData.monthlyPrice),
        yearlyPrice: Number(formData.yearlyPrice),
        maxWebsites: Number(formData.maxWebsites),
        maxProducts: Number(formData.maxProducts),
        maxMediaStorageMb: Number(formData.maxMediaStorageMb),
        features: formData.features.split(',').map((f) => f.trim()).filter(Boolean),
        isPopular: formData.isPopular,
      });
      setCreateModalOpen(false);
      loadPlans();
    } catch (err) {
      console.error('Failed to create plan:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="SaaS Platform Subscription Plans"
      subtitle="Configure pricing tiers, resource limits, and feature access for all tenant subscriptions."
    >
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">
              Active Subscription Tiers
            </h3>
            <p className="text-xs text-slate-400">
              Tenants subscribe to these plans to build and publish websites.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Create New Plan
          </Button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-3xl border bg-slate-900/80 p-8 backdrop-blur-xl shadow-2xl transition-all hover:border-slate-700 ${
                plan.isPopular
                  ? 'border-indigo-500/50 ring-1 ring-indigo-500/30'
                  : 'border-slate-800'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-gradient-to-r from-indigo-500 to-amber-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white font-mono">
                    ${plan.monthlyPrice}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">/ month</span>
                </div>

                {/* Resource Limits */}
                <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-400">
                      <Globe className="h-3.5 w-3.5 text-indigo-400" />
                      Websites Allowed
                    </span>
                    <span className="font-bold text-white">{plan.maxWebsites} Sites</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-400">
                      <ShoppingBag className="h-3.5 w-3.5 text-amber-400" />
                      Catalog Items
                    </span>
                    <span className="font-bold text-white">{plan.maxProducts} Items</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-400">
                      <HardDrive className="h-3.5 w-3.5 text-emerald-400" />
                      Media Storage
                    </span>
                    <span className="font-bold text-white">{plan.maxMediaStorageMb} MB</span>
                  </div>
                </div>

                {/* Feature List */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Included Features:
                  </span>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {Array.isArray(plan.features) &&
                      plan.features.map((feat: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                          <span>{feat}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 border-t border-slate-800 pt-4 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-amber-400" />
                  <span>{plan.activeSubscribersCount || 0} Subscribers</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  +${((plan.activeSubscribersCount || 0) * plan.monthlyPrice).toLocaleString()}/mo MRR
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Plan Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg space-y-5 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                Create Platform Pricing Plan
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400">Plan Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. VIP Custom"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="vip-custom"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400">Monthly Price ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.monthlyPrice}
                    onChange={(e) => setFormData({ ...formData, monthlyPrice: parseFloat(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400">Yearly Price ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.yearlyPrice}
                    onChange={(e) => setFormData({ ...formData, yearlyPrice: parseFloat(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-400">Max Sites</label>
                  <input
                    type="number"
                    value={formData.maxWebsites}
                    onChange={(e) => setFormData({ ...formData, maxWebsites: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-400">Max Products</label>
                  <input
                    type="number"
                    value={formData.maxProducts}
                    onChange={(e) => setFormData({ ...formData, maxProducts: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-400">Storage (MB)</label>
                  <input
                    type="number"
                    value={formData.maxMediaStorageMb}
                    onChange={(e) => setFormData({ ...formData, maxMediaStorageMb: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400">Features (Comma-separated)</label>
                <input
                  type="text"
                  required
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="default" size="sm" type="submit" isLoading={isSubmitting}>
                  Save Plan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
