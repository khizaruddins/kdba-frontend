'use client';

import * as React from 'react';
import { SectionProps } from './section-renderer';
import { apiClient } from '@/lib/api/client';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export function ContactSection({
  config,
  theme,
  business,
  tenantSlug,
  isEditing,
}: SectionProps) {
  const badge = config.badge || 'Contact Us';
  const headline = config.headline || 'Get in Touch';
  const subheadline =
    config.subheadline ||
    'Send us a message and our team will get back to you promptly.';

  const email = business?.email || config.email || 'info@kdba.com';
  const phone = business?.phone || config.phone;
  const address = business?.address
    ? `${business.address}${business.city ? `, ${business.city}` : ''}${business.state ? `, ${business.state}` : ''}`
    : config.address;
  const businessHours = business?.businessHours
    ? typeof business.businessHours === 'string'
      ? business.businessHours
      : 'Mon - Fri: 9:00 AM - 6:00 PM'
    : config.businessHours;

  const accentColor = theme?.accentColor || '#6366f1';

  // Form State
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      return;
    }

    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const slug = tenantSlug || business?.slug || 'kdba';
      await apiClient.post(`/public/sites/${slug}/contact`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        message: formData.message,
        source: 'contact_form',
      });

      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Failed to send your message. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-6 border-t border-slate-800/80 bg-slate-950/60">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-4 border"
            style={{
              borderColor: `${accentColor}30`,
              backgroundColor: `${accentColor}10`,
              color: accentColor,
            }}
          >
            {badge}
          </div>

          <h2
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            style={{ fontFamily: theme?.headingFont || 'inherit' }}
          >
            {headline}
          </h2>

          {subheadline && (
            <p className="mt-4 text-slate-400 text-base">{subheadline}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          {/* Left info column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-white">
                Contact Information
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Reach out directly or use the inquiry form to start a conversation.
              </p>
            </div>

            <div className="space-y-6">
              {email && (
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${accentColor}15`,
                      color: accentColor,
                    }}
                  >
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Email
                    </h4>
                    <a
                      href={`mailto:${email}`}
                      className="text-sm font-medium text-white hover:underline mt-0.5 block"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              )}

              {phone && (
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${accentColor}15`,
                      color: accentColor,
                    }}
                  >
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Phone
                    </h4>
                    <a
                      href={`tel:${phone}`}
                      className="text-sm font-medium text-white hover:underline mt-0.5 block"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
              )}

              {address && (
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${accentColor}15`,
                      color: accentColor,
                    }}
                  >
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Location
                    </h4>
                    <p className="text-sm text-slate-300 mt-0.5">{address}</p>
                  </div>
                </div>
              )}

              {businessHours && (
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${accentColor}15`,
                      color: accentColor,
                    }}
                  >
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Working Hours
                    </h4>
                    <p className="text-sm text-slate-300 mt-0.5">
                      {String(businessHours)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Form column */}
          <div className="lg:col-span-7">
            <div
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl backdrop-blur-sm"
              style={{ borderRadius: theme?.borderRadius || '16px' }}
            >
              {isSuccess ? (
                <div className="py-12 text-center">
                  <div
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                  >
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white">
                    Message Sent Successfully!
                  </h4>
                  <p className="mt-2 text-sm text-slate-300">
                    Thank you for reaching out. We will review your message and get
                    back to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="mt-6 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: accentColor }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="John Doe"
                        className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="john@example.com"
                        className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="How can we help you?"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                    style={{
                      backgroundColor: accentColor,
                      borderRadius: theme?.borderRadius || '8px',
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
