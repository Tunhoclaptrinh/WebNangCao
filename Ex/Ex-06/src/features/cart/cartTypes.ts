export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  quantity: number;
  stock: number;
  imageColor: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountPercent?: number; // e.g. 10 for 10%
  discountFixed?: number;   // e.g. 200000 for 200k VND
  minSpend: number;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  discountAmount: number;
  finalAmount: number;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  isDrawerOpen: boolean;
}
