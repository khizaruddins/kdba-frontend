'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, Phone, ArrowRight, CheckCircle2, Sparkles, Clock, MessageSquare, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    <section className="relative py-28 px-6 border-t border-slate-800/80 bg-slate-950/80 overflow-hidden">
      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-400">
            <Users className="h-3.5 w-3.5" />
            <span>Built-in Inbound CRM</span>
          </div>

          <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl leading-[1.08]">
            Turn visitors into conversations.
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Every enquiry from your website flows directly into your KDBA workspace with real-time status management. Test the live flow below.
          </p>
        </div>

        {/* Interactive Ingestion Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Simulated Website Contact Form */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-5 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-amber-400" />
                <span>Simulated Visitor Form</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">Live Web Widget</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Miller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="david@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Project Inquiries
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us what you'd like to build..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-600 text-slate-950 font-black py-2.5 text-xs shadow-lg shadow-amber-500/20 cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSubmitting ? 'Transmitting Lead...' : 'Submit Lead Inquiry'}</span>
              </button>

              {submittedSuccess && (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 pt-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Lead received in your KDBA CRM! Watch right column.</span>
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Simulated KDBA Leads CRM Dashboard */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="text-sm font-extrabold text-white">KDBA Inbound Lead Inbox</div>
                <div className="text-xs text-slate-400">Real-time customer inquiries from published website</div>
              </div>

              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                ● Live Sync Active
              </span>
            </div>

            {/* Leads Stream */}
            <div className="space-y-3">
              <AnimatePresence>
                {leads.map((lead) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-2.5 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 font-black text-xs border border-indigo-500/20">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{lead.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{lead.email}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase ${
                            lead.status === 'NEW'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : lead.status === 'CONTACTED'
                              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {lead.status}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{lead.time}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
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
