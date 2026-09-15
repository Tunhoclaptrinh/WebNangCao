import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import {
  AVAILABLE_COUPONS,
  applyCoupon,
  clearCart,
  removeCoupon,
} from './cartSlice.ts';

interface CartSummaryProps {
  onCheckout: () => void;
}

export function CartSummary({ onCheckout }: CartSummaryProps) {
  const dispatch = useAppDispatch();
  const {
    totalQuantity,
    subtotal,
    discountAmount,
    finalAmount,
    appliedCoupon,
    couponError,
    items,
  } = useAppSelector((state) => state.cart);

  const [couponInput, setCouponInput] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      dispatch(applyCoupon(couponInput));
      setCouponInput('');
    }
  };

  const handleQuickApply = (code: string) => {
    dispatch(applyCoupon(code));
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="cart-summary-section">
      {/* Khối nhập mã giảm giá */}
      <div className="coupon-box">
        <label className="coupon-title">Mã giảm giá ưu đãi:</label>
        <form onSubmit={handleApply} className="coupon-form">
          <input
            type="text"
            placeholder="Nhập mã (vd: LTWNC10)"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            className="coupon-input"
          />
          <button type="submit" className="btn-coupon-apply">
            Áp dụng
          </button>
        </form>

        {/* Gợi ý mã có sẵn tiện lợi */}
        <div className="coupon-suggestions">
          <span className="sug-label">Gợi ý mã:</span>
          {AVAILABLE_COUPONS.map((c) => (
            <button
              key={c.code}
              type="button"
              className={`sug-chip ${appliedCoupon?.code === c.code ? 'applied' : ''}`}
              onClick={() => handleQuickApply(c.code)}
              title={c.description}
            >
              🏷️ {c.code}
            </button>
          ))}
        </div>

        {/* Thông báo lỗi coupon */}
        {couponError && <div className="coupon-error">⚠️ {couponError}</div>}

        {/* Coupon đang kích hoạt */}
        {appliedCoupon && (
          <div className="applied-coupon-pill">
            <div>
              <span className="applied-code">✅ {appliedCoupon.code}</span>
              <span className="applied-desc">({appliedCoupon.description})</span>
            </div>
            <button
              type="button"
              className="btn-remove-coupon"
              onClick={() => dispatch(removeCoupon())}
              title="Gỡ mã giảm giá"
            >
              ✕ Gỡ
            </button>
          </div>
        )}
      </div>

      {/* Tóm tắt thanh toán */}
      <div className="cost-breakdown">
        <div className="cost-row">
          <span>Tổng số lượng sản phẩm:</span>
          <strong>{totalQuantity} món</strong>
        </div>
        <div className="cost-row">
          <span>Tạm tính:</span>
          <span>{subtotal.toLocaleString('vi-VN')} đ</span>
        </div>
        {discountAmount > 0 && (
          <div className="cost-row discount-row">
            <span>Chiết khấu mã giảm:</span>
            <span>-{discountAmount.toLocaleString('vi-VN')} đ</span>
          </div>
        )}
        <div className="cost-row total-row">
          <span>Tổng thanh toán:</span>
          <span className="total-value">
            {finalAmount.toLocaleString('vi-VN')} đ
          </span>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="cart-action-buttons">
        <button
          type="button"
          className="btn-checkout"
          onClick={onCheckout}
        >
          🚀 Tiến Hành Thanh Toán ({finalAmount.toLocaleString('vi-VN')} đ)
        </button>
        <button
          type="button"
          className="btn-clear-cart"
          onClick={() => dispatch(clearCart())}
        >
          🗑️ Làm trống giỏ hàng
        </button>
      </div>
    </div>
  );
}
