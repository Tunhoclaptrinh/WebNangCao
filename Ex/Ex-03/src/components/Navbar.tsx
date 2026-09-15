import { useAppDispatch, useAppSelector } from '../app/hooks.ts';
import { toggleDrawer } from '../features/cart/cartSlice.ts';

interface NavbarProps {
  dataSource: 'thunk' | 'rtk-query';
  setDataSource: (source: 'thunk' | 'rtk-query') => void;
}

export function Navbar({ dataSource, setDataSource }: NavbarProps) {
  const dispatch = useAppDispatch();
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);
  const finalAmount = useAppSelector((state) => state.cart.finalAmount);

  return (
    <header className="site-navbar">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <div className="navbar-brand">
          <div className="brand-logo">RTK</div>
          <div>
            <div className="brand-name">DevWorkspace Store</div>
            <div className="brand-badge">LTWNC Ex-03 • Redux Toolkit Feature-Based</div>
          </div>
        </div>

        {/* Thông tin sinh viên & Chế độ Data */}
        <div className="navbar-center">
          <div className="student-chip">
            <span className="dot online"></span>
            <span>SV: <strong>Nguyễn Tiến Tuấn</strong> (MSV: <code>B23DCCC173</code>)</span>
          </div>

          <div className="data-mode-toggle">
            <button
              type="button"
              className={`mode-btn ${dataSource === 'thunk' ? 'active' : ''}`}
              onClick={() => setDataSource('thunk')}
              title="Sử dụng createAsyncThunk"
            >
              Thunk
            </button>
            <button
              type="button"
              className={`mode-btn ${dataSource === 'rtk-query' ? 'active bonus' : ''}`}
              onClick={() => setDataSource('rtk-query')}
              title="Sử dụng RTK Query (Bonus điểm cộng)"
            >
              RTK Query ⭐
            </button>
          </div>
        </div>

        {/* Nút Giỏ Hàng mở Drawer */}
        <div className="navbar-actions">
          <button
            type="button"
            className="btn-cart-nav"
            onClick={() => dispatch(toggleDrawer())}
            aria-label="Xem giỏ hàng"
          >
            <span className="nav-cart-icon">🛒</span>
            <div className="nav-cart-text">
              <span className="nav-cart-label">Giỏ hàng</span>
              <span className="nav-cart-price">
                {finalAmount > 0 ? `${finalAmount.toLocaleString('vi-VN')} đ` : '0 đ'}
              </span>
            </div>
            {totalQuantity > 0 && (
              <span className="nav-cart-badge">{totalQuantity}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
