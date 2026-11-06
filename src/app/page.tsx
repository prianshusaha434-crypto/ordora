'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Store,
  ChefHat,
  Monitor,
  QrCode,
  Boxes,
  Users,
  BarChart3,
  ShieldCheck,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';
import { formatCurrency } from '@/lib/utils';

export default function HomePage() {
  const businessTypes = [
    { title: 'Quick Service (QSR)', icon: '🍔', desc: 'High-speed counter ordering, combo customizer & live tokens' },
    { title: 'Cafés & Bakeries', icon: '☕', desc: 'Size & milk customizations, cake pre-orders & QR ordering' },
    { title: 'Food Carts & Trucks', icon: '🚚', desc: 'Mobile POS, QR menu, temporary locations & low-cost mode' },
    { title: 'Cloud Kitchens', icon: '🍲', desc: 'Multi-brand shared kitchen queues & centralized KDS' },
    { title: 'Food Courts & Malls', icon: '🏬', desc: 'Unified guest ordering with independent vendor billing' },
    { title: 'Franchise Chains', icon: '🏢', desc: 'Centralized menu publishing, outlet pricing & consolidated reports' },
  ];

  const features = [
    {
      title: 'Consumer Ordering Storefront',
      desc: "McDonald's-level convenience with high conversion, smart combos, dynamic modifiers, and instant Razorpay/UPI checkout.",
      icon: Store,
      badge: 'B2C Storefront',
    },
    {
      title: 'Real-Time Kitchen KDS',
      desc: 'Kanban preparation queues with real-time timers, station filtering, sound alert chimes, and instant bump actions.',
      icon: ChefHat,
      badge: 'Back of House',
    },
    {
      title: 'Cloud POS Terminal',
      desc: 'Blazing fast counter cashier system with split tender, cash change calculation, and instant 80mm thermal receipt printing.',
      icon: Monitor,
      badge: 'Front of House',
    },
    {
      title: 'QR Dine-In & Session Tracking',
      desc: 'Encrypted table QR codes for instant self-ordering and re-ordering without waiting for waiters or downloading apps.',
      icon: QrCode,
      badge: 'Dine-In',
    },
    {
      title: 'Recipe-Based Inventory',
      desc: 'Automatic ingredient deduction as burgers and items sell. Prevents stockouts with automated reorder thresholds.',
      icon: Boxes,
      badge: 'Operations',
    },
    {
      title: 'CRM & Loyalty Engine',
      desc: 'Turn walk-ins into repeat regulars with automated points per spend (₹100 = 5 pts), tiers, and targeted promo codes.',
      icon: Users,
      badge: 'Growth',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-ordora-ivory">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ordora-coral-light border border-ordora-coral/20 text-ordora-coral text-xs sm:text-sm font-bold shadow-sm animate-fade-in">
              <Sparkles className="w-4 h-4 fill-ordora-coral" />
              <span>ORDORA 2.0 — The Complete Food Commerce & Management OS</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-ordora-charcoal font-display leading-[1.08]">
              Orders made <span className="text-ordora-coral">effortless.</span> From counter to kitchen.
            </h1>

            <p className="text-lg sm:text-xl text-ordora-muted max-w-2xl mx-auto font-normal leading-relaxed">
              Combine the customer ordering speed of McDonald&apos;s with the operational muscle of Toast POS. Built for single food carts to 100-outlet restaurant chains.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/onboarding"
                className="w-full sm:w-auto px-8 py-4 bg-ordora-coral hover:bg-ordora-coral-hover text-white text-base font-bold rounded-2xl shadow-hover transition-all flex items-center justify-center gap-2 group"
              >
                <span>Register Your Food Business</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/order/urban-bite"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-ordora-subtle text-ordora-charcoal text-base font-bold rounded-2xl border border-ordora-border shadow-soft transition-all flex items-center justify-center gap-2"
              >
                <Store className="w-5 h-5 text-ordora-coral" />
                <span>Launch Live Storefront</span>
              </Link>
            </div>

            {/* Trust checklist */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-ordora-muted">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-ordora-success" />
                <span>Zero commission on orders</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-ordora-success" />
                <span>Instant Razorpay & UPI settlements</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-ordora-success" />
                <span>14-day free trial, no credit card</span>
              </div>
            </div>
          </div>

          {/* Interactive Dual App Preview Hero Graphic */}
          <div className="mt-14 relative max-w-5xl mx-auto rounded-3xl border border-ordora-border bg-white shadow-2xl p-4 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-ordora-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-xs font-mono text-ordora-muted ml-2">
                  ordora.com/order/urban-bite + ordora.com/app/kitchen
                </span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-ordora-success-light text-ordora-success rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-ordora-success animate-ping" />
                Live Cloud Sync
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
              {/* Left Column: Customer Ordering View */}
              <div className="lg:col-span-5 bg-ordora-ivory/60 rounded-2xl p-4 border border-ordora-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-ordora-coral">
                    Customer Experience
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-white rounded-full border border-ordora-border">
                    Dine-in / Pickup
                  </span>
                </div>

                <div className="bg-white rounded-xl p-3 border border-ordora-border shadow-soft flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-ordora-subtle">
                    <Image
                      src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80"
                      alt="Burger"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-ordora-charcoal block truncate">
                      Classic Chicken Burger
                    </span>
                    <span className="text-[10px] text-ordora-muted block">
                      Brioche Bun + Extra Cheddar Cheese
                    </span>
                    <span className="text-xs font-black text-ordora-coral font-display">
                      ₹174
                    </span>
                  </div>
                  <div className="px-2 py-1 bg-ordora-coral text-white text-[10px] font-bold rounded-lg">
                    In Cart
                  </div>
                </div>

                <div className="bg-ordora-charcoal text-white rounded-xl p-3 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-white/60 block">Pickup Token</span>
                    <span className="text-lg font-black font-mono">UB-042</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-ordora-success text-[10px] font-bold">
                    Order Preparing (8m)
                  </span>
                </div>
              </div>

              {/* Right Column: Kitchen KDS & POS view */}
              <div className="lg:col-span-7 bg-ordora-subtle/30 rounded-2xl p-4 border border-ordora-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-ordora-charcoal">
                    Kitchen KDS & POS Hub
                  </span>
                  <div className="flex gap-2">
                    <Link
                      href="/app/kitchen"
                      className="text-[11px] font-bold text-ordora-coral hover:underline"
                    >
                      Open KDS →
                    </Link>
                    <Link
                      href="/app/pos"
                      className="text-[11px] font-bold text-ordora-sage hover:underline"
                    >
                      Open POS →
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl border border-ordora-border p-3 space-y-2 shadow-soft">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="font-mono">ORD-1081</span>
                      <span className="px-2 py-0.5 rounded bg-ordora-coral/10 text-ordora-coral text-[10px]">
                        Table 01
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-ordora-charcoal">
                      2x Classic Chicken Burger
                    </div>
                    <div className="text-[10px] text-ordora-muted">
                      1x Peri Peri Fries • 2x Cold Coffee
                    </div>
                    <div className="pt-2 border-t border-ordora-border flex justify-between items-center text-[10px]">
                      <span className="font-mono text-ordora-coral font-bold">⏱ 6 mins ago</span>
                      <span className="font-bold text-ordora-success">Preparing</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-ordora-border p-3 space-y-2 shadow-soft">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="font-mono">ORD-1082</span>
                      <span className="px-2 py-0.5 rounded bg-ordora-sage/10 text-ordora-charcoal text-[10px]">
                        Token UB-042
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-ordora-charcoal">
                      1x Double Crunch Burger
                    </div>
                    <div className="text-[10px] text-ordora-muted">
                      1x Virgin Mint Lime Mojito
                    </div>
                    <div className="pt-2 border-t border-ordora-border flex justify-between items-center text-[10px]">
                      <span className="font-mono text-ordora-muted font-bold">⏱ 2 mins ago</span>
                      <span className="font-bold text-ordora-coral">Accepted</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-ordora-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-ordora-coral" />
                    <span className="font-bold text-ordora-charcoal">Today&apos;s Store Sales:</span>
                    <span className="font-black text-ordora-charcoal font-display">₹18,450</span>
                  </div>
                  <span className="text-[11px] text-ordora-success font-bold">+28% vs yesterday</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Food Business Formats */}
      <section className="py-20 bg-white border-y border-ordora-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-ordora-coral">
              Multi-Format Operating Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-ordora-charcoal font-display">
              Designed for every type of food business
            </h2>
            <p className="text-sm sm:text-base text-ordora-muted">
              Whether you flip 50 burgers at a food cart or operate a 15-outlet QSR franchise, ORDORA adapts its workflows to your model.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessTypes.map((biz) => (
              <div
                key={biz.title}
                className="p-6 rounded-3xl border border-ordora-border bg-ordora-ivory/40 hover:bg-white hover:shadow-card hover:border-ordora-coral/30 transition-all group"
              >
                <div className="text-3xl mb-4">{biz.icon}</div>
                <h3 className="text-lg font-bold text-ordora-charcoal font-display group-hover:text-ordora-coral transition-colors">
                  {biz.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-ordora-muted leading-relaxed">
                  {biz.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 text-sm font-bold text-ordora-coral hover:text-ordora-coral-hover"
            >
              <span>Explore Self-Service Onboarding Wizard (15 Business Formats)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="py-20 bg-ordora-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-ordora-coral">
              End-to-End Restaurant Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-ordora-charcoal font-display">
              Everything your restaurant needs. In one connected tab.
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="bg-white rounded-3xl p-7 border border-ordora-border shadow-soft hover:shadow-card transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-ordora-coral-light flex items-center justify-center text-ordora-coral">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 bg-ordora-subtle text-ordora-charcoal rounded-full">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-ordora-charcoal font-display">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-ordora-muted leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ready to Launch Banner */}
      <section className="py-16 bg-ordora-coral text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight">
            Ready to upgrade your restaurant operations?
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto">
            Get your branded QR ordering website, kitchen display system, and cloud POS running in under 10 minutes.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/onboarding"
              className="px-8 py-4 bg-white text-ordora-coral font-bold text-base rounded-2xl shadow-xl hover:bg-ordora-subtle transition-all"
            >
              Start Selling with ORDORA
            </Link>
            <Link
              href="/demo"
              className="px-8 py-4 bg-ordora-coral-hover text-white font-bold text-base rounded-2xl border border-white/30 hover:bg-black/20 transition-all"
            >
              Watch Product Walkthrough
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
