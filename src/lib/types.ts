export type OrderType = 'dine_in' | 'takeaway' | 'pos';

export type OrderStatus =
  | 'pending'
  | 'received'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'initiated'
  | 'successful'
  | 'failed'
  | 'refunded';

export type PaymentMethod =
  | 'razorpay_upi'
  | 'razorpay_card'
  | 'razorpay_netbanking'
  | 'cash_counter'
  | 'cash_pickup';

export type FoodType = 'veg' | 'non_veg' | 'egg';

export interface ModifierOption {
  id: string;
  name: string;
  price: number; // in INR (₹)
  isAvailable: boolean;
}

export interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
  minSelection: number;
  maxSelection: number;
  options: ModifierOption[];
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Regular", "Large"
  price: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // base price in INR
  discountedPrice?: number;
  categoryId: string;
  image: string;
  gallery?: string[];
  foodType: FoodType;
  prepTimeMinutes: number;
  isAvailable: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  sku: string;
  variants?: ProductVariant[];
  modifierGroups?: ModifierGroup[];
  outletAvailability?: Record<string, boolean>; // outletId -> available
}

export interface ComboItemSlot {
  id: string;
  name: string; // e.g., "Choice of Burger", "Choice of Side", "Choice of Drink"
  allowedProductIds: string[];
  defaultProductId: string;
}

export interface Combo {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  foodType: FoodType;
  isAvailable: boolean;
  slots: ComboItemSlot[];
}

export interface Outlet {
  id: string;
  restaurantId: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  phone: string;
  openingHours: string;
  isOpen: boolean;
  pickupEnabled: boolean;
  dineInEnabled: boolean;
  taxPercentage: number; // e.g. 5 for 5% GST
}

export interface Table {
  id: string;
  outletId: string;
  tableNumber: string;
  capacity: number;
  token: string; // secure non-guessable hash/token
  qrUrl: string;
  isOccupied: boolean;
  currentOrderId?: string;
}

export interface SelectedModifier {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  foodType: FoodType;
  selectedVariant?: ProductVariant;
  selectedModifiers: SelectedModifier[];
  specialInstructions?: string;
  comboSelections?: Record<string, string>; // slotId -> productId
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  foodType: FoodType;
  variantName?: string;
  modifiers: SelectedModifier[];
  specialInstructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "ORD-1082"
  pickupToken?: string; // e.g. "UB-042"
  restaurantId: string;
  outletId: string;
  outletName: string;
  orderType: OrderType;
  tableNumber?: string;
  tableSessionToken?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  total: number;
  notes?: string;
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
  assignedStaffId?: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'bogo';
  discountValue: number; // percentage (e.g. 20) or flat INR (e.g. 50)
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  outletRestrictions?: string[];
}

export interface InventoryItem {
  id: string;
  outletId: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string; // "kg", "pcs", "liters", "packs"
  minimumThreshold: number;
  costPerUnit: number;
  supplierName: string;
  lastRestocked: string;
}

export interface RecipeIngredient {
  inventoryItemId: string;
  inventoryItemName: string;
  quantityRequired: number;
  unit: string;
}

export interface Recipe {
  productId: string;
  productName: string;
  ingredients: RecipeIngredient[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  totalSpend: number;
  loyaltyPoints: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'VIP';
  lastOrderDate: string;
  preferredOutlet: string;
}

export interface StaffMember {
  id: string;
  restaurantId: string;
  outletId?: string;
  name: string;
  email: string;
  role: 'platform_admin' | 'owner' | 'manager' | 'outlet_manager' | 'cashier' | 'kitchen' | 'waiter';
  phone: string;
  isActive: boolean;
  joinedDate: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  code: 'starter' | 'growth' | 'enterprise';
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  outletLimit: number;
  features: string[];
  isPopular?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  logo: string;
  coverImage: string;
  businessType: string;
  primaryColor: string;
  supportPhone: string;
  supportEmail: string;
  fssaiNumber?: string;
  gstin?: string;
  isVerified: boolean;
  subscriptionPlan: string;
  subscriptionStatus: 'active' | 'trial' | 'past_due';
  trialEndsAt: string;
}

export type BusinessFormat =
  | 'restaurant'
  | 'qsr'
  | 'cafe'
  | 'food_cart'
  | 'food_truck'
  | 'food_kiosk'
  | 'cloud_kitchen'
  | 'bakery'
  | 'juice_bar'
  | 'food_court'
  | 'ice_cream'
  | 'franchise'
  | 'canteen'
  | 'street_vendor'
  | 'other';

export interface OnboardingState {
  currentStep: number;
  businessType: BusinessFormat;
  legalName: string;
  brandName: string;
  slug: string;
  description: string;
  logoUrl?: string;
  coverUrl?: string;
  contactNumber: string;
  businessEmail: string;
  city: string;
  state: string;
  pincode: string;
  gstin?: string;
  fssaiNumber?: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  outlets: {
    name: string;
    address: string;
    phone: string;
    openingHours: string;
    dineIn: boolean;
    takeaway: boolean;
  }[];
  operations: {
    dineInEnabled: boolean;
    takeawayEnabled: boolean;
    counterPosEnabled: boolean;
    kdsEnabled: boolean;
    qrOrderingEnabled: boolean;
    minOrderValue: number;
    prepTimeMinutes: number;
    gstPercentage: number;
  };
  selectedPlan: string;
  billingCycle: 'monthly' | 'annual';
}
