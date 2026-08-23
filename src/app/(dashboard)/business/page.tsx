'use client';

import * as React from 'react';
import { apiClient } from '@/lib/api/client';
import { Business } from '@/types';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Globe,
  Save,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function BusinessProfilePage() {
  const [business, setBusiness] = React.useState<Business | null>(null);
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    category: '',
    logoUrl: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    website: '',
  });

  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  React.useEffect(() => {
    apiClient
      .get('/businesses')
      .then((data: any) => {
        const b = Array.isArray(data) ? data[0] : data;
        if (b) {
          setBusiness(b);
          setFormData({
            name: b.name || '',
            description: b.description || '',
            category: b.category || '',
            logoUrl: b.logoUrl || '',
            email: b.email || '',
            phone: b.phone || '',
            whatsapp: b.whatsapp || '',
            address: b.address || '',
            city: b.city || '',
            state: b.state || '',
            country: b.country || '',
            zipCode: b.zipCode || '',
            website: b.website || '',
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
      const updated: any = await apiClient.patch(
        `/businesses/${business.id}`,
        formData,
      );
      setBusiness(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update business profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Business Profile
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure your brand details, contact methods, and location
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Changes saved successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Core Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-400" />
              <span>General Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Business Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <Input
                label="Industry Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="e.g. Consulting, Agency, Restaurant"
              />
            </div>

            <Textarea
              label="Business Summary & Tagline"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <Input
              label="Brand Logo URL"
              value={formData.logoUrl}
              onChange={(e) =>
                setFormData({ ...formData, logoUrl: e.target.value })
              }
              placeholder="https://..."
              leftIcon={<ImageIcon className="h-4 w-4" />}
            />
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4 text-indigo-400" />
              <span>Contact Methods</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Public Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="contact@business.com"
                leftIcon={<Mail className="h-4 w-4" />}
              />
              <Input
                label="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+1 (555) 000-0000"
                leftIcon={<Phone className="h-4 w-4" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="WhatsApp (Optional)"
                value={formData.whatsapp}
                onChange={(e) =>
                  setFormData({ ...formData, whatsapp: e.target.value })
                }
                placeholder="+15550000000"
              />
              <Input
                label="Official Website URL"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                placeholder="https://..."
                leftIcon={<Globe className="h-4 w-4" />}
              />
            </div>
          </CardContent>
        </Card>

        {/* Physical Address */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-indigo-400" />
              <span>Location & Address</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Street Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="100 Innovation Plaza, Suite 400"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input
                label="City"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="San Francisco"
              />
              <Input
                label="State / Region"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                placeholder="CA"
              />
              <Input
                label="Zip / Postal"
                value={formData.zipCode}
                onChange={(e) =>
                  setFormData({ ...formData, zipCode: e.target.value })
                }
                placeholder="94107"
              />
              <Input
                label="Country"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                placeholder="United States"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            isLoading={isSaving}
            leftIcon={<Save className="h-4 w-4" />}
          >
            Save Business Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
