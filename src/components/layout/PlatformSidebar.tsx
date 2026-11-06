'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  Building2,
  CreditCard,
  Layers,
  DollarSign,
  Users,
  LineChart,
  Settings,
  ArrowLeft,
} from 'lucide-react';

export function PlatformSidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Platform Overview', href: '/platform/dashboard', icon: ShieldCheck },
    { name: 'All Restaurants', href: '/platform/restaurants', icon: Building2 },
    { name: 'Subscriptions', href: '/platform/subscriptions', icon: CreditCard },
    { name: 'Pricing Plans', href: '/platform/plans', icon: Layers },
    { name: 'Global Payments', href: '/platform/payments', icon: DollarSign },
    { name: 'Platform Users', href: '/platform/users', icon: Users },
    { name: 'SaaS Analytics', href: '/platform/analytics', icon: LineChart },
    { name: 'Platform Settings', href: '/platform/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-ordora-charcoal text-white flex flex-col flex-shrink-0 h-screen sticky top-0 border-r border-white/10">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-ordora-coral flex items-center justify-center text-white shadow-soft">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight font-display">
              ORDORA
            </span>
            <span className="block text-[10px] tracking-wider uppercase font-semibold text-white/50 -mt-1">
              Super-Admin SaaS
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                isActive
                  ? 'bg-ordora-coral text-white shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link
          href="/app/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Restaurant App</span>
        </Link>
      </div>
    </aside>
  );
}
