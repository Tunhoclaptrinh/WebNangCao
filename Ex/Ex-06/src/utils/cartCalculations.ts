import type { CartItem, Coupon } from '../features/cart/cartTypes.ts';

export const AVAILABLE_COUPONS: Record<string, Coupon> = {
  LTWNC10: {
    code: 'LTWNC10',
    discountPercent: 10,
    minSpend: 1000000,
    description: 'Giảm 10% cho đơn hàng từ 1.000.000 đ',
  },
  PTIT200K: {
    code: 'PTIT200K',
    discountFixed: 200000,
    minSpend: 3000000,
    description: 'Giảm 200.000 đ cho đơn hàng từ 3.000.000 đ',
  },
  VIP500K: {
    code: 'VIP500K',
    discountFixed: 500000,
    minSpend: 10000000,
    description: 'Giảm 500.000 đ cho đơn hàng từ 10.000.000 đ',
  },
};

/**
 * Tính tổng số lượng sản phẩm trong giỏ hàng
 */
export function calculateTotalQuantity(items: CartItem[]): number {
  return items.reduce((total, item) => total + Math.max(0, item.quantity), 0);
}

/**
 * Tính tạm tính (subtotal) của các sản phẩm
 */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const qty = Math.max(0, item.quantity);
    const price = Math.max(0, item.price);
    return total + price * qty;
  }, 0);
}

/**
 * Tính số tiền giảm giá dựa trên mã coupon và tạm tính
 */
export function calculateDiscount(subtotal: number, coupon: Coupon | null): number {
  if (!coupon || subtotal <= 0) return 0;
  if (subtotal < coupon.minSpend) return 0;

  if (coupon.discountPercent) {
    return Math.round((subtotal * coupon.discountPercent) / 100);
  }

  if (coupon.discountFixed) {
    return Math.min(coupon.discountFixed, subtotal);
  }

  return 0;
}

/**
 * Hàm calcTotal chính theo yêu cầu đề bài Slide 32
 * Trả về toàn bộ thông tin thanh toán giỏ hàng
 */
export function calcTotal(items: CartItem[], coupon: Coupon | null = null): {
  subtotal: number;
  discountAmount: number;
  finalAmount: number;
  totalQuantity: number;
} {
  const totalQuantity = calculateTotalQuantity(items);
  const subtotal = calculateSubtotal(items);
  const discountAmount = calculateDiscount(subtotal, coupon);
  const finalAmount = Math.max(0, subtotal - discountAmount);

  return {
    totalQuantity,
    subtotal,
    discountAmount,
    finalAmount,
  };
}

/**
 * Kiểm tra và áp dụng mã giảm giá
 */
export function validateCoupon(code: string, subtotal: number): {
  valid: boolean;
  coupon: Coupon | null;
  error: string | null;
} {
  const upperCode = code.trim().toUpperCase();
  const coupon = AVAILABLE_COUPONS[upperCode];

  if (!coupon) {
    return {
      valid: false,
      coupon: null,
      error: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.',
    };
  }

  if (subtotal < coupon.minSpend) {
    const minStr = coupon.minSpend.toLocaleString('vi-VN');
    return {
      valid: false,
      coupon: null,
      error: `Đơn hàng tối thiểu phải từ ${minStr} đ để áp dụng mã ${coupon.code}.`,
    };
  }

  return {
    valid: true,
    coupon,
    error: null,
  };
}

/**
 * Định dạng tiền tệ VND
 */
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('vi-VN')} đ`;
}
