import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, CartState, Coupon } from './cartTypes.ts';

// Danh sách mã coupon hợp lệ trong hệ sinh thái bài tập
export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'LTWNC10',
    description: 'Giảm 10% cho sinh viên môn Web Nâng Cao',
    discountPercent: 10,
    minSpend: 1000000,
  },
  {
    code: 'PTIT200K',
    description: 'Giảm ngay 200.000 đ cho đơn từ 3.000.000 đ',
    discountFixed: 200000,
    minSpend: 3000000,
  },
  {
    code: 'VIP500K',
    description: 'Giảm 500.000 đ cho đơn hàng công nghệ từ 10.000.000 đ',
    discountFixed: 500000,
    minSpend: 10000000,
  },
];

// Hàm trợ giúp tính toán tổng tiền và giảm giá
const calculateCartTotals = (items: CartItem[], coupon: Coupon | null) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (coupon && subtotal >= coupon.minSpend) {
    if (coupon.discountPercent) {
      discountAmount = Math.round((subtotal * coupon.discountPercent) / 100);
    } else if (coupon.discountFixed) {
      discountAmount = Math.min(coupon.discountFixed, subtotal);
    }
  }

  const finalAmount = Math.max(0, subtotal - discountAmount);

  return { totalQuantity, subtotal, discountAmount, finalAmount };
};

const initialState: CartState = {
  items: [
    {
      id: 'prod-02',
      name: 'Bàn phím cơ Keychron Q1 Pro Wireless QMK/VIA',
      price: 4390000,
      originalPrice: 4890000,
      category: 'Bàn phím',
      quantity: 1,
      stock: 8,
      imageColor: 'linear-gradient(135deg, #312e81, #1e1b4b)',
    },
    {
      id: 'prod-03',
      name: 'Chuột Logitech MX Master 3S Ergonomic Wireless',
      price: 2350000,
      originalPrice: 2690000,
      category: 'Chuột',
      quantity: 1,
      stock: 22,
      imageColor: 'linear-gradient(135deg, #14532d, #064e3b)',
    },
  ],
  totalQuantity: 2,
  subtotal: 6740000,
  discountAmount: 0,
  finalAmount: 6740000,
  appliedCoupon: null,
  couponError: null,
  isDrawerOpen: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 1. Thêm sản phẩm vào giỏ
    addItem(state, action: PayloadAction<Omit<CartItem, 'quantity'> & { quantity?: number }>) {
      const { id, quantity = 1 } = action.payload;
      const existing = state.items.find((item) => item.id === id);

      if (existing) {
        // Tối đa không vượt quá số lượng tồn kho
        const newQty = Math.min(existing.stock, existing.quantity + quantity);
        existing.quantity = newQty;
      } else {
        state.items.push({
          ...action.payload,
          quantity: Math.min(action.payload.stock, quantity),
        });
      }

      const totals = calculateCartTotals(state.items, state.appliedCoupon);
      state.totalQuantity = totals.totalQuantity;
      state.subtotal = totals.subtotal;
      state.discountAmount = totals.discountAmount;
      state.finalAmount = totals.finalAmount;

      // Tự mở drawer để người dùng thấy sản phẩm đã được thêm
      state.isDrawerOpen = true;
    },

    // 2. Xóa sản phẩm khỏi giỏ hàng theo ID
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);

      // Nếu giỏ hàng không còn thỏa mãn điều kiện coupon thì hủy coupon
      if (state.appliedCoupon && state.items.reduce((s, i) => s + i.price * i.quantity, 0) < state.appliedCoupon.minSpend) {
        state.appliedCoupon = null;
        state.couponError = 'Mã giảm giá đã bị gỡ do đơn hàng không còn đủ điều kiện tối thiểu.';
      }

      const totals = calculateCartTotals(state.items, state.appliedCoupon);
      state.totalQuantity = totals.totalQuantity;
      state.subtotal = totals.subtotal;
      state.discountAmount = totals.discountAmount;
      state.finalAmount = totals.finalAmount;
    },

    // 3. Cập nhật số lượng sản phẩm trong giỏ
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        const item = state.items.find((item) => item.id === id);
        if (item) {
          item.quantity = Math.min(item.stock, quantity);
        }
      }

      const totals = calculateCartTotals(state.items, state.appliedCoupon);
      state.totalQuantity = totals.totalQuantity;
      state.subtotal = totals.subtotal;
      state.discountAmount = totals.discountAmount;
      state.finalAmount = totals.finalAmount;
    },

    // 4. Xóa toàn bộ sản phẩm trong giỏ
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.subtotal = 0;
      state.discountAmount = 0;
      state.finalAmount = 0;
      state.appliedCoupon = null;
      state.couponError = null;
    },

    // 5. Áp dụng mã giảm giá (Coupon)
    applyCoupon(state, action: PayloadAction<string>) {
      const code = action.payload.trim().toUpperCase();
      const coupon = AVAILABLE_COUPONS.find((c) => c.code === code);

      if (!coupon) {
        state.couponError = `Mã "${code}" không tồn tại hoặc đã hết hạn.`;
        return;
      }

      if (state.subtotal < coupon.minSpend) {
        state.couponError = `Mã "${code}" yêu cầu đơn hàng tối thiểu ${coupon.minSpend.toLocaleString('vi-VN')} đ.`;
        return;
      }

      state.appliedCoupon = coupon;
      state.couponError = null;

      const totals = calculateCartTotals(state.items, coupon);
      state.discountAmount = totals.discountAmount;
      state.finalAmount = totals.finalAmount;
    },

    // 6. Gỡ mã giảm giá
    removeCoupon(state) {
      state.appliedCoupon = null;
      state.couponError = null;
      const totals = calculateCartTotals(state.items, null);
      state.discountAmount = totals.discountAmount;
      state.finalAmount = totals.finalAmount;
    },

    // 7. Bật / Tắt Cart Drawer
    setDrawerOpen(state, action: PayloadAction<boolean>) {
      state.isDrawerOpen = action.payload;
    },
    toggleDrawer(state) {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  setDrawerOpen,
  toggleDrawer,
} = cartSlice.actions;

export default cartSlice.reducer;
