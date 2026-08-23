'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Bot, Globe, CreditCard, BarChart3, MailCheck, ShieldCheck } from 'lucide-react';

export function FutureVision() {
  const roadmap = [
    {
      title: 'AI-Assisted Creation',
      desc: 'Generate tailored section copy, blog articles, and hero headlines aligned with your brand tone.',
      icon: Bot,
      status: 'Coming in V2',
    },
    {
      title: 'Custom Domain Routing',
      desc: 'Point your own custom root domain (e.g. yourbusiness.com) with automated Cloudflare SSL certificates.',
      icon: Globe,
      status: 'Planned',
    },
    {
      title: 'Integrated Online Checkout',
      desc: 'Accept global credit card payments and digital wallets directly on your published product catalog.',
      icon: CreditCard,
      status: 'In Development',
    },
    {
      title: 'Automated CRM Sequences',
      desc: 'Trigger automated email follow-ups and calendar invites as soon as a visitor submits a contact form.',
      icon: MailCheck,
      status: 'Planned',
    },
  ];

  return (
    <section className="relative py-28 px-6 border-t border-slate-800/80 bg-slate-950/80 overflow-hidden">
      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Platform Evolution</span>
          </div>

          <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl leading-[1.08]">
            And we&apos;re just getting started.
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            KDBA is being built to become a complete digital home for your business. Here is a transparent look at what our engineering team is actively building next.
          </p>
        </div>

        {/* 4 Roadmap Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roadmap.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-md bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] font-bold text-slate-300 font-mono">
                    {item.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
