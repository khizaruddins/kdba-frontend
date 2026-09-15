'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface LeadItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'CONVERTED';
  time: string;
}

const INITIAL_LEADS: LeadItem[] = [
  {
    id: 'lead-1',
    name: 'Sarah Wilson',
    email: 'sarah.w@nexusmedia.io',
    phone: '+1 (555) 234-9812',
    message: 'Interested in full branding and custom website package for our Q3 launch.',
    status: 'NEW',
    time: '2 mins ago',
  },
  {
    id: 'lead-2',
    name: 'Alexander Sterling',
    email: 'a.sterling@sterlingcap.com',
    phone: '+1 (555) 871-3320',
    message: 'Requesting private consultation regarding corporate restructuring advisory.',
    status: 'CONTACTED',
    time: '1 hour ago',
  },
  {
    id: 'lead-3',
    name: 'Elena Rostova',
    email: 'elena@atelier-dining.fr',
    phone: '+33 6 12 34 56 78',
    message: 'Booking request for 12-person private tasting dinner next month.',
    status: 'CONVERTED',
    time: 'Yesterday',
  },
];

export function LeadsCrmSection() {
  const [leads, setLeads] = React.useState<LeadItem[]>(INITIAL_LEADS);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedSuccess, setSubmittedSuccess] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newLead: LeadItem = {
        id: `lead-${Date.now()}`,
        name,
        email,
        phone: '+1 (555) 019-2834',
        message: message || 'Inquiry submitted from live website contact form.',
        status: 'NEW',
        time: 'Just now',
      };
      setLeads([newLead, ...leads]);
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setTimeout(() => setSubmittedSuccess(false), 4000);
    }, 600);
  };

  return (
    <section className="relative py-28 px-6 bg-[#090D16]">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16 px-6 lg:px-12">
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-normal tracking-[-0.03em] text-white leading-[1.1]">
            Turn visitors into conversations.
          </h2>
          <p className="text-[17px] text-slate-400 max-w-xl">
            Every enquiry from your website flows directly into your KDBA workspace with real-time status management. Test the live flow below.
          </p>
        </div>

        {/* Interactive Ingestion Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start px-6 lg:px-12">
          {/* Left Column: Simulated Website Contact Form */}
          <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-[#0f1422] p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-indigo-400" />
                <span>Simulated Visitor Form</span>
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Miller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-[14px] text-white placeholder-white/20 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="david@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-[14px] text-white placeholder-white/20 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">
                  Project Inquiries
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us what you'd like to build..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-[14px] text-white placeholder-white/20 focus:border-indigo-500 focus:outline-none resize-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold py-3 text-[14px] transition-colors hover:bg-slate-200 cursor-pointer disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? 'Transmitting Lead...' : 'Submit Lead Inquiry'}</span>
              </button>

              {submittedSuccess && (
                <div className="flex items-center justify-center gap-2 text-[12px] font-medium text-emerald-400 pt-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Lead received in your CRM! Watch right column.</span>
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Simulated KDBA Leads CRM Dashboard */}
          <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-[#141a2a] p-6 sm:p-10 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div>
                <div className="text-[17px] font-semibold text-white tracking-tight">KDBA Inbound Lead Inbox</div>
                <div className="text-[14px] text-slate-400 mt-1">Real-time customer inquiries from published website</div>
              </div>

              <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-[12px] font-medium text-slate-300">
                <span className="text-emerald-400 mr-1.5">●</span>Live Sync Active
              </span>
            </div>

            {/* Leads Stream */}
            <div className="space-y-4">
              <AnimatePresence>
                {leads.map((lead) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl border border-white/5 bg-[#0f1422] p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white font-bold text-[14px] border border-white/10">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-[15px] font-semibold text-white tracking-tight">{lead.name}</div>
                          <div className="text-[12px] text-slate-400 font-mono mt-0.5">{lead.email}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                            lead.status === 'NEW'
                              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'
                              : lead.status === 'CONTACTED'
                              ? 'bg-slate-700/50 text-slate-300 border border-slate-600/50'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {lead.status}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">{lead.time}</span>
                      </div>
                    </div>

                    <p className="text-[14px] text-slate-300 bg-white/5 p-4 rounded-xl border border-white/5 leading-relaxed">
                      &ldquo;{lead.message}&rdquo;
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
