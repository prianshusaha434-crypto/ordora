import { FoodType } from '@/lib/types';

export function FoodDietBadge({ type }: { type: FoodType }) {
  if (type === 'veg') {
    return <span className="food-badge-veg" title="Vegetarian" />;
  }
  if (type === 'egg') {
    return <span className="food-badge-egg" title="Contains Egg" />;
  }
  return <span className="food-badge-nonveg" title="Non-Vegetarian" />;
}
