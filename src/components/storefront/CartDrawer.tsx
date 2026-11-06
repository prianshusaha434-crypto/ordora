'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Plus, Minus, Tag, ArrowRight, Trash2 } from 'lucide-react';
import { useStore } from '@/lib/useStore';
import { formatCurrency } from '@/lib/utils';
import { FoodDietBadge } from './FoodDietBadge';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantSlug: string;
}

export function CartDrawer({ isOpen, onClose, restaurantSlug }: CartDrawerProps) {
  const { cart, appliedCoupon, updateCartQuantity, removeFromCart, applyCoupon, removeCoupon, outlets, activeOutletId } = useStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const currentOutlet = outlets.find((o) => o.id === activeOutletId) || outlets[0];
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrderValue) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount) {
        discount = Math.min(discount, appliedCoupon.maxDiscount);
      }
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const tax = Math.round((discountedSubtotal * currentOutlet.taxPercentage) / 100);
  const total = discountedSubtotal + tax;
  const loyaltyPointsEarned = Math.floor(total / 20);

  const handleApplyCoupon = (codeToUse?: string) => {
    const code = (codeToUse || couponInput).trim();
    if (!code) return;
    const res = applyCoupon(code);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError(res.message);
      setCouponSuccess('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ordora-charcoal/50 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-ordora-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-ordora-coral-light flex items-center justify-center text-ordora-coral">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ordora-charcoal font-display">
                Your Bag
              </h3>
              <p className="text-xs text-ordora-muted">
                {cart.reduce((sum, it) => sum + it.quantity, 0)} items
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-ordora-subtle flex items-center justify-center text-ordora-muted hover:text-ordora-charcoal transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-ordora-subtle flex items-center justify-center text-ordora-muted mb-4">
              <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h4 className="text-base font-bold text-ordora-charcoal">Your bag is empty</h4>
            <p className="mt-1 text-xs text-ordora-muted max-w-xs">
              Explore our delicious burgers, crispy fried chicken, combos and handcrafted sides!
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 bg-ordora-coral text-white text-xs font-bold rounded-xl hover:bg-ordora-coral-hover transition-all shadow-sm"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="p-3.5 rounded-2xl border border-ordora-border bg-white shadow-soft flex items-start gap-3"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-ordora-subtle flex-shrink-0">
                  <Image src={item.image} alt={item.productName} fill className="object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <FoodDietBadge type={item.foodType} />
                    <h5 className="text-sm font-bold text-ordora-charcoal truncate">
                      {item.productName}
                    </h5>
                  </div>

                  {item.selectedVariant && (
                    <span className="text-[11px] text-ordora-coral font-medium block">
                      Size: {item.selectedVariant.name}
                    </span>
                  )}

                  {item.selectedModifiers.length > 0 && (
                    <div className="mt-0.5 text-[11px] text-ordora-muted">
                      {item.selectedModifiers.map((m) => m.optionName).join(', ')}
                    </div>
                  )}

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-black text-ordora-charcoal font-display">
                      {formatCurrency(item.price * item.quantity)}
                    </span>

                    <div className="flex items-center border border-ordora-border rounded-lg bg-ordora-subtle/30 overflow-hidden">
                      <button
                        onClick={() => updateCartQuantity(idx, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-ordora-charcoal hover:bg-ordora-subtle"
                      >
                        {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-ordora-error" /> : <Minus className="w-3 h-3" />}
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-ordora-charcoal">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-ordora-charcoal hover:bg-ordora-subtle"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Coupons Section */}
            <div className="p-4 rounded-2xl bg-ordora-subtle/50 border border-ordora-border space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-ordora-charcoal uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5 text-ordora-coral" />
                <span>Coupons & Offers</span>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-ordora-success">
                  <div>
                    <span className="text-xs font-bold text-ordora-success">
                      {appliedCoupon.code} applied!
                    </span>
                    <span className="block text-[11px] text-ordora-muted">
                      Saved {formatCurrency(discount)}
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-bold text-ordora-error hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. URBAN50)"
                    className="flex-1 px-3 py-2 text-xs uppercase bg-white border border-ordora-border rounded-xl focus:outline-none focus:border-ordora-coral font-mono"
                  />
                  <button
                    onClick={() => handleApplyCoupon()}
                    className="px-4 py-2 bg-ordora-charcoal text-white text-xs font-bold rounded-xl hover:bg-black transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}

              {/* Quick Coupon Chips */}
              {!appliedCoupon && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    onClick={() => handleApplyCoupon('FIRSTBITE')}
                    className="text-[10px] font-bold px-2 py-1 bg-white border border-ordora-border rounded-lg hover:border-ordora-coral text-ordora-charcoal transition-colors"
                  >
                    FIRSTBITE (20% OFF)
                  </button>
                  <button
                    onClick={() => handleApplyCoupon('URBAN50')}
                    className="text-[10px] font-bold px-2 py-1 bg-white border border-ordora-border rounded-lg hover:border-ordora-coral text-ordora-charcoal transition-colors"
                  >
                    URBAN50 (₹50 OFF)
                  </button>
                </div>
              )}

              {couponError && <p className="text-[11px] text-ordora-error">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-ordora-success">{couponSuccess}</p>}
            </div>

            {/* Bill Details */}
            <div className="p-4 rounded-2xl bg-white border border-ordora-border space-y-2 text-xs">
              <div className="flex justify-between text-ordora-muted">
                <span>Item Subtotal</span>
                <span className="font-semibold text-ordora-charcoal">{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-ordora-success">
                  <span>Coupon Discount</span>
                  <span className="font-bold">-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-ordora-muted">
                <span>GST (5%)</span>
                <span className="font-semibold text-ordora-charcoal">{formatCurrency(tax)}</span>
              </div>
              <div className="pt-2 border-t border-ordora-border flex justify-between text-sm font-black text-ordora-charcoal font-display">
                <span>To Pay</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="pt-1 text-[11px] text-ordora-sage font-medium text-center">
                ✨ Earn <span className="font-bold">{loyaltyPointsEarned}</span> Ordora Club Loyalty Points
              </div>
            </div>
          </div>
        )}

        {/* Footer Checkout Link */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-ordora-border bg-ordora-subtle/30">
            <Link
              href={`/order/${restaurantSlug}/checkout`}
              onClick={onClose}
              className="w-full py-3.5 px-6 bg-ordora-coral text-white font-bold text-sm rounded-xl hover:bg-ordora-coral-hover transition-all shadow-md flex items-center justify-between group"
            >
              <div>
                <span className="text-xs uppercase tracking-wider opacity-90 block text-left">
                  Proceed to Checkout
                </span>
                <span className="text-base font-black font-display">{formatCurrency(total)}</span>
              </div>
              <div className="flex items-center gap-1 font-bold">
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
