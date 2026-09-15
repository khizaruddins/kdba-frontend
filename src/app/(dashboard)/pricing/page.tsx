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
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/kdba/page-header';
import { useConfirm } from '@/components/kdba/confirm-dialog';

export default function PricingPage() {
  const { confirm, dialog } = useConfirm();
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

  const handleDelete = (id: string) => {
    confirm({
      title: 'Delete this pricing plan?',
      description: 'The tier will be removed from your website pricing sections.',
      confirmLabel: 'Delete plan',
      destructive: true,
      onConfirm: async () => {
        await apiClient.delete(`/pricing-plans/${id}`);
        toast.success('Plan deleted');
        await loadPlans();
      },
    });
  };

  return (
    <div className="flex-1 space-y-6">
      {dialog}
      <PageHeader
        title="Pricing"
        description="Tiers that power pricing sections on your websites."
        actions={
          <Button size="sm" onClick={openCreateDialog}>
            <Plus />
            Add plan
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="mt-2 h-4 w-3/4" />
                
                <div className="mt-6 flex items-baseline gap-1">
                  <Skeleton className="h-10 w-24" />
                </div>
                
                <div className="my-6 border-t" />
                
                <ul className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <li key={j} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-full" />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t flex justify-end gap-2">
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-20" />
              </div>
            </Card>
          ))}
        </div>
      ) : plans.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="h-8 w-8 text-muted-foreground" />}
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
                  ? 'border-primary shadow-sm shadow-primary/10 ring-1 ring-primary/20'
                  : ''
              }`}
            >
              {plan.isRecommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase text-primary-foreground shadow-sm">
                  Recommended
                </span>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                    {plan.isActive ? 'Active' : 'Hidden'}
                  </Badge>
                </div>

                {plan.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                )}

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    {formatCurrency(plan.price, plan.currency || 'USD')}
                  </span>
                  {plan.billingPeriod && (
                    <span className="text-sm text-muted-foreground">
                      /{plan.billingPeriod}
                    </span>
                  )}
                </div>

                <div className="my-6 border-t" />

                <ul className="space-y-2.5">
                  {Array.isArray(plan.features) &&
                    plan.features.map((feat: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog(plan)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive/90"
                  onClick={() => handleDelete(plan.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
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
            <label className="block text-sm font-medium text-foreground mb-2">
              Included Features
            </label>
            <div className="space-y-2 mb-3">
              {formData.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-foreground"
                >
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
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

          <div className="pt-2 space-y-4">
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

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
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
