'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { TEMPLATES_DEFINITIONS } from '@/lib/templates/definitions';
import { websitesApi } from '@/lib/api/websites';
import { businessApi } from '@/lib/api/business';
import {
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, tenant, isAuthenticated, isLoading: authLoading, fetchProfile } = useAuthStore();

  const [step, setStep] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedIndustry, setSelectedIndustry] = React.useState('RESTAURANT');
  const [selectedTemplateId, setSelectedTemplateId] = React.useState('tpl_restaurant');

  // Business Form states
  const [businessData, setBusinessData] = React.useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    logoUrl: '',
  });

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  React.useEffect(() => {
    if (tenant?.name && !businessData.name) {
      setBusinessData((prev) => ({
        ...prev,
        name: tenant.name,
        email: user?.email || '',
      }));
    }
  }, [tenant, user, businessData.name]);

  const industries = [
    { id: 'RESTAURANT', label: 'Restaurants & Fine Dining', desc: 'Bistros, lounges, chef tables' },
    { id: 'CAFE', label: 'Artisan Cafes & Roasteries', desc: 'Specialty coffee, bakeries, matcha' },
    { id: 'DENTAL', label: 'Dental & Orthodontics', desc: 'Cosmetic dentistry, implants, clinics' },
    { id: 'HEALTHCARE', label: 'Private Healthcare & Clinics', desc: 'Specialists, longevity, wellness' },
    { id: 'SALON', label: 'Premium Salons & Spas', desc: 'Hair architecture, aesthetics, retreats' },
    { id: 'FITNESS', label: 'Fitness & Athletic Clubs', desc: 'Personal training, gyms, HIIT' },
    { id: 'REAL_ESTATE', label: 'Luxury Real Estate', desc: 'Coastal estates, brokerages, villas' },
    { id: 'ARCHITECTURE', label: 'Architecture Studios', desc: 'Structural design, built spaces' },
    { id: 'CREATIVE_AGENCY', label: 'Creative & Digital Studios', desc: 'Branding, tech engineering, UI' },
    { id: 'SOFTWARE_SAAS', label: 'Software & SaaS Platforms', desc: 'Cloud software, developer tools' },
    { id: 'CONSULTING', label: 'Management & Legal Advisory', desc: 'Strategy, corporate law, M&A' },
    { id: 'HOTEL', label: 'Boutique Hotels & Resorts', desc: 'Luxury hospitality, ocean villas' },
  ];

  const availableTemplates = TEMPLATES_DEFINITIONS.filter(
    (t) => t.industry === selectedIndustry || (selectedIndustry === 'SALON' && t.industry === 'SPA'),
  );

  const activeTemplates = availableTemplates.length > 0 ? availableTemplates : TEMPLATES_DEFINITIONS.slice(0, 6);

  const handleComplete = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const selectedTpl =
        TEMPLATES_DEFINITIONS.find((t) => t.id === selectedTemplateId) ||
        TEMPLATES_DEFINITIONS[0];

      // 1. Create Business
      const business = await businessApi.create({
        name: businessData.name?.trim() || selectedTpl.document.business.name || 'My Business',
        description: businessData.description?.trim() || selectedTpl.document.business.description,
        email: businessData.email?.trim() || selectedTpl.document.business.email,
        phone: businessData.phone?.trim() || selectedTpl.document.business.phone,
        address: businessData.address?.trim() || selectedTpl.document.business.address,
        logoUrl: businessData.logoUrl?.trim() || selectedTpl.document.business.logoUrl,
      });

      // 2. Create Website from canonical template document
      const website = await websitesApi.create({
        businessId: business.id,
        templateId: selectedTpl.id,
        name: `${businessData.name || selectedTpl.name}`,
      });

      // 3. Save document
      const doc = selectedTpl.document;
      await websitesApi.saveDraft(website.id, {
        theme: doc.theme,
        business: {
          ...doc.business,
          name: businessData.name || doc.business.name,
          email: businessData.email || doc.business.email,
          phone: businessData.phone || doc.business.phone,
          address: businessData.address || doc.business.address,
          logoUrl: businessData.logoUrl || doc.business.logoUrl,
        },
        pages: doc.pages,
        seoTitle: doc.seoTitle,
        seoDescription: doc.seoDescription,
      });

      // 4. Redirect into V2 website builder
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 select-none">
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
              KDBA V2 Setup
            </span>
          </div>

          <span className="text-xs font-semibold text-slate-400 font-mono">
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

      {/* Step Content */}
      <div className="mx-auto w-full max-w-3xl my-8">
        {errorMessage && (
          <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-medium text-rose-300">
            {errorMessage}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Tell us about your business
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                This will automatically populate your brand header, narrative story, and inquiry forms.
              </p>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
              <Input
                label="Business / Brand Name"
                required
                value={businessData.name}
                onChange={(e) =>
                  setBusinessData({ ...businessData, name: e.target.value })
                }
                placeholder="e.g. Apex Strategic Advisory"
              />

              <Textarea
                label="Business Tagline & Summary"
                rows={3}
                value={businessData.description}
                onChange={(e) =>
                  setBusinessData({ ...businessData, description: e.target.value })
                }
                placeholder="We combine visionary strategy and elite engineering..."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Email"
                  type="email"
                  value={businessData.email}
                  onChange={(e) =>
                    setBusinessData({ ...businessData, email: e.target.value })
                  }
                  placeholder="hello@business.com"
                />
                <Input
                  label="Phone Number"
                  value={businessData.phone}
                  onChange={(e) =>
                    setBusinessData({ ...businessData, phone: e.target.value })
                  }
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Select your industry
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                We'll tailor your website layouts, section ordering, and visual design language.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[460px] overflow-y-auto pr-1">
              {industries.map((cat) => {
                const isSelected = selectedIndustry === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setSelectedIndustry(cat.id);
                      const matching = TEMPLATES_DEFINITIONS.find((t) => t.industry === cat.id);
                      if (matching) setSelectedTemplateId(matching.id);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">
                        {cat.label}
                      </h3>
                      {isSelected && (
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-400">{cat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Choose your website template
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Curated layouts tailored for your selected industry. You can customize everything later.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[460px] overflow-y-auto pr-1">
              {activeTemplates.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`overflow-hidden rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-xl ring-2 ring-indigo-500'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {tpl.previewImage && (
                        <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                          <img
                            src={tpl.previewImage}
                            alt={tpl.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <span className="text-[10px] font-bold font-mono uppercase text-indigo-400">
                          {tpl.style}
                        </span>
                        <h4 className="text-base font-bold text-white mt-1">
                          {tpl.name}
                        </h4>
                        <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                          {tpl.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <div
                        className={`text-center rounded-xl py-2 text-xs font-semibold ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Choose This Template'}
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
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Final brand & physical details
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Add your logo and address to finish creating your live website builder.
              </p>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
              <Input
                label="Logo Image URL (Optional)"
                value={businessData.logoUrl}
                onChange={(e) =>
                  setBusinessData({ ...businessData, logoUrl: e.target.value })
                }
                placeholder="https://.../logo.png"
                leftIcon={<ImageIcon className="h-4 w-4 text-slate-400" />}
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
                label="City, State / Region"
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

      {/* Navigation Footer Controls */}
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
            Launch Website Builder
          </Button>
        )}
      </div>
    </div>
  );
}
