'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Utensils, ArrowRight, Store, LayoutDashboard } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Features', href: '/features' },
    { name: 'Solutions', href: '/solutions' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-ordora-ivory/90 backdrop-blur-md border-b border-ordora-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-ordora-coral flex items-center justify-center text-white shadow-soft transition-transform group-hover:scale-105">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-ordora-charcoal font-display">
                ORDORA
              </span>
              <span className="block text-[10px] tracking-wider uppercase font-semibold text-ordora-muted -mt-1">
                Orders made effortless
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-ordora-coral ${
                    isActive ? 'text-ordora-coral font-semibold' : 'text-ordora-charcoal/80'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <Link
              href="/order/urban-bite"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-ordora-charcoal bg-white border border-ordora-border rounded-xl shadow-sm hover:border-ordora-coral transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-ordora-coral" />
              <span>Live Storefront Demo</span>
            </Link>

            <Link
              href="/app/dashboard"
              className="hidden lg:inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-ordora-charcoal bg-white border border-ordora-border rounded-xl shadow-sm hover:border-ordora-coral transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-ordora-sage" />
              <span>Restaurant App</span>
            </Link>

            <Link
              href="/login"
              className="text-sm font-medium text-ordora-charcoal hover:text-ordora-coral px-3 py-2"
            >
              Log in
            </Link>

            <Link
              href="/onboarding"
              className="inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold text-white bg-ordora-coral rounded-xl hover:bg-ordora-coral-hover transition-all shadow-md hover:shadow-hover"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
