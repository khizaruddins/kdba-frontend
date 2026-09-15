'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCta() {
  return (
    <section className="relative py-32 px-6 border-t border-white/5 bg-[#090D16] text-center">
      <div className="relative mx-auto max-w-4xl space-y-10">
        {/* Master CTA Headline */}
        <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-normal tracking-[-0.03em] text-white leading-[1.05]">
          Your business deserves <br />
          <span className="text-slate-500">
            a better website.
          </span>
        </h2>

        <p className="text-[17px] text-slate-400 max-w-xl mx-auto leading-relaxed">
          Start with a template. Make it yours. Publish when you're ready. No coding required.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/register">
            <Button
              size="lg"
              className="h-12 px-8 rounded-full bg-white text-black font-semibold text-[14px] hover:bg-slate-200 transition-colors cursor-pointer shadow-none"
            >
              Start Building Free
            </Button>
          </Link>

          <a href="#templates">
            <Button 
              variant="outline"
              size="lg"
              className="h-12 px-8 rounded-full bg-transparent border-white/20 text-white font-medium text-[14px] hover:bg-white/5 transition-colors cursor-pointer"
            >
              Explore Templates
            </Button>
          </a>
        </div>

        {/* Trust Guarantees */}
        <div className="pt-10 flex flex-wrap items-center justify-center gap-8 text-[13px] text-slate-400 font-medium">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-indigo-400" />
            <span>30-Day Free Trial</span>
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-indigo-400" />
            <span>No Credit Card Required</span>
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-indigo-400" />
            <span>Instant Edge CDN Deployment</span>
          </span>
        </div>
      </div>
    </section>
  );
}
