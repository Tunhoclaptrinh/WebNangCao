import { useState } from 'react';

export function TechBanner() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="tech-banner">
      <div className="tech-banner-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="tech-banner-title">
          <span className="sparkle-icon">✨</span>
          <span>
            <strong>Kiến Trúc Đồ Án:</strong> Redux Toolkit chuẩn Feature-Based + RTK Query Bonus + Typed Hooks
          </span>
        </div>
        <button type="button" className="btn-toggle-banner">
          {isOpen ? 'Ẩn chi tiết ▲' : 'Xem chi tiết kiến trúc ▼'}
        </button>
      </div>

      {isOpen && (
        <div className="tech-banner-content">
          <div className="tech-grid">
            <div className="tech-item">
              <h4>📦 1. cartSlice (`features/cart/`)</h4>
              <p>
                Quản lý giỏ hàng: <code>addItem</code>, <code>removeItem</code>, <code>updateQuantity</code>,{' '}
                <code>clearCart</code>, <code>applyCoupon</code>. Sử dụng cú pháp Immer mutability an toàn.
              </p>
            </div>
            <div className="tech-item">
              <h4>🌐 2. productsSlice & RTK Query</h4>
              <p>
                Tích hợp song song <code>createAsyncThunk</code> (xử lý 3 trạng thái pending/fulfilled/rejected) và{' '}
                <code>productsApi</code> với <strong>RTK Query</strong> (tự sinh hooks, tự cache dữ liệu, điểm cộng ⭐).
              </p>
            </div>
            <div className="tech-item">
              <h4>🛡️ 3. Typed Hooks (`app/hooks.ts`)</h4>
              <p>
                100% component chỉ dùng <code>useAppDispatch</code> và <code>useAppSelector</code>. Tuyệt đối không dùng{' '}
                <code>any</code> và không import trực tiếp từ thư viện <code>react-redux</code>.
              </p>
            </div>
            <div className="tech-item">
              <h4>🛠️ 4. Redux DevTools Ready</h4>
              <p>
                Bật sẵn qua <code>configureStore()</code>. Giảng viên có thể mở tab Redux DevTools trên Chrome/Edge để xem{' '}
                lịch sử dispatch actions và time-travel debugging.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
