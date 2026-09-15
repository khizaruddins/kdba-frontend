'use client';

import * as React from 'react';
import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#090D16] px-6 py-16 text-slate-400">
      <div className="mx-auto max-w-[1440px] space-y-16 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Column 1: Brand & Bio (2-col wide) */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white text-[13px]">
                K
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-white">
                KDBA
              </span>
            </Link>

            <p className="text-[14px] text-slate-400 max-w-sm leading-relaxed">
              Khizar Digital Branding Agency (KDBA) is a modern SaaS platform enabling businesses and creators to design, customize, and publish high-performance websites without code.
            </p>

            <div className="text-[12px] text-slate-500 font-medium">
              Engineered with Next.js Turbopack & Edge CDN
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-4">
            <div className="font-semibold text-white text-[14px]">Product</div>
            <ul className="space-y-3 text-[14px] text-slate-400">
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
            </ul>
          </div>

          {/* Column 3: Company & Platform */}
          <div className="space-y-4">
            <div className="font-semibold text-white text-[14px]">Platform</div>
            <ul className="space-y-3 text-[14px] text-slate-400">
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
                <Link href="/admin/login" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <span>Super Admin Portal</span>
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
          <div className="space-y-4">
            <div className="font-semibold text-white text-[14px]">Legal & Security</div>
            <ul className="space-y-3 text-[14px] text-slate-400">
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
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div>
            © {new Date().getFullYear()} KDBA — Khizar Digital Branding Agency. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>All Systems Operational</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
