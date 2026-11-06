'use client';

import Image from 'next/image';
import { Plus, Sparkles } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { FoodDietBadge } from './FoodDietBadge';

interface FoodCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export function FoodCard({ product, onSelect }: FoodCardProps) {
  const hasModifiers =
    (product.variants && product.variants.length > 0) ||
    (product.modifierGroups && product.modifierGroups.length > 0);

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white rounded-3xl border border-ordora-border p-4 shadow-soft hover:shadow-card transition-all duration-300 hover:border-ordora-coral/40 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Food Image with Badges */}
        <div className="relative h-44 sm:h-48 w-full rounded-2xl overflow-hidden bg-ordora-subtle">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {product.isBestseller && (
            <div className="absolute top-3 left-3 bg-ordora-charcoal/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-ordora-warning fill-ordora-warning" />
              <span>Bestseller</span>
            </div>
          )}

          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-1.5 rounded-lg shadow-sm">
            <FoodDietBadge type={product.foodType} />
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-4">
          <h4 className="text-base font-bold text-ordora-charcoal font-display group-hover:text-ordora-coral transition-colors line-clamp-1">
            {product.name}
          </h4>
          <p className="mt-1 text-xs text-ordora-muted line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="mt-4 pt-3 border-t border-ordora-border/70 flex items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-black text-ordora-charcoal font-display">
            {formatCurrency(product.discountedPrice || product.price)}
          </span>
          {product.discountedPrice && (
            <span className="text-xs line-through text-ordora-muted">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(product);
          }}
          className="px-3.5 py-1.5 bg-ordora-coral-light text-ordora-coral font-bold text-xs rounded-xl hover:bg-ordora-coral hover:text-white transition-all shadow-sm flex items-center gap-1"
        >
          <span>{hasModifiers ? 'Customise' : 'Add'}</span>
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
}
