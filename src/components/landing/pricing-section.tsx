'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function PricingSection() {
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Starter Launch',
      slug: 'starter',
      description: 'Ideal for independent consultants, local cafes, and emerging small businesses.',
      monthlyPrice: 29,
      yearlyPrice: 24, // discounted
      isPopular: false,
      features: [
        '1 Production Website',
        'Up to 15 Product/Menu Items',
        '1 GB High-Speed CDN Media Storage',
        'Live Multi-Device Visual Studio',
        'Inbound Leads CRM & Email Alerts',
        'Standard SSL & Edge Hosting',
      ],
      badge: '30-Day Free Trial',
      buttonText: 'Start Free Trial',
    },
    {
      name: 'Growth Professional',
      slug: 'professional',
      description: 'High-performance suite for established brands, multi-location bistros, and creative agencies.',
      monthlyPrice: 79,
      yearlyPrice: 65, // discounted
      isPopular: true,
      features: [
        'Up to 5 Production Websites',
        'Up to 100 Products & Digital Catalog',
        '10 GB High-Speed CDN Media Storage',
        'Full SEO & OpenGraph Meta Studio',
        'Advanced Leads Pipeline & Status Tags',
        'Priority Concierge Support',
        'All Industry Templates Unlocked',
      ],
      badge: 'Most Popular',
      buttonText: 'Start 30-Day Trial',
    },
    {
      name: 'Enterprise Scale',
      slug: 'enterprise',
      description: 'Dedicated infrastructure, maximum catalog quotas, and multi-client brand management.',
      monthlyPrice: 199,
      yearlyPrice: 165, // discounted
      isPopular: false,
      features: [
        'Unlimited Live Websites',
        'Up to 1,000 Catalog & Commerce Items',
        '50 GB CDN Storage & Video Assets',
        'Multi-User Team Role Permissions',
        'Custom Webhooks & REST API Access',
        'Dedicated Strategic Account Manager',
        'Custom Code Injections',
      ],
      badge: 'Enterprise Grade',
      buttonText: 'Start Enterprise Trial',
    },
  ];

  return (
    <section id="pricing" className="relative py-28 px-6 border-t border-slate-800/80 bg-slate-950 overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 flex justify-center overflow-hidden">
        <div className="h-[500px] w-[800px] rounded-full bg-amber-500/5 blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            <CreditCard className="h-3.5 w-3.5" />
            <span>Transparent SaaS Plans</span>
          </div>

          <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl leading-[1.08]">
            Start building for free.
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Choose the right plan for your business. Every subscription includes a 30-day free trial with no upfront commitment.
          </p>

          {/* Billing Cycle Switch */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <span
              className={`text-xs font-bold ${
                billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'
              }`}
            >
              Monthly Billing
            </span>
            <button
              onClick={() =>
                setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')
              }
              className="relative h-6 w-12 rounded-full bg-slate-800 p-0.5 transition-colors cursor-pointer border border-slate-700"
            >
              <div
                className={`h-5 w-5 rounded-full bg-amber-400 transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span
              className={`text-xs font-bold flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'
              }`}
            >
              <span>Annual Billing</span>
              <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[10px] font-black text-emerald-400">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const price =
              billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={`relative flex flex-col justify-between rounded-3xl p-8 shadow-2xl transition-all duration-300 ${
                  plan.isPopular
                    ? 'border-2 border-amber-500/50 bg-slate-900/90 ring-1 ring-amber-500/20 lg:-translate-y-2'
                    : 'border border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-1 text-[11px] font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-amber-500/20">
                      ★ {plan.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 border-b border-slate-800 pb-6">
                    <span className="text-4xl font-black text-white font-mono">
                      ${price}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      / month {billingCycle === 'yearly' ? '(billed yearly)' : ''}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      What&apos;s Included:
                    </div>
                    {plan.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-slate-300"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="pt-8 mt-6 border-t border-slate-800/80">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className={`w-full font-black text-xs rounded-2xl py-3 cursor-pointer ${
                        plan.isPopular
                          ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-600 text-slate-950 shadow-xl shadow-amber-500/20 hover:scale-[1.02]'
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      <span>{plan.buttonText}</span>
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </Link>

                  <div className="mt-3 text-center text-[11px] text-slate-500">
                    No credit card required to start trial
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
