'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  ChefHat,
  Monitor,
  UtensilsCrossed,
  Layers,
  FolderTree,
  Sliders,
  Boxes,
  MapPin,
  QrCode,
  Users,
  Tag,
  Award,
  ShieldAlert,
  BarChart3,
  Settings,
  CreditCard,
  ExternalLink,
  Store,
} from 'lucide-react';
import { useStore } from '@/lib/useStore';

export function AppSidebar() {
  const pathname = usePathname();
  const { restaurant, outlets, activeOutletId, setActiveOutlet, currentUser, setCurrentUser, staff } = useStore();

  const navSections = [
    {
      title: 'Operations',
      links: [
        { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
        { name: 'Live Orders', href: '/app/orders', icon: ShoppingBag },
        { name: 'Kitchen KDS', href: '/app/kitchen', icon: ChefHat },
        { name: 'POS Terminal', href: '/app/pos', icon: Monitor },
        { name: 'Tables & QR', href: '/app/tables', icon: QrCode },
      ],
    },
    {
      title: 'Menu & Food',
      links: [
        { name: 'Products', href: '/app/menu', icon: UtensilsCrossed },
        { name: 'Categories', href: '/app/categories', icon: FolderTree },
        { name: 'Combos & Meals', href: '/app/combos', icon: Layers },
        { name: 'Modifiers', href: '/app/modifiers', icon: Sliders },
      ],
    },
    {
      title: 'Operations & Growth',
      links: [
        { name: 'Inventory & Recipes', href: '/app/inventory', icon: Boxes },
        { name: 'Outlets', href: '/app/outlets', icon: MapPin },
        { name: 'Customer CRM', href: '/app/customers', icon: Users },
        { name: 'Coupons & Offers', href: '/app/promotions', icon: Tag },
        { name: 'Loyalty Program', href: '/app/loyalty', icon: Award },
        { name: 'Staff & Roles', href: '/app/team', icon: ShieldAlert },
        { name: 'Reports & Export', href: '/app/reports', icon: BarChart3 },
      ],
    },
    {
      title: 'Settings',
      links: [
        { name: 'Restaurant Settings', href: '/app/settings', icon: Settings },
        { name: 'Subscription & Billing', href: '/app/billing', icon: CreditCard },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-ordora-border flex flex-col flex-shrink-0 h-screen sticky top-0 overflow-y-auto">
      {/* Brand Header */}
      <div className="p-5 border-b border-ordora-border">
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-ordora-coral flex items-center justify-center text-white shadow-soft">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-ordora-charcoal font-display">
              ORDORA
            </span>
            <span className="block text-[10px] tracking-wider uppercase font-semibold text-ordora-muted -mt-1">
              Restaurant OS
            </span>
          </div>
        </Link>

        {/* Current Restaurant Badge */}
        <div className="mt-4 p-2.5 rounded-xl bg-ordora-subtle/60 border border-ordora-border flex items-center justify-between">
          <div className="truncate">
            <span className="block text-xs font-bold text-ordora-charcoal truncate">
              {restaurant.name}
            </span>
            <span className="block text-[10px] text-ordora-muted capitalize">
              {restaurant.businessType} • {restaurant.subscriptionPlan}
            </span>
          </div>
          <Link
            href={`/order/${restaurant.slug}`}
            target="_blank"
            className="p-1 rounded-lg text-ordora-coral hover:bg-white transition-colors"
            title="Open Live Storefront"
          >
            <Store className="w-4 h-4" />
          </Link>
        </div>

        {/* Active Outlet Selector */}
        <div className="mt-3">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-ordora-muted mb-1">
            Active Outlet
          </label>
          <select
            value={activeOutletId}
            onChange={(e) => setActiveOutlet(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-ordora-border rounded-xl focus:outline-none focus:border-ordora-coral cursor-pointer"
          >
            {outlets.map((out) => (
              <option key={out.id} value={out.id}>
                {out.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 p-4 space-y-6">
        {navSections.map((sec) => (
          <div key={sec.title}>
            <span className="px-2 text-[10px] font-black uppercase tracking-wider text-ordora-muted">
              {sec.title}
            </span>
            <div className="mt-1.5 space-y-0.5">
              {sec.links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                      isActive
                        ? 'bg-ordora-coral text-white shadow-sm'
                        : 'text-ordora-charcoal/80 hover:bg-ordora-subtle hover:text-ordora-coral'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Super-Admin Platform Link */}
        <div className="pt-2 border-t border-ordora-border">
          <Link
            href="/platform/dashboard"
            className="flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl bg-ordora-charcoal text-white hover:bg-black transition-colors"
          >
            <span>Super-Admin SaaS</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* User / Demo Role Switcher in footer */}
      <div className="p-4 border-t border-ordora-border bg-ordora-subtle/30">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-bold text-ordora-muted">
            Logged In As
          </span>
          <span className="text-[10px] font-black uppercase text-ordora-coral px-1.5 py-0.2 rounded bg-ordora-coral-light">
            {currentUser.role.replace('_', ' ')}
          </span>
        </div>
        <div className="text-xs font-bold text-ordora-charcoal truncate">
          {currentUser.name}
        </div>
        <div className="text-[10px] text-ordora-muted truncate">
          {currentUser.email}
        </div>

        {/* Quick Demo Switcher */}
        <div className="mt-2.5 pt-2 border-t border-ordora-border/60">
          <span className="block text-[9px] font-bold text-ordora-muted uppercase tracking-wider mb-1">
            Switch Demo Role:
          </span>
          <div className="grid grid-cols-2 gap-1 text-[10px]">
            <button
              type="button"
              onClick={() =>
                setCurrentUser({
                  id: 'usr-owner-01',
                  name: 'Rajesh Sharma',
                  email: 'owner@urbanbite.in',
                  role: 'owner',
                  restaurantId: restaurant.id,
                })
              }
              className="p-1 bg-white border border-ordora-border rounded hover:border-ordora-coral text-center font-semibold"
            >
              Owner
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentUser({
                  id: 'usr-cashier-01',
                  name: 'Kabir Das',
                  email: 'cashier@urbanbite.in',
                  role: 'cashier',
                  restaurantId: restaurant.id,
                  outletId: activeOutletId,
                })
              }
              className="p-1 bg-white border border-ordora-border rounded hover:border-ordora-coral text-center font-semibold"
            >
              Cashier
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentUser({
                  id: 'usr-kitchen-01',
                  name: 'Arjun Singh',
                  email: 'kitchen@urbanbite.in',
                  role: 'kitchen',
                  restaurantId: restaurant.id,
                  outletId: activeOutletId,
                })
              }
              className="p-1 bg-white border border-ordora-border rounded hover:border-ordora-coral text-center font-semibold"
            >
              Kitchen Chef
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentUser({
                  id: 'usr-superadmin',
                  name: 'Platform Admin',
                  email: 'admin@ordora.com',
                  role: 'platform_admin',
                })
              }
              className="p-1 bg-white border border-ordora-border rounded hover:border-ordora-coral text-center font-semibold"
            >
              Super Admin
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
