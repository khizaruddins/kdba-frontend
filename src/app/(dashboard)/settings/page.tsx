'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';
import { Business } from '@/types';
import { Building2, Globe, Image as ImageIcon, Mail, MapPin, Phone, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/kdba/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { MediaPickerModal } from '@/components/ui/media-picker-modal';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const [business, setBusiness] = React.useState<Business | null>(null);
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    category: '',
    logoUrl: '',
    favicon: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    website: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: '',
      youtube: '',
    },
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [mediaTarget, setMediaTarget] = React.useState<'logoUrl' | 'favicon' | null>(null);

  React.useEffect(() => {
    apiClient
      .get('/businesses')
      .then((data: unknown) => {
        const b = Array.isArray(data) ? data[0] : data;
        if (b && typeof b === 'object') {
          const next = b as Business;
          setBusiness(next);
          const social = (next.socialMedia || {}) as Record<string, string>;
          setFormData({
            name: next.name || '',
            description: next.description || '',
            category: next.category || '',
            logoUrl: next.logoUrl || '',
            favicon: next.favicon || '',
            email: next.email || '',
            phone: next.phone || '',
            whatsapp: next.whatsapp || '',
            address: next.address || '',
            city: next.city || '',
            state: next.state || '',
            country: next.country || '',
            zipCode: next.zipCode || '',
            website: next.website || '',
            socialMedia: {
              facebook: social.facebook || '',
              instagram: social.instagram || '',
              linkedin: social.linkedin || '',
              twitter: social.twitter || '',
              youtube: social.youtube || '',
            },
          });
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        socialMedia: Object.fromEntries(
          Object.entries(formData.socialMedia).filter(([, value]) => Boolean(value.trim())),
        ),
      };
      const updated: Business = await apiClient.patch(`/businesses/${business.id}`, payload);
      setBusiness(updated);
      toast.success('Business profile saved');
    } catch (err) {
      console.error(err);
      toast.error('Could not save profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!business) {
    return (
      <EmptyState
        icon={<Building2 className="size-6" />}
        title="No business profile yet"
        description="Create a website from a template to generate a business profile, then return here to edit it."
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Business Profile"
        description="Reusable business details for your websites, footers, contact sections, and CMS bindings."
        actions={
          <Button type="submit" form="business-settings" size="sm" isLoading={isSaving}>
            <Save />
            Save changes
          </Button>
        }
      />

      <form id="business-settings" onSubmit={handleSave} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="size-4 text-muted-foreground" />
              General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Business name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Industry"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Consulting, restaurant, clinic…"
              />
            </div>
            <Textarea
              label="Summary"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-3">
                  {formData.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formData.logoUrl}
                      alt=""
                      className="size-14 rounded-lg border object-cover"
                    />
                  ) : (
                    <div className="flex size-14 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                      <ImageIcon className="size-5" />
                    </div>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setMediaTarget('logoUrl')}
                  >
                    Select from media
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Favicon</Label>
                <div className="flex items-center gap-3">
                  {formData.favicon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formData.favicon}
                      alt=""
                      className="size-14 rounded-lg border object-cover"
                    />
                  ) : (
                    <div className="flex size-14 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                      <ImageIcon className="size-5" />
                    </div>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setMediaTarget('favicon')}
                  >
                    Select from media
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="size-4 text-muted-foreground" />
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              leftIcon={<Mail />}
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              leftIcon={<Phone />}
            />
            <Input
              label="WhatsApp"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            />
            <Input
              label="Website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              leftIcon={<Globe />}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="size-4 text-muted-foreground" />
              Social links
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ['facebook', 'Facebook'],
                ['instagram', 'Instagram'],
                ['linkedin', 'LinkedIn'],
                ['twitter', 'X / Twitter'],
                ['youtube', 'YouTube'],
              ] as const
            ).map(([key, label]) => (
              <Input
                key={key}
                label={label}
                value={formData.socialMedia[key]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialMedia: { ...formData.socialMedia, [key]: e.target.value },
                  })
                }
                placeholder="https://"
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="size-4 text-muted-foreground" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Street address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              <Input
                label="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
              <Input
                label="Postal code"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              />
              <Input
                label="Country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      </form>

      <MediaPickerModal
        isOpen={Boolean(mediaTarget)}
        onClose={() => setMediaTarget(null)}
        onSelect={(url) => {
          if (!mediaTarget) return;
          setFormData((prev) => ({ ...prev, [mediaTarget]: url }));
          setMediaTarget(null);
        }}
      />
    </div>
  );
}
