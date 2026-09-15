'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle2 } from 'lucide-react';
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
    <section id="pricing" className="relative py-28 px-6 border-y border-white/5 bg-[#090D16]">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16 px-6 lg:px-12 text-center mx-auto">
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-normal tracking-[-0.03em] text-white leading-[1.1]">
            Start building for free.
          </h2>
          <p className="text-[17px] text-slate-400 max-w-xl mx-auto">
            Choose the right plan for your business. Every subscription includes a 30-day free trial with no upfront commitment.
          </p>

          {/* Billing Cycle Switch */}
          <div className="flex items-center justify-center gap-4 pt-6">
            <span
              className={`text-[14px] font-medium ${
                billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')
              }
              className="relative h-6 w-11 rounded-full bg-white/10 p-0.5 transition-colors cursor-pointer border border-white/5"
            >
              <div
                className={`h-4 w-4 rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span
              className={`text-[14px] font-medium flex items-center gap-2 ${
                billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'
              }`}
            >
              <span>Yearly</span>
              <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch px-6 lg:px-12">
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
                className={`relative flex flex-col justify-between rounded-2xl p-8 transition-all duration-300 ${
                  plan.isPopular
                    ? 'border-2 border-indigo-500 bg-[#141a2a] shadow-sm lg:-translate-y-2'
                    : 'border border-white/10 bg-[#0f1422] hover:bg-[#121828]'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-indigo-500 px-4 py-1 text-[11px] font-semibold text-white uppercase tracking-wider shadow-sm">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-[19px] font-semibold text-white">{plan.name}</h3>
                    <p className="text-[14px] text-slate-400 leading-relaxed min-h-[42px]">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 border-b border-white/5 pb-6">
                    <span className="text-4xl font-semibold text-white">
                      ${price}
                    </span>
                    <span className="text-[13px] text-slate-400">
                      / month {billingCycle === 'yearly' ? '(billed yearly)' : ''}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-4">
                    <div className="text-[12px] font-medium uppercase tracking-wider text-slate-500">
                      Included
                    </div>
                    {plan.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 text-[14px] text-slate-300"
                      >
                        <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="pt-8 mt-8 border-t border-white/5">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className={`w-full font-semibold text-[14px] rounded-full h-12 cursor-pointer shadow-none transition-colors ${
                        plan.isPopular
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-white text-black hover:bg-slate-200'
                      }`}
                    >
                      <span>{plan.buttonText}</span>
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
