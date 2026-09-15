'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Bot, Globe, CreditCard, MailCheck } from 'lucide-react';

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
    <section className="relative py-28 px-6 bg-[#090D16]">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16 px-6 lg:px-12">
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-normal tracking-[-0.03em] text-white leading-[1.1]">
            And we're just getting started.
          </h2>
          <p className="text-[17px] text-slate-400 max-w-xl">
            KDBA is being built to become a complete digital home for your business. Here is a transparent look at what our engineering team is actively building next.
          </p>
        </div>

        {/* 4 Roadmap Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 lg:px-12">
          {roadmap.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="rounded-2xl border border-white/10 bg-[#0f1422] p-6 space-y-6 shadow-sm hover:bg-[#121828] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 border border-white/10">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded bg-black/40 border border-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    {item.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-[15px] font-semibold text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-slate-400 leading-relaxed">
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
