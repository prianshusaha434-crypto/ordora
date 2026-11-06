'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Search, ShoppingBag, ChevronDown, Check } from 'lucide-react';
import { useStore } from '@/lib/useStore';
import { OutletPickerModal } from './OutletPickerModal';
import { formatCurrency } from '@/lib/utils';

interface StoreHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  vegOnly: boolean;
  onToggleVegOnly: () => void;
  onOpenCart: () => void;
  activeOrderType?: 'dine_in' | 'takeaway';
  tableNumber?: string;
}

export function StoreHeader({
  searchQuery,
  onSearchChange,
  vegOnly,
  onToggleVegOnly,
  onOpenCart,
  activeOrderType = 'takeaway',
  tableNumber,
}: StoreHeaderProps) {
  const { restaurant, outlets, activeOutletId, cart } = useStore();
  const [isOutletModalOpen, setIsOutletModalOpen] = useState(false);

  const currentOutlet = outlets.find((o) => o.id === activeOutletId) || outlets[0];
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <div className="bg-white border-b border-ordora-border">
        {/* Top Announcement Bar */}
        <div className="bg-ordora-charcoal text-white text-xs py-2 px-4 text-center font-medium">
          🔥 Weekend Feast: Use code <span className="font-bold text-ordora-coral">URBAN50</span> for ₹50 OFF on orders above ₹299!
        </div>

        {/* Hero Cover Banner */}
        <div className="relative h-44 sm:h-56 w-full bg-ordora-subtle overflow-hidden">
          <Image
            src={restaurant.coverImage}
            alt={restaurant.name}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Restaurant Identity overlay */}
          <div className="absolute bottom-4 left-4 right-4 max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-white shadow-lg bg-white flex-shrink-0">
                <Image
                  src={restaurant.logo}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-white">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight font-display">
                    {restaurant.name}
                  </h1>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-ordora-success text-white rounded-full">
                    Verified
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/80">{restaurant.tagline}</p>
                {tableNumber && (
                  <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-ordora-coral text-white text-xs font-bold shadow-sm">
                    <span>Dine-in: {tableNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Outlet Selector Pill */}
            <button
              type="button"
              onClick={() => setIsOutletModalOpen(true)}
              className="bg-white/95 backdrop-blur-md hover:bg-white text-ordora-charcoal px-3.5 py-2 rounded-2xl border border-white/40 shadow-card flex items-center gap-2 transition-all group"
            >
              <div className="w-7 h-7 rounded-xl bg-ordora-coral-light flex items-center justify-center text-ordora-coral">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] uppercase font-bold text-ordora-muted tracking-wider">
                  Pickup Outlet
                </span>
                <span className="block text-xs font-bold text-ordora-charcoal line-clamp-1">
                  {currentOutlet.name}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-ordora-muted group-hover:text-ordora-charcoal transition-transform" />
            </button>
          </div>
        </div>

        {/* Navigation & Search Sub-Header */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-ordora-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ordora-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search burgers, wings, combos, drinks..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-ordora-subtle/50 border border-ordora-border rounded-xl focus:outline-none focus:border-ordora-coral transition-colors"
              />
            </div>

            {/* Veg filter & Bag trigger */}
            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
              {/* Veg Only Toggle */}
              <button
                type="button"
                onClick={onToggleVegOnly}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  vegOnly
                    ? 'border-ordora-success bg-ordora-success-light text-ordora-success'
                    : 'border-ordora-border text-ordora-muted hover:border-ordora-charcoal'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                    vegOnly ? 'border-ordora-success bg-ordora-success text-white' : 'border-ordora-muted'
                  }`}
                >
                  {vegOnly && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <span>Veg Only</span>
              </button>

              {/* Cart Button */}
              <button
                type="button"
                onClick={onOpenCart}
                className="relative px-4 py-2 bg-ordora-coral text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-ordora-coral-hover transition-all shadow-md flex items-center gap-2 group"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Bag</span>
                {cartItemCount > 0 && (
                  <span className="bg-white text-ordora-coral font-black text-xs px-2 py-0.5 rounded-full ml-1">
                    {cartItemCount}
                  </span>
                )}
                {cartTotal > 0 && (
                  <span className="border-l border-white/30 pl-2 font-display">
                    {formatCurrency(cartTotal)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <OutletPickerModal
        isOpen={isOutletModalOpen}
        onClose={() => setIsOutletModalOpen(false)}
      />
    </>
  );
}
