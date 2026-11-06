'use client';

import {
  Restaurant,
  Outlet,
  Product,
  Combo,
  Table,
  Order,
  CartItem,
  Coupon,
  InventoryItem,
  Customer,
  StaffMember,
  OrderStatus,
  OrderType,
  PaymentMethod,
  SubscriptionPlan,
} from './types';
import {
  INITIAL_RESTAURANT,
  INITIAL_OUTLETS,
  CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_COMBOS,
  INITIAL_TABLES,
  INITIAL_ORDERS,
  INITIAL_COUPONS,
  INITIAL_INVENTORY,
  INITIAL_RECIPES,
  INITIAL_CUSTOMERS,
  INITIAL_STAFF,
  SUBSCRIPTION_PLANS,
} from './seed-data';
import { generateOrderNumber, generateToken } from './utils';
import { playAlertSound } from './sound';

const STORAGE_KEY = 'ordora_platform_state_v1';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'platform_admin' | 'owner' | 'manager' | 'cashier' | 'kitchen' | 'customer';
  restaurantId?: string;
  outletId?: string;
}

export interface AppState {
  restaurant: Restaurant;
  outlets: Outlet[];
  activeOutletId: string;
  categories: typeof CATEGORIES;
  products: Product[];
  combos: Combo[];
  tables: Table[];
  orders: Order[];
  coupons: Coupon[];
  inventory: InventoryItem[];
  customers: Customer[];
  staff: StaffMember[];
  plans: SubscriptionPlan[];
  allRestaurants: Restaurant[]; // For Super Admin
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  currentUser: AuthUser;
}

const DEFAULT_USER: AuthUser = {
  id: 'usr-owner-01',
  name: 'Rajesh Sharma',
  email: 'owner@urbanbite.in',
  role: 'owner',
  restaurantId: 'rest-urban-bite-01',
  outletId: 'outlet-park-street',
};

function getInitialState(): AppState {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback to initial
    }
  }

  return {
    restaurant: INITIAL_RESTAURANT,
    outlets: INITIAL_OUTLETS,
    activeOutletId: INITIAL_OUTLETS[0].id,
    categories: CATEGORIES,
    products: INITIAL_PRODUCTS,
    combos: INITIAL_COMBOS,
    tables: INITIAL_TABLES,
    orders: INITIAL_ORDERS,
    coupons: INITIAL_COUPONS,
    inventory: INITIAL_INVENTORY,
    customers: INITIAL_CUSTOMERS,
    staff: INITIAL_STAFF,
    plans: SUBSCRIPTION_PLANS,
    allRestaurants: [
      INITIAL_RESTAURANT,
      {
        id: 'rest-chai-point-02',
        name: 'The Daily Grind Café',
        slug: 'daily-grind',
        tagline: 'Artisanal Coffee & Bakes',
        logo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop&q=80',
        coverImage: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600&auto=format&fit=crop&q=80',
        businessType: 'cafe',
        primaryColor: '#8DA18A',
        supportPhone: '+91 98300 99881',
        supportEmail: 'contact@dailygrind.in',
        isVerified: true,
        subscriptionPlan: 'starter',
        subscriptionStatus: 'trial',
        trialEndsAt: '2026-11-20T23:59:59Z',
      },
      {
        id: 'rest-momo-cart-03',
        name: 'Tibetan Momos Express',
        slug: 'momo-express',
        tagline: 'Steamed & Fried Delicacies',
        logo: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=200&auto=format&fit=crop&q=80',
        coverImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1600&auto=format&fit=crop&q=80',
        businessType: 'food_cart',
        primaryColor: '#D95C42',
        supportPhone: '+91 98300 55443',
        supportEmail: 'momo@tibetexpress.in',
        isVerified: true,
        subscriptionPlan: 'starter',
        subscriptionStatus: 'active',
        trialEndsAt: '2026-12-31T23:59:59Z',
      },
    ],
    cart: [],
    appliedCoupon: null,
    currentUser: DEFAULT_USER,
  };
}

// In-memory global state with subscriber callbacks
let globalState: AppState = getInitialState();
const listeners = new Set<() => void>();

function saveState(newState: AppState) {
  globalState = newState;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch {
      // ignore quota
    }
  }
  listeners.forEach((listener) => listener());
}

export const ordoraStore = {
  getState: () => globalState,

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setActiveOutlet: (outletId: string) => {
    saveState({ ...globalState, activeOutletId: outletId });
  },

  setCurrentUser: (user: AuthUser) => {
    saveState({ ...globalState, currentUser: user });
  },

  // Cart operations
  addToCart: (item: CartItem) => {
    const existingIndex = globalState.cart.findIndex(
      (c) =>
        c.productId === item.productId &&
        c.selectedVariant?.id === item.selectedVariant?.id &&
        JSON.stringify(c.selectedModifiers) === JSON.stringify(item.selectedModifiers)
    );

    let updatedCart: CartItem[];
    if (existingIndex > -1) {
      updatedCart = [...globalState.cart];
      updatedCart[existingIndex].quantity += item.quantity;
    } else {
      updatedCart = [...globalState.cart, item];
    }

    saveState({ ...globalState, cart: updatedCart });
  },

  updateCartQuantity: (index: number, quantity: number) => {
    let updatedCart = [...globalState.cart];
    if (quantity <= 0) {
      updatedCart.splice(index, 1);
    } else {
      updatedCart[index].quantity = quantity;
    }
    saveState({ ...globalState, cart: updatedCart });
  },

  removeFromCart: (index: number) => {
    const updatedCart = globalState.cart.filter((_, idx) => idx !== index);
    saveState({ ...globalState, cart: updatedCart });
  },

  clearCart: () => {
    saveState({ ...globalState, cart: [], appliedCoupon: null });
  },

  applyCoupon: (couponCode: string): { success: boolean; message: string; discount?: number } => {
    const code = couponCode.trim().toUpperCase();
    const coupon = globalState.coupons.find((c) => c.code === code && c.isActive);

    if (!coupon) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }

    const subtotal = globalState.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (subtotal < coupon.minOrderValue) {
      return {
        success: false,
        message: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`,
      };
    }

    saveState({ ...globalState, appliedCoupon: coupon });
    return { success: true, message: `Coupon ${coupon.code} applied successfully!` };
  },

  removeCoupon: () => {
    saveState({ ...globalState, appliedCoupon: null });
  },

  // Order creation (Storefront, POS, Dine-in QR)
  createOrder: (params: {
    outletId: string;
    orderType: OrderType;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    paymentMethod: PaymentMethod;
    tableNumber?: string;
    tableSessionToken?: string;
    notes?: string;
    items?: CartItem[];
  }): Order => {
    const outlet = globalState.outlets.find((o) => o.id === params.outletId) || globalState.outlets[0];
    const sourceItems = params.items || globalState.cart;

    const orderItems = sourceItems.map((cartItem) => {
      const modifierTotal = cartItem.selectedModifiers.reduce((acc, m) => acc + m.price, 0);
      const unitPrice = (cartItem.selectedVariant?.price || cartItem.price) + modifierTotal;
      return {
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: cartItem.productId,
        productName: cartItem.productName,
        quantity: cartItem.quantity,
        unitPrice,
        totalPrice: unitPrice * cartItem.quantity,
        foodType: cartItem.foodType,
        variantName: cartItem.selectedVariant?.name,
        modifiers: cartItem.selectedModifiers,
        specialInstructions: cartItem.specialInstructions,
      };
    });

    const subtotal = orderItems.reduce((acc, it) => acc + it.totalPrice, 0);

    // Calculate coupon discount
    let discount = 0;
    if (globalState.appliedCoupon && subtotal >= globalState.appliedCoupon.minOrderValue) {
      if (globalState.appliedCoupon.discountType === 'percentage') {
        discount = Math.round((subtotal * globalState.appliedCoupon.discountValue) / 100);
        if (globalState.appliedCoupon.maxDiscount) {
          discount = Math.min(discount, globalState.appliedCoupon.maxDiscount);
        }
      } else {
        discount = globalState.appliedCoupon.discountValue;
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);
    const tax = Math.round((discountedSubtotal * outlet.taxPercentage) / 100);
    const total = discountedSubtotal + tax;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      pickupToken: generateToken('UB'),
      restaurantId: globalState.restaurant.id,
      outletId: outlet.id,
      outletName: outlet.name,
      orderType: params.orderType,
      tableNumber: params.tableNumber,
      tableSessionToken: params.tableSessionToken,
      customerName: params.customerName || 'Guest Customer',
      customerPhone: params.customerPhone || '+91 98000 00000',
      customerEmail: params.customerEmail,
      status: 'received',
      paymentStatus:
        params.paymentMethod.startsWith('razorpay') || params.orderType === 'pos'
          ? 'successful'
          : 'pending',
      paymentMethod: params.paymentMethod,
      paymentId: params.paymentMethod.startsWith('razorpay')
        ? `pay_rzp_${Math.random().toString(36).substring(2, 8)}`
        : undefined,
      items: orderItems,
      subtotal,
      discount,
      couponCode: globalState.appliedCoupon?.code,
      tax,
      total,
      notes: params.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Auto deduct inventory based on recipes
    let updatedInventory = [...globalState.inventory];
    orderItems.forEach((orderItem) => {
      const recipe = INITIAL_RECIPES.find((r) => r.productId === orderItem.productId);
      if (recipe) {
        recipe.ingredients.forEach((ing) => {
          const invIdx = updatedInventory.findIndex((i) => i.id === ing.inventoryItemId);
          if (invIdx > -1) {
            const deduction = ing.quantityRequired * orderItem.quantity;
            updatedInventory[invIdx] = {
              ...updatedInventory[invIdx],
              currentStock: Math.max(0, Math.round((updatedInventory[invIdx].currentStock - deduction) * 100) / 100),
            };
          }
        });
      }
    });

    // Update customer CRM records
    let updatedCustomers = [...globalState.customers];
    const customerIdx = updatedCustomers.findIndex((c) => c.phone === newOrder.customerPhone);
    const earnedPoints = Math.floor(newOrder.total / 20); // ₹100 = 5 points

    if (customerIdx > -1) {
      updatedCustomers[customerIdx] = {
        ...updatedCustomers[customerIdx],
        totalOrders: updatedCustomers[customerIdx].totalOrders + 1,
        totalSpend: updatedCustomers[customerIdx].totalSpend + newOrder.total,
        loyaltyPoints: updatedCustomers[customerIdx].loyaltyPoints + earnedPoints,
        lastOrderDate: newOrder.createdAt,
      };
    } else if (params.customerPhone && params.customerName) {
      updatedCustomers.push({
        id: `cust-${Date.now()}`,
        name: params.customerName,
        phone: params.customerPhone,
        email: params.customerEmail,
        totalOrders: 1,
        totalSpend: newOrder.total,
        loyaltyPoints: earnedPoints,
        tier: 'Bronze',
        lastOrderDate: newOrder.createdAt,
        preferredOutlet: outlet.name,
      });
    }

    // Play pleasant chime
    playAlertSound('new_order');

    saveState({
      ...globalState,
      orders: [newOrder, ...globalState.orders],
      inventory: updatedInventory,
      customers: updatedCustomers,
      cart: params.items ? globalState.cart : [], // clear only if storefront checkout
      appliedCoupon: params.items ? globalState.appliedCoupon : null,
    });

    return newOrder;
  },

  // Update order status (KDS bump, POS finish, manager status change)
  updateOrderStatus: (orderId: string, status: OrderStatus) => {
    const updatedOrders = globalState.orders.map((ord) => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status,
          updatedAt: new Date().toISOString(),
        };
      }
      return ord;
    });

    if (status === 'ready') {
      playAlertSound('ready');
    }

    saveState({ ...globalState, orders: updatedOrders });
  },

  // Menu Product CRUD
  addProduct: (product: Product) => {
    saveState({ ...globalState, products: [product, ...globalState.products] });
  },

  updateProduct: (productId: string, updates: Partial<Product>) => {
    const updated = globalState.products.map((p) => (p.id === productId ? { ...p, ...updates } : p));
    saveState({ ...globalState, products: updated });
  },

  deleteProduct: (productId: string) => {
    const filtered = globalState.products.filter((p) => p.id !== productId);
    saveState({ ...globalState, products: filtered });
  },

  // Inventory adjustment
  adjustInventoryStock: (itemId: string, adjustment: number) => {
    const updated = globalState.inventory.map((inv) => {
      if (inv.id === itemId) {
        return {
          ...inv,
          currentStock: Math.max(0, inv.currentStock + adjustment),
          lastRestocked: adjustment > 0 ? new Date().toISOString().split('T')[0] : inv.lastRestocked,
        };
      }
      return inv;
    });
    saveState({ ...globalState, inventory: updated });
  },

  // Table status toggle
  toggleTableOccupancy: (tableId: string) => {
    const updated = globalState.tables.map((tbl) =>
      tbl.id === tableId ? { ...tbl, isOccupied: !tbl.isOccupied } : tbl
    );
    saveState({ ...globalState, tables: updated });
  },

  // Add new table
  addTable: (table: Table) => {
    saveState({ ...globalState, tables: [...globalState.tables, table] });
  },

  // Add new outlet
  addOutlet: (outlet: Outlet) => {
    saveState({ ...globalState, outlets: [...globalState.outlets, outlet] });
  },

  // Add new coupon
  addCoupon: (coupon: Coupon) => {
    saveState({ ...globalState, coupons: [coupon, ...globalState.coupons] });
  },

  // Add staff member
  addStaff: (staffMember: StaffMember) => {
    saveState({ ...globalState, staff: [...globalState.staff, staffMember] });
  },

  // Super Admin: Register & approve tenant
  registerTenant: (restaurant: Restaurant) => {
    saveState({
      ...globalState,
      allRestaurants: [restaurant, ...globalState.allRestaurants],
    });
  },

  updateTenantStatus: (tenantId: string, isVerified: boolean, subscriptionStatus: 'active' | 'trial' | 'past_due') => {
    const updated = globalState.allRestaurants.map((r) =>
      r.id === tenantId ? { ...r, isVerified, subscriptionStatus } : r
    );
    saveState({ ...globalState, allRestaurants: updated });
  },

  // Reset demo state
  resetDemoData: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    globalState = getInitialState();
    listeners.forEach((listener) => listener());
  },
};
