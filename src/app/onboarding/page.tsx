'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { apiClient } from '@/lib/api/client';
import { Template } from '@/types';
import {
  Check,
  Building2,
  LayoutTemplate,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Globe,
  Upload,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, tenant, isAuthenticated, isLoading: authLoading, fetchProfile } = useAuthStore();

  const [step, setStep] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [templates, setTemplates] = React.useState<Template[]>([]);

  // Form states
  const [businessData, setBusinessData] = React.useState({
    name: '',
    description: '',
    category: 'Agency',
    email: '',
    phone: '',
    address: '',
    city: '',
    logoUrl: '',
  });

  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>('');

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  React.useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    // Load available templates
    apiClient
      .get('/templates')
      .then((data: any) => {
        if (Array.isArray(data)) {
          setTemplates(data);
          if (data.length > 0) {
            setSelectedTemplateId(data[0].id);
          }
        }
      })
      .catch(console.error);
  }, [authLoading, isAuthenticated]);

  React.useEffect(() => {
    if (tenant?.name && !businessData.name) {
      setBusinessData((prev) => ({
        ...prev,
        name: tenant.name,
        email: user?.email || '',
      }));
    }
  }, [tenant, user]);

  const categories = [
    { id: 'Agency', label: 'Agency & Creative', desc: 'Design, marketing, software studios' },
    { id: 'Restaurant', label: 'Restaurant & Dining', desc: 'Bistros, cafes, fine dining' },
    { id: 'Business', label: 'Corporate & Consulting', desc: 'Advisory, financial, B2B services' },
    { id: 'Portfolio', label: 'Personal Portfolio', desc: 'Freelancers, creators, photographers' },
  ];

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleComplete = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // 1. Create Business
      const businessPayload: Record<string, any> = {
        name: businessData.name?.trim() || tenant?.name || 'My Business',
      };
      if (businessData.description?.trim()) businessPayload.description = businessData.description.trim();
      if (businessData.category?.trim()) businessPayload.category = businessData.category.trim();
      if (businessData.email?.trim()) businessPayload.email = businessData.email.trim();
      if (businessData.phone?.trim()) businessPayload.phone = businessData.phone.trim();
      if (businessData.address?.trim()) businessPayload.address = businessData.address.trim();
      if (businessData.city?.trim()) businessPayload.city = businessData.city.trim();
      if (businessData.logoUrl?.trim()) businessPayload.logoUrl = businessData.logoUrl.trim();

      const business: any = await apiClient.post('/businesses', businessPayload);

      // 2. Create Website from selected template
      const website: any = await apiClient.post('/websites', {
        businessId: business.id,
        templateId: selectedTemplateId || templates[0]?.id,
        name: `${businessData.name || tenant?.name || 'Business'} Official Site`,
      });

      // 3. Navigate into website editor!
      router.push(`/editor/${website.id}`);
    } catch (err: any) {
      console.error('Failed to complete onboarding:', err);
      setErrorMessage(
        err?.message || 'Failed to complete onboarding. Please check the fields and try again.',
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6">
      {/* Background glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-indigo-600/10 blur-[140px]" />

      {/* Header & Stepper */}
      <div className="mx-auto w-full max-w-4xl pt-4">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow">
              K
            </div>
            <span className="text-sm font-bold text-white">
              KDBA Platform Setup
            </span>
          </div>

          <span className="text-xs font-semibold text-slate-400">
            Step {step} of 4
          </span>
        </div>

        {/* Stepper Progress Bar */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i <= step ? 'bg-indigo-500 shadow-sm shadow-indigo-500/50' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Step Content */}
      <div className="mx-auto w-full max-w-3xl my-8">
        {errorMessage && (
          <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-medium text-rose-300">
            <span>{errorMessage}</span>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white">
                Tell us about your business
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                This information will populate your website header, about, and contact sections.
              </p>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
              <Input
                label="Business Name"
                required
                value={businessData.name}
                onChange={(e) =>
                  setBusinessData({ ...businessData, name: e.target.value })
                }
                placeholder="e.g. Apex Advisory"
              />

              <Textarea
                label="Business Description & Tagline"
                rows={3}
                value={businessData.description}
                onChange={(e) =>
                  setBusinessData({
                    ...businessData,
                    description: e.target.value,
                  })
                }
                placeholder="We help ambitious clients navigate strategy, design, and growth..."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Email"
                  type="email"
                  value={businessData.email}
                  onChange={(e) =>
                    setBusinessData({ ...businessData, email: e.target.value })
                  }
                  placeholder="contact@business.com"
                />
                <Input
                  label="Phone Number"
                  value={businessData.phone}
                  onChange={(e) =>
                    setBusinessData({ ...businessData, phone: e.target.value })
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white">
                Select your industry category
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                We'll tailor your website layouts, section templates, and default styling.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => {
                const isSelected = businessData.category === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() =>
                      setBusinessData({ ...businessData, category: cat.id })
                    }
                    className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">
                        {cat.label}
                      </h3>
                      {isSelected && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-slate-400">{cat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white">
                Choose your website template
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                You can customize all sections, colors, images, and content later.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`overflow-hidden rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-xl shadow-indigo-500/20 ring-2 ring-indigo-500'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {tpl.previewImage && (
                        <div className="relative h-36 w-full overflow-hidden bg-slate-800">
                          <img
                            src={tpl.previewImage}
                            alt={tpl.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                          {tpl.category}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-0.5">
                          {tpl.name}
                        </h4>
                        <p className="mt-1.5 text-xs text-slate-400 line-clamp-2">
                          {tpl.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <div
                        className={`text-center rounded-lg py-1.5 text-xs font-semibold ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Choose'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white">
                Add Logo & Physical Address
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Final details before generating your live website builder.
              </p>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
              <Input
                label="Logo Image URL (Optional)"
                value={businessData.logoUrl}
                onChange={(e) =>
                  setBusinessData({ ...businessData, logoUrl: e.target.value })
                }
                placeholder="https://..."
                leftIcon={<ImageIcon className="h-4 w-4" />}
              />

              <Input
                label="Physical Address / Street"
                value={businessData.address}
                onChange={(e) =>
                  setBusinessData({ ...businessData, address: e.target.value })
                }
                placeholder="100 Main Plaza, Suite 400"
              />

              <Input
                label="City & State"
                value={businessData.city}
                onChange={(e) =>
                  setBusinessData({ ...businessData, city: e.target.value })
                }
                placeholder="San Francisco, CA"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Controls */}
      <div className="mx-auto w-full max-w-3xl flex items-center justify-between pt-6 border-t border-slate-800">
        <Button
          variant="ghost"
          size="sm"
          disabled={step === 1 || isLoading}
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Previous
        </Button>

        {step < 4 ? (
          <Button
            size="sm"
            onClick={() => setStep((s) => Math.min(4, s + 1))}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Continue
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleComplete}
            isLoading={isLoading}
            rightIcon={<Sparkles className="h-4 w-4" />}
          >
            Generate Website
          </Button>
        )}
      </div>
    </div>
  );
}
