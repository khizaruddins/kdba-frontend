'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Product', href: '#product' },
    { label: 'Templates', href: '#templates' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#090D16]/95 backdrop-blur-md border-b border-white/5 py-4'
            : 'bg-transparent border-b border-transparent py-6'
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 lg:px-12">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <span className="text-[13px] font-bold tracking-tight">K</span>
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-white">
              KDBA
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] font-medium text-slate-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/login" className="text-[13px] font-medium text-slate-400 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="h-9 px-5 rounded-full bg-white text-black font-semibold text-[13px] hover:bg-slate-200 transition-colors cursor-pointer shadow-none"
              >
                Start Building Free
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-4 lg:hidden">
            <Link href="/register" className="sm:hidden">
              <Button size="sm" className="h-8 px-4 rounded-full bg-white text-black font-semibold text-[12px]">
                Start Free
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[72px] z-40 border-b border-white/5 bg-[#090D16]/95 backdrop-blur-xl p-6 lg:hidden"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[15px] font-medium text-slate-300 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[15px] font-medium text-slate-300 hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full h-11 rounded-full bg-white text-black font-semibold text-[14px]">
                    Start Building Free
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
