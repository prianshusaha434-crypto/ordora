'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Check } from 'lucide-react';
import { Combo, Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { FoodDietBadge } from './FoodDietBadge';

interface ComboBuilderModalProps {
  combo: Combo | null;
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onAddComboToCart: (combo: Combo, selections: Record<string, string>) => void;
}

export function ComboBuilderModal({
  combo,
  products,
  isOpen,
  onClose,
  onAddComboToCart,
}: ComboBuilderModalProps) {
  // Map slotId -> selected productId
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    if (!combo) return {};
    const init: Record<string, string> = {};
    combo.slots.forEach((s) => {
      init[s.id] = s.defaultProductId;
    });
    return init;
  });

  if (!isOpen || !combo) return null;

  const handleSelect = (slotId: string, productId: string) => {
    setSelections((prev) => ({ ...prev, [slotId]: productId }));
  };

  const handleAdd = () => {
    onAddComboToCart(combo, selections);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ordora-charcoal/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-44 w-full bg-ordora-subtle">
          <Image src={combo.image} alt={combo.name} fill className="object-cover" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-ordora-charcoal hover:bg-white shadow-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 border-b border-ordora-border">
          <div className="flex items-center gap-2">
            <FoodDietBadge type={combo.foodType} />
            <h3 className="text-xl font-bold text-ordora-charcoal font-display">
              {combo.name}
            </h3>
          </div>
          <p className="mt-1 text-xs text-ordora-muted leading-relaxed">
            {combo.description}
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-ordora-charcoal font-display">
              {formatCurrency(combo.basePrice)}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-ordora-success-light text-ordora-success rounded-full">
              Value Meal Bundle
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {combo.slots.map((slot) => {
            const currentSelectedId = selections[slot.id] || slot.defaultProductId;
            return (
              <div key={slot.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-ordora-charcoal">
                    {slot.name}
                  </span>
                  <span className="text-[11px] text-ordora-muted">Included in combo</span>
                </div>
                <div className="space-y-2">
                  {slot.allowedProductIds.map((pid) => {
                    const prod = products.find((p) => p.id === pid);
                    if (!prod) return null;
                    const isSelected = currentSelectedId === pid;
                    return (
                      <button
                        key={pid}
                        type="button"
                        onClick={() => handleSelect(slot.id, pid)}
                        className={`w-full p-3 rounded-xl border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-ordora-coral bg-ordora-coral-light/25 shadow-sm'
                            : 'border-ordora-border hover:border-ordora-coral/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <FoodDietBadge type={prod.foodType} />
                          <span className="text-sm font-semibold text-ordora-charcoal">
                            {prod.name}
                          </span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-ordora-coral bg-ordora-coral text-white'
                              : 'border-ordora-border'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 sm:p-6 bg-ordora-subtle/40 border-t border-ordora-border">
          <button
            onClick={handleAdd}
            className="w-full py-3.5 px-6 bg-ordora-coral text-white font-bold text-sm rounded-xl hover:bg-ordora-coral-hover transition-all shadow-md flex items-center justify-between"
          >
            <span>Add Combo to Bag</span>
            <span>{formatCurrency(combo.basePrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
