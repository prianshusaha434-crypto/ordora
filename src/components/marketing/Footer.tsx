import Link from 'next/link';
import { Utensils, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-ordora-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-ordora-coral flex items-center justify-center text-white shadow-soft">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-ordora-charcoal font-display">
                  ORDORA
                </span>
                <span className="block text-[10px] tracking-wider uppercase font-semibold text-ordora-muted -mt-1">
                  Orders made effortless
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-ordora-muted max-w-sm leading-relaxed">
              The unified restaurant commerce & management platform combining McDonald&apos;s-grade consumer ordering convenience with Toast POS operational power.
            </p>
            <div className="mt-6 flex items-center space-x-2 text-xs text-ordora-muted">
              <span>Crafted for Indian QSRs, Cafés, Carts & Chains</span>
            </div>
          </div>

          {/* Column 1: Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ordora-charcoal">
              Platform
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/order/urban-bite" className="text-ordora-muted hover:text-ordora-coral transition-colors">
                  Customer Storefront
                </Link>
              </li>
              <li>
                <Link href="/app/pos" className="text-ordora-muted hover:text-ordora-coral transition-colors">
                  Cloud POS Terminal
                </Link>
              </li>
              <li>
                <Link href="/app/kitchen" className="text-ordora-muted hover:text-ordora-coral transition-colors">
                  Kitchen Display (KDS)
                </Link>
              </li>
              <li>
                <Link href="/app/tables" className="text-ordora-muted hover:text-ordora-coral transition-colors">
                  QR Dine-in System
                </Link>
              </li>
              <li>
                <Link href="/app/inventory" className="text-ordora-muted hover:text-ordora-coral transition-colors">
                  Recipe Inventory
                </Link>
              </li>
              <li>
                <Link href="/platform/dashboard" className="text-ordora-muted hover:text-ordora-coral transition-colors">
                  SaaS Super Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Solutions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ordora-charcoal">
              Solutions
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/solutions#qsr" className="text-ordora-muted hover:text-ordora-coral transition-colors">
                  QSR & Fast Casual
                </Link>
              </li>
              <li>
                <Link href="/solutions#cafes" className="text-ordora-muted hover:text-ordora-coral transition-colors">
                  Cafés & Bakeries
                </Link>
              </li>
              <li>
                <Link href="/solutions#food-carts" className="text-ordora-muted hover:text-ordora-coral transition-colors">
                  Food Carts & Trucks
                </Link>
              </li>
              <li>
                <Link href="/solutions#cloud-kitchens" className="text-ordora-muted hover:text-ordora-coral transition-colors">
                  Cloud Kitchens
                </Link>
              </li>
              <li>
                <Link href="/solutions#food-courts" className="text-ordora-muted hover:text-ordora-coral transition-colors">
                  Food Courts & Malls
                </Link>
              </li>
              <li>
                <Link href="/solutions#franchise" className="text-ordora-muted hover:text-ordora-coral transition-colors">
                  Franchise Groups
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ordora-charcoal">
              Company
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-ordora-muted hover:text-ordora-coral transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-ordora-muted hover:text-ordora-coral transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="text-ordora-muted hover:text-ordora-coral transition-colors">
                  Register Business
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-ordora-muted hover:text-ordora-coral transition-colors">
                  Interactive Demo
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-ordora-muted hover:text-ordora-coral transition-colors">
                  Contact Sales
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ordora-border flex flex-col sm:flex-row items-center justify-between text-xs text-ordora-muted gap-4">
          <p>© {new Date().getFullYear()} ORDORA Technologies Inc. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-ordora-coral fill-ordora-coral inline" /> for modern hospitality
            </span>
            <Link href="/pricing" className="hover:text-ordora-coral">
              Privacy Policy
            </Link>
            <Link href="/pricing" className="hover:text-ordora-coral">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
