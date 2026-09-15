import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { CartItemRow } from './CartItemRow.tsx';
import { setDrawerOpen } from './cartSlice.ts';
import { CartSummary } from './CartSummary.tsx';

interface CartDrawerProps {
  onCheckout: () => void;
}

export function CartDrawer({ onCheckout }: CartDrawerProps) {
  const dispatch = useAppDispatch();
  const { items, totalQuantity, isDrawerOpen } = useAppSelector(
    (state) => state.cart
  );

  // Đóng drawer khi nhấn ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        dispatch(setDrawerOpen(false));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, dispatch]);

  if (!isDrawerOpen) return null;

  return (
    <div className="cart-drawer-overlay" onClick={() => dispatch(setDrawerOpen(false))}>
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Giỏ hàng mua sắm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Drawer */}
        <div className="drawer-header">
          <div className="drawer-title-box">
            <h3>Giỏ Hàng Của Bạn</h3>
            <span className="drawer-badge">{totalQuantity} món</span>
          </div>
          <button
            type="button"
            className="btn-close-drawer"
            onClick={() => dispatch(setDrawerOpen(false))}
            aria-label="Đóng giỏ hàng"
          >
            ✕
          </button>
        </div>

        {/* Nội dung danh sách sản phẩm trong giỏ */}
        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="empty-cart-view">
              <div className="empty-cart-icon">🛒</div>
              <h4>Giỏ hàng của bạn đang trống</h4>
              <p>Hãy khám phá các sản phẩm công nghệ tuyệt vời và thêm vào giỏ ngay!</p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => dispatch(setDrawerOpen(false))}
              >
                Tiếp tục xem sản phẩm
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer Drawer: Tóm tắt & Thanh toán */}
        {items.length > 0 && (
          <div className="drawer-footer">
            <CartSummary onCheckout={onCheckout} />
          </div>
        )}
      </aside>
    </div>
  );
}
