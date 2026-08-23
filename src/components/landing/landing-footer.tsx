'use client';

import * as React from 'react';
import Link from 'next/link';
import { Sparkles, Globe, ShieldCheck, ArrowUpRight } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-16 text-slate-400 text-xs">
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand & Bio (2-col wide) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-violet-500 font-black text-white text-xs shadow-md shadow-indigo-500/20">
                K
              </div>
              <span className="text-base font-black tracking-tight text-white">
                KDBA<span className="text-amber-400">.</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Khizar Digital Branding Agency (KDBA) is a modern SaaS platform enabling businesses and creators to design, customize, and publish high-performance websites without code.
            </p>

            <div className="pt-2 text-[11px] text-slate-500 font-mono">
              Engineered with Next.js Turbopack & Edge CDN
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-3">
            <div className="font-bold uppercase tracking-wider text-white text-xs">Product</div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#product" className="hover:text-white transition-colors">
                  Visual Studio
                </a>
              </li>
              <li>
                <a href="#templates" className="hover:text-white transition-colors">
                  Curated Templates
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Brand Kit & Media
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Subscription Plans
                </a>
              </li>
              <li>
                <a href="#templates" className="hover:text-white transition-colors">
                  Template Gallery
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Platform */}
          <div className="space-y-3">
            <div className="font-bold uppercase tracking-wider text-white text-xs">Platform</div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Tenant Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Create Workspace
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>Super Admin Portal</span>
                  <span className="text-[10px] text-amber-400">👑</span>
                </Link>
              </li>
              <li>
                <a href="mailto:support@kdba.agency" className="hover:text-white transition-colors">
                  Direct Support
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Architecture */}
          <div className="space-y-3">
            <div className="font-bold uppercase tracking-wider text-white text-xs">Legal & Security</div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Multi-Tenant Security
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Service Level Agreement
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} KDBA — Khizar Digital Branding Agency. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>All Systems Operational</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
