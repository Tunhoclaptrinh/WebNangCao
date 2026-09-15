import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks.ts';
import { clearCart, setDrawerOpen } from '../features/cart/cartSlice.ts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const dispatch = useAppDispatch();
  const { items, finalAmount, totalQuantity, discountAmount, appliedCoupon } =
    useAppSelector((state) => state.cart);

  const [customerName, setCustomerName] = useState('Nguyễn Tiến Tuấn');
  const [phone, setPhone] = useState('0987654321');
  const [address, setAddress] = useState('Học viện Công nghệ Bưu chính Viễn thông - Km10 Trần Phú, Hà Đông');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      dispatch(clearCart());
      dispatch(setDrawerOpen(false));
    }, 500);
  };

  const handleFinish = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 id="modal-title">
            {isSuccess ? '🎉 Đặt Hàng Thành Công!' : '💳 Xác Nhận Thanh Toán Đơn Hàng'}
          </h3>
          <button type="button" className="btn-close-modal" onClick={onClose}>
            ✕
          </button>
        </div>

        {isSuccess ? (
          <div className="modal-success-content">
            <div className="success-icon">✅</div>
            <h4>Cảm ơn bạn đã mua hàng tại DevWorkspace!</h4>
            <p className="success-sub">
              Mã đơn hàng: <strong>#PTIT-{Math.floor(100000 + Math.random() * 900000)}</strong>
            </p>
            <div className="success-summary">
              <p>Khách hàng: <strong>{customerName}</strong> ({phone})</p>
              <p>Địa chỉ nhận hàng: <strong>{address}</strong></p>
              <p>
                Tổng tiền đã thanh toán:{' '}
                <strong className="text-highlight">
                  {finalAmount.toLocaleString('vi-VN')} đ
                </strong>
              </p>
              {appliedCoupon && (
                <p className="coupon-saved">
                  Đã tiết kiệm: {discountAmount.toLocaleString('vi-VN')} đ nhờ mã{' '}
                  <code>{appliedCoupon.code}</code>
                </p>
              )}
            </div>
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={handleFinish}
            >
              Hoàn tất & Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-items-summary">
              <div className="summary-title">Tóm tắt giỏ hàng ({totalQuantity} món):</div>
              <ul className="modal-items-list">
                {items.map((i) => (
                  <li key={i.id} className="modal-item">
                    <span>{i.name} (x{i.quantity})</span>
                    <span>{(i.price * i.quantity).toLocaleString('vi-VN')} đ</span>
                  </li>
                ))}
              </ul>
              <div className="modal-total-line">
                <span>Tổng tiền cần thanh toán:</span>
                <span className="total-accent">{finalAmount.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            <div className="form-group">
              <label>Họ và tên người nhận:</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại:</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Địa chỉ giao hàng:</label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Hủy bỏ
              </button>
              <button type="submit" className="btn btn-primary">
                Xác nhận đặt hàng
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
