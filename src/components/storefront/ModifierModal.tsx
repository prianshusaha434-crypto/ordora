'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Check } from 'lucide-react';
import { Product, ProductVariant, SelectedModifier } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { FoodDietBadge } from './FoodDietBadge';

interface ModifierModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (params: {
    product: Product;
    variant?: ProductVariant;
    modifiers: SelectedModifier[];
    quantity: number;
    instructions: string;
  }) => void;
}

export function ModifierModal({ product, isOpen, onClose, onAddToCart }: ModifierModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants?.[0]
  );
  const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifier[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');

  if (!isOpen || !product) return null;

  const basePrice = selectedVariant ? selectedVariant.price : (product.discountedPrice || product.price);
  const modifiersPrice = selectedModifiers.reduce((acc, m) => acc + m.price, 0);
  const unitTotal = basePrice + modifiersPrice;
  const grandTotal = unitTotal * quantity;

  const toggleModifier = (
    groupId: string,
    groupName: string,
    optionId: string,
    optionName: string,
    price: number,
    isRadio: boolean
  ) => {
    if (isRadio) {
      // Replace choice for this group
      const filtered = selectedModifiers.filter((m) => m.groupId !== groupId);
      setSelectedModifiers([...filtered, { groupId, groupName, optionId, optionName, price }]);
    } else {
      const exists = selectedModifiers.some((m) => m.optionId === optionId);
      if (exists) {
        setSelectedModifiers(selectedModifiers.filter((m) => m.optionId !== optionId));
      } else {
        setSelectedModifiers([
          ...selectedModifiers,
          { groupId, groupName, optionId, optionName, price },
        ]);
      }
    }
  };

  const handleAdd = () => {
    onAddToCart({
      product,
      variant: selectedVariant,
      modifiers: selectedModifiers,
      quantity,
      instructions,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ordora-charcoal/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-48 w-full bg-ordora-subtle">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-ordora-charcoal hover:bg-white transition-all shadow-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Meta */}
        <div className="p-6 border-b border-ordora-border">
          <div className="flex items-center gap-2">
            <FoodDietBadge type={product.foodType} />
            <h3 className="text-xl font-bold text-ordora-charcoal font-display">
              {product.name}
            </h3>
          </div>
          <p className="mt-1 text-xs text-ordora-muted leading-relaxed">
            {product.description}
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-ordora-charcoal font-display">
              {formatCurrency(unitTotal)}
            </span>
            {product.discountedPrice && (
              <span className="text-sm line-through text-ordora-muted">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Customization Options */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Variants (e.g. Regular / King Size) */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-ordora-charcoal">
                  Select Size
                </span>
                <span className="text-[11px] font-semibold text-ordora-coral bg-ordora-coral-light px-2 py-0.5 rounded-full">
                  Required
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3 text-left rounded-2xl border-2 transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-ordora-coral bg-ordora-coral-light/30'
                          : 'border-ordora-border hover:border-ordora-coral/40'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-bold text-ordora-charcoal">{v.name}</div>
                        <div className="text-xs text-ordora-muted">{formatCurrency(v.price)}</div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-ordora-coral bg-ordora-coral text-white' : 'border-ordora-border'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Modifier Groups */}
          {product.modifierGroups?.map((group) => {
            const isSingle = group.maxSelection === 1;
            return (
              <div key={group.id} className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-ordora-charcoal">
                      {group.name}
                    </span>
                    <span className="block text-[11px] text-ordora-muted">
                      {isSingle ? 'Choose 1 option' : `Select up to ${group.maxSelection} options`}
                    </span>
                  </div>
                  {group.required && (
                    <span className="text-[11px] font-semibold text-ordora-coral bg-ordora-coral-light px-2 py-0.5 rounded-full">
                      Required
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {group.options.map((option) => {
                    const isChecked = selectedModifiers.some((m) => m.optionId === option.id);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() =>
                          toggleModifier(
                            group.id,
                            group.name,
                            option.id,
                            option.name,
                            option.price,
                            isSingle
                          )
                        }
                        className={`w-full p-3 text-left rounded-xl border transition-all flex items-center justify-between ${
                          isChecked
                            ? 'border-ordora-coral bg-ordora-coral-light/20'
                            : 'border-ordora-border hover:border-ordora-coral/30'
                        }`}
                      >
                        <span className="text-sm font-medium text-ordora-charcoal">
                          {option.name}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-ordora-muted">
                            {option.price > 0 ? `+${formatCurrency(option.price)}` : 'Free'}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                              isChecked
                                ? 'border-ordora-coral bg-ordora-coral text-white'
                                : 'border-ordora-border'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ordora-charcoal mb-2">
              Special Instructions
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Extra spicy, napkins please..."
              className="w-full px-4 py-2.5 text-sm bg-ordora-subtle/50 border border-ordora-border rounded-xl focus:outline-none focus:border-ordora-coral"
            />
          </div>
        </div>

        {/* Footer with Quantity & Add Button */}
        <div className="p-4 sm:p-6 bg-ordora-subtle/40 border-t border-ordora-border flex items-center justify-between gap-4">
          <div className="flex items-center border border-ordora-border bg-white rounded-xl overflow-hidden p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center text-ordora-charcoal hover:bg-ordora-subtle rounded-lg transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-ordora-charcoal">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-ordora-charcoal hover:bg-ordora-subtle rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 py-3 px-6 bg-ordora-coral text-white font-bold text-sm rounded-xl hover:bg-ordora-coral-hover transition-all shadow-md flex items-center justify-between"
          >
            <span>Add Item</span>
            <span>{formatCurrency(grandTotal)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
