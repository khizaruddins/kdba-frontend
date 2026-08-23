'use client';

import * as React from 'react';
import { apiClient } from '@/lib/api/client';
import { PricingPlan } from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { EmptyState } from '@/components/ui/empty-state';

export default function PricingPage() {
  const [plans, setPlans] = React.useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Dialog
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingPlan, setEditingPlan] = React.useState<PricingPlan | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    price: 49.0,
    currency: 'USD',
    billingPeriod: 'month',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    ctaText: 'Get Started',
    ctaUrl: '#contact',
    isRecommended: false,
    isActive: true,
  });

  const [newFeatureInput, setNewFeatureInput] = React.useState('');

  const loadPlans = async () => {
    try {
      const data: any = await apiClient.get('/pricing-plans');
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load pricing plans:', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadPlans();
  }, []);

  const openCreateDialog = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      description: '',
      price: 49.0,
      currency: 'USD',
      billingPeriod: 'month',
      features: ['24/7 Priority Support', 'Dedicated Advisor', 'Monthly Review'],
      ctaText: 'Get Started',
      ctaUrl: '#contact',
      isRecommended: false,
      isActive: true,
    });
    setNewFeatureInput('');
    setIsDialogOpen(true);
  };

  const openEditDialog = (plan: PricingPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || '',
      price: Number(plan.price),
      currency: plan.currency || 'USD',
      billingPeriod: plan.billingPeriod || 'month',
      features: Array.isArray(plan.features) ? plan.features : [],
      ctaText: plan.ctaText || 'Get Started',
      ctaUrl: plan.ctaUrl || '#contact',
      isRecommended: plan.isRecommended,
      isActive: plan.isActive,
    });
    setNewFeatureInput('');
    setIsDialogOpen(true);
  };

  const addFeature = () => {
    if (!newFeatureInput.trim()) return;
    setFormData({
      ...formData,
      features: [...formData.features, newFeatureInput.trim()],
    });
    setNewFeatureInput('');
  };

  const removeFeature = (idx: number) => {
    const updated = [...formData.features];
    updated.splice(idx, 1);
    setFormData({ ...formData, features: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSubmitting(true);
    try {
      if (editingPlan) {
        await apiClient.patch(`/pricing-plans/${editingPlan.id}`, formData);
      } else {
        await apiClient.post('/pricing-plans', formData);
      }
      setIsDialogOpen(false);
      loadPlans();
    } catch (err) {
      console.error('Failed to save pricing plan:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing plan?')) return;
    try {
      await apiClient.delete(`/pricing-plans/${id}`);
      loadPlans();
    } catch (err) {
      console.error('Failed to delete plan:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Pricing Plans & Retainers
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pricing tiers configured here automatically power your website pricing sections
          </p>
        </div>

        <Button
          size="sm"
          onClick={openCreateDialog}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Pricing Plan
        </Button>
      </div>

      {plans.length === 0 && !isLoading ? (
        <EmptyState
          icon={<CreditCard className="h-6 w-6 text-emerald-400" />}
          title="No pricing plans yet"
          description="Create pricing tiers and retainers to display on your website."
          actionLabel="Add First Pricing Tier"
          onAction={openCreateDialog}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`p-6 flex flex-col justify-between relative ${
                plan.isRecommended
                  ? 'border-indigo-500 bg-slate-900/90 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/60'
              }`}
            >
              {plan.isRecommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-[10px] font-bold uppercase text-white shadow">
                  Recommended
                </span>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <Badge variant={plan.isActive ? 'success' : 'secondary'}>
                    {plan.isActive ? 'Active' : 'Hidden'}
                  </Badge>
                </div>

                {plan.description && (
                  <p className="mt-2 text-xs text-slate-400">
                    {plan.description}
                  </p>
                )}

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">
                    {formatCurrency(plan.price, plan.currency || 'USD')}
                  </span>
                  {plan.billingPeriod && (
                    <span className="text-xs text-slate-400">
                      /{plan.billingPeriod}
                    </span>
                  )}
                </div>

                <div className="my-6 border-t border-slate-800" />

                <ul className="space-y-2.5">
                  {Array.isArray(plan.features) &&
                    plan.features.map((feat: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-slate-300"
                      >
                        <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog(plan)}
                >
                  <Edit2 className="h-3.5 w-3.5 mr-1" />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-rose-400 hover:text-rose-300"
                  onClick={() => handleDelete(plan.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  <span>Delete</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editingPlan ? 'Edit Pricing Plan' : 'Create Pricing Plan'}
        description="Configure pricing amount, features, and call to action."
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <Input
            label="Plan Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Executive Retainer"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Price ($)"
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
              }
            />
            <Input
              label="Billing Period"
              value={formData.billingPeriod}
              onChange={(e) =>
                setFormData({ ...formData, billingPeriod: e.target.value })
              }
              placeholder="e.g. month, year, project"
            />
          </div>

          <Textarea
            label="Description"
            rows={2}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Ideal for growing businesses and enterprises..."
          />

          {/* Features Manager */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Included Features
            </label>
            <div className="space-y-2 mb-3">
              {formData.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200"
                >
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={newFeatureInput}
                onChange={(e) => setNewFeatureInput(e.target.value)}
                placeholder="Add another feature..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addFeature();
                  }
                }}
              />
              <Button type="button" size="sm" variant="secondary" onClick={addFeature}>
                Add
              </Button>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <Switch
              label="Recommended / Featured Plan"
              description="Highlight this plan with a popular badge"
              checked={formData.isRecommended}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isRecommended: checked })
              }
            />
            <Switch
              label="Active & Visible"
              description="Display this tier on your website"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={isSubmitting}
            >
              {editingPlan ? 'Save Changes' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
